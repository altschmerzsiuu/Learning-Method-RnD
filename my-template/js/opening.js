/* ============================================
   Opening Page JavaScript - xplay
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
  
  // ===== SCROLL ANIMATIONS FOR OPENING PAGE =====
  const sections = document.querySelectorAll('.opening__section');
  
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.2
  };

  const sectionObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        
        // Animate children with staggered delay
        const animatedElements = entry.target.querySelectorAll('.opening__feature, .opening__step, .opening__text-block p');
        animatedElements.forEach(function(el, index) {
          el.style.opacity = '0';
          el.style.transform = 'translateY(30px)';
          el.style.transition = 'all 0.6s ease';
          el.style.transitionDelay = (index * 0.1) + 's';
          
          setTimeout(function() {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          }, 100);
        });
      }
    });
  }, observerOptions);

  sections.forEach(function(section) {
    sectionObserver.observe(section);
  });

  // ===== PARALLAX EFFECT ON DECORATIONS =====
  const decorations = document.querySelectorAll('.opening__decoration');
  
  window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    
    decorations.forEach(function(decoration, index) {
      const speed = 0.1 + (index * 0.05);
      const yPos = scrolled * speed;
      decoration.style.transform = 'translateY(' + yPos + 'px)';
    });
  });

  // ===== SMOOTH SCROLL HINT CLICK =====
  const scrollHint = document.querySelector('.opening__scroll-hint');
  
  if (scrollHint) {
    scrollHint.addEventListener('click', function() {
      const nextSection = document.querySelector('.opening__about');
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
    
    scrollHint.style.cursor = 'pointer';
  }

  // ===== HIDE SCROLL HINT ON SCROLL =====
  window.addEventListener('scroll', function() {
    if (scrollHint && window.pageYOffset > 100) {
      scrollHint.style.opacity = '0';
      scrollHint.style.transition = 'opacity 0.3s ease';
    } else if (scrollHint) {
      scrollHint.style.opacity = '1';
    }
  });

  // ===== SCROLL UNLOCK ON 'KENALI XPLAY' CLICK =====
  // ===== SCROLL TO ABOUT ON 'KENALI XPLAY' CLICK =====
  const exploreBtn = document.getElementById('btn-explore');
  if (exploreBtn) {
    exploreBtn.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetSection = document.querySelector('#about');
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  console.log('🎮 xplay Opening Page Loaded!');
});
