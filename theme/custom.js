// D_D Cloud RPC Documentation Custom JavaScript

(function () {
    'use strict';

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', function () {
        initializeCustomFeatures();
        initializeInteractiveTabs();
        initializeTableOfContents();
    });

    function initializeCustomFeatures() {
        addCopyButtons();
        addNetworkStatusIndicators();
        addInteractiveExamples();
        addSearchEnhancements();
        addNavigationEnhancements();
    }

    // Initialize interactive tabs for language/code examples
    function initializeInteractiveTabs() {
        // Language tabs for installation
        const languageTabs = document.querySelectorAll('.language-tabs');
        languageTabs.forEach(function (tabContainer) {
            const buttons = tabContainer.querySelectorAll('.tab-button');
            const contents = tabContainer.querySelectorAll('.tab-content');

            buttons.forEach(function (button) {
                button.addEventListener('click', function () {
                    const lang = this.getAttribute('data-lang');

                    // Remove active class from all buttons and contents
                    buttons.forEach(b => b.classList.remove('active'));
                    contents.forEach(c => c.classList.remove('active'));

                    // Add active class to clicked button and corresponding content
                    this.classList.add('active');
                    const targetContent = tabContainer.querySelector(`.tab-content.${lang}`);
                    if (targetContent) {
                        targetContent.classList.add('active');
                    }
                });
            });
        });

        // Example tabs for code samples
        const exampleTabs = document.querySelectorAll('.code-examples');
        exampleTabs.forEach(function (exampleContainer) {
            const tabs = exampleContainer.querySelectorAll('.example-tab');
            const contents = exampleContainer.querySelectorAll('.example-content');

            tabs.forEach(function (tab) {
                tab.addEventListener('click', function () {
                    const example = this.getAttribute('data-example');

                    // Remove active class from all tabs and contents
                    tabs.forEach(t => t.classList.remove('active'));
                    contents.forEach(c => c.classList.remove('active'));

                    // Add active class to clicked tab and corresponding content
                    this.classList.add('active');
                    const targetContent = exampleContainer.querySelector(`.example-content.${example}`);
                    if (targetContent) {
                        targetContent.classList.add('active');
                    }

                    // Store preference in localStorage
                    localStorage.setItem('preferredLanguage', example);
                });
            });

            // Load preferred language from localStorage
            const preferredLang = localStorage.getItem('preferredLanguage');
            if (preferredLang) {
                const preferredTab = exampleContainer.querySelector(`[data-example="${preferredLang}"]`);
                if (preferredTab) {
                    preferredTab.click();
                }
            }
        });
    }

    // Global copy function for copy buttons
    window.copyToClipboard = function (button) {
        const codeBlock = button.closest('.code-block, .install-command').querySelector('code, pre');
        const text = codeBlock ? codeBlock.textContent : '';

        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(function () {
                showCopySuccess(button);
            });
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
                document.execCommand('copy');
                showCopySuccess(button);
            } catch (err) {
                console.error('Failed to copy text: ', err);
            }

            document.body.removeChild(textArea);
        }
    };

    function showCopySuccess(button) {
        const originalText = button.textContent;
        button.textContent = '✅ Copied!';
        button.style.background = 'var(--dd-success)';

        setTimeout(function () {
            button.textContent = originalText;
            button.style.background = 'var(--dd-primary)';
        }, 2000);
    }

    // Add copy buttons to existing code blocks
    function addCopyButtons() {
        const codeBlocks = document.querySelectorAll('pre code');

        codeBlocks.forEach(function (codeBlock) {
            const pre = codeBlock.parentElement;

            // Skip if copy button already exists
            if (pre.querySelector('.copy-button')) return;

            const button = document.createElement('button');
            button.className = 'copy-button';
            button.innerHTML = '📋 Copy';
            button.title = 'Copy to clipboard';

            button.addEventListener('click', function () {
                copyToClipboard(codeBlock.textContent);
                showCopySuccess(button);
            });

            // Style the button
            button.style.cssText = `
                position: absolute;
                top: 8px;
                right: 8px;
                background: var(--dd-primary);
                color: white;
                border: none;
                padding: 0.4rem 0.8rem;
                border-radius: 4px;
                font-size: 0.8rem;
                cursor: pointer;
                transition: all 0.2s ease;
                z-index: 10;
            `;

            // Make pre relative for absolute positioning
            pre.style.position = 'relative';
            pre.appendChild(button);

            // Hover effects
            button.addEventListener('mouseenter', function () {
                button.style.background = 'var(--dd-primary-dark)';
            });

            button.addEventListener('mouseleave', function () {
                if (!button.innerHTML.includes('Copied')) {
                    button.style.background = 'var(--dd-primary)';
                }
            });
        });
    }

    // Copy text to clipboard
    function copyToClipboard(text) {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text);
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
                document.execCommand('copy');
                return Promise.resolve();
            } catch (err) {
                console.error('Failed to copy text: ', err);
                return Promise.reject(err);
            } finally {
                document.body.removeChild(textArea);
            }
        }
    }

    // Add network status indicators (placeholder implementation)
    function addNetworkStatusIndicators() {
        const networkElements = document.querySelectorAll('[data-network]');

        networkElements.forEach(function (element) {
            const network = element.getAttribute('data-network');
            const statusIndicator = document.createElement('span');

            statusIndicator.className = 'network-status';
            statusIndicator.innerHTML = '🟢';
            statusIndicator.title = `${network} status: Online`;

            element.appendChild(statusIndicator);
        });
    }

    // Add interactive examples (placeholder)
    function addInteractiveExamples() {
        const examples = document.querySelectorAll('.interactive-example');

        examples.forEach(function (example) {
            const runButton = document.createElement('button');
            runButton.className = 'run-example-button';
            runButton.innerHTML = '▶️ Run Example';
            runButton.title = 'Run this example';

            runButton.style.cssText = `
                background: var(--dd-primary);
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                margin-top: 8px;
                font-size: 14px;
                transition: background 0.2s ease;
            `;

            runButton.addEventListener('click', function () {
                runInteractiveExample(example);
            });

            example.appendChild(runButton);
        });
    }

    function runInteractiveExample(example) {
        // Placeholder implementation
        console.log('Running interactive example...');
    }

    // Enhanced search functionality
    function addSearchEnhancements() {
        const searchInput = document.querySelector('#searchbar input, .searchbar input');
        if (!searchInput) return;

        // Add keyboard shortcut (Ctrl/Cmd + K)
        document.addEventListener('keydown', function (e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                searchInput.focus();
            }
        });
    }

    // Add navigation enhancements
    function addNavigationEnhancements() {
        addBackToTopButton();
    }

    function addBackToTopButton() {
        const button = document.createElement('button');
        button.innerHTML = '↑';
        button.className = 'back-to-top';
        button.title = 'Back to top';
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            background: var(--dd-primary);
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 20px;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        `;

        document.body.appendChild(button);

        button.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        window.addEventListener('scroll', function () {
            if (window.pageYOffset > 300) {
                button.style.opacity = '1';
                button.style.visibility = 'visible';
            } else {
                button.style.opacity = '0';
                button.style.visibility = 'hidden';
            }
        });
    }

    // Table of Contents functionality
    function initializeTableOfContents() {
        const tocLinks = document.querySelectorAll('.toc-nav a');
        const sections = document.querySelectorAll('[id]');

        if (tocLinks.length === 0 || sections.length === 0) {
            return;
        }

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

        // Update on click
        tocLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                tocLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            });
        });

        // Initial update
        updateActiveLink();
    }

    // Expose utilities globally
    window.DDCloudDocs = {
        copyToClipboard: copyToClipboard,
        initializeInteractiveTabs: initializeInteractiveTabs,
        initializeTableOfContents: initializeTableOfContents
    };

})();