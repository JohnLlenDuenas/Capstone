const express = require('express');
const path = require('path');
const crypto = require('crypto');
const session = require('express-session');
const mongoose = require('mongoose');
const Student = require('./models/Student');
const ConsentForm = require('./models/ConsentForm');

const app = express();
const port = 3000;

const uri = "mongodb://localhost:27017/EYBMS_DB";

mongoose.connect(uri).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB', err);
});

app.use(express.json());


app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});



function getCurrentDateTime() {
  const now = new Date();
  const date = now.toLocaleDateString();
  const time = now.toLocaleTimeString();
  return `${date} ${time}`;
}

app.post('/consent-fill', async (req, res) => {
  const dateTime = getCurrentDateTime();
  const { student_Number, student_Name, gradeSection, parentguardian_name, relationship, contactno, formStatus } = req.body;

  try {
    const student = await Student.findOne({ studentNumber: student_Number });
    if (!student) {
      return res.status(400).json({ message: 'Student not found' });
    }

    const existingConsentForm = await ConsentForm.findOne({ student_Number });
    if (existingConsentForm) {
      return res.status(400).json({ message: 'Consent form for this student already exists' });
    }

    const consentFormData = new ConsentForm({
      student_Number,
      student_Name,
      gradeSection: gradeSection,
      parentGuardian_Name: parentguardian_name,
      relationship,
      contactNo: contactno,
      form_Status: formStatus,
      date_and_Time_Filled: dateTime
    });

    await consentFormData.save();

    res.status(201).json({ message: 'Consent filled successfully' });
  } catch (error) {
    console.error("Error saving consent form:", error);
    res.status(500).json({ message: 'Error saving consent form' });
  }
});

app.post('/create-account', async (req, res) => {
  const { studentNumber, email, password, accountType } = req.body;

  try {
    const iv = crypto.randomBytes(16);
    const encryptionKey = crypto.randomBytes(32);
    const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, iv);
    let encryptedPassword = cipher.update(password, 'utf8', 'hex');
    encryptedPassword += cipher.final('hex');

    const newUser = new Student({
      studentNumber,
      email,
      password: encryptedPassword,
      accountType,
      iv: iv.toString('hex'),
      key: encryptionKey.toString('hex')
    });
    await newUser.save();
    res.status(201).json({ message: 'Account created successfully' });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Account with this student number already exists' });
    } else {
      console.error("Error creating account:", error);
      res.status(500).json({ message: 'Error creating account' });
    }
  }
});

app.post('/loginroute', async (req, res) => {
  const { studentNumber, password } = req.body;

  try {
    const user = await Student.findOne({ studentNumber });

    if (!user) {
      return res.status(400).json({ message: 'Invalid student number or password' });
    }

    const iv = Buffer.from(user.iv, 'hex');
    const key = Buffer.from(user.key, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decryptedPassword = decipher.update(user.password, 'hex', 'utf8');
    decryptedPassword += decipher.final('utf8');

    if (decryptedPassword === password) {
      req.session.user = user;

      let redirectUrl = '';
      if (user.accountType === 'student') {
        redirectUrl = '../consent/index.html';
      } else if (user.accountType === 'admin') {
        redirectUrl = '../admin/index.html';
      }

      res.status(200).json({ message: 'Login successful', redirectUrl:redirectUrl });
    } else {
      res.status(400).json({ message: 'Invalid student number or password' });
    }
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: 'Error logging in' });
  }
});



app.get('/consentformfetch', async (req, res) => {
  try {
      const consentForms = await ConsentForm.find();
      res.json(consentForms);
  } catch (err) {
      res.status(500).json({ error: 'Failed to fetch consent forms' });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
