document.addEventListener('DOMContentLoaded', function() {
  // Get all section headers that have IDs
  const sections = document.querySelectorAll('.content-main h1[id], .content-main h2[id], .content-main h3[id], .content-main h4[id]');
  
  // Get all TOC links
  const tocLinks = document.querySelectorAll('.toc-nav a');
  
  // Function to determine which section is currently in view
  function highlightTocSection() {
    // Get current scroll position
    const scrollY = window.pageYOffset;
    
    // Loop through sections to find the one in view
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100; // 100px offset for better UX
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        // Remove .active from all links
        tocLinks.forEach(link => {
          link.classList.remove('active');
        });
        
        // Add .active to the corresponding TOC link
        const correspondingLink = document.querySelector(`.toc-nav a[href="#${sectionId}"]`);
        if (correspondingLink) {
          correspondingLink.classList.add('active');
        }
      }
    });
  }
  
  // Add scroll event listener
  window.addEventListener('scroll', highlightTocSection);
  
  // Initialize on page load
  highlightTocSection();
  
  // Handle clicks on TOC links for smooth scrolling
  tocLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // Only proceed if the link targets an ID on this page
      const targetId = this.getAttribute('href');
      if (targetId.startsWith('#')) {
        e.preventDefault();
        
        const targetElement = document.getElementById(targetId.substring(1));
        if (targetElement) {
          // Smooth scroll to the target element
          targetElement.scrollIntoView({ behavior: 'smooth' });
          
          // Update URL hash without jumping
          history.pushState(null, null, targetId);
        }
      }
    });
  });
});
