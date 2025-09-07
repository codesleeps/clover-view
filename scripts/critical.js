// Critical JavaScript that needs to run immediately
function loadCriticalCSS() {
  // Remove no-js class and add js class
  if (document.documentElement.classList.contains('no-js')) {
    document.documentElement.classList.remove('no-js');
    document.documentElement.classList.add('js');
  }

  // Show loading indicator
  const loadingIndicator = document.createElement('div');
  loadingIndicator.className = 'loading';
  loadingIndicator.id = 'pageLoading';
  document.body.insertBefore(loadingIndicator, document.body.firstChild);
  loadingIndicator.classList.add('active');

  // Fade in elements after page load
  document.addEventListener('DOMContentLoaded', function() {
    const elements = document.querySelectorAll('.header, .nav-container, .logo h1, .hero, .hero-overlay, .hero-content, .hero-text h1, .btn');
    elements.forEach(el => el.style.opacity = '1');
    
    // Load non-critical resources
    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = 'styles.css';
    document.head.appendChild(stylesheet);
    
    // Hide loading indicator when styles are loaded
    stylesheet.onload = function() {
      if (loadingIndicator) {
        loadingIndicator.classList.remove('active');
        // Remove element after animation completes
        setTimeout(() => {
          loadingIndicator.style.display = 'none';
        }, 500);
      }
    };
    
    // Fallback in case stylesheet fails to load
    setTimeout(() => {
      if (loadingIndicator && loadingIndicator.classList.contains('active')) {
        loadingIndicator.classList.remove('active');
        loadingIndicator.style.display = 'none';
      }
    }, 3000);
  });  
  // Load main script with defer
  const script = document.createElement('script');
  script.src = 'script.js';
  script.defer = true;
  document.head.appendChild(script);
}

// Run critical functions when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // First, make sure the critical CSS is loaded
  // const criticalCSS = document.querySelector('link[href*="critical.css"]');
  // if (criticalCSS) {
  //   // If CSS is already loaded, fade in elements
  //   if (criticalCSS.sheet) {
  //     loadCriticalCSS();
  //   } else {
  //     // If not loaded yet, wait for it
  //     criticalCSS.onload = loadCriticalCSS;
  //   }
  // }
  
  // Just run the function directly since CSS is inline
  loadCriticalCSS();
  
  // Load non-critical resources
  loadNonCriticalResources();
});
