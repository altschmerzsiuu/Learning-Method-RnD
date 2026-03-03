/* ============================================
   Dial Background Controller - xplay Opening Page
   ============================================
   
   This script creates an interactive dial that controls
   background image scrolling through mouse rotation.
   Similar to wearebreakfast.com dial interaction.
*/

(function() {
  'use strict';
  
  // Wait for DOM
  document.addEventListener('DOMContentLoaded', function() {
    initDialController();
  });
  
  function initDialController() {
    const dial = document.getElementById('dialController');
    const dialImage = document.getElementById('dialImage');
    const bgContainer = document.getElementById('bgContainer');
    const heroSection = document.getElementById('openingHero');
    
    // Exit if elements not found (not on opening page)
    if (!dial || !dialImage || !bgContainer) return;
    
    // State
    let isDragging = false;
    let currentRotation = 0;
    let backgroundOffset = 0;
    let lastAngle = 0;
    let dialCenter = { x: 0, y: 0 };
    
    // Configuration
    const config = {
      sensitivity: 0.5,        // How much background moves per degree
      maxOffset: 50,           // Max background offset percentage
      minOffset: 0,            // Min background offset percentage
      smoothing: 0.15,         // Easing for smooth animation
      momentumDecay: 0.95,     // How fast momentum decays
      maxRotation: 90,         // Max rotation (right) in degrees
      minRotation: -90         // Min rotation (left) in degrees
    };
    
    // Momentum for smooth feel
    let momentum = 0;
    let targetRotation = 0;
    let animationFrame = null;
    
    // Calculate dial center
    function updateDialCenter() {
      const rect = dialImage.getBoundingClientRect();
      dialCenter.x = rect.left + rect.width / 2;
      dialCenter.y = rect.top + rect.height / 2;
    }
    
    // Get angle from mouse position to dial center
    function getAngle(clientX, clientY) {
      const dx = clientX - dialCenter.x;
      const dy = clientY - dialCenter.y;
      return Math.atan2(dy, dx) * (180 / Math.PI);
    }
    
    // Start dragging
    function startDrag(e) {
      if (document.body.classList.contains('no-scroll') === false && window.scrollY > 100) return; // Disable if scrolled down

      isDragging = true;
      dial.classList.add('dragging');
      updateDialCenter();
      
      // Get initial angle
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      lastAngle = getAngle(clientX, clientY);
      
      // Stop momentum
      momentum = 0;
      
      e.preventDefault();
    }
    
    // During drag
    function onDrag(e) {
      if (!isDragging) return;
      
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      
      const currentAngle = getAngle(clientX, clientY);
      let deltaAngle = currentAngle - lastAngle;
      
      // Handle wrap-around (when crossing 180/-180 boundary)
      if (deltaAngle > 180) deltaAngle -= 360;
      if (deltaAngle < -180) deltaAngle += 360;
      
      // Update rotation with limits
      currentRotation += deltaAngle;
      currentRotation = Math.max(config.minRotation, Math.min(config.maxRotation, currentRotation));
      targetRotation = currentRotation;
      
      // Calculate momentum
      momentum = deltaAngle * 0.3;
      
      // Update background offset based on rotation
      backgroundOffset -= deltaAngle * config.sensitivity;
      backgroundOffset = Math.max(config.minOffset, Math.min(config.maxOffset, backgroundOffset));
      
      // Apply transforms
      applyTransforms();
      
      lastAngle = currentAngle;
      e.preventDefault();
    }
    
    // Stop dragging
    function stopDrag() {
      if (!isDragging) return;
      isDragging = false;
      dial.classList.remove('dragging');
      
      // Start momentum animation
      if (Math.abs(momentum) > 0.5) {
        animateMomentum();
      }
    }
    
    // Momentum animation for smooth deceleration
    function animateMomentum() {
      if (Math.abs(momentum) < 0.1) {
        momentum = 0;
        return;
      }
      
      // Apply momentum with limits
      currentRotation += momentum;
      currentRotation = Math.max(config.minRotation, Math.min(config.maxRotation, currentRotation));
      targetRotation = currentRotation;
      
      // Stop momentum if hitting limits
      if (currentRotation === config.minRotation || currentRotation === config.maxRotation) {
        momentum = 0;
        return;
      }
      
      // Update background
      backgroundOffset -= momentum * config.sensitivity;
      backgroundOffset = Math.max(config.minOffset, Math.min(config.maxOffset, backgroundOffset));
      
      // Decay momentum
      momentum *= config.momentumDecay;
      
      // Apply transforms
      applyTransforms();
      
      // Continue animation
      animationFrame = requestAnimationFrame(animateMomentum);
    }
    
    // Apply visual transforms
    function applyTransforms() {
      // Rotate dial
      dialImage.style.transform = `rotate(${currentRotation}deg)`;
      
      // Move background
      bgContainer.style.transform = `translateX(-${backgroundOffset}%)`;
    }
    
    // Show/hide dial based on scroll position
    // Show/hide dial based on scroll position - STRICT
    function handleScroll() {
      // Hide immediately if scrolled down even a little bit
      if (window.scrollY > 50) {
        dial.classList.add('hidden');
        dial.style.pointerEvents = 'none'; // Ensure no interaction
        dial.style.opacity = '0';
      } else {
        dial.classList.remove('hidden');
        dial.style.pointerEvents = 'auto';
        dial.style.opacity = '1';
      }
    }
    
    // Event listeners - Mouse
    dialImage.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', stopDrag);
    
    // Event listeners - Touch
    dialImage.addEventListener('touchstart', startDrag, { passive: false });
    document.addEventListener('touchmove', onDrag, { passive: false });
    document.addEventListener('touchend', stopDrag);
    
    // Scroll visibility
    window.addEventListener('scroll', handleScroll);
    
    // Recalculate center on resize
    window.addEventListener('resize', updateDialCenter);
    
    // Initial setup
    updateDialCenter();
    handleScroll();
    
    console.log('🎛️ Dial controller initialized!');
  }
})();
