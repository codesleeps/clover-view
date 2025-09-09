function toggleMenu() {
  const navMenu = document.querySelector(".nav-menu");
  const hamburger = document.getElementById("hamburger");
  const body = document.body;
  
  if (navMenu) {
    navMenu.classList.toggle("active");
  }
  
  if (hamburger) {
    hamburger.classList.toggle("active");
  }
  
  body.classList.toggle("menu-open");
}

function closeMenu() {
  const navMenu = document.querySelector(".nav-menu");
  const hamburger = document.getElementById("hamburger");
  const body = document.body;
  
  navMenu.classList.remove("active");
  if (hamburger) hamburger.classList.remove("active");
  body.classList.remove("menu-open");
}

function showTab(n) {
  document.getElementById("booking-form").classList.remove("active");
  document.getElementById("quote-form").classList.remove("active");
  document
    .querySelectorAll(".tab-btn")
    .forEach((b) => b.classList.remove("active"));
  document.getElementById(n + "-form").classList.add("active");
  document
    .querySelector('.tab-btn[data-tab="' + n + '"]')
    .classList.add("active");
}

// Enhanced smooth scrolling functionality
function smoothScrollTo(target, duration = 800) {
  const targetElement = document.querySelector(target);
  if (!targetElement) return;
  
  const targetPosition = targetElement.offsetTop - 100; // Account for fixed header
  const startPosition = window.scrollY;
  const distance = targetPosition - startPosition;
  let startTime = null;
  
  // Add visual feedback during scroll
  document.body.classList.add('scrolling');
  
  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = ease(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    } else {
      // Remove scrolling class when animation completes
      document.body.classList.remove('scrolling');
    }
  }
  
  // Enhanced easing function for smoother animation
  function ease(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  }
  
  requestAnimationFrame(animation);
}

// Add smooth scrolling to any element with data-smooth-scroll attribute
function initSmoothScroll() {
  const smoothScrollElements = document.querySelectorAll('[data-smooth-scroll]');
  smoothScrollElements.forEach(element => {
    element.addEventListener('click', (e) => {
      e.preventDefault();
      const target = element.getAttribute('data-smooth-scroll');
      if (target.startsWith('#')) {
        if ('scrollBehavior' in document.documentElement.style) {
          const targetElement = document.querySelector(target);
          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        } else {
          smoothScrollTo(target, 1000);
        }
      }
    });
  });
}

// Back to top functionality with enhanced smooth scrolling
function initBackToTop() {
  const backToTop = document.getElementById("backToTop");
  if (!backToTop) return;
  
  window.addEventListener("scroll", function() {
    if (window.scrollY > 300) {
      backToTop.style.opacity = "1";
      backToTop.style.pointerEvents = "auto";
    } else {
      backToTop.style.opacity = "0";
      backToTop.style.pointerEvents = "none";
    }
  });
  
  backToTop.addEventListener("click", function() {
    // Use native smooth scrolling if available, otherwise use custom
    if ('scrollBehavior' in document.documentElement.style) {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    } else {
      smoothScrollTo('body', 1000);
    }
  });
}

// Update form submission for Hostinger
function handleFormSubmission(form, isQuoteForm = false) {
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    try {
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      
      // Handle checkbox services for quote form
      if (isQuoteForm) {
        const services = formData.getAll('services');
        data.services = services.join(', ');
      }
      
      const response = await fetch('/contact-handler.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        // Redirect to success page
        window.location.href = '/success.html';
      } else {
        throw new Error(result.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Sorry, there was an error sending your message. Please try again or contact us directly.');
    } finally {
      // Reset button
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // Initialize hamburger menu
  const hamburger = document.getElementById("hamburger");
  
  if (hamburger) {
    hamburger.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleMenu();
    });
  }
  
  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    const navMenu = document.querySelector(".nav-menu");
    const hamburger = document.getElementById("hamburger");
    
    if (navMenu && navMenu.classList.contains("active") && 
        !navMenu.contains(e.target) && 
        !hamburger.contains(e.target)) {
      closeMenu();
    }
  });
  
  // Enhanced navigation with smooth scrolling
  const navLinks = document.querySelectorAll(".nav-menu a");
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = link.getAttribute('href');
      
      // Close mobile menu
      closeMenu();
      
      // Smooth scroll to target
      if (target.startsWith('#')) {
        if ('scrollBehavior' in document.documentElement.style) {
          // Use native smooth scrolling if available
          const targetElement = document.querySelector(target);
          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        } else {
          // Use custom smooth scrolling for older browsers
          smoothScrollTo(target, 1000);
        }
      }
    });
  });
  
  // Initialize tab functionality
  document
    .querySelectorAll(".tab-btn")
    .forEach((btn) =>
      btn.addEventListener("click", () => showTab(btn.dataset.tab))
    );
  
  // Set minimum date for date inputs
  document
    .querySelectorAll('input[type="date"]')
    .forEach((i) => (i.min = new Date().toISOString().split("T")[0]));
  
  // Show default tab
  showTab("booking");
  
  // Initialize back to top
  initBackToTop();
  
  // Initialize smooth scrolling for data attributes
  initSmoothScroll();
  
  // Add smooth scrolling to hero CTA buttons
  const heroButtons = document.querySelectorAll('.hero-cta a');
  heroButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const target = button.getAttribute('href');
      
      if (target.startsWith('#')) {
        if ('scrollBehavior' in document.documentElement.style) {
          const targetElement = document.querySelector(target);
          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        } else {
          smoothScrollTo(target, 1000);
        }
      }
    });
  });
});
