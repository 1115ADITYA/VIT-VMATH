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
              <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1.5rem;">
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

    // Matrix Dimension Logic
    let currentMatrixRows = 3;
    let currentMatrixCols = 3;

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