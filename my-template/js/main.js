/* ============================================
   Main JavaScript - xplay
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
  
  // ===== SPLASH SCREEN =====
  const splash = document.getElementById('splash');
  
  if (splash) {
    // Check if this is the first visit
    const hasVisited = sessionStorage.getItem('xplay_visited');
    
    if (hasVisited) {
      // Already visited, hide splash immediately
      splash.classList.add('hidden');
    } else {
      // First visit, show splash with typewriter then hide
      setTimeout(function() {
        splash.classList.add('hidden');
        sessionStorage.setItem('xplay_visited', 'true');
      }, 2500); // 1.5s typewriter + 1s delay
    }
  }

  // ===== MOBILE MENU =====
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function() {
      this.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      document.body.classList.toggle('no-scroll');
    });

    // Close menu when clicking a link
    const mobileLinks = mobileMenu.querySelectorAll('.mobile-menu__link');
    mobileLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        menuToggle.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.classList.remove('no-scroll');
      });
    });
  }

  // ===== HEADER SCROLL EFFECT =====
  const header = document.getElementById('header');
  
  if (header) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }
    });
  }

  // ===== SCROLL ANIMATIONS =====
  const scrollElements = document.querySelectorAll('.scroll-animate');
  
  const elementInView = function(el, offset = 100) {
    const elementTop = el.getBoundingClientRect().top;
    return elementTop <= (window.innerHeight || document.documentElement.clientHeight) - offset;
  };

  const displayScrollElement = function(element) {
    element.classList.add('visible');
  };

  const handleScrollAnimation = function() {
    scrollElements.forEach(function(el) {
      if (elementInView(el, 100)) {
        displayScrollElement(el);
      }
    });
  };

  // Initial check
  handleScrollAnimation();
  
  // On scroll
  window.addEventListener('scroll', function() {
    handleScrollAnimation();
  });

  // ===== SMOOTH SCROLL =====
  const scrollLinks = document.querySelectorAll('a[href^="#"]');
  
  scrollLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      if (href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
          const headerHeight = header ? header.offsetHeight : 0;
          const targetPosition = target.offsetTop - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // ===== ACTIVE NAV LINK =====
  const navLinks = document.querySelectorAll('.nav__link');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  navLinks.forEach(function(link) {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // ===== TABS (for Materi page) =====
  const tabs = document.querySelectorAll('.tab');
  
  if (tabs.length > 0) {
    tabs.forEach(function(tab) {
      tab.addEventListener('click', function() {
        // Remove active from all tabs
        tabs.forEach(t => t.classList.remove('active'));
        // Add active to clicked tab
        this.classList.add('active');
        
        // Scroll to target section
        const target = this.getAttribute('data-target');
        const targetSection = document.getElementById(target);
        
        if (targetSection) {
          const headerHeight = header ? header.offsetHeight : 0;
          const targetPosition = targetSection.offsetTop - headerHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  console.log('🎮 xplay loaded!');
});
