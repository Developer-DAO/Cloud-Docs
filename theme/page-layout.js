// Page layout JavaScript for TOC functionality
(function () {
    'use strict';

    // Initialize TOC functionality when DOM is ready
    document.addEventListener('DOMContentLoaded', function () {
        initializeTOC();
    });

    function initializeTOC() {
        const tocLinks = document.querySelectorAll('.toc-nav a');
        const sections = document.querySelectorAll('[id]');

        if (tocLinks.length === 0 || sections.length === 0) return;

        // Function to update active link
        function updateActiveLink() {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (window.scrollY >= sectionTop - 100) {
                    current = section.getAttribute('id');
                }
            });

            tocLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        }

        // Update on scroll
        window.addEventListener('scroll', updateActiveLink);

        // Update on click and maintain focus
        tocLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                // Remove active from all links
                tocLinks.forEach(l => l.classList.remove('active'));
                // Add active to clicked link
                this.classList.add('active');
                // Keep focus on the link
                this.focus();
                // Prevent losing focus
                setTimeout(() => this.focus(), 100);
            });

            // Maintain focus when using keyboard navigation
            link.addEventListener('focus', function () {
                tocLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            });
        });

        // Initial update
        updateActiveLink();
    }

    // Expose globally for manual initialization
    window.initializeTOC = initializeTOC;

})();