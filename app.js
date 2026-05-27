
    document.addEventListener('DOMContentLoaded', () => {
      // Category subnav mouse wheel horizontal scroll helper
      const categoryNav = document.getElementById('category-nav');
      if (categoryNav) {
        categoryNav.addEventListener('wheel', (evt) => {
          if (evt.deltaY !== 0) {
            evt.preventDefault();
            categoryNav.scrollLeft += evt.deltaY;
          }
        });
      }

      // Smart hover card positioning for desktop screens
      const catNavItemsForHover = document.querySelectorAll('.cat-nav-item');
      catNavItemsForHover.forEach(item => {
        const panel = item.querySelector('.nav-preview-panel');
        if (!panel) return;

        item.addEventListener('mouseenter', () => {
          if (window.innerWidth < 1024) return; // Only run on desktop

          // Reset shift first to get natural measurement
          panel.style.setProperty('--shift-x', '0px');

          const rect = panel.getBoundingClientRect();
          const viewportWidth = window.innerWidth;
          const padding = 16; // Safe margin from viewport edge

          const panelLeft = rect.left;
          const panelRight = rect.right;

          let shiftX = 0;
          if (panelLeft < padding) {
            shiftX = padding - panelLeft;
          } else if (panelRight > viewportWidth - padding) {
            shiftX = (viewportWidth - padding) - panelRight;
          }

          panel.style.setProperty('--shift-x', `${shiftX}px`);
        });

        item.addEventListener('mouseleave', () => {
          panel.style.setProperty('--shift-x', '0px');
        });
      });

      // Graph Tab Switching
      const btn2d = document.getElementById('ctrl-2d');
      const btn3d = document.getElementById('ctrl-3d');
      const btnTable = document.getElementById('ctrl-table');

      const view2d = document.getElementById('view-2d');
      const view3d = document.getElementById('view-3d');
      const viewTable = document.getElementById('view-table');
      const legend = document.getElementById('graph-legend');

      function switchTab(activeBtn, showView, showLegend = true) {
        [btn2d, btn3d, btnTable].forEach(btn => btn.classList.remove('active'));
        [view2d, view3d, viewTable].forEach(view => view.style.display = 'none');

        activeBtn.classList.add('active');
        showView.style.display = 'block';
        legend.style.display = showLegend ? 'flex' : 'none';
      }

      btn2d.addEventListener('click', () => switchTab(btn2d, view2d, true));
      btn3d.addEventListener('click', () => switchTab(btn3d, view3d, true));
      btnTable.addEventListener('click', () => switchTab(btnTable, viewTable, false));
      
      // Prevent clicks inside preview panels from bubbling up and triggering filters
      const previewPanels = document.querySelectorAll('.nav-preview-panel');
      previewPanels.forEach(panel => {
        panel.addEventListener('click', (evt) => {
          evt.stopPropagation();
        });
      });

      // Category Filtering & Navigation
      const catNavItems = document.querySelectorAll('.cat-nav-item');
      const catCards = document.querySelectorAll('.cat-c');
      const toolRows = document.querySelectorAll('.tool-i');

      catNavItems.forEach(item => {
        item.addEventListener('click', () => {
          catNavItems.forEach(i => i.classList.remove('active'));
          item.classList.add('active');

          // Smoothly scroll the clicked tab into view horizontally
          item.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });

          const catId = item.id.replace('cat-nav-', '');

          // Keep all grid cards visible so scroll and focus transitions work perfectly
          catCards.forEach(card => {
            card.style.display = 'block';
          });

          // Determine scroll target and perform navigation
          let targetEl = null;
          if (item.dataset.clickedCardDirectly === 'true') {
            // Scroll to the popular tools section since they clicked the card directly
            targetEl = document.getElementById('tools-section');
            delete item.dataset.clickedCardDirectly;
          } else {
            // Scroll to matching card
            let targetCardId = '';
            if (catId === 'all') {
              targetCardId = 'categories-section';
            } else {
              if (catId === 'matrices' || catId === 'echelon') {
                targetCardId = 'cat-matrices';
              } else if (catId === 'eigen' || catId === 'diag') {
                targetCardId = 'cat-eigen';
              } else {
                targetCardId = `cat-${catId}`;
              }
            }
            targetEl = document.getElementById(targetCardId);
          }

          if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }

          // Filter tools
          toolRows.forEach(row => {
            const rowCat = row.querySelector('.tool-i-cat').textContent.trim();
            if (catId === 'all') {
              row.style.display = 'flex';
            } else {
              let match = false;
              if (catId === 'matrices' || catId === 'echelon') {
                match = (rowCat === 'matrices');
              } else if (catId === 'eigen' || catId === 'diag') {
                match = (rowCat === 'eigen_analysis');
              } else if (catId === 'numerical') {
                match = (rowCat === 'numerical_methods' || rowCat === 'root_finding');
              } else if (catId === 'integration') {
                match = (rowCat === 'integration');
              } else if (catId === 'ode') {
                match = (rowCat === 'ode_methods');
              } else if (catId === 'partial') {
                match = (rowCat === 'partial_diff');
              } else if (catId === 'stats') {
                match = (rowCat === 'statistics');
              } else if (catId === 'graph') {
                match = (rowCat === 'graph_plotter');
              }
              row.style.display = match ? 'flex' : 'none';
            }
          });

          // Hide or show parent tool-big cards based on visible items
          const toolCards = document.querySelectorAll('.tool-big');
          toolCards.forEach(card => {
            const visibleRows = Array.from(card.querySelectorAll('.tool-i')).filter(row => row.style.display !== 'none');
            card.style.display = visibleRows.length > 0 ? 'block' : 'none';
          });

          // Hide or show the entire popular tools section if there are no visible tools at all
          const toolsSection = document.getElementById('tools-section');
          if (toolsSection) {
            const visibleToolsCount = Array.from(toolRows).filter(row => row.style.display !== 'none').length;
            toolsSection.style.display = visibleToolsCount > 0 ? 'block' : 'none';
          }
        });
      });

      // Category Card Click Integration
      catCards.forEach(card => {
        card.addEventListener('click', () => {
          const cardId = card.id.replace('cat-', '');
          const navItemId = `cat-nav-${cardId}`;
          const navItem = document.getElementById(navItemId);
          if (navItem) {
            // Set flag to scroll directly to the popular tools section
            navItem.dataset.clickedCardDirectly = 'true';
            navItem.click();
          }
        });
      });

      // ========================
      // THEME TOGGLE
      // ========================
      const themeToggle = document.getElementById('theme-toggle');
      if (themeToggle) {
        themeToggle.addEventListener('click', () => {
          const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
          if (isDark) {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
          } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
          }
        });
      }

      // ========================
      // SEARCH SOLVER DATABASE
      // ========================
      const SEARCHABLE_TOOLS = [
        {
          name: 'Determinant Calculator',
          cat: 'matrices',
          desc: 'Calculate matrix determinant step-by-step',
          targetId: 'tool-det',
          tabId: 'cat-nav-matrices'
        },
        {
          name: 'Matrix Inverse',
          cat: 'matrices',
          desc: 'Find the inverse of a square matrix',
          targetId: 'tool-inverse',
          tabId: 'cat-nav-matrices'
        },
        {
          name: 'Eigenvalue & Eigenvector',
          cat: 'eigen_analysis',
          desc: 'Calculate characteristic equations and eigenvectors',
          targetId: 'tool-eigen',
          tabId: 'cat-nav-eigen'
        },
        {
          name: 'Diagonalisation',
          cat: 'eigen_analysis',
          desc: 'Diagonalise symmetric and non-symmetric matrices',
          targetId: 'tool-diag',
          tabId: 'cat-nav-diag'
        },
        {
          name: 'Gauss-Seidel Method',
          cat: 'numerical_methods',
          desc: 'Iterative solver for systems of linear equations',
          targetId: 'tool-gauss-seidel',
          tabId: 'cat-nav-numerical'
        },
        {
          name: 'Newton-Raphson',
          cat: 'root_finding',
          desc: 'Iterative root finding with live 2D/3D plots',
          targetId: 'tool-newton',
          tabId: 'cat-nav-numerical'
        },
        {
          name: 'Simpson\'s 1/3 Rule',
          cat: 'integration',
          desc: 'Approximate definite integrals numerically',
          targetId: 'tool-simpson',
          tabId: 'cat-nav-integration'
        },
        {
          name: 'Runge-Kutta Method',
          cat: 'ode_methods',
          desc: 'Solve initial value ODE problems using RK4',
          targetId: 'tool-rk',
          tabId: 'cat-nav-ode'
        },
        {
          name: 'Row Echelon Form',
          cat: 'matrices',
          desc: 'Convert matrices to REF or RREF forms',
          targetId: 'cat-nav-echelon',
          tabId: 'cat-nav-echelon'
        },
        {
          name: 'Partial Differentiation',
          cat: 'partial_diff',
          desc: 'Find critical points and local extrema',
          targetId: 'cat-nav-partial',
          tabId: 'cat-nav-partial'
        },
        {
          name: 'Statistics & Data Modelling',
          cat: 'statistics',
          desc: 'Fit regression lines and run hypothesis tests',
          targetId: 'cat-nav-stats',
          tabId: 'cat-nav-stats'
        },
        {
          name: 'Graph Plotter',
          cat: 'graph_plotter',
          desc: 'Plot mathematical equations in 2D or 3D',
          targetId: 'cat-nav-graph',
          tabId: 'cat-nav-graph'
        }
      ];

      // ========================
      // SEARCH ENGINE LOGIC
      // ========================
      const searchInput = document.getElementById('nav-search-input');
      const clearSearchBtn = document.getElementById('search-clear-btn');
      const searchDropdown = document.getElementById('search-results-dropdown');
      let searchSelectedIndex = -1;

      if (searchInput && searchDropdown) {
        // Input Listener
        searchInput.addEventListener('input', () => {
          const query = searchInput.value.trim().toLowerCase();
          
          if (query.length === 0) {
            clearSearchBtn.style.display = 'none';
            searchDropdown.classList.add('hidden');
            searchDropdown.innerHTML = '';
            searchSelectedIndex = -1;
            return;
          }

          clearSearchBtn.style.display = 'block';
          const matches = SEARCHABLE_TOOLS.filter(tool => 
            tool.name.toLowerCase().includes(query) || 
            tool.desc.toLowerCase().includes(query) ||
            tool.cat.toLowerCase().includes(query)
          );

          renderResults(matches, query);
        });

        // Focus Listener to show dropdown with initial state if there's text
        searchInput.addEventListener('focus', () => {
          const query = searchInput.value.trim().toLowerCase();
          if (query.length > 0) {
            searchDropdown.classList.remove('hidden');
          }
        });

        // Keydown keyboard navigation
        searchInput.addEventListener('keydown', (e) => {
          const items = searchDropdown.querySelectorAll('.search-dropdown-item');
          if (items.length === 0) return;

          if (e.key === 'ArrowDown') {
            e.preventDefault();
            searchSelectedIndex = (searchSelectedIndex + 1) % items.length;
            updateSearchSelection(items);
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            searchSelectedIndex = (searchSelectedIndex - 1 + items.length) % items.length;
            updateSearchSelection(items);
          } else if (e.key === 'Enter') {
            e.preventDefault();
            if (searchSelectedIndex >= 0 && searchSelectedIndex < items.length) {
              items[searchSelectedIndex].click();
            } else if (items.length > 0) {
              items[0].click();
            }
          } else if (e.key === 'Escape') {
            searchDropdown.classList.add('hidden');
            searchInput.blur();
          }
        });

        // Clear button click
        if (clearSearchBtn) {
          clearSearchBtn.addEventListener('click', () => {
            searchInput.value = '';
            clearSearchBtn.style.display = 'none';
            searchDropdown.classList.add('hidden');
            searchDropdown.innerHTML = '';
            searchSelectedIndex = -1;
            searchInput.focus();
          });
        }

        // Global key shortcut for '/' to focus search
        document.addEventListener('keydown', (e) => {
          if (e.key === '/' && document.activeElement !== searchInput && 
              document.activeElement.tagName !== 'INPUT' && 
              document.activeElement.tagName !== 'TEXTAREA') {
            e.preventDefault();
            searchInput.focus();
            searchInput.select();
          }
        });

        // Document click listener to close dropdown on clicking outside
        document.addEventListener('click', (e) => {
          if (!e.target.closest('#nav-search-container')) {
            searchDropdown.classList.add('hidden');
          }
        });
      }

      // Render search autocomplete matches
      function renderResults(matches, query) {
        searchDropdown.innerHTML = '';
        searchSelectedIndex = -1;

        if (matches.length === 0) {
          const noResults = document.createElement('div');
          noResults.className = 'search-dropdown-no-results';
          noResults.textContent = 'No matching calculators found';
          searchDropdown.appendChild(noResults);
          searchDropdown.classList.remove('hidden');
          return;
        }

        // Dropdown Header
        const header = document.createElement('div');
        header.className = 'search-dropdown-header';
        header.textContent = `Calculators (${matches.length})`;
        searchDropdown.appendChild(header);

        // Populate items
        matches.forEach((tool, index) => {
          const item = document.createElement('div');
          item.className = 'search-dropdown-item';
          item.setAttribute('data-index', index);

          // Highlight matching letters in title
          const titleEscaped = tool.name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
          const regex = new RegExp(`(${titleEscaped})`, 'gi');
          const highlightedName = tool.name.replace(regex, '<mark>$1</mark>');

          item.innerHTML = `
            <div class="search-item-title">${highlightedName}</div>
            <div class="search-item-meta">
              <span class="search-item-desc">${tool.desc}</span>
              <span class="search-item-tag">${tool.cat.replace('_', ' ')}</span>
            </div>
          `;

          // Handle selection click
          item.addEventListener('click', () => {
            // 1. Activate tab in category subnav if it exists
            if (tool.tabId) {
              const tabEl = document.getElementById(tool.tabId);
              if (tabEl) {
                tabEl.click();
              }
            }

            // 2. Scroll to target element and highlight it
            const targetEl = document.getElementById(tool.targetId);
            if (targetEl) {
              setTimeout(() => {
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Trigger row flash visual highlight
                targetEl.classList.remove('row-highlight-flash');
                void targetEl.offsetWidth; // Force element reflow
                targetEl.classList.add('row-highlight-flash');
              }, 180);
            }

            // Reset search input and dropdown
            searchInput.value = '';
            clearSearchBtn.style.display = 'none';
            searchDropdown.classList.add('hidden');
            searchDropdown.innerHTML = '';
            searchSelectedIndex = -1;
            searchInput.blur();
          });

          searchDropdown.appendChild(item);
        });

        searchDropdown.classList.remove('hidden');
      }

      // Update dropdown visual styling on arrow navigation
      function updateSearchSelection(items) {
        items.forEach((item, index) => {
          if (index === searchSelectedIndex) {
            item.classList.add('selected');
            item.scrollIntoView({ block: 'nearest' });
          } else {
            item.classList.remove('selected');
          }
        });
      }
      
      // ========================
      // VMATH CHATBOT LOGIC
      // ========================
      const chatFab = document.getElementById('vmath-chatbot-fab');
      const chatWindow = document.getElementById('vmath-chatbot-window');
      const chatCloseBtn = document.getElementById('vmath-chatbot-close');
      const chatInput = document.getElementById('vmath-chatbot-input');
      const chatSendBtn = document.getElementById('vmath-chatbot-send');
      const chatMessages = document.getElementById('vmath-chatbot-messages');

      if (chatFab && chatWindow && chatCloseBtn) {
        // Open chat
        chatFab.addEventListener('click', () => {
          chatWindow.classList.remove('hidden');
          chatFab.style.transform = 'scale(0)';
          chatFab.style.pointerEvents = 'none';
          chatInput.focus();
        });

        // Close chat
        chatCloseBtn.addEventListener('click', () => {
          chatWindow.classList.add('hidden');
          chatFab.style.transform = '';
          chatFab.style.pointerEvents = 'auto';
        });

        // Environment config loader
        async function loadConfig() {
          try {
            const response = await fetch('env.txt');
            if (!response.ok) throw new Error('Network response was not ok');
            const text = await response.text();
            const config = {};
            text.split('\n').forEach(line => {
              const match = line.match(/^([^=]+)=(.*)$/);
              if (match) {
                config[match[1].trim()] = match[2].trim();
              }
            });
            return config;
          } catch (error) {
            console.error("Could not load env.txt file. Are you running a local server?", error);
            return null;
          }
        }

        let chatHistory = [
          { role: "system", content: "You are VMath AI, a helpful engineering mathematics tutor and guide. Provide concise and accurate answers." }
        ];

        // Send message handler
        const handleSendMessage = async () => {
          const text = chatInput.value.trim();
          if (!text) return;

          // Add user message to UI
          const userMsg = document.createElement('div');
          userMsg.className = 'vmath-message vmath-message-user';
          userMsg.innerHTML = `
            <div class="vmath-message-avatar">U</div>
            <div class="vmath-message-bubble"><p>${text.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p></div>
          `;
          chatMessages.appendChild(userMsg);
          chatInput.value = '';
          chatMessages.scrollTop = chatMessages.scrollHeight;

          chatHistory.push({ role: "user", content: text });

          // Add bot loading bubble
          const botMsg = document.createElement('div');
          botMsg.className = 'vmath-message vmath-message-bot';
          botMsg.innerHTML = `
            <div class="vmath-message-avatar">✦</div>
            <div class="vmath-message-bubble"><p class="typing">Thinking...</p></div>
          `;
          chatMessages.appendChild(botMsg);
          chatMessages.scrollTop = chatMessages.scrollHeight;

          const config = await loadConfig();
          if (!config || !config.API_KEY || !config.AI_MODEL) {
            botMsg.querySelector('.vmath-message-bubble p').innerHTML = "I couldn't read the <code>env.txt</code> file. Make sure you are serving the site over HTTP and the file contains API_KEY and AI_MODEL.";
            chatHistory.pop(); // Remove user message from history if failed
            return;
          }

          try {
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${config.API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': window.location.href,
                'X-Title': 'VMath AI'
              },
              body: JSON.stringify({
                model: config.AI_MODEL,
                messages: chatHistory
              })
            });

            if (!response.ok) {
              const errText = await response.text();
              throw new Error(`API Error: ${response.status} - ${errText}`);
            }

            const data = await response.json();
            const botReply = data.choices[0].message.content;
            
            chatHistory.push({ role: "assistant", content: botReply });
            // Simple markdown-to-html for line breaks and bold
            let htmlReply = botReply.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            botMsg.querySelector('.vmath-message-bubble').innerHTML = `<p>${htmlReply}</p>`;
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
          } catch (error) {
            console.error("Chat error:", error);
            botMsg.querySelector('.vmath-message-bubble p').innerHTML = "Oops! Something went wrong connecting to the AI. " + error.message;
            chatHistory.pop(); // Remove user message from history if failed
          }
        };

        chatSendBtn.addEventListener('click', handleSendMessage);
        chatInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleSendMessage();
          }
        });
      }
    });
