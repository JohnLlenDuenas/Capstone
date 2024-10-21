(function() {
  "use strict";

  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }


  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

 
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }


  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  const scrollto = (el) => {
    let header = select('#header')
    let offset = header.offsetHeight

    if (!header.classList.contains('header-scrolled')) {
      offset -= 16
    }

    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos - offset,
      behavior: 'smooth'
    })
  }

  /**
   * Toggle .header-scrolled class to #header when page is scrolled
   */
  let selectHeader = select('#header')
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) {
        selectHeader.classList.add('header-scrolled')
      } else {
        selectHeader.classList.remove('header-scrolled')
      }
    }
    window.addEventListener('load', headerScrolled)
    onscroll(document, headerScrolled)
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
    select('#navbar').classList.toggle('navbar-mobile')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  /**
   * Mobile nav dropdowns activate
   */
  on('click', '.navbar .dropdown > a', function(e) {
    if (select('#navbar').classList.contains('navbar-mobile')) {
      e.preventDefault()
      this.nextElementSibling.classList.toggle('dropdown-active')
    }
  }, true)

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault()

      let navbar = select('#navbar')
      if (navbar.classList.contains('navbar-mobile')) {
        navbar.classList.remove('navbar-mobile')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }
      scrollto(this.hash)
    }
  }, true)

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });

  /**
   * Intro type effect
   */
  const typed = select('.typed')
  if (typed) {
    let typed_strings = typed.getAttribute('data-typed-items')
    typed_strings = typed_strings.split(',')
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 75,
      backSpeed: 0,
      backDelay: 2000
    });
  }

  /**
   * Initiate portfolio lightbox 
   */
  const portfolioLightbox = GLightbox({
    selector: '.portfolio-lightbox'
  });

  /**
   * Testimonials slider
   */
  new Swiper('.testimonials-slider', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });

  /**
   * Portfolio details slider
   */
  new Swiper('.portfolio-details-slider', {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });

  /**
   * Preloader
   */
  let preloader = select('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove()
    });
  }
  

// Get references to elements
const musicPlayer = document.getElementById('music-player');
const musicTitle = document.getElementById('music-title');
const musicPicture = document.getElementById('music-picture');
const playPauseButton = document.getElementById('play-pause');
const previousButton = document.getElementById('previous');
const nextButton = document.getElementById('next');

// Define your music data
const songs = [
  {
    title: 'You got it All',
    picture: 'https://johnllenduenas.github.io/main/songs/song6.jpg',
    audio: 'https://johnllenduenas.github.io/main/songs/song6.mp3'
  },
  {
    title: 'B.A.D.',
    picture: 'songs/song1.jpg',
    audio: 'songs/song1.mp3'
  },
  {
    title: 'Take Da Charge',
    picture: 'https://johnllenduenas.github.io/main/songs/song2.jpg',
    audio: 'https://johnllenduenas.github.io/main/songs/song2.mp3'
  },
  {
    title: 'No Sleep',
    picture: 'https://johnllenduenas.github.io/main/songs/song3.jpg',
    audio: 'https://johnllenduenas.github.io/main/songs/song3.mp3'
  },
  {
    title: 'Cold Heart',
    picture: 'https://johnllenduenas.github.io/main/songs/song4.jpg',
    audio: 'https://johnllenduenas.github.io/main/songs/song4.mp3'
  },
  {
    title: 'No Man',
    picture: 'https://johnllenduenas.github.io/main/songs/song5.jpg',
    audio: 'https://johnllenduenas.github.io/main/songs/song5.mp3'
  },
  {
    title: 'Easy',
    picture: 'https://johnllenduenas.github.io/main/songs/song7.jpg',
    audio: 'https://johnllenduenas.github.io/main/songs/song7.mp3'
  },
];

let currentSongIndex = 0;
let isPlaying = false;
let audio = new Audio();

// Initialize the player with the first song
initPlayer();

// Function to initialize the music player with the current song
function initPlayer() {
  musicTitle.textContent = songs[currentSongIndex].title;
  musicPicture.src = songs[currentSongIndex].picture;
  audio.src = songs[currentSongIndex].audio;
}

// Function to play or pause the audio
function togglePlayPause() {
  if (isPlaying) {
    audio.pause();
  } else {
    audio.play();
  }
  isPlaying = !isPlaying;
  updatePlayPauseButton();
}

// Function to update the play/pause button icon


// Function to play the previous song
function playPreviousSong() {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  initPlayer();
  if (isPlaying) {
    audio.play();
  }
}

// Function to play the next song
function playNextSong() {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  initPlayer();
  if (isPlaying) {
    audio.play();
  }
}

// Event listeners for buttons
playPauseButton.addEventListener('click', togglePlayPause);
previousButton.addEventListener('click', playPreviousSong);
nextButton.addEventListener('click', playNextSong);

// Event listener to toggle play/pause when audio ends
audio.addEventListener('ended', () => {
  isPlaying = false;
  updatePlayPauseButton();
});

  
})()


