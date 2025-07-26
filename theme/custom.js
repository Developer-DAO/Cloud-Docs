// D_D Cloud RPC Documentation Custom JavaScript

(function () {
    'use strict';

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', function () {
        initializeCustomFeatures();
    });

    function initializeCustomFeatures() {
        addCopyButtons();
        addNetworkStatusIndicators();
        addInteractiveExamples();
        addSearchEnhancements();
        addNavigationEnhancements();
    }

    // Add copy buttons to code blocks
    function addCopyButtons() {
        const codeBlocks = document.querySelectorAll('pre code');

        codeBlocks.forEach(function (codeBlock) {
            const pre = codeBlock.parentElement;
            const button = document.createElement('button');

            button.className = 'copy-button';
            button.innerHTML = '📋 Copy';
            button.title = 'Copy to clipboard';

            button.addEventListener('click', function () {
                copyToClipboard(codeBlock.textContent);
                button.innerHTML = '✅ Copied!';
                button.style.color = '#10b981';

                setTimeout(function () {
                    button.innerHTML = '📋 Copy';
                    button.style.color = '';
                }, 2000);
            });

            // Style the button
            button.style.cssText = `
        position: absolute;
        top: 8px;
        right: 8px;
        background: var(--dd-surface);
        border: 1px solid var(--dd-border);
        color: var(--dd-text-muted);
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s ease;
        z-index: 10;
      `;

            // Make pre relative for absolute positioning
            pre.style.position = 'relative';
            pre.appendChild(button);

            // Hover effects
            button.addEventListener('mouseenter', function () {
                button.style.background = 'var(--dd-primary)';
                button.style.color = 'white';
            });

            button.addEventListener('mouseleave', function () {
                if (!button.innerHTML.includes('Copied')) {
                    button.style.background = 'var(--dd-surface)';
                    button.style.color = 'var(--dd-text-muted)';
                }
            });
        });
    }

    // Copy text to clipboard
    function copyToClipboard(text) {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text);
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
            } catch (err) {
                console.error('Failed to copy text: ', err);
            }

            document.body.removeChild(textArea);
        }
    }

    // Add network status indicators
    function addNetworkStatusIndicators() {
        const networkElements = document.querySelectorAll('[data-network]');

        networkElements.forEach(function (element) {
            const network = element.getAttribute('data-network');
            const statusIndicator = document.createElement('span');

            statusIndicator.className = 'network-status';
            statusIndicator.innerHTML = '🟢'; // Default to online
            statusIndicator.title = `${network} status: Online`;

            element.appendChild(statusIndicator);

            // Check actual network status (if API is available)
            checkNetworkStatus(network).then(function (status) {
                if (status === 'online') {
                    statusIndicator.innerHTML = '🟢';
                    statusIndicator.title = `${network} status: Online`;
                } else if (status === 'degraded') {
                    statusIndicator.innerHTML = '🟡';
                    statusIndicator.title = `${network} status: Degraded Performance`;
                } else {
                    statusIndicator.innerHTML = '🔴';
                    statusIndicator.title = `${network} status: Offline`;
                }
            });
        });
    }

    // Mock network status check (replace with actual API call)
    function checkNetworkStatus(network) {
        return new Promise(function (resolve) {
            // Simulate API call
            setTimeout(function () {
                resolve('online'); // Mock response
            }, 100);
        });
    }

    // Add interactive examples
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

            runButton.addEventListener('mouseenter', function () {
                runButton.style.background = 'var(--dd-primary-dark)';
            });

            runButton.addEventListener('mouseleave', function () {
                runButton.style.background = 'var(--dd-primary)';
            });

            example.appendChild(runButton);
        });
    }

    // Run interactive example (placeholder)
    function runInteractiveExample(example) {
        const resultDiv = example.querySelector('.example-result') ||
            document.createElement('div');

        if (!example.querySelector('.example-result')) {
            resultDiv.className = 'example-result';
            resultDiv.style.cssText = `
        background: var(--dd-surface);
        border: 1px solid var(--dd-border);
        border-radius: 4px;
        padding: 12px;
        margin-top: 8px;
        font-family: monospace;
        font-size: 14px;
      `;
            example.appendChild(resultDiv);
        }

        resultDiv.innerHTML = '⏳ Running example...';

        // Simulate API call
        setTimeout(function () {
            resultDiv.innerHTML = `
        <div style="color: var(--dd-success);">✅ Success!</div>
        <div style="margin-top: 8px;">
          <strong>Result:</strong><br>
          <code>{"jsonrpc":"2.0","id":1,"result":"0x1b4"}</code>
        </div>
      `;
        }, 1500);
    }

    // Enhance search functionality
    function addSearchEnhancements() {
        const searchInput = document.querySelector('#searchbar input');
        if (!searchInput) return;

        // Add search suggestions
        const suggestionsDiv = document.createElement('div');
        suggestionsDiv.className = 'search-suggestions';
        suggestionsDiv.style.cssText = `
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: var(--dd-surface);
      border: 1px solid var(--dd-border);
      border-top: none;
      border-radius: 0 0 8px 8px;
      max-height: 200px;
      overflow-y: auto;
      z-index: 1000;
      display: none;
    `;

        searchInput.parentElement.style.position = 'relative';
        searchInput.parentElement.appendChild(suggestionsDiv);

        // Popular search terms
        const popularSearches = [
            'eth_getBalance',
            'eth_sendTransaction',
            'solana getAccountInfo',
            'websocket subscription',
            'rate limits',
            'authentication',
            'error codes'
        ];

        searchInput.addEventListener('focus', function () {
            if (searchInput.value === '') {
                showSearchSuggestions(popularSearches, 'Popular searches:');
            }
        });

        searchInput.addEventListener('input', function () {
            const query = searchInput.value.toLowerCase();
            if (query.length > 2) {
                const filtered = popularSearches.filter(term =>
                    term.toLowerCase().includes(query)
                );
                showSearchSuggestions(filtered, 'Suggestions:');
            } else if (query === '') {
                showSearchSuggestions(popularSearches, 'Popular searches:');
            } else {
                suggestionsDiv.style.display = 'none';
            }
        });

        document.addEventListener('click', function (e) {
            if (!searchInput.parentElement.contains(e.target)) {
                suggestionsDiv.style.display = 'none';
            }
        });

        function showSearchSuggestions(suggestions, title) {
            if (suggestions.length === 0) {
                suggestionsDiv.style.display = 'none';
                return;
            }

            let html = `<div style="padding: 8px; font-weight: bold; color: var(--dd-text-muted); font-size: 12px;">${title}</div>`;

            suggestions.forEach(function (suggestion) {
                html += `
          <div class="search-suggestion" style="
            padding: 8px 12px;
            cursor: pointer;
            border-bottom: 1px solid var(--dd-border);
            transition: background 0.2s ease;
          " data-suggestion="${suggestion}">
            ${suggestion}
          </div>
        `;
            });

            suggestionsDiv.innerHTML = html;
            suggestionsDiv.style.display = 'block';

            // Add click handlers
            suggestionsDiv.querySelectorAll('.search-suggestion').forEach(function (item) {
                item.addEventListener('mouseenter', function () {
                    item.style.background = 'var(--dd-primary)';
                    item.style.color = 'white';
                });

                item.addEventListener('mouseleave', function () {
                    item.style.background = '';
                    item.style.color = '';
                });

                item.addEventListener('click', function () {
                    searchInput.value = item.getAttribute('data-suggestion');
                    suggestionsDiv.style.display = 'none';
                    // Trigger search
                    const event = new Event('input', { bubbles: true });
                    searchInput.dispatchEvent(event);
                });
            });
        }
    }

    // Add navigation enhancements
    function addNavigationEnhancements() {
        // Add "Edit this page" links
        addEditLinks();

        // Add "Back to top" button
        addBackToTopButton();

        // Add breadcrumb navigation
        addBreadcrumbs();

        // Add page navigation (prev/next)
        addPageNavigation();
    }

    function addEditLinks() {
        const content = document.querySelector('.content');
        if (!content) return;

        const editLink = document.createElement('a');
        editLink.href = '#'; // Replace with actual GitHub edit URL
        editLink.innerHTML = '✏️ Edit this page';
        editLink.className = 'edit-link';
        editLink.style.cssText = `
      display: inline-block;
      margin-top: 2rem;
      padding: 8px 12px;
      background: var(--dd-surface);
      border: 1px solid var(--dd-border);
      border-radius: 4px;
      color: var(--dd-text-muted);
      text-decoration: none;
      font-size: 14px;
      transition: all 0.2s ease;
    `;

        editLink.addEventListener('mouseenter', function () {
            editLink.style.background = 'var(--dd-primary)';
            editLink.style.color = 'white';
            editLink.style.borderColor = 'var(--dd-primary)';
        });

        editLink.addEventListener('mouseleave', function () {
            editLink.style.background = 'var(--dd-surface)';
            editLink.style.color = 'var(--dd-text-muted)';
            editLink.style.borderColor = 'var(--dd-border)';
        });

        content.appendChild(editLink);
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

    function addBreadcrumbs() {
        const content = document.querySelector('.content');
        const sidebar = document.querySelector('.sidebar');
        if (!content || !sidebar) return;

        const activeChapter = sidebar.querySelector('.chapter-item.expanded');
        if (!activeChapter) return;

        const breadcrumbs = document.createElement('nav');
        breadcrumbs.className = 'breadcrumbs';
        breadcrumbs.style.cssText = `
      margin-bottom: 1rem;
      padding: 0.5rem 0;
      border-bottom: 1px solid var(--dd-border);
      font-size: 14px;
      color: var(--dd-text-muted);
    `;

        // Build breadcrumb path
        let path = [];
        let current = activeChapter;

        while (current && current.classList.contains('chapter-item')) {
            const link = current.querySelector('a');
            if (link) {
                path.unshift({
                    text: link.textContent.trim(),
                    href: link.href
                });
            }
            current = current.parentElement.closest('.chapter-item');
        }

        let breadcrumbHTML = path.map(function (item, index) {
            if (index === path.length - 1) {
                return `<span class="breadcrumb-current">${item.text}</span>`;
            } else {
                return `<a href="${item.href}" class="breadcrumb-link">${item.text}</a>`;
            }
        }).join(' <span class="breadcrumb-separator">›</span> ');

        breadcrumbs.innerHTML = breadcrumbHTML;

        // Style breadcrumb links
        const style = document.createElement('style');
        style.textContent = `
      .breadcrumb-link {
        color: var(--dd-primary);
        text-decoration: none;
      }
      .breadcrumb-link:hover {
        text-decoration: underline;
      }
      .breadcrumb-current {
        color: var(--dd-text);
        font-weight: 500;
      }
      .breadcrumb-separator {
        margin: 0 0.5rem;
        color: var(--dd-text-muted);
      }
    `;
        document.head.appendChild(style);

        content.insertBefore(breadcrumbs, content.firstChild);
    }

    function addPageNavigation() {
        const content = document.querySelector('.content');
        if (!content) return;

        const navContainer = document.createElement('div');
        navContainer.className = 'page-navigation';
        navContainer.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 3rem;
      padding-top: 2rem;
      border-top: 1px solid var(--dd-border);
    `;

        // Get previous and next chapters from sidebar
        const sidebar = document.querySelector('.sidebar');
        const chapters = Array.from(sidebar.querySelectorAll('.chapter-item a'));
        const currentHref = window.location.pathname;
        const currentIndex = chapters.findIndex(link =>
            link.getAttribute('href') === currentHref
        );

        let prevHTML = '<div></div>'; // Empty div for spacing
        let nextHTML = '<div></div>';

        if (currentIndex > 0) {
            const prevChapter = chapters[currentIndex - 1];
            prevHTML = `
        <a href="${prevChapter.href}" class="nav-link nav-prev">
          <div class="nav-direction">← Previous</div>
          <div class="nav-title">${prevChapter.textContent.trim()}</div>
        </a>
      `;
        }

        if (currentIndex < chapters.length - 1) {
            const nextChapter = chapters[currentIndex + 1];
            nextHTML = `
        <a href="${nextChapter.href}" class="nav-link nav-next">
          <div class="nav-direction">Next →</div>
          <div class="nav-title">${nextChapter.textContent.trim()}</div>
        </a>
      `;
        }

        navContainer.innerHTML = prevHTML + nextHTML;

        // Style navigation links
        const navStyle = document.createElement('style');
        navStyle.textContent = `
      .nav-link {
        display: block;
        padding: 1rem;
        background: var(--dd-surface);
        border: 1px solid var(--dd-border);
        border-radius: 8px;
        text-decoration: none;
        color: var(--dd-text);
        transition: all 0.2s ease;
        max-width: 300px;
      }
      .nav-link:hover {
        border-color: var(--dd-primary);
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15);
      }
      .nav-direction {
        font-size: 12px;
        color: var(--dd-text-muted);
        margin-bottom: 0.25rem;
      }
      .nav-title {
        font-weight: 500;
        color: var(--dd-primary);
      }
      .nav-prev {
        text-align: left;
      }
      .nav-next {
        text-align: right;
      }
    `;
        document.head.appendChild(navStyle);

        content.appendChild(navContainer);
    }

    // Add keyboard shortcuts
    document.addEventListener('keydown', function (e) {
        // Ctrl/Cmd + K to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.querySelector('#searchbar input');
            if (searchInput) {
                searchInput.focus();
            }
        }

        // Escape to close search suggestions
        if (e.key === 'Escape') {
            const suggestions = document.querySelector('.search-suggestions');
            if (suggestions) {
                suggestions.style.display = 'none';
            }
        }
    });

    // Add loading states for dynamic content
    function showLoading(element) {
        element.classList.add('loading');
    }

    function hideLoading(element) {
        element.classList.remove('loading');
    }

    // Expose utilities globally
    window.DDCloudDocs = {
        copyToClipboard: copyToClipboard,
        showLoading: showLoading,
        hideLoading: hideLoading,
        checkNetworkStatus: checkNetworkStatus
    };

})();