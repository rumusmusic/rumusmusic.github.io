// Optimized Main JavaScript for Professional Jekyll Template
document.addEventListener('DOMContentLoaded', function() {
  
  // Mobile menu toggle
  initMobileMenu();
  
  // Search functionality
  initSearch();
  
  // Lazy loading for images
  initLazyLoading();
  
  // Smooth scrolling
  initSmoothScrolling();
  
  // Performance optimizations
  initPerformanceOptimizations();
  
  // AdSense initialization
  initAdSense();
});

// Mobile Menu Functionality
function initMobileMenu() {
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  
  if (mobileToggle && navbar) {
    mobileToggle.addEventListener('click', function() {
      navbar.classList.toggle('mobile-active');
      
      // Animate hamburger menu
      const spans = mobileToggle.querySelectorAll('span');
      spans.forEach((span, index) => {
        if (navbar.classList.contains('mobile-active')) {
          if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
          if (index === 1) span.style.opacity = '0';
          if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
          span.style.transform = '';
          span.style.opacity = '';
        }
      });
    });
    
    // Close mobile menu when clicking nav links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navbar.classList.remove('mobile-active');
        const spans = mobileToggle.querySelectorAll('span');
        spans.forEach(span => {
          span.style.transform = '';
          span.style.opacity = '';
        });
      });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!navbar.contains(e.target) && navbar.classList.contains('mobile-active')) {
        navbar.classList.remove('mobile-active');
        const spans = mobileToggle.querySelectorAll('span');
        spans.forEach(span => {
          span.style.transform = '';
          span.style.opacity = '';
        });
      }
    });
  }
}

// Search Functionality
function initSearch() {
  const searchForm = document.querySelector('.search-form');
  const searchInput = document.querySelector('.search-input');
  
  if (searchForm && searchInput) {
    searchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const query = searchInput.value.trim();
      
      if (query) {
        // Redirect to search results (implement search page)
        window.location.href = `/search/?q=${encodeURIComponent(query)}`;
      }
    });
    
    // Add search suggestions (if you have search data)
    searchInput.addEventListener('input', debounce(function() {
      const query = this.value.trim();
      if (query.length > 2) {
        // Implement search suggestions here
        showSearchSuggestions(query);
      } else {
        hideSearchSuggestions();
      }
    }, 300));
  }
}

// Search suggestions functionality
function showSearchSuggestions(query) {
  // This would connect to your search index
  // For now, we'll implement a basic version
  let suggestions = document.querySelector('.search-suggestions');
  
  if (!suggestions) {
    suggestions = document.createElement('div');
    suggestions.className = 'search-suggestions';
    document.querySelector('.search-form').appendChild(suggestions);
  }
  
  // Add some basic styling
  suggestions.style.cssText = `
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #e1e8ed;
    border-top: none;
    border-radius: 0 0 8px 8px;
    max-height: 200px;
    overflow-y: auto;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  `;
  
  // You would populate this with actual search results
  suggestions.innerHTML = `
    <div style="padding: 0.75rem; color: #7f8c8d; font-size: 0.9rem;">
      Searching for "${query}"...
    </div>
  `;
}

function hideSearchSuggestions() {
  const suggestions = document.querySelector('.search-suggestions');
  if (suggestions) {
    suggestions.remove();
  }
}

// Lazy Loading for Images
function initLazyLoading() {
  if ('IntersectionObserver' in window) {
    const images = document.querySelectorAll('img[data-src], img[loading="lazy"]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          
          // Handle data-src lazy loading
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          
          // Add loaded class for animations
          img.classList.add('loaded');
          
          // Stop observing this image
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });
    
    images.forEach(img => {
      // Add loading shimmer effect
      img.classList.add('loading-shimmer');
      
      // Start observing
      imageObserver.observe(img);
      
      // Remove shimmer when loaded
      img.addEventListener('load', function() {
        this.classList.remove('loading-shimmer');
      });
    });
  }
}

// Smooth Scrolling
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      
      if (target) {
        e.preventDefault();
        
        const headerOffset = document.querySelector('.site-header').offsetHeight;
        const elementPosition = target.offsetTop;
        const offsetPosition = elementPosition - headerOffset - 20;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Performance Optimizations
function initPerformanceOptimizations() {
  // Preload critical resources
  preloadCriticalResources();
  
  // Initialize service worker if available
  initServiceWorker();
  
  // Optimize scroll performance
  optimizeScrollPerformance();
  
  // Initialize viewport animations
  initViewportAnimations();
}

function preloadCriticalResources() {
  // Preload critical CSS
  const criticalCSS = document.createElement('link');
  criticalCSS.rel = 'preload';
  criticalCSS.href = '/assets/css/optimized-styles.css';
  criticalCSS.as = 'style';
  document.head.appendChild(criticalCSS);
  
  // Preload fonts
  const fontPreload = document.createElement('link');
  fontPreload.rel = 'preload';
  fontPreload.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
  fontPreload.as = 'style';
  document.head.appendChild(fontPreload);
}

function initServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registered: ', registration);
        })
        .catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
}

function optimizeScrollPerformance() {
  let ticking = false;
  
  function updateScrolled() {
    const scrolled = window.pageYOffset;
    const header = document.querySelector('.site-header');
    
    if (header) {
      if (scrolled > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
    
    ticking = false;
  }
  
  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateScrolled);
      ticking = true;
    }
  }
  
  window.addEventListener('scroll', requestTick, { passive: true });
}

function initViewportAnimations() {
  if ('IntersectionObserver' in window) {
    const animateElements = document.querySelectorAll('.widget, .popular-post-item, .category-item');
    
    const animationObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    animateElements.forEach(element => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(20px)';
      element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      animationObserver.observe(element);
    });
  }
}

// AdSense Initialization
function initAdSense() {
  // Initialize AdSense ads
  const adElements = document.querySelectorAll('.adsbygoogle');
  
  adElements.forEach(ad => {
    // Add intersection observer for lazy loading ads
    if ('IntersectionObserver' in window) {
      const adObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Load AdSense ad when it comes into view
            if (typeof adsbygoogle !== 'undefined') {
              (adsbygoogle = window.adsbygoogle || []).push({});
            }
            adObserver.unobserve(entry.target);
          }
        });
      }, {
        rootMargin: '100px 0px'
      });
      
      adObserver.observe(ad);
    }
  });
}

// Utility Functions
function debounce(func, wait, immediate) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(this, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(this, args);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Error handling
window.addEventListener('error', function(e) {
  console.error('JavaScript error:', e.error);
  // You can send error reports to analytics here
});

// Performance monitoring
window.addEventListener('load', function() {
  // Log performance metrics
  if ('performance' in window) {
    const perfData = performance.getEntriesByType('navigation')[0];
    console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart);
  }
});

// Export functions for testing or external use
window.OptimizedTemplate = {
  initMobileMenu,
  initSearch,
  initLazyLoading,
  debounce,
  throttle
};