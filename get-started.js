document.addEventListener('DOMContentLoaded', () => {
      // Theme Toggle Logic
      const themeToggleBtn = document.getElementById('theme-toggle');
      if(themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
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

      // Search Enter Key Logic
      const appSearch = document.getElementById('app-search');
      if (appSearch) {
        appSearch.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            const dropdown = document.getElementById('search-dropdown');
            if (dropdown && dropdown.style.display !== 'none') {
              const firstResult = dropdown.querySelector('.search-result-item');
              if (firstResult) firstResult.click();
            }
          }
        });
      }

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

          try {
            const response = await fetch('/api/chat', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                messages: chatHistory
              })
            });

            if (!response.ok) {
              const errData = await response.json().catch(() => ({}));
              throw new Error(errData.error || `API Error: ${response.status}`);
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

    const data = {
      1: [
        {
          category: 'Matrix Calculators',
          items: [
            { id: 'det', name: 'Determinant Calculator', icon: 'M4 4h16v16H4z' },
            { id: 'adjoint', name: 'Adjoint Calculator', icon: 'M4 6h16M4 12h16M4 18h7' },
            { id: 'inv', name: 'Inverse Matrix Calculator', icon: 'M8 7h8M8 11h8M8 15h8' },
            { id: 'echelon', name: 'Echelon Form Calculator', icon: 'M4 6h16M4 12h10M4 18h4' },
            { id: 'normal', name: 'Normal Form Calculator', icon: 'M3 3h18v18H3z' },
            { id: 'eigen', name: 'Eigenvalue & Eigenvector Calculator', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
            { id: 'diag', name: 'Diagonalization Calculator', icon: 'M4 4l16 16M4 20L20 4' },
            { id: 'matrix-power', name: 'Matrix Power Calculator', icon: 'M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' }
          ]
        },
        {
          category: 'Numerical Methods',
          items: [
            { id: 'gauss-jacobi', name: 'Gauss Jacobi Calculator', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
            { id: 'gauss-seidel', name: 'Gauss Seidel Calculator', icon: 'M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z' },
            { id: 'newton-raphson', name: 'Newton Raphson Calculator', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
            { id: 'false-position', name: 'False Position Calculator', icon: 'M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1v12z' }
          ]
        },
        {
          category: 'Numerical Integration',
          items: [
            { id: 'simpson-1-3', name: 'Simpson\'s 1/3 Rule Calculator', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z' },
            { id: 'simpson-3-8', name: 'Simpson\'s 3/8 Rule Calculator', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z' },
            { id: 'trapezoidal', name: 'Trapezoidal Rule Calculator', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z' }
          ]
        }
      ],
      2: [
        {
          category: 'Partial Differentiation',
          items: [
            { id: 'partial-diff', name: 'Partial Differentiation Calculator', icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01' },
            { id: 'maxima-minima', name: 'Maxima & Minima of Two Variables Calculator', icon: 'M3 3v18h18M7 16l4-8 4 4 4-8' }
          ]
        },
        {
          category: 'Differential Equations',
          items: [
            { id: 'euler', name: 'Euler Method Calculator', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
            { id: 'runge-kutta', name: 'Runge Kutta Method Calculator', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' }
          ]
        }
      ],
      3: [
        {
          category: 'Advanced Mathematics',
          items: [
            { id: 'adv-math', name: 'Advanced Mathematics Calculator', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' }
          ]
        }
      ]
    };

    function selectSem(sem, resetUI = true, fromHistory = false) {
      if(typeof currentSem !== 'undefined') currentSem = sem;
      if(resetUI) {
        const searchInput = document.getElementById('app-search');
        if(searchInput) searchInput.value = '';
      }

      // Update Active Button
      document.querySelectorAll('.sem-btn').forEach((btn, idx) => {
        if(idx + 1 === sem) btn.classList.add('active');
        else btn.classList.remove('active');
      });

      // Populate Sidebar
      const sidebar = document.getElementById('sidebar-content');
      sidebar.innerHTML = '';
      
      // Populate Overview UI
      const overview = document.getElementById('overview-ui');
      let overviewHtml = `<h2 style="font-family: 'Fraunces', serif; color: var(--navy); margin-bottom: 2rem; font-size: 2rem;">Semester ${sem} Tools</h2>`;
      
      const semData = data[sem];
      if(semData) {
        semData.forEach(section => {
          // Populate Sidebar HTML
          const secHtml = `
            <div class="sidebar-section">
              <div class="sidebar-title">${section.category}</div>
              <div class="calc-list">
                ${section.items.map(item => `
                  <div class="calc-item" onclick="openCalc('${item.id}', this)">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${item.icon}"></path></svg>
                    ${item.name}
                  </div>
                `).join('')}
              </div>
            </div>
          `;
          sidebar.innerHTML += secHtml;

          // Populate Overview HTML
          overviewHtml += `
            <div style="margin-bottom: 2.5rem; width: 100%;">
              <h3 style="color: var(--navy); margin-bottom: 1.5rem; border-bottom: 2px solid var(--border); padding-bottom: 0.75rem; font-size: 1.25rem;">${section.category}</h3>
              <div class="overview-grid" style="gap: 1.5rem;">
                ${section.items.map(item => `
                  <div class="card" style="padding: 1.5rem; cursor: pointer; border: 1px solid var(--border); border-radius: 12px; transition: all 0.2s; background: var(--white); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); margin-bottom: 0;" onclick="openCalc('${item.id}', null)" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 10px 15px -3px rgba(0, 0, 0, 0.1)';" onmouseout="this.style.transform='none'; this.style.boxShadow='0 4px 6px -1px rgba(0, 0, 0, 0.05)';">
                    <svg style="width:32px; height:32px; stroke:var(--amber); margin-bottom:1rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${item.icon}"></path></svg>
                    <div style="font-weight: 700; color: var(--navy); font-size: 1.1rem; line-height: 1.3;">${item.name}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          `;
        });
      }
      overview.innerHTML = overviewHtml;

      if(resetUI) {
        openCalc('none', null, fromHistory);
      } else if(typeof updateURL !== 'undefined' && !fromHistory) {
        updateURL(currentSem, currentCalc);
      }
    }

    function handleSearch(query) {
      query = query.toLowerCase().trim();
      const dropdown = document.getElementById('search-dropdown');
      dropdown.innerHTML = '';

      if (!query) {
        dropdown.style.display = 'none';
        return;
      }

      let allMatches = [];

      Object.values(data).forEach(semData => {
        semData.forEach(section => {
          section.items.forEach(item => {
            let score = 0;
            const nameLower = item.name.toLowerCase();
            const catLower = section.category.toLowerCase();
            
            if (nameLower === query) score = 4;
            else if (nameLower.startsWith(query)) score = 3;
            else if (nameLower.includes(query)) score = 2;
            else if (catLower.includes(query)) score = 1;

            if (score > 0) {
              allMatches.push({ item, category: section.category, score });
            }
          });
        });
      });

      // Sort by score descending
      allMatches.sort((a, b) => b.score - a.score);

      if (allMatches.length === 0) {
        dropdown.innerHTML = `<div style="padding: 1rem; color: var(--muted); font-size: 0.95rem; text-align: center;">No calculators found for "${query}"</div>`;
      } else {
        dropdown.innerHTML = allMatches.map(match => `
          <div class="calc-item search-result-item" style="border-radius: 0; border-bottom: 1px solid var(--border); margin: 0; padding: 1rem;" onclick="openCalc('${match.item.id}', null); document.getElementById('search-dropdown').style.display='none'; document.getElementById('app-search').value='';">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin-right: 8px;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${match.item.icon}"></path></svg>
            <div>
              <div style="font-weight: 600; color: var(--navy); line-height: 1;">${match.item.name}</div>
              <div style="font-size: 0.75rem; color: var(--muted); margin-top: 4px;">${match.category}</div>
            </div>
          </div>
        `).join('');
      }
      dropdown.style.display = 'flex';
    }

    // Hide dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.header-search')) {
        const dropdown = document.getElementById('search-dropdown');
        if (dropdown) dropdown.style.display = 'none';
      }
    });

    function openCalc(calcId, element, fromHistory = false) {
      if(typeof currentCalc !== 'undefined') currentCalc = calcId;
      // Update sidebar active state
      document.querySelectorAll('.calc-item').forEach(el => el.classList.remove('active'));
      if(element) {
        element.classList.add('active');
      } else if (calcId !== 'none') {
        // Find element by onclick text
        document.querySelectorAll('.calc-item').forEach(el => {
          if(el.getAttribute('onclick') && el.getAttribute('onclick').includes(`'${calcId}'`)) {
            el.classList.add('active');
          }
        });
      }

      // Hide all containers
      document.getElementById('overview-ui').style.display = 'none';
      document.getElementById('matrix-calc-ui').classList.remove('active');
      document.getElementById('steps-output').classList.remove('active');

      // Toggle elements based on whether it is Gauss Jacobi
      const standardDim = document.getElementById('standard-dim-selector');
      const jacobiDim = document.getElementById('jacobi-dim-selector');
      const standardWrapper = document.getElementById('standard-matrix-wrapper');
      const jacobiWrapper = document.getElementById('jacobi-grid-container');
      const newtonWrapper = document.getElementById('newton-input-container');
      const falsePositionWrapper = document.getElementById('false-position-input-container');
      const integrationWrapper = document.getElementById('integration-input-container');

      if (standardDim) standardDim.style.display = 'none';
      if (jacobiDim) jacobiDim.style.display = 'none';
      if (standardWrapper) standardWrapper.style.display = 'none';
      if (jacobiWrapper) jacobiWrapper.style.display = 'none';
      if (newtonWrapper) newtonWrapper.style.display = 'none';
      if (falsePositionWrapper) falsePositionWrapper.style.display = 'none';
      if (integrationWrapper) integrationWrapper.style.display = 'none';

      if(calcId === 'none') {
        document.getElementById('overview-ui').style.display = 'flex';
      } else {
        let calcName = 'Calculator';
        Object.values(data).forEach(semData => {
          semData.forEach(section => {
            let item = section.items.find(i => i.id === calcId);
            if(item) calcName = item.name;
          });
        });

        document.getElementById('matrix-calc-title').innerText = calcName;
        document.getElementById('matrix-calc-ui').classList.add('active');

        let desc = 'Enter the matrix values below to perform the calculation.';
        if (calcId === 'gauss-jacobi') {
          desc = 'Enter the system of equations and iteration parameters to solve using the Gauss Jacobi Method.';
        } else if (calcId === 'gauss-seidel') {
          desc = 'Enter the system of equations and iteration parameters to solve using the Gauss Seidel Method.';
        } else if (calcId === 'newton-raphson') {
          desc = 'Enter the function and initial guess to approximate the root using Newton Raphson.';
        } else if (calcId === 'false-position') {
          desc = 'Enter the function and interval bounds to locate the root using the False Position Method.';
        } else if (calcId === 'trapezoidal') {
          desc = 'Enter the function, limits, and intervals to perform numerical integration using the Trapezoidal Rule.';
        } else if (calcId === 'simpson-1-3') {
          desc = "Enter the function, limits, and intervals to perform numerical integration using Simpson's 1/3 Rule.";
        } else if (calcId === 'simpson-3-8') {
          desc = "Enter the function, limits, and intervals to perform numerical integration using Simpson's 3/8 Rule.";
        }
        const descEl = document.getElementById('matrix-calc-desc');
        if (descEl) descEl.innerText = desc;

        if(calcId === 'gauss-jacobi' || calcId === 'gauss-seidel') {
          if (jacobiDim) jacobiDim.style.display = 'flex';
          if (jacobiWrapper) jacobiWrapper.style.display = 'flex';
          renderJacobiInputs();
        } else if (calcId === 'newton-raphson') {
          if (newtonWrapper) newtonWrapper.style.display = 'flex';
        } else if (calcId === 'false-position') {
          if (falsePositionWrapper) falsePositionWrapper.style.display = 'flex';
        } else if (calcId === 'trapezoidal' || calcId === 'simpson-1-3' || calcId === 'simpson-3-8') {
          if (integrationWrapper) integrationWrapper.style.display = 'flex';
          const reqNote = document.getElementById('integration-requirement-note');
          if (reqNote) {
            if (calcId === 'simpson-1-3') {
              reqNote.innerHTML = `<span style="color: #d97706; display: flex; align-items: center; gap: 4px;">⚠️ Simpson's 1/3 Rule requires an even number of intervals (n).</span>`;
            } else if (calcId === 'simpson-3-8') {
              reqNote.innerHTML = `<span style="color: #d97706; display: flex; align-items: center; gap: 4px;">⚠️ Simpson's 3/8 Rule requires intervals (n) to be a multiple of 3.</span>`;
            } else {
              reqNote.innerHTML = `<span style="color: var(--teal); display: flex; align-items: center; gap: 4px;">✓ Trapezoidal Rule works with any interval count (n).</span>`;
            }
          }
        } else {
          if (standardDim) standardDim.style.display = 'flex';
          if (standardWrapper) standardWrapper.style.display = 'inline-block';
          renderMatrixInputs();
        }
        
        // Scroll down
        document.querySelector('.main-area').scrollTo({ top: 0, behavior: 'smooth' });
      }
      
      if(typeof updateURL !== 'undefined' && !fromHistory) {
        updateURL(currentSem, currentCalc);
      }
    }

    // Global State & History Management
    let currentSem = 1;
    let currentCalc = 'none';

    // Matrix Dimension Logic
    let currentMatrixRows = 3;
    let currentMatrixCols = 3;

    // Gauss Jacobi Dynamic Input State & Builders
    let currentJacobiDim = 3;

    function updateURL(sem, calc) {
      const url = new URL(window.location);
      url.searchParams.set('sem', sem);
      if (calc && calc !== 'none') {
        url.searchParams.set('calc', calc);
      } else {
        url.searchParams.delete('calc');
      }
      if(window.location.search !== url.search) {
        window.history.pushState({ sem, calc }, '', url);
      }
    }

    window.addEventListener('popstate', (e) => {
      if(e.state) {
        selectSem(e.state.sem, false, true);
        openCalc(e.state.calc || 'none', null, true);
      }
    });

    // Initialize from URL or default to Sem 1
    const initParams = new URLSearchParams(window.location.search);
    const initSem = parseInt(initParams.get('sem')) || 1;
    const initCalc = initParams.get('calc') || 'none';
    
    // Call without pushing history initially
    selectSem(initSem, false, true);
    openCalc(initCalc, null, true);
    window.history.replaceState({ sem: initSem, calc: initCalc }, '', window.location);



    function renderMatrixInputs() {
      const container = document.getElementById('matrix-grid-container');
      if(!container) return;
      container.style.gridTemplateColumns = `repeat(${currentMatrixCols}, 1fr)`;
      let html = '';
      for(let i=0; i<currentMatrixRows; i++) {
        for(let j=0; j<currentMatrixCols; j++) {
          // try to preserve value if element exists
          let existing = document.getElementById(`m${i}${j}`);
          let val = existing ? existing.value : (i === j ? 1 : 0);
          html += `<input type="number" class="matrix-cell" id="m${i}${j}" value="${val}">`;
        }
      }
      container.innerHTML = html;
      document.getElementById('dim-rows').innerText = currentMatrixRows;
      document.getElementById('dim-cols').innerText = currentMatrixCols;
    }

    function changeDim(type, delta) {
      if(type === 'rows') {
        currentMatrixRows = Math.max(1, Math.min(6, currentMatrixRows + delta));
      } else {
        currentMatrixCols = Math.max(1, Math.min(6, currentMatrixCols + delta));
      }
      renderMatrixInputs();
    }

    // Initialize dimensions
    renderMatrixInputs();



    function renderJacobiInputs() {
      const containerA = document.getElementById('jacobi-matrix-a');
      const containerB = document.getElementById('jacobi-vector-b');
      const containerX0 = document.getElementById('jacobi-vector-x0');
      if(!containerA || !containerB || !containerX0) return;

      containerA.style.gridTemplateColumns = `repeat(${currentJacobiDim}, 1fr)`;
      containerB.style.gridTemplateColumns = `1fr`;
      containerX0.style.gridTemplateColumns = `1fr`;

      let htmlA = '';
      let htmlB = '';
      let htmlX0 = '';

      for(let i=0; i<currentJacobiDim; i++) {
        // Matrix A row i
        for(let j=0; j<currentJacobiDim; j++) {
          let existing = document.getElementById(`ja_${i}_${j}`);
          let val = existing ? existing.value : (i === j ? 10 : 1);
          htmlA += `<input type="number" class="matrix-cell" id="ja_${i}_${j}" value="${val}" oninput="updateJacobiEquationsPreview()">`;
        }

        // Vector B
        let existingB = document.getElementById(`jb_${i}`);
        let valB = existingB ? existingB.value : (10 + i * 2);
        htmlB += `<input type="number" class="matrix-cell" id="jb_${i}" value="${valB}" oninput="updateJacobiEquationsPreview()">`;

        // Vector X0
        let existingX0 = document.getElementById(`jx0_${i}`);
        let valX0 = existingX0 ? existingX0.value : 0;
        htmlX0 += `<input type="number" class="matrix-cell" id="jx0_${i}" value="${valX0}">`;
      }

      containerA.innerHTML = htmlA;
      containerB.innerHTML = htmlB;
      containerX0.innerHTML = htmlX0;
      
      const dimLabel = document.getElementById('dim-jacobi');
      if (dimLabel) dimLabel.innerText = currentJacobiDim;
      
      updateJacobiEquationsPreview();
    }

    function changeDimJacobi(delta) {
      currentJacobiDim = Math.max(2, Math.min(10, currentJacobiDim + delta));
      renderJacobiInputs();
    }

    function updateJacobiEquationsPreview() {
      const container = document.getElementById('jacobi-equations-content');
      if (!container) return;
      
      let html = '';
      const vars = ['x₁', 'x₂', 'x₃', 'x₄', 'x₅', 'x₆', 'x₇', 'x₈', 'x₉', 'x₁₀'];
      for(let i=0; i<currentJacobiDim; i++) {
        let eq = '';
        for(let j=0; j<currentJacobiDim; j++) {
          let aInput = document.getElementById(`ja_${i}_${j}`);
          let val = aInput ? (parseFloat(aInput.value) || 0) : 0;
          let varName = vars[j] || `x${j+1}`;
          
          if (j === 0) {
            eq += `<span style="color:var(--amber);font-weight:700;">${val}</span><span style="color:var(--navy);font-weight:600;">${varName}</span>`;
          } else {
            if (val >= 0) {
              eq += ` + <span style="color:var(--amber);font-weight:700;">${val}</span><span style="color:var(--navy);font-weight:600;">${varName}</span>`;
            } else {
              eq += ` - <span style="color:var(--amber);font-weight:700;">${Math.abs(val)}</span><span style="color:var(--navy);font-weight:600;">${varName}</span>`;
            }
          }
        }
        let bInput = document.getElementById(`jb_${i}`);
        let bVal = bInput ? (parseFloat(bInput.value) || 0) : 0;
        eq += ` = <span style="color:var(--teal);font-weight:700;">${bVal}</span>`;
        html += `<div>${eq}</div>`;
      }
      container.innerHTML = html;
    }
    window.updateJacobiEquationsPreview = updateJacobiEquationsPreview;

    // Keyboard Navigation for Matrix Inputs (Enter Key)
    document.addEventListener('keydown', (e) => {
      if(e.key === 'Enter' && e.target.classList.contains('matrix-cell')) {
        e.preventDefault();
        let cells = Array.from(document.querySelectorAll('.matrix-cell'));
        let index = cells.indexOf(e.target);
        if(index > -1 && index < cells.length - 1) {
          cells[index + 1].focus();
          cells[index + 1].select();
        } else if (index === cells.length - 1) {
          // Auto calculate on last cell Enter
          calculateMatrix();
        }
      }
    });

    // Fraction Helpers
    function gcd(a, b) {
      a = Math.abs(a); b = Math.abs(b);
      return b === 0 ? a : gcd(b, a % b);
    }
    function makeFrac(n, d = 1) {
      if(d === 0) return {n: 0, d: 1};
      let sign = (n < 0 ? -1 : 1) * (d < 0 ? -1 : 1);
      n = Math.abs(n); d = Math.abs(d);
      let g = gcd(n, d);
      return { n: sign * (n / g), d: d / g };
    }
    function addFrac(a, b) { return makeFrac(a.n * b.d + b.n * a.d, a.d * b.d); }
    function subFrac(a, b) { return makeFrac(a.n * b.d - b.n * a.d, a.d * b.d); }
    function mulFrac(a, b) { return makeFrac(a.n * b.n, a.d * b.d); }
    function divFrac(a, b) { return makeFrac(a.n * b.d, a.d * b.n); }
    function isZeroFrac(a) { return a.n === 0; }
    function formatFrac(a) { return a.d === 1 ? `${a.n}` : `${a.n}/${a.d}`; }

    // Matrix Formatting Helper (HTML Grid with brackets)
    function formatMatrix(m) {
      let rows = m.length;
      let cols = m[0].length;
      let html = `<div class="display-matrix-wrapper"><div class="display-matrix" style="grid-template-columns: repeat(${cols}, 1fr);">`;
      for(let i=0; i<rows; i++) {
        for(let j=0; j<cols; j++) {
          let val = m[i][j];
          if(typeof val === 'object' && val.d !== undefined) {
            html += `<div>${formatFrac(val)}</div>`;
          } else {
            html += `<div>${Math.round(val*100)/100}</div>`;
          }
        }
      }
      html += '</div></div>';
      return html;
    }

    // Rank Calculation Logic
    function calculateMatrix() {
      if (currentCalc === 'gauss-jacobi') {
        calculateGaussIterative('jacobi');
        return;
      } else if (currentCalc === 'gauss-seidel') {
        calculateGaussIterative('seidel');
        return;
      } else if (currentCalc === 'newton-raphson') {
        calculateNewtonRaphson();
        return;
      } else if (currentCalc === 'false-position') {
        calculateFalsePosition();
        return;
      } else if (currentCalc === 'trapezoidal' || currentCalc === 'simpson-1-3' || currentCalc === 'simpson-3-8') {
        calculateIntegration();
        return;
      }
      const output = document.getElementById('steps-output');
      output.innerHTML = '';
      output.classList.add('active');
      
      // Read values
      let m = [];
      let rows = currentMatrixRows;
      let cols = currentMatrixCols;
      for(let i=0; i<rows; i++) {
        let row = [];
        for(let j=0; j<cols; j++) {
          row.push(parseFloat(document.getElementById(`m${i}${j}`).value) || 0);
        }
        m.push(row);
      }

      let stepsHtml = '';
      let stepCount = 1;

      function addStep(title, desc, beforeMatrix, afterMatrix) {
        let targetMatrix = afterMatrix || beforeMatrix;
        stepsHtml += `
          <div class="step-card">
            <div class="step-header">
              <div class="step-number">${stepCount++}</div>
              <div class="step-title">${title}</div>
            </div>
            <div class="step-desc" style="text-align: center; font-size: 1.05rem; margin-bottom: 1.5rem;">${desc}</div>
            <div style="text-align: center; margin-top: 1rem;">${formatMatrix(targetMatrix)}</div>
          </div>
        `;
      }

      addStep("Initial Matrix", `We start with the given ${rows}x${cols} matrix.`, null, JSON.parse(JSON.stringify(m)));

      // Dispatcher logic
      if (currentCalc === 'normal') {
        let r = 0;
        let fracM = [];
        for(let i=0; i<rows; i++) {
          let row = [];
          for(let j=0; j<cols; j++) {
            let val = parseFloat(document.getElementById(`m${i}${j}`).value) || 0;
            let valStr = Math.abs(val).toString();
            if(valStr.includes('.')) {
              let dec = valStr.split('.')[1].length;
              row.push(makeFrac(Math.round(val * Math.pow(10, dec)), Math.pow(10, dec)));
            } else {
              row.push(makeFrac(val, 1));
            }
          }
          fracM.push(row);
        }
        
        let mObj = fracM;
        let limit = Math.min(rows, cols);

        for (let p = 0; p < limit; p++) {
          // 1. Search for a pivot in the current column p (from row p downwards)
          let pivotRow = -1;
          
          // First, try to find a 1 or -1 to avoid fractions
          for (let i = p; i < rows; i++) {
            let val = mObj[i][p];
            if (val.n !== 0 && val.d === 1 && Math.abs(val.n) === 1) {
              pivotRow = i;
              break;
            }
          }
          
          // If no 1 or -1, find the first non-zero element in column p
          if (pivotRow === -1) {
            for (let i = p; i < rows; i++) {
              if (mObj[i][p].n !== 0) {
                pivotRow = i;
                break;
              }
            }
          }

          let pivotCol = p;
          
          // If column p is completely zero, search other columns for a non-zero element
          if (pivotRow === -1) {
            let found = false;
            for (let j = p + 1; j < cols; j++) {
              for (let i = p; i < rows; i++) {
                if (mObj[i][j].n !== 0) {
                  pivotRow = i;
                  pivotCol = j;
                  found = true;
                  break;
                }
              }
              if (found) break;
            }
            if (!found) break; // Entire remaining submatrix is zero. Rank is found.
          }

          // Swap Rows if necessary
          if (pivotRow !== p) {
            let beforeM = JSON.parse(JSON.stringify(mObj));
            let temp = mObj[p]; mObj[p] = mObj[pivotRow]; mObj[pivotRow] = temp;
            addStep("Row Swap", `<b>R${p+1} ↔ R${pivotRow+1}</b>`, beforeM, JSON.parse(JSON.stringify(mObj)));
          }
          
          // Swap Cols if necessary (Only happens if entire column was zero)
          if (pivotCol !== p) {
            let beforeM = JSON.parse(JSON.stringify(mObj));
            for (let i = 0; i < rows; i++) { let temp = mObj[i][p]; mObj[i][p] = mObj[i][pivotCol]; mObj[i][pivotCol] = temp; }
            addStep("Column Swap", `<b>C${p+1} ↔ C${pivotCol+1}</b>`, beforeM, JSON.parse(JSON.stringify(mObj)));
          }

          let pivotVal = mObj[p][p];
          if (pivotVal.n !== 1 || pivotVal.d !== 1) {
            let beforeM = JSON.parse(JSON.stringify(mObj));
            for (let j = 0; j < cols; j++) mObj[p][j] = divFrac(mObj[p][j], pivotVal);
            addStep("Scale Row to Create Leading 1", `<b>R${p+1} = R${p+1} / (${formatFrac(pivotVal)})</b>`, beforeM, JSON.parse(JSON.stringify(mObj)));
          }

          let eliminatedRow = false;
          let beforeMRow = JSON.parse(JSON.stringify(mObj));
          let rowOps = [];
          for (let i = p + 1; i < rows; i++) {
            let factor = mObj[i][p];
            if (!isZeroFrac(factor)) {
              for (let j = 0; j < cols; j++) mObj[i][j] = subFrac(mObj[i][j], mulFrac(factor, mObj[p][j]));
              eliminatedRow = true;
              let opStr = factor.n < 0 ? `+ ${formatFrac(makeFrac(Math.abs(factor.n), factor.d))}` : `- ${formatFrac(factor)}`;
              rowOps.push(`R${i+1} = R${i+1} ${opStr} * R${p+1}`);
            }
          }
          if (eliminatedRow) {
            addStep(`Eliminate entries below Leading 1 in C${p+1}`, "<b>" + rowOps.join('<br>') + "</b>", beforeMRow, JSON.parse(JSON.stringify(mObj)));
          }

          let eliminatedCol = false;
          let beforeMCol = JSON.parse(JSON.stringify(mObj));
          let colOps = [];
          for (let j = p + 1; j < cols; j++) {
            let factor = mObj[p][j];
            if (!isZeroFrac(factor)) {
              for (let i = 0; i < rows; i++) mObj[i][j] = subFrac(mObj[i][j], mulFrac(factor, mObj[i][p]));
              eliminatedCol = true;
              let opStr = factor.n < 0 ? `+ ${formatFrac(makeFrac(Math.abs(factor.n), factor.d))}` : `- ${formatFrac(factor)}`;
              colOps.push(`C${j+1} = C${j+1} ${opStr} * C${p+1}`);
            }
          }
          if (eliminatedCol) {
            addStep(`Eliminate entries to the right in R${p+1}`, "<b>" + colOps.join('<br>') + "</b>", beforeMCol, JSON.parse(JSON.stringify(mObj)));
          }
          r++;
        }
        stepsHtml += `<div class="final-result">The Matrix is in Normal Form. Rank = <span>${r}</span></div>`;
        output.innerHTML = stepsHtml;
        output.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      // Default logic (Gaussian for Rank)
      // Step 1: Pivot at (0,0) (Generic logic - Note: currently only built for 3x3)
      if(Math.abs(m[0][0]) < 1e-9 && rows > 0 && cols > 0) {
        let beforeM = JSON.parse(JSON.stringify(m));
        // Swap with row 1 or 2
        if(rows > 1 && Math.abs(m[1][0]) > 1e-9) {
          let temp = m[0]; m[0] = m[1]; m[1] = temp;
          addStep("Row Swap", "<b>R1 ↔ R2</b>", beforeM, JSON.parse(JSON.stringify(m)));
        } else if(Math.abs(m[2][0]) > 1e-9) {
          let temp = m[0]; m[0] = m[2]; m[2] = temp;
          addStep("Row Swap", "<b>R1 ↔ R3</b>", beforeM, JSON.parse(JSON.stringify(m)));
        }
      }

      // Eliminate col 0
      if(Math.abs(m[0][0]) > 1e-9) {
        let beforeM = JSON.parse(JSON.stringify(m));
        let eliminated = false;
        let p = m[0][0];
        let desc = [];
        if(Math.abs(m[1][0]) > 1e-9) {
          let factor = m[1][0] / p;
          for(let j=0; j<3; j++) m[1][j] -= factor * beforeM[0][j];
          let factorStr = Math.round(factor * 100) / 100;
          let op = factorStr < 0 ? `R2 = R2 + ${Math.abs(factorStr)} * R1` : `R2 = R2 - ${factorStr} * R1`;
          desc.push(op);
          eliminated = true;
        }
        if(Math.abs(m[2][0]) > 1e-9) {
          let factor = m[2][0] / p;
          for(let j=0; j<3; j++) m[2][j] -= factor * beforeM[0][j];
          let factorStr = Math.round(factor * 100) / 100;
          let op = factorStr < 0 ? `R3 = R3 + ${Math.abs(factorStr)} * R1` : `R3 = R3 - ${factorStr} * R1`;
          desc.push(op);
          eliminated = true;
        }
        if(eliminated) {
          // round near zero
          for(let i=1;i<3;i++) for(let j=0;j<3;j++) if(Math.abs(m[i][j]) < 1e-9) m[i][j] = 0;
          addStep("Eliminate Column 1", "<b>" + desc.join('<br>') + "</b>", beforeM, JSON.parse(JSON.stringify(m)));
        }
      }

      // Pivot at (1,1)
      if(Math.abs(m[1][1]) < 1e-9 && Math.abs(m[2][1]) > 1e-9) {
         let beforeM = JSON.parse(JSON.stringify(m));
         let temp = m[1]; m[1] = m[2]; m[2] = temp;
         addStep("Row Swap", "<b>R2 ↔ R3</b>", beforeM, JSON.parse(JSON.stringify(m)));
      }

      // Eliminate col 1
      if(Math.abs(m[1][1]) > 1e-9) {
        let beforeM = JSON.parse(JSON.stringify(m));
        if(Math.abs(m[2][1]) > 1e-9) {
          let factor = m[2][1] / m[1][1];
          for(let j=0; j<3; j++) m[2][j] -= factor * beforeM[1][j];
          // round near zero
          for(let j=0;j<3;j++) if(Math.abs(m[2][j]) < 1e-9) m[2][j] = 0;
          let factorStr = Math.round(factor * 100) / 100;
          let op = factorStr < 0 ? `R3 = R3 + ${Math.abs(factorStr)} * R2` : `R3 = R3 - ${factorStr} * R2`;
          addStep("Eliminate Column 2", `<b>${op}</b>`, beforeM, JSON.parse(JSON.stringify(m)));
        }
      }

      // Count rank
      let rank = 0;
      for(let i=0; i<3; i++) {
        let isNonZero = false;
        for(let j=0; j<3; j++) {
          m[i][j] = Math.round(m[i][j] * 100) / 100; // Format for display
          if(Math.abs(m[i][j]) > 1e-9) isNonZero = true;
        }
        if(isNonZero) rank++;
      }

      stepsHtml += `
        <div class="final-result">
          The Rank of the Matrix is <span>${rank}</span>
        </div>
      `;

      output.innerHTML = stepsHtml;
      
      // Scroll to steps
      output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // ==========================================
    // GAUSS JACOBI MATHEMATICAL & LOGIC ENGINE
    // ==========================================

    function getDeterminant(matrix) {
      let n = matrix.length;
      let m = JSON.parse(JSON.stringify(matrix));
      let det = 1;
      for (let i = 0; i < n; i++) {
        let pivot = i;
        for (let j = i + 1; j < n; j++) {
          if (Math.abs(m[j][i]) > Math.abs(m[pivot][i])) {
            pivot = j;
          }
        }
        if (Math.abs(m[pivot][i]) < 1e-12) return 0;
        if (pivot !== i) {
          let temp = m[i]; m[i] = m[pivot]; m[pivot] = temp;
          det *= -1;
        }
        det *= m[i][i];
        for (let j = i + 1; j < n; j++) {
          let factor = m[j][i] / m[i][i];
          for (let k = i; k < n; k++) {
            m[j][k] -= factor * m[i][k];
          }
        }
      }
      return det;
    }

    function toggleStep(header) {
      const card = header.closest('.step-card');
      const content = card.querySelector('.step-content');
      const icon = header.querySelector('.step-toggle-icon');
      if (content.style.display === 'none') {
        content.style.display = 'block';
        if (icon) icon.style.transform = 'rotate(0deg)';
      } else {
        content.style.display = 'none';
        if (icon) icon.style.transform = 'rotate(-90deg)';
      }
    }

    function getVarName(idx, total) {
      if (total <= 3) {
        return ['x', 'y', 'z'][idx];
      } else {
        return `x<sub>${idx + 1}</sub>`;
      }
    }

    function formatEquation(rowA, valB, total) {
      let parts = [];
      for (let j = 0; j < total; j++) {
        let coef = rowA[j];
        if (coef === 0) continue;
        let varName = getVarName(j, total);
        let sign = '';
        if (parts.length > 0) {
          sign = coef >= 0 ? ' + ' : ' - ';
        } else {
          sign = coef >= 0 ? '' : '-';
        }
        let absCoef = Math.abs(coef);
        let coefStr = absCoef === 1 ? '' : absCoef;
        parts.push(`${sign}${coefStr}${varName}`);
      }
      return parts.join('') + ` = ${valB}`;
    }

    function isDiagonallyDominant(A) {
      let n = A.length;
      for (let i = 0; i < n; i++) {
        let diag = Math.abs(A[i][i]);
        let offDiag = 0;
        for (let j = 0; j < n; j++) {
          if (i !== j) offDiag += Math.abs(A[i][j]);
        }
        if (diag < offDiag) return false;
      }
      return true;
    }

    function findBestPermutation(A) {
      let n = A.length;
      
      if (n <= 6) {
        let bestP = null;
        let bestDominantRows = -1;
        let bestMarginSum = -Infinity;

        function permute(p, used) {
          if (p.length === n) {
            let dominantRows = 0;
            let marginSum = 0;
            for (let i = 0; i < n; i++) {
              let r = p[i];
              let diagVal = Math.abs(A[r][i]);
              let offDiagSum = 0;
              for (let j = 0; j < n; j++) {
                if (i !== j) offDiagSum += Math.abs(A[r][j]);
              }
              marginSum += (diagVal - offDiagSum);
              if (diagVal >= offDiagSum) dominantRows++;
            }

            if (dominantRows > bestDominantRows) {
              bestDominantRows = dominantRows;
              bestMarginSum = marginSum;
              bestP = [...p];
            } else if (dominantRows === bestDominantRows && marginSum > bestMarginSum) {
              bestMarginSum = marginSum;
              bestP = [...p];
            }
            return;
          }

          for (let i = 0; i < n; i++) {
            if (!used[i]) {
              used[i] = true;
              p.push(i);
              permute(p, used);
              p.pop();
              used[i] = false;
            }
          }
        }

        permute([], new Array(n).fill(false));
        return bestP;
      } else {
        let p = new Array(n).fill(-1);
        let rowUsed = new Array(n).fill(false);
        for (let col = 0; col < n; col++) {
          let maxVal = -1;
          let bestRow = -1;
          for (let row = 0; row < n; row++) {
            if (!rowUsed[row]) {
              let val = Math.abs(A[row][col]);
              if (val > maxVal) {
                maxVal = val;
                bestRow = row;
              }
            }
          }
          if (bestRow !== -1) {
            p[col] = bestRow;
            rowUsed[bestRow] = true;
          }
        }
        for (let col = 0; col < n; col++) {
          if (p[col] === -1) {
            for (let row = 0; row < n; row++) {
              if (!rowUsed[row]) {
                p[col] = row;
                rowUsed[row] = true;
                break;
              }
            }
          }
        }
        return p;
      }
    }

    function calculateGaussIterative(method) {
      const output = document.getElementById('steps-output');
      output.innerHTML = '';
      output.classList.add('active');

      let n = currentJacobiDim;
      let A = [];
      let B = [];
      let X0 = [];

      let hasInvalid = false;
      let hasEmpty = false;
      for (let i = 0; i < n; i++) {
        let row = [];
        for (let j = 0; j < n; j++) {
          let valStr = document.getElementById(`ja_${i}_${j}`).value.trim();
          if (valStr === '') { hasEmpty = true; }
          let val = parseFloat(valStr);
          if (isNaN(val) || !isFinite(val)) { hasInvalid = true; }
          row.push(val);
        }
        A.push(row);

        let valBStr = document.getElementById(`jb_${i}`).value.trim();
        if (valBStr === '') { hasEmpty = true; }
        let valB = parseFloat(valBStr);
        if (isNaN(valB) || !isFinite(valB)) { hasInvalid = true; }
        B.push(valB);

        let valX0Str = document.getElementById(`jx0_${i}`).value.trim();
        if (valX0Str === '') { hasEmpty = true; }
        let valX0 = parseFloat(valX0Str);
        if (isNaN(valX0) || !isFinite(valX0)) { hasInvalid = true; }
        X0.push(valX0);
      }

      let tolerance = parseFloat(document.getElementById('jacobi-tolerance').value);
      let maxIter = parseInt(document.getElementById('jacobi-max-iter').value);

      if (isNaN(tolerance) || tolerance <= 0 || tolerance > 1) {
        output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Invalid Tolerance</div></div><div class="step-desc">Tolerance must be a positive number less than or equal to 1.</div></div>`;
        output.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      if (isNaN(maxIter) || maxIter < 1 || maxIter > 500) {
        output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Invalid Max Iterations</div></div><div class="step-desc">Maximum iterations must be an integer between 1 and 500.</div></div>`;
        output.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      let decimalsVal = document.getElementById('jacobi-decimals').value.trim();
      let decimals = parseInt(decimalsVal);
      if (isNaN(decimals) || !/^\d+$/.test(decimalsVal) || decimals < 0 || decimals > 15) {
        output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Invalid Decimal Places</div></div><div class="step-desc">Decimal places must be an integer between 0 and 15.</div></div>`;
        output.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      if (hasEmpty || hasInvalid) {
        output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Invalid Matrix Entries</div></div><div class="step-desc">Please ensure all cells are filled with valid numeric values.</div></div>`;
        output.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      let solverLabelName = method === 'seidel' ? "Gauss-Seidel" : "Gauss-Jacobi";

      let zeroDiags = [];
      for (let i = 0; i < n; i++) {
        if (Math.abs(A[i][i]) < 1e-12) {
          zeroDiags.push(i + 1);
        }
      }

      let origDet = getDeterminant(A);
      if (Math.abs(origDet) < 1e-12) {
        output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626; font-size: 1.25rem;">Critical Error: Singular Matrix</div></div><div class="step-desc" style="font-size: 1rem;">The coefficient matrix A is singular (determinant = 0). A singular matrix does not have a unique solution, so ${solverLabelName} cannot solve this system.</div></div>`;
        output.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      let origDominant = isDiagonallyDominant(A);
      let rearrangedPerformed = false;
      let finalA = JSON.parse(JSON.stringify(A));
      let finalB = [...B];
      let perm = Array.from({length: n}, (_, i) => i);

      let bestP = findBestPermutation(A);
      let isDifferent = false;
      for (let i = 0; i < n; i++) {
        if (bestP[i] !== i) {
          isDifferent = true;
          break;
        }
      }

      if (isDifferent) {
        let origDomRows = 0;
        for (let i = 0; i < n; i++) {
          let diag = Math.abs(A[i][i]);
          let offDiag = 0;
          for (let j = 0; j < n; j++) {
            if (i !== j) offDiag += Math.abs(A[i][j]);
          }
          if (diag >= offDiag) origDomRows++;
        }

        let newDomRows = 0;
        for (let i = 0; i < n; i++) {
          let originalRowIdx = bestP[i];
          let diagVal = Math.abs(A[originalRowIdx][i]);
          let offDiagSum = 0;
          for (let j = 0; j < n; j++) {
            if (i !== j) offDiagSum += Math.abs(A[originalRowIdx][j]);
          }
          if (diagVal >= offDiagSum) newDomRows++;
        }

        if (newDomRows > origDomRows || (!origDominant && newDomRows === n)) {
          rearrangedPerformed = true;
          perm = bestP;
          finalA = [];
          finalB = [];
          for (let i = 0; i < n; i++) {
            finalA.push(A[perm[i]]);
            finalB.push(B[perm[i]]);
          }
        }
      }

      let finalZeroDiags = [];
      for (let i = 0; i < n; i++) {
        if (Math.abs(finalA[i][i]) < 1e-12) {
          finalZeroDiags.push(i + 1);
        }
      }
      if (finalZeroDiags.length > 0) {
        output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626; font-size: 1.25rem;">Critical Error: Division by Zero</div></div><div class="step-desc" style="font-size: 1rem;">Zero diagonal entries detected at Row(s): <b>${finalZeroDiags.join(', ')}</b> of the arranged matrix.</div></div>`;
        output.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      let isFinalDominant = isDiagonallyDominant(finalA);
      let diagDominanceDetails = [];
      for (let i = 0; i < n; i++) {
        let diagVal = Math.abs(finalA[i][i]);
        let offDiagSum = 0;
        let sumExpr = [];
        for (let j = 0; j < n; j++) {
          if (i !== j) {
            offDiagSum += Math.abs(finalA[i][j]);
            sumExpr.push(`|${finalA[i][j]}|`);
          }
        }
        let conditionMet = diagVal > offDiagSum;
        diagDominanceDetails.push({
          row: i + 1,
          diag: diagVal,
          sum: offDiagSum,
          expr: sumExpr.join(' + ') || '0',
          met: conditionMet
        });
      }

      let beta = [];
      let sassenfeldDetails = [];
      let maxBeta = 0;
      for (let i = 0; i < n; i++) {
        let diagVal = Math.abs(finalA[i][i]);
        let sum = 0;
        let sassenfeldExprParts = [];
        for (let j = 0; j < i; j++) {
          sum += Math.abs(finalA[i][j]) * beta[j];
          sassenfeldExprParts.push(`|${finalA[i][j]}| &times; ${beta[j].toFixed(decimals)}`);
        }
        for (let j = i + 1; j < n; j++) {
          sum += Math.abs(finalA[i][j]);
          sassenfeldExprParts.push(`|${finalA[i][j]}|`);
        }
        let bVal = sum / diagVal;
        beta.push(bVal);
        if (bVal > maxBeta) maxBeta = bVal;

        sassenfeldDetails.push({
          row: i + 1,
          expr: `(${sassenfeldExprParts.join(' + ') || '0'}) / |${finalA[i][i]}|`,
          val: bVal
        });
      }

      let sassenfeldGuaranteed = maxBeta < 1;
      let guaranteed = isFinalDominant || sassenfeldGuaranteed;

      if (!guaranteed) {
        if (!confirm(`Warning: ${solverLabelName} may not converge for this system. Do you want to continue anyway?`)) {
          return;
        }
      }

      let stepsHtml = '';
      let stepCount = 1;

      function formatMatrixRepHTML(mat, vars, constants) {
        let cols = mat[0].length;
        let html = `<div style="display: flex; align-items: center; justify-content: center; gap: 1rem; margin: 1.5rem 0; flex-wrap: wrap;"><div style="display: flex; flex-direction: column; align-items: center;"><span style="font-weight: 600; font-size: 0.85rem; color: var(--muted); margin-bottom: 6px;">Matrix A</span><div class="display-matrix-wrapper"><div class="display-matrix" style="grid-template-columns: repeat(${cols}, 1fr);">${mat.map(row => row.map(v => `<div>${v}</div>`).join('')).join('')}</div></div></div><div style="font-size: 1.5rem; font-weight: 700; color: var(--navy); font-family: 'Fraunces', serif;">&times;</div><div style="display: flex; flex-direction: column; align-items: center;"><span style="font-weight: 600; font-size: 0.85rem; color: var(--muted); margin-bottom: 6px;">Vector X</span><div class="display-matrix-wrapper"><div class="display-matrix" style="grid-template-columns: 1fr;">${vars.map(v => `<div>${v}</div>`).join('')}</div></div></div><div style="font-size: 1.5rem; font-weight: 700; color: var(--navy); font-family: 'Fraunces', serif;">=</div><div style="display: flex; flex-direction: column; align-items: center;"><span style="font-weight: 600; font-size: 0.85rem; color: var(--muted); margin-bottom: 6px;">Vector B</span><div class="display-matrix-wrapper"><div class="display-matrix" style="grid-template-columns: 1fr;">${constants.map(c => `<div>${c}</div>`).join('')}</div></div></div></div>`;
        return html;
      }

      let origEqusHtml = '';
      for (let i = 0; i < n; i++) {
        origEqusHtml += `<div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.1rem; color: var(--navy); margin-bottom: 0.6rem; text-align: center;">Equation ${i + 1}: &nbsp;&nbsp; <strong>${formatEquation(A[i], B[i], n)}</strong></div>`;
      }
      stepsHtml += `<div class="step-card"><div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)"><div style="display: flex; align-items: center; gap: 0.75rem;"><div class="step-number">${stepCount++}</div><div class="step-title">Original System of Equations</div></div><div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div></div><div class="step-content"><div class="step-desc">The entered linear system of equations corresponds algebraic form as follows:</div><div style="margin: 1.5rem 0;">${origEqusHtml}</div></div></div>`;

      let step2Desc = '';
      if (rearrangedPerformed) {
        let beforeRowsHtml = '';
        for (let i = 0; i < n; i++) { beforeRowsHtml += `<div style="font-family: 'IBM Plex Mono', monospace; margin-bottom: 0.4rem; opacity:0.85;">${formatEquation(A[i], B[i], n)}</div>`; }
        let afterRowsHtml = '';
        for (let i = 0; i < n; i++) { afterRowsHtml += `<div style="font-family: 'IBM Plex Mono', monospace; margin-bottom: 0.4rem; color: var(--navy); font-weight: 700;">${formatEquation(finalA[i], finalB[i], n)}</div>`; }
        step2Desc = `<div class="step-desc">To guarantee the convergence of the ${solverLabelName} method, the system of equations should be <strong>Diagonally Dominant</strong>. The original system is not dominant in its entered order. We automatically rearrange the equations by swapping rows to maximize the diagonal entries:</div><div style="display: flex; gap: 2rem; justify-content: center; flex-wrap: wrap; margin-top: 1.5rem;"><div style="padding: 1.25rem; border: 1px solid var(--border); border-radius: 8px; background: var(--bg); min-width: 250px; text-align: center;"><div style="font-weight: 700; color: #b91c1c; margin-bottom: 0.75rem; font-size: 0.9rem; text-transform: uppercase;">Original Order</div>${beforeRowsHtml}</div><div style="display: flex; align-items: center; justify-content: center; font-size: 1.5rem; color: var(--amber); font-weight: 700;">➔</div><div style="padding: 1.25rem; border: 1px solid rgba(13, 148, 136, 0.2); border-radius: 8px; background: rgba(13, 148, 136, 0.05); min-width: 250px; text-align: center;"><div style="font-weight: 700; color: var(--teal); margin-bottom: 0.75rem; font-size: 0.9rem; text-transform: uppercase;">Rearranged Order</div>${afterRowsHtml}</div></div><div style="margin-top: 1.5rem; font-size: 0.95rem; line-height: 1.5; color: var(--muted); padding: 0.75rem; border-left: 3px solid var(--amber); background: var(--bg2);"><strong>Reasoning:</strong> Sweeping the largest coefficients to the main diagonal ensures that during iterations, we divide by the dominant element. This shrinks convergence error at each step and keeps the iterative process stable.</div>`;
      } else {
        step2Desc = `<div class="step-desc">To guarantee convergence, the system must be <strong>Diagonally Dominant</strong>. Let's inspect the arrangement:</div><div style="margin: 1rem 0; text-align: center; padding: 1.25rem; border: 1px dashed var(--border); background: var(--bg); border-radius: 8px; color: var(--navy); font-weight: 600;">The entered system of equations is already optimally arranged. Swapping rows is not required.</div>`;
      }
      stepsHtml += `<div class="step-card"><div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)"><div style="display: flex; align-items: center; gap: 0.75rem;"><div class="step-number">${stepCount++}</div><div class="step-title">Rearrangement for Diagonal Dominance</div></div><div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div></div><div class="step-content">${step2Desc}</div></div>`;

      let varsList = [];
      for (let i = 0; i < n; i++) { varsList.push(getVarName(i, n)); }
      stepsHtml += `<div class="step-card"><div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)"><div style="display: flex; align-items: center; gap: 0.75rem;"><div class="step-number">${stepCount++}</div><div class="step-title">Matrix Representation (AX = B)</div></div><div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div></div><div class="step-content"><div class="step-desc">Using the optimally arranged equations, we write the system in standard matrix form <strong>AX = B</strong>:</div>${formatMatrixRepHTML(finalA, varsList, finalB)}</div></div>`;

      let warningBanner = guaranteed 
        ? `<div style="background: rgba(13, 148, 136, 0.1); border-left: 4px solid var(--teal); padding: 1rem; border-radius: 8px; margin-top: 1.5rem; text-align: left; color: var(--teal); font-weight: 500;">✅ Convergence Guaranteed!<br><span style="font-size: 0.9rem; font-weight: normal; opacity: 0.9;">${isFinalDominant ? "The matrix is strictly Diagonally Dominant." : "The system satisfies the Sassenfeld Criterion."} ${solverLabelName} iterations will converge.</span></div>` 
        : `<div style="background: rgba(239, 68, 68, 0.1); border-left: 4px solid #ef4444; padding: 1rem; border-radius: 8px; margin-top: 1.5rem; text-align: left; color: #b91c1c; font-weight: 500;">⚠️ Warning: ${solverLabelName} may not converge for this system.<br><span style="font-size: 0.9rem; font-weight: normal; opacity: 0.9;">The matrix is neither Diagonally Dominant nor does it satisfy the Sassenfeld Criterion. Iterations might diverge.</span></div>`;

      stepsHtml += `<div class="step-card"><div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)"><div style="display: flex; align-items: center; gap: 0.75rem;"><div class="step-number">${stepCount++}</div><div class="step-title">Diagonal Dominance Check</div></div><div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div></div><div class="step-content"><div class="step-desc">We mathematically verify the diagonal dominance:</div><div style="overflow-x: auto; margin-top: 1.5rem;"><table style="width: 100%; border-collapse: collapse; margin-bottom: 1rem; border: 1px solid var(--border);"><thead><tr style="background: var(--bg); border-bottom: 2px solid var(--border);"><th style="padding: 0.75rem; color: var(--navy);">Row</th><th style="padding: 0.75rem; color: var(--navy);">Inequality Check</th><th style="padding: 0.75rem; color: var(--navy);">Simplified Values</th><th style="padding: 0.75rem; color: var(--navy);">Status</th></tr></thead><tbody>${diagDominanceDetails.map(r => `<tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.75rem; text-align: center; font-weight: 600;">Row ${r.row}</td><td style="padding: 0.75rem; text-align: center; font-family: 'IBM Plex Mono', monospace;">|${finalA[r.row-1][r.row-1]}| &gt; ${r.expr}</td><td style="padding: 0.75rem; text-align: center; font-family: 'IBM Plex Mono', monospace;">${r.diag} &gt; ${r.sum}</td><td style="padding: 0.75rem; text-align: center; font-weight: 700; color: ${r.met ? 'var(--teal)' : '#dc2626'};">${r.met ? 'True' : 'False'}</td></tr>`).join('')}</tbody></table></div><div style="font-weight: 700; color: var(--navy); margin-top: 1.5rem; margin-bottom: 0.5rem; font-size: 1rem;">Sassenfeld Criterion Check:</div><div style="overflow-x: auto;"><table style="width: 100%; border-collapse: collapse; margin-bottom: 1rem; border: 1px solid var(--border);"><thead><tr style="background: var(--bg); border-bottom: 2px solid var(--border);"><th style="padding: 0.75rem; color: var(--navy);">Factor</th><th style="padding: 0.75rem; color: var(--navy);">Recursive Sassenfeld Summation</th><th style="padding: 0.75rem; color: var(--navy);">Value (&beta;<sub>i</sub>)</th></tr></thead><tbody>${sassenfeldDetails.map(s => `<tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.75rem; text-align: center; font-weight: 600;">&beta;<sub>${s.row}</sub></td><td style="padding: 0.75rem; text-align: center; font-family: 'IBM Plex Mono', monospace; font-size: 0.9rem;">${s.expr}</td><td style="padding: 0.75rem; text-align: center; font-family: 'IBM Plex Mono', monospace; font-weight: 700; color: ${s.val < 1 ? 'var(--teal)' : '#d97706'};">${s.val.toFixed(decimals)}</td></tr>`).join('')}</tbody></table></div>${warningBanner}</div></div>`;

      let derivedHtml = '';
      for (let i = 0; i < n; i++) {
        let rhsTerms = [];
        for (let j = 0; j < n; j++) {
          if (i !== j) {
            let coef = finalA[i][j];
            if (coef === 0) continue;
            let sign = coef >= 0 ? '-' : '+';
            let absCoef = Math.abs(coef);
            let absCoefStr = absCoef === 1 ? '' : absCoef;
            rhsTerms.push(`${sign} ${absCoefStr}${getVarName(j, n)}`);
          }
        }
        let rhsStr = rhsTerms.join(' ');
        if (rhsStr.startsWith('+ ')) rhsStr = rhsStr.substring(2);
        derivedHtml += `<div style="margin-bottom: 1.5rem; padding: 1.25rem; border: 1px solid var(--border); border-left: 4px solid var(--teal); background: var(--bg); border-radius: 8px;"><div style="font-family: 'IBM Plex Mono', monospace; font-size: 1rem; margin-bottom: 0.75rem; color: var(--muted);">From Equation ${i + 1}: &nbsp;&nbsp; <code>${formatEquation(finalA[i], finalB[i], n)}</code></div><div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.15rem; color: var(--navy); display: flex; align-items: center; gap: 0.5rem; padding-left: 1rem;"><span>${getVarName(i, n)}<sup>(k+1)</sup> = </span><span style="display: inline-block; vertical-align: middle; text-align: center; margin: 0 4px;"><span style="display: block; border-bottom: 2px solid var(--navy); padding: 0 6px;">${finalB[i]} ${rhsStr}</span><span style="display: block; padding: 2px 0 0 0;">${finalA[i][i]}</span></span></div></div>`;
      }
      stepsHtml += `<div class="step-card"><div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)"><div style="display: flex; align-items: center; gap: 0.75rem;"><div class="step-number">${stepCount++}</div><div class="step-title">Derivation of Iterative Equations</div></div><div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div></div><div class="step-content"><div class="step-desc">We isolate each dominant diagonal variable on the left-hand side to set up the iterative ${solverLabelName} formulas:</div><div style="margin-top: 1.5rem; display: flex; flex-direction: column; gap: 0.5rem;">${derivedHtml}</div></div></div>`;

      stepsHtml += `<div class="step-card"><div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)"><div style="display: flex; align-items: center; gap: 0.75rem;"><div class="step-number">${stepCount++}</div><div class="step-title">Initial Guess Values</div></div><div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div></div><div class="step-content"><div class="step-desc">We start the ${solverLabelName} iteration process using the following initial approximations:</div><div style="display: flex; gap: 2rem; justify-content: center; font-size: 1.25rem; font-family: 'IBM Plex Mono', monospace; color: var(--navy); margin: 1.5rem 0; flex-wrap: wrap;">${X0.map((xv, i) => `<strong>${getVarName(i, n)}<sup>(0)</sup></strong> = ${xv}`).join('&nbsp;&nbsp;&nbsp;&bull;&nbsp;&nbsp;&nbsp;')}</div></div></div>`;

      let X = [...X0];
      let tableRows = [{ iter: 0, xVals: [...X], error: 0 }];
      let converged = false;
      let finalIter = 0;

      for (let k = 1; k <= maxIter; k++) {
        let X_new = [];
        let iterSubstitutionsHtml = '';
        
        for (let i = 0; i < n; i++) {
          let sum = 0;
          let subExprParts = [];
          for (let j = 0; j < n; j++) {
            if (i !== j) {
              if (method === 'seidel') {
                if (j < i) {
                  // Use newly computed value from current iteration
                  sum += finalA[i][j] * X_new[j];
                  let sign = finalA[i][j] >= 0 ? '-' : '+';
                  let absCoef = Math.abs(finalA[i][j]);
                  subExprParts.push(`${sign} ${absCoef === 1 ? '' : absCoef}(${X_new[j].toFixed(decimals)}<span style="font-size:0.75rem; font-weight:600; color:var(--amber); vertical-align:super;">(latest)</span>)`);
                } else {
                  // Use old value from previous iteration
                  sum += finalA[i][j] * X[j];
                  let sign = finalA[i][j] >= 0 ? '-' : '+';
                  let absCoef = Math.abs(finalA[i][j]);
                  subExprParts.push(`${sign} ${absCoef === 1 ? '' : absCoef}(${X[j].toFixed(decimals)}<span style="font-size:0.75rem; font-weight:600; color:var(--muted); vertical-align:super;">(old)</span>)`);
                }
              } else {
                // Jacobi: always use previous values
                sum += finalA[i][j] * X[j];
                let sign = finalA[i][j] >= 0 ? '-' : '+';
                let absCoef = Math.abs(finalA[i][j]);
                subExprParts.push(`${sign} ${absCoef === 1 ? '' : absCoef}(${X[j].toFixed(decimals)})`);
              }
            }
          }
          let calculated = (finalB[i] - sum) / finalA[i][i];
          X_new.push(calculated);
          let subExprStr = subExprParts.join(' ');
          if (subExprStr.startsWith('+ ')) subExprStr = subExprStr.substring(2);
          
          let reuseNotice = '';
          if (method === 'seidel' && i > 0) {
            let newlyComputedVars = [];
            for (let v = 0; v < i; v++) {
              newlyComputedVars.push(getVarName(v, n));
            }
            reuseNotice = `<div style="font-size:0.8rem; color:var(--amber); font-weight:600; margin-bottom:0.4rem; font-style:italic;">➔ Now use ${newlyComputedVars.join(' and ')} immediately:</div>`;
          }

          iterSubstitutionsHtml += `${reuseNotice}<div style="padding: 1rem; border: 1px solid var(--border); border-left: 4px solid var(--amber); background: var(--bg); margin-bottom: 0.75rem; border-radius: 8px; font-family: 'IBM Plex Mono', monospace; font-size: 1rem;"><span style="font-weight: 700; color: var(--navy);">${getVarName(i, n)}<sup>(${k})</sup></span> = <span style="display: inline-block; vertical-align: middle; text-align: center; margin: 0 6px;"><span style="display: block; border-bottom: 1px solid var(--navy); padding: 0 4px;">${finalB[i]} ${subExprStr}</span><span style="display: block; padding: 1px 0;">${finalA[i][i]}</span></span> = <strong>${calculated.toFixed(decimals)}</strong></div>`;
        }

        let err = 0;
        let diffsList = [];
        for (let i = 0; i < n; i++) {
          let diff = Math.abs(X_new[i] - X[i]);
          if (diff > err) err = diff;
          diffsList.push(`|${X_new[i].toFixed(decimals)} - ${X[i].toFixed(decimals)}|`);
        }
        tableRows.push({ iter: k, xVals: [...X_new], error: err });
        
        let substitutionsDesc = method === 'seidel' 
          ? `Substituting variables into our iterative equations (latest available values are used immediately):`
          : `Substituting variables from iteration ${k-1} into our iterative equations:`;

        stepsHtml += `<div class="step-card"><div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)"><div style="display: flex; align-items: center; gap: 0.75rem;"><div class="step-number">${stepCount++}</div><div class="step-title">Iteration ${k}</div></div><div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted); transform: rotate(-90deg);">▼</div></div><div class="step-content" style="display: none;"><div class="step-desc">${substitutionsDesc}</div><div style="display: flex; flex-direction: column; gap: 0.25rem; margin-top: 1rem;">${iterSubstitutionsHtml}</div><div style="margin-top: 1.25rem; padding: 1rem; background: var(--bg); border-radius: 8px; font-size: 0.95rem; color: var(--navy); border: 1px solid var(--border);"><div style="font-weight: 700; margin-bottom: 0.5rem; text-transform: uppercase; font-size: 0.85rem; letter-spacing:0.05em; color:var(--muted);">Error Calculation:</div><div style="font-family:'IBM Plex Mono',monospace; font-size: 1rem; margin-bottom: 0.5rem;">Error = max(${diffsList.join(', ')}) = <strong>${err.toFixed(decimals)}</strong></div><div style="font-weight: 700; border-top: 1px dashed var(--border); padding-top: 0.5rem; margin-top: 0.5rem; font-size: 0.95rem;">Comparison: ${err.toFixed(decimals)} ${err < tolerance ? ` &lt; ${tolerance} (&epsilon;) <span style="color: var(--teal)">&nbsp;&bull;&nbsp; Converged!</span>` : ` &ge; ${tolerance} (&epsilon;)`}</div></div></div></div>`;
        X = [...X_new];
        finalIter = k;
        if (err < tolerance) { converged = true; break; }
      }

      stepsHtml += `<div class="step-card"><div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)"><div style="display: flex; align-items: center; gap: 0.75rem;"><div class="step-number">${stepCount++}</div><div class="step-title">Iteration Summary Table</div></div><div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted); transform: rotate(-90deg);">▼</div></div><div class="step-content" style="display: none;"><div class="step-desc">A unified view of variable approximations:</div><div style="overflow-x: auto; margin-top: 1.5rem;"><table style="width: 100%; border-collapse: collapse; border: 1px solid var(--border);"><thead><tr style="background: var(--bg); border-bottom: 2px solid var(--border);"><th style="padding: 0.75rem; color: var(--navy); width: 100px;">Iteration</th>${varsList.map(v => `<th style="padding: 0.75rem; color: var(--navy);">${v}</th>`).join('')}<th style="padding: 0.75rem; color: var(--navy);">Max Abs Error</th></tr></thead><tbody>${tableRows.map(row => `<tr style="border-bottom: 1px solid var(--border); ${row.iter === finalIter && converged ? 'background: rgba(13, 148, 136, 0.05); font-weight:600;' : ''}"><td style="padding: 0.75rem; text-align: center; font-weight: 600;">${row.iter}</td>${row.xVals.map(xv => `<td style="padding: 0.75rem; text-align: center; font-family: 'IBM Plex Mono', monospace;">${xv.toFixed(decimals)}</td>`).join('')}<td style="padding: 0.75rem; text-align: center; font-family: 'IBM Plex Mono', monospace; font-weight: 700; color: var(--navy);">${row.iter === 0 ? '-' : row.error.toFixed(decimals)}</td></tr>`).join('')}</tbody></table></div></div></div>`;

      let finalSolutionHtml = X.map((xv, idx) => `<div style="font-family:'IBM Plex Mono',monospace; font-size: 1.3rem; font-weight:700; color:var(--amber); margin: 0.6rem 0;">${getVarName(idx, n)} = <span style="color:#ffffff;">${xv.toFixed(decimals)}</span></div>`).join('');
      stepsHtml += converged ? `<div class="final-result animate-fade-in" style="text-align: center; padding: 2.5rem; background: var(--navy); color: #ffffff; border-radius: 16px; border: 1px solid var(--border); box-shadow: 0 10px 30px rgba(0,0,0,0.15); margin-top: 2rem;"><div style="font-size: 1.8rem; font-weight: 700; color: var(--amber); margin-bottom: 0.5rem; font-family:'Fraunces', serif;">✅ Solution Converged Successfully!</div><div style="font-size: 1.05rem; opacity: 0.9; margin-bottom: 1.5rem;">The system converged within tolerance limit (&epsilon; = ${tolerance}) after <strong>${finalIter}</strong> iterations.</div><div style="display:inline-block; text-align: left; padding: 1.5rem; background: rgba(255,255,255,0.06); border-radius: 12px; border: 1px solid rgba(255,255,255,0.12); min-width: 250px;"><div style="font-size:0.95rem; font-weight:600; color: rgba(255,255,255,0.7); border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; margin-bottom: 0.75rem;">Final Solved Values:</div>${finalSolutionHtml}</div></div>` : `<div class="final-result animate-fade-in" style="text-align: center; padding: 2.5rem; background: #991b1b; color: #ffffff; border-radius: 16px; border: 1px solid var(--border); box-shadow: 0 10px 30px rgba(0,0,0,0.15); margin-top: 2rem;"><div style="font-size: 1.8rem; font-weight: 700; color: var(--amber); margin-bottom: 0.5rem; font-family:'Fraunces', serif;">⚠️ Limits Reached Without Convergence</div><div style="font-size: 1.05rem; opacity: 0.9; margin-bottom: 1.5rem;">The system did not converge to tolerance (&epsilon; = ${tolerance}) within <strong>${maxIter}</strong> iterations limit.</div><div style="display:inline-block; text-align: left; padding: 1.5rem; background: rgba(255,255,255,0.06); border-radius: 12px; border: 1px solid rgba(255,255,255,0.12); min-width: 250px;"><div style="font-size:0.95rem; font-weight:600; color: rgba(255,255,255,0.7); border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; margin-bottom: 0.75rem;">Last Computed State (Iteration ${finalIter}):</div>${finalSolutionHtml}</div></div>`;

      if (method === 'seidel') {
        stepsHtml += `<div class="step-card" style="border-left: 4px solid var(--teal); background: rgba(13, 148, 136, 0.05); margin-top: 2rem;"><div style="font-weight: 700; color: var(--teal); font-size: 1.1rem; margin-bottom: 0.5rem; font-family:'Fraunces', serif;">✦ Educational Note: Convergence Comparison</div><div style="font-size: 1rem; line-height: 1.5; color: var(--navy);"><strong>Gauss-Seidel</strong> typically converges significantly faster than <strong>Gauss-Jacobi</strong>. This is because Gauss-Seidel immediately reuses newly computed values of variables within the very same iteration, whereas Gauss-Jacobi is forced to wait until the next iteration to utilize them.</div></div>`;
      }

      output.innerHTML = stepsHtml;
      output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // ==========================================
    // NEWTON-RAPHSON CORE ENGINE & CALCULUS UTILS
    // ==========================================

    function splitIntoTerms(expr) {
      expr = expr.replace(/\s+/g, ''); // remove spaces
      let terms = [];
      let current = '';
      let parenDepth = 0;
      
      for (let i = 0; i < expr.length; i++) {
        let char = expr[i];
        if (char === '(') parenDepth++;
        if (char === ')') parenDepth--;
        
        if ((char === '+' || char === '-') && parenDepth === 0) {
          if (current) {
            terms.push(current);
          }
          current = char; // start new term with sign
        } else {
          current += char;
        }
      }
      if (current) {
        terms.push(current);
      }
      
      return terms.map(t => {
        if (t.startsWith('+')) t = t.substring(1);
        return t;
      });
    }

    function differentiateTerm(term) {
      let isNegative = false;
      if (term.startsWith('-')) {
        isNegative = true;
        term = term.substring(1);
      }
      
      let result = '';
      
      // Pattern 1: Pure Constant
      if (/^\d+(\.\d+)?$/.test(term)) {
        return '0';
      }
      
      // Pattern 2: Power of x (e.g. x^3, 2*x^2, -x, etc.)
      let powMatch = term.match(/^(?:(\d+(?:\.\d+)?)\*?)?x(?:\^(\d+))?$/);
      if (powMatch) {
        let coef = powMatch[1] ? parseFloat(powMatch[1]) : 1;
        let power = powMatch[2] ? parseInt(powMatch[2]) : 1;
        
        if (power === 1) {
          result = `${coef}`;
        } else {
          let newCoef = coef * power;
          let newPower = power - 1;
          if (newPower === 1) {
            result = `${newCoef}x`;
          } else {
            result = `${newCoef}x^${newPower}`;
          }
        }
        
        if (isNegative) return `-${result}`;
        return result;
      }
      
      // Pattern 3: Sin(u)
      let sinMatch = term.match(/^(?:(\d+(?:\.\d+)?)\*?)?sin\((.*?)\)$/);
      if (sinMatch) {
        let coef = sinMatch[1] ? parseFloat(sinMatch[1]) : 1;
        let arg = sinMatch[2];
        let argDeriv = differentiateSymbolic(arg);
        if (argDeriv === '0') return '0';
        
        let lead = coef;
        if (argDeriv !== '1') {
          lead = isNaN(parseFloat(argDeriv)) ? `${lead}*(${argDeriv})` : lead * parseFloat(argDeriv);
        }
        result = `${lead}*cos(${arg})`;
        if (isNegative) return `-${result}`;
        return result;
      }
      
      // Pattern 4: Cos(u)
      let cosMatch = term.match(/^(?:(\d+(?:\.\d+)?)\*?)?cos\((.*?)\)$/);
      if (cosMatch) {
        let coef = cosMatch[1] ? parseFloat(cosMatch[1]) : 1;
        let arg = cosMatch[2];
        let argDeriv = differentiateSymbolic(arg);
        if (argDeriv === '0') return '0';
        
        let lead = coef;
        if (argDeriv !== '1') {
          lead = isNaN(parseFloat(argDeriv)) ? `${lead}*(${argDeriv})` : lead * parseFloat(argDeriv);
        }
        result = `${lead}*sin(${arg})`;
        isNegative = !isNegative;
        if (isNegative) return `-${result}`;
        return result;
      }
      
      // Pattern 5: Exp
      let expMatch = term.match(/^(?:(\d+(?:\.\d+)?)\*?)?e\^(x|\((.*?)\))$/) || term.match(/^(?:(\d+(?:\.\d+)?)\*?)?exp\((.*?)\)$/);
      if (expMatch) {
        let coef = expMatch[1] ? parseFloat(expMatch[1]) : 1;
        let arg = expMatch[3] || expMatch[2] || expMatch[4];
        if (arg === 'x') {
          result = `${coef}*e^x`;
        } else {
          let argDeriv = differentiateSymbolic(arg);
          if (argDeriv === '0') return '0';
          let lead = coef;
          if (argDeriv !== '1') {
            lead = isNaN(parseFloat(argDeriv)) ? `${lead}*(${argDeriv})` : lead * parseFloat(argDeriv);
          }
          result = `${lead}*e^(${arg})`;
        }
        if (isNegative) return `-${result}`;
        return result;
      }
      
      // Pattern 6: Ln(u)
      let logMatch = term.match(/^(?:(\d+(?:\.\d+)?)\*?)?ln\((.*?)\)$/);
      if (logMatch) {
        let coef = logMatch[1] ? parseFloat(logMatch[1]) : 1;
        let arg = logMatch[2];
        let argDeriv = differentiateSymbolic(arg);
        if (argDeriv === '0') return '0';
        result = `(${coef}*(${argDeriv}))/(${arg})`;
        if (isNegative) return `-${result}`;
        return result;
      }
      
      if (term.includes('*')) {
        let parts = term.split('*');
        if (parts.length === 2) {
          let u = parts[0];
          let v = parts[1];
          let du = differentiateSymbolic(u);
          let dv = differentiateSymbolic(v);
          result = `(${u})*(${dv}) + (${v})*(${du})`;
          if (isNegative) return `-(${result})`;
          return result;
        }
      }

      return `d/dx(${isNegative ? '-' : ''}${term})`;
    }

    function differentiateSymbolic(expr) {
      if (!expr || expr.trim() === '') return '0';
      let terms = splitIntoTerms(expr);
      let derivedTerms = terms.map(t => differentiateTerm(t));
      
      let merged = '';
      for (let i = 0; i < derivedTerms.length; i++) {
        let t = derivedTerms[i];
        if (t === '0') continue;
        
        if (merged.length > 0) {
          if (t.startsWith('-')) {
            merged += ` - ${t.substring(1)}`;
          } else {
            merged += ` + ${t}`;
          }
        } else {
          merged += t;
        }
      }
      
      if (!merged) return '0';
      
      merged = merged.replace(/\b1\*/g, '')
                     .replace(/\*1\b/g, '')
                     .replace(/\b1x/g, 'x')
                     .replace(/\+-/g, '-')
                     .replace(/\s+/g, ' ')
                     .trim();
                     
      return merged;
    }

    function evaluateMath(expr, xVal) {
      let jsExpr = expr.toLowerCase().replace(/\s+/g, '');
      jsExpr = jsExpr.replace(/(\d)(x)/g, '$1*$2');
      
      jsExpr = jsExpr.replace(/\bsin\b/g, 'Math.sin')
                     .replace(/\bcos\b/g, 'Math.cos')
                     .replace(/\btan\b/g, 'Math.tan')
                     .replace(/\bexp\b/g, 'Math.exp')
                     .replace(/\bln\b/g, 'Math.log')
                     .replace(/\blog\b/g, 'Math.log10')
                     .replace(/\bpi\b/g, 'Math.PI');
                     
      jsExpr = jsExpr.replace(/\be\^(x|\((.*?)\))/g, (match, p1, p2) => {
        let inner = p2 || p1;
        return `Math.exp(${inner})`;
      });

      jsExpr = jsExpr.replace(/\^/g, '**');

      try {
        const fn = new Function('x', `with(Math) { return ${jsExpr}; }`);
        let result = fn(xVal);
        if (isNaN(result) || !isFinite(result)) return NaN;
        return result;
      } catch (err) {
        return NaN;
      }
    }

    function evaluateMathDerivative(expr, xVal) {
      let h = 1e-8;
      let f_plus = evaluateMath(expr, xVal + h);
      let f_minus = evaluateMath(expr, xVal - h);
      if (isNaN(f_plus) || isNaN(f_minus)) return NaN;
      return (f_plus - f_minus) / (2 * h);
    }

    function generateNewtonGraphSVG(expr, root, initialGuess) {
      let minX = Math.min(root, initialGuess) - 1.0;
      let maxX = Math.max(root, initialGuess) + 1.0;
      if (maxX - minX < 0.5) {
        minX = root - 1.0;
        maxX = root + 1.0;
      }
      
      let pointsCount = 60;
      let points = [];
      let minY = Infinity;
      let maxY = -Infinity;
      
      for (let i = 0; i <= pointsCount; i++) {
        let x = minX + (maxX - minX) * (i / pointsCount);
        let y = evaluateMath(expr, x);
        if (!isNaN(y) && isFinite(y)) {
          points.push({ x, y });
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
      
      if (minY > 0) minY = -0.5;
      if (maxY < 0) maxY = 0.5;
      
      let yPadding = (maxY - minY) * 0.1 || 0.5;
      minY -= yPadding;
      maxY += yPadding;
      
      let width = 500;
      let height = 240;
      let paddingLeft = 50;
      let paddingRight = 20;
      let paddingTop = 20;
      let paddingBottom = 35;
      
      let chartW = width - paddingLeft - paddingRight;
      let chartH = height - paddingTop - paddingBottom;
      
      function toSvgX(x) {
        return paddingLeft + ((x - minX) / (maxX - minX)) * chartW;
      }
      
      function toSvgY(y) {
        return paddingTop + chartH - ((y - minY) / (maxY - minY)) * chartH;
      }
      
      let pathD = '';
      for (let i = 0; i < points.length; i++) {
        let sx = toSvgX(points[i].x);
        let sy = toSvgY(points[i].y);
        if (sy >= paddingTop && sy <= paddingTop + chartH) {
          if (pathD === '') {
            pathD += `M ${sx} ${sy}`;
          } else {
            pathD += ` L ${sx} ${sy}`;
          }
        }
      }
      
      let yZeroY = toSvgY(0);
      let xAxisHtml = '';
      if (yZeroY >= paddingTop && yZeroY <= paddingTop + chartH) {
        xAxisHtml = `<line x1="${paddingLeft}" y1="${yZeroY}" x2="${width - paddingRight}" y2="${yZeroY}" stroke="var(--border)" stroke-width="2" stroke-dasharray="4,4" />`;
      }
      
      let xZeroX = toSvgX(0);
      let yAxisHtml = '';
      if (xZeroX >= paddingLeft && xZeroX <= paddingLeft + chartW) {
        yAxisHtml = `<line x1="${xZeroX}" y1="${paddingTop}" x2="${xZeroX}" y2="${height - paddingBottom}" stroke="var(--border)" stroke-width="1.5" stroke-dasharray="2,2" />`;
      }
      
      let guessX = toSvgX(initialGuess);
      let guessY = toSvgY(evaluateMath(expr, initialGuess));
      let rootX = toSvgX(root);
      let rootY = toSvgY(0);
      
      let graphHtml = `
        <div style="margin-top: 2rem; width: 100%; display: flex; flex-direction: column; align-items: center;">
          <div style="font-weight:700; color:var(--navy); font-size:1.1rem; margin-bottom:1rem; font-family:'Fraunces', serif;">✦ Graphical Convergence Curve</div>
          <div style="background: var(--bg); border: 1px solid var(--border); border-radius: 12px; padding: 1.25rem; width: 100%; max-width: 540px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.03);">
            <svg viewBox="0 0 ${width} ${height}" style="width: 100%; height: auto;">
              <!-- Grid/Axes -->
              ${xAxisHtml}
              ${yAxisHtml}
              
              <!-- Function Curve -->
              <path d="${pathD}" fill="none" stroke="var(--amber)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
              
              <!-- Guess Point marker -->
              <circle cx="${guessX}" cy="${guessY}" r="5" fill="#ef4444" />
              <line x1="${guessX}" y1="${guessY}" x2="${guessX}" y2="${yZeroY}" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="2,2" />
              <text x="${guessX}" y="${yZeroY >= guessY ? yZeroY + 16 : yZeroY - 8}" font-size="11" font-family="'IBM Plex Mono', monospace" fill="#ef4444" text-anchor="middle">x₀ (${initialGuess})</text>
              
              <!-- Root Point marker -->
              <circle cx="${rootX}" cy="${rootY}" r="6" fill="var(--teal)" stroke="#ffffff" stroke-width="2" />
              <text x="${rootX}" y="${rootY - 12}" font-size="12" font-weight="700" font-family="'IBM Plex Mono', monospace" fill="var(--teal)" text-anchor="middle">Root (${root.toFixed(4)})</text>
              
              <!-- Axis Labels -->
              <text x="${width - paddingRight - 10}" y="${yZeroY - 6}" font-size="11" font-weight="600" fill="var(--muted)" text-anchor="end">x-axis</text>
            </svg>
          </div>
        </div>
      `;
      return graphHtml;
    }

    function calculateNewtonRaphson() {
      const output = document.getElementById('steps-output');
      output.innerHTML = '';
      output.classList.add('active');

      let expr = document.getElementById('newton-function').value.trim();
      let guessValStr = document.getElementById('newton-guess').value.trim();
      let toleranceValStr = document.getElementById('newton-tolerance').value.trim();
      let maxIterValStr = document.getElementById('newton-max-iter').value.trim();
      let decimalsValStr = document.getElementById('newton-decimals').value.trim();

      if (expr === '' || guessValStr === '' || toleranceValStr === '' || maxIterValStr === '' || decimalsValStr === '') {
        output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Missing Fields</div></div><div class="step-desc">Please ensure all calculator parameters are filled with valid entries.</div></div>`;
        output.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      if (!/x/i.test(expr)) {
        output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Invalid Function Variable</div></div><div class="step-desc">The function expression must contain the variable <b>'x'</b> (e.g. <code>x^3 - x - 1</code>).</div></div>`;
        output.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      let testVal = evaluateMath(expr, 1.0);
      if (isNaN(testVal)) {
        output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Invalid Function Syntax</div></div><div class="step-desc">Please ensure the function is written correctly (e.g. <code>x^3 - x - 1</code>, <code>cos(x) - x</code>). Check for unmatched parentheses or dangling operators.</div></div>`;
        output.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      let guess = parseFloat(guessValStr);
      let tolerance = parseFloat(toleranceValStr);
      let maxIter = parseInt(maxIterValStr);
      let decimals = parseInt(decimalsValStr);

      if (isNaN(guess) || !isFinite(guess)) {
        output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Invalid Guess</div></div><div class="step-desc">Initial Guess x₀ must be a valid real number.</div></div>`;
        output.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      if (isNaN(tolerance) || tolerance <= 0 || tolerance > 1) {
        output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Invalid Tolerance</div></div><div class="step-desc">Tolerance must be a positive number less than or equal to 1.</div></div>`;
        output.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      if (isNaN(maxIter) || maxIter < 1 || maxIter > 500) {
        output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Invalid Max Iterations</div></div><div class="step-desc">Maximum iterations must be an integer between 1 and 500.</div></div>`;
        output.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      if (isNaN(decimals) || !/^\d+$/.test(decimalsValStr) || decimals < 0 || decimals > 15) {
        output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Invalid Decimal Places</div></div><div class="step-desc">Decimal places must be an integer between 0 and 15.</div></div>`;
        output.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      let stepsHtml = '';
      let stepCount = 1;

      // Step 1: Given Function
      stepsHtml += `<div class="step-card"><div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)"><div style="display: flex; align-items: center; gap: 0.75rem;"><div class="step-number">${stepCount++}</div><div class="step-title">Given Function</div></div><div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div></div><div class="step-content"><div class="step-desc">We start with the following given equation representing the function:</div><div style="font-family: 'Fraunces', serif; font-size: 1.5rem; color: var(--navy); text-align: center; margin: 1.5rem 0;">f(x) = ${expr}</div></div></div>`;

      // Step 2: Derivative
      let derivedExpr = differentiateSymbolic(expr);
      stepsHtml += `<div class="step-card"><div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)"><div style="display: flex; align-items: center; gap: 0.75rem;"><div class="step-number">${stepCount++}</div><div class="step-title">Derivative Analysis</div></div><div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div></div><div class="step-content"><div class="step-desc">Differentiating the function symbolically with respect to 'x':</div><div style="font-family: 'Fraunces', serif; font-size: 1.5rem; color: var(--navy); text-align: center; margin: 1.5rem 0;">f'(x) = ${derivedExpr}</div></div></div>`;

      // Step 3: Newton Raphson Formula
      stepsHtml += `<div class="step-card"><div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)"><div style="display: flex; align-items: center; gap: 0.75rem;"><div class="step-number">${stepCount++}</div><div class="step-title">Newton Raphson Iteration Formula</div></div><div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div></div><div class="step-content"><div class="step-desc">The standard Newton Raphson iterative equation is defined as:</div><div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.25rem; color: var(--navy); text-align: center; margin: 1.5rem 0; display: flex; align-items: center; justify-content: center; gap: 0.5rem;"><span>x<sub>n+1</sub> = x<sub>n</sub> - </span><span style="display: inline-block; vertical-align: middle; text-align: center; margin: 0 4px;"><span style="display: block; border-bottom: 2px solid var(--navy); padding: 0 8px;">f(x<sub>n</sub>)</span><span style="display: block; padding: 2px 0 0 0;">f'(x<sub>n</sub>)</span></span></div><div style="font-size:0.95rem; line-height:1.5; color:var(--muted); text-align: center;">We will use this formula recursive step-by-step to calculate progressively closer root estimations.</div></div></div>`;

      // Step 4: Initial Guess
      stepsHtml += `<div class="step-card"><div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)"><div style="display: flex; align-items: center; gap: 0.75rem;"><div class="step-number">${stepCount++}</div><div class="step-title">Initial Guess Value</div></div><div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div></div><div class="step-content"><div class="step-desc">We begin the iterative approximation cycle starting with the user-entered initial value:</div><div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.35rem; color: var(--navy); text-align: center; margin: 1.5rem 0;">x₀ = ${guess.toFixed(decimals)}</div></div></div>`;

      let currentX = guess;
      let tableRows = [];
      let converged = false;
      let finalIter = 0;
      let isHalted = false;

      for (let k = 1; k <= maxIter; k++) {
        let fVal = evaluateMath(expr, currentX);
        let fPrimeVal = evaluateMathDerivative(expr, currentX);

        if (isNaN(fVal) || isNaN(fPrimeVal)) {
          stepsHtml += `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626; font-size:1.25rem;">Iteration ${k} halted: Evaluation Error</div></div><div class="step-desc" style="font-size:1rem;">The function or its derivative evaluated to an undefined value (NaN) at x = ${currentX.toFixed(decimals)}. Newton Raphson cannot continue.</div></div>`;
          isHalted = true;
          break;
        }

        if (Math.abs(fPrimeVal) < 1e-12) {
          stepsHtml += `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626; font-size:1.25rem;">Iteration ${k} halted: Division by Zero</div></div><div class="step-desc" style="font-size:1rem;">The derivative f'(x) became zero (or near-zero) at x = ${currentX.toFixed(decimals)}:<br><br><span style="font-weight:700; color:#dc2626; font-size:1.1rem; display:block; text-align:center;">Derivative became zero. Newton Raphson cannot continue.</span></div></div>`;
          isHalted = true;
          break;
        }

        let nextX = currentX - (fVal / fPrimeVal);
        let err = Math.abs(nextX - currentX);

        tableRows.push({
          iter: k,
          xn: currentX,
          fxn: fVal,
          fprime: fPrimeVal,
          xnext: nextX,
          error: err
        });

        let iterSubStr = `<div style="padding: 1.25rem; border: 1px solid var(--border); border-left: 4px solid var(--amber); background: var(--bg); border-radius: 8px; font-family: 'IBM Plex Mono', monospace; font-size: 1.05rem; display: flex; flex-direction: column; gap: 0.75rem;">
          <div>1. Evaluate function: <b>f(${currentX.toFixed(decimals)}) = ${fVal.toFixed(decimals)}</b></div>
          <div>2. Evaluate derivative: <b>f'(${currentX.toFixed(decimals)}) = ${fPrimeVal.toFixed(decimals)}</b></div>
          <div style="border-top: 1px dashed var(--border); padding-top: 0.75rem; margin-top: 0.25rem;">3. Substitute into formula:</div>
          <div style="display: flex; align-items: center; gap: 0.5rem; padding-left: 1rem;">
            <span>x<sub>${k}</sub> = ${currentX.toFixed(decimals)} - </span>
            <span style="display: inline-block; vertical-align: middle; text-align: center; margin: 0 4px;"><span style="display: block; border-bottom: 1px dashed var(--navy); padding: 0 4px;">${fVal.toFixed(decimals)}</span><span style="display: block; padding: 1px 0;">${fPrimeVal.toFixed(decimals)}</span></span>
            <span> = <strong>${nextX.toFixed(decimals)}</strong></span>
          </div>
        </div>`;

        stepsHtml += `<div class="step-card"><div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)"><div style="display: flex; align-items: center; gap: 0.75rem;"><div class="step-number">${stepCount++}</div><div class="step-title">Iteration ${k}</div></div><div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted); transform: rotate(-90deg);">▼</div></div><div class="step-content" style="display: none;"><div class="step-desc">Using x<sub>${k-1}</sub> = ${currentX.toFixed(decimals)} in the Newton Raphson steps:</div><div style="margin-top: 1rem;">${iterSubStr}</div><div style="margin-top: 1.25rem; padding: 1rem; background: var(--bg); border-radius: 8px; font-size: 0.95rem; color: var(--navy); border: 1px solid var(--border);"><div style="font-weight: 700; margin-bottom: 0.5rem; text-transform: uppercase; font-size: 0.85rem; letter-spacing:0.05em; color:var(--muted);">Error Calculation:</div><div style="font-family:'IBM Plex Mono',monospace; font-size: 1rem; margin-bottom: 0.5rem;">Error = |x<sub>${k}</sub> - x<sub>${k-1}</sub>| = |${nextX.toFixed(decimals)} - ${currentX.toFixed(decimals)}| = <strong>${err.toFixed(decimals)}</strong></div><div style="font-weight: 700; border-top: 1px dashed var(--border); padding-top: 0.5rem; margin-top: 0.5rem; font-size: 0.95rem;">Comparison: ${err.toFixed(decimals)} ${err < tolerance ? ` &lt; ${tolerance} (&epsilon;) <span style="color: var(--teal)">&nbsp;&bull;&nbsp; Converged!</span>` : ` &ge; ${tolerance} (&epsilon;)`}</div></div></div></div>`;

        currentX = nextX;
        finalIter = k;
        if (err < tolerance) { converged = true; break; }
      }

      if (!isHalted) {
        // Step Summary Table
        stepsHtml += `<div class="step-card"><div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)"><div style="display: flex; align-items: center; gap: 0.75rem;"><div class="step-number">${stepCount++}</div><div class="step-title">Iteration Summary Table</div></div><div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted); transform: rotate(-90deg);">▼</div></div><div class="step-content" style="display: none;"><div class="step-desc">A unified view of variable approximations:</div><div style="overflow-x: auto; margin-top: 1.5rem;"><table style="width: 100%; border-collapse: collapse; border: 1px solid var(--border);"><thead><tr style="background: var(--bg); border-bottom: 2px solid var(--border);"><th style="padding: 0.75rem; color: var(--navy); width: 80px;">Iter</th><th style="padding: 0.75rem; color: var(--navy);">x<sub>n</sub></th><th style="padding: 0.75rem; color: var(--navy);">f(x<sub>n</sub>)</th><th style="padding: 0.75rem; color: var(--navy);">f'(x<sub>n</sub>)</th><th style="padding: 0.75rem; color: var(--navy);">x<sub>n+1</sub></th><th style="padding: 0.75rem; color: var(--navy);">Abs Error</th></tr></thead><tbody>${tableRows.map(row => `<tr style="border-bottom: 1px solid var(--border); ${row.iter === finalIter && converged ? 'background: rgba(13, 148, 136, 0.05); font-weight:600;' : ''}"><td style="padding: 0.75rem; text-align: center; font-weight: 600;">${row.iter}</td><td style="padding: 0.75rem; text-align: center; font-family: 'IBM Plex Mono', monospace;">${row.xn.toFixed(decimals)}</td><td style="padding: 0.75rem; text-align: center; font-family: 'IBM Plex Mono', monospace;">${row.fxn.toFixed(decimals)}</td><td style="padding: 0.75rem; text-align: center; font-family: 'IBM Plex Mono', monospace;">${row.fprime.toFixed(decimals)}</td><td style="padding: 0.75rem; text-align: center; font-family: 'IBM Plex Mono', monospace;">${row.xnext.toFixed(decimals)}</td><td style="padding: 0.75rem; text-align: center; font-family: 'IBM Plex Mono', monospace; font-weight: 700; color: var(--navy);">${row.error.toFixed(decimals)}</td></tr>`).join('')}</tbody></table></div></div></div>`;

        // SVG Graph Plot
        let chartGraphHtml = '';
        try {
          chartGraphHtml = generateNewtonGraphSVG(expr, currentX, guess);
        } catch(gErr) {
          console.error("SVG Plot error:", gErr);
        }

        // Final answer card
        stepsHtml += converged 
          ? `<div class="final-result animate-fade-in" style="text-align: center; padding: 2.5rem; background: var(--navy); color: #ffffff; border-radius: 16px; border: 1px solid var(--border); box-shadow: 0 10px 30px rgba(0,0,0,0.15); margin-top: 2rem;"><div style="font-size: 1.8rem; font-weight: 700; color: var(--amber); margin-bottom: 0.5rem; font-family:'Fraunces', serif;">✅ Solution Converged Successfully!</div><div style="font-size: 1.05rem; opacity: 0.9; margin-bottom: 1.5rem;">The system converged within tolerance limit (&epsilon; = ${tolerance}) after <strong>${finalIter}</strong> iterations.</div><div style="display:inline-block; text-align: left; padding: 1.5rem; background: rgba(255,255,255,0.06); border-radius: 12px; border: 1px solid rgba(255,255,255,0.12); min-width: 250px;"><div style="font-size:0.95rem; font-weight:600; color: rgba(255,255,255,0.7); border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; margin-bottom: 0.75rem;">Final Solved Root:</div><div style="font-family:'IBM Plex Mono',monospace; font-size: 1.45rem; font-weight:700; color:var(--amber); margin: 0.6rem 0;">Root ≈ <span style="color:#ffffff;">${currentX.toFixed(decimals)}</span></div></div>${chartGraphHtml}</div>` 
          : `<div class="final-result animate-fade-in" style="text-align: center; padding: 2.5rem; background: #991b1b; color: #ffffff; border-radius: 16px; border: 1px solid var(--border); box-shadow: 0 10px 30px rgba(0,0,0,0.15); margin-top: 2rem;"><div style="font-size: 1.8rem; font-weight: 700; color: var(--amber); margin-bottom: 0.5rem; font-family:'Fraunces', serif;">⚠️ Limits Reached Without Convergence</div><div style="font-size: 1.05rem; opacity: 0.9; margin-bottom: 1.5rem;">The system did not converge to tolerance (&epsilon; = ${tolerance}) within <strong>${maxIter}</strong> iterations limit.</div><div style="display:inline-block; text-align: left; padding: 1.5rem; background: rgba(255,255,255,0.06); border-radius: 12px; border: 1px solid rgba(255,255,255,0.12); min-width: 250px;"><div style="font-size:0.95rem; font-weight:600; color: rgba(255,255,255,0.7); border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; margin-bottom: 0.75rem;">Last Computed State (Iteration ${finalIter}):</div><div style="font-family:'IBM Plex Mono',monospace; font-size: 1.45rem; font-weight:700; color:var(--amber); margin: 0.6rem 0;">Root ≈ <span style="color:#ffffff;">${currentX.toFixed(decimals)}</span></div></div></div>`;
      }

      output.innerHTML = stepsHtml;
      output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // ==========================================
    // FALSE POSITION (REGULA FALSI) LOGIC ENGINE
    // ==========================================

    function generateFalsePositionGraphSVG(expr, root, initA, initB) {
      let minX = Math.min(root, initA, initB) - 0.5;
      let maxX = Math.max(root, initA, initB) + 0.5;
      if (maxX - minX < 0.5) {
        minX = root - 1.0;
        maxX = root + 1.0;
      }
      
      let pointsCount = 100;
      let points = [];
      let minY = Infinity;
      let maxY = -Infinity;
      
      for (let i = 0; i <= pointsCount; i++) {
        let x = minX + (maxX - minX) * (i / pointsCount);
        let y = evaluateMath(expr, x);
        if (!isNaN(y) && isFinite(y)) {
          points.push({ x, y });
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
      
      if (minY > 0) minY = -0.5;
      if (maxY < 0) maxY = 0.5;
      
      let yPadding = (maxY - minY) * 0.15 || 0.5;
      minY -= yPadding;
      maxY += yPadding;
      
      let width = 500;
      let height = 240;
      let paddingLeft = 50;
      let paddingRight = 20;
      let paddingTop = 20;
      let paddingBottom = 35;
      
      let chartW = width - paddingLeft - paddingRight;
      let chartH = height - paddingTop - paddingBottom;
      
      function toSvgX(x) {
        return paddingLeft + ((x - minX) / (maxX - minX)) * chartW;
      }
      
      function toSvgY(y) {
        return paddingTop + chartH - ((y - minY) / (maxY - minY)) * chartH;
      }
      
      let pathD = '';
      for (let i = 0; i < points.length; i++) {
        let sx = toSvgX(points[i].x);
        let sy = toSvgY(points[i].y);
        if (sy >= paddingTop && sy <= paddingTop + chartH) {
          if (pathD === '') {
            pathD += `M ${sx} ${sy}`;
          } else {
            pathD += ` L ${sx} ${sy}`;
          }
        }
      }
      
      let yZeroY = toSvgY(0);
      let xAxisHtml = '';
      if (yZeroY >= paddingTop && yZeroY <= paddingTop + chartH) {
        xAxisHtml = `<line x1="${paddingLeft}" y1="${yZeroY}" x2="${width - paddingRight}" y2="${yZeroY}" stroke="var(--border)" stroke-width="2" stroke-dasharray="4,4" />`;
      }
      
      let xZeroX = toSvgX(0);
      let yAxisHtml = '';
      if (xZeroX >= paddingLeft && xZeroX <= paddingLeft + chartW) {
        yAxisHtml = `<line x1="${xZeroX}" y1="${paddingTop}" x2="${xZeroX}" y2="${height - paddingBottom}" stroke="var(--border)" stroke-width="1.5" stroke-dasharray="2,2" />`;
      }
      
      let f_a = evaluateMath(expr, initA);
      let f_b = evaluateMath(expr, initB);
      
      let aX = toSvgX(initA);
      let aY = toSvgY(f_a);
      let bX = toSvgX(initB);
      let bY = toSvgY(f_b);
      let rootX = toSvgX(root);
      let rootY = toSvgY(0);
      
      let secantLineHtml = '';
      if (isFinite(aY) && isFinite(bY)) {
        secantLineHtml = `<line x1="${aX}" y1="${aY}" x2="${bX}" y2="${bY}" stroke="#3b82f6" stroke-width="2" stroke-dasharray="3,3" />`;
      }
      
      let graphHtml = `
        <div style="margin-top: 2rem; width: 100%; display: flex; flex-direction: column; align-items: center;">
          <div style="font-weight:700; color:var(--navy); font-size:1.1rem; margin-bottom:1rem; font-family:'Fraunces', serif;">✦ Graphical Secant Convergence</div>
          <div style="background: var(--bg); border: 1px solid var(--border); border-radius: 12px; padding: 1.25rem; width: 100%; max-width: 540px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.03);">
            <svg viewBox="0 0 ${width} ${height}" style="width: 100%; height: auto;">
              <!-- Grid/Axes -->
              ${xAxisHtml}
              ${yAxisHtml}
              
              <!-- Function Curve -->
              <path d="${pathD}" fill="none" stroke="var(--amber)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
              
              <!-- Secant line -->
              ${secantLineHtml}
              
              <!-- Point a marker -->
              <circle cx="${aX}" cy="${aY}" r="5" fill="#ef4444" />
              <line x1="${aX}" y1="${aY}" x2="${aX}" y2="${yZeroY}" stroke="#ef4444" stroke-width="1.2" stroke-dasharray="2,2" />
              <text x="${aX}" y="${aY >= yZeroY ? aY + 14 : aY - 6}" font-size="10" font-family="'IBM Plex Mono', monospace" fill="#ef4444" text-anchor="middle">a (${initA})</text>
              
              <!-- Point b marker -->
              <circle cx="${bX}" cy="${bY}" r="5" fill="#ef4444" />
              <line x1="${bX}" y1="${bY}" x2="${bX}" y2="${yZeroY}" stroke="#ef4444" stroke-width="1.2" stroke-dasharray="2,2" />
              <text x="${bX}" y="${bY >= yZeroY ? bY + 14 : bY - 6}" font-size="10" font-family="'IBM Plex Mono', monospace" fill="#ef4444" text-anchor="middle">b (${initB})</text>
              
              <!-- Root Point marker -->
              <circle cx="${rootX}" cy="${rootY}" r="6" fill="var(--teal)" stroke="#ffffff" stroke-width="2" />
              <text x="${rootX}" y="${rootY - 12}" font-size="12" font-weight="700" font-family="'IBM Plex Mono', monospace" fill="var(--teal)" text-anchor="middle">Root (${root.toFixed(4)})</text>
              
              <!-- Axis Labels -->
              <text x="${width - paddingRight - 10}" y="${yZeroY - 6}" font-size="11" font-weight="600" fill="var(--muted)" text-anchor="end">x-axis</text>
            </svg>
          </div>
        </div>
      `;
      return graphHtml;
    }

    function calculateFalsePosition() {
      const output = document.getElementById('steps-output');
      output.innerHTML = '';
      output.classList.add('active');

      let expr = document.getElementById('false-position-function').value.trim();
      let aValStr = document.getElementById('false-position-a').value.trim();
      let bValStr = document.getElementById('false-position-b').value.trim();
      let toleranceValStr = document.getElementById('false-position-tolerance').value.trim();
      let maxIterValStr = document.getElementById('false-position-max-iter').value.trim();
      let decimalsValStr = document.getElementById('false-position-decimals').value.trim();

      if (expr === '' || aValStr === '' || bValStr === '' || toleranceValStr === '' || maxIterValStr === '' || decimalsValStr === '') {
        output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Missing Fields</div></div><div class="step-desc">Please ensure all calculator parameters are filled with valid entries.</div></div>`;
        output.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      if (!/x/i.test(expr)) {
        output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Invalid Function Variable</div></div><div class="step-desc">The function expression must contain the variable <b>'x'</b> (e.g. <code>x^3 - x - 1</code>).</div></div>`;
        output.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      let testVal = evaluateMath(expr, 1.0);
      if (isNaN(testVal)) {
        output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Invalid Function Syntax</div></div><div class="step-desc">Please ensure the function is written correctly (e.g. <code>x^3 - x - 1</code>, <code>cos(x) - x</code>). Check for unmatched parentheses or dangling operators.</div></div>`;
        output.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      let initA = parseFloat(aValStr);
      let initB = parseFloat(bValStr);
      let tolerance = parseFloat(toleranceValStr);
      let maxIter = parseInt(maxIterValStr);
      let decimals = parseInt(decimalsValStr);

      if (isNaN(initA) || !isFinite(initA) || isNaN(initB) || !isFinite(initB)) {
        output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Invalid Boundary Values</div></div><div class="step-desc">Lower bound (a) and Upper bound (b) must be valid real numbers.</div></div>`;
        output.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      if (initA === initB) {
        output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Invalid Interval</div></div><div class="step-desc">Lower bound and upper bound cannot be equal.</div></div>`;
        output.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      if (isNaN(tolerance) || tolerance <= 0 || tolerance > 1) {
        output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Invalid Tolerance</div></div><div class="step-desc">Tolerance must be a positive number less than or equal to 1.</div></div>`;
        output.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      if (isNaN(maxIter) || maxIter < 1 || maxIter > 500) {
        output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Invalid Max Iterations</div></div><div class="step-desc">Maximum iterations must be an integer between 1 and 500.</div></div>`;
        output.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      if (isNaN(decimals) || !/^\d+$/.test(decimalsValStr) || decimals < 0 || decimals > 15) {
        output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Invalid Decimal Places</div></div><div class="step-desc">Decimal places must be an integer between 0 and 15.</div></div>`;
        output.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      let f_initA = evaluateMath(expr, initA);
      let f_initB = evaluateMath(expr, initB);

      if (isNaN(f_initA) || isNaN(f_initB)) {
        output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Evaluation Error</div></div><div class="step-desc">The function could not be evaluated at the boundaries. Check for division by zero or log of negative numbers.</div></div>`;
        output.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      if (f_initA * f_initB > 0) {
        output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626; font-size:1.25rem;">Root Bracketing Failure</div></div><div class="step-desc" style="font-size:1.05rem;">
          Evaluating boundaries:<br>
          f(a) = f(${initA.toFixed(decimals)}) = ${f_initA.toFixed(decimals)}<br>
          f(b) = f(${initB.toFixed(decimals)}) = ${f_initB.toFixed(decimals)}<br><br>
          Verification:<br>
          f(a) &times; f(b) = (${f_initA.toFixed(decimals)}) &times; (${f_initB.toFixed(decimals)}) = ${(f_initA * f_initB).toFixed(decimals)} &gt; 0<br><br>
          <span style="font-weight:700; color: #dc2626; display: block; text-align: center; margin-top: 1rem; font-size: 1.1rem;">Root is not bracketed in the selected interval.<br>False Position Method cannot proceed.</span>
        </div></div>`;
        output.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      let stepsHtml = '';
      let stepCount = 1;

      // Step 1: Given Function
      stepsHtml += `<div class="step-card"><div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)"><div style="display: flex; align-items: center; gap: 0.75rem;"><div class="step-number">${stepCount++}</div><div class="step-title">Given Function</div></div><div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div></div><div class="step-content"><div class="step-desc">We start with the following given equation representing the function:</div><div style="font-family: 'Fraunces', serif; font-size: 1.5rem; color: var(--navy); text-align: center; margin: 1.5rem 0;">f(x) = ${expr}</div></div></div>`;

      // Step 2: Initial Interval
      stepsHtml += `<div class="step-card"><div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)"><div style="display: flex; align-items: center; gap: 0.75rem;"><div class="step-number">${stepCount++}</div><div class="step-title">Initial Interval</div></div><div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div></div><div class="step-content"><div class="step-desc">We are given the initial interval boundaries:</div><div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.2rem; color: var(--navy); text-align: center; margin: 1.5rem 0; display: flex; flex-direction: column; gap: 0.5rem;">
        <div>a = ${initA.toFixed(decimals)}</div>
        <div>b = ${initB.toFixed(decimals)}</div>
      </div><div class="step-desc" style="margin-top: 1rem;">Evaluating the function at these boundary values:</div><div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.2rem; color: var(--navy); text-align: center; margin: 1.5rem 0; display: flex; flex-direction: column; gap: 0.5rem;">
        <div>f(a) = f(${initA.toFixed(decimals)}) = ${f_initA.toFixed(decimals)}</div>
        <div>f(b) = f(${initB.toFixed(decimals)}) = ${f_initB.toFixed(decimals)}</div>
      </div></div></div>`;

      // Step 3: Root Bracketing Verification
      stepsHtml += `<div class="step-card"><div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)"><div style="display: flex; align-items: center; gap: 0.75rem;"><div class="step-number">${stepCount++}</div><div class="step-title">Root Bracketing Verification</div></div><div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div></div><div class="step-content"><div class="step-desc">According to Intermediate Value Theorem, a root exists in [a, b] if the function signs at the boundaries are opposite (i.e. f(a) &times; f(b) &lt; 0):</div><div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.2rem; color: var(--navy); text-align: center; margin: 1.5rem 0;">
        f(a) &times; f(b) = (${f_initA.toFixed(decimals)}) &times; (${f_initB.toFixed(decimals)}) = ${(f_initA * f_initB).toFixed(decimals)} &lt; 0
      </div><div style="text-align: center; font-weight: 600; color: var(--teal); font-size:1.05rem;">A root exists in the interval [${initA.toFixed(decimals)}, ${initB.toFixed(decimals)}].</div></div></div>`;

      // Step 4: False Position Formula
      stepsHtml += `<div class="step-card"><div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)"><div style="display: flex; align-items: center; gap: 0.75rem;"><div class="step-number">${stepCount++}</div><div class="step-title">False Position Formula</div></div><div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div></div><div class="step-content"><div class="step-desc">The False Position formula uses linear interpolation between the boundary points to estimate the root:</div>
        <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.25rem; color: var(--navy); text-align: center; margin: 1.5rem 0; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
          <span>x<sub>r</sub> = </span>
          <span style="display: inline-block; vertical-align: middle; text-align: center; margin: 0 4px;">
            <span style="display: block; border-bottom: 2px solid var(--navy); padding: 0 8px;">a &bull; f(b) - b &bull; f(a)</span>
            <span style="display: block; padding: 2px 0 0 0;">f(b) - f(a)</span>
          </span>
        </div>
        <div style="font-size:0.95rem; line-height:1.5; color:var(--muted); text-align: center;">Where <strong>x<sub>r</sub></strong> is the new approximation of the root.</div></div></div>`;

      let a = initA;
      let b = initB;
      let prevXr = null;
      let tableRows = [];
      let converged = false;
      let finalIter = 0;
      let isHalted = false;

      for (let k = 1; k <= maxIter; k++) {
        let f_a = evaluateMath(expr, a);
        let f_b = evaluateMath(expr, b);

        if (isNaN(f_a) || isNaN(f_b) || Math.abs(f_b - f_a) < 1e-15) {
          stepsHtml += `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626; font-size:1.25rem;">Iteration ${k} halted: Evaluation Error</div></div><div class="step-desc" style="font-size:1rem;">Evaluation error or zero denominator at boundary points. False Position cannot continue.</div></div>`;
          isHalted = true;
          break;
        }

        let xr = (a * f_b - b * f_a) / (f_b - f_a);
        let f_xr = evaluateMath(expr, xr);

        if (isNaN(xr) || isNaN(f_xr)) {
          stepsHtml += `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626; font-size:1.25rem;">Iteration ${k} halted: Evaluation Error</div></div><div class="step-desc" style="font-size:1rem;">The function evaluated to NaN at xr = ${xr.toFixed(decimals)}. False Position cannot continue.</div></div>`;
          isHalted = true;
          break;
        }

        let err = prevXr !== null ? Math.abs(xr - prevXr) : null;

        tableRows.push({
          iter: k,
          a: a,
          b: b,
          xr: xr,
          fxr: f_xr,
          error: err !== null ? err : NaN
        });

        let substitutionHtml = `
          <div style="padding: 1.25rem; border: 1px solid var(--border); border-left: 4px solid var(--amber); background: var(--bg); border-radius: 8px; font-family: 'IBM Plex Mono', monospace; font-size: 1.05rem; display: flex; flex-direction: column; gap: 0.75rem;">
            <div>&bull; Current Interval: <b>[a, b] = [${a.toFixed(decimals)}, ${b.toFixed(decimals)}]</b></div>
            <div>&bull; Boundaries: <b>f(a) = ${f_a.toFixed(decimals)}</b>, <b>f(b) = ${f_b.toFixed(decimals)}</b></div>
            <div style="border-top: 1px dashed var(--border); padding-top: 0.75rem; margin-top: 0.25rem;">&bull; Substitution into formula:</div>
            <div style="display: flex; align-items: center; gap: 0.5rem; padding-left: 1rem; flex-wrap: wrap;">
              <span>x<sub>r</sub> = </span>
              <span style="display: inline-block; vertical-align: middle; text-align: center; margin: 0 4px;">
                <span style="display: block; border-bottom: 1px dashed var(--navy); padding: 0 4px;">(${a.toFixed(decimals)})(${f_b.toFixed(decimals)}) - (${b.toFixed(decimals)})(${f_a.toFixed(decimals)})</span>
                <span style="display: block; padding: 1px 0;">${f_b.toFixed(decimals)} - (${f_a.toFixed(decimals)})</span>
              </span>
              <span> = <strong>${xr.toFixed(decimals)}</strong></span>
            </div>
            <div style="border-top: 1px dashed var(--border); padding-top: 0.75rem; margin-top: 0.25rem;">&bull; Function evaluation at root approximation:</div>
            <div style="padding-left: 1rem;">
              f(x<sub>r</sub>) = f(${xr.toFixed(decimals)}) = <strong>${f_xr.toFixed(decimals)}</strong>
            </div>
          </div>
        `;

        let testProduct = f_a * f_xr;
        let nextIntervalReasoning = '';
        let nextA = a;
        let nextB = b;

        if (testProduct < 0) {
          nextB = xr;
          nextIntervalReasoning = `
            <div>Since <b>f(a) &times; f(x<sub>r</sub>) &lt; 0</b> (opposite signs):</div>
            <div style="padding-left: 1rem; margin-top: 0.25rem; font-weight: 600;">
              f(${a.toFixed(decimals)}) &times; f(${xr.toFixed(decimals)}) = (${f_a.toFixed(decimals)}) &times; (${f_xr.toFixed(decimals)}) = ${(testProduct).toFixed(decimals)} &lt; 0
            </div>
            <div style="margin-top: 0.5rem;">The root lies in the left sub-interval: <b>[a, x<sub>r</sub>]</b>.</div>
            <div style="margin-top: 0.25rem; color: var(--teal); font-weight: 700;">Update: Upper Bound b = x<sub>r</sub> = ${xr.toFixed(decimals)}</div>
          `;
        } else {
          nextA = xr;
          nextIntervalReasoning = `
            <div>Since <b>f(a) &times; f(x<sub>r</sub>) &ge; 0</b> (same signs):</div>
            <div style="padding-left: 1rem; margin-top: 0.25rem; font-weight: 600;">
              f(${a.toFixed(decimals)}) &times; f(${xr.toFixed(decimals)}) = (${f_a.toFixed(decimals)}) &times; (${f_xr.toFixed(decimals)}) = ${(testProduct).toFixed(decimals)} &ge; 0
            </div>
            <div style="margin-top: 0.5rem;">The root lies in the right sub-interval: <b>[x<sub>r</sub>, b]</b>.</div>
            <div style="margin-top: 0.25rem; color: var(--teal); font-weight: 700;">Update: Lower Bound a = x<sub>r</sub> = ${xr.toFixed(decimals)}</div>
          `;
        }

        let errorCalcHtml = '';
        if (err !== null) {
          errorCalcHtml = `
            <div style="font-family:'IBM Plex Mono',monospace; font-size: 1rem; margin-bottom: 0.5rem;">
              Error = |x<sub>r</sub><sup>(current)</sup> - x<sub>r</sub><sup>(previous)</sup>| = |${xr.toFixed(decimals)} - ${prevXr.toFixed(decimals)}| = <strong>${err.toFixed(decimals)}</strong>
            </div>
            <div style="font-weight: 700; border-top: 1px dashed var(--border); padding-top: 0.5rem; margin-top: 0.5rem; font-size: 0.95rem;">
              Comparison: ${err.toFixed(decimals)} ${err < tolerance ? ` &lt; ${tolerance} (&epsilon;) <span style="color: var(--teal)">&nbsp;&bull;&nbsp; Converged!</span>` : ` &ge; ${tolerance} (&epsilon;)`}
            </div>
          `;
        } else {
          errorCalcHtml = `
            <div style="font-family:'IBM Plex Mono',monospace; font-size: 1rem; margin-bottom: 0.5rem;">
              Error = <strong>Not Applicable</strong> (First iteration)
            </div>
            <div style="font-weight: 700; border-top: 1px dashed var(--border); padding-top: 0.5rem; margin-top: 0.5rem; font-size: 0.95rem;">
              Comparison: N/A &ge; ${tolerance} (&epsilon;) &mdash; Continue iteration.
            </div>
          `;
        }

        stepsHtml += `<div class="step-card"><div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)"><div style="display: flex; align-items: center; gap: 0.75rem;"><div class="step-number">${stepCount++}</div><div class="step-title">Iteration ${k}</div></div><div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted); transform: rotate(-90deg);">▼</div></div><div class="step-content" style="display: none;">
          <div class="step-desc">Using interval bounds [a, b] = [${a.toFixed(decimals)}, ${b.toFixed(decimals)}] to compute the new root approximation:</div>
          <div style="margin-top: 1rem;">${substitutionHtml}</div>
          <div style="margin-top: 1.25rem; padding: 1.25rem; background: var(--bg); border: 1px solid var(--border); border-radius: 8px; font-size: 0.95rem; line-height: 1.5;">
            <div style="font-weight: 700; text-transform: uppercase; font-size: 0.85rem; letter-spacing:0.05em; color:var(--muted); margin-bottom: 0.5rem;">Interval Update Decision:</div>
            ${nextIntervalReasoning}
          </div>
          <div style="margin-top: 1.25rem; padding: 1rem; background: var(--bg); border-radius: 8px; font-size: 0.95rem; color: var(--navy); border: 1px solid var(--border);">
            <div style="font-weight: 700; margin-bottom: 0.5rem; text-transform: uppercase; font-size: 0.85rem; letter-spacing:0.05em; color:var(--muted);">Error Calculation:</div>
            ${errorCalcHtml}
          </div>
        </div></div>`;

        prevXr = xr;
        a = nextA;
        b = nextB;
        finalIter = k;

        if (err !== null && err < tolerance) {
          converged = true;
          break;
        }
      }

      if (!isHalted) {
        let tableRowsHtml = tableRows.map(row => {
          let errValStr = isNaN(row.error) ? '-' : row.error.toFixed(decimals);
          let isFinalRow = row.iter === finalIter && converged;
          let rowStyle = isFinalRow ? 'background: rgba(13, 148, 136, 0.05); font-weight:600;' : '';
          return `<tr style="border-bottom: 1px solid var(--border); ${rowStyle}">
            <td style="padding: 0.75rem; text-align: center; font-weight: 600;">${row.iter}</td>
            <td style="padding: 0.75rem; text-align: center; font-family: 'IBM Plex Mono', monospace;">${row.a.toFixed(decimals)}</td>
            <td style="padding: 0.75rem; text-align: center; font-family: 'IBM Plex Mono', monospace;">${row.b.toFixed(decimals)}</td>
            <td style="padding: 0.75rem; text-align: center; font-family: 'IBM Plex Mono', monospace;">${row.xr.toFixed(decimals)}</td>
            <td style="padding: 0.75rem; text-align: center; font-family: 'IBM Plex Mono', monospace;">${row.fxr.toFixed(decimals)}</td>
            <td style="padding: 0.75rem; text-align: center; font-family: 'IBM Plex Mono', monospace; font-weight: 700; color: var(--navy);">${errValStr}</td>
          </tr>`;
        }).join('');

        stepsHtml += `<div class="step-card"><div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)"><div style="display: flex; align-items: center; gap: 0.75rem;"><div class="step-number">${stepCount++}</div><div class="step-title">Iteration Summary Table</div></div><div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted); transform: rotate(-90deg);">▼</div></div><div class="step-content" style="display: none;"><div class="step-desc">A unified view of variable approximations:</div><div style="overflow-x: auto; margin-top: 1.5rem;"><table style="width: 100%; border-collapse: collapse; border: 1px solid var(--border);"><thead><tr style="background: var(--bg); border-bottom: 2px solid var(--border);"><th style="padding: 0.75rem; color: var(--navy); width: 80px;">Iter</th><th style="padding: 0.75rem; color: var(--navy);">a</th><th style="padding: 0.75rem; color: var(--navy);">b</th><th style="padding: 0.75rem; color: var(--navy);">x<sub>r</sub></th><th style="padding: 0.75rem; color: var(--navy);">f(x<sub>r</sub>)</th><th style="padding: 0.75rem; color: var(--navy);">Abs Error</th></tr></thead><tbody>${tableRowsHtml}</tbody></table></div></div></div>`;

        if (converged) {
          let lastRow = tableRows[tableRows.length - 1];
          stepsHtml += `<div class="step-card"><div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)"><div style="display: flex; align-items: center; gap: 0.75rem;"><div class="step-number">${stepCount++}</div><div class="step-title">Convergence Check</div></div><div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted); transform: rotate(-90deg);">▼</div></div><div class="step-content" style="display: none;"><div class="step-desc">Comparing final iteration error with tolerance threshold:</div>
            <div style="font-family:'IBM Plex Mono',monospace; font-size:1.15rem; color:var(--navy); text-align:center; margin:1.5rem 0; padding: 1rem; background: var(--bg); border: 1px solid var(--border); border-radius: 8px;">
              <div>Error &lt; Tolerance</div>
              <div style="font-weight: 700; font-size: 1.3rem; margin-top: 0.5rem; color: var(--teal);">
                ${lastRow.error.toFixed(decimals)} &lt; ${tolerance} &mdash; True
              </div>
            </div>
            <div style="font-size:0.95rem; line-height:1.5; color:var(--muted); text-align: center;">The method converged as the error is strictly below tolerance.</div></div></div>`;
        }

        let chartGraphHtml = '';
        let finalXr = tableRows[tableRows.length - 1].xr;
        try {
          chartGraphHtml = generateFalsePositionGraphSVG(expr, finalXr, initA, initB);
        } catch(gErr) {
          console.error("SVG Plot error:", gErr);
        }

        stepsHtml += converged 
          ? `<div class="final-result animate-fade-in" style="text-align: center; padding: 2.5rem; background: var(--navy); color: #ffffff; border-radius: 16px; border: 1px solid var(--border); box-shadow: 0 10px 30px rgba(0,0,0,0.15); margin-top: 2rem;"><div style="font-size: 1.8rem; font-weight: 700; color: var(--amber); margin-bottom: 0.5rem; font-family:'Fraunces', serif;">✅ Solution Converged Successfully!</div><div style="font-size: 1.05rem; opacity: 0.9; margin-bottom: 1.5rem;">The system converged within tolerance limit (&epsilon; = ${tolerance}) after <strong>${finalIter}</strong> iterations.</div><div style="display:inline-block; text-align: left; padding: 1.5rem; background: rgba(255,255,255,0.06); border-radius: 12px; border: 1px solid rgba(255,255,255,0.12); min-width: 250px;"><div style="font-size:0.95rem; font-weight:600; color: rgba(255,255,255,0.7); border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; margin-bottom: 0.75rem;">Final Solved Root:</div><div style="font-family:'IBM Plex Mono',monospace; font-size: 1.45rem; font-weight:700; color:var(--amber); margin: 0.6rem 0;">Root ≈ <span style="color:#ffffff;">${finalXr.toFixed(decimals)}</span></div><div style="font-size: 0.9rem; opacity:0.8; margin-top: 0.5rem;">Converged after <strong>${finalIter}</strong> iterations</div></div>${chartGraphHtml}</div>` 
          : `<div class="final-result animate-fade-in" style="text-align: center; padding: 2.5rem; background: #991b1b; color: #ffffff; border-radius: 16px; border: 1px solid var(--border); box-shadow: 0 10px 30px rgba(0,0,0,0.15); margin-top: 2rem;"><div style="font-size: 1.8rem; font-weight: 700; color: var(--amber); margin-bottom: 0.5rem; font-family:'Fraunces', serif;">⚠️ Limits Reached Without Convergence</div><div style="font-size: 1.05rem; opacity: 0.9; margin-bottom: 1.5rem;">Method did not converge within the specified iteration limit (&epsilon; = ${tolerance}) within <strong>${maxIter}</strong> iterations limit.</div><div style="display:inline-block; text-align: left; padding: 1.5rem; background: rgba(255,255,255,0.06); border-radius: 12px; border: 1px solid rgba(255,255,255,0.12); min-width: 250px;"><div style="font-size:0.95rem; font-weight:600; color: rgba(255,255,255,0.7); border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; margin-bottom: 0.75rem;">Last Computed State (Iteration ${finalIter}):</div><div style="font-family:'IBM Plex Mono',monospace; font-size: 1.45rem; font-weight:700; color:var(--amber); margin: 0.6rem 0;">Root ≈ <span style="color:#ffffff;">${finalXr.toFixed(decimals)}</span></div></div></div>`;

        stepsHtml += `<div class="step-card" style="border-left: 4px solid var(--teal); background: rgba(13, 148, 136, 0.05); margin-top: 2rem;"><div style="font-weight: 700; color: var(--teal); font-size: 1.1rem; margin-bottom: 0.5rem; font-family:'Fraunces', serif;">✦ Educational Note: Method Characteristics</div><div style="font-size: 1rem; line-height: 1.5; color: var(--navy);">False Position Method combines interval bracketing with interpolation, making it generally faster than the Bisection Method while maintaining guaranteed bracketing of the root.</div></div>`;
      }

      output.innerHTML = stepsHtml;
      output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function calculateIntegration() {
      const output = document.getElementById('steps-output');
      if(!output) return;
      output.innerHTML = '';
      output.classList.add('active');

      // 1. Read input values
      const expr = document.getElementById('integration-function').value.trim();
      const initA = parseFloat(document.getElementById('integration-a').value);
      const initB = parseFloat(document.getElementById('integration-b').value);
      const intervalsN = parseInt(document.getElementById('integration-n').value);
      const decimals = parseInt(document.getElementById('integration-decimals').value);

      // 2. Validate inputs
      if (!expr) {
        output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Empty Function</div></div><div class="step-desc">Please enter a valid mathematical function f(x).</div></div>`;
        output.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      if (isNaN(initA) || isNaN(initB)) {
        output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Invalid Limits</div></div><div class="step-desc">Please enter valid numerical lower and upper integration limits (a and b).</div></div>`;
        output.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      if (initA === initB) {
        output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Matching Limits</div></div><div class="step-desc">The lower limit (a) and upper limit (b) cannot be equal. The integral over a single point is zero.</div></div>`;
        output.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      if (isNaN(intervalsN) || intervalsN < 1) {
        output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Invalid Intervals</div></div><div class="step-desc">The number of intervals (n) must be an integer greater than or equal to 1.</div></div>`;
        output.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      if (isNaN(decimals) || decimals < 0 || decimals > 15) {
        output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Invalid Precision</div></div><div class="step-desc">Decimal places must be an integer between 0 and 15.</div></div>`;
        output.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      // Check method specific constraints
      if (currentCalc === 'simpson-1-3' && intervalsN % 2 !== 0) {
        output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626; font-size: 1.25rem;">Simpson's 1/3 Rule Constraint Error</div></div><div class="step-desc" style="font-size: 1.05rem;">
          Evaluating interval check:<br>
          Entered n = <strong>${intervalsN}</strong><br><br>
          <span style="font-weight:700; color: #dc2626; display: block; text-align: center; margin-top: 0.5rem; font-size: 1.1rem;">Simpson's 1/3 Rule requires an even number of intervals (n).</span>
        </div></div>`;
        output.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      if (currentCalc === 'simpson-3-8' && intervalsN % 3 !== 0) {
        output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626; font-size: 1.25rem;">Simpson's 3/8 Rule Constraint Error</div></div><div class="step-desc" style="font-size: 1.05rem;">
          Evaluating interval check:<br>
          Entered n = <strong>${intervalsN}</strong><br><br>
          <span style="font-weight:700; color: #dc2626; display: block; text-align: center; margin-top: 0.5rem; font-size: 1.1rem;">Simpson's 3/8 Rule requires intervals (n) to be a multiple of 3.</span>
        </div></div>`;
        output.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      // Test parser evaluation at limits
      let f_testA = evaluateMath(expr, initA);
      if (isNaN(f_testA)) {
        output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Evaluation Failure</div></div><div class="step-desc">The function could not be evaluated at lower limit a = ${initA}. Please check your math function syntax.</div></div>`;
        output.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      // 3. Setup core variables
      let stepsHtml = '';
      let stepCount = 1;

      // Compute step size
      const h = (initB - initA) / intervalsN;

      // Generate nodes and evaluate function values
      let nodes = [];
      for (let i = 0; i <= intervalsN; i++) {
        let xi = initA + i * h;
        // Fix potential floating point issues on boundary values
        if (i === 0) xi = initA;
        if (i === intervalsN) xi = initB;
        
        let yi = evaluateMath(expr, xi);
        if (isNaN(yi)) {
          output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Evaluation Failure</div></div><div class="step-desc">The function failed to evaluate at coordinate x<sub>${i}</sub> = ${xi.toFixed(decimals)}. Check for out-of-domain terms (like log of negative, division by zero).</div></div>`;
          output.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }
        nodes.push({ i: i, x: xi, y: yi });
      }

      // Step 1: Given Parameters & Step Size
      stepsHtml += `
        <div class="step-card">
          <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <div class="step-number">${stepCount++}</div>
              <div class="step-title">Given Parameters & Step Size (h)</div>
            </div>
            <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div>
          </div>
          <div class="step-content">
            <div class="step-desc">We extract the given integration bounds, intervals, and compute the step size <b>h</b>:</div>
            <div style="padding: 1.25rem; background: var(--bg); border: 1px solid var(--border); border-radius: 8px; font-family: 'IBM Plex Mono', monospace; font-size: 1.05rem; display: flex; flex-direction: column; gap: 0.5rem; max-width: 500px; margin: 1.5rem auto;">
              <div>&bull; Function to Integrate f(x) = <b>${expr}</b></div>
              <div>&bull; Lower Limit (a) = <b>${initA.toFixed(decimals)}</b></div>
              <div>&bull; Upper Limit (b) = <b>${initB.toFixed(decimals)}</b></div>
              <div>&bull; Number of Intervals (n) = <b>${intervalsN}</b></div>
            </div>
            <div class="step-desc">The step size formula is:</div>
            <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.25rem; color: var(--navy); text-align: center; margin: 1.5rem 0; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
              <span>h = </span>
              <span style="display: inline-block; vertical-align: middle; text-align: center; margin: 0 4px;">
                <span style="display: block; border-bottom: 2px solid var(--navy); padding: 0 8px;">b - a</span>
                <span style="display: block; padding: 2px 0 0 0;">n</span>
              </span>
            </div>
            <div class="step-desc">Substituting our bounds:</div>
            <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.2rem; color: var(--navy); text-align: center; margin: 1rem 0; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
              <span>h = </span>
              <span style="display: inline-block; vertical-align: middle; text-align: center; margin: 0 4px;">
                <span style="display: block; border-bottom: 1px dashed var(--navy); padding: 0 4px;">${initB.toFixed(decimals)} - ${initA.toFixed(decimals)}</span>
                <span style="display: block; padding: 1px 0;">${intervalsN}</span>
              </span>
              <span> = <strong>${h.toFixed(decimals)}</strong></span>
            </div>
          </div>
        </div>
      `;

      // Step 2: Table of Values
      let tableRowsHtml = nodes.map(node => `
        <tr style="border-bottom: 1px solid var(--border);">
          <td style="padding: 0.75rem; text-align: center; font-weight: 600;">i = ${node.i}</td>
          <td style="padding: 0.75rem; text-align: center; font-family: 'IBM Plex Mono', monospace;">x<sub>${node.i}</sub> = ${node.x.toFixed(decimals)}</td>
          <td style="padding: 0.75rem; text-align: center; font-family: 'IBM Plex Mono', monospace; font-weight: 700; color: var(--navy);">y<sub>${node.i}</sub> = ${node.y.toFixed(decimals)}</td>
        </tr>
      `).join('');

      stepsHtml += `
        <div class="step-card">
          <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <div class="step-number">${stepCount++}</div>
              <div class="step-title">Discrete Value Table</div>
            </div>
            <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted); transform: rotate(-90deg);">▼</div>
          </div>
          <div class="step-content" style="display: none;">
            <div class="step-desc">We construct a table by evaluating the function at each coordinate step x<sub>i</sub> = a + i &bull; h:</div>
            <div style="overflow-x: auto; margin-top: 1.5rem;">
              <table style="width: 100%; border-collapse: collapse; border: 1px solid var(--border); margin: 0 auto; max-width: 600px;">
                <thead>
                  <tr style="background: var(--bg); border-bottom: 2px solid var(--border);">
                    <th style="padding: 0.75rem; color: var(--navy); width: 80px;">Node Index</th>
                    <th style="padding: 0.75rem; color: var(--navy);">Coordinate (x)</th>
                    <th style="padding: 0.75rem; color: var(--navy);">Function Value y = f(x)</th>
                  </tr>
                </thead>
                <tbody>
                  ${tableRowsHtml}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;

      // 4. Calculate Integral based on rule
      let resultVal = 0;
      let ruleFormulaHtml = '';
      let groupDetailsHtml = '';
      let substitutionMathHtml = '';
      let methodNoteText = '';

      // Boundary sum is always common: y_0 + y_n
      const y0 = nodes[0].y;
      const yn = nodes[intervalsN].y;
      const boundarySum = y0 + yn;

      if (currentCalc === 'trapezoidal') {
        // Group remaining sum
        let remainingNodes = nodes.slice(1, intervalsN);
        let sumRemaining = remainingNodes.reduce((acc, curr) => acc + curr.y, 0);
        resultVal = (h / 2) * (boundarySum + 2 * sumRemaining);

        ruleFormulaHtml = `
          <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.25rem; color: var(--navy); text-align: center; margin: 1.5rem 0; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
            <span>I &approx; </span>
            <span style="display: inline-block; vertical-align: middle; text-align: center; margin: 0 4px;">
              <span style="display: block; border-bottom: 2px solid var(--navy); padding: 0 4px;">h</span>
              <span style="display: block; padding: 2px 0 0 0;">2</span>
            </span>
            <span>[ (y<sub>0</sub> + y<sub>n</sub>) + 2(y<sub>1</sub> + y<sub>2</sub> + &hellip; + y<sub>n-1</sub>) ]</span>
          </div>
        `;

        groupDetailsHtml = `
          <div style="padding: 1.25rem; border: 1px solid var(--border); border-left: 4px solid var(--amber); background: var(--bg); border-radius: 8px; font-family: 'IBM Plex Mono', monospace; font-size: 1.05rem; display: flex; flex-direction: column; gap: 0.75rem;">
            <div style="font-weight: 700; text-transform: uppercase; font-size: 0.85rem; letter-spacing:0.05em; color:var(--muted); margin-bottom: 0.25rem;">Node Term Groupings:</div>
            <div>&bull; Boundary Sum (y<sub>0</sub> + y<sub>${intervalsN}</sub>): <br>
              <span style="padding-left: 1rem; color: var(--navy); font-weight:600;">${y0.toFixed(decimals)} + ${yn.toFixed(decimals)} = ${boundarySum.toFixed(decimals)}</span>
            </div>
            <div>&bull; Remaining Middle Nodes Sum (y<sub>1</sub> + &hellip; + y<sub>${intervalsN-1}</sub>): <br>
              <span style="padding-left: 1rem; color: var(--navy); font-weight:600; word-break: break-all;">
                (${remainingNodes.map(n => n.y.toFixed(decimals)).join(' + ')}) = ${sumRemaining.toFixed(decimals)}
              </span>
            </div>
          </div>
        `;

        substitutionMathHtml = `
          <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.15rem; color: var(--navy); padding-left: 1rem; display: flex; flex-direction: column; gap: 0.75rem; border-top: 1px dashed var(--border); padding-top: 1rem;">
            <div>&bull; Substitution:</div>
            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
              <span>I &approx; </span>
              <span style="display: inline-block; vertical-align: middle; text-align: center; margin: 0 4px;">
                <span style="display: block; border-bottom: 1px dashed var(--navy); padding: 0 4px;">${h.toFixed(decimals)}</span>
                <span style="display: block; padding: 1px 0;">2</span>
              </span>
              <span>[ ${boundarySum.toFixed(decimals)} + 2(${sumRemaining.toFixed(decimals)}) ]</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.5rem;">
              <span>I &approx; </span>
              <span>${(h / 2).toFixed(decimals)} &bull; [ ${boundarySum.toFixed(decimals)} + ${(2 * sumRemaining).toFixed(decimals)} ]</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.5rem;">
              <span>I &approx; </span>
              <span>${(h / 2).toFixed(decimals)} &bull; [ ${(boundarySum + 2 * sumRemaining).toFixed(decimals)} ]</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.5rem; font-size: 1.3rem; color: var(--amber); font-weight: 700;">
              <span>I &approx; </span>
              <span>${resultVal.toFixed(decimals)}</span>
            </div>
          </div>
        `;

        methodNoteText = "Trapezoidal Rule approximates the area under the curve by summing up linear trapezoidal slices. It is a first-order Newton-Cotes integration formula.";

      } else if (currentCalc === 'simpson-1-3') {
        // Group odd index terms (y1, y3, ...)
        let oddNodes = [];
        let evenNodes = [];
        for (let i = 1; i < intervalsN; i++) {
          if (i % 2 !== 0) oddNodes.push(nodes[i]);
          else evenNodes.push(nodes[i]);
        }
        let oddSum = oddNodes.reduce((acc, curr) => acc + curr.y, 0);
        let evenSum = evenNodes.reduce((acc, curr) => acc + curr.y, 0);
        resultVal = (h / 3) * (boundarySum + 4 * oddSum + 2 * evenSum);

        ruleFormulaHtml = `
          <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.25rem; color: var(--navy); text-align: center; margin: 1.5rem 0; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
            <span>I &approx; </span>
            <span style="display: inline-block; vertical-align: middle; text-align: center; margin: 0 4px;">
              <span style="display: block; border-bottom: 2px solid var(--navy); padding: 0 4px;">h</span>
              <span style="display: block; padding: 2px 0 0 0;">3</span>
            </span>
            <span>[ (y<sub>0</sub> + y<sub>n</sub>) + 4&bull;&sum;(odd y<sub>i</sub>) + 2&bull;&sum;(even y<sub>i</sub>) ]</span>
          </div>
        `;

        groupDetailsHtml = `
          <div style="padding: 1.25rem; border: 1px solid var(--border); border-left: 4px solid var(--amber); background: var(--bg); border-radius: 8px; font-family: 'IBM Plex Mono', monospace; font-size: 1.05rem; display: flex; flex-direction: column; gap: 0.75rem;">
            <div style="font-weight: 700; text-transform: uppercase; font-size: 0.85rem; letter-spacing:0.05em; color:var(--muted); margin-bottom: 0.25rem;">Node Term Groupings:</div>
            <div>&bull; Boundary Sum (y<sub>0</sub> + y<sub>${intervalsN}</sub>): <br>
              <span style="padding-left: 1rem; color: var(--navy); font-weight:600;">${y0.toFixed(decimals)} + ${yn.toFixed(decimals)} = ${boundarySum.toFixed(decimals)}</span>
            </div>
            <div>&bull; Sum of Odd Node Terms (y<sub>1</sub> + y<sub>3</sub> + &hellip;): <br>
              <span style="padding-left: 1rem; color: var(--navy); font-weight:600; word-break: break-all;">
                (${oddNodes.map(n => n.y.toFixed(decimals)).join(' + ')}) = ${oddSum.toFixed(decimals)}
              </span>
            </div>
            <div>&bull; Sum of Even Node Terms (y<sub>2</sub> + y<sub>4</sub> + &hellip;): <br>
              <span style="padding-left: 1rem; color: var(--navy); font-weight:600; word-break: break-all;">
                (${evenNodes.length > 0 ? evenNodes.map(n => n.y.toFixed(decimals)).join(' + ') : '0.0000'}) = ${evenSum.toFixed(decimals)}
              </span>
            </div>
          </div>
        `;

        substitutionMathHtml = `
          <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.15rem; color: var(--navy); padding-left: 1rem; display: flex; flex-direction: column; gap: 0.75rem; border-top: 1px dashed var(--border); padding-top: 1rem;">
            <div>&bull; Substitution:</div>
            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
              <span>I &approx; </span>
              <span style="display: inline-block; vertical-align: middle; text-align: center; margin: 0 4px;">
                <span style="display: block; border-bottom: 1px dashed var(--navy); padding: 0 4px;">${h.toFixed(decimals)}</span>
                <span style="display: block; padding: 1px 0;">3</span>
              </span>
              <span>[ ${boundarySum.toFixed(decimals)} + 4(${oddSum.toFixed(decimals)}) + 2(${evenSum.toFixed(decimals)}) ]</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.5rem;">
              <span>I &approx; </span>
              <span>${(h / 3).toFixed(decimals)} &bull; [ ${boundarySum.toFixed(decimals)} + ${(4 * oddSum).toFixed(decimals)} + ${(2 * evenSum).toFixed(decimals)} ]</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.5rem;">
              <span>I &approx; </span>
              <span>${(h / 3).toFixed(decimals)} &bull; [ ${(boundarySum + 4 * oddSum + 2 * evenSum).toFixed(decimals)} ]</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.5rem; font-size: 1.3rem; color: var(--amber); font-weight: 700;">
              <span>I &approx; </span>
              <span>${resultVal.toFixed(decimals)}</span>
            </div>
          </div>
        `;

        methodNoteText = "Simpson's 1/3 Rule fits quadratic parabolas over pairs of sub-intervals. It achieves a third-order accuracy and requires the interval count (n) to be strictly even.";

      } else if (currentCalc === 'simpson-3-8') {
        // Group multiples of 3, and others
        let mult3Nodes = [];
        let otherNodes = [];
        for (let i = 1; i < intervalsN; i++) {
          if (i % 3 === 0) mult3Nodes.push(nodes[i]);
          else otherNodes.push(nodes[i]);
        }
        let mult3Sum = mult3Nodes.reduce((acc, curr) => acc + curr.y, 0);
        let otherSum = otherNodes.reduce((acc, curr) => acc + curr.y, 0);
        resultVal = ((3 * h) / 8) * (boundarySum + 3 * otherSum + 2 * mult3Sum);

        ruleFormulaHtml = `
          <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.25rem; color: var(--navy); text-align: center; margin: 1.5rem 0; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
            <span>I &approx; </span>
            <span style="display: inline-block; vertical-align: middle; text-align: center; margin: 0 4px;">
              <span style="display: block; border-bottom: 2px solid var(--navy); padding: 0 4px;">3h</span>
              <span style="display: block; padding: 2px 0 0 0;">8</span>
            </span>
            <span>[ (y<sub>0</sub> + y<sub>n</sub>) + 3&bull;&sum;(y<sub>i</sub> &ne; 3j) + 2&bull;&sum;(y<sub>3j</sub>) ]</span>
          </div>
        `;

        groupDetailsHtml = `
          <div style="padding: 1.25rem; border: 1px solid var(--border); border-left: 4px solid var(--amber); background: var(--bg); border-radius: 8px; font-family: 'IBM Plex Mono', monospace; font-size: 1.05rem; display: flex; flex-direction: column; gap: 0.75rem;">
            <div style="font-weight: 700; text-transform: uppercase; font-size: 0.85rem; letter-spacing:0.05em; color:var(--muted); margin-bottom: 0.25rem;">Node Term Groupings:</div>
            <div>&bull; Boundary Sum (y<sub>0</sub> + y<sub>${intervalsN}</sub>): <br>
              <span style="padding-left: 1rem; color: var(--navy); font-weight:600;">${y0.toFixed(decimals)} + ${yn.toFixed(decimals)} = ${boundarySum.toFixed(decimals)}</span>
            </div>
            <div>&bull; Sum of Non-Multiples of 3 Node Terms (y<sub>1</sub> + y<sub>2</sub> + y<sub>4</sub> + &hellip;): <br>
              <span style="padding-left: 1rem; color: var(--navy); font-weight:600; word-break: break-all;">
                (${otherNodes.map(n => n.y.toFixed(decimals)).join(' + ')}) = ${otherSum.toFixed(decimals)}
              </span>
            </div>
            <div>&bull; Sum of Multiples of 3 Node Terms (y<sub>3</sub> + y<sub>6</sub> + &hellip;): <br>
              <span style="padding-left: 1rem; color: var(--navy); font-weight:600; word-break: break-all;">
                (${mult3Nodes.length > 0 ? mult3Nodes.map(n => n.y.toFixed(decimals)).join(' + ') : '0.0000'}) = ${mult3Sum.toFixed(decimals)}
              </span>
            </div>
          </div>
        `;

        substitutionMathHtml = `
          <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.15rem; color: var(--navy); padding-left: 1rem; display: flex; flex-direction: column; gap: 0.75rem; border-top: 1px dashed var(--border); padding-top: 1rem;">
            <div>&bull; Substitution:</div>
            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
              <span>I &approx; </span>
              <span style="display: inline-block; vertical-align: middle; text-align: center; margin: 0 4px;">
                <span style="display: block; border-bottom: 1px dashed var(--navy); padding: 0 4px;">3(${h.toFixed(decimals)})</span>
                <span style="display: block; padding: 1px 0;">8</span>
              </span>
              <span>[ ${boundarySum.toFixed(decimals)} + 3(${otherSum.toFixed(decimals)}) + 2(${mult3Sum.toFixed(decimals)}) ]</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.5rem;">
              <span>I &approx; </span>
              <span>${((3 * h) / 8).toFixed(decimals)} &bull; [ ${boundarySum.toFixed(decimals)} + ${(3 * otherSum).toFixed(decimals)} + ${(2 * mult3Sum).toFixed(decimals)} ]</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.5rem;">
              <span>I &approx; </span>
              <span>${((3 * h) / 8).toFixed(decimals)} &bull; [ ${(boundarySum + 3 * otherSum + 2 * mult3Sum).toFixed(decimals)} ]</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.5rem; font-size: 1.3rem; color: var(--amber); font-weight: 700;">
              <span>I &approx; </span>
              <span>${resultVal.toFixed(decimals)}</span>
            </div>
          </div>
        `;

        methodNoteText = "Simpson's 3/8 Rule fits cubic polynomials over sets of three sub-intervals. It requires the interval count (n) to be a multiple of 3.";
      }

      // Step 3: Rule Formula
      let ruleTitle = currentCalc === 'trapezoidal' ? 'Trapezoidal Rule Formula' : (currentCalc === 'simpson-1-3' ? "Simpson's 1/3 Rule Formula" : "Simpson's 3/8 Rule Formula");
      stepsHtml += `
        <div class="step-card">
          <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <div class="step-number">${stepCount++}</div>
              <div class="step-title">${ruleTitle}</div>
            </div>
            <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted); transform: rotate(-90deg);">▼</div>
          </div>
          <div class="step-content" style="display: none;">
            <div class="step-desc">The mathematical approximation formula is defined as:</div>
            ${ruleFormulaHtml}
          </div>
        </div>
      `;

      // Step 4: Step-by-Step Substitution
      stepsHtml += `
        <div class="step-card">
          <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <div class="step-number">${stepCount++}</div>
              <div class="step-title">Textbook Substitution & Calculations</div>
            </div>
            <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div>
          </div>
          <div class="step-content">
            <div class="step-desc">Substituting evaluated node values into our equation terms:</div>
            <div style="margin-top: 1rem;">${groupDetailsHtml}</div>
            <div style="margin-top: 1.5rem;">${substitutionMathHtml}</div>
          </div>
        </div>
      `;

      // Success Banner Defined Result Card
      stepsHtml += `
        <div class="final-result animate-fade-in" style="text-align: center; padding: 2.5rem; background: var(--navy); color: #ffffff; border-radius: 16px; border: 1px solid var(--border); box-shadow: 0 10px 30px rgba(0,0,0,0.15); margin-top: 2rem;">
          <div style="font-size: 1.8rem; font-weight: 700; color: var(--amber); margin-bottom: 0.5rem; font-family:'Fraunces', serif;">✅ Integration Definite Solved!</div>
          <div style="font-size: 1.05rem; opacity: 0.9; margin-bottom: 1.5rem;">Definite integral value calculated over boundary interval bounds [${initA}, ${initB}] using step spacing.</div>
          <div style="display:inline-block; text-align: left; padding: 1.5rem; background: rgba(255,255,255,0.06); border-radius: 12px; border: 1px solid rgba(255,255,255,0.12); min-width: 250px;">
            <div style="font-size:0.95rem; font-weight:600; color: rgba(255,255,255,0.7); border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; margin-bottom: 0.75rem;">Definite Integral Value:</div>
            <div style="font-family:'IBM Plex Mono',monospace; font-size: 1.45rem; font-weight:700; color:var(--amber); margin: 0.6rem 0;">
              &int;<sub>${initA}</sub><sup>${initB}</sup> f(x) dx &approx; <span style="color:#ffffff;">${resultVal.toFixed(decimals)}</span>
            </div>
            <div style="font-size: 0.9rem; opacity:0.8; margin-top: 0.5rem;">Step Size h = <strong>${h.toFixed(decimals)}</strong></div>
            <div style="font-size: 0.9rem; opacity:0.8;">Sub-Intervals n = <strong>${intervalsN}</strong></div>
          </div>
        </div>
      `;

      // Educational Note Footer Card
      stepsHtml += `
        <div class="step-card" style="border-left: 4px solid var(--teal); background: rgba(13, 148, 136, 0.05); margin-top: 2rem;">
          <div style="font-weight: 700; color: var(--teal); font-size: 1.1rem; margin-bottom: 0.5rem; font-family:'Fraunces', serif;">✦ Educational Note: Method Characteristics</div>
          <div style="font-size: 1rem; line-height: 1.5; color: var(--navy);">${methodNoteText}</div>
        </div>
      `;

      output.innerHTML = stepsHtml;
      output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }