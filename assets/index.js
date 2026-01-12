// Simple page loader implementation
window.addEventListener('load', function() {
  const pageLoader = document.getElementById('pageLoader');
  
  // Only show loader on first visit
  if (!sessionStorage.getItem('ousadiaFirstLoad')) {
    sessionStorage.setItem('ousadiaFirstLoad', 'true');
    
    if (pageLoader) {
      // Hide loader after 1 second
      setTimeout(function() {
        pageLoader.classList.add('hidden');
        
        // Remove from DOM after animation
        setTimeout(function() {
          if (pageLoader && pageLoader.parentNode) {
            pageLoader.remove();
          }
        }, 500);
      }, 1000);
    }
  } else {
    // Remove loader immediately if not first visit
    if (pageLoader) {
      pageLoader.remove();
    }
  }
});

// Initialize everything after DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Initialize AOS (Animate on Scroll)
  initAOS();
  
  // Initialize navigation
  initNavigation();
  
  // Initialize scroll effects
  initScrollEffects();
  
  // Initialize smooth scrolling
  initSmoothScrolling();
  
  // Initialize contact form
  initContactForm();
  
  // Initialize flip cards
  initFlipCards();
  
  // Initialize enquire buttons (only on services page)
  if (document.querySelector('.enquire-btn')) {
    initEnquireButtons();
  }
  
  // Initialize contact form auto-fill (only on contact page)
  if (document.getElementById('contactForm')) {
    initContactFormAutoFill();
  }
  
  // Initialize floating dark mode toggle
  initFloatingDarkToggle();
  
  // Initialize dark mode
  initDarkMode();
  
  // Initialize clients carousel (only on home page)
  if (document.getElementById('clientsTrack')) {
    initClientsCarousel();
  }
});

// AOS Initialization
function initAOS() {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-in-out',
      offset: 100,
    });
  }
}

// Navigation Functions
function initNavigation() {
  const navbar = document.querySelector('.navbar');
  const toggleBtn = document.querySelector('.toggle-btn');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  
  // Navbar scroll effect
  if (navbar) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }
  
  // Mobile navigation toggle
  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      toggleBtn.innerHTML = navMenu.classList.contains('active') 
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-bars"></i>';
    });
  }
  
  // Close mobile menu when clicking on nav links
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (navMenu) {
        navMenu.classList.remove('active');
      }
      if (toggleBtn) {
        toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
      }
    });
  });
}

function initScrollEffects() {
  const backToTopButton = document.getElementById('backToTop');
  
  if (backToTopButton) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 300) {
        backToTopButton.classList.add('show');
      } else {
        backToTopButton.classList.remove('show');
      }
    });
    
    // Back to Top functionality
    backToTopButton.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

// Smooth Scrolling
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
}

// Contact Form Handling - Enhanced with PHP Backend Integration
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const formStatus = document.getElementById('formStatus');
  const successModal = document.getElementById('successModal');
  const closeModalBtn = document.getElementById('closeModal');
  
  if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Clear previous status messages
      if (formStatus) {
        formStatus.textContent = '';
        formStatus.className = 'form-status';
      }
      
      // Hide all error messages
      document.querySelectorAll('.error-message').forEach(err => {
        err.style.display = 'none';
      });
      
      // Get form data
      const formData = new FormData(contactForm);
      
      // Validate form
      let isValid = true;
      const name = formData.get('name') ? formData.get('name').trim() : '';
      const email = formData.get('email') ? formData.get('email').trim() : '';
      const subject = formData.get('subject') ? formData.get('subject').trim() : '';
      const message = formData.get('message') ? formData.get('message').trim() : '';
      
      if (!name) {
        const nameError = document.getElementById('nameError');
        if (nameError) nameError.style.display = 'block';
        isValid = false;
      }
      
      if (!email || !isValidEmail(email)) {
        const emailError = document.getElementById('emailError');
        if (emailError) emailError.style.display = 'block';
        isValid = false;
      }
      
      if (!subject) {
        const subjectError = document.getElementById('subjectError');
        if (subjectError) subjectError.style.display = 'block';
        isValid = false;
      }
      
      if (!message) {
        const messageError = document.getElementById('messageError');
        if (messageError) messageError.style.display = 'block';
        isValid = false;
      }
      
      if (!isValid) {
        if (formStatus) {
          formStatus.textContent = 'Please fill in all required fields correctly.';
          formStatus.className = 'form-status error';
        }
        return;
      }
      
      // Show loading state
      if (submitBtn) {
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');
        
        submitBtn.disabled = true;
        if (btnText) btnText.style.display = 'none';
        if (btnLoader) btnLoader.style.display = 'inline-block';
      }
      
      try {
        // Submit form via AJAX to PHP backend
        const response = await fetch('send-email.php', {
          method: 'POST',
          body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
          // Show success message
          if (formStatus) {
            formStatus.textContent = result.message;
            formStatus.className = 'form-status success';
          }
          
          // Reset form
          contactForm.reset();
          
          // Show success modal
          if (successModal) {
            const modalText = successModal.querySelector('.modal-text');
            if (modalText && result.message) {
              modalText.textContent = result.message;
            }
            successModal.style.display = 'flex';
            
            // Auto-close modal after 5 seconds
            setTimeout(() => {
              successModal.style.display = 'none';
            }, 5000);
          }
          
        } else {
          // Show error message
          if (formStatus) {
            formStatus.textContent = result.message;
            formStatus.className = 'form-status error';
            
            // Show specific field errors if available
            if (result.errors && Array.isArray(result.errors)) {
              const errorList = result.errors.join(', ');
              formStatus.textContent += ' ' + errorList;
            }
          }
        }
        
      } catch (error) {
        console.error('Form submission error:', error);
        if (formStatus) {
          formStatus.textContent = 'Sorry, there was an error sending your message. Please try again or contact us directly at info@ousadiaconsulting.com';
          formStatus.className = 'form-status error';
        }
      } finally {
        // Re-enable button
        if (submitBtn) {
          const btnText = submitBtn.querySelector('.btn-text');
          const btnLoader = submitBtn.querySelector('.btn-loader');
          
          submitBtn.disabled = false;
          if (btnText) btnText.style.display = 'inline';
          if (btnLoader) btnLoader.style.display = 'none';
        }
        
        // Scroll to status message
        if (formStatus) {
          formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    });
  }
  
  // Close modal handler
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', function() {
      if (successModal) {
        successModal.style.display = 'none';
      }
    });
  }
  
  // Close modal when clicking outside
  if (successModal) {
    successModal.addEventListener('click', function(e) {
      if (e.target === successModal) {
        successModal.style.display = 'none';
      }
    });
  }
}

// Display field errors from PHP response
function displayFieldErrors(errors) {
  // Reset all error messages first
  document.querySelectorAll('.error-message').forEach(error => {
    error.style.display = 'none';
  });
  
  // Map PHP error messages to form fields
  errors.forEach(error => {
    if (error.includes('Name')) {
      const nameError = document.getElementById('nameError');
      if (nameError) {
        nameError.textContent = error;
        nameError.style.display = 'block';
      }
    } else if (error.includes('Email') || error.includes('email')) {
      const emailError = document.getElementById('emailError');
      if (emailError) {
        emailError.textContent = error;
        emailError.style.display = 'block';
      }
    } else if (error.includes('Subject')) {
      const subjectError = document.getElementById('subjectError');
      if (subjectError) {
        subjectError.textContent = error;
        subjectError.style.display = 'block';
      }
    } else if (error.includes('Message')) {
      const messageError = document.getElementById('messageError');
      if (messageError) {
        messageError.textContent = error;
        messageError.style.display = 'block';
      }
    }
  });
}

// Contact Form Validation
function validateContactForm() {
  let isValid = true;
  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const subject = document.getElementById('subject');
  const message = document.getElementById('message');
  
  // Reset error messages
  document.querySelectorAll('.error-message').forEach(error => {
    error.style.display = 'none';
  });
  
  // Validate name
  if (!name || name.value.trim() === '') {
    const nameError = document.getElementById('nameError');
    if (nameError) nameError.style.display = 'block';
    isValid = false;
  }
  
  // Validate email
  if (!email || email.value.trim() === '' || !isValidEmail(email.value)) {
    const emailError = document.getElementById('emailError');
    if (emailError) emailError.style.display = 'block';
    isValid = false;
  }
  
  // Validate subject
  if (!subject || subject.value.trim() === '') {
    const subjectError = document.getElementById('subjectError');
    if (subjectError) subjectError.style.display = 'block';
    isValid = false;
  }
  
  // Validate message
  if (!message || message.value.trim() === '') {
    const messageError = document.getElementById('messageError');
    if (messageError) messageError.style.display = 'block';
    isValid = false;
  }
  
  return isValid;
}

// Email validation helper
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Flip Card Functionality
function initFlipCards() {
  const flipCards = document.querySelectorAll('.flip-card');
  
  flipCards.forEach(card => {
    const flipBtns = card.querySelectorAll('.flip-card-btn:not(.enquire-btn)');
    const viewLessBtns = card.querySelectorAll('.view-less-btn');
    
    // Handle flip buttons (excluding enquire buttons)
    flipBtns.forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Toggle the flipped class
        card.classList.toggle('flipped');
      });
    });
    
    // Handle view less buttons specifically
    viewLessBtns.forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Remove the flipped class
        card.classList.remove('flipped');
      });
    });
  });
}

// Enquire Button Functionality
function initEnquireButtons() {
  const enquireButtons = document.querySelectorAll('.enquire-btn');
  
  enquireButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      // Get the service name from data attribute or card title
      const serviceName = this.getAttribute('data-service') || 
                         this.closest('.flip-card-back').querySelector('.flip-card-title').textContent;
      
      // Store the service name in sessionStorage
      sessionStorage.setItem('selectedService', serviceName);
      
      // Redirect to contact page
      window.location.href = 'contact.html';
    });
  });
}

// Contact Form Auto-fill Functionality
function initContactFormAutoFill() {
  const contactForm = document.getElementById('contactForm');
  const subjectInput = document.getElementById('subject');
  
  // Check if we have a stored service from the enquire button
  const selectedService = sessionStorage.getItem('selectedService');
  
  if (selectedService && subjectInput) {
    subjectInput.value = `Enquiry about ${selectedService}`;
    
    // Clear the stored service after use
    sessionStorage.removeItem('selectedService');
    
    // Optional: Scroll to the contact form
    setTimeout(() => {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 500);
  }
}

// Floating Dark Mode Toggle Functionality
function initFloatingDarkToggle() {
  const floatingDarkToggle = document.getElementById('floatingDarkToggle');
  
  if (floatingDarkToggle) {
    floatingDarkToggle.addEventListener('click', function(e) {
      e.preventDefault();
      toggleDarkMode();
    });
  }
}

// Dark Mode Toggle Functionality
function initDarkMode() {
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Check for saved theme or preferred scheme
  const currentTheme = localStorage.getItem('theme');
  if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
    document.documentElement.setAttribute('data-theme', 'dark');
    updateDarkModeToggle(true);
  } else {
    updateDarkModeToggle(false);
  }
  
  // Listen for system theme changes
  prefersDarkScheme.addEventListener('change', function(e) {
    if (!localStorage.getItem('theme')) {
      if (e.matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
        updateDarkModeToggle(true);
      } else {
        document.documentElement.removeAttribute('data-theme');
        updateDarkModeToggle(false);
      }
    }
  });
}

// Toggle Dark Mode
function toggleDarkMode() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  let theme = 'light';
  
  if (currentTheme === 'dark') {
    theme = 'light';
    document.documentElement.removeAttribute('data-theme');
    updateDarkModeToggle(false);
  } else {
    theme = 'dark';
    document.documentElement.setAttribute('data-theme', 'dark');
    updateDarkModeToggle(true);
  }
  
  localStorage.setItem('theme', theme);
  
  // Refresh AOS animations to ensure they work properly after theme change
  if (typeof AOS !== 'undefined') {
    setTimeout(() => {
      AOS.refresh();
    }, 300);
  }
}

// Update dark mode toggle appearance
function updateDarkModeToggle(isDark) {
  const floatingDarkToggle = document.getElementById('floatingDarkToggle');
  if (floatingDarkToggle) {
    if (isDark) {
      floatingDarkToggle.setAttribute('aria-label', 'Switch to light mode');
      floatingDarkToggle.setAttribute('title', 'Switch to light mode');
    } else {
      floatingDarkToggle.setAttribute('aria-label', 'Switch to dark mode');
      floatingDarkToggle.setAttribute('title', 'Switch to dark mode');
    }
  }
}

// Clients Carousel Functionality
function initClientsCarousel() {
  const clientsTrack = document.getElementById('clientsTrack');
  
  if (!clientsTrack) return;
  
  // Get the total width of all client logos
  const clientItems = clientsTrack.querySelectorAll('.client-logo-item');
  const itemWidth = clientItems[0] ? clientItems[0].offsetWidth : 150;
  const totalWidth = itemWidth * clientItems.length;
  
  // Set the track width to accommodate all items
  clientsTrack.style.width = totalWidth + 'px';
  
  // Animation function
  let animationId;
  let position = 0;
  const speed = 1; // Pixels per frame (adjust for speed)
  
  function animateCarousel() {
    position -= speed;
    
    // Reset position when we've scrolled through one set
    if (Math.abs(position) >= itemWidth * 9) { // 9 is the number of unique clients
      position = 0;
    }
    
    clientsTrack.style.transform = `translateX(${position}px)`;
    animationId = requestAnimationFrame(animateCarousel);
  }
  
  // Start animation
  animateCarousel();
  
  // Pause animation on hover
  const carouselContainer = document.querySelector('.clients-carousel-container');
  if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', () => {
      cancelAnimationFrame(animationId);
    });
    
    carouselContainer.addEventListener('mouseleave', () => {
      animationId = requestAnimationFrame(animateCarousel);
    });
  }
  
  // Clean up animation on page unload
  window.addEventListener('beforeunload', () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  });
}

// Utility function to handle form submission feedback
function showFormFeedback(message, isSuccess = true) {
  // Create feedback element if it doesn't exist
  let feedbackEl = document.getElementById('formFeedback');
  if (!feedbackEl) {
    feedbackEl = document.createElement('div');
    feedbackEl.id = 'formFeedback';
    feedbackEl.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 5px;
      color: white;
      z-index: 9999;
      font-weight: bold;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transition: transform 0.3s ease, opacity 0.3s ease;
    `;
    document.body.appendChild(feedbackEl);
  }
  
  // Set message and style
  feedbackEl.textContent = message;
  feedbackEl.style.backgroundColor = isSuccess ? '#4CAF50' : '#F44336';
  feedbackEl.style.transform = 'translateX(0)';
  feedbackEl.style.opacity = '1';
  
  // Hide after 5 seconds
  setTimeout(() => {
    feedbackEl.style.transform = 'translateX(100%)';
    feedbackEl.style.opacity = '0';
  }, 5000);
}