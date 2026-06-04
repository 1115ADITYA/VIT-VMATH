document.addEventListener('DOMContentLoaded', () => {
  // Theme Toggle Logic
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (themeToggleBtn) {
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
  if (typeof currentSem !== 'undefined') currentSem = sem;
  if (resetUI) {
    const searchInput = document.getElementById('app-search');
    if (searchInput) searchInput.value = '';
  }

  // Update Active Button
  document.querySelectorAll('.sem-btn').forEach((btn, idx) => {
    if (idx + 1 === sem) btn.classList.add('active');
    else btn.classList.remove('active');
  });

  // Populate Sidebar
  const sidebar = document.getElementById('sidebar-content');
  sidebar.innerHTML = '';

  // Populate Overview UI
  const overview = document.getElementById('overview-ui');
  let overviewHtml = `<h2 style="font-family: 'Fraunces', serif; color: var(--navy); margin-bottom: 2rem; font-size: 2rem;">Semester ${sem} Tools</h2>`;

  const semData = data[sem];
  if (semData) {
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

  if (resetUI) {
    openCalc('none', null, fromHistory);
  } else if (typeof updateURL !== 'undefined' && !fromHistory) {
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
  if (calcId === 'partial-differentiation') {
    calcId = 'partial-diff';
  }
  if (typeof currentCalc !== 'undefined') currentCalc = calcId;
  // Update sidebar active state
  document.querySelectorAll('.calc-item').forEach(el => el.classList.remove('active'));
  if (element) {
    element.classList.add('active');
  } else if (calcId !== 'none') {
    // Find element by onclick text
    document.querySelectorAll('.calc-item').forEach(el => {
      if (el.getAttribute('onclick') && el.getAttribute('onclick').includes(`'${calcId}'`)) {
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
  const matrixPowerWrapper = document.getElementById('matrix-power-input-container');
  const diagWrapper = document.getElementById('diag-input-container');
  const partialDiffWrapper = document.getElementById('partial-diff-input-container');
  const maximaMinimaWrapper = document.getElementById('maxima-minima-input-container');

  if (standardDim) standardDim.style.display = 'none';
  if (jacobiDim) jacobiDim.style.display = 'none';
  if (standardWrapper) standardWrapper.style.display = 'none';
  if (jacobiWrapper) jacobiWrapper.style.display = 'none';
  if (newtonWrapper) newtonWrapper.style.display = 'none';
  if (falsePositionWrapper) falsePositionWrapper.style.display = 'none';
  if (integrationWrapper) integrationWrapper.style.display = 'none';
  if (matrixPowerWrapper) matrixPowerWrapper.style.display = 'none';
  if (diagWrapper) diagWrapper.style.display = 'none';
  if (partialDiffWrapper) partialDiffWrapper.style.display = 'none';
  if (maximaMinimaWrapper) maximaMinimaWrapper.style.display = 'none';

  if (calcId === 'none') {
    document.getElementById('overview-ui').style.display = 'flex';
  } else {
    let calcName = 'Calculator';
    Object.values(data).forEach(semData => {
      semData.forEach(section => {
        let item = section.items.find(i => i.id === calcId);
        if (item) calcName = item.name;
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
    } else if (calcId === 'matrix-power') {
      desc = "Enter the matrix and exponent below to calculate its power.";
    } else if (calcId === 'diag') {
      desc = "Select a method and enter the matrix values below to diagonalize it.";
    } else if (calcId === 'eigen') {
      desc = "Enter the matrix below to calculate its characteristic equation, eigenvalues, and corresponding eigenvectors.";
    } else if (calcId === 'partial-diff') {
      desc = "Enter a multivariate function f(x, y) to compute first and second-order partial derivatives step-by-step.";
    } else if (calcId === 'maxima-minima') {
      desc = "Enter a multivariate function f(x, y) to find and classify all its critical (stationary) points using the Hessian determinant test.";
    }
    const descEl = document.getElementById('matrix-calc-desc');
    if (descEl) descEl.innerText = desc;

    if (calcId === 'gauss-jacobi' || calcId === 'gauss-seidel') {
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
    } else if (calcId === 'partial-diff') {
      if (partialDiffWrapper) partialDiffWrapper.style.display = 'flex';
    } else if (calcId === 'maxima-minima') {
      if (maximaMinimaWrapper) maximaMinimaWrapper.style.display = 'flex';
    } else {
      if (standardDim) standardDim.style.display = 'flex';
      if (standardWrapper) standardWrapper.style.display = 'inline-block';
      if (calcId === 'matrix-power' && matrixPowerWrapper) {
        matrixPowerWrapper.style.display = 'flex';
      }
      if (calcId === 'diag' && diagWrapper) {
        diagWrapper.style.display = 'flex';
      }
      renderMatrixInputs();
    }

    // Scroll down
    document.querySelector('.main-area').scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (typeof updateURL !== 'undefined' && !fromHistory) {
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
    let urlCalc = calc;
    if (urlCalc === 'partial-diff') urlCalc = 'partial-differentiation';
    url.searchParams.set('calc', urlCalc);
  } else {
    url.searchParams.delete('calc');
  }
  if (window.location.search !== url.search) {
    window.history.pushState({ sem, calc }, '', url);
  }
}

window.addEventListener('popstate', (e) => {
  if (e.state) {
    selectSem(e.state.sem, false, true);
    openCalc(e.state.calc || 'none', null, true);
  }
});

// Initialize from URL or default to Sem 1
const initParams = new URLSearchParams(window.location.search);
let initSem = parseInt(initParams.get('sem')) || 1;
let initCalc = initParams.get('calc') || 'none';
if (initCalc === 'partial-differentiation') {
  initCalc = 'partial-diff';
  initSem = 2;
}

// Call without pushing history initially
selectSem(initSem, false, true);
openCalc(initCalc, null, true);
window.history.replaceState({ sem: initSem, calc: initCalc }, '', window.location);



function renderMatrixInputs() {
  const container = document.getElementById('matrix-grid-container');
  if (!container) return;
  container.style.gridTemplateColumns = `repeat(${currentMatrixCols}, 1fr)`;
  let html = '';
  for (let i = 0; i < currentMatrixRows; i++) {
    for (let j = 0; j < currentMatrixCols; j++) {
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
  if (type === 'rows') {
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
  if (!containerA || !containerB || !containerX0) return;

  containerA.style.gridTemplateColumns = `repeat(${currentJacobiDim}, 1fr)`;
  containerB.style.gridTemplateColumns = `1fr`;
  containerX0.style.gridTemplateColumns = `1fr`;

  let htmlA = '';
  let htmlB = '';
  let htmlX0 = '';

  for (let i = 0; i < currentJacobiDim; i++) {
    // Matrix A row i
    for (let j = 0; j < currentJacobiDim; j++) {
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
  for (let i = 0; i < currentJacobiDim; i++) {
    let eq = '';
    for (let j = 0; j < currentJacobiDim; j++) {
      let aInput = document.getElementById(`ja_${i}_${j}`);
      let val = aInput ? (parseFloat(aInput.value) || 0) : 0;
      let varName = vars[j] || `x${j + 1}`;

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
  if (e.key === 'Enter' && e.target.classList.contains('matrix-cell')) {
    e.preventDefault();
    let cells = Array.from(document.querySelectorAll('.matrix-cell'));
    let index = cells.indexOf(e.target);
    if (index > -1 && index < cells.length - 1) {
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
  if (d === 0) return { n: 0, d: 1 };
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

function floatToFrac(x, tolerance = 1.0E-6) {
    if (Math.abs(x) < 1e-9) return makeFrac(0, 1);
    let sign = x < 0 ? -1 : 1;
    x = Math.abs(x);
    let h1 = 1, h2 = 0, k1 = 0, k2 = 1;
    let b = x;
    do {
        let a = Math.floor(b);
        let aux = h1; h1 = a * h1 + h2; h2 = aux;
        aux = k1; k1 = a * k1 + k2; k2 = aux;
        b = 1 / (b - a);
    } while (Math.abs(x - h1 / k1) > x * tolerance && k1 < 100000);
    return makeFrac(sign * h1, k1);
}

function floatToFractionString(val) {
    if (Math.abs(val) < 1e-9) return "0";
    let f = floatToFrac(val);
    if (f.d > 10000) {
        return (Math.round(val * 10000) / 10000).toString();
    }
    return formatFrac(f);
}

// Generic Matrix Math Helpers
function identityMatrix(n) {
  let m = [];
  for (let i = 0; i < n; i++) {
    let row = [];
    for (let j = 0; j < n; j++) row.push(i === j ? 1 : 0);
    m.push(row);
  }
  return m;
}
function multiplyMatrix(A, B) {
  let rA = A.length, cA = A[0].length, cB = B[0].length;
  let m = [];
  for (let i = 0; i < rA; i++) {
    let row = [];
    for (let j = 0; j < cB; j++) {
      let sum = 0;
      for (let k = 0; k < cA; k++) sum += A[i][k] * B[k][j];
      row.push(sum);
    }
    m.push(row);
  }
  return m;
}
function addMatrix(A, B) {
  return A.map((r, i) => r.map((val, j) => val + B[i][j]));
}
function subMatrix(A, B) {
  return A.map((r, i) => r.map((val, j) => val - B[i][j]));
}
function scaleMatrix(A, scalar) {
  return A.map(r => r.map(val => val * scalar));
}
function copyMatrix(A) {
  return A.map(r => [...r]);
}
function traceMatrix(A) {
  let sum = 0;
  for (let i = 0; i < A.length; i++) sum += A[i][i];
  return sum;
}
function determinant(m) {
  if (m.length === 1) return m[0][0];
  if (m.length === 2) return m[0][0] * m[1][1] - m[0][1] * m[1][0];
  if (m.length === 3) {
    return m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1])
      - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0])
      + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
  }
  // For > 3x3, use basic expansion (slow but works for small sizes)
  let det = 0;
  for (let j = 0; j < m[0].length; j++) {
    let sub = m.slice(1).map(row => row.filter((_, colIdx) => colIdx !== j));
    det += (j % 2 === 0 ? 1 : -1) * m[0][j] * determinant(sub);
  }
  return det;
}
function inverseMatrix(m) {
  let n = m.length;
  let det = determinant(m);
  if (Math.abs(det) < 1e-9) return null;
  if (n === 1) return [[1 / det]];
  if (n === 2) return [
    [m[1][1] / det, -m[0][1] / det],
    [-m[1][0] / det, m[0][0] / det]
  ];
  if (n === 3) {
    let inv = [];
    for (let i = 0; i < 3; i++) {
      let row = [];
      for (let j = 0; j < 3; j++) {
        let sub = [];
        for (let a = 0; a < 3; a++) {
          if (a === i) continue;
          let srow = [];
          for (let b = 0; b < 3; b++) {
            if (b === j) continue;
            srow.push(m[a][b]);
          }
          sub.push(srow);
        }
        let cofactor = ((i + j) % 2 === 0 ? 1 : -1) * determinant(sub);
        row.push(cofactor / det);
      }
      inv.push(row);
    }
    // transpose cofactor matrix
    return [
      [inv[0][0], inv[1][0], inv[2][0]],
      [inv[0][1], inv[1][1], inv[2][1]],
      [inv[0][2], inv[1][2], inv[2][2]]
    ];
  }
  return null; // Not implemented for > 3
}
function solveCubic(a, b, c, d) {
  // Find roots of ax^3 + bx^2 + cx + d = 0
  if (Math.abs(a) < 1e-9) { // Quadratic
    if (Math.abs(b) < 1e-9) return [-d / c];
    let disc = c * c - 4 * b * d;
    if (disc < 0) return [];
    return [(-c + Math.sqrt(disc)) / (2 * b), (-c - Math.sqrt(disc)) / (2 * b)];
  }
  // Normalize
  b /= a; c /= a; d /= a;
  let p = c - b * b / 3;
  let q = 2 * b * b * b / 27 - b * c / 3 + d;
  let disc = q * q / 4 + p * p * p / 27;

  let roots = [];
  if (disc > 1e-9) { // One real root
    let u = Math.cbrt(-q / 2 + Math.sqrt(disc));
    let v = Math.cbrt(-q / 2 - Math.sqrt(disc));
    roots.push(u + v - b / 3);
  } else if (disc < -1e-9) { // Three real roots
    let r = Math.sqrt(-p * p * p / 27);
    let phi = Math.acos(-q / (2 * r));
    let rr = 2 * Math.cbrt(r);
    roots.push(rr * Math.cos(phi / 3) - b / 3);
    roots.push(rr * Math.cos((phi + 2 * Math.PI) / 3) - b / 3);
    roots.push(rr * Math.cos((phi + 4 * Math.PI) / 3) - b / 3);
  } else { // Multiple real roots (disc == 0)
    let u = Math.cbrt(-q / 2);
    roots.push(2 * u - b / 3);
    roots.push(-u - b / 3);
    roots.push(-u - b / 3); // Multiplicity 2 for this root
  }
  return roots.sort((x, y) => x - y);
}
function characteristicPolynomial(A) {
  let n = A.length;
  if (n === 2) {
    let tr = traceMatrix(A);
    let det = determinant(A);
    return [1, -tr, det]; // x^2 - tr*x + det
  }
  if (n === 3) {
    let tr = traceMatrix(A);
    let m11 = A[1][1] * A[2][2] - A[1][2] * A[2][1];
    let m22 = A[0][0] * A[2][2] - A[0][2] * A[2][0];
    let m33 = A[0][0] * A[1][1] - A[0][1] * A[1][0];
    let c2 = m11 + m22 + m33;
    let det = determinant(A);
    return [1, -tr, c2, -det]; // x^3 - tr*x^2 + c2*x - det
  }
  return null;
}
function findEigenvectors(A, lambda) {
  let n = A.length;
  let B = subMatrix(A, scaleMatrix(identityMatrix(n), lambda));
  // For 2x2
  if (n === 2) {
    if (Math.abs(B[0][0]) > 1e-9 || Math.abs(B[0][1]) > 1e-9) return [[-B[0][1], B[0][0]]];
    if (Math.abs(B[1][0]) > 1e-9 || Math.abs(B[1][1]) > 1e-9) return [[-B[1][1], B[1][0]]];
    return [[1, 0], [0, 1]];
  }
  // For 3x3 - cross product of two non-collinear rows
  if (n === 3) {
    let r0 = B[0], r1 = B[1], r2 = B[2];
    let cross1 = [r0[1] * r1[2] - r0[2] * r1[1], r0[2] * r1[0] - r0[0] * r1[2], r0[0] * r1[1] - r0[1] * r1[0]];
    let cross2 = [r1[1] * r2[2] - r1[2] * r2[1], r1[2] * r2[0] - r1[0] * r2[2], r1[0] * r2[1] - r1[1] * r2[0]];
    let cross3 = [r0[1] * r2[2] - r0[2] * r2[1], r0[2] * r2[0] - r0[0] * r2[2], r0[0] * r2[1] - r0[1] * r2[0]];
    let mags = [
      cross1.reduce((s, x) => s + x * x, 0),
      cross2.reduce((s, x) => s + x * x, 0),
      cross3.reduce((s, x) => s + x * x, 0)
    ];
    let maxMag = Math.max(...mags);
    if (maxMag > 1e-9) {
      if (mags[0] === maxMag) return [cross1];
      if (mags[1] === maxMag) return [cross2];
      return [cross3];
    }
    // If all cross products are zero, rank is <= 1
    // We need 2 eigenvectors
    let evs = [];
    if (Math.abs(r0[0]) > 1e-9 || Math.abs(r0[1]) > 1e-9 || Math.abs(r0[2]) > 1e-9) {
      if (Math.abs(r0[0]) > 1e-9) {
        evs.push([-r0[1] / r0[0], 1, 0]);
        evs.push([-r0[2] / r0[0], 0, 1]);
      } else if (Math.abs(r0[1]) > 1e-9) {
        evs.push([1, -r0[0] / r0[1], 0]);
        evs.push([0, -r0[2] / r0[1], 1]);
      } else {
        evs.push([1, 0, -r0[0] / r0[2]]);
        evs.push([0, 1, -r0[1] / r0[2]]);
      }
      return evs;
    }
    return [[1, 0, 0], [0, 1, 0], [0, 0, 1]]; // Identity case
  }
  return null;
}

// Matrix Formatting Helper (HTML Grid with brackets)
function formatMatrix(m) {
  let rows = m.length;
  let cols = m[0].length;
  let html = `<div class="display-matrix-wrapper"><div class="display-matrix" style="grid-template-columns: repeat(${cols}, 1fr);">`;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let val = m[i][j];
      if (typeof val === 'object' && val.d !== undefined) {
        html += `<div>${formatFrac(val)}</div>`;
      } else {
        html += `<div>${floatToFractionString(val)}</div>`;
      }
    }
  }
  html += '</div></div>';
  return html;
}

// Rank Calculation Logic
function calculateMatrix() {
  if (currentCalc === 'det') {
    calculateDeterminantMatrix();
    return;
  }
  if (currentCalc === 'adjoint') {
    calculateAdjointMatrix();
    return;
  }
  if (currentCalc === 'inv') {
    calculateInverseMatrix();
    return;
  }
  if (currentCalc === 'echelon') {
    calculateEchelonMatrix();
    return;
  }
  if (currentCalc === 'eigen') {
    calculateEigenAnalysis();
    return;
  }
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
  } else if (currentCalc === 'matrix-power') {
    calculateMatrixPower();
    return;
  } else if (currentCalc === 'diag') {
    calculateDiagonalization();
    return;
  } else if (currentCalc === 'partial-diff') {
    calculatePartialDiff();
    return;
  } else if (currentCalc === 'maxima-minima') {
    calculateMaximaMinima();
    return;
  }
  const output = document.getElementById('steps-output');
  output.innerHTML = '';
  output.classList.add('active');

  // Read values
  let m = [];
  let rows = currentMatrixRows;
  let cols = currentMatrixCols;
  for (let i = 0; i < rows; i++) {
    let row = [];
    for (let j = 0; j < cols; j++) {
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
    for (let i = 0; i < rows; i++) {
      let row = [];
      for (let j = 0; j < cols; j++) {
        let val = parseFloat(document.getElementById(`m${i}${j}`).value) || 0;
        let valStr = Math.abs(val).toString();
        if (valStr.includes('.')) {
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
        addStep("Row Swap", `<b>R${p + 1} ↔ R${pivotRow + 1}</b>`, beforeM, JSON.parse(JSON.stringify(mObj)));
      }

      // Swap Cols if necessary (Only happens if entire column was zero)
      if (pivotCol !== p) {
        let beforeM = JSON.parse(JSON.stringify(mObj));
        for (let i = 0; i < rows; i++) { let temp = mObj[i][p]; mObj[i][p] = mObj[i][pivotCol]; mObj[i][pivotCol] = temp; }
        addStep("Column Swap", `<b>C${p + 1} ↔ C${pivotCol + 1}</b>`, beforeM, JSON.parse(JSON.stringify(mObj)));
      }

      let pivotVal = mObj[p][p];
      if (pivotVal.n !== 1 || pivotVal.d !== 1) {
        let beforeM = JSON.parse(JSON.stringify(mObj));
        for (let j = 0; j < cols; j++) mObj[p][j] = divFrac(mObj[p][j], pivotVal);
        addStep("Scale Row to Create Leading 1", `<b>R${p + 1} = R${p + 1} / (${formatFrac(pivotVal)})</b>`, beforeM, JSON.parse(JSON.stringify(mObj)));
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
          rowOps.push(`R${i + 1} = R${i + 1} ${opStr} * R${p + 1}`);
        }
      }
      if (eliminatedRow) {
        addStep(`Eliminate entries below Leading 1 in C${p + 1}`, "<b>" + rowOps.join('<br>') + "</b>", beforeMRow, JSON.parse(JSON.stringify(mObj)));
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
          colOps.push(`C${j + 1} = C${j + 1} ${opStr} * C${p + 1}`);
        }
      }
      if (eliminatedCol) {
        addStep(`Eliminate entries to the right in R${p + 1}`, "<b>" + colOps.join('<br>') + "</b>", beforeMCol, JSON.parse(JSON.stringify(mObj)));
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
  if (Math.abs(m[0][0]) < 1e-9 && rows > 0 && cols > 0) {
    let beforeM = JSON.parse(JSON.stringify(m));
    // Swap with row 1 or 2
    if (rows > 1 && Math.abs(m[1][0]) > 1e-9) {
      let temp = m[0]; m[0] = m[1]; m[1] = temp;
      addStep("Row Swap", "<b>R1 ↔ R2</b>", beforeM, JSON.parse(JSON.stringify(m)));
    } else if (Math.abs(m[2][0]) > 1e-9) {
      let temp = m[0]; m[0] = m[2]; m[2] = temp;
      addStep("Row Swap", "<b>R1 ↔ R3</b>", beforeM, JSON.parse(JSON.stringify(m)));
    }
  }

  // Eliminate col 0
  if (Math.abs(m[0][0]) > 1e-9) {
    let beforeM = JSON.parse(JSON.stringify(m));
    let eliminated = false;
    let p = m[0][0];
    let desc = [];
    if (Math.abs(m[1][0]) > 1e-9) {
      let factor = m[1][0] / p;
      for (let j = 0; j < 3; j++) m[1][j] -= factor * beforeM[0][j];
      let factorStr = Math.round(factor * 100) / 100;
      let op = factorStr < 0 ? `R2 = R2 + ${Math.abs(factorStr)} * R1` : `R2 = R2 - ${factorStr} * R1`;
      desc.push(op);
      eliminated = true;
    }
    if (Math.abs(m[2][0]) > 1e-9) {
      let factor = m[2][0] / p;
      for (let j = 0; j < 3; j++) m[2][j] -= factor * beforeM[0][j];
      let factorStr = Math.round(factor * 100) / 100;
      let op = factorStr < 0 ? `R3 = R3 + ${Math.abs(factorStr)} * R1` : `R3 = R3 - ${factorStr} * R1`;
      desc.push(op);
      eliminated = true;
    }
    if (eliminated) {
      // round near zero
      for (let i = 1; i < 3; i++) for (let j = 0; j < 3; j++) if (Math.abs(m[i][j]) < 1e-9) m[i][j] = 0;
      addStep("Eliminate Column 1", "<b>" + desc.join('<br>') + "</b>", beforeM, JSON.parse(JSON.stringify(m)));
    }
  }

  // Pivot at (1,1)
  if (Math.abs(m[1][1]) < 1e-9 && Math.abs(m[2][1]) > 1e-9) {
    let beforeM = JSON.parse(JSON.stringify(m));
    let temp = m[1]; m[1] = m[2]; m[2] = temp;
    addStep("Row Swap", "<b>R2 ↔ R3</b>", beforeM, JSON.parse(JSON.stringify(m)));
  }

  // Eliminate col 1
  if (Math.abs(m[1][1]) > 1e-9) {
    let beforeM = JSON.parse(JSON.stringify(m));
    if (Math.abs(m[2][1]) > 1e-9) {
      let factor = m[2][1] / m[1][1];
      for (let j = 0; j < 3; j++) m[2][j] -= factor * beforeM[1][j];
      // round near zero
      for (let j = 0; j < 3; j++) if (Math.abs(m[2][j]) < 1e-9) m[2][j] = 0;
      let factorStr = Math.round(factor * 100) / 100;
      let op = factorStr < 0 ? `R3 = R3 + ${Math.abs(factorStr)} * R2` : `R3 = R3 - ${factorStr} * R2`;
      addStep("Eliminate Column 2", `<b>${op}</b>`, beforeM, JSON.parse(JSON.stringify(m)));
    }
  }

  // Count rank
  let rank = 0;
  for (let i = 0; i < 3; i++) {
    let isNonZero = false;
    for (let j = 0; j < 3; j++) {
      m[i][j] = Math.round(m[i][j] * 100) / 100; // Format for display
      if (Math.abs(m[i][j]) > 1e-9) isNonZero = true;
    }
    if (isNonZero) rank++;
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
// MATRIX POWER ENGINE
// ==========================================

window.currentPowerMethod = 'direct';

function calculateMatrixPower() {
  const output = document.getElementById('steps-output');
  output.innerHTML = '';
  output.classList.add('active');

  let n = parseInt(document.getElementById('matrix-power-n').value) || 2;
  let m = [];
  for (let i = 0; i < currentMatrixRows; i++) {
    let row = [];
    for (let j = 0; j < currentMatrixCols; j++) {
      row.push(parseFloat(document.getElementById(`m${i}${j}`).value) || 0);
    }
    m.push(row);
  }

  if (currentMatrixRows !== currentMatrixCols) {
    output.innerHTML = '<div style="color:red; padding: 1rem; text-align:center;">Matrix must be square to calculate powers.</div>';
    return;
  }

  // Read method from the HTML selector
  let methodSelect = document.getElementById('matrix-power-method-select');
  let method = methodSelect ? methodSelect.value : 'direct';

  let stepsHtml = '';
  let stepCount = 1;
  function addStep(title, desc, matrix) {
    stepsHtml += `
          <div class="step-card">
            <div class="step-header">
              <div class="step-number">${stepCount++}</div>
              <div class="step-title">${title}</div>
            </div>
            ${desc ? `<div class="step-desc" style="text-align: center; font-size: 1.05rem; margin-bottom: 1.5rem;">${desc}</div>` : ''}
            <div style="text-align: center; margin-top: 1rem;">${formatMatrix(matrix)}</div>
          </div>
        `;
  }
  function addTextStep(title, desc) {
    stepsHtml += `
          <div class="step-card">
            <div class="step-header">
              <div class="step-number">${stepCount++}</div>
              <div class="step-title">${title}</div>
            </div>
            <div class="step-desc" style="text-align: left; font-size: 1.05rem;">${desc}</div>
          </div>
        `;
  }

  if (method === 'direct') {
    addStep("Initial Matrix A", `Power to calculate: ${n}`, m);
    let curr = copyMatrix(m);
    for (let i = 2; i <= n; i++) {
      curr = multiplyMatrix(curr, m);
      addStep(`Compute A^${i}`, `Multiply A^${i - 1} * A`, curr);
    }
    stepsHtml += `<div class="final-result">A^${n} Computed via Direct Multiplication</div>`;
  } else if (method === 'fast') {
    addStep("Initial Matrix A", `Power to calculate: ${n}`, m);
    let bin = n.toString(2);
    addTextStep("Binary Representation", `n = ${n} = ${bin}₂`);

    let res = identityMatrix(m.length);
    let base = copyMatrix(m);
    let pow = 1;
    let pown = n;

    while (pown > 0) {
      if (pown % 2 === 1) {
        res = multiplyMatrix(res, base);
        addStep(`Multiply Result by Base`, `Current Result`, res);
      }
      pown = Math.floor(pown / 2);
      if (pown > 0) {
        base = multiplyMatrix(base, base);
        pow *= 2;
        addStep(`Square the Base`, `Current Base (A^${pow})`, base);
      }
    }
    stepsHtml += `<div class="final-result">Fast Exponentiation Complete</div>`;
  } else if (method === 'diagonalization') {
    if (m.length > 3) {
      addTextStep("Error", "<div style='color:red'>Diagonalization method is only supported for 2x2 and 3x3 matrices in this calculator.</div>");
    } else {
      addStep("Initial Matrix A", `Power to calculate: ${n}`, m);
      let poly = characteristicPolynomial(m);
      let evals = m.length === 2 ? solveCubic(0, poly[0], poly[1], poly[2]) : solveCubic(poly[0], poly[1], poly[2], poly[3]);
      if (!evals || evals.length === 0) {
        addTextStep("Error", "<div style='color:red'>Could not find real eigenvalues or matrix is not diagonalizable over Reals.</div>");
      } else {
        // Basic Eigenvalue Output
        let evText = evals.map((e, i) => `λ${i + 1} = ${floatToFractionString(e)}`).join(', ');
        addTextStep("1. Find Eigenvalues", `Characteristic roots: ${evText}`);

        let P = [];
        for (let i = 0; i < m.length; i++) P.push([]);
        let isDiagonalizable = true;

        let eigenBasis = {};
        for (let i = 0; i < evals.length; i++) {
          let e = evals[i];
          let key = Math.round(e * 1000) / 1000;
          if (!eigenBasis[key]) {
            eigenBasis[key] = findEigenvectors(m, e);
          }
          let basis = eigenBasis[key];
          if (!basis || basis.length === 0) { isDiagonalizable = false; break; }
          let v = basis.shift();
          if (!v) { isDiagonalizable = false; break; }

          for (let r = 0; r < m.length; r++) P[r][i] = v[r];
        }

        if (!isDiagonalizable) {
          addTextStep("Error", "<div style='color:red'>Matrix is defective (not diagonalizable). Cannot form full basis of eigenvectors. Try another method.</div>");
        } else {
          addStep("2. Form Eigenvector Matrix (P)", "Columns are eigenvectors", P);

          let D = identityMatrix(m.length);
          for (let i = 0; i < m.length; i++) D[i][i] = evals[i];
          addStep("3. Form Diagonal Matrix (D)", "Diagonal entries are eigenvalues", D);

          let Pinv = inverseMatrix(P);
          if (!Pinv) {
            addTextStep("Error", "<div style='color:red'>Matrix P is singular. Matrix may be defective.</div>");
          } else {
            addStep("4. Find P⁻¹", "Inverse of P", Pinv);

            let Dn = identityMatrix(m.length);
            for (let i = 0; i < m.length; i++) Dn[i][i] = Math.pow(D[i][i], n);
            addStep(`5. Calculate D^${n}`, "Simply raise diagonal entries to power n", Dn);

            let PDn = multiplyMatrix(P, Dn);
            let finalA = multiplyMatrix(PDn, Pinv);
            addStep(`6. Compute P * D^${n} * P⁻¹`, `Final Answer A^${n}`, finalA);
            stepsHtml += `<div class="final-result">Diagonalization Complete</div>`;
          }
        }
      }
    }
  } else if (method === 'cayley') {
    if (m.length > 3) {
      addTextStep("Error", "<div style='color:red'>Cayley-Hamilton method is only supported for 2x2 and 3x3 matrices in this calculator.</div>");
    } else {
      addStep("Initial Matrix A", `Power to calculate: ${n}`, m);
      let poly = characteristicPolynomial(m);
      if (m.length === 2) {
        addTextStep("1. Characteristic Equation", `P(λ) = λ² ${poly[1] < 0 ? '-' : '+'} ${Math.abs(poly[1])}λ ${poly[2] < 0 ? '-' : '+'} ${Math.abs(poly[2])} = 0<br>By Cayley-Hamilton Theorem: A² = ${-poly[1]}A ${poly[2] < 0 ? '+' : '-'} ${Math.abs(poly[2])}I`);

        let c1 = 1, c0 = 0;
        if (n === 0) { c1 = 0; c0 = 1; }
        else if (n === 1) { c1 = 1; c0 = 0; }
        else {
          let p1 = -poly[1], p0 = -poly[2];
          c1 = p1; c0 = p0;
          for (let k = 3; k <= n; k++) {
            let next_c1 = c1 * p1 + c0;
            let next_c0 = c1 * p0;
            c1 = next_c1; c0 = next_c0;
          }
        }

        addTextStep("2. Reduce Power", `A^${n} is reduced to:<br>A^${n} = ${c1}A + ${c0}I`);
        let partA = scaleMatrix(m, c1);
        let partI = scaleMatrix(identityMatrix(2), c0);
        let finalA = addMatrix(partA, partI);
        addStep(`3. Final Evaluation`, `${c1}A + ${c0}I`, finalA);
      } else if (m.length === 3) {
        addTextStep("1. Characteristic Equation", `P(λ) = λ³ ${poly[1] < 0 ? '-' : '+'} ${Math.abs(poly[1])}λ² ${poly[2] < 0 ? '-' : '+'} ${Math.abs(poly[2])}λ ${poly[3] < 0 ? '-' : '+'} ${Math.abs(poly[3])} = 0<br>By Cayley-Hamilton Theorem: A³ = ${-poly[1]}A² + ${-poly[2]}A + ${-poly[3]}I`);

        let c2 = 0, c1 = 1, c0 = 0;
        if (n === 0) { c2 = 0; c1 = 0; c0 = 1; }
        else if (n === 1) { c2 = 0; c1 = 1; c0 = 0; }
        else if (n === 2) { c2 = 1; c1 = 0; c0 = 0; }
        else {
          let p2 = -poly[1], p1 = -poly[2], p0 = -poly[3];
          c2 = p2; c1 = p1; c0 = p0;
          for (let k = 4; k <= n; k++) {
            let next_c2 = c2 * p2 + c1;
            let next_c1 = c2 * p1 + c0;
            let next_c0 = c2 * p0;
            c2 = next_c2; c1 = next_c1; c0 = next_c0;
          }
        }

        addTextStep("2. Reduce Power", `A^${n} is reduced to:<br>A^${n} = ${c2}A² + ${c1}A + ${c0}I`);
        let m2 = multiplyMatrix(m, m);
        let partA2 = scaleMatrix(m2, c2);
        let partA = scaleMatrix(m, c1);
        let partI = scaleMatrix(identityMatrix(3), c0);
        let finalA = addMatrix(addMatrix(partA2, partA), partI);
        addStep(`3. Final Evaluation`, `${c2}A² + ${c1}A + ${c0}I`, finalA);
      }
    }
  }

  output.innerHTML = stepsHtml;
  // Scroll to steps (avoid scrolling aggressively if they just changed the dropdown)
  if (!window.event || window.event.type !== 'change') {
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ==========================================
// DIAGONALIZATION ENGINE
// ==========================================

function calculateDiagonalization() {
  const output = document.getElementById('steps-output');
  output.innerHTML = '';
  output.classList.add('active');

  let m = [];
  for (let i = 0; i < currentMatrixRows; i++) {
    let row = [];
    for (let j = 0; j < currentMatrixCols; j++) {
      row.push(parseFloat(document.getElementById(`m${i}${j}`).value) || 0);
    }
    m.push(row);
  }

  if (currentMatrixRows !== currentMatrixCols) {
    output.innerHTML = '<div style="color:red; padding: 1rem; text-align:center;">Matrix must be square to be diagonalizable.</div>';
    return;
  }

  let methodSelect = document.getElementById('diag-method-select');
  let method = methodSelect ? methodSelect.value : 'standard';

  let stepsHtml = '';
  let stepCount = 1;
  function addStep(title, desc, matrix) {
    stepsHtml += `
          <div class="step-card">
            <div class="step-header">
              <div class="step-number">${stepCount++}</div>
              <div class="step-title">${title}</div>
            </div>
            ${desc ? `<div class="step-desc" style="text-align: center; font-size: 1.05rem; margin-bottom: 1.5rem;">${desc}</div>` : ''}
            <div style="text-align: center; margin-top: 1rem;">${formatMatrix(matrix)}</div>
          </div>
        `;
  }
  function addTextStep(title, desc) {
    stepsHtml += `
          <div class="step-card">
            <div class="step-header">
              <div class="step-number">${stepCount++}</div>
              <div class="step-title">${title}</div>
            </div>
            <div class="step-desc" style="text-align: left; font-size: 1.05rem;">${desc}</div>
          </div>
        `;
  }

  if (m.length > 3) {
    addTextStep("Error", "<div style='color:red'>Diagonalization is only supported for 2x2 and 3x3 matrices in this calculator.</div>");
    output.innerHTML = stepsHtml;
    return;
  }

  if (method === 'orthogonal') {
    // Check if symmetric
    let isSym = true;
    for (let i = 0; i < m.length; i++) {
      for (let j = 0; j < m.length; j++) {
        if (Math.abs(m[i][j] - m[j][i]) > 1e-9) isSym = false;
      }
    }
    if (!isSym) {
      addTextStep("Error", "<div style='color:red'>Matrix is not symmetric. Orthogonal diagonalization requires a symmetric matrix.</div>");
      output.innerHTML = stepsHtml;
      return;
    }
  }

  addStep("Initial Matrix A", ``, m);
  let poly = characteristicPolynomial(m);
  let evals = m.length === 2 ? solveCubic(0, poly[0], poly[1], poly[2]) : solveCubic(poly[0], poly[1], poly[2], poly[3]);

  if (!evals || evals.length === 0) {
    addTextStep("Error", "<div style='color:red'>Could not find real eigenvalues or matrix is not diagonalizable over Reals.</div>");
  } else {
    let evText = evals.map((e, i) => `λ${i + 1} = ${floatToFractionString(e)}`).join(', ');
    addTextStep("1. Find Eigenvalues", `Characteristic roots: ${evText}`);

    let P = [];
    for (let i = 0; i < m.length; i++) P.push([]);
    let isDiagonalizable = true;

    let eigenBasis = {};
    for (let i = 0; i < evals.length; i++) {
      let e = evals[i];
      let key = Math.round(e * 1000) / 1000;
      if (!eigenBasis[key]) {
        let basis = findEigenvectors(m, e);

        // Apply Gram-Schmidt for Orthogonal Diagonalization if basis has multiple vectors
        if (method === 'orthogonal' && basis.length > 1) {
          let orthoBasis = [];
          for (let b of basis) {
            let u = [...b];
            for (let ob of orthoBasis) {
              let dot = u.reduce((s, x, idx) => s + x * ob[idx], 0);
              let obMag2 = ob.reduce((s, x) => s + x * x, 0);
              u = u.map((x, idx) => x - (dot / obMag2) * ob[idx]);
            }
            orthoBasis.push(u);
          }
          basis = orthoBasis;
        }
        eigenBasis[key] = basis;
      }

      let basis = eigenBasis[key];
      if (!basis || basis.length === 0) { isDiagonalizable = false; break; }
      let v = basis.shift();
      if (!v) { isDiagonalizable = false; break; }

      if (method === 'orthogonal') {
        let mag = Math.sqrt(v.reduce((s, x) => s + x * x, 0));
        if (mag > 0) v = v.map(x => x / mag);
      }

      for (let r = 0; r < m.length; r++) P[r][i] = v[r];
    }

    if (!isDiagonalizable) {
      addTextStep("Error", "<div style='color:red'>Matrix is defective (not diagonalizable). Cannot form a full basis of eigenvectors.</div>");
    } else {
      addStep("2. Form Eigenvector Matrix (P)", method === 'orthogonal' ? "Columns are normalized orthogonal eigenvectors" : "Columns are eigenvectors", P);

      let D = identityMatrix(m.length);
      for (let i = 0; i < m.length; i++) D[i][i] = evals[i];
      addStep("3. Form Diagonal Matrix (D)", "Diagonal entries are eigenvalues", D);

      let Pinv = method === 'orthogonal' ?
        P[0].map((_, colIndex) => P.map(row => row[colIndex])) :
        inverseMatrix(P);

      if (!Pinv && method !== 'orthogonal') {
        addTextStep("Error", "<div style='color:red'>Matrix P is singular. Matrix may be defective.</div>");
      } else {
        addStep("4. Find P⁻¹", method === 'orthogonal' ? "Since P is orthogonal, P⁻¹ = Pᵀ" : "Inverse of P", Pinv);

        stepsHtml += `<div class="final-result">${method === 'orthogonal' ? 'Orthogonal ' : ''}Diagonalization Complete<br><span>A = P D P⁻¹</span></div>`;
      }
    }
  }

  output.innerHTML = stepsHtml;
  output.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ==========================================
// EIGEN ANALYSIS ENGINE
// ==========================================

function calculateEigenAnalysis() {
  const output = document.getElementById('steps-output');
  output.innerHTML = '';
  output.classList.add('active');

  let m = [];
  for (let i = 0; i < currentMatrixRows; i++) {
    let row = [];
    for (let j = 0; j < currentMatrixCols; j++) {
      row.push(parseFloat(document.getElementById(`m${i}${j}`).value) || 0);
    }
    m.push(row);
  }

  if (currentMatrixRows !== currentMatrixCols) {
    output.innerHTML = '<div style="color:red; padding: 1rem; text-align:center;">Matrix must be square to calculate eigenvalues.</div>';
    return;
  }

  let stepsHtml = '';
  let stepCount = 1;
  function addStep(title, desc, matrix) {
    stepsHtml += `
          <div class="step-card">
            <div class="step-header">
              <div class="step-number">${stepCount++}</div>
              <div class="step-title">${title}</div>
            </div>
            ${desc ? `<div class="step-desc" style="text-align: center; font-size: 1.05rem; margin-bottom: 1.5rem;">${desc}</div>` : ''}
            <div style="text-align: center; margin-top: 1rem;">${formatMatrix(matrix)}</div>
          </div>
        `;
  }
  function addTextStep(title, desc) {
    stepsHtml += `
          <div class="step-card">
            <div class="step-header">
              <div class="step-number">${stepCount++}</div>
              <div class="step-title">${title}</div>
            </div>
            <div class="step-desc" style="text-align: left; font-size: 1.05rem;">${desc}</div>
          </div>
        `;
  }

  if (m.length > 3) {
    addTextStep("Error", "<div style='color:red'>Eigenvalue calculator currently supports up to 3x3 matrices.</div>");
    output.innerHTML = stepsHtml;
    return;
  }

  addStep("Initial Matrix A", "", m);

  let poly = characteristicPolynomial(m);
  let charEq = "";
  function fmtCoeff(c, isFirst, isLast) {
    if (Math.abs(c) < 1e-9) return "";
    let sign = c < 0 ? " - " : " + ";
    if (isFirst) sign = c < 0 ? "-" : "";
    let valStr = floatToFractionString(Math.abs(c));
    if (valStr === "1" && !isLast) valStr = "";
    return sign + valStr;
  }
  if (m.length === 2) {
    charEq = `P(λ) = λ²${fmtCoeff(poly[1], false, false)}λ${fmtCoeff(poly[2], false, true)} = 0`;
  } else {
    charEq = `P(λ) = λ³${fmtCoeff(poly[1], false, false)}λ²${fmtCoeff(poly[2], false, false)}λ${fmtCoeff(poly[3], false, true)} = 0`;
  }
  addTextStep("1. Characteristic Polynomial", `We find the characteristic polynomial by expanding the determinant <b>|A - λI| = 0</b>:<br><br><div style="font-family:'IBM Plex Mono', monospace; font-size:1.2rem; color:var(--navy); text-align:center;">${charEq}</div>`);

  let evals = m.length === 2 ? solveCubic(0, poly[0], poly[1], poly[2]) : solveCubic(poly[0], poly[1], poly[2], poly[3]);

  if (!evals || evals.length === 0) {
    addTextStep("Error", "<div style='color:red'>Could not find real eigenvalues. The matrix might only have complex eigenvalues, which are not currently supported by this calculator.</div>");
    output.innerHTML = stepsHtml;
    return;
  }

  let evText = evals.map((e, i) => `λ<sub>${i + 1}</sub> = ${floatToFractionString(e)}`).join(', &nbsp;&nbsp;');
  addTextStep("2. Solve for Eigenvalues", `By solving the characteristic equation P(λ) = 0, we get the eigenvalues:<br><br><div style="font-family:'IBM Plex Mono', monospace; font-size:1.25rem; font-weight:700; color:var(--amber); text-align:center;">${evText}</div>`);

  // Calculate and display eigenvectors
  let eigenBasis = {};
  for (let i = 0; i < evals.length; i++) {
    let e = evals[i];
    let key = Math.round(e * 10000) / 10000;
    if (!eigenBasis[key]) {
      eigenBasis[key] = findEigenvectors(m, e);
    }
  }

  let uniqueEvals = Object.keys(eigenBasis).map(parseFloat);
  
  uniqueEvals.forEach((lam, idx) => {
    let basis = eigenBasis[lam.toString()];
    if (!basis || basis.length === 0) {
      addTextStep(`3.${idx+1} Eigenvectors for λ = ${lam}`, "<div style='color:red'>Could not compute eigenvector basis.</div>");
    } else {
      let vectorHtml = "";
      basis.forEach((v, vidx) => {
        let colMatrix = v.map(val => [val]);
        vectorHtml += `<div style="display:inline-block; margin: 0 1rem; vertical-align:middle;">${formatMatrix(colMatrix)}</div>`;
      });
      addTextStep(`3.${idx+1} Find Eigenvectors for λ = ${lam}`, `We solve the system <b>(A - λI)v = 0</b> for λ = ${lam}. The basis vector(s) are:<br><div style="margin-top:1rem; text-align:center; display:flex; justify-content:center; align-items:center;">${vectorHtml}</div>`);
    }
  });

  stepsHtml += `
    <div class="final-result animate-fade-in" style="padding: 2.5rem; background: #111827; color: #ffffff; border-radius: 16px; border: 1px solid var(--border); box-shadow: 0 10px 30px rgba(0,0,0,0.15); margin-top: 2rem; box-sizing: border-box; width: 100%;">
      <div style="font-size: 1.8rem; font-weight: 700; color: var(--amber); margin-bottom: 0.5rem; font-family:'Fraunces', serif; text-align: center;">✅ Eigen Analysis Complete!</div>
      <div style="font-size: 1.05rem; opacity: 0.9; margin-bottom: 2rem; text-align: center;">Characteristic equation, eigenvalues, and eigenvectors successfully computed.</div>
    </div>
  `;

  output.innerHTML = stepsHtml;
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
  let perm = Array.from({ length: n }, (_, i) => i);

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

  stepsHtml += `<div class="step-card"><div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)"><div style="display: flex; align-items: center; gap: 0.75rem;"><div class="step-number">${stepCount++}</div><div class="step-title">Diagonal Dominance Check</div></div><div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div></div><div class="step-content"><div class="step-desc">We mathematically verify the diagonal dominance:</div><div style="overflow-x: auto; margin-top: 1.5rem;"><table style="width: 100%; border-collapse: collapse; margin-bottom: 1rem; border: 1px solid var(--border);"><thead><tr style="background: var(--bg); border-bottom: 2px solid var(--border);"><th style="padding: 0.75rem; color: var(--navy);">Row</th><th style="padding: 0.75rem; color: var(--navy);">Inequality Check</th><th style="padding: 0.75rem; color: var(--navy);">Simplified Values</th><th style="padding: 0.75rem; color: var(--navy);">Status</th></tr></thead><tbody>${diagDominanceDetails.map(r => `<tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.75rem; text-align: center; font-weight: 600;">Row ${r.row}</td><td style="padding: 0.75rem; text-align: center; font-family: 'IBM Plex Mono', monospace;">|${finalA[r.row - 1][r.row - 1]}| &gt; ${r.expr}</td><td style="padding: 0.75rem; text-align: center; font-family: 'IBM Plex Mono', monospace;">${r.diag} &gt; ${r.sum}</td><td style="padding: 0.75rem; text-align: center; font-weight: 700; color: ${r.met ? 'var(--teal)' : '#dc2626'};">${r.met ? 'True' : 'False'}</td></tr>`).join('')}</tbody></table></div><div style="font-weight: 700; color: var(--navy); margin-top: 1.5rem; margin-bottom: 0.5rem; font-size: 1rem;">Sassenfeld Criterion Check:</div><div style="overflow-x: auto;"><table style="width: 100%; border-collapse: collapse; margin-bottom: 1rem; border: 1px solid var(--border);"><thead><tr style="background: var(--bg); border-bottom: 2px solid var(--border);"><th style="padding: 0.75rem; color: var(--navy);">Factor</th><th style="padding: 0.75rem; color: var(--navy);">Recursive Sassenfeld Summation</th><th style="padding: 0.75rem; color: var(--navy);">Value (&beta;<sub>i</sub>)</th></tr></thead><tbody>${sassenfeldDetails.map(s => `<tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.75rem; text-align: center; font-weight: 600;">&beta;<sub>${s.row}</sub></td><td style="padding: 0.75rem; text-align: center; font-family: 'IBM Plex Mono', monospace; font-size: 0.9rem;">${s.expr}</td><td style="padding: 0.75rem; text-align: center; font-family: 'IBM Plex Mono', monospace; font-weight: 700; color: ${s.val < 1 ? 'var(--teal)' : '#d97706'};">${s.val.toFixed(decimals)}</td></tr>`).join('')}</tbody></table></div>${warningBanner}</div></div>`;

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
      : `Substituting variables from iteration ${k - 1} into our iterative equations:`;

    stepsHtml += `<div class="step-card"><div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)"><div style="display: flex; align-items: center; gap: 0.75rem;"><div class="step-number">${stepCount++}</div><div class="step-title">Iteration ${k}</div></div><div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted); transform: rotate(-90deg);">▼</div></div><div class="step-content" style="display: none;"><div class="step-desc">${substitutionsDesc}</div><div style="display: flex; flex-direction: column; gap: 0.25rem; margin-top: 1rem;">${iterSubstitutionsHtml}</div><div style="margin-top: 1.25rem; padding: 1rem; background: var(--bg); border-radius: 8px; font-size: 0.95rem; color: var(--navy); border: 1px solid var(--border);"><div style="font-weight: 700; margin-bottom: 0.5rem; text-transform: uppercase; font-size: 0.85rem; letter-spacing:0.05em; color:var(--muted);">Error Calculation:</div><div style="font-family:'IBM Plex Mono',monospace; font-size: 1rem; margin-bottom: 0.5rem;">Error = max(${diffsList.join(', ')}) = <strong>${err.toFixed(decimals)}</strong></div><div style="font-weight: 700; border-top: 1px dashed var(--border); padding-top: 0.5rem; margin-top: 0.5rem; font-size: 0.95rem;">Comparison: ${err.toFixed(decimals)} ${err < tolerance ? ` &lt; ${tolerance} (&epsilon;) <span style="color: var(--teal)">&nbsp;&bull;&nbsp; Converged!</span>` : ` &ge; ${tolerance} (&epsilon;)`}</div></div></div></div>`;
    X = [...X_new];
    finalIter = k;
    if (err < tolerance) { converged = true; break; }
  }

  stepsHtml += `<div class="step-card"><div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)"><div style="display: flex; align-items: center; gap: 0.75rem;"><div class="step-number">${stepCount++}</div><div class="step-title">Iteration Summary Table</div></div><div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted); transform: rotate(-90deg);">▼</div></div><div class="step-content" style="display: none;"><div class="step-desc">A unified view of variable approximations:</div><div style="overflow-x: auto; margin-top: 1.5rem;"><table style="width: 100%; border-collapse: collapse; border: 1px solid var(--border);"><thead><tr style="background: var(--bg); border-bottom: 2px solid var(--border);"><th style="padding: 0.75rem; color: var(--navy); width: 100px;">Iteration</th>${varsList.map(v => `<th style="padding: 0.75rem; color: var(--navy);">${v}</th>`).join('')}<th style="padding: 0.75rem; color: var(--navy);">Max Abs Error</th></tr></thead><tbody>${tableRows.map(row => `<tr style="border-bottom: 1px solid var(--border); ${row.iter === finalIter && converged ? 'background: rgba(13, 148, 136, 0.05); font-weight:600;' : ''}"><td style="padding: 0.75rem; text-align: center; font-weight: 600;">${row.iter}</td>${row.xVals.map(xv => `<td style="padding: 0.75rem; text-align: center; font-family: 'IBM Plex Mono', monospace;">${xv.toFixed(decimals)}</td>`).join('')}<td style="padding: 0.75rem; text-align: center; font-family: 'IBM Plex Mono', monospace; font-weight: 700; color: var(--navy);">${row.iter === 0 ? '-' : row.error.toFixed(decimals)}</td></tr>`).join('')}</tbody></table></div></div></div>`;

  let finalSolutionHtml = X.map((xv, idx) => `<div style="font-family:'IBM Plex Mono',monospace; font-size: 1.3rem; font-weight:700; color:var(--amber); margin: 0.6rem 0;">${getVarName(idx, n)} = <span style="color:#ffffff;">${xv.toFixed(decimals)}</span></div>`).join('');
  stepsHtml += converged ? `<div class="final-result animate-fade-in" style="text-align: center; padding: 2.5rem; background: #111827; color: #ffffff; border-radius: 16px; border: 1px solid var(--border); box-shadow: 0 10px 30px rgba(0,0,0,0.15); margin-top: 2rem;"><div style="font-size: 1.8rem; font-weight: 700; color: var(--amber); margin-bottom: 0.5rem; font-family:'Fraunces', serif;">✅ Solution Converged Successfully!</div><div style="font-size: 1.05rem; opacity: 0.9; margin-bottom: 1.5rem;">The system converged within tolerance limit (&epsilon; = ${tolerance}) after <strong>${finalIter}</strong> iterations.</div><div style="display:inline-block; text-align: left; padding: 1.5rem; background: rgba(255,255,255,0.06); border-radius: 12px; border: 1px solid rgba(255,255,255,0.12); min-width: 250px;"><div style="font-size:0.95rem; font-weight:600; color: rgba(255,255,255,0.7); border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; margin-bottom: 0.75rem;">Final Solved Values:</div>${finalSolutionHtml}</div></div>` : `<div class="final-result animate-fade-in" style="text-align: center; padding: 2.5rem; background: #991b1b; color: #ffffff; border-radius: 16px; border: 1px solid var(--border); box-shadow: 0 10px 30px rgba(0,0,0,0.15); margin-top: 2rem;"><div style="font-size: 1.8rem; font-weight: 700; color: var(--amber); margin-bottom: 0.5rem; font-family:'Fraunces', serif;">⚠️ Limits Reached Without Convergence</div><div style="font-size: 1.05rem; opacity: 0.9; margin-bottom: 1.5rem;">The system did not converge to tolerance (&epsilon; = ${tolerance}) within <strong>${maxIter}</strong> iterations limit.</div><div style="display:inline-block; text-align: left; padding: 1.5rem; background: rgba(255,255,255,0.06); border-radius: 12px; border: 1px solid rgba(255,255,255,0.12); min-width: 250px;"><div style="font-size:0.95rem; font-weight:600; color: rgba(255,255,255,0.7); border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; margin-bottom: 0.75rem;">Last Computed State (Iteration ${finalIter}):</div>${finalSolutionHtml}</div></div>`;

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

function convertPowersToMathPow(expr) {
  let idx;
  let safetyCounter = 0;
  while ((idx = expr.indexOf('^')) !== -1 && safetyCounter < 100) {
    safetyCounter++;
    // 1. Find the base (before idx)
    let baseStart = idx - 1;
    if (baseStart < 0) {
      expr = expr.replace('^', '**');
      continue;
    }
    if (expr[baseStart] === ')') {
      let depth = 1;
      baseStart--;
      while (baseStart >= 0 && depth > 0) {
        if (expr[baseStart] === ')') depth++;
        else if (expr[baseStart] === '(') depth--;
        baseStart--;
      }
      baseStart++; // index of '('
    } else {
      while (baseStart >= 0 && /[a-zA-Z0-9\._]/.test(expr[baseStart])) {
        baseStart--;
      }
      baseStart++;
    }
    let base = expr.substring(baseStart, idx);
    if (!base) {
      expr = expr.substring(0, idx) + '**' + expr.substring(idx + 1);
      continue;
    }

    // 2. Find the exponent (after idx)
    let expEnd = idx + 1;
    if (expEnd >= expr.length) {
      expr = expr.substring(0, idx) + '**';
      continue;
    }
    if (expr[expEnd] === '(') {
      let depth = 1;
      expEnd++;
      while (expEnd < expr.length && depth > 0) {
        if (expr[expEnd] === '(') depth++;
        else if (expr[expEnd] === ')') depth--;
        expEnd++;
      }
    } else {
      if (expr[expEnd] === '-') {
        expEnd++;
      }
      while (expEnd < expr.length && /[a-zA-Z0-9\._]/.test(expr[expEnd])) {
        expEnd++;
      }
    }
    let exponent = expr.substring(idx + 1, expEnd);
    if (!exponent) {
      expr = expr.substring(0, idx) + '**' + expr.substring(idx + 1);
      continue;
    }

    let target = base + '^' + exponent;
    let replacement = `Math.pow(${base},${exponent})`;
    expr = expr.substring(0, baseStart) + replacement + expr.substring(expEnd);
  }
  return expr;
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

  jsExpr = convertPowersToMathPow(jsExpr);

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

// ==========================================
// MULTIVARIATE SYMBOLIC CALCULUS ENGINE
// ==========================================

function normalizeExpression(expr) {
  let normalized = expr.replace(/\s+/g, ''); // remove spaces
  normalized = normalized.toLowerCase();
  
  // Replace digit followed by variable or parenthesis or function
  normalized = normalized.replace(/(\d)(?=[a-z\(])/g, '$1*');
  
  // Replace variable (x or y) followed by variable or parenthesis or function
  normalized = normalized.replace(/([xy])(?=[a-z\(])/g, '$1*');
  
  // Replace closing parenthesis followed by digit, variable, or opening parenthesis
  normalized = normalized.replace(/(\))(?=[a-z0-9\(])/g, '$1*');
  
  return normalized;
}

function hasVariable(expr, varName) {
  const regex = new RegExp('\\b' + varName + '\\b', 'i');
  return regex.test(expr);
}

function removeOuterParens(str) {
  str = str.trim();
  while (str.startsWith('(') && str.endsWith(')')) {
    let depth = 0;
    let match = true;
    for (let i = 0; i < str.length - 1; i++) {
      if (str[i] === '(') depth++;
      if (str[i] === ')') depth--;
      if (depth === 0) {
        match = false;
        break;
      }
    }
    if (match && depth === 1 && str[str.length - 1] === ')') {
      str = str.substring(1, str.length - 1).trim();
    } else {
      break;
    }
  }
  return str;
}

function splitByOperator(str, op) {
  let parts = [];
  let current = '';
  let parenDepth = 0;
  for (let i = 0; i < str.length; i++) {
    let char = str[i];
    if (char === '(') parenDepth++;
    if (char === ')') parenDepth--;
    
    if (char === op && parenDepth === 0) {
      parts.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  if (current) {
    parts.push(current.trim());
  }
  return parts;
}

function evaluateMultivariateMath(expr, xVal, yVal) {
  let jsExpr = expr.toLowerCase().replace(/\s+/g, '');
  jsExpr = normalizeExpression(jsExpr);
  
  jsExpr = jsExpr.replace(/\bsin\b/g, 'Math.sin')
                 .replace(/\bcos\b/g, 'Math.cos')
                 .replace(/\btan\b/g, 'Math.tan')
                 .replace(/\bexp\b/g, 'Math.exp')
                 .replace(/\bln\b/g, 'Math.log')
                 .replace(/\bpi\b/g, 'Math.PI');
                 
  jsExpr = jsExpr.replace(/\be\^(x|y|\((.*?)\))/g, (match, p1, p2) => {
    let inner = p2 || p1;
    return `Math.exp(${inner})`;
  });
  
  jsExpr = convertPowersToMathPow(jsExpr);
  
  try {
    const fn = new Function('x', 'y', `with(Math) { return ${jsExpr}; }`);
    let result = fn(xVal, yVal);
    if (isNaN(result) || !isFinite(result)) return NaN;
    return result;
  } catch (err) {
    return NaN;
  }
}

function validateMultivariateFunction(expr) {
  expr = expr.trim();
  if (expr === '') {
    return { isValid: false, error: "Function expression cannot be empty." };
  }
  
  let clean = expr.replace(/\s+/g, '');
  if (/[\+\-\*\/]{2,}/.test(clean)) {
    if (/\*{2,}/.test(clean)) {
      return { isValid: false, error: "Invalid operator syntax: consecutive multiplication symbols (e.g., '***')." };
    }
    return { isValid: false, error: "Invalid operator syntax: consecutive operators." };
  }
  
  let depth = 0;
  for (let i = 0; i < expr.length; i++) {
    if (expr[i] === '(') depth++;
    if (expr[i] === ')') depth--;
    if (depth < 0) {
      return { isValid: false, error: "Unmatched parentheses: closing parenthesis ')' found before opening parenthesis '('." };
    }
  }
  if (depth !== 0) {
    return { isValid: false, error: "Unmatched parentheses: missing closing parenthesis ')'." };
  }
  
  if (/[\+\-\*\/^]$/.test(clean)) {
    return { isValid: false, error: "Expression cannot end with an operator." };
  }
  if (/^[\*\/^]/.test(clean)) {
    return { isValid: false, error: "Expression cannot start with this operator." };
  }
  
  let stripped = clean.toLowerCase()
    .replace(/sin|cos|tan|exp|ln/g, '')
    .replace(/[a-z]/g, (match) => {
      if (match === 'x' || match === 'y' || match === 'e') return '';
      return match;
    });
  stripped = stripped.replace(/[0-9\.\+\-\*\/\^\(\)]/g, '');
  if (stripped.length > 0) {
    return { isValid: false, error: `Invalid symbol(s) or variable(s) found in expression: '${stripped}'. Only variables 'x' and 'y' are allowed.` };
  }
  
  let testVal = evaluateMultivariateMath(expr, 1.0, 1.0);
  if (isNaN(testVal)) {
    return { isValid: false, error: "Invalid function syntax. Please check for unmatched parentheses, missing brackets, or dangling operators." };
  }
  
  return { isValid: true };
}

function formatSuperscript(expr) {
  if (!expr) return '';
  return expr.replace(/\^2\b/g, '²')
             .replace(/\^3\b/g, '³')
             .replace(/\^4\b/g, '⁴')
             .replace(/\^5\b/g, '⁵')
             .replace(/\^6\b/g, '⁶')
             .replace(/\^7\b/g, '⁷')
             .replace(/\^8\b/g, '⁸')
             .replace(/\^9\b/g, '⁹')
             .replace(/\^n\b/g, 'ⁿ')
             .replace(/\^(\d+)/g, (match, p) => {
                const map = { '0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹' };
                return p.split('').map(c => map[c] || c).join('');
             });
}

function formatMathRich(expr) {
  if (!expr) return '';
  let formatted = expr.replace(/\s+/g, '');
  formatted = formatted.replace(/(\d)\*(\d)/g, '$1 × $2');
  formatted = formatted.replace(/\*/g, '');
  formatted = formatSuperscript(formatted);
  // Add spaces around + and -
  formatted = formatted.replace(/\+/g, ' + ').replace(/\-/g, ' - ').replace(/\s+/g, ' ').trim();
  if (formatted.startsWith('- ')) {
    formatted = '-' + formatted.slice(2);
  }
  return formatted;
}

function simplifyTermMultivariate(term) {
  let isNegative = false;
  term = term.trim();
  if (term.startsWith('-')) {
    isNegative = true;
    term = term.substring(1).trim();
  }
  
  term = removeOuterParens(term);
  
  if (term === '0') return '0';
  if (term === '1') return isNegative ? '-1' : '1';
  
  let factors = splitByOperator(term, '*');
  if (factors.length <= 1) {
    return isNegative ? '-' + term : term;
  }
  
  let coef = 1;
  let xPower = 0;
  let yPower = 0;
  let otherFactors = [];
  
  for (let factor of factors) {
    factor = removeOuterParens(factor);
    if (factor === '0') return '0';
    if (factor === '1') continue;
    
    let factorIsNegative = false;
    if (factor.startsWith('-')) {
      factorIsNegative = true;
      factor = factor.substring(1).trim();
    }
    if (factor.startsWith('+')) {
      factor = factor.substring(1).trim();
    }
    
    if (/^[+-]?\d+(?:\.\d+)?$/.test(factor)) {
      let val = parseFloat(factor);
      if (factorIsNegative) val = -val;
      coef *= val;
      continue;
    }
    
    if (factorIsNegative) {
      isNegative = !isNegative;
    }
    
    let xMatch = factor.match(/^x\^([+-]?\d+(?:\.\d+)?)$/) || (factor === 'x' ? ['x', '1'] : null);
    if (xMatch) {
      xPower += parseFloat(xMatch[1]);
      continue;
    }
    
    let yMatch = factor.match(/^y\^([+-]?\d+(?:\.\d+)?)$/) || (factor === 'y' ? ['y', '1'] : null);
    if (yMatch) {
      yPower += parseFloat(yMatch[1]);
      continue;
    }
    
    otherFactors.push(factor);
  }
  
  const decimalsEl = document.getElementById('partial-diff-decimals');
  let decimals = decimalsEl ? parseInt(decimalsEl.value) : 4;
  if (isNaN(decimals) || decimals < 0) decimals = 4;
  coef = parseFloat(coef.toFixed(decimals));

  if (isNegative) coef = -coef;
  
  let parts = [];
  if (coef !== 1 || (xPower === 0 && yPower === 0 && otherFactors.length === 0)) {
    if (coef === -1 && (xPower > 0 || yPower > 0 || otherFactors.length > 0)) {
      parts.push('-');
    } else {
      parts.push(coef.toString());
    }
  }
  
  if (xPower > 0) {
    if (xPower === 1) parts.push('x');
    else parts.push(`x^${xPower}`);
  }
  
  if (yPower > 0) {
    if (yPower === 1) parts.push('y');
    else parts.push(`y^${yPower}`);
  }
  
  for (let other of otherFactors) {
    parts.push(other);
  }
  
  if (parts[0] === '-') {
    if (parts.length > 1) {
      parts[1] = '-' + parts[1];
      parts.shift();
    } else {
      return '-1';
    }
  }
  
  return parts.join('*');
}

function simplifySymbolicMultivariate(expr) {
  expr = expr.replace(/\s+/g, '');
  if (!expr) return '0';
  
  expr = removeOuterParens(expr);
  
  // 1. Check for addition/subtraction at parent depth 0
  let terms = [];
  let current = '';
  let parenDepth = 0;
  for (let i = 0; i < expr.length; i++) {
    let char = expr[i];
    if (char === '(') parenDepth++;
    if (char === ')') parenDepth--;
    if ((char === '+' || char === '-') && parenDepth === 0) {
      if (current) terms.push(current);
      current = char;
    } else {
      current += char;
    }
  }
  if (current) terms.push(current);
  
  if (terms.length > 1) {
    let simplifiedTerms = terms.map(t => {
      let sign = '';
      if (t.startsWith('+')) {
        t = t.substring(1);
      } else if (t.startsWith('-')) {
        sign = '-';
        t = t.substring(1);
      }
      let simplified = simplifySymbolicMultivariate(t);
      if (simplified === '0' || simplified === '') return '';
      if (simplified.startsWith('-')) {
        return sign === '-' ? simplified.substring(1) : simplified;
      }
      return sign + simplified;
    });
    
    simplifiedTerms = simplifiedTerms.filter(t => t !== '');
    if (simplifiedTerms.length === 0) return '0';
    
    let merged = simplifiedTerms[0];
    for (let i = 1; i < simplifiedTerms.length; i++) {
      let t = simplifiedTerms[i];
      if (t.startsWith('-')) {
        merged += ' - ' + t.substring(1);
      } else {
        merged += ' + ' + t;
      }
    }
    return merged;
  }
  
  // 2. Check for division at parent depth 0
  let divParts = splitByOperator(expr, '/');
  if (divParts.length > 1) {
    let num = simplifySymbolicMultivariate(divParts[0]);
    let den = simplifySymbolicMultivariate(divParts.slice(1).join('/'));
    if (num === '0') return '0';
    if (den === '1') return num;
    return `(${num})/(${den})`;
  }
  
  // 3. Check for multiplication at parent depth 0
  let mulParts = splitByOperator(expr, '*');
  if (mulParts.length > 1) {
    let simplifiedFactors = mulParts.map(f => simplifySymbolicMultivariate(f));
    if (simplifiedFactors.includes('0')) return '0';
    simplifiedFactors = simplifiedFactors.filter(f => f !== '1');
    if (simplifiedFactors.length === 0) return '1';
    
    let termResult = simplifyTermMultivariate(simplifiedFactors.join('*'));
    return termResult;
  }
  
  // 4. Basic factors
  expr = removeOuterParens(expr);
  
  let isNegative = false;
  if (expr.startsWith('-')) {
    isNegative = true;
    expr = expr.substring(1).trim();
  }
  
  let result = expr;
  
  if (/^\d+(?:\.\d+)?$/.test(expr)) {
    const decimalsEl = document.getElementById('partial-diff-decimals');
    let decimals = decimalsEl ? parseInt(decimalsEl.value) : 4;
    if (isNaN(decimals) || decimals < 0) decimals = 4;
    let numVal = parseFloat(expr);
    numVal = parseFloat(numVal.toFixed(decimals));
    result = numVal.toString();
  }
  
  return isNegative ? '-' + result : result;
}

function differentiateTermMultivariate(term, wrt) {
  term = term.trim();
  if (term === '') return '0';
  
  if (term.startsWith('+')) {
    term = term.substring(1).trim();
  }
  
  let isNegative = false;
  if (term.startsWith('-')) {
    isNegative = true;
    term = term.substring(1).trim();
  }
  
  term = removeOuterParens(term);
  
  let result = '0';
  
  if (!hasVariable(term, wrt)) {
    return '0';
  }
  
  let divParts = splitByOperator(term, '/');
  if (divParts.length > 1) {
    let num = divParts[0];
    let den = divParts.slice(1).join('/');
    let dNum = differentiateSymbolicMultivariate(num, wrt);
    let dDen = differentiateSymbolicMultivariate(den, wrt);
    result = `((${den})*(${dNum}) - (${num})*(${dDen})) / (${den})^2`;
    if (isNegative) return `-(${result})`;
    return result;
  }
  
  let mulParts = splitByOperator(term, '*');
  if (mulParts.length > 1) {
    let left = mulParts[0];
    let right = mulParts.slice(1).join('*');
    let dLeft = differentiateSymbolicMultivariate(left, wrt);
    let dRight = differentiateSymbolicMultivariate(right, wrt);
    result = `(${left})*(${dRight}) + (${right})*(${dLeft})`;
    if (isNegative) return `-(${result})`;
    return result;
  }
  
  if (term === wrt) {
    result = '1';
  } else {
    let powerMatch = term.match(/^([xy])\^([+-]?\d+(?:\.\d+)?)$/);
    if (powerMatch && powerMatch[1] === wrt) {
      let p = parseFloat(powerMatch[2]);
      if (p === 1) result = '1';
      else if (p === 2) result = `2*${wrt}`;
      else result = `${p}*${wrt}^${p-1}`;
    } else {
      let sinMatch = term.match(/^sin\((.*)\)$/);
      if (sinMatch) {
        let arg = sinMatch[1];
        let dArg = differentiateSymbolicMultivariate(arg, wrt);
        result = `cos(${arg})*(${dArg})`;
      } else {
        let cosMatch = term.match(/^cos\((.*)\)$/);
        if (cosMatch) {
          let arg = cosMatch[1];
          let dArg = differentiateSymbolicMultivariate(arg, wrt);
          result = `-sin(${arg})*(${dArg})`;
        } else {
          let expMatch = term.match(/^e\^(.*)$/) || term.match(/^exp\((.*)\)$/);
          if (expMatch) {
            let arg = expMatch[1];
            let dArg = differentiateSymbolicMultivariate(arg, wrt);
            result = `e^(${arg})*(${dArg})`;
          } else {
            let lnMatch = term.match(/^ln\((.*)\)$/);
            if (lnMatch) {
              let arg = lnMatch[1];
              let dArg = differentiateSymbolicMultivariate(arg, wrt);
              result = `(${dArg})/(${arg})`;
            } else {
              let tanMatch = term.match(/^tan\((.*)\)$/);
              if (tanMatch) {
                let arg = tanMatch[1];
                let dArg = differentiateSymbolicMultivariate(arg, wrt);
                result = `(1/cos(${arg})^2)*(${dArg})`;
              } else {
                result = `d/d${wrt}(${term})`;
              }
            }
          }
        }
      }
    }
  }
  
  if (isNegative) return `-${result}`;
  return result;
}

function differentiateSymbolicMultivariate(expr, wrt) {
  expr = expr.replace(/\s+/g, '');
  if (!expr) return '0';
  
  let terms = [];
  let current = '';
  let parenDepth = 0;
  
  for (let i = 0; i < expr.length; i++) {
    let char = expr[i];
    if (char === '(') parenDepth++;
    if (char === ')') parenDepth--;
    
    if ((char === '+' || char === '-') && parenDepth === 0) {
      if (current) terms.push(current);
      current = char;
    } else {
      current += char;
    }
  }
  if (current) terms.push(current);
  
  let derivedTerms = terms.map(term => {
    let d = differentiateTermMultivariate(term, wrt);
    return simplifySymbolicMultivariate(d);
  });
  
  let merged = '';
  for (let term of derivedTerms) {
    if (term === '0' || term === '') continue;
    
    if (merged.length > 0) {
      if (term.startsWith('-')) {
        merged += ' - ' + term.substring(1);
      } else {
        merged += ' + ' + term;
      }
    } else {
      merged += term;
    }
  }
  
  if (!merged) return '0';
  return simplifySymbolicMultivariate(merged);
}

function differentiateTermWithExplanation(term, wrt) {
  let isNegative = false;
  let termClean = term.trim();
  if (termClean.startsWith('+')) {
    termClean = termClean.substring(1).trim();
  }
  if (termClean.startsWith('-')) {
    isNegative = true;
    termClean = termClean.substring(1).trim();
  }
  
  let cleanTerm = formatMathRich(term);
  let wrtUpper = wrt.toUpperCase();
  let otherVar = wrt === 'x' ? 'y' : 'x';
  
  let resultVal = differentiateTermMultivariate(termClean, wrt);
  let resultValClean = simplifySymbolicMultivariate(resultVal);
  let finalResult = isNegative ? simplifySymbolicMultivariate(`-(${resultValClean})`) : resultValClean;
  
  if (!hasVariable(termClean, wrt)) {
    return {
      term: cleanTerm,
      explanation: `The term <code>${cleanTerm}</code> does not contain the variable <strong>${wrt}</strong>, so it is treated as a constant.
                    <br><span style="font-family: 'IBM Plex Mono', monospace; font-size: 0.95rem; margin-top: 0.25rem; display: block; color: var(--amber);">∂/∂${wrt}(${cleanTerm}) = 0</span>`,
      derivative: '0'
    };
  }
  
  if (termClean === wrt) {
    let deriv = isNegative ? '-1' : '1';
    return {
      term: cleanTerm,
      explanation: `The term is the variable <strong>${wrt}</strong> itself. Its derivative with respect to itself is 1.
                    <br><span style="font-family: 'IBM Plex Mono', monospace; font-size: 0.95rem; margin-top: 0.25rem; display: block; color: var(--teal);">∂/∂${wrt}(${cleanTerm}) = ${deriv}</span>`,
      derivative: deriv
    };
  }
  
  let mulParts = splitByOperator(termClean, '*');
  if (mulParts.length > 1) {
    let constantFactors = [];
    let variableFactors = [];
    for (let factor of mulParts) {
      if (!hasVariable(factor, wrt)) {
        constantFactors.push(factor);
      } else {
        variableFactors.push(factor);
      }
    }
    
    if (constantFactors.length > 0 && variableFactors.length > 0) {
      let constantPart = constantFactors.join('*');
      let variablePart = variableFactors.join('*');
      
      let dVarPart = differentiateSymbolicMultivariate(variablePart, wrt);
      let dVarPartClean = simplifySymbolicMultivariate(dVarPart);
      
      let constantPartClean = formatMathRich(constantPart);
      let variablePartClean = formatMathRich(variablePart);
      let dVarPartCleanFormat = formatMathRich(dVarPartClean);
      let finalResultFormat = formatMathRich(finalResult);
      
      let stepExplanation = `We factor out the constant multiplier <code>${constantPartClean}</code> (treating <strong>${otherVar}</strong> as constant) and differentiate <code>${variablePartClean}</code> with respect to <strong>${wrt}</strong>:
                             <br><span style="font-family: 'IBM Plex Mono', monospace; font-size: 0.95rem; margin-top: 0.25rem; display: block;">∂/∂${wrt}(${formatMathRich(termClean)}) = ${constantPartClean} · [ ∂/∂${wrt}(${variablePartClean}) ]</span>
                             <span style="font-family: 'IBM Plex Mono', monospace; font-size: 0.95rem; display: block;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= ${constantPartClean} · (${dVarPartCleanFormat})</span>
                             <span style="font-family: 'IBM Plex Mono', monospace; font-size: 0.95rem; display: block; color: var(--teal);">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= ${finalResultFormat}</span>`;
      
      return {
        term: cleanTerm,
        explanation: stepExplanation,
        derivative: finalResult
      };
    }
  }
  
  let powerMatch = termClean.match(/^([xy])\^([+-]?\d+(?:\.\d+)?)$/);
  if (powerMatch && powerMatch[1] === wrt) {
    let p = parseFloat(powerMatch[2]);
    let finalResultFormat = formatMathRich(finalResult);
    let stepExplanation = `Using the power rule <span style="font-family: 'IBM Plex Mono', monospace;">d/d${wrt}(${wrt}<sup>n</sup>) = n${wrt}<sup>n-1</sup></span>:
                           <br><span style="font-family: 'IBM Plex Mono', monospace; font-size: 0.95rem; margin-top: 0.25rem; display: block; color: var(--teal);">∂/∂${wrt}(${cleanTerm}) = ${finalResultFormat}</span>`;
    return {
      term: cleanTerm,
      explanation: stepExplanation,
      derivative: finalResult
    };
  }
  
  let fnMatch = termClean.match(/^(sin|cos|exp|ln|tan)\((.*)\)$/) || termClean.match(/^e\^(.*)$/);
  if (fnMatch) {
    let fnName = fnMatch[1] || 'exp';
    let arg = fnMatch[2] || fnMatch[1];
    if (termClean.startsWith('e^')) {
      fnName = 'e^';
      arg = termClean.substring(2);
    }
    
    let dArg = differentiateSymbolicMultivariate(arg, wrt);
    let dArgClean = simplifySymbolicMultivariate(dArg);
    
    let argClean = formatMathRich(arg);
    let dArgCleanFormat = formatMathRich(dArgClean);
    let finalResultFormat = formatMathRich(finalResult);
    
    let stepExplanation = `Using the chain rule, we differentiate the outer function <code>${fnName}</code> and multiply by the derivative of the inner argument <code>${argClean}</code>:
                           <br><span style="font-family: 'IBM Plex Mono', monospace; font-size: 0.95rem; margin-top: 0.25rem; display: block;">∂/∂${wrt}(${formatMathRich(termClean)}) = derivative_of_outer · ∂/∂${wrt}(${argClean})</span>`;
    
    if (fnName === 'sin') {
      stepExplanation += `<span style="font-family: 'IBM Plex Mono', monospace; font-size: 0.95rem; display: block;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= cos(${argClean}) · (${dArgCleanFormat})</span>`;
    } else if (fnName === 'cos') {
      stepExplanation += `<span style="font-family: 'IBM Plex Mono', monospace; font-size: 0.95rem; display: block;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= -sin(${argClean}) · (${dArgCleanFormat})</span>`;
    } else if (fnName === 'e^' || fnName === 'exp') {
      stepExplanation += `<span style="font-family: 'IBM Plex Mono', monospace; font-size: 0.95rem; display: block;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= e<sup>${argClean}</sup> · (${dArgCleanFormat})</span>`;
    } else if (fnName === 'ln') {
      stepExplanation += `<span style="font-family: 'IBM Plex Mono', monospace; font-size: 0.95rem; display: block;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= (1 / ${argClean}) · (${dArgCleanFormat})</span>`;
    } else if (fnName === 'tan') {
      stepExplanation += `<span style="font-family: 'IBM Plex Mono', monospace; font-size: 0.95rem; display: block;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= (1 / cos(${argClean})²) · (${dArgCleanFormat})</span>`;
    }
    
    stepExplanation += `<span style="font-family: 'IBM Plex Mono', monospace; font-size: 0.95rem; display: block; color: var(--teal);">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= ${finalResultFormat}</span>`;
    
    return {
      term: cleanTerm,
      explanation: stepExplanation,
      derivative: finalResult
    };
  }
  
  let finalResultFormat = formatMathRich(finalResult);
  return {
    term: cleanTerm,
    explanation: `Differentiating the term <code>${cleanTerm}</code> with respect to <strong>${wrt}</strong> yields:
                  <br><span style="font-family: 'IBM Plex Mono', monospace; font-size: 0.95rem; margin-top: 0.25rem; display: block; color: var(--teal);">∂/∂${wrt}(${cleanTerm}) = ${finalResultFormat}</span>`,
    derivative: finalResult
  };
}

function findCriticalPoints(dfdx, dfdy) {
  let c1 = evaluateMultivariateMath(dfdx, 0, 0);
  let a1 = evaluateMultivariateMath(dfdx, 1, 0) - c1;
  let b1 = evaluateMultivariateMath(dfdx, 0, 1) - c1;
  
  let dfdx_lin = (
    Math.abs(evaluateMultivariateMath(dfdx, 2, 0) - (2 * a1 + c1)) < 1e-6 &&
    Math.abs(evaluateMultivariateMath(dfdx, 0, 2) - (2 * b1 + c1)) < 1e-6 &&
    Math.abs(evaluateMultivariateMath(dfdx, 1, 1) - (a1 + b1 + c1)) < 1e-6
  );
  
  let c2 = evaluateMultivariateMath(dfdy, 0, 0);
  let a2 = evaluateMultivariateMath(dfdy, 1, 0) - c2;
  let b2 = evaluateMultivariateMath(dfdy, 0, 1) - c2;
  
  let dfdy_lin = (
    Math.abs(evaluateMultivariateMath(dfdy, 2, 0) - (2 * a2 + c2)) < 1e-6 &&
    Math.abs(evaluateMultivariateMath(dfdy, 0, 2) - (2 * b2 + c2)) < 1e-6 &&
    Math.abs(evaluateMultivariateMath(dfdy, 1, 1) - (a2 + b2 + c2)) < 1e-6
  );
  
  if (dfdx_lin && dfdy_lin) {
    let det = a1 * b2 - b1 * a2;
    if (Math.abs(det) > 1e-9) {
      let x = (-c1 * b2 - b1 * (-c2)) / det;
      let y = (a1 * (-c2) - (-c1) * a2) / det;
      
      let xStr = x.toFixed(4);
      let yStr = y.toFixed(4);
      
      let eq1Str = `${a1 !== 0 ? a1 + 'x' : ''}${b1 > 0 ? ' + ' + b1 + 'y' : b1 < 0 ? ' - ' + Math.abs(b1) + 'y' : ''} = ${-c1}`;
      let eq2Str = `${a2 !== 0 ? a2 + 'x' : ''}${b2 > 0 ? ' + ' + b2 + 'y' : b2 < 0 ? ' - ' + Math.abs(b2) + 'y' : ''} = ${-c2}`;
      
      return {
        type: 'linear',
        points: [{ x, y }],
        details: `We solve the system of linear equations:
                  <br><span style="font-family: 'IBM Plex Mono', monospace; font-size: 0.95rem; margin-top: 0.5rem; display: block;">∂f/∂x = 0 &rArr; ${eq1Str}</span>
                  <span style="font-family: 'IBM Plex Mono', monospace; font-size: 0.95rem; display: block;">∂f/∂y = 0 &rArr; ${eq2Str}</span>
                  <br>Solving this simultaneous linear system (using substitution or Cramer's Rule):
                  <br><span style="font-family: 'IBM Plex Mono', monospace; font-size: 0.95rem; display: block; color: var(--teal);">x = ${xStr}, y = ${yStr}</span>
                  <br>Thus, we obtain the critical point: <strong>(${xStr}, ${yStr})</strong>.`
      };
    }
  }
  
  // Case C: dfdx = a1*x^2 + b1*y, dfdy = b2*y^2 + a2*x
  let c1_q = evaluateMultivariateMath(dfdx, 0, 0);
  let a1_q = evaluateMultivariateMath(dfdx, 1, 0);
  let b1_q = evaluateMultivariateMath(dfdx, 0, 1);
  let dfdx_caseC = (
    Math.abs(c1_q) < 1e-6 &&
    Math.abs(evaluateMultivariateMath(dfdx, 2, 0) - 4 * a1_q) < 1e-6 &&
    Math.abs(evaluateMultivariateMath(dfdx, 0, 2) - 2 * b1_q) < 1e-6 &&
    Math.abs(evaluateMultivariateMath(dfdx, 1, 1) - (a1_q + b1_q)) < 1e-6
  );
  
  let c2_q = evaluateMultivariateMath(dfdy, 0, 0);
  let a2_q = evaluateMultivariateMath(dfdy, 1, 0);
  let b2_q = evaluateMultivariateMath(dfdy, 0, 1);
  let dfdy_caseC = (
    Math.abs(c2_q) < 1e-6 &&
    Math.abs(evaluateMultivariateMath(dfdy, 2, 0) - 2 * a2_q) < 1e-6 &&
    Math.abs(evaluateMultivariateMath(dfdy, 0, 2) - 4 * b2_q) < 1e-6 &&
    Math.abs(evaluateMultivariateMath(dfdy, 1, 1) - (a2_q + b2_q)) < 1e-6
  );
  
  if (dfdx_caseC && dfdy_caseC && Math.abs(b1_q) > 1e-9 && Math.abs(b2_q) > 1e-9 && Math.abs(a1_q) > 1e-9) {
    let ratio = -a2_q * b1_q * b1_q / (b2_q * a1_q * a1_q);
    let x2 = Math.cbrt(ratio);
    let y2 = (-a1_q / b1_q) * x2 * x2;
    
    let x2Str = x2.toFixed(4);
    let y2Str = y2.toFixed(4);
    
    return {
      type: 'nonlinear_poly',
      points: [{ x: 0, y: 0 }, { x: x2, y: y2 }],
      details: `We solve the system of non-linear equations:
                <br><span style="font-family: 'IBM Plex Mono', monospace; font-size: 0.95rem; margin-top: 0.5rem; display: block;">∂f/∂x = 0 &rArr; ${a1_q}x² + ${b1_q}y = 0 &rArr; y = -(${a1_q}/${b1_q})x²</span>
                <span style="font-family: 'IBM Plex Mono', monospace; font-size: 0.95rem; display: block;">∂f/∂y = 0 &rArr; ${b2_q}y² + ${a2_q}x = 0</span>
                <br>Substituting <code>y = -(${a1_q}/${b1_q})x²</code> into the second equation:
                <br><span style="font-family: 'IBM Plex Mono', monospace; font-size: 0.95rem; display: block;">${b2_q}·( -(${a1_q}/${b1_q})x² )² + ${a2_q}x = 0</span>
                <span style="font-family: 'IBM Plex Mono', monospace; font-size: 0.95rem; display: block;">${b2_q}·(${a1_q * a1_q}/${b1_q * b1_q})x⁴ + ${a2_q}x = 0</span>
                <br>Factoring out <code>x</code> gives two solutions:
                <br><span style="font-family: 'IBM Plex Mono', monospace; font-size: 0.95rem; display: block;">1) x = 0 &rArr; y = 0</span>
                <span style="font-family: 'IBM Plex Mono', monospace; font-size: 0.95rem; display: block;">2) x³ = ${ratio.toFixed(4)} &rArr; x = ${x2Str} &rArr; y = ${y2Str}</span>
                <br>Thus, we obtain two critical points: <strong>(0, 0)</strong> and <strong>(${x2Str}, ${y2Str})</strong>.`
    };
  }
  
  // Numerical Newton-Raphson 2D Fallback
  let pts = [];
  let guesses = [[-2,-2], [-2,2], [2,-2], [2,2], [0,0], [1,1], [-1,-1], [0.5,0.5], [-0.5,-0.5], [3,3], [-3,-3]];
  for (let g of guesses) {
    let x = g[0], y = g[1];
    let converged = false;
    for (let iter = 0; iter < 60; iter++) {
      let fx = evaluateMultivariateMath(dfdx, x, y);
      let fy = evaluateMultivariateMath(dfdy, x, y);
      if (Math.abs(fx) < 1e-10 && Math.abs(fy) < 1e-10) {
        converged = true;
        break;
      }
      
      let h = 1e-6;
      let fxx = (evaluateMultivariateMath(dfdx, x + h, y) - fx) / h;
      let fxy = (evaluateMultivariateMath(dfdx, x, y + h) - fx) / h;
      let fyx = (evaluateMultivariateMath(dfdy, x + h, y) - fy) / h;
      let fyy = (evaluateMultivariateMath(dfdy, x, y + h) - fy) / h;
      
      let det = fxx * fyy - fxy * fyx;
      if (Math.abs(det) < 1e-10) break;
      
      let dx = (-fx * fyy - fxy * (-fy)) / det;
      let dy = (fxx * (-fy) - (-fx) * fyx) / det;
      
      x += dx;
      y += dy;
      
      if (Math.abs(dx) < 1e-11 && Math.abs(dy) < 1e-11) {
        converged = true;
        break;
      }
    }
    
    if (converged && isFinite(x) && isFinite(y)) {
      let isUnique = true;
      for (let p of pts) {
        if (Math.abs(p.x - x) < 1e-3 && Math.abs(p.y - y) < 1e-3) {
          isUnique = false;
          break;
        }
      }
      if (isUnique) {
        pts.push({ x: parseFloat(x.toFixed(4)), y: parseFloat(y.toFixed(4)) });
      }
    }
  }
  
  if (pts.length > 0) {
    let ptsStr = pts.map(p => `<strong>(${p.x.toFixed(4)}, ${p.y.toFixed(4)})</strong>`).join(', ');
    return {
      type: 'numerical',
      points: pts,
      details: `We solve the system of equations numerically using 2D Newton-Raphson iteration:
                <br><span style="font-family: 'IBM Plex Mono', monospace; font-size: 0.95rem; margin-top: 0.5rem; display: block;">∂f/∂x = 0 &rArr; ${formatMathRich(dfdx)} = 0</span>
                <span style="font-family: 'IBM Plex Mono', monospace; font-size: 0.95rem; display: block;">∂f/∂y = 0 &rArr; ${formatMathRich(dfdy)} = 0</span>
                <br>Solving numerically yields stationary points at: ${ptsStr}.`
    };
  }
  
  return { type: 'none', points: [], details: 'Unable to solve for critical points.' };
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

function calculatePartialDiff() {
  const output = document.getElementById('steps-output');
  output.innerHTML = '';
  output.classList.add('active');

  let expr = document.getElementById('partial-diff-function').value.trim();
  let decimalsValStr = document.getElementById('partial-diff-decimals').value.trim();
  
  if (expr === '' || decimalsValStr === '') {
    output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Missing Fields</div></div><div class="step-desc">Please ensure all calculator parameters are filled with valid entries.</div></div>`;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  
  // Validation
  let validationResult = validateMultivariateFunction(expr);
  if (!validationResult.isValid) {
    output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Invalid Function Input</div></div><div class="step-desc">${validationResult.error}</div></div>`;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  
  let decimals = parseInt(decimalsValStr);
  if (isNaN(decimals) || !/^\d+$/.test(decimalsValStr) || decimals < 0 || decimals > 15) {
    output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Invalid Decimal Places</div></div><div class="step-desc">Decimal places must be an integer between 0 and 15.</div></div>`;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  let stepsHtml = '';
  let stepCount = 1;
  
  // Step 1: Given Function
  let richExpr = formatMathRich(expr);
  stepsHtml += `<div class="step-card">
                  <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                      <div class="step-number">${stepCount++}</div>
                      <div class="step-title">Given Function</div>
                    </div>
                    <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div>
                  </div>
                  <div class="step-content">
                    <div class="step-desc">We are given the following function of two variables:</div>
                    <div style="font-family: 'Fraunces', serif; font-size: 1.6rem; color: var(--navy); text-align: center; margin: 1.5rem 0; font-weight: 700;">
                      f(x, y) = ${richExpr}
                    </div>
                  </div>
                </div>`;

  // Step 2: Partial Derivative with respect to x
  let xTerms = splitIntoTerms(expr);
  let xDetails = xTerms.map(t => differentiateTermWithExplanation(t, 'x'));
  let dfdxVal = differentiateSymbolicMultivariate(expr, 'x');
  let dfdxValClean = simplifySymbolicMultivariate(dfdxVal);
  let dfdxValCleanFormat = formatMathRich(dfdxValClean);
  
  let xStepsList = xDetails.map((d, index) => {
    return `<div style="margin-bottom: 1.25rem; padding: 1rem; border-left: 3px solid var(--amber); background: var(--bg2); border-radius: 8px;">
              <strong style="color: var(--navy); display: block; margin-bottom: 0.4rem;">Term ${index + 1}: <code>${d.term}</code></strong>
              <div style="font-size: 0.95rem; color: var(--text); line-height: 1.6;">${d.explanation}</div>
            </div>`;
  }).join('');
  
  stepsHtml += `<div class="step-card">
                  <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                      <div class="step-number">${stepCount++}</div>
                      <div class="step-title">Partial Derivative with respect to x (∂f/∂x)</div>
                    </div>
                    <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div>
                  </div>
                  <div class="step-content">
                    <div class="step-desc" style="margin-bottom: 1rem;">
                      To find <strong>∂f/∂x</strong>, we differentiate the function with respect to <strong>x</strong>, treating <strong>y</strong> as a constant:
                    </div>
                    <div style="margin-bottom: 1.5rem;">
                      ${xStepsList}
                    </div>
                    <div class="step-desc" style="margin-top: 1rem;">
                      Summing up the derivatives of the individual terms and simplifying, we get:
                    </div>
                    <div style="font-family: 'Fraunces', serif; font-size: 1.5rem; color: var(--teal); text-align: center; margin: 1.5rem 0; font-weight: 700;">
                      ∂f/∂x = ${dfdxValCleanFormat}
                    </div>
                  </div>
                </div>`;

  // Step 3: Partial Derivative with respect to y
  let yTerms = splitIntoTerms(expr);
  let yDetails = yTerms.map(t => differentiateTermWithExplanation(t, 'y'));
  let dfdyVal = differentiateSymbolicMultivariate(expr, 'y');
  let dfdyValClean = simplifySymbolicMultivariate(dfdyVal);
  let dfdyValCleanFormat = formatMathRich(dfdyValClean);
  
  let yStepsList = yDetails.map((d, index) => {
    return `<div style="margin-bottom: 1.25rem; padding: 1rem; border-left: 3px solid var(--amber); background: var(--bg2); border-radius: 8px;">
              <strong style="color: var(--navy); display: block; margin-bottom: 0.4rem;">Term ${index + 1}: <code>${d.term}</code></strong>
              <div style="font-size: 0.95rem; color: var(--text); line-height: 1.6;">${d.explanation}</div>
            </div>`;
  }).join('');
  
  stepsHtml += `<div class="step-card">
                  <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                      <div class="step-number">${stepCount++}</div>
                      <div class="step-title">Partial Derivative with respect to y (∂f/∂y)</div>
                    </div>
                    <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div>
                  </div>
                  <div class="step-content">
                    <div class="step-desc" style="margin-bottom: 1rem;">
                      To find <strong>∂f/∂y</strong>, we differentiate the function with respect to <strong>y</strong>, treating <strong>x</strong> as a constant:
                    </div>
                    <div style="margin-bottom: 1.5rem;">
                      ${yStepsList}
                    </div>
                    <div class="step-desc" style="margin-top: 1rem;">
                      Summing up the derivatives of the individual terms and simplifying, we get:
                    </div>
                    <div style="font-family: 'Fraunces', serif; font-size: 1.5rem; color: var(--teal); text-align: center; margin: 1.5rem 0; font-weight: 700;">
                      ∂f/∂y = ${dfdyValCleanFormat}
                    </div>
                  </div>
                </div>`;

  // Step 4: Second Order Partial Derivatives
  let d2fdx2Val = differentiateSymbolicMultivariate(dfdxValClean, 'x');
  let d2fdx2ValClean = simplifySymbolicMultivariate(d2fdx2Val);
  let d2fdx2ValCleanFormat = formatMathRich(d2fdx2ValClean);
  
  let d2fdy2Val = differentiateSymbolicMultivariate(dfdyValClean, 'y');
  let d2fdy2ValClean = simplifySymbolicMultivariate(d2fdy2Val);
  let d2fdy2ValCleanFormat = formatMathRich(d2fdy2ValClean);
  
  let d2fdxdyVal = differentiateSymbolicMultivariate(dfdyValClean, 'x');
  let d2fdxdyValClean = simplifySymbolicMultivariate(d2fdxdyVal);
  let d2fdxdyValCleanFormat = formatMathRich(d2fdxdyValClean);

  // Card 4a: ∂²f/∂x²
  stepsHtml += `<div class="step-card">
                  <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                      <div class="step-number">${stepCount++}</div>
                      <div class="step-title">Second Order: ∂²f/∂x²</div>
                    </div>
                    <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div>
                  </div>
                  <div class="step-content">
                    <div class="step-desc" style="margin-bottom: 0.5rem;">
                      The second-order partial derivative <strong>∂²f/∂x²</strong> is computed by differentiating the first-order derivative <code>∂f/∂x = ${dfdxValCleanFormat}</code> with respect to <strong>x</strong> again:
                    </div>
                    <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.15rem; color: var(--navy); margin: 1rem 0;">
                      ∂²f/∂x² = ∂/∂x ( ${dfdxValCleanFormat} )
                    </div>
                    <div style="font-family: 'Fraunces', serif; font-size: 1.5rem; color: var(--teal); text-align: center; margin: 1.5rem 0; font-weight: 700;">
                      ∂²f/∂x² = ${d2fdx2ValCleanFormat}
                    </div>
                  </div>
                </div>`;

  // Card 4b: ∂²f/∂y²
  stepsHtml += `<div class="step-card">
                  <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                      <div class="step-number">${stepCount++}</div>
                      <div class="step-title">Second Order: ∂²f/∂y²</div>
                    </div>
                    <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div>
                  </div>
                  <div class="step-content">
                    <div class="step-desc" style="margin-bottom: 0.5rem;">
                      The second-order partial derivative <strong>∂²f/∂y²</strong> is computed by differentiating the first-order derivative <code>∂f/∂y = ${dfdyValCleanFormat}</code> with respect to <strong>y</strong> again:
                    </div>
                    <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.15rem; color: var(--navy); margin: 1rem 0;">
                      ∂²f/∂y² = ∂/∂y ( ${dfdyValCleanFormat} )
                    </div>
                    <div style="font-family: 'Fraunces', serif; font-size: 1.5rem; color: var(--teal); text-align: center; margin: 1.5rem 0; font-weight: 700;">
                      ∂²f/∂y² = ${d2fdy2ValCleanFormat}
                    </div>
                  </div>
                </div>`;

  // Card 4c: ∂²f/∂x∂y
  stepsHtml += `<div class="step-card">
                  <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                      <div class="step-number">${stepCount++}</div>
                      <div class="step-title">Second Order: ∂²f/∂x∂y (Mixed Derivative)</div>
                    </div>
                    <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div>
                  </div>
                  <div class="step-content">
                    <div class="step-desc" style="margin-bottom: 0.5rem;">
                      The mixed second-order partial derivative <strong>∂²f/∂x∂y</strong> is computed by differentiating <code>∂f/∂y = ${dfdyValCleanFormat}</code> with respect to <strong>x</strong>:
                    </div>
                    <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.15rem; color: var(--navy); margin: 1rem 0;">
                      ∂²f/∂x∂y = ∂/∂x ( ${dfdyValCleanFormat} )
                    </div>
                    <div style="font-family: 'Fraunces', serif; font-size: 1.5rem; color: var(--teal); text-align: center; margin: 1.5rem 0; font-weight: 700;">
                      ∂²f/∂x∂y = ${d2fdxdyValCleanFormat}
                    </div>
                    <div style="font-size:0.9rem; line-height:1.5; color:var(--muted); font-style:italic;">
                      Note: According to Clairaut's Theorem, for functions with continuous second-order derivatives, the mixed derivatives are equal: ∂²f/∂x∂y = ∂²f/∂y∂x.
                    </div>
                  </div>
                </div>`;

  // Step 5: Summary Card
  stepsHtml += `<div class="step-card">
                  <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                      <div class="step-number">${stepCount++}</div>
                      <div class="step-title">Derivatives Summary Table</div>
                    </div>
                    <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div>
                  </div>
                  <div class="step-content">
                    <div class="step-desc" style="margin-bottom: 1.5rem;">
                      Here is the summary of all first and second-order partial derivatives computed for the function:
                    </div>
                    <div style="overflow-x: auto; width: 100%;">
                      <table style="width: 100%; border-collapse: collapse; text-align: left; font-family: 'Figtree', sans-serif;">
                        <thead>
                          <tr style="border-bottom: 2px solid var(--border); color: var(--navy); font-weight: 700;">
                            <th style="padding: 10px 8px; font-size: 1rem;">Derivative Order</th>
                            <th style="padding: 10px 8px; font-size: 1rem;">Notation</th>
                            <th style="padding: 10px 8px; font-size: 1rem; font-family: 'IBM Plex Mono', monospace;">Expression</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr style="border-bottom: 1px solid var(--border);">
                            <td style="padding: 10px 8px; font-weight: 600;">First-Order (w.r.t. x)</td>
                            <td style="padding: 10px 8px; font-family: 'IBM Plex Mono', monospace; font-weight: 600; color: var(--amber);">∂f/∂x</td>
                            <td style="padding: 10px 8px; font-family: 'IBM Plex Mono', monospace; font-weight: 600; color: var(--navy);">${dfdxValCleanFormat}</td>
                          </tr>
                          <tr style="border-bottom: 1px solid var(--border);">
                            <td style="padding: 10px 8px; font-weight: 600;">First-Order (w.r.t. y)</td>
                            <td style="padding: 10px 8px; font-family: 'IBM Plex Mono', monospace; font-weight: 600; color: var(--amber);">∂f/∂y</td>
                            <td style="padding: 10px 8px; font-family: 'IBM Plex Mono', monospace; font-weight: 600; color: var(--navy);">${dfdyValCleanFormat}</td>
                          </tr>
                          <tr style="border-bottom: 1px solid var(--border);">
                            <td style="padding: 10px 8px; font-weight: 600;">Second-Order (x)</td>
                            <td style="padding: 10px 8px; font-family: 'IBM Plex Mono', monospace; font-weight: 600; color: var(--amber);">∂²f/∂x²</td>
                            <td style="padding: 10px 8px; font-family: 'IBM Plex Mono', monospace; font-weight: 600; color: var(--navy);">${d2fdx2ValCleanFormat}</td>
                          </tr>
                          <tr style="border-bottom: 1px solid var(--border);">
                            <td style="padding: 10px 8px; font-weight: 600;">Second-Order (y)</td>
                            <td style="padding: 10px 8px; font-family: 'IBM Plex Mono', monospace; font-weight: 600; color: var(--amber);">∂²f/∂y²</td>
                            <td style="padding: 10px 8px; font-family: 'IBM Plex Mono', monospace; font-weight: 600; color: var(--navy);">${d2fdy2ValCleanFormat}</td>
                          </tr>
                          <tr style="border-bottom: 1px solid var(--border);">
                            <td style="padding: 10px 8px; font-weight: 600;">Mixed Second-Order</td>
                            <td style="padding: 10px 8px; font-family: 'IBM Plex Mono', monospace; font-weight: 600; color: var(--amber);">∂²f/∂x∂y</td>
                            <td style="padding: 10px 8px; font-family: 'IBM Plex Mono', monospace; font-weight: 600; color: var(--navy);">${d2fdxdyValCleanFormat}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>`;

  // Step 6: Final Answer Card and Educational Notes
  stepsHtml += `<div class="final-result animate-fade-in" style="text-align: center; padding: 2.5rem; background: #111827; color: #ffffff; border-radius: 16px; border: 1px solid var(--border); box-shadow: 0 10px 30px rgba(0,0,0,0.15); margin-top: 2.5rem;">
                  <div style="font-size: 1.8rem; font-weight: 700; color: var(--amber); margin-bottom: 0.5rem; font-family:'Fraunces', serif;">✅ Derivatives Successfully Calculated!</div>
                  <div style="font-size: 1.05rem; opacity: 0.9; margin-bottom: 2rem;">The partial derivatives of f(x, y) have been solved symbolically.</div>
                  
                  <div style="display:inline-block; text-align: left; padding: 1.5rem; background: rgba(255,255,255,0.06); border-radius: 12px; border: 1px solid rgba(255,255,255,0.12); box-sizing: border-box; width: 100%; max-width: 600px;">
                    <div style="font-size:0.95rem; font-weight:600; color: rgba(255,255,255,0.7); border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; margin-bottom: 1rem;">Summary of Solutions:</div>
                    
                    <div style="display: flex; flex-direction: column; gap: 1rem; font-family: 'IBM Plex Mono', monospace; font-size: 1.25rem;">
                      <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed rgba(255,255,255,0.1); padding-bottom: 0.5rem;">
                        <span style="color: rgba(255,255,255,0.6); font-size: 1.1rem;">∂f/∂x:</span>
                        <span style="color: var(--amber); font-weight: 700;">${dfdxValCleanFormat}</span>
                      </div>
                      <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed rgba(255,255,255,0.1); padding-bottom: 0.5rem;">
                        <span style="color: rgba(255,255,255,0.6); font-size: 1.1rem;">∂f/∂y:</span>
                        <span style="color: var(--amber); font-weight: 700;">${dfdyValCleanFormat}</span>
                      </div>
                      <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed rgba(255,255,255,0.1); padding-bottom: 0.5rem;">
                        <span style="color: rgba(255,255,255,0.6); font-size: 1.1rem;">∂²f/∂x²:</span>
                        <span style="color: var(--teal); font-weight: 700;">${d2fdx2ValCleanFormat}</span>
                      </div>
                      <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed rgba(255,255,255,0.1); padding-bottom: 0.5rem;">
                        <span style="color: rgba(255,255,255,0.6); font-size: 1.1rem;">∂²f/∂y²:</span>
                        <span style="color: var(--teal); font-weight: 700;">${d2fdy2ValCleanFormat}</span>
                      </div>
                      <div style="display: flex; justify-content: space-between; padding-bottom: 0.25rem;">
                        <span style="color: rgba(255,255,255,0.6); font-size: 1.1rem;">∂²f/∂x∂y:</span>
                        <span style="color: var(--teal); font-weight: 700;">${d2fdxdyValCleanFormat}</span>
                      </div>
                    </div>
                  </div>

                  <div style="margin-top: 2rem; padding: 1.25rem; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; text-align: left; box-sizing: border-box; width: 100%; max-width: 600px; margin-left: auto; margin-right: auto;">
                    <div style="display: flex; align-items: center; gap: 8px; border-bottom: 1px dashed rgba(255,255,255,0.1); padding-bottom: 0.5rem; margin-bottom: 0.75rem;">
                      <span style="font-size: 1.2rem;">💡</span>
                      <span style="font-weight: 700; color: var(--amber); font-size: 1.05rem; font-family: 'Fraunces', serif;">Educational Note</span>
                    </div>
                    <div style="font-size: 0.95rem; line-height: 1.6; color: rgba(255,255,255,0.8);">
                      <p style="margin-bottom: 0.75rem;">
                        <strong>Partial differentiation</strong> treats all other variables as constants while differentiating with respect to a chosen variable.
                      </p>
                      <p style="margin-bottom: 0;">
                        Second-order partial derivatives are widely used in optimization, maxima-minima problems, differential equations, and machine learning.
                      </p>
                    </div>
                  </div>
                </div>`;

  output.innerHTML = stepsHtml;
  output.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function calculateMaximaMinima() {
  const output = document.getElementById('steps-output');
  output.innerHTML = '';
  output.classList.add('active');

  let expr = document.getElementById('maxima-minima-function').value.trim();
  let decimalsValStr = document.getElementById('maxima-minima-decimals').value.trim();
  
  if (expr === '' || decimalsValStr === '') {
    output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Missing Fields</div></div><div class="step-desc">Please ensure all calculator parameters are filled with valid entries.</div></div>`;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  
  // Validation
  let validationResult = validateMultivariateFunction(expr);
  if (!validationResult.isValid) {
    output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Invalid Function Input</div></div><div class="step-desc">${validationResult.error}</div></div>`;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  
  let decimals = parseInt(decimalsValStr);
  if (isNaN(decimals) || !/^\d+$/.test(decimalsValStr) || decimals < 0 || decimals > 15) {
    output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Invalid Decimal Places</div></div><div class="step-desc">Decimal places must be an integer between 0 and 15.</div></div>`;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  let stepsHtml = '';
  let stepCount = 1;
  
  // Step 1: Given Function
  let richExpr = formatMathRich(expr);
  stepsHtml += `<div class="step-card">
                  <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                      <div class="step-number">${stepCount++}</div>
                      <div class="step-title">Given Function</div>
                    </div>
                    <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div>
                  </div>
                  <div class="step-content">
                    <div class="step-desc">We start with the bivariate function f(x, y):</div>
                    <div style="font-family: 'Fraunces', serif; font-size: 1.6rem; color: var(--navy); text-align: center; margin: 1.5rem 0; font-weight: 700;">
                      f(x, y) = ${richExpr}
                    </div>
                  </div>
                </div>`;

  // Step 2: First Order Partial Derivatives
  let dfdxVal = differentiateSymbolicMultivariate(expr, 'x');
  let dfdxValClean = simplifySymbolicMultivariate(dfdxVal);
  let dfdxValCleanFormat = formatMathRich(dfdxValClean);
  
  let dfdyVal = differentiateSymbolicMultivariate(expr, 'y');
  let dfdyValClean = simplifySymbolicMultivariate(dfdyVal);
  let dfdyValCleanFormat = formatMathRich(dfdyValClean);

  stepsHtml += `<div class="step-card">
                  <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                      <div class="step-number">${stepCount++}</div>
                      <div class="step-title">First-Order Partial Derivatives</div>
                    </div>
                    <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div>
                  </div>
                  <div class="step-content">
                    <div class="step-desc" style="margin-bottom: 1rem;">
                      We differentiate the function <code>f(x, y)</code> with respect to <strong>x</strong> and <strong>y</strong>:
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 1rem; align-items: center; margin: 1.5rem 0;">
                      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.25rem; color: var(--navy);">
                        f<sub>x</sub> = ∂f/∂x = <strong>${dfdxValCleanFormat}</strong>
                      </div>
                      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.25rem; color: var(--navy);">
                        f<sub>y</sub> = ∂f/∂y = <strong>${dfdyValCleanFormat}</strong>
                      </div>
                    </div>
                  </div>
                </div>`;

  // Step 3: Critical Point Solver
  let solverResult = findCriticalPoints(dfdxValClean, dfdyValClean);
  stepsHtml += `<div class="step-card">
                  <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                      <div class="step-number">${stepCount++}</div>
                      <div class="step-title">Critical Point Calculation</div>
                    </div>
                    <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div>
                  </div>
                  <div class="step-content">
                    <div class="step-desc" style="margin-bottom: 1rem;">
                      Critical (or stationary) points occur where both first-order partial derivatives are simultaneously equal to zero:
                      <br><span style="font-family: 'IBM Plex Mono', monospace; font-size: 0.95rem; margin-top: 0.5rem; display: block;">f<sub>x</sub> = 0  &amp;  f<sub>y</sub> = 0</span>
                    </div>
                    <div style="padding: 1.25rem; border: 1px solid var(--border); border-radius: 12px; background: var(--bg2); margin-top: 1rem;">
                      ${solverResult.details}
                    </div>
                  </div>
                </div>`;

  if (solverResult.points.length === 0) {
    output.innerHTML = stepsHtml + `<div class="step-card" style="border-left-color: #f59e0b;">
                                      <div class="step-header"><div class="step-title" style="color: #d97706;">No Critical Points Located</div></div>
                                      <div class="step-desc">The solver was unable to locate stationary points for this function. This can happen for functions without critical points (like <code>f(x, y) = x + y</code>).</div>
                                    </div>`;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  // Step 4: Second Order Partial Derivatives
  let d2fdx2Val = differentiateSymbolicMultivariate(dfdxValClean, 'x');
  let d2fdx2ValClean = simplifySymbolicMultivariate(d2fdx2Val);
  let d2fdx2ValCleanFormat = formatMathRich(d2fdx2ValClean);
  
  let d2fdy2Val = differentiateSymbolicMultivariate(dfdyValClean, 'y');
  let d2fdy2ValClean = simplifySymbolicMultivariate(d2fdy2Val);
  let d2fdy2ValCleanFormat = formatMathRich(d2fdy2ValClean);
  
  let d2fdxdyVal = differentiateSymbolicMultivariate(dfdyValClean, 'x');
  let d2fdxdyValClean = simplifySymbolicMultivariate(d2fdxdyVal);
  let d2fdxdyValCleanFormat = formatMathRich(d2fdxdyValClean);

  stepsHtml += `<div class="step-card">
                  <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                      <div class="step-number">${stepCount++}</div>
                      <div class="step-title">Second-Order Partial Derivatives</div>
                    </div>
                    <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div>
                  </div>
                  <div class="step-content">
                    <div class="step-desc" style="margin-bottom: 1rem;">
                      We compute the second-order partial derivatives which form the Hessian Matrix:
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 0.75rem; align-items: center; margin: 1.5rem 0; font-family: 'IBM Plex Mono', monospace; font-size: 1.15rem; color: var(--navy);">
                      <div>f<sub>xx</sub> = ∂²f/∂x² = <strong>${d2fdx2ValCleanFormat}</strong></div>
                      <div>f<sub>yy</sub> = ∂²f/∂y² = <strong>${d2fdy2ValCleanFormat}</strong></div>
                      <div>f<sub>xy</sub> = ∂²f/∂x∂y = <strong>${d2fdxdyValCleanFormat}</strong></div>
                    </div>
                  </div>
                </div>`;

  // Step 5 & 6 & 7: Hessian test, classification, and function values at each point
  let classifications = [];
  let detailedPointHtml = '';
  
  solverResult.points.forEach((p, idx) => {
    let px = parseFloat(p.x.toFixed(decimals));
    let py = parseFloat(p.y.toFixed(decimals));
    
    // Evaluate second derivatives at this point
    let r = evaluateMultivariateMath(d2fdx2ValClean, px, py);
    let t = evaluateMultivariateMath(d2fdy2ValClean, px, py);
    let s = evaluateMultivariateMath(d2fdxdyValClean, px, py);
    
    let D = r * t - s * s;
    let rVal = parseFloat(r.toFixed(decimals));
    let tVal = parseFloat(t.toFixed(decimals));
    let sVal = parseFloat(s.toFixed(decimals));
    let DVal = parseFloat(D.toFixed(decimals));
    
    let classification = '';
    let classDesc = '';
    let classColor = '';
    
    if (DVal > 0) {
      if (rVal > 0) {
        classification = 'Local Minimum';
        classDesc = `Since <strong>D &gt; 0</strong> and <strong>f<sub>xx</sub> &gt; 0</strong>, the function has a local minimum at this point.`;
        classColor = 'var(--teal)';
      } else {
        classification = 'Local Maximum';
        classDesc = `Since <strong>D &gt; 0</strong> and <strong>f<sub>xx</sub> &lt; 0</strong>, the function has a local maximum at this point.`;
        classColor = 'var(--coral)';
      }
    } else if (DVal < 0) {
      classification = 'Saddle Point';
      classDesc = `Since <strong>D &lt; 0</strong>, the point is a saddle point (the surface curves up in one direction and down in another).`;
      classColor = '#d97706';
    } else {
      classification = 'Inconclusive';
      classDesc = `Since <strong>D = 0</strong>, the second derivative test is inconclusive (higher-order derivatives must be examined).`;
      classColor = 'var(--muted)';
    }
    
    // Evaluate function value
    let fVal = evaluateMultivariateMath(expr, px, py);
    let fValFormatted = parseFloat(fVal.toFixed(decimals)).toString();
    
    classifications.push({
      point: `(${px}, ${py})`,
      D: DVal,
      fxx: rVal,
      fyy: tVal,
      fxy: sVal,
      classification: classification,
      value: classification.includes('Local') ? fValFormatted : 'N/A',
      color: classColor
    });
    
    detailedPointHtml += `
      <div style="padding: 1.5rem; border: 1px solid var(--border); border-radius: 12px; background: var(--white); margin-bottom: 1.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed var(--border); padding-bottom: 0.5rem; margin-bottom: 1rem;">
          <span style="font-weight: 700; font-family: 'Fraunces', serif; color: var(--navy); font-size: 1.15rem;">Stationary Point P<sub>${idx + 1}</sub>: (${px}, ${py})</span>
          <span style="font-size: 0.75rem; font-weight: 600; padding: 2px 8px; border-radius: 99px; background: rgba(59, 130, 246, 0.1); color: #3b82f6;">Hessian Analysis</span>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 1rem; margin-bottom: 1.25rem;">
          <div style="padding: 0.75rem; background: var(--bg2); border-radius: 8px; text-align: center;">
            <div style="font-size: 0.8rem; color: var(--muted); font-weight: 600;">f<sub>xx</sub> (r)</div>
            <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.15rem; font-weight: 700; color: var(--navy);">${rVal}</div>
          </div>
          <div style="padding: 0.75rem; background: var(--bg2); border-radius: 8px; text-align: center;">
            <div style="font-size: 0.8rem; color: var(--muted); font-weight: 600;">f<sub>yy</sub> (t)</div>
            <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.15rem; font-weight: 700; color: var(--navy);">${tVal}</div>
          </div>
          <div style="padding: 0.75rem; background: var(--bg2); border-radius: 8px; text-align: center;">
            <div style="font-size: 0.8rem; color: var(--muted); font-weight: 600;">f<sub>xy</sub> (s)</div>
            <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.15rem; font-weight: 700; color: var(--navy);">${sVal}</div>
          </div>
        </div>

        <div class="step-desc" style="font-weight: 600; color: var(--navy); margin-bottom: 0.5rem;">Hessian Discriminant (D) Calculation:</div>
        <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.1rem; color: var(--navy); margin: 0.5rem 0; padding-left: 0.75rem; border-left: 2px solid var(--amber);">
          D = f<sub>xx</sub> · f<sub>yy</sub> - (f<sub>xy</sub>)²
          <br>D = (${rVal}) · (${tVal}) - (${sVal})²
          <br>D = ${rVal * tVal} - ${sVal * sVal} = <strong>${DVal}</strong>
        </div>

        <div style="margin-top: 1.25rem; padding: 1rem; border-radius: 8px; background: rgba(59, 130, 246, 0.03); border: 1px dashed var(--border);">
          <div style="font-weight: 700; color: ${classColor}; font-size: 1.1rem; margin-bottom: 0.4rem;">Classification: ${classification}</div>
          <div style="font-size: 0.95rem; color: var(--text); line-height: 1.5;">${classDesc}</div>
        </div>

        ${classification.includes('Local') ? `
          <div style="margin-top: 1rem; font-size: 0.95rem; color: var(--text);">
            Substituting this point into the original function to get the extreme value:
            <br><span style="font-family: 'IBM Plex Mono', monospace; font-size: 1.05rem; display: block; margin-top: 0.4rem; color: var(--teal); font-weight: 600;">
              f(${px}, ${py}) = ${fValFormatted}
            </span>
          </div>
        ` : ''}
      </div>
    `;
  });

  // Step 5: Hessian Discriminant Test
  stepsHtml += `<div class="step-card">
                  <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                      <div class="step-number">${stepCount++}</div>
                      <div class="step-title">Second Derivative Test &amp; Point Classification</div>
                    </div>
                    <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div>
                  </div>
                  <div class="step-content">
                    <div class="step-desc" style="margin-bottom: 1.5rem;">
                      For each stationary point, we compute the Hessian Determinant <code>D = f<sub>xx</sub>f<sub>yy</sub> - (f<sub>xy</sub>)²</code> and apply the classification rules:
                    </div>
                    ${detailedPointHtml}
                  </div>
                </div>`;

  // Step 6: Summary Card
  stepsHtml += `<div class="step-card">
                  <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                      <div class="step-number">${stepCount++}</div>
                      <div class="step-title">Classification Summary Table</div>
                    </div>
                    <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div>
                  </div>
                  <div class="step-content">
                    <div style="overflow-x: auto; width: 100%;">
                      <table style="width: 100%; border-collapse: collapse; text-align: left; font-family: 'Figtree', sans-serif;">
                        <thead>
                          <tr style="border-bottom: 2px solid var(--border); color: var(--navy); font-weight: 700;">
                            <th style="padding: 10px 8px; font-size: 1rem;">Critical Point</th>
                            <th style="padding: 10px 8px; font-size: 1rem; font-family: 'IBM Plex Mono', monospace;">D</th>
                            <th style="padding: 10px 8px; font-size: 1rem; font-family: 'IBM Plex Mono', monospace;">f<sub>xx</sub> (r)</th>
                            <th style="padding: 10px 8px; font-size: 1rem;">Classification</th>
                            <th style="padding: 10px 8px; font-size: 1rem;">Extremum Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${classifications.map(c => `
                            <tr style="border-bottom: 1px solid var(--border);">
                              <td style="padding: 10px 8px; font-weight: 700; font-family: 'IBM Plex Mono', monospace; color: var(--navy);">${c.point}</td>
                              <td style="padding: 10px 8px; font-family: 'IBM Plex Mono', monospace; font-weight: 600;">${c.D}</td>
                              <td style="padding: 10px 8px; font-family: 'IBM Plex Mono', monospace; font-weight: 600;">${c.fxx}</td>
                              <td style="padding: 10px 8px; font-weight: 700; color: ${c.color};">${c.classification}</td>
                              <td style="padding: 10px 8px; font-weight: 700; font-family: 'IBM Plex Mono', monospace; color: var(--teal);">${c.value}</td>
                            </tr>
                          `).join('')}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>`;

  // Final Answer Card and Educational Notes
  stepsHtml += `<div class="final-result animate-fade-in" style="text-align: center; padding: 2.5rem; background: #111827; color: #ffffff; border-radius: 16px; border: 1px solid var(--border); box-shadow: 0 10px 30px rgba(0,0,0,0.15); margin-top: 2.5rem;">
                  <div style="font-size: 1.8rem; font-weight: 700; color: var(--amber); margin-bottom: 0.5rem; font-family:'Fraunces', serif;">✅ Stationary Points Fully Classified!</div>
                  <div style="font-size: 1.05rem; opacity: 0.9; margin-bottom: 2rem;">The extrema and saddle points have been evaluated step-by-step.</div>
                  
                  <div style="display:inline-block; text-align: left; padding: 1.5rem; background: rgba(255,255,255,0.06); border-radius: 12px; border: 1px solid rgba(255,255,255,0.12); box-sizing: border-box; width: 100%; max-width: 600px;">
                    <div style="font-size:0.95rem; font-weight:600; color: rgba(255,255,255,0.7); border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; margin-bottom: 1rem;">Summary of Extrema:</div>
                    
                    <div style="display: flex; flex-direction: column; gap: 0.75rem; font-family: 'IBM Plex Mono', monospace; font-size: 1.15rem;">
                      ${classifications.map(c => `
                        <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed rgba(255,255,255,0.08); padding-bottom: 0.4rem;">
                          <span style="color: rgba(255,255,255,0.75);">${c.point} &rarr; <span style="color:${c.color};font-weight:700;">${c.classification}</span></span>
                          <span style="color: var(--amber); font-weight: 700;">f = ${c.value}</span>
                        </div>
                      `).join('')}
                    </div>
                  </div>

                  <div style="margin-top: 2rem; padding: 1.25rem; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; text-align: left; box-sizing: border-box; width: 100%; max-width: 600px; margin-left: auto; margin-right: auto;">
                    <div style="display: flex; align-items: center; gap: 8px; border-bottom: 1px dashed rgba(255,255,255,0.1); padding-bottom: 0.5rem; margin-bottom: 0.75rem;">
                      <span style="font-size: 1.2rem;">💡</span>
                      <span style="font-weight: 700; color: var(--amber); font-size: 1.05rem; font-family: 'Fraunces', serif;">Educational Note</span>
                    </div>
                    <div style="font-size: 0.95rem; line-height: 1.6; color: rgba(255,255,255,0.8);">
                      <p style="margin-bottom: 0.75rem;">
                        The <strong>Hessian determinant test</strong> is used to classify stationary points of multivariable functions.
                      </p>
                      <p style="margin-bottom: 0;">
                        A positive determinant indicates a local extremum (minimum if f<sub>xx</sub> &gt; 0, maximum if f<sub>xx</sub> &lt; 0), while a negative determinant indicates a saddle point.
                      </p>
                    </div>
                  </div>
                </div>`;

  output.innerHTML = stepsHtml;
  output.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

    stepsHtml += `<div class="step-card"><div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)"><div style="display: flex; align-items: center; gap: 0.75rem;"><div class="step-number">${stepCount++}</div><div class="step-title">Iteration ${k}</div></div><div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted); transform: rotate(-90deg);">▼</div></div><div class="step-content" style="display: none;"><div class="step-desc">Using x<sub>${k - 1}</sub> = ${currentX.toFixed(decimals)} in the Newton Raphson steps:</div><div style="margin-top: 1rem;">${iterSubStr}</div><div style="margin-top: 1.25rem; padding: 1rem; background: var(--bg); border-radius: 8px; font-size: 0.95rem; color: var(--navy); border: 1px solid var(--border);"><div style="font-weight: 700; margin-bottom: 0.5rem; text-transform: uppercase; font-size: 0.85rem; letter-spacing:0.05em; color:var(--muted);">Error Calculation:</div><div style="font-family:'IBM Plex Mono',monospace; font-size: 1rem; margin-bottom: 0.5rem;">Error = |x<sub>${k}</sub> - x<sub>${k - 1}</sub>| = |${nextX.toFixed(decimals)} - ${currentX.toFixed(decimals)}| = <strong>${err.toFixed(decimals)}</strong></div><div style="font-weight: 700; border-top: 1px dashed var(--border); padding-top: 0.5rem; margin-top: 0.5rem; font-size: 0.95rem;">Comparison: ${err.toFixed(decimals)} ${err < tolerance ? ` &lt; ${tolerance} (&epsilon;) <span style="color: var(--teal)">&nbsp;&bull;&nbsp; Converged!</span>` : ` &ge; ${tolerance} (&epsilon;)`}</div></div></div></div>`;

    currentX = nextX;
    finalIter = k;
    if (err < tolerance) { converged = true; break; }
  }

  if (!isHalted) {
    // Step Summary Table
    stepsHtml += `<div class="step-card"><div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)"><div style="display: flex; align-items: center; gap: 0.75rem;"><div class="step-number">${stepCount++}</div><div class="step-title">Iteration Summary Table</div></div><div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted); transform: rotate(-90deg);">▼</div></div><div class="step-content" style="display: none;"><div class="step-desc">A unified view of variable approximations:</div><div style="overflow-x: auto; margin-top: 1.5rem;"><table style="width: 100%; border-collapse: collapse; border: 1px solid var(--border);"><thead><tr style="background: var(--bg); border-bottom: 2px solid var(--border);"><th style="padding: 0.75rem; color: var(--navy); width: 80px;">Iter</th><th style="padding: 0.75rem; color: var(--navy);">x<sub>n</sub></th><th style="padding: 0.75rem; color: var(--navy);">f(x<sub>n</sub>)</th><th style="padding: 0.75rem; color: var(--navy);">f'(x<sub>n</sub>)</th><th style="padding: 0.75rem; color: var(--navy);">x<sub>n+1</sub></th><th style="padding: 0.75rem; color: var(--navy);">Abs Error</th></tr></thead><tbody>${tableRows.map(row => `<tr style="border-bottom: 1px solid var(--border); ${row.iter === finalIter && converged ? 'background: rgba(13, 148, 136, 0.05); font-weight:600;' : ''}"><td style="padding: 0.75rem; text-align: center; font-weight: 600;">${row.iter}</td><td style="padding: 0.75rem; text-align: center; font-family: 'IBM Plex Mono', monospace;">${row.xn.toFixed(decimals)}</td><td style="padding: 0.75rem; text-align: center; font-family: 'IBM Plex Mono', monospace;">${row.fxn.toFixed(decimals)}</td><td style="padding: 0.75rem; text-align: center; font-family: 'IBM Plex Mono', monospace;">${row.fprime.toFixed(decimals)}</td><td style="padding: 0.75rem; text-align: center; font-family: 'IBM Plex Mono', monospace;">${row.xnext.toFixed(decimals)}</td><td style="padding: 0.75rem; text-align: center; font-family: 'IBM Plex Mono', monospace; font-weight: 700; color: var(--navy);">${row.error.toFixed(decimals)}</td></tr>`).join('')}</tbody></table></div></div></div>`;

    // SVG Graph Plot
    let chartGraphHtml = '<div style="width: 100%; display: flex; flex-direction: column; align-items: center;"><div style="font-weight:700; color:var(--amber); font-size:1.1rem; margin-bottom:1rem; font-family:\'Fraunces\', serif;">✦ Graphical Convergence Curve</div><div id="newton-interactive-graph" style="width: 100%; height: 350px;"></div></div>';

    // Final answer card
    let finalResultHtml = converged
      ? `<div class="final-result animate-fade-in" style="padding: 2.5rem; background: #111827; color: #ffffff; border-radius: 16px; border: 1px solid var(--border); box-shadow: 0 10px 30px rgba(0,0,0,0.15); margin-bottom: 2rem; display: flex; flex-wrap: wrap; gap: 2rem; align-items: center;">
          <div style="flex: 1 1 200px; min-width: 200px; order: 1;">${chartGraphHtml}</div>
          <div style="flex: 1 1 200px; text-align: left; order: 2;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; margin-bottom: 0.5rem;"><div style="font-size: 1.8rem; font-weight: 700; color: var(--amber); font-family:'Fraunces', serif;">✅ Solution Converged!</div><button onclick="const c = this.closest('#steps-output').querySelectorAll('.step-card'); if(c.length) c[0].scrollIntoView({behavior: 'smooth', block: 'start'})" style="background: rgba(245, 158, 11, 0.15); color: var(--amber); border: 1px solid rgba(245, 158, 11, 0.3); padding: 0.4rem 0.8rem; border-radius: 8px; font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: all 0.2s; font-family: 'Figtree', sans-serif; display: inline-flex; align-items: center; gap: 0.4rem; white-space: nowrap;" onmouseover="this.style.background='rgba(245, 158, 11, 0.25)'" onmouseout="this.style.background='rgba(245, 158, 11, 0.15)'"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg> View Steps</button></div>
            <div style="font-size: 1.05rem; opacity: 0.9; margin-bottom: 1.5rem;">The system converged within tolerance limit (&epsilon; = ${tolerance}) after <strong>${finalIter}</strong> iterations.</div>
            <div style="padding: 1.5rem; background: rgba(255,255,255,0.06); border-radius: 12px; border: 1px solid rgba(255,255,255,0.12);">
              <div style="font-size:0.95rem; font-weight:600; color: rgba(255,255,255,0.7); border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; margin-bottom: 0.75rem;">Final Solved Root:</div>
              <div style="font-family:'IBM Plex Mono',monospace; font-size: 1.45rem; font-weight:700; color:var(--amber); margin: 0.6rem 0;">Root ≈ <span style="color:#ffffff;">${currentX.toFixed(decimals)}</span></div>
            </div>
          </div>
        </div>`
      : `<div class="final-result animate-fade-in" style="padding: 2.5rem; background: #991b1b; color: #ffffff; border-radius: 16px; border: 1px solid var(--border); box-shadow: 0 10px 30px rgba(0,0,0,0.15); margin-bottom: 2rem; display: flex; flex-wrap: wrap; gap: 2rem; align-items: center;">
          <div style="flex: 1 1 200px; min-width: 200px; order: 1;">${chartGraphHtml}</div>
          <div style="flex: 1 1 200px; text-align: left; order: 2;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; margin-bottom: 0.5rem;"><div style="font-size: 1.8rem; font-weight: 700; color: var(--amber); font-family:'Fraunces', serif;">⚠️ Limits Reached</div><button onclick="const c = this.closest('#steps-output').querySelectorAll('.step-card'); if(c.length) c[0].scrollIntoView({behavior: 'smooth', block: 'start'})" style="background: rgba(245, 158, 11, 0.15); color: var(--amber); border: 1px solid rgba(245, 158, 11, 0.3); padding: 0.4rem 0.8rem; border-radius: 8px; font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: all 0.2s; font-family: 'Figtree', sans-serif; display: inline-flex; align-items: center; gap: 0.4rem; white-space: nowrap;" onmouseover="this.style.background='rgba(245, 158, 11, 0.25)'" onmouseout="this.style.background='rgba(245, 158, 11, 0.15)'"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg> View Steps</button></div>
            <div style="font-size: 1.05rem; opacity: 0.9; margin-bottom: 1.5rem;">The system did not converge to tolerance (&epsilon; = ${tolerance}) within <strong>${maxIter}</strong> iterations limit.</div>
            <div style="padding: 1.5rem; background: rgba(255,255,255,0.06); border-radius: 12px; border: 1px solid rgba(255,255,255,0.12);">
              <div style="font-size:0.95rem; font-weight:600; color: rgba(255,255,255,0.7); border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; margin-bottom: 0.75rem;">Last Computed State (Iteration ${finalIter}):</div>
              <div style="font-family:'IBM Plex Mono',monospace; font-size: 1.45rem; font-weight:700; color:var(--amber); margin: 0.6rem 0;">Root ≈ <span style="color:#ffffff;">${currentX.toFixed(decimals)}</span></div>
            </div>
          </div>
        </div>`;
      
    stepsHtml = finalResultHtml + stepsHtml;
  }

  output.innerHTML = stepsHtml;
  output.scrollIntoView({ behavior: 'smooth', block: 'start' });

  if (!isHalted && window.InteractiveGraph) {
    setTimeout(() => {
      let minX = Math.min(currentX, guess) - 1.0;
      let maxX = Math.max(currentX, guess) + 1.0;
      if (maxX - minX < 0.5) { minX = currentX - 1.0; maxX = currentX + 1.0; }
      let ys = tableRows.map(r => r.fxn).filter(y => !isNaN(y) && isFinite(y));
      let minY = ys.length > 0 ? Math.min(0, ...ys) - 2 : -10;
      let maxY = ys.length > 0 ? Math.max(0, ...ys) + 2 : 10;
      new InteractiveGraph('newton-interactive-graph', {
        expr: expr, root: currentX, minX: minX, maxX: maxX, minY: minY, maxY: maxY,
        iterations: tableRows, type: 'newton'
      });
    }, 50);
  }
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

    let chartGraphHtml = '<div style="width: 100%; display: flex; flex-direction: column; align-items: center;"><div style="font-weight:700; color:var(--amber); font-size:1.1rem; margin-bottom:1rem; font-family:\'Fraunces\', serif;">✦ Graphical Secant Convergence</div><div id="false-position-interactive-graph" style="width: 100%; height: 350px;"></div></div>';
    let finalXr = tableRows[tableRows.length - 1].xr;

    let finalResultHtml = converged
      ? `<div class="final-result animate-fade-in" style="padding: 2.5rem; background: #111827; color: #ffffff; border-radius: 16px; border: 1px solid var(--border); box-shadow: 0 10px 30px rgba(0,0,0,0.15); margin-bottom: 2rem; display: flex; flex-wrap: wrap; gap: 2rem; align-items: center;">
          <div style="flex: 1 1 200px; min-width: 200px; order: 1;">${chartGraphHtml}</div>
          <div style="flex: 1 1 200px; text-align: left; order: 2;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; margin-bottom: 0.5rem;"><div style="font-size: 1.8rem; font-weight: 700; color: var(--amber); font-family:'Fraunces', serif;">✅ Solution Converged!</div><button onclick="const c = this.closest('#steps-output').querySelectorAll('.step-card'); if(c.length) c[0].scrollIntoView({behavior: 'smooth', block: 'start'})" style="background: rgba(245, 158, 11, 0.15); color: var(--amber); border: 1px solid rgba(245, 158, 11, 0.3); padding: 0.4rem 0.8rem; border-radius: 8px; font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: all 0.2s; font-family: 'Figtree', sans-serif; display: inline-flex; align-items: center; gap: 0.4rem; white-space: nowrap;" onmouseover="this.style.background='rgba(245, 158, 11, 0.25)'" onmouseout="this.style.background='rgba(245, 158, 11, 0.15)'"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg> View Steps</button></div>
            <div style="font-size: 1.05rem; opacity: 0.9; margin-bottom: 1.5rem;">The system converged within tolerance limit (&epsilon; = ${tolerance}) after <strong>${finalIter}</strong> iterations.</div>
            <div style="padding: 1.5rem; background: rgba(255,255,255,0.06); border-radius: 12px; border: 1px solid rgba(255,255,255,0.12);">
              <div style="font-size:0.95rem; font-weight:600; color: rgba(255,255,255,0.7); border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; margin-bottom: 0.75rem;">Final Solved Root:</div>
              <div style="font-family:'IBM Plex Mono',monospace; font-size: 1.45rem; font-weight:700; color:var(--amber); margin: 0.6rem 0;">Root ≈ <span style="color:#ffffff;">${finalXr.toFixed(decimals)}</span></div>
            </div>
          </div>
        </div>`
      : `<div class="final-result animate-fade-in" style="padding: 2.5rem; background: #991b1b; color: #ffffff; border-radius: 16px; border: 1px solid var(--border); box-shadow: 0 10px 30px rgba(0,0,0,0.15); margin-bottom: 2rem; display: flex; flex-wrap: wrap; gap: 2rem; align-items: center;">
          <div style="flex: 1 1 200px; min-width: 200px; order: 1;">${chartGraphHtml}</div>
          <div style="flex: 1 1 200px; text-align: left; order: 2;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; margin-bottom: 0.5rem;"><div style="font-size: 1.8rem; font-weight: 700; color: var(--amber); font-family:'Fraunces', serif;">⚠️ Limits Reached</div><button onclick="const c = this.closest('#steps-output').querySelectorAll('.step-card'); if(c.length) c[0].scrollIntoView({behavior: 'smooth', block: 'start'})" style="background: rgba(245, 158, 11, 0.15); color: var(--amber); border: 1px solid rgba(245, 158, 11, 0.3); padding: 0.4rem 0.8rem; border-radius: 8px; font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: all 0.2s; font-family: 'Figtree', sans-serif; display: inline-flex; align-items: center; gap: 0.4rem; white-space: nowrap;" onmouseover="this.style.background='rgba(245, 158, 11, 0.25)'" onmouseout="this.style.background='rgba(245, 158, 11, 0.15)'"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg> View Steps</button></div>
            <div style="font-size: 1.05rem; opacity: 0.9; margin-bottom: 1.5rem;">Method did not converge to tolerance (&epsilon; = ${tolerance}) within <strong>${maxIter}</strong> iterations limit.</div>
            <div style="padding: 1.5rem; background: rgba(255,255,255,0.06); border-radius: 12px; border: 1px solid rgba(255,255,255,0.12);">
              <div style="font-size:0.95rem; font-weight:600; color: rgba(255,255,255,0.7); border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; margin-bottom: 0.75rem;">Last Computed State (Iteration ${finalIter}):</div>
              <div style="font-family:'IBM Plex Mono',monospace; font-size: 1.45rem; font-weight:700; color:var(--amber); margin: 0.6rem 0;">Root ≈ <span style="color:#ffffff;">${finalXr.toFixed(decimals)}</span></div>
            </div>
          </div>
        </div>`;

    stepsHtml = finalResultHtml + stepsHtml + `<div class="step-card" style="border-left: 4px solid var(--teal); background: rgba(13, 148, 136, 0.05); margin-top: 2rem;"><div style="font-weight: 700; color: var(--teal); font-size: 1.1rem; margin-bottom: 0.5rem; font-family:'Fraunces', serif;">✦ Educational Note: Method Characteristics</div><div style="font-size: 1rem; line-height: 1.5; color: var(--navy);">False Position Method combines interval bracketing with interpolation, making it generally faster than the Bisection Method while maintaining guaranteed bracketing of the root.</div></div>`;
  }

  output.innerHTML = stepsHtml;
  output.scrollIntoView({ behavior: 'smooth', block: 'start' });

  if (!isHalted && window.InteractiveGraph) {
    setTimeout(() => {
      let finalXr = tableRows[tableRows.length - 1].xr;
      let minX = Math.min(finalXr, initA, initB) - 0.5;
      let maxX = Math.max(finalXr, initA, initB) + 0.5;
      if (maxX - minX < 0.5) { minX = finalXr - 1.0; maxX = finalXr + 1.0; }
      let ys = [];
      tableRows.forEach(r => { ys.push(r.fa, r.fb, r.fxr); });
      ys = ys.filter(y => !isNaN(y) && isFinite(y));
      let minY = ys.length > 0 ? Math.min(0, ...ys) - 2 : -10;
      let maxY = ys.length > 0 ? Math.max(0, ...ys) + 2 : 10;
      
      new InteractiveGraph('false-position-interactive-graph', {
        expr: expr, root: finalXr, minX: minX, maxX: maxX, minY: minY, maxY: maxY,
        iterations: tableRows, type: 'false-position'
      });
    }, 50);
  }
}

function calculateIntegration() {
  const output = document.getElementById('steps-output');
  if (!output) return;
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
            <div>&bull; Remaining Middle Nodes Sum (y<sub>1</sub> + &hellip; + y<sub>${intervalsN - 1}</sub>): <br>
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

  let graphHtml = '<div style="width: 100%; display: flex; flex-direction: column; align-items: center;"><div style="font-weight:700; color:var(--amber); font-size:1.1rem; margin-bottom:1rem; font-family:\'Fraunces\', serif;">✦ Area Approximation Visualization</div><div id="integration-interactive-graph" style="width: 100%; height: 350px;"></div></div>';

  let finalResultHtml = `
        <div class="final-result animate-fade-in" style="padding: 2.5rem; background: #111827; color: #ffffff; border-radius: 16px; border: 1px solid var(--border); box-shadow: 0 10px 30px rgba(0,0,0,0.15); margin-bottom: 2rem; display: flex; flex-wrap: wrap; gap: 2rem; align-items: center;">
          <div style="flex: 1 1 200px; min-width: 200px; order: 1;">${graphHtml}</div>
          <div style="flex: 1 1 200px; text-align: left; order: 2;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; margin-bottom: 0.5rem;"><div style="font-size: 1.8rem; font-weight: 700; color: var(--amber); font-family:'Fraunces', serif;">✅ Definite Integral Solved!</div><button onclick="const c = this.closest('#steps-output').querySelectorAll('.step-card'); if(c.length) c[0].scrollIntoView({behavior: 'smooth', block: 'start'})" style="background: rgba(245, 158, 11, 0.15); color: var(--amber); border: 1px solid rgba(245, 158, 11, 0.3); padding: 0.4rem 0.8rem; border-radius: 8px; font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: all 0.2s; font-family: 'Figtree', sans-serif; display: inline-flex; align-items: center; gap: 0.4rem; white-space: nowrap;" onmouseover="this.style.background='rgba(245, 158, 11, 0.25)'" onmouseout="this.style.background='rgba(245, 158, 11, 0.15)'"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg> View Steps</button></div>
            <div style="font-size: 1.05rem; opacity: 0.9; margin-bottom: 1.5rem;">Calculated over boundary interval bounds [${initA}, ${initB}] using step spacing.</div>
            <div style="padding: 1.5rem; background: rgba(255,255,255,0.06); border-radius: 12px; border: 1px solid rgba(255,255,255,0.12);">
              <div style="font-size:0.95rem; font-weight:600; color: rgba(255,255,255,0.7); border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; margin-bottom: 0.75rem;">Definite Integral Value:</div>
              <div style="font-family:'IBM Plex Mono',monospace; font-size: 1.45rem; font-weight:700; color:var(--amber); margin: 0.6rem 0;">
                &int;<sub>${initA}</sub><sup>${initB}</sup> f(x) dx &approx; <span style="color:#ffffff;">${resultVal.toFixed(decimals)}</span>
              </div>
              <div style="font-size: 0.9rem; opacity:0.8; margin-top: 0.5rem;">Step Size h = <strong>${h.toFixed(decimals)}</strong></div>
              <div style="font-size: 0.9rem; opacity:0.8;">Sub-Intervals n = <strong>${intervalsN}</strong></div>
            </div>
          </div>
        </div>
      `;

  stepsHtml += `
        <div class="step-card" style="border-left: 4px solid var(--teal); background: rgba(13, 148, 136, 0.05); margin-top: 2rem;">
          <div style="font-weight: 700; color: var(--teal); font-size: 1.1rem; margin-bottom: 0.5rem; font-family:'Fraunces', serif;">✦ Educational Note: Method Characteristics</div>
          <div style="font-size: 1rem; line-height: 1.5; color: var(--navy);">${methodNoteText}</div>
        </div>
      `;

  output.innerHTML = finalResultHtml + stepsHtml;
  output.scrollIntoView({ behavior: 'smooth', block: 'start' });

  if (window.InteractiveGraph) {
    setTimeout(() => {
      let minX = initA - h;
      let maxX = initB + h;
      let ys = nodes.map(n => n.y).filter(y => !isNaN(y) && isFinite(y));
      let minY = ys.length > 0 ? Math.min(0, ...ys) - Math.abs(Math.min(0, ...ys)) * 0.2 - 2 : -10;
      let maxY = ys.length > 0 ? Math.max(0, ...ys) + Math.abs(Math.max(0, ...ys)) * 0.2 + 2 : 10;
      
      new InteractiveGraph('integration-interactive-graph', {
        expr: expr, minX: minX, maxX: maxX, minY: minY, maxY: maxY,
        type: 'integration',
        methodData: { method: currentCalc, points: nodes }
      });
    }, 50);
  }
}

// ==========================================
// EDUCATIONAL ADJOINT CALCULATOR ENGINE
// ==========================================

// Textbook LaTeX Formatting Helpers
function formatValueSimple(val) {
  if (Math.abs(val - Math.round(val)) < 1e-9) {
    return `${Math.round(val)}`;
  }
  let sign = val < 0 ? "-" : "";
  let x = Math.abs(val);
  for (let d = 1; d <= 100; d++) {
    let n = Math.round(x * d);
    if (Math.abs(x - n / d) < 1e-7) {
      return `${sign}${n}/${d}`;
    }
  }
  return `${sign}${Number(x.toFixed(3))}`;
}

function matrixToHtml(matrix) {
  let rows = matrix.length;
  let cols = matrix[0].length;

  let formattedRows = matrix.map(row => {
    return `<div style="display: flex; gap: 1rem; justify-content: center; align-items: center; min-height: 24px;">` +
      row.map(v => `<span style="min-width: 32px; text-align: center; display: inline-block;">${formatValueSimple(v)}</span>`).join('') +
      `</div>`;
  }).join('');

  return `
        <div style="display: inline-flex; align-items: center; font-family: 'IBM Plex Mono', monospace; font-size: 1.15rem; color: var(--navy); margin: 0.75rem 0; line-height: 1.2; user-select: none;">
          <span style="font-size: ${rows * 1.3}rem; font-weight: 200; margin-right: 0.35rem; color: var(--navy); line-height: 1; transform: scaleY(1.15);">&lbrack;</span>
          <div style="display: inline-flex; flex-direction: column; text-align: center; gap: 0.4rem; padding: 0 0.15rem;">
            ${formattedRows}
          </div>
          <span style="font-size: ${rows * 1.3}rem; font-weight: 200; margin-left: 0.35rem; color: var(--navy); line-height: 1; transform: scaleY(1.15);">&rbrack;</span>
        </div>
      `;
}

function augmentedMatrixToHtml(A, B) {
  let rows = A.length;

  let formattedRowsA = A.map(row => {
    return `<div style="display: flex; gap: 1rem; justify-content: center; align-items: center; min-height: 24px;">` +
      row.map(v => `<span style="min-width: 32px; text-align: center; display: inline-block;">${formatValueSimple(v)}</span>`).join('') +
      `</div>`;
  }).join('');

  let formattedRowsB = B.map(row => {
    return `<div style="display: flex; gap: 1rem; justify-content: center; align-items: center; min-height: 24px;">` +
      row.map(v => `<span style="min-width: 32px; text-align: center; display: inline-block;">${formatValueSimple(v)}</span>`).join('') +
      `</div>`;
  }).join('');

  return `
        <div style="display: inline-flex; align-items: center; font-family: 'IBM Plex Mono', monospace; font-size: 1.15rem; color: var(--navy); margin: 0.75rem 0; line-height: 1.2; user-select: none;">
          <span style="font-size: ${rows * 1.3}rem; font-weight: 200; margin-right: 0.35rem; color: var(--navy); line-height: 1; transform: scaleY(1.15);">&lbrack;</span>
          <div style="display: inline-flex; flex-direction: column; text-align: center; gap: 0.4rem; padding: 0 0.15rem;">
            ${formattedRowsA}
          </div>
          <span style="font-size: ${rows * 1.3}rem; font-weight: 200; margin: 0 0.75rem; color: var(--border); height: 100%; border-right: 2px solid var(--border); display: inline-block; min-height: ${rows * 26}px;"></span>
          <div style="display: inline-flex; flex-direction: column; text-align: center; gap: 0.4rem; padding: 0 0.15rem;">
            ${formattedRowsB}
          </div>
          <span style="font-size: ${rows * 1.3}rem; font-weight: 200; margin-left: 0.35rem; color: var(--navy); line-height: 1; transform: scaleY(1.15);">&rbrack;</span>
        </div>
      `;
}

// Pure Mathematical Matrix Operations
function getDeterminantPure(m) {
  let n = m.length;
  if (n === 1) return m[0][0];
  if (n === 2) return m[0][0] * m[1][1] - m[0][1] * m[1][0];
  let det = 0;
  for (let j = 0; j < n; j++) {
    let sub = m.slice(1).map(row => row.filter((_, colIdx) => colIdx !== j));
    det += (j % 2 === 0 ? 1 : -1) * m[0][j] * getDeterminantPure(sub);
  }
  return det;
}

function getMinorMatrixPure(m, r, c) {
  return m.filter((_, rowIdx) => rowIdx !== r)
    .map(row => row.filter((_, colIdx) => colIdx !== c));
}

function getCofactorPure(m, r, c) {
  let sub = getMinorMatrixPure(m, r, c);
  let detVal = getDeterminantPure(sub);
  let sign = ((r + c) % 2 === 0) ? 1 : -1;
  return sign * detVal;
}

function getCofactorMatrix(m) {
  let n = m.length;
  let cofactors = [];
  for (let i = 0; i < n; i++) {
    let row = [];
    for (let j = 0; j < n; j++) {
      row.push(getCofactorPure(m, i, j));
    }
    cofactors.push(row);
  }
  return cofactors;
}

function transpose(m) {
  let rows = m.length;
  let cols = m[0].length;
  let transposed = [];
  for (let j = 0; j < cols; j++) {
    let row = [];
    for (let i = 0; i < rows; i++) {
      row.push(m[i][j]);
    }
    transposed.push(row);
  }
  return transposed;
}

function solveGaussJordanInverseDetailed(A) {
  let n = A.length;
  let M = [];
  for (let i = 0; i < n; i++) {
    let row = [];
    for (let j = 0; j < n; j++) row.push(A[i][j]);
    for (let j = 0; j < n; j++) row.push(i === j ? 1 : 0);
    M.push(row);
  }

  let steps = [];
  function recordStep(title, explanation, mathDetail = "") {
    let clonedM = M.map(r => [...r]);
    let A_state = clonedM.map(r => r.slice(0, n));
    let I_state = clonedM.map(r => r.slice(n));
    steps.push({
      title: title,
      explanation: explanation,
      mathDetail: mathDetail,
      matrixHtml: augmentedMatrixToHtml(A_state, I_state)
    });
  }

  recordStep("Augmented Matrix", "Place the identity matrix on the right side of our starting matrix:");

  for (let p = 0; p < n; p++) {
    if (Math.abs(M[p][p]) < 1e-9) {
      let swapRow = -1;
      for (let i = p + 1; i < n; i++) {
        if (Math.abs(M[i][p]) > 1e-9) {
          swapRow = i;
          break;
        }
      }
      if (swapRow === -1) {
        return { inverse: null, steps: steps, error: "Matrix is singular." };
      }
      let temp = M[p];
      M[p] = M[swapRow];
      M[swapRow] = temp;
      recordStep("Swap Rows", `Swap Row ${p + 1} and Row ${swapRow + 1} to get a non-zero number at the diagonal position:`);
    }

    let pivot = M[p][p];
    if (Math.abs(pivot - 1) > 1e-9) {
      let originalRow = [...M[p]];
      let mathLines = [];
      for (let j = 0; j < 2 * n; j++) {
        M[p][j] /= pivot;
        mathLines.push(`Col ${j + 1}: ${formatValueSimple(originalRow[j])} / ${formatValueSimple(pivot)} = ${formatValueSimple(M[p][j])}`);
      }
      recordStep(
        `Divide Row ${p + 1}`,
        `Divide all elements of Row ${p + 1} by ${formatValueSimple(pivot)} to make the diagonal element 1:`,
        mathLines.join('<br>')
      );
    }

    for (let i = 0; i < n; i++) {
      if (i === p) continue;
      let factor = M[i][p];
      if (Math.abs(factor) > 1e-9) {
        let originalRowI = [...M[i]];
        let rowP = [...M[p]];
        let mathLines = [];
        for (let j = 0; j < 2 * n; j++) {
          M[i][j] -= factor * M[p][j];
          let product = factor * rowP[j];
          mathLines.push(`Col ${j + 1}: ${formatValueSimple(originalRowI[j])} - (${formatValueSimple(factor)} × ${formatValueSimple(rowP[j])}) = ${formatValueSimple(originalRowI[j])} - ${formatValueSimple(product)} = ${formatValueSimple(M[i][j])}`);
        }
        recordStep(
          `Eliminate element in Row ${i + 1}, Column ${p + 1}`,
          `Subtract ${formatValueSimple(factor)} times Row ${p + 1} from Row ${i + 1} to create a zero:`,
          mathLines.join('<br>')
        );
      }
    }
  }

  let inverse = [];
  for (let i = 0; i < n; i++) {
    inverse.push(M[i].slice(n));
  }
  return { inverse: inverse, steps: steps };
}

// Method Steps Generators
function generateCofactorMethod(A) {
  let n = A.length;
  let steps = [];

  steps.push({
    title: "Starting Matrix",
    content: `
          <div class="step-desc" style="font-size: 1rem; color: var(--navy); margin-bottom: 0.5rem;">We start with the matrix:</div>
          <div style="text-align: center; margin: 1rem 0;">
            ${matrixToHtml(A)}
          </div>
        `
  });

  let cofactorMatrix = [];
  let calculationsHtml = "";

  for (let i = 0; i < n; i++) {
    let cofactorRow = [];
    for (let j = 0; j < n; j++) {
      let minorMat = getMinorMatrixPure(A, i, j);
      let detVal;
      let detExplanation = "";

      if (n === 2) {
        detVal = minorMat[0][0];
        detExplanation = `${formatValueSimple(detVal)}`;
      } else {
        let a = minorMat[0][0];
        let b = minorMat[0][1];
        let c_val = minorMat[1][0];
        let d = minorMat[1][1];
        detVal = a * d - b * c_val;

        let p1 = a * d;
        let p2 = b * c_val;

        detExplanation = `(${formatValueSimple(a)} × ${formatValueSimple(d)}) - (${formatValueSimple(b)} × ${formatValueSimple(c_val)})<br>= ${formatValueSimple(p1)} - ${formatValueSimple(p2)}<br>= ${formatValueSimple(detVal)}`;
      }

      let signFactor = ((i + j) % 2 === 0) ? 1 : -1;
      let signChar = signFactor > 0 ? "+" : "-";
      let cofactorVal = signFactor * detVal;
      let formattedCofactor = (cofactorVal >= 0 && signFactor > 0) ? `+${formatValueSimple(cofactorVal)}` : `${formatValueSimple(cofactorVal)}`;
      if (cofactorVal === 0) formattedCofactor = "0";

      cofactorRow.push(cofactorVal);

      calculationsHtml += `
            <div style="padding: 1.25rem; border: 1px solid var(--border); border-radius: 12px; background: var(--bg); margin-bottom: 1.5rem; font-family: 'IBM Plex Mono', monospace; line-height: 1.6; color: var(--navy); box-sizing: border-box;">
              <div style="font-weight: 700; border-bottom: 1px dashed var(--border); padding-bottom: 0.5rem; margin-bottom: 0.75rem; font-size: 1.1rem; color: var(--amber);">
                C${i + 1}${j + 1}:
              </div>
              <div>Remove row ${i + 1} and column ${j + 1}</div>
              <div style="text-align: center; margin: 0.5rem 0;">
                ${matrixToHtml(minorMat)}
              </div>
              <div style="margin-top: 0.75rem; font-weight: 600;">Determinant:</div>
              <div style="padding-left: 1rem; border-left: 2px solid var(--teal); margin: 0.5rem 0;">
                ${detExplanation}
              </div>
              <div style="margin-top: 0.75rem; font-weight: 600;">Sign:</div>
              <div style="padding-left: 1rem; border-left: 2px solid var(--teal); margin: 0.5rem 0;">
                (-1)<sup>(${i + 1}+${j + 1})</sup> = ${signChar}
              </div>
              <div style="margin-top: 0.75rem; font-weight: 700; color: var(--teal);">Therefore:</div>
              <div style="padding-left: 1rem; font-weight: 700; font-size: 1.05rem; color: var(--amber);">
                C${i + 1}${j + 1} = ${formattedCofactor}
              </div>
            </div>
          `;
    }
    cofactorMatrix.push(cofactorRow);
  }

  steps.push({
    title: "Calculate Every Cofactor",
    isCollapsed: false,
    content: `
          <div class="step-desc" style="margin-bottom: 1rem;">We calculate the cofactor value for each position step-by-step:</div>
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            ${calculationsHtml}
          </div>
        `
  });

  steps.push({
    title: "Assemble Cofactor Matrix",
    content: `
          <div class="step-desc" style="margin-bottom: 0.5rem;">We place all the calculated cofactor values into their positions:</div>
          <div style="text-align: center; margin: 1rem 0;">
            ${matrixToHtml(cofactorMatrix)}
          </div>
        `
  });

  let adjointMatrix = transpose(cofactorMatrix);
  steps.push({
    title: "Transpose the Cofactor Matrix",
    content: `
          <div class="step-desc" style="margin-bottom: 0.5rem;">We swap the rows and columns of the cofactor matrix to find the final adjoint matrix:</div>
          <div style="margin-bottom: 1rem; font-family: 'IBM Plex Mono', monospace; color: var(--navy); line-height: 1.5;">
            Row 1 becomes Column 1<br>
            Row 2 becomes Column 2<br>
            ${n === 3 ? 'Row 3 becomes Column 3<br>' : ''}
          </div>
          <div style="text-align: center; margin: 1rem 0;">
            ${matrixToHtml(adjointMatrix)}
          </div>
        `
  });

  return steps;
}

function generateMinorCofactorMethod(A) {
  let n = A.length;
  let steps = [];

  steps.push({
    title: "Starting Matrix",
    content: `
          <div class="step-desc" style="font-size: 1rem; color: var(--navy); margin-bottom: 0.5rem;">We start with the matrix:</div>
          <div style="text-align: center; margin: 1rem 0;">
            ${matrixToHtml(A)}
          </div>
        `
  });

  let minorMatrix = [];
  let minorCalculationsHtml = "";

  for (let i = 0; i < n; i++) {
    let minorRow = [];
    for (let j = 0; j < n; j++) {
      let sub = getMinorMatrixPure(A, i, j);
      let detVal;
      let detExplanation = "";

      if (n === 2) {
        detVal = sub[0][0];
        detExplanation = `${formatValueSimple(detVal)}`;
      } else {
        let a = sub[0][0];
        let b = sub[0][1];
        let c_val = sub[1][0];
        let d = sub[1][1];
        detVal = a * d - b * c_val;
        let p1 = a * d;
        let p2 = b * c_val;
        detExplanation = `(${formatValueSimple(a)} × ${formatValueSimple(d)}) - (${formatValueSimple(b)} × ${formatValueSimple(c_val)}) = ${formatValueSimple(p1)} - ${formatValueSimple(p2)} = ${formatValueSimple(detVal)}`;
      }

      minorRow.push(detVal);

      minorCalculationsHtml += `
            <div style="margin-bottom: 1.25rem; border-bottom: 1px dashed var(--border); padding-bottom: 1rem;">
              <div style="font-weight: 700; color: var(--navy); margin-bottom: 0.4rem;">Position Row ${i + 1}, Col ${j + 1}:</div>
              <div>Remove Row ${i + 1} and Col ${j + 1}:</div>
              <div style="text-align: center; margin: 0.5rem 0;">
                ${matrixToHtml(sub)}
              </div>
              <div style="margin-top: 0.5rem;">Determinant Calculation:</div>
              <div style="font-family: 'IBM Plex Mono', monospace; color: var(--teal); font-weight: 600; padding-left: 1rem; margin-top: 0.25rem;">
                ${detExplanation}
              </div>
            </div>
          `;
    }
    minorMatrix.push(minorRow);
  }

  steps.push({
    title: "Calculate All Minor Determinants",
    isCollapsed: false,
    content: `
          <div class="step-desc" style="margin-bottom: 1rem;">We calculate the determinant of the minor matrix for each position:</div>
          <div style="padding: 1.25rem; border: 1px solid var(--border); border-radius: 12px; background: var(--bg); font-family: 'IBM Plex Mono', monospace; line-height: 1.5; color: var(--navy); box-sizing: border-box;">
            ${minorCalculationsHtml}
          </div>
          <div class="step-desc" style="margin-top: 1.5rem; margin-bottom: 0.5rem;">We assemble these calculated determinants into the minor matrix:</div>
          <div style="text-align: center; margin: 1rem 0;">
            ${matrixToHtml(minorMatrix)}
          </div>
        `
  });

  let cofactorMatrix = getCofactorMatrix(A);
  let signTextRow = [];
  let multiplicationLines = [];

  for (let i = 0; i < n; i++) {
    let signRow = [];
    for (let j = 0; j < n; j++) {
      let signFactor = ((i + j) % 2 === 0) ? 1 : -1;
      let signChar = signFactor > 0 ? "+" : "-";
      signRow.push(signChar);

      let minorVal = minorMatrix[i][j];
      let cofactorVal = cofactorMatrix[i][j];
      multiplicationLines.push(`Row ${i + 1}, Col ${j + 1}: ${formatValueSimple(minorVal)} × (${signChar}1) = ${formatValueSimple(cofactorVal)}`);
    }
    signTextRow.push(signRow);
  }

  let signMatrixHtml = `
        <div style="display: inline-flex; align-items: center; font-family: 'IBM Plex Mono', monospace; font-size: 1.25rem; color: var(--navy); margin: 0.75rem 0; line-height: 1.2; user-select: none;">
          <span style="font-size: ${n * 1.3}rem; font-weight: 200; margin-right: 0.35rem; color: var(--navy); line-height: 1; transform: scaleY(1.15);">&lbrack;</span>
          <div style="display: inline-flex; flex-direction: column; text-align: center; gap: 0.4rem; padding: 0 0.15rem;">
            ${signTextRow.map(row => `<div style="display: flex; gap: 1.5rem; justify-content: center; align-items: center; min-height: 24px;">` + row.map(s => `<span style="min-width: 20px; text-align: center; font-weight: 700;">${s}</span>`).join('') + `</div>`).join('')}
          </div>
          <span style="font-size: ${n * 1.3}rem; font-weight: 200; margin-left: 0.35rem; color: var(--navy); line-height: 1; transform: scaleY(1.15);">&rbrack;</span>
        </div>
      `;

  steps.push({
    title: "Apply Position Signs",
    content: `
          <div class="step-desc" style="margin-bottom: 0.5rem;">We apply the position signs (+ or -) to each position of the minor matrix. The signs for each position are:</div>
          <div style="text-align: center; margin: 1rem 0;">
            ${signMatrixHtml}
          </div>
          <div class="step-desc" style="margin-bottom: 0.75rem;">We multiply each minor determinant by its position sign:</div>
          <div style="font-family: 'IBM Plex Mono', monospace; font-size: 0.95rem; padding: 1rem; background: var(--bg); border: 1px solid var(--border); border-radius: 8px; margin-bottom: 1.25rem; color: var(--navy); line-height: 1.6;">
            ${multiplicationLines.join('<br>')}
          </div>
          <div class="step-desc" style="margin-bottom: 0.5rem;">This gives the cofactor matrix:</div>
          <div style="text-align: center; margin: 1rem 0;">
            ${matrixToHtml(cofactorMatrix)}
          </div>
        `
  });

  let adjointMatrix = transpose(cofactorMatrix);
  steps.push({
    title: "Transpose to Adjoint Matrix",
    content: `
          <div class="step-desc" style="margin-bottom: 0.5rem;">We swap the rows and columns of the cofactor matrix to get the adjoint matrix:</div>
          <div style="margin-bottom: 1rem; font-family: 'IBM Plex Mono', monospace; color: var(--navy); line-height: 1.5;">
            Row 1 becomes Column 1<br>
            Row 2 becomes Column 2<br>
            ${n === 3 ? 'Row 3 becomes Column 3<br>' : ''}
          </div>
          <div style="text-align: center; margin: 1rem 0;">
            ${matrixToHtml(adjointMatrix)}
          </div>
        `
  });

  return steps;
}

function generateInverseFormulaMethod(A) {
  let n = A.length;
  let det = getDeterminantPure(A);
  let steps = [];

  steps.push({
    title: "Starting Matrix",
    content: `
          <div class="step-desc" style="font-size: 1rem; color: var(--navy); margin-bottom: 0.5rem;">We start with the matrix:</div>
          <div style="text-align: center; margin: 1rem 0;">
            ${matrixToHtml(A)}
          </div>
        `
  });

  let detExplanation = "";
  if (n === 2) {
    let a = A[0][0];
    let b = A[0][1];
    let c_val = A[1][0];
    let d = A[1][1];
    detExplanation = `Determinant = (${formatValueSimple(a)} × ${formatValueSimple(d)}) - (${formatValueSimple(b)} × ${formatValueSimple(c_val)}) = ${formatValueSimple(a * d)} - ${formatValueSimple(b * c_val)} = ${formatValueSimple(det)}`;
  } else {
    let a = A[0][0], b = A[0][1], c = A[0][2];
    let sub0 = [[A[1][1], A[1][2]], [A[2][1], A[2][2]]];
    let sub1 = [[A[1][0], A[1][2]], [A[2][0], A[2][2]]];
    let sub2 = [[A[1][0], A[1][1]], [A[2][0], A[2][1]]];

    let det0 = sub0[0][0] * sub0[1][1] - sub0[0][1] * sub0[1][0];
    let det1 = sub1[0][0] * sub1[1][1] - sub1[0][1] * sub1[1][0];
    let det2 = sub2[0][0] * sub2[1][1] - sub2[0][1] * sub2[1][0];

    detExplanation = `
          We expand along the first row:
          <br><br>
          1. Multiply Row 1, Col 1 element (${formatValueSimple(a)}) by the determinant of its minor matrix:
          <br>
          Remove row 1 and column 1:
          <br>
          ${matrixToHtml(sub0)}
          <br>
          Minor determinant = (${formatValueSimple(sub0[0][0])} × ${formatValueSimple(sub0[1][1])}) - (${formatValueSimple(sub0[0][1])} × ${formatValueSimple(sub0[1][0])}) = ${formatValueSimple(det0)}
          <br>
          Product = ${formatValueSimple(a)} × ${formatValueSimple(det0)} = ${formatValueSimple(a * det0)}
          <br><br>
          2. Multiply Row 1, Col 2 element (${formatValueSimple(b)}) by the determinant of its minor matrix and apply a negative sign:
          <br>
          Remove row 1 and column 2:
          <br>
          ${matrixToHtml(sub1)}
          <br>
          Minor determinant = (${formatValueSimple(sub1[0][0])} × ${formatValueSimple(sub1[1][1])}) - (${formatValueSimple(sub1[0][1])} × ${formatValueSimple(sub1[1][0])}) = ${formatValueSimple(det1)}
          <br>
          Product = -(${formatValueSimple(b)}) × ${formatValueSimple(det1)} = ${formatValueSimple(-b * det1)}
          <br><br>
          3. Multiply Row 1, Col 3 element (${formatValueSimple(c)}) by the determinant of its minor matrix:
          <br>
          Remove row 1 and column 3:
          <br>
          ${matrixToHtml(sub2)}
          <br>
          Minor determinant = (${formatValueSimple(sub2[0][0])} × ${formatValueSimple(sub2[1][1])}) - (${formatValueSimple(sub2[0][1])} × ${formatValueSimple(sub2[1][0])}) = ${formatValueSimple(det2)}
          <br>
          Product = ${formatValueSimple(c)} × ${formatValueSimple(det2)} = ${formatValueSimple(c * det2)}
          <br><br>
          Add the products together:
          <br>
          ${formatValueSimple(a * det0)} + (${formatValueSimple(-b * det1)}) + (${formatValueSimple(c * det2)}) = ${formatValueSimple(det)}
        `;
  }

  steps.push({
    title: "Calculate Determinant",
    content: `
          <div class="step-desc" style="margin-bottom: 0.75rem;">We calculate the determinant of the starting matrix:</div>
          <div style="font-family: 'IBM Plex Mono', monospace; font-size: 0.95rem; padding: 1.25rem; background: var(--bg); border: 1px solid var(--border); border-radius: 12px; margin-bottom: 1rem; color: var(--navy); line-height: 1.6;">
            ${detExplanation}
          </div>
        `
  });

  if (Math.abs(det) < 1e-9) {
    steps.push({
      title: "Singular Matrix (Determinant is Zero)",
      content: `
            <div style="background: rgba(239, 68, 68, 0.08); border-left: 4px solid #ef4444; padding: 1.25rem; border-radius: 8px; margin: 1rem 0; box-sizing: border-box; color: #b91c1c;">
              <div style="font-weight: 700; margin-bottom: 0.5rem; font-size: 1.05rem;">⚠️ Singular Matrix Detected!</div>
              <div style="font-size: 0.95rem; line-height: 1.5; color: #991b1b;">
                Since the determinant is 0, this matrix is singular and does not have an inverse.
                Therefore, we cannot calculate the adjoint using the Inverse Method.
                <br><br>
                Please go back and select either the **Cofactor Method** or the **Minor &rarr; Cofactor Method** to solve this problem step-by-step.
              </div>
            </div>
          `
    });
    return steps;
  }

  let A_inv = inverseMatrix(A);
  steps.push({
    title: "Calculate Inverse Matrix",
    content: `
          <div class="step-desc" style="margin-bottom: 0.5rem;">We calculate the inverse matrix:</div>
          <div style="text-align: center; margin: 1rem 0;">
            ${matrixToHtml(A_inv)}
          </div>
        `
  });

  let cofactorMat = getCofactorMatrix(A);
  let adjointMatrix = transpose(cofactorMat);

  let multiplicationScaleLines = [];
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      let invVal = A_inv[i][j];
      let adjVal = adjointMatrix[i][j];
      multiplicationScaleLines.push(`Row ${i + 1}, Col ${j + 1}: ${formatValueSimple(det)} × ${formatValueSimple(invVal)} = ${formatValueSimple(adjVal)}`);
    }
  }

  steps.push({
    title: "Multiply Inverse Matrix by Determinant",
    content: `
          <div class="step-desc" style="margin-bottom: 0.75rem;">We multiply each element of the inverse matrix by the determinant value (${formatValueSimple(det)}) to get the adjoint matrix:</div>
          <div style="font-family: 'IBM Plex Mono', monospace; font-size: 0.95rem; padding: 1rem; background: var(--bg); border: 1px solid var(--border); border-radius: 8px; margin-bottom: 1.25rem; color: var(--navy); line-height: 1.6;">
            ${multiplicationScaleLines.join('<br>')}
          </div>
          <div class="step-desc" style="margin-bottom: 0.5rem;">This gives the final adjoint matrix:</div>
          <div style="text-align: center; margin: 1rem 0;">
            ${matrixToHtml(adjointMatrix)}
          </div>
        `
  });

  return steps;
}

function generateRowReductionMethod(A) {
  let n = A.length;
  let det = getDeterminantPure(A);
  let steps = [];

  steps.push({
    title: "Starting Matrix",
    content: `
          <div class="step-desc" style="font-size: 1rem; color: var(--navy); margin-bottom: 0.5rem;">We start with the matrix:</div>
          <div style="text-align: center; margin: 1rem 0;">
            ${matrixToHtml(A)}
          </div>
        `
  });

  let gj = solveGaussJordanInverseDetailed(A);
  if (!gj.inverse) {
    steps.push({
      title: "Singular Matrix (Cannot Find Inverse)",
      content: `
            <div style="background: rgba(239, 68, 68, 0.08); border-left: 4px solid #ef4444; padding: 1.25rem; border-radius: 8px; margin: 1rem 0; box-sizing: border-box; color: #b91c1c;">
              <div style="font-weight: 700; margin-bottom: 0.5rem; font-size: 1.05rem;">⚠️ Singular Matrix Detected!</div>
              <div style="font-size: 0.95rem; line-height: 1.5; color: #991b1b;">
                During row reduction, a zero was found on the diagonal that could not be eliminated.
                The determinant is 0, meaning the matrix is singular and does not have an inverse.
                <br><br>
                Please use the **Cofactor Method** to find the adjoint of this matrix instead.
              </div>
            </div>
          `
    });
    return steps;
  }

  let rowOpsHtml = gj.steps.map((s, idx) => `
        <div style="margin-bottom: 1.5rem; padding: 1.25rem; border: 1px solid var(--border); border-left: 4px solid var(--teal); background: var(--bg); border-radius: 12px; box-sizing: border-box;">
          <div style="font-weight: 700; color: var(--navy); margin-bottom: 0.5rem; font-size: 1.05rem;">Step ${idx + 1}: ${s.title}</div>
          <div style="font-size: 0.95rem; color: var(--muted); margin-bottom: 0.75rem;">${s.explanation}</div>
          ${s.mathDetail ? `
            <div style="font-family: 'IBM Plex Mono', monospace; font-size: 0.9rem; padding: 0.75rem; background: var(--white); border: 1px dashed var(--border); border-radius: 8px; margin-bottom: 1rem; color: var(--navy); line-height: 1.6;">
              ${s.mathDetail}
            </div>
          ` : ''}
          <div style="text-align: center;">
            ${s.matrixHtml}
          </div>
        </div>
      `).join('');

  steps.push({
    title: "Gauss-Jordan Row Operations",
    isCollapsed: false,
    content: `
          <div class="step-desc" style="margin-bottom: 1.25rem;">We perform elementary row operations on the combined matrix until the left half becomes the identity matrix:</div>
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            ${rowOpsHtml}
          </div>
        `
  });

  steps.push({
    title: "Extract the Inverse Matrix",
    content: `
          <div class="step-desc" style="margin-bottom: 0.5rem;">The left half of our combined matrix is now the identity matrix. The right half is the inverse matrix:</div>
          <div style="text-align: center; margin: 1rem 0;">
            ${matrixToHtml(gj.inverse)}
          </div>
        `
  });

  steps.push({
    title: "Calculate Determinant of Original Matrix",
    content: `
          <div class="step-desc" style="margin-bottom: 0.5rem;">We calculate the determinant of the starting matrix to scale the inverse matrix:</div>
          <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.05rem; padding-left: 1rem; border-left: 2px solid var(--teal); margin: 0.75rem 0; color: var(--navy); font-weight: 600;">
            Determinant = ${formatValueSimple(det)}
          </div>
        `
  });

  let calculationsScaleHtml = [];
  let cofactorMat = getCofactorMatrix(A);
  let adjointMatrix = transpose(cofactorMat);

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      let invVal = gj.inverse[i][j];
      let adjVal = adjointMatrix[i][j];
      calculationsScaleHtml.push(`Row ${i + 1}, Col ${j + 1}: ${formatValueSimple(det)} × ${formatValueSimple(invVal)} = ${formatValueSimple(adjVal)}`);
    }
  }

  steps.push({
    title: "Scale Inverse Matrix to find Adjoint",
    content: `
          <div class="step-desc" style="margin-bottom: 0.75rem;">We multiply each element of the inverse matrix by the determinant value (${formatValueSimple(det)}):</div>
          <div style="font-family: 'IBM Plex Mono', monospace; font-size: 0.95rem; padding: 1rem; background: var(--bg); border: 1px solid var(--border); border-radius: 8px; margin-bottom: 1.25rem; color: var(--navy); line-height: 1.6;">
            ${calculationsScaleHtml.join('<br>')}
          </div>
          <div class="step-desc" style="margin-bottom: 0.5rem;">This gives the final adjoint matrix:</div>
          <div style="text-align: center; margin: 1rem 0;">
            ${matrixToHtml(adjointMatrix)}
          </div>
        `
  });

  return steps;
}

// UI Rendering Logic & Router
function renderMethodSelectionUI() {
  return `
        <div class="method-selector-card card animate-fade-in" style="padding: 2rem; margin-bottom: 2rem; background: var(--bg); border: 1px solid var(--border); border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.02); box-sizing: border-box; width: 100%;">
          <h3 style="color: var(--navy); margin-bottom: 0.5rem; font-family: 'Fraunces', serif; font-size: 1.6rem; text-align: center;">
            Choose Solution Method
          </h3>
          <p style="color: var(--muted); text-align: center; font-size: 0.95rem; margin-bottom: 2rem;">
            Select one of the educational pathways below to view its complete step-by-step derivation.
          </p>
          
          <div class="method-cards-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem;">
            <!-- Card A -->
            <div class="method-card" style="padding: 1.5rem; border: 1px solid var(--border); border-radius: 12px; cursor: pointer; transition: all 0.25s ease; background: var(--white); box-shadow: 0 4px 6px rgba(0,0,0,0.02); box-sizing: border-box;" onclick="window.selectAdjointMethod('cofactor')" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 10px 20px rgba(0,0,0,0.05)'; this.style.borderColor='var(--amber)';" onmouseout="this.style.transform='none'; this.style.boxShadow='0 4px 6px rgba(0,0,0,0.02)'; this.style.borderColor='var(--border)';">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
                <span style="font-weight: 700; font-size: 1.15rem; color: var(--navy);">Cofactor Method</span>
                <span style="font-size: 0.7rem; font-weight: 700; text-transform: uppercase; padding: 2px 8px; border-radius: 99px; background: rgba(13, 148, 136, 0.1); color: var(--teal);">Textbook Standard</span>
              </div>
              <p style="font-size: 0.85rem; line-height: 1.5; color: var(--muted);">Expand each element individually using its minor submatrix and checkerboard sign factor, then transpose the cofactor matrix.</p>
            </div>

            <!-- Card B -->
            <div class="method-card" style="padding: 1.5rem; border: 1px solid var(--border); border-radius: 12px; cursor: pointer; transition: all 0.25s ease; background: var(--white); box-shadow: 0 4px 6px rgba(0,0,0,0.02); box-sizing: border-box;" onclick="window.selectAdjointMethod('minor-cofactor')" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 10px 20px rgba(0,0,0,0.05)'; this.style.borderColor='var(--amber)';" onmouseout="this.style.transform='none'; this.style.boxShadow='0 4px 6px rgba(0,0,0,0.02)'; this.style.borderColor='var(--border)';">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
                <span style="font-weight: 700; font-size: 1.15rem; color: var(--navy);">Minor → Cofactor Method</span>
                <span style="font-size: 0.7rem; font-weight: 700; text-transform: uppercase; padding: 2px 8px; border-radius: 99px; background: rgba(13, 148, 136, 0.1); color: var(--teal);">Matrix-Level</span>
              </div>
              <p style="font-size: 0.85rem; line-height: 1.5; color: var(--muted);">Compute the complete Minor Matrix first, apply the checkerboard sign overlay, and transpose the resulting Cofactor Matrix.</p>
            </div>

            <!-- Card C -->
            <div class="method-card" style="padding: 1.5rem; border: 1px solid var(--border); border-radius: 12px; cursor: pointer; transition: all 0.25s ease; background: var(--white); box-shadow: 0 4px 6px rgba(0,0,0,0.02); box-sizing: border-box;" onclick="window.selectAdjointMethod('inverse-formula')" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 10px 20px rgba(0,0,0,0.05)'; this.style.borderColor='var(--amber)';" onmouseout="this.style.transform='none'; this.style.boxShadow='0 4px 6px rgba(0,0,0,0.02)'; this.style.borderColor='var(--border)';">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
                <span style="font-weight: 700; font-size: 1.15rem; color: var(--navy);">Inverse Formula Method</span>
                <span style="font-size: 0.7rem; font-weight: 700; text-transform: uppercase; padding: 2px 8px; border-radius: 99px; background: rgba(13, 148, 136, 0.1); color: var(--teal);">Inverse Algebra</span>
              </div>
              <p style="font-size: 0.85rem; line-height: 1.5; color: var(--muted);">Calculate the matrix determinant and inverse, then reconstruct the Adjoint by multiplying the inverse by the determinant.</p>
            </div>

            <!-- Card D -->
            <div class="method-card" style="padding: 1.5rem; border: 1px solid var(--border); border-radius: 12px; cursor: pointer; transition: all 0.25s ease; background: var(--white); box-shadow: 0 4px 6px rgba(0,0,0,0.02); box-sizing: border-box;" onclick="window.selectAdjointMethod('row-reduction')" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 10px 20px rgba(0,0,0,0.05)'; this.style.borderColor='var(--amber)';" onmouseout="this.style.transform='none'; this.style.boxShadow='0 4px 6px rgba(0,0,0,0.02)'; this.style.borderColor='var(--border)';">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
                <span style="font-weight: 700; font-size: 1.15rem; color: var(--navy);">Row Reduction Method</span>
                <span style="font-size: 0.7rem; font-weight: 700; text-transform: uppercase; padding: 2px 8px; border-radius: 99px; background: rgba(13, 148, 136, 0.1); color: var(--teal);">Gauss-Jordan</span>
              </div>
              <p style="font-size: 0.85rem; line-height: 1.5; color: var(--muted);">Perform step-by-step Gauss-Jordan elimination on $[A | I]$ to find the inverse, and scale it by the determinant.</p>
            </div>
          </div>
        </div>
      `;
}

function calculateAdjointMatrix() {
  const output = document.getElementById('steps-output');
  if (!output) return;
  output.innerHTML = '';
  output.classList.add('active');

  let rows = currentMatrixRows;
  let cols = currentMatrixCols;

  if (rows !== cols) {
    output.innerHTML = `
          <div class="step-card" style="border-left-color: #dc2626;">
            <div class="step-header">
              <div class="step-title" style="color: #dc2626; font-size: 1.25rem;">Error: Non-Square Matrix</div>
            </div>
            <div class="step-desc" style="font-size: 1rem;">
              The Adjoint matrix is only defined for square matrices. The entered matrix size is <strong>${rows}x${cols}</strong>. Please ensure the number of Rows equals the number of Columns.
            </div>
          </div>
        `;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  let A = [];
  let hasEmpty = false;
  let hasInvalid = false;

  for (let i = 0; i < rows; i++) {
    let row = [];
    for (let j = 0; j < cols; j++) {
      let cellId = `m${i}${j}`;
      let cellEl = document.getElementById(cellId);
      if (!cellEl) continue;
      let valStr = cellEl.value.trim();
      if (valStr === '') hasEmpty = true;
      let val = parseFloat(valStr);
      if (isNaN(val) || !isFinite(val)) hasInvalid = true;
      row.push(val);
    }
    A.push(row);
  }

  if (hasEmpty || hasInvalid) {
    output.innerHTML = `
          <div class="step-card" style="border-left-color: #dc2626;">
            <div class="step-header">
              <div class="step-title" style="color: #dc2626; font-size: 1.25rem;">Error: Invalid Matrix Entries</div>
            </div>
            <div class="step-desc" style="font-size: 1rem;">
              Please ensure all cells in the matrix grid are filled with valid numeric values.
            </div>
          </div>
        `;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  window.adjointInputMatrix = A;
  output.innerHTML = renderMethodSelectionUI();

  output.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

window.selectAdjointMethod = function (methodId) {
  let A = window.adjointInputMatrix;
  if (!A) return;

  let stepsHtml = `
        <button class="btn-primary" style="background: var(--bg2); color: var(--navy); padding: 0.5rem 1rem; font-size: 0.9rem; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 6px; border: 1px solid var(--border);" onclick="window.backToMethodSelection()">
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="stroke: var(--navy);">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Method Selection
        </button>
      `;

  let methodSteps = [];
  let finalAdjoint = [];

  if (methodId === 'cofactor') {
    methodSteps = generateCofactorMethod(A);
  } else if (methodId === 'minor-cofactor') {
    methodSteps = generateMinorCofactorMethod(A);
  } else if (methodId === 'inverse-formula') {
    methodSteps = generateInverseFormulaMethod(A);
  } else if (methodId === 'row-reduction') {
    methodSteps = generateRowReductionMethod(A);
  }

  let stepCount = 1;
  methodSteps.forEach(step => {
    let collapseAttr = step.isCollapsed ? 'style="display: none;"' : '';
    let rotateAttr = step.isCollapsed ? 'style="transform: rotate(-90deg);"' : '';
    stepsHtml += `
          <div class="step-card">
            <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <div class="step-number">${stepCount++}</div>
                <div class="step-title">${step.title}</div>
              </div>
              <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);" ${rotateAttr}>▼</div>
            </div>
            <div class="step-content" ${collapseAttr}>
              ${step.content}
            </div>
          </div>
        `;
  });

  let cofactorMat = getCofactorMatrix(A);
  finalAdjoint = transpose(cofactorMat);

  stepsHtml += `
        <div class="final-result animate-fade-in" style="text-align: center; padding: 2.5rem; background: #111827; color: #ffffff; border-radius: 16px; border: 1px solid var(--border); box-shadow: 0 10px 30px rgba(0,0,0,0.15); margin-top: 2rem;">
          <div style="font-size: 1.8rem; font-weight: 700; color: var(--amber); margin-bottom: 0.5rem; font-family:'Fraunces', serif;">✅ Adjoint Matrix Successfully Calculated!</div>
          <div style="font-size: 1.05rem; opacity: 0.9; margin-bottom: 1.5rem;">The adjoint matrix is computed by transposing the cofactor matrix.</div>
          <div style="display:inline-block; text-align: left; padding: 1.5rem; background: rgba(255,255,255,0.06); border-radius: 12px; border: 1px solid rgba(255,255,255,0.12); min-width: 250px; box-sizing: border-box;">
            <div style="font-size:0.95rem; font-weight:600; color: rgba(255,255,255,0.7); border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; margin-bottom: 0.75rem;">Final Adjoint Matrix [Adj(A)]:</div>
            <div style="margin-top: 1rem; text-align: center; overflow-x: auto;">
              ${matrixToHtml(finalAdjoint)}
            </div>
          </div>
        </div>
      `;

  const output = document.getElementById('steps-output');
  output.innerHTML = stepsHtml;

  output.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

window.backToMethodSelection = function () {
  const output = document.getElementById('steps-output');
  output.innerHTML = renderMethodSelectionUI();
  output.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

// ==========================================
// EDUCATIONAL INVERSE MATRIX CALCULATOR ENGINE
// ==========================================

function calculateInverseMatrix() {
  const output = document.getElementById('steps-output');
  if (!output) return;
  output.innerHTML = '';
  output.classList.add('active');

  let rows = currentMatrixRows;
  let cols = currentMatrixCols;

  if (rows !== cols) {
    output.innerHTML = `
          <div class="step-card" style="border-left-color: #dc2626;">
            <div class="step-header">
              <div class="step-title" style="color: #dc2626; font-size: 1.25rem;">Error: Non-Square Matrix</div>
            </div>
            <div class="step-desc" style="font-size: 1rem;">
              The Inverse matrix is only defined for square matrices. The entered matrix size is <strong>${rows}x${cols}</strong>. Please ensure the number of Rows equals the number of Columns.
            </div>
          </div>
        `;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  let A = [];
  let hasEmpty = false;
  let hasInvalid = false;

  for (let i = 0; i < rows; i++) {
    let row = [];
    for (let j = 0; j < cols; j++) {
      let cellId = `m${i}${j}`;
      let cellEl = document.getElementById(cellId);
      if (!cellEl) continue;
      let valStr = cellEl.value.trim();
      if (valStr === '') hasEmpty = true;
      let val = parseFloat(valStr);
      if (isNaN(val) || !isFinite(val)) hasInvalid = true;
      row.push(val);
    }
    A.push(row);
  }

  if (hasEmpty || hasInvalid) {
    output.innerHTML = `
          <div class="step-card" style="border-left-color: #dc2626;">
            <div class="step-header">
              <div class="step-title" style="color: #dc2626; font-size: 1.25rem;">Error: Invalid Matrix Entries</div>
            </div>
            <div class="step-desc" style="font-size: 1rem;">
              Please ensure all cells in the matrix grid are filled with valid numeric values.
            </div>
          </div>
        `;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  window.inverseInputMatrix = A;
  output.innerHTML = renderInverseMethodSelectionUI();
  output.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderInverseMethodSelectionUI() {
  return `
        <div class="method-selector-card card animate-fade-in" style="padding: 2rem; margin-bottom: 2rem; background: var(--bg); border: 1px solid var(--border); border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.02); box-sizing: border-box; width: 100%;">
          <h3 style="color: var(--navy); margin-bottom: 0.5rem; font-family: 'Fraunces', serif; font-size: 1.6rem; text-align: center;">
            Choose Solution Method
          </h3>
          <p style="color: var(--muted); text-align: center; font-size: 0.95rem; margin-bottom: 2rem;">
            Select one of the educational pathways below to view its complete step-by-step inverse derivation.
          </p>
          
          <div class="method-cards-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem;">
            <!-- Card A -->
            <div class="method-card" style="padding: 1.5rem; border: 1px solid var(--border); border-radius: 12px; cursor: pointer; transition: all 0.25s ease; background: var(--white); box-shadow: 0 4px 6px rgba(0,0,0,0.02); box-sizing: border-box;" onclick="window.selectInverseMethod('adjoint')" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 10px 20px rgba(0,0,0,0.05)'; this.style.borderColor='var(--amber)';" onmouseout="this.style.transform='none'; this.style.boxShadow='0 4px 6px rgba(0,0,0,0.02)'; this.style.borderColor='var(--border)';">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
                <span style="font-weight: 700; font-size: 1.15rem; color: var(--navy);">Adjoint Method</span>
                <span style="font-size: 0.7rem; font-weight: 700; text-transform: uppercase; padding: 2px 8px; border-radius: 99px; background: rgba(13, 148, 136, 0.1); color: var(--teal);">Formula Based</span>
              </div>
              <p style="font-size: 0.85rem; line-height: 1.5; color: var(--muted);">Solve using A⁻¹ = Adj(A) / det(A). Calculates determinant, all minors, cofactors, cofactor matrix transpose, and individual division.</p>
            </div>

            <!-- Card B -->
            <div class="method-card" style="padding: 1.5rem; border: 1px solid var(--border); border-radius: 12px; cursor: pointer; transition: all 0.25s ease; background: var(--white); box-shadow: 0 4px 6px rgba(0,0,0,0.02); box-sizing: border-box;" onclick="window.selectInverseMethod('gauss-jordan')" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 10px 20px rgba(0,0,0,0.05)'; this.style.borderColor='var(--amber)';" onmouseout="this.style.transform='none'; this.style.boxShadow='0 4px 6px rgba(0,0,0,0.02)'; this.style.borderColor='var(--border)';">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
                <span style="font-weight: 700; font-size: 1.15rem; color: var(--navy);">Gauss-Jordan Method</span>
                <span style="font-size: 0.7rem; font-weight: 700; text-transform: uppercase; padding: 2px 8px; border-radius: 99px; background: rgba(13, 148, 136, 0.1); color: var(--teal);">Augmented Matrix</span>
              </div>
              <p style="font-size: 0.85rem; line-height: 1.5; color: var(--muted);">Transform the augmented block matrix [A | I] into [I | A⁻¹] step-by-step using elementary row operations with detailed column math.</p>
            </div>

            <!-- Card C -->
            <div class="method-card" style="padding: 1.5rem; border: 1px solid var(--border); border-radius: 12px; cursor: pointer; transition: all 0.25s ease; background: var(--white); box-shadow: 0 4px 6px rgba(0,0,0,0.02); box-sizing: border-box;" onclick="window.selectInverseMethod('ert')" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 10px 20px rgba(0,0,0,0.05)'; this.style.borderColor='var(--amber)';" onmouseout="this.style.transform='none'; this.style.boxShadow='0 4px 6px rgba(0,0,0,0.02)'; this.style.borderColor='var(--border)';">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
                <span style="font-weight: 700; font-size: 1.15rem; color: var(--navy);">Elementary Row Transformation</span>
                <span style="font-size: 0.7rem; font-weight: 700; text-transform: uppercase; padding: 2px 8px; border-radius: 99px; background: rgba(13, 148, 136, 0.1); color: var(--teal);">Equation A = I A</span>
              </div>
              <p style="font-size: 0.85rem; line-height: 1.5; color: var(--muted);">Solve using A = I A equation model. Applies row operations simultaneously on LHS and RHS blocks to yield I = A⁻¹ A on paper.</p>
            </div>

            <!-- Card D -->
            <div class="method-card" style="padding: 1.5rem; border: 1px solid var(--border); border-radius: 12px; cursor: pointer; transition: all 0.25s ease; background: var(--white); box-shadow: 0 4px 6px rgba(0,0,0,0.02); box-sizing: border-box;" onclick="window.selectInverseMethod('show-all')" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 10px 20px rgba(0,0,0,0.05)'; this.style.borderColor='var(--amber)';" onmouseout="this.style.transform='none'; this.style.boxShadow='0 4px 6px rgba(0,0,0,0.02)'; this.style.borderColor='var(--border)';">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
                <span style="font-weight: 700; font-size: 1.15rem; color: var(--navy);">Show All Methods</span>
                <span style="font-size: 0.7rem; font-weight: 700; text-transform: uppercase; padding: 2px 8px; border-radius: 99px; background: rgba(13, 148, 136, 0.1); color: var(--teal);">Complete Reference</span>
              </div>
              <p style="font-size: 0.85rem; line-height: 1.5; color: var(--muted);">Compare all methods (Adjoint, Gauss-Jordan, and ERT) sequentially for the ultimate comprehensive study reference.</p>
            </div>
          </div>
        </div>
      `;
}

window.selectInverseMethod = function (methodId) {
  let A = window.inverseInputMatrix;
  if (!A) return;

  let stepsHtml = `
        <button class="btn-primary" style="background: var(--bg2); color: var(--navy); padding: 0.5rem 1rem; font-size: 0.9rem; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 6px; border: 1px solid var(--border);" onclick="window.backToInverseMethodSelection()">
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="stroke: var(--navy);">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Method Selection
        </button>
      `;

  if (methodId === 'show-all') {
    stepsHtml += `
          <h2 style="font-family: 'Fraunces', serif; color: var(--navy); margin-top: 1rem; margin-bottom: 1.5rem; text-align: center; border-bottom: 2px solid var(--amber); padding-bottom: 0.5rem; font-size: 1.5rem;">Pathway 1: Adjoint Method</h2>
        `;
    stepsHtml += renderMethodSteps(generateInverseAdjointMethod(A));

    stepsHtml += `
          <h2 style="font-family: 'Fraunces', serif; color: var(--navy); margin-top: 3rem; margin-bottom: 1.5rem; text-align: center; border-bottom: 2px solid var(--amber); padding-bottom: 0.5rem; font-size: 1.5rem;">Pathway 2: Gauss-Jordan Method</h2>
        `;
    stepsHtml += renderMethodSteps(generateInverseGaussJordanMethod(A));

    stepsHtml += `
          <h2 style="font-family: 'Fraunces', serif; color: var(--navy); margin-top: 3rem; margin-bottom: 1.5rem; text-align: center; border-bottom: 2px solid var(--amber); padding-bottom: 0.5rem; font-size: 1.5rem;">Pathway 3: Elementary Row Transformation (ERT)</h2>
        `;
    stepsHtml += renderMethodSteps(generateInverseERTMethod(A));
  } else {
    let methodSteps = [];
    if (methodId === 'adjoint') {
      methodSteps = generateInverseAdjointMethod(A);
    } else if (methodId === 'gauss-jordan') {
      methodSteps = generateInverseGaussJordanMethod(A);
    } else if (methodId === 'ert') {
      methodSteps = generateInverseERTMethod(A);
    }
    stepsHtml += renderMethodSteps(methodSteps);
  }

  const output = document.getElementById('steps-output');
  output.innerHTML = stepsHtml;
  output.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

window.backToInverseMethodSelection = function () {
  const output = document.getElementById('steps-output');
  output.innerHTML = renderInverseMethodSelectionUI();
  output.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

function renderMethodSteps(methodSteps) {
  let stepsHtml = "";
  let stepCount = 1;
  methodSteps.forEach(step => {
    let collapseAttr = step.isCollapsed ? 'style="display: none;"' : '';
    let rotateAttr = step.isCollapsed ? 'style="transform: rotate(-90deg);"' : '';
    stepsHtml += `
          <div class="step-card">
            <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <div class="step-number">${stepCount++}</div>
                <div class="step-title">${step.title}</div>
              </div>
              <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);" ${rotateAttr}>▼</div>
            </div>
            <div class="step-content" ${collapseAttr}>
              ${step.content}
            </div>
          </div>
        `;
  });
  return stepsHtml;
}

function generateInverseAdjointMethod(A) {
  let n = A.length;
  let steps = [];

  steps.push({
    title: "Starting Matrix A",
    content: `
          <div class="step-desc" style="font-size: 1rem; color: var(--navy); margin-bottom: 0.5rem;">We start with the given matrix:</div>
          <div style="text-align: center; margin: 1rem 0;">
            ${matrixToHtml(A)}
          </div>
        `
  });

  // Calculate Determinant with explanation
  let det = getDeterminantPure(A);
  let detExplanation = "";
  if (n === 2) {
    let a = A[0][0];
    let b = A[0][1];
    let c = A[1][0];
    let d = A[1][1];
    detExplanation = `Determinant = (${formatValueSimple(a)} × ${formatValueSimple(d)}) - (${formatValueSimple(b)} × ${formatValueSimple(c)}) = ${formatValueSimple(a * d)} - ${formatValueSimple(b * c)} = ${formatValueSimple(det)}`;
  } else {
    let a = A[0][0], b = A[0][1], c = A[0][2];
    let sub0 = [[A[1][1], A[1][2]], [A[2][1], A[2][2]]];
    let sub1 = [[A[1][0], A[1][2]], [A[2][0], A[2][2]]];
    let sub2 = [[A[1][0], A[1][1]], [A[2][0], A[2][1]]];

    let det0 = sub0[0][0] * sub0[1][1] - sub0[0][1] * sub0[1][0];
    let det1 = sub1[0][0] * sub1[1][1] - sub1[0][1] * sub1[1][0];
    let det2 = sub2[0][0] * sub2[1][1] - sub2[0][1] * sub2[1][0];

    detExplanation = `
          We expand along the first row:
          <br><br>
          1. Multiply Row 1, Col 1 element (${formatValueSimple(a)}) by the determinant of its minor matrix:
          <br>
          Remove row 1 and column 1:
          <br>
          ${matrixToHtml(sub0)}
          <br>
          Minor determinant = (${formatValueSimple(sub0[0][0])} × ${formatValueSimple(sub0[1][1])}) - (${formatValueSimple(sub0[0][1])} × ${formatValueSimple(sub0[1][0])}) = ${formatValueSimple(det0)}
          <br>
          Product = ${formatValueSimple(a)} × ${formatValueSimple(det0)} = ${formatValueSimple(a * det0)}
          <br><br>
          2. Multiply Row 1, Col 2 element (${formatValueSimple(b)}) by the determinant of its minor matrix and apply a negative sign:
          <br>
          Remove row 1 and column 2:
          <br>
          ${matrixToHtml(sub1)}
          <br>
          Minor determinant = (${formatValueSimple(sub1[0][0])} × ${formatValueSimple(sub1[1][1])}) - (${formatValueSimple(sub1[0][1])} × ${formatValueSimple(sub1[1][0])}) = ${formatValueSimple(det1)}
          <br>
          Product = -(${formatValueSimple(b)}) × ${formatValueSimple(det1)} = ${formatValueSimple(-b * det1)}
          <br><br>
          3. Multiply Row 1, Col 3 element (${formatValueSimple(c)}) by the determinant of its minor matrix:
          <br>
          Remove row 1 and column 3:
          <br>
          ${matrixToHtml(sub2)}
          <br>
          Minor determinant = (${formatValueSimple(sub2[0][0])} × ${formatValueSimple(sub2[1][1])}) - (${formatValueSimple(sub2[0][1])} × ${formatValueSimple(sub2[1][0])}) = ${formatValueSimple(det2)}
          <br>
          Product = ${formatValueSimple(c)} × ${formatValueSimple(det2)} = ${formatValueSimple(c * det2)}
          <br><br>
          Add the products together:
          <br>
          ${formatValueSimple(a * det0)} + (${formatValueSimple(-b * det1)}) + (${formatValueSimple(c * det2)}) = ${formatValueSimple(det)}
        `;
  }

  steps.push({
    title: `Calculate Determinant [det(A) = ${formatValueSimple(det)}]`,
    content: `
          <div class="step-desc" style="margin-bottom: 0.75rem;">We calculate the determinant of the starting matrix to verify if it is invertible:</div>
          <div style="font-family: 'IBM Plex Mono', monospace; font-size: 0.95rem; padding: 1.25rem; background: var(--bg); border: 1px solid var(--border); border-radius: 12px; margin-bottom: 1rem; color: var(--navy); line-height: 1.6;">
            ${detExplanation}
          </div>
        `
  });

  if (Math.abs(det) < 1e-9) {
    steps.push({
      title: "Inverse Does Not Exist",
      content: `
            <div style="background: rgba(239, 68, 68, 0.08); border-left: 4px solid #ef4444; padding: 1.25rem; border-radius: 8px; margin: 1rem 0; box-sizing: border-box; color: #b91c1c;">
              <div style="font-weight: 700; margin-bottom: 0.5rem; font-size: 1.05rem;">⚠️ Singular Matrix Detected!</div>
              <div style="font-size: 0.95rem; line-height: 1.5; color: #991b1b;">
                Inverse does not exist because determinant is zero (det(A) = 0).
                A singular matrix cannot be inverted since dividing by the determinant would require division by zero.
              </div>
            </div>
          `
    });
    return steps;
  }

  // Calculate Adjoint Matrix using the worked cofactor logic
  let cofactorMatrix = [];
  let cofactorCalculationsHtml = "";

  for (let i = 0; i < n; i++) {
    let cofactorRow = [];
    for (let j = 0; j < n; j++) {
      let minorMat = getMinorMatrixPure(A, i, j);
      let detVal;
      let detExplanation = "";

      if (n === 2) {
        detVal = minorMat[0][0];
        detExplanation = `${formatValueSimple(detVal)}`;
      } else {
        let a = minorMat[0][0];
        let b = minorMat[0][1];
        let c_val = minorMat[1][0];
        let d = minorMat[1][1];
        detVal = a * d - b * c_val;
        let p1 = a * d;
        let p2 = b * c_val;
        detExplanation = `(${formatValueSimple(a)} × ${formatValueSimple(d)}) - (${formatValueSimple(b)} × ${formatValueSimple(c_val)})<br>= ${formatValueSimple(p1)} - ${formatValueSimple(p2)}<br>= ${formatValueSimple(detVal)}`;
      }

      let signFactor = ((i + j) % 2 === 0) ? 1 : -1;
      let signChar = signFactor > 0 ? "+" : "-";
      let cofactorVal = signFactor * detVal;
      let formattedCofactor = (cofactorVal >= 0 && signFactor > 0) ? `+${formatValueSimple(cofactorVal)}` : `${formatValueSimple(cofactorVal)}`;
      if (cofactorVal === 0) formattedCofactor = "0";

      cofactorRow.push(cofactorVal);

      cofactorCalculationsHtml += `
            <div style="padding: 1.25rem; border: 1px solid var(--border); border-radius: 12px; background: var(--bg); margin-bottom: 1.5rem; font-family: 'IBM Plex Mono', monospace; line-height: 1.6; color: var(--navy); box-sizing: border-box;">
              <div style="font-weight: 700; border-bottom: 1px dashed var(--border); padding-bottom: 0.5rem; margin-bottom: 0.75rem; font-size: 1.1rem; color: var(--amber);">
                C${i + 1}${j + 1}:
              </div>
              <div>Remove row ${i + 1} and column ${j + 1}</div>
              <div style="text-align: center; margin: 0.5rem 0;">
                ${matrixToHtml(minorMat)}
              </div>
              <div style="margin-top: 0.75rem; font-weight: 600;">Determinant:</div>
              <div style="padding-left: 1rem; border-left: 2px solid var(--teal); margin: 0.5rem 0;">
                ${detExplanation}
              </div>
              <div style="margin-top: 0.75rem; font-weight: 600;">Sign:</div>
              <div style="padding-left: 1rem; border-left: 2px solid var(--teal); margin: 0.5rem 0;">
                (-1)<sup>(${i + 1}+${j + 1})</sup> = ${signChar}
              </div>
              <div style="margin-top: 0.75rem; font-weight: 700; color: var(--teal);">Therefore:</div>
              <div style="padding-left: 1rem; font-weight: 700; font-size: 1.05rem; color: var(--amber);">
                C${i + 1}${j + 1} = ${formattedCofactor}
              </div>
            </div>
          `;
    }
    cofactorMatrix.push(cofactorRow);
  }

  steps.push({
    title: "Calculate Every Cofactor",
    content: `
          <div class="step-desc" style="margin-bottom: 1rem;">We calculate the cofactor value for each position step-by-step:</div>
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            ${cofactorCalculationsHtml}
          </div>
        `
  });

  steps.push({
    title: "Assemble Cofactor Matrix [Cof(A)]",
    content: `
          <div class="step-desc" style="margin-bottom: 0.5rem;">We place all calculated cofactor values into their corresponding positions:</div>
          <div style="text-align: center; margin: 1rem 0;">
            ${matrixToHtml(cofactorMatrix)}
          </div>
        `
  });

  let adjointMatrix = transpose(cofactorMatrix);
  steps.push({
    title: "Transpose Cofactor Matrix to get Adjoint [Adj(A)]",
    content: `
          <div class="step-desc" style="margin-bottom: 0.5rem;">We swap the rows and columns of the cofactor matrix to find the adjoint matrix:</div>
          <div style="margin-bottom: 1rem; font-family: 'IBM Plex Mono', monospace; color: var(--navy); line-height: 1.5;">
            Row 1 becomes Column 1<br>
            Row 2 becomes Column 2<br>
            ${n === 3 ? 'Row 3 becomes Column 3<br>' : ''}
          </div>
          <div style="text-align: center; margin: 1rem 0;">
            ${matrixToHtml(adjointMatrix)}
          </div>
        `
  });

  // Apply inverse formula division
  let inverseResult = [];
  let divisionLinesHtml = [];
  for (let i = 0; i < n; i++) {
    let invRow = [];
    for (let j = 0; j < n; j++) {
      let adjVal = adjointMatrix[i][j];
      let invVal = adjVal / det;
      invRow.push(invVal);

      // Detail formatting
      let scaleExp = `${formatValueSimple(adjVal)} / ${formatValueSimple(det)}`;
      let simplified = formatValueSimple(invVal);
      if (scaleExp !== simplified) {
        divisionLinesHtml.push(`Row ${i + 1}, Col ${j + 1}: ${scaleExp} = <strong>${simplified}</strong> (≈ ${Number(invVal.toFixed(3))})`);
      } else {
        divisionLinesHtml.push(`Row ${i + 1}, Col ${j + 1}: ${scaleExp} = <strong>${simplified}</strong>`);
      }
    }
    inverseResult.push(invRow);
  }

  steps.push({
    title: "Apply Inverse Formula [A⁻¹ = Adj(A) / det(A)]",
    content: `
          <div class="step-desc" style="margin-bottom: 0.75rem;">We divide each element of the Adjoint Matrix by the determinant value (det = ${formatValueSimple(det)}):</div>
          <div style="font-family: 'IBM Plex Mono', monospace; font-size: 0.95rem; padding: 1.25rem; background: var(--bg); border: 1px solid var(--border); border-radius: 12px; margin-bottom: 1rem; color: var(--navy); line-height: 1.8;">
            ${divisionLinesHtml.join('<br>')}
          </div>
        `
  });

  steps.push({
    title: "Final Inverse Matrix [A⁻¹]",
    content: `
          <div class="step-desc" style="margin-bottom: 0.5rem;">Below is the final computed inverse matrix:</div>
          <div style="text-align: center; margin: 1rem 0;">
            ${matrixToHtml(inverseResult)}
          </div>
          <div style="background: rgba(13, 148, 136, 0.05); border-left: 4px solid var(--teal); padding: 1rem; border-radius: 8px; margin-top: 1rem; font-size: 0.95rem; line-height: 1.5; color: var(--navy);">
            <strong>Verification Note:</strong> You can verify this result by multiplying the starting matrix A by the computed inverse A⁻¹. The product should equal the Identity Matrix (A × A⁻¹ = I).
          </div>
        `
  });

  return steps;
}

function generateInverseGaussJordanMethod(A) {
  let n = A.length;
  let steps = [];

  steps.push({
    title: "Starting Matrix A",
    content: `
          <div class="step-desc" style="font-size: 1rem; color: var(--navy); margin-bottom: 0.5rem;">We start with the given matrix:</div>
          <div style="text-align: center; margin: 1rem 0;">
            ${matrixToHtml(A)}
          </div>
        `
  });

  // Construct augmented matrix [A | I]
  let M = [];
  for (let i = 0; i < n; i++) {
    let row = [];
    for (let j = 0; j < n; j++) row.push(A[i][j]);
    for (let j = 0; j < n; j++) row.push(i === j ? 1 : 0);
    M.push(row);
  }

  function getAugmentedState() {
    let A_state = M.map(r => r.slice(0, n));
    let I_state = M.map(r => r.slice(n));
    return augmentedMatrixToHtml(A_state, I_state);
  }

  steps.push({
    title: "Construct Augmented Matrix [A | I]",
    content: `
          <div class="step-desc" style="margin-bottom: 0.75rem;">We combine the original matrix A on the left with the Identity matrix I on the right:</div>
          <div style="text-align: center; margin: 1rem 0;">
            ${getAugmentedState()}
          </div>
        `
  });

  for (let p = 0; p < n; p++) {
    // Check pivot
    if (Math.abs(M[p][p]) < 1e-9) {
      let swapRow = -1;
      for (let i = p + 1; i < n; i++) {
        if (Math.abs(M[i][p]) > 1e-9) {
          swapRow = i;
          break;
        }
      }
      if (swapRow === -1) {
        steps.push({
          title: "Singular Matrix (Cannot Find Inverse)",
          content: `
                <div style="background: rgba(239, 68, 68, 0.08); border-left: 4px solid #ef4444; padding: 1.25rem; border-radius: 8px; margin: 1rem 0; box-sizing: border-box; color: #b91c1c;">
                  <div style="font-weight: 700; margin-bottom: 0.5rem; font-size: 1.05rem;">⚠️ Singular Matrix Detected!</div>
                  <div style="font-size: 0.95rem; line-height: 1.5; color: #991b1b;">
                    During row reduction, a zero was found at pivot position Row ${p + 1}, Col ${p + 1} which cannot be eliminated by swapping.
                    The determinant of the matrix is 0, meaning it is singular and does not have an inverse.
                  </div>
                </div>
              `
        });
        return steps;
      }

      // Swap row p and swapRow
      let temp = M[p];
      M[p] = M[swapRow];
      M[swapRow] = temp;

      steps.push({
        title: `Swap Row ${p + 1} and Row ${swapRow + 1}`,
        content: `
              <div class="step-desc" style="margin-bottom: 0.75rem;">Swap Row ${p + 1} and Row ${swapRow + 1} to get a non-zero element at the diagonal pivot position:</div>
              <div style="font-family: 'IBM Plex Mono', monospace; font-size: 0.9rem; padding: 0.75rem; background: var(--bg); border: 1px dashed var(--border); border-radius: 8px; margin-bottom: 1rem; color: var(--navy);">
                R<sub>${p + 1}</sub> &harr; R<sub>${swapRow + 1}</sub>
              </div>
              <div style="text-align: center;">
                ${getAugmentedState()}
              </div>
            `
      });
    }

    // Scale pivot row to make the diagonal element 1
    let pivot = M[p][p];
    if (Math.abs(pivot - 1) > 1e-9) {
      let originalRow = [...M[p]];
      let mathLines = [];
      for (let j = 0; j < 2 * n; j++) {
        M[p][j] /= pivot;
        mathLines.push(`Col ${j + 1}: ${formatValueSimple(originalRow[j])} / ${formatValueSimple(pivot)} = <strong>${formatValueSimple(M[p][j])}</strong>`);
      }
      steps.push({
        title: `Scale Row ${p + 1} [R${p + 1} &rarr; R${p + 1} / ${formatValueSimple(pivot)}]`,
        content: `
              <div class="step-desc" style="margin-bottom: 0.75rem;">Divide all elements of Row ${p + 1} by the pivot value ${formatValueSimple(pivot)} to make the diagonal element 1:</div>
              <div style="font-family: 'IBM Plex Mono', monospace; font-size: 0.9rem; padding: 0.75rem; background: var(--bg); border: 1px dashed var(--border); border-radius: 8px; margin-bottom: 1rem; color: var(--navy); line-height: 1.6;">
                ${mathLines.join('<br>')}
              </div>
              <div style="text-align: center;">
                ${getAugmentedState()}
              </div>
            `
      });
    }

    // Eliminate other elements in column p
    for (let i = 0; i < n; i++) {
      if (i === p) continue;
      let factor = M[i][p];
      if (Math.abs(factor) > 1e-9) {
        let originalRowI = [...M[i]];
        let rowP = [...M[p]];
        let mathLines = [];
        for (let j = 0; j < 2 * n; j++) {
          M[i][j] -= factor * M[p][j];
          let product = factor * rowP[j];
          mathLines.push(`Col ${j + 1}: ${formatValueSimple(originalRowI[j])} - (${formatValueSimple(factor)} × ${formatValueSimple(rowP[j])}) = ${formatValueSimple(originalRowI[j])} - ${formatValueSimple(product)} = <strong>${formatValueSimple(M[i][j])}</strong>`);
        }

        let opSign = factor < 0 ? "+" : "-";
        let factorText = Math.abs(factor) === 1 ? "" : ` ${formatValueSimple(Math.abs(factor))}`;
        steps.push({
          title: `Eliminate element in Row ${i + 1}, Column ${p + 1} [R${i + 1} &rarr; R${i + 1} ${opSign}${factorText}R${p + 1}]`,
          content: `
                <div class="step-desc" style="margin-bottom: 0.75rem;">Subtract ${formatValueSimple(factor)} times Row ${p + 1} from Row ${i + 1} to create a zero at Column ${p + 1}:</div>
                <div style="font-family: 'IBM Plex Mono', monospace; font-size: 0.9rem; padding: 0.75rem; background: var(--bg); border: 1px dashed var(--border); border-radius: 8px; margin-bottom: 1rem; color: var(--navy); line-height: 1.6;">
                  ${mathLines.join('<br>')}
                </div>
                <div style="text-align: center;">
                  ${getAugmentedState()}
                </div>
              `
        });
      }
    }
  }

  // Extract inverse
  let inverseResult = [];
  for (let i = 0; i < n; i++) {
    inverseResult.push(M[i].slice(n));
  }

  steps.push({
    title: "Extract the Inverse Matrix [A⁻¹]",
    content: `
          <div class="step-desc" style="margin-bottom: 0.5rem;">The left half of the augmented matrix is now the identity matrix I. The right half is the final computed inverse matrix A⁻¹:</div>
          <div style="text-align: center; margin: 1rem 0;">
            ${matrixToHtml(inverseResult)}
          </div>
        `
  });

  return steps;
}

function generateInverseERTMethod(A) {
  let n = A.length;
  let steps = [];

  steps.push({
    title: "Starting Matrix A",
    content: `
          <div class="step-desc" style="font-size: 1rem; color: var(--navy); margin-bottom: 0.5rem;">We start with the given matrix:</div>
          <div style="text-align: center; margin: 1rem 0;">
            ${matrixToHtml(A)}
          </div>
        `
  });

  let LHS = A.map(row => [...row]);
  let RHS = identityMatrix(n);

  function getEquationState() {
    return `
          <div style="display: flex; align-items: center; justify-content: center; gap: 0.6rem; flex-wrap: wrap; margin: 1.25rem 0;">
            ${matrixToHtml(LHS)}
            <span style="font-size: 1.5rem; font-weight: 700; color: var(--navy);">=</span>
            ${matrixToHtml(RHS)}
            <span style="font-size: 1.3rem; font-weight: 700; color: var(--amber); font-family: 'Fraunces', serif; margin-left: 0.25rem;">A</span>
          </div>
        `;
  }

  steps.push({
    title: "Formulate Matrix Equation [A = I A]",
    content: `
          <div class="step-desc" style="margin-bottom: 0.75rem;">We set up the elementary row transformation equation <strong>A = I A</strong>, substituting the matrices on the left and right:</div>
          ${getEquationState()}
          <div class="step-desc" style="margin-top: 0.5rem; font-size: 0.9rem; color: var(--muted);">We will now apply elementary row operations to the LHS matrix and the first RHS matrix simultaneously, until the LHS matrix is transformed into the Identity Matrix.</div>
        `
  });

  for (let p = 0; p < n; p++) {
    // Check pivot
    if (Math.abs(LHS[p][p]) < 1e-9) {
      let swapRow = -1;
      for (let i = p + 1; i < n; i++) {
        if (Math.abs(LHS[i][p]) > 1e-9) {
          swapRow = i;
          break;
        }
      }
      if (swapRow === -1) {
        steps.push({
          title: "Singular Matrix (Cannot Find Inverse)",
          content: `
                <div style="background: rgba(239, 68, 68, 0.08); border-left: 4px solid #ef4444; padding: 1.25rem; border-radius: 8px; margin: 1rem 0; box-sizing: border-box; color: #b91c1c;">
                  <div style="font-weight: 700; margin-bottom: 0.5rem; font-size: 1.05rem;">⚠️ Singular Matrix Detected!</div>
                  <div style="font-size: 0.95rem; line-height: 1.5; color: #991b1b;">
                    During row reduction, a zero was found at diagonal position Row ${p + 1}, Col ${p + 1} which cannot be eliminated by swapping.
                    The determinant of the matrix is 0, meaning it is singular and does not have an inverse.
                  </div>
                </div>
              `
        });
        return steps;
      }

      // Swap rows
      let tempL = LHS[p]; LHS[p] = LHS[swapRow]; LHS[swapRow] = tempL;
      let tempR = RHS[p]; RHS[p] = RHS[swapRow]; RHS[swapRow] = tempR;

      steps.push({
        title: `Swap Row ${p + 1} and Row ${swapRow + 1}`,
        content: `
              <div class="step-desc" style="margin-bottom: 0.75rem;">Swap Row ${p + 1} and Row ${swapRow + 1} on both sides of the equation to eliminate the diagonal zero:</div>
              <div style="font-family: 'IBM Plex Mono', monospace; font-size: 0.9rem; padding: 0.75rem; background: var(--bg); border: 1px dashed var(--border); border-radius: 8px; margin-bottom: 1rem; color: var(--navy);">
                R<sub>${p + 1}</sub> &harr; R<sub>${swapRow + 1}</sub>
              </div>
              <div style="text-align: center;">
                ${getEquationState()}
              </div>
            `
      });
    }

    // Scale pivot row
    let pivot = LHS[p][p];
    if (Math.abs(pivot - 1) > 1e-9) {
      let origL = [...LHS[p]];
      let origR = [...RHS[p]];
      let mathLinesL = [];
      let mathLinesR = [];

      for (let j = 0; j < n; j++) {
        LHS[p][j] /= pivot;
        mathLinesL.push(`Col ${j + 1}: ${formatValueSimple(origL[j])} / ${formatValueSimple(pivot)} = <strong>${formatValueSimple(LHS[p][j])}</strong>`);
      }
      for (let j = 0; j < n; j++) {
        RHS[p][j] /= pivot;
        mathLinesR.push(`Col ${j + 1}: ${formatValueSimple(origR[j])} / ${formatValueSimple(pivot)} = <strong>${formatValueSimple(RHS[p][j])}</strong>`);
      }

      steps.push({
        title: `Scale Row ${p + 1} [R${p + 1} &rarr; R${p + 1} / ${formatValueSimple(pivot)}]`,
        content: `
              <div class="step-desc" style="margin-bottom: 0.75rem;">Divide Row ${p + 1} on both sides of the equation by the pivot value ${formatValueSimple(pivot)}:</div>
              
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.25rem;">
                <div style="padding: 0.75rem; background: var(--bg); border: 1px dashed var(--border); border-radius: 8px; box-sizing: border-box;">
                  <div style="font-weight: 700; color: var(--teal); margin-bottom: 0.4rem; font-size: 0.85rem;">Left-Hand Side (A):</div>
                  <div style="font-family: 'IBM Plex Mono', monospace; font-size: 0.85rem; line-height: 1.5; color: var(--navy);">${mathLinesL.join('<br>')}</div>
                </div>
                <div style="padding: 0.75rem; background: var(--bg); border: 1px dashed var(--border); border-radius: 8px; box-sizing: border-box;">
                  <div style="font-weight: 700; color: var(--amber); margin-bottom: 0.4rem; font-size: 0.85rem;">Right-Hand Side (I):</div>
                  <div style="font-family: 'IBM Plex Mono', monospace; font-size: 0.85rem; line-height: 1.5; color: var(--navy);">${mathLinesR.join('<br>')}</div>
                </div>
              </div>

              <div style="text-align: center;">
                ${getEquationState()}
              </div>
            `
      });
    }

    // Eliminate other rows in col p
    for (let i = 0; i < n; i++) {
      if (i === p) continue;
      let factor = LHS[i][p];
      if (Math.abs(factor) > 1e-9) {
        let origL = [...LHS[i]];
        let origR = [...RHS[i]];
        let rowP_L = [...LHS[p]];
        let rowP_R = [...RHS[p]];

        let mathLinesL = [];
        let mathLinesR = [];

        for (let j = 0; j < n; j++) {
          LHS[i][j] -= factor * LHS[p][j];
          let product = factor * rowP_L[j];
          mathLinesL.push(`Col ${j + 1}: ${formatValueSimple(origL[j])} - (${formatValueSimple(factor)} × ${formatValueSimple(rowP_L[j])}) = ${formatValueSimple(origL[j])} - ${formatValueSimple(product)} = <strong>${formatValueSimple(LHS[i][j])}</strong>`);
        }
        for (let j = 0; j < n; j++) {
          RHS[i][j] -= factor * RHS[p][j];
          let product = factor * rowP_R[j];
          mathLinesR.push(`Col ${j + 1}: ${formatValueSimple(origR[j])} - (${formatValueSimple(factor)} × ${formatValueSimple(rowP_R[j])}) = ${formatValueSimple(origR[j])} - ${formatValueSimple(product)} = <strong>${formatValueSimple(RHS[i][j])}</strong>`);
        }

        let opSign = factor < 0 ? "+" : "-";
        let factorText = Math.abs(factor) === 1 ? "" : ` ${formatValueSimple(Math.abs(factor))}`;
        steps.push({
          title: `Eliminate element in Row ${i + 1}, Column ${p + 1} [R${i + 1} &rarr; R${i + 1} ${opSign}${factorText}R${p + 1}]`,
          content: `
                <div class="step-desc" style="margin-bottom: 0.75rem;">Subtract ${formatValueSimple(factor)} times Row ${p + 1} from Row ${i + 1} on both sides of the equation:</div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.25rem;">
                  <div style="padding: 0.75rem; background: var(--bg); border: 1px dashed var(--border); border-radius: 8px; box-sizing: border-box;">
                    <div style="font-weight: 700; color: var(--teal); margin-bottom: 0.4rem; font-size: 0.85rem;">Left-Hand Side (A):</div>
                    <div style="font-family: 'IBM Plex Mono', monospace; font-size: 0.85rem; line-height: 1.5; color: var(--navy);">${mathLinesL.join('<br>')}</div>
                  </div>
                  <div style="padding: 0.75rem; background: var(--bg); border: 1px dashed var(--border); border-radius: 8px; box-sizing: border-box;">
                    <div style="font-weight: 700; color: var(--amber); margin-bottom: 0.4rem; font-size: 0.85rem;">Right-Hand Side (I):</div>
                    <div style="font-family: 'IBM Plex Mono', monospace; font-size: 0.85rem; line-height: 1.5; color: var(--navy);">${mathLinesR.join('<br>')}</div>
                  </div>
                </div>

                <div style="text-align: center;">
                  ${getEquationState()}
                </div>
              `
        });
      }
    }
  }

  steps.push({
    title: "Conclude and Extract Inverse",
    content: `
          <div class="step-desc" style="margin-bottom: 0.5rem;">The left-hand side matrix is now transformed into the Identity Matrix I. The equation has become:</div>
          <div style="font-size: 1.1rem; text-align: center; font-weight: 700; color: var(--teal); margin: 1rem 0;">
            I = A⁻¹ A
          </div>
          <div class="step-desc" style="margin-bottom: 0.5rem;">Since the product of A and its inverse yields the identity matrix, the matrix on the right-hand side is the final computed inverse A⁻¹:</div>
          <div style="text-align: center; margin: 1rem 0;">
            ${matrixToHtml(RHS)}
          </div>
        `
  });

  return steps;
}

// ==========================================
// EDUCATIONAL ECHELON FORM CALCULATOR ENGINE
// ==========================================

function calculateEchelonMatrix() {
  const output = document.getElementById('steps-output');
  if (!output) return;
  output.innerHTML = '';
  output.classList.add('active');

  let rows = currentMatrixRows;
  let cols = currentMatrixCols;

  let A = [];
  let hasEmpty = false;
  let hasInvalid = false;

  for (let i = 0; i < rows; i++) {
    let row = [];
    for (let j = 0; j < cols; j++) {
      let cellId = `m${i}${j}`;
      let cellEl = document.getElementById(cellId);
      if (!cellEl) continue;
      let valStr = cellEl.value.trim();
      if (valStr === '') hasEmpty = true;
      let val = parseFloat(valStr);
      if (isNaN(val) || !isFinite(val)) hasInvalid = true;
      row.push(val);
    }
    A.push(row);
  }

  if (hasEmpty || hasInvalid) {
    output.innerHTML = `
          <div class="step-card" style="border-left-color: #dc2626;">
            <div class="step-header">
              <div class="step-title" style="color: #dc2626; font-size: 1.25rem;">Error: Invalid Matrix Entries</div>
            </div>
            <div class="step-desc" style="font-size: 1rem;">
              Please ensure all cells in the matrix grid are filled with valid numeric values.
            </div>
          </div>
        `;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  window.echelonInputMatrix = A;
  output.innerHTML = renderEchelonMethodSelectionUI();
  output.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderEchelonMethodSelectionUI() {
  return `
        <div class="method-selector-card card animate-fade-in" style="padding: 2rem; margin-bottom: 2rem; background: var(--bg); border: 1px solid var(--border); border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.02); box-sizing: border-box; width: 100%;">
          <h3 style="color: var(--navy); margin-bottom: 0.5rem; font-family: 'Fraunces', serif; font-size: 1.6rem; text-align: center;">
            Choose Solution Method
          </h3>
          <p style="color: var(--muted); text-align: center; font-size: 0.95rem; margin-bottom: 2rem;">
            Select one of the educational Echelon reduction pathways below to view its complete step-by-step derivation.
          </p>
          
          <div class="method-cards-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem;">
            <!-- Card A -->
            <div class="method-card" style="padding: 1.5rem; border: 1px solid var(--border); border-radius: 12px; cursor: pointer; transition: all 0.25s ease; background: var(--white); box-shadow: 0 4px 6px rgba(0,0,0,0.02); box-sizing: border-box;" onclick="window.selectEchelonMethod('ref')" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 10px 20px rgba(0,0,0,0.05)'; this.style.borderColor='var(--amber)';" onmouseout="this.style.transform='none'; this.style.boxShadow='0 4px 6px rgba(0,0,0,0.02)'; this.style.borderColor='var(--border)';">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
                <span style="font-weight: 700; font-size: 1.15rem; color: var(--navy);">Row Echelon Form (REF)</span>
                <span style="font-size: 0.7rem; font-weight: 700; text-transform: uppercase; padding: 2px 8px; border-radius: 99px; background: rgba(13, 148, 136, 0.1); color: var(--teal);">REF</span>
              </div>
              <p style="font-size: 0.85rem; line-height: 1.5; color: var(--muted);">Reduce the matrix to row echelon form systematically using forward elimination. Identifies pivots, swaps rows, and zeroes out values below pivots.</p>
            </div>

            <!-- Card B -->
            <div class="method-card" style="padding: 1.5rem; border: 1px solid var(--border); border-radius: 12px; cursor: pointer; transition: all 0.25s ease; background: var(--white); box-shadow: 0 4px 6px rgba(0,0,0,0.02); box-sizing: border-box;" onclick="window.selectEchelonMethod('rref')" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 10px 20px rgba(0,0,0,0.05)'; this.style.borderColor='var(--amber)';" onmouseout="this.style.transform='none'; this.style.boxShadow='0 4px 6px rgba(0,0,0,0.02)'; this.style.borderColor='var(--border)';">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
                <span style="font-weight: 700; font-size: 1.15rem; color: var(--navy);">Reduced Row Echelon Form (RREF)</span>
                <span style="font-size: 0.7rem; font-weight: 700; text-transform: uppercase; padding: 2px 8px; border-radius: 99px; background: rgba(13, 148, 136, 0.1); color: var(--teal);">RREF</span>
              </div>
              <p style="font-size: 0.85rem; line-height: 1.5; color: var(--muted);">Solve fully to Reduced Row Echelon Form (Gauss-Jordan). Normalizes pivots to exactly 1 and clears all elements above and below pivots.</p>
            </div>

            <!-- Card C -->
            <div class="method-card" style="padding: 1.5rem; border: 1px solid var(--border); border-radius: 12px; cursor: pointer; transition: all 0.25s ease; background: var(--white); box-shadow: 0 4px 6px rgba(0,0,0,0.02); box-sizing: border-box;" onclick="window.selectEchelonMethod('both')" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 10px 20px rgba(0,0,0,0.05)'; this.style.borderColor='var(--amber)';" onmouseout="this.style.transform='none'; this.style.boxShadow='0 4px 6px rgba(0,0,0,0.02)'; this.style.borderColor='var(--border)';">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
                <span style="font-weight: 700; font-size: 1.15rem; color: var(--navy);">Show Both Forms</span>
                <span style="font-size: 0.7rem; font-weight: 700; text-transform: uppercase; padding: 2px 8px; border-radius: 99px; background: rgba(13, 148, 136, 0.1); color: var(--teal);">REF & RREF</span>
              </div>
              <p style="font-size: 0.85rem; line-height: 1.5; color: var(--muted);">Compare both reductions side-by-step. Shows the forward elimination (REF) and subsequent back-substitution (RREF) in one continuous layout.</p>
            </div>
          </div>
        </div>
      `;
}

window.selectEchelonMethod = function (methodId) {
  let A = window.echelonInputMatrix;
  if (!A) return;

  let stepsHtml = `
        <button class="btn-primary" style="background: var(--bg2); color: var(--navy); padding: 0.5rem 1rem; font-size: 0.9rem; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 6px; border: 1px solid var(--border);" onclick="window.backToEchelonMethodSelection()">
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="stroke: var(--navy);">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Method Selection
        </button>
      `;

  if (methodId === 'both') {
    stepsHtml += `
          <h2 style="font-family: 'Fraunces', serif; color: var(--navy); margin-top: 1rem; margin-bottom: 1.5rem; text-align: center; border-bottom: 2px solid var(--amber); padding-bottom: 0.5rem; font-size: 1.5rem;">Part 1: Row Echelon Form (REF)</h2>
        `;
    let refResult = solveEchelonDetailed(A, 'ref');
    stepsHtml += renderEchelonMethodSteps(refResult.steps);
    stepsHtml += renderEchelonSummaryCard(refResult.matrix, refResult.pivots);

    stepsHtml += `
          <h2 style="font-family: 'Fraunces', serif; color: var(--navy); margin-top: 3rem; margin-bottom: 1.5rem; text-align: center; border-bottom: 2px solid var(--amber); padding-bottom: 0.5rem; font-size: 1.5rem;">Part 2: Reduced Row Echelon Form (RREF)</h2>
        `;
    let rrefResult = solveEchelonDetailed(A, 'rref');
    stepsHtml += renderEchelonMethodSteps(rrefResult.steps);
    stepsHtml += renderEchelonSummaryCard(rrefResult.matrix, rrefResult.pivots);
  } else {
    let result = solveEchelonDetailed(A, methodId);
    stepsHtml += renderEchelonMethodSteps(result.steps);
    stepsHtml += renderEchelonSummaryCard(result.matrix, result.pivots);
  }

  const output = document.getElementById('steps-output');
  output.innerHTML = stepsHtml;
  output.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

window.backToEchelonMethodSelection = function () {
  const output = document.getElementById('steps-output');
  output.innerHTML = renderEchelonMethodSelectionUI();
  output.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

function renderEchelonMethodSteps(steps) {
  let html = "";
  let stepCount = 1;

  steps.forEach(step => {
    let badgeColorStyle = "";
    if (step.badgeColor === "blue") badgeColorStyle = "background: #3b82f6; color: #ffffff;";
    else if (step.badgeColor === "orange") badgeColorStyle = "background: #f97316; color: #ffffff;";
    else if (step.badgeColor === "green") badgeColorStyle = "background: #10b981; color: #ffffff;";
    else if (step.badgeColor === "purple") badgeColorStyle = "background: #8b5cf6; color: #ffffff;";

    let badgeHtml = `
          <span style="display: inline-block; padding: 2px 8px; border-radius: 99px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; margin-left: 0.75rem; letter-spacing: 0.5px; ${badgeColorStyle}">
            ${step.badgeText}
          </span>
        `;

    let contentHtml = `
          <div class="step-desc" style="font-size: 1rem; color: var(--navy); margin-bottom: 1rem;">${step.explanation}</div>
        `;

    if (step.operation) {
      contentHtml += `
            <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.05rem; font-weight: 700; color: var(--amber); margin-bottom: 1rem; padding: 0.4rem 0.8rem; background: var(--bg2); border-left: 4px solid var(--amber); width: fit-content; border-radius: 0 6px 6px 0;">
              Operation: ${step.operation}
            </div>
          `;
    }

    if (step.matrixBefore && step.matrixAfter) {
      let pr = step.pivotPos ? step.pivotPos.r : -1;
      let pc = step.pivotPos ? step.pivotPos.c : -1;
      contentHtml += `
            <div style="display: flex; align-items: center; justify-content: center; gap: 1.5rem; flex-wrap: wrap; margin: 1.25rem 0;">
              <div style="display: flex; flex-direction: column; align-items: center;">
                <div style="font-size: 0.8rem; font-weight: 600; color: var(--muted); margin-bottom: 0.25rem;">Before:</div>
                ${matrixToHtmlEchelon(step.matrixBefore, pr, pc)}
              </div>
              <div style="font-size: 1.5rem; font-weight: 700; color: var(--muted); margin-top: 1rem;">&rarr;</div>
              <div style="display: flex; flex-direction: column; align-items: center;">
                <div style="font-size: 0.8rem; font-weight: 600; color: var(--muted); margin-bottom: 0.25rem;">After:</div>
                ${matrixToHtmlEchelon(step.matrixAfter, pr, pc)}
              </div>
            </div>
          `;
    } else if (step.matrixAfter) {
      let pr = step.pivotPos ? step.pivotPos.r : -1;
      let pc = step.pivotPos ? step.pivotPos.c : -1;
      contentHtml += `
            <div style="text-align: center; margin: 1.25rem 0;">
              ${matrixToHtmlEchelon(step.matrixAfter, pr, pc)}
            </div>
          `;
    }

    if (step.mathDetail) {
      contentHtml += `
            <div style="font-family: 'IBM Plex Mono', monospace; font-size: 0.9rem; padding: 0.75rem; background: var(--bg); border: 1px dashed var(--border); border-radius: 8px; margin-bottom: 1rem; color: var(--navy); line-height: 1.6; max-height: 150px; overflow-y: auto; box-sizing: border-box;">
              <div style="font-weight: 700; color: var(--teal); margin-bottom: 0.4rem; font-size: 0.8rem; border-bottom: 1px dashed var(--border); padding-bottom: 0.25rem;">Arithmetic breakdown:</div>
              ${step.mathDetail}
            </div>
          `;
    }

    let isCollapsed = false;
    let collapseAttr = isCollapsed ? 'style="display: none;"' : '';
    let rotateAttr = isCollapsed ? 'style="transform: rotate(-90deg);"' : '';

    html += `
          <div class="step-card animate-fade-in" style="box-sizing: border-box; width: 100%;">
            <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
              <div style="display: flex; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
                <div class="step-number">${stepCount++}</div>
                <div class="step-title" style="color: var(--navy); font-weight: 700;">${step.title}</div>
                ${badgeHtml}
              </div>
              <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);" ${rotateAttr}>▼</div>
            </div>
            <div class="step-content" ${collapseAttr}>
              ${contentHtml}
            </div>
          </div>
        `;
  });

  return html;
}

function renderEchelonSummaryCard(matrix, pivots) {
  let rows = matrix.length;
  let cols = matrix[0].length;

  let rank = 0;
  for (let i = 0; i < rows; i++) {
    let isNonZero = false;
    for (let j = 0; j < cols; j++) {
      if (Math.abs(matrix[i][j]) > 1e-9) {
        isNonZero = true;
        break;
      }
    }
    if (isNonZero) rank++;
  }

  let fullRankVal = Math.min(rows, cols);
  let isFullRank = (rank === fullRankVal);
  let rankStatusHtml = isFullRank ? 
    `<span style="color: #10b981; font-weight: 700;">✓ Full Rank Matrix</span>` : 
    `<span style="color: #ea580c; font-weight: 700;">⚠️ Rank Deficient / Defective Rank</span>`;

  let pivotPointsText = pivots.map(p => `(${p.r + 1}, ${p.c + 1})`).join(', ');
  if (pivots.length === 0) pivotPointsText = "None";

  return `
        <div class="final-result animate-fade-in" style="padding: 2.5rem; background: #111827; color: #ffffff; border-radius: 16px; border: 1px solid var(--border); box-shadow: 0 10px 30px rgba(0,0,0,0.15); margin-top: 2rem; box-sizing: border-box; width: 100%;">
          <div style="font-size: 1.8rem; font-weight: 700; color: var(--amber); margin-bottom: 0.5rem; font-family:'Fraunces', serif; text-align: center;">✅ Reduction Successfully Completed!</div>
          <div style="font-size: 1.05rem; opacity: 0.9; margin-bottom: 2rem; text-align: center;">The matrix has been completely reduced and analyzed.</div>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; text-align: left; box-sizing: border-box;">
            <div style="padding: 1.25rem; background: rgba(255,255,255,0.06); border-radius: 12px; border: 1px solid rgba(255,255,255,0.12); box-sizing: border-box;">
              <div style="font-size:0.85rem; font-weight:600; color: rgba(255,255,255,0.6); text-transform: uppercase; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.4rem; margin-bottom: 0.6rem;">Echelon Form Matrix:</div>
              <div style="text-align: center; overflow-x: auto;">
                ${matrixToHtml(matrix)}
              </div>
            </div>

            <div style="padding: 1.25rem; background: rgba(255,255,255,0.06); border-radius: 12px; border: 1px solid rgba(255,255,255,0.12); display: flex; flex-direction: column; justify-content: center; box-sizing: border-box;">
              <div style="font-size: 0.95rem; margin-bottom: 0.5rem;"><strong>Rank of Matrix:</strong> <span style="font-size: 1.2rem; font-weight: 700; color: var(--amber); font-family: 'IBM Plex Mono', monospace; margin-left: 0.25rem;">${rank}</span></div>
              <div style="font-size: 0.95rem; margin-bottom: 0.5rem;"><strong>Non-Zero Rows Count:</strong> <span style="font-size: 1.05rem; font-weight: 700; color: #ffffff; font-family: 'IBM Plex Mono', monospace;">${rank}</span></div>
              <div style="font-size: 0.95rem; margin-bottom: 0.5rem;"><strong>Pivot Positions:</strong> <span style="font-size: 0.95rem; font-weight: 700; color: #ffffff; font-family: 'IBM Plex Mono', monospace;">${pivotPointsText}</span></div>
              <div style="font-size: 0.95rem; margin-top: 0.75rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 0.75rem;">
                <strong>Rank Completeness:</strong><br>${rankStatusHtml}
              </div>
            </div>
          </div>
        </div>
      `;
}

function solveEchelonDetailed(A, targetType) {
  let rows = A.length;
  let cols = A[0].length;
  let M = A.map(row => [...row]);
  let steps = [];
  let pivots = [];

  steps.push({
    type: "pivot_found",
    title: "Starting Matrix",
    badgeText: "Starting State",
    badgeColor: "blue",
    explanation: `We begin the echelon reduction of our ${rows}x${cols} starting matrix:`,
    matrixAfter: M.map(r => [...r])
  });

  let r = 0;
  let c = 0;

  while (r < rows && c < cols) {
    let maxVal = -1;
    let maxRow = -1;
    for (let i = r; i < rows; i++) {
      if (Math.abs(M[i][c]) > maxVal) {
        maxVal = Math.abs(M[i][c]);
        maxRow = i;
      }
    }

    if (maxVal < 1e-9) {
      c++;
      continue;
    }

    if (maxRow !== r) {
      let before = M.map(row => [...row]);
      let temp = M[r];
      M[r] = M[maxRow];
      M[maxRow] = temp;

      steps.push({
        type: "swap",
        title: `Swap Row ${r + 1} and Row ${maxRow + 1}`,
        badgeText: "Row Swap",
        badgeColor: "orange",
        explanation: `Swap Row ${r + 1} and Row ${maxRow + 1} to bring a non-zero element to diagonal pivot position at Column ${c + 1}.`,
        operation: `R<sub>${r + 1}</sub> &harr; R<sub>${maxRow + 1}</sub>`,
        pivotPos: { r: r, c: c },
        matrixBefore: before,
        matrixAfter: M.map(row => [...row])
      });
    }

    pivots.push({ r: r, c: c });
    steps.push({
      type: "pivot_found",
      title: `Identify Pivot at Row ${r + 1}, Column ${c + 1}`,
      badgeText: "Pivot Found",
      badgeColor: "blue",
      explanation: `A pivot of value <strong>${formatValueSimple(M[r][c])}</strong> is identified at Row ${r + 1}, Column ${c + 1}. We will eliminate all entries underneath this pivot position.`,
      pivotPos: { r: r, c: c },
      matrixAfter: M.map(row => [...row])
    });

    for (let i = r + 1; i < rows; i++) {
      let factor = M[i][c] / M[r][c];
      if (Math.abs(factor) > 1e-9) {
        let before = M.map(row => [...row]);
        let originalRowI = [...M[i]];
        let pivotRow = [...M[r]];
        let mathLines = [];

        for (let j = 0; j < cols; j++) {
          M[i][j] -= factor * M[r][j];
          if (Math.abs(M[i][j]) < 1e-9) M[i][j] = 0;

          let product = factor * pivotRow[j];
          mathLines.push(`Col ${j + 1}: ${formatValueSimple(originalRowI[j])} - (${formatValueSimple(factor)} × ${formatValueSimple(pivotRow[j])}) = ${formatValueSimple(originalRowI[j])} - ${formatValueSimple(product)} = <strong>${formatValueSimple(M[i][j])}</strong>`);
        }

        let opSign = factor < 0 ? "+" : "-";
        let factorText = Math.abs(factor) === 1 ? "" : ` ${formatValueSimple(Math.abs(factor))}`;

        steps.push({
          type: "eliminate",
          title: `Zero out Row ${i + 1}, Column ${c + 1}`,
          badgeText: "Row Operation",
          badgeColor: "green",
          explanation: `Eliminate element below the pivot in Column ${c + 1} by performing:`,
          operation: `R<sub>${i + 1}</sub> &larr; R<sub>${i + 1}</sub> ${opSign}${factorText}R<sub>${r + 1}</sub>`,
          pivotPos: { r: r, c: c },
          matrixBefore: before,
          matrixAfter: M.map(row => [...row]),
          mathDetail: mathLines.join('<br>')
        });
      }
    }

    r++;
    c++;
  }

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (Math.abs(M[i][j]) < 1e-9) M[i][j] = 0;
    }
  }

  if (targetType === 'ref') {
    steps.push({
      type: "final_result",
      title: "Row Echelon Form (REF) Achieved",
      badgeText: "Final Result",
      badgeColor: "purple",
      explanation: `All values under the pivot positions are now reduced to zero. Row Echelon Form is fully achieved:`,
      matrixAfter: M.map(row => [...row])
    });
    return { matrix: M, steps: steps, pivots: pivots };
  }

  for (let p = pivots.length - 1; p >= 0; p--) {
    let pr = pivots[p].r;
    let pc = pivots[p].c;
    let pivot = M[pr][pc];

    if (Math.abs(pivot - 1) > 1e-9) {
      let before = M.map(row => [...row]);
      let originalRow = [...M[pr]];
      let mathLines = [];

      for (let j = 0; j < cols; j++) {
        M[pr][j] /= pivot;
        if (Math.abs(M[pr][j]) < 1e-9) M[pr][j] = 0;
        mathLines.push(`Col ${j + 1}: ${formatValueSimple(originalRow[j])} / ${formatValueSimple(pivot)} = <strong>${formatValueSimple(M[pr][j])}</strong>`);
      }

      steps.push({
        type: "scale",
        title: `Normalize Row ${pr + 1} Pivot to 1`,
        badgeText: "Row Operation",
        badgeColor: "green",
        explanation: `Divide Row ${pr + 1} by the leading coefficient pivot value <strong>${formatValueSimple(pivot)}</strong>:`,
        operation: `R<sub>${pr + 1}</sub> &larr; R<sub>${pr + 1}</sub> / ${formatValueSimple(pivot)}`,
        pivotPos: { r: pr, c: pc },
        matrixBefore: before,
        matrixAfter: M.map(row => [...row]),
        mathDetail: mathLines.join('<br>')
      });
    }

    for (let i = pr - 1; i >= 0; i--) {
      let factor = M[i][pc];
      if (Math.abs(factor) > 1e-9) {
        let before = M.map(row => [...row]);
        let originalRowI = [...M[i]];
        let pivotRow = [...M[pr]];
        let mathLines = [];

        for (let j = 0; j < cols; j++) {
          M[i][j] -= factor * M[pr][j];
          if (Math.abs(M[i][j]) < 1e-9) M[i][j] = 0;

          let product = factor * pivotRow[j];
          mathLines.push(`Col ${j + 1}: ${formatValueSimple(originalRowI[j])} - (${formatValueSimple(factor)} × ${formatValueSimple(pivotRow[j])}) = ${formatValueSimple(originalRowI[j])} - ${formatValueSimple(product)} = <strong>${formatValueSimple(M[i][j])}</strong>`);
        }

        let opSign = factor < 0 ? "+" : "-";
        let factorText = Math.abs(factor) === 1 ? "" : ` ${formatValueSimple(Math.abs(factor))}`;

        steps.push({
          type: "eliminate",
          title: `Zero out Row ${i + 1}, Column ${pc + 1}`,
          badgeText: "Row Operation",
          badgeColor: "green",
          explanation: `Eliminate element above the pivot at Row ${pr + 1}, Column ${pc + 1} by performing:`,
          operation: `R<sub>${i + 1}</sub> &larr; R<sub>${i + 1}</sub> ${opSign}${factorText}R<sub>${pr + 1}</sub>`,
          pivotPos: { r: pr, c: pc },
          matrixBefore: before,
          matrixAfter: M.map(row => [...row]),
          mathDetail: mathLines.join('<br>')
        });
      }
    }
  }

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (Math.abs(M[i][j]) < 1e-9) M[i][j] = 0;
    }
  }

  steps.push({
    type: "final_result",
    title: "Reduced Row Echelon Form (RREF) Achieved",
    badgeText: "Final Result",
    badgeColor: "purple",
    explanation: `All pivot elements are now scaled to exactly 1, and all values above and below pivots have been zeroed out:`,
    matrixAfter: M.map(row => [...row])
  });

  return { matrix: M, steps: steps, pivots: pivots };
}

function matrixToHtmlEchelon(matrix, pivotRow, pivotCol) {
  let rows = matrix.length;
  let cols = matrix[0].length;

  let formattedRows = matrix.map((row, r) => {
    return `<div style="display: flex; gap: 1rem; justify-content: center; align-items: center; min-height: 24px;">` +
      row.map((v, c) => {
        let isPivot = (r === pivotRow && c === pivotCol);
        let style = isPivot ? 
          `min-width: 32px; text-align: center; display: inline-block; background: var(--amber); color: #ffffff; border-radius: 4px; padding: 2px 6px; font-weight: 700;` : 
          `min-width: 32px; text-align: center; display: inline-block; padding: 2px 6px;`;
        return `<span style="${style}">${formatValueSimple(v)}</span>`;
      }).join('') +
      `</div>`;
  }).join('');

  return `
        <div style="display: inline-flex; align-items: center; font-family: 'IBM Plex Mono', monospace; font-size: 1.15rem; color: var(--navy); margin: 0.75rem 0; line-height: 1.2; user-select: none;">
          <span style="font-size: ${rows * 1.3}rem; font-weight: 200; margin-right: 0.35rem; color: var(--navy); line-height: 1; transform: scaleY(1.15);">&lbrack;</span>
          <div style="display: inline-flex; flex-direction: column; text-align: center; gap: 0.4rem; padding: 0 0.15rem;">
            ${formattedRows}
          </div>
          <span style="font-size: ${rows * 1.3}rem; font-weight: 200; margin-left: 0.35rem; color: var(--navy); line-height: 1; transform: scaleY(1.15);">&rbrack;</span>
        </div>
      `;
}

// ==========================================
// EDUCATIONAL DETERMINANT CALCULATOR ENGINE
// ==========================================

function calculateDeterminantMatrix() {
  const output = document.getElementById('steps-output');
  if (!output) return;
  output.innerHTML = '';
  output.classList.add('active');

  let rows = currentMatrixRows;
  let cols = currentMatrixCols;

  if (rows !== cols) {
    output.innerHTML = `
          <div class="step-card" style="border-left-color: #dc2626;">
            <div class="step-header">
              <div class="step-title" style="color: #dc2626; font-size: 1.25rem;">Error: Non-Square Matrix</div>
            </div>
            <div class="step-desc" style="font-size: 1rem;">
              The Determinant is only defined for square matrices. The entered matrix size is <strong>${rows}x${cols}</strong>. Please ensure the number of Rows equals the number of Columns.
            </div>
          </div>
        `;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  let A = [];
  let hasEmpty = false;
  let hasInvalid = false;

  for (let i = 0; i < rows; i++) {
    let row = [];
    for (let j = 0; j < cols; j++) {
      let cellId = `m${i}${j}`;
      let cellEl = document.getElementById(cellId);
      if (!cellEl) continue;
      let valStr = cellEl.value.trim();
      if (valStr === '') hasEmpty = true;
      let val = parseFloat(valStr);
      if (isNaN(val) || !isFinite(val)) hasInvalid = true;
      row.push(val);
    }
    A.push(row);
  }

  if (hasEmpty || hasInvalid) {
    output.innerHTML = `
          <div class="step-card" style="border-left-color: #dc2626;">
            <div class="step-header">
              <div class="step-title" style="color: #dc2626; font-size: 1.25rem;">Error: Invalid Matrix Entries</div>
            </div>
            <div class="step-desc" style="font-size: 1rem;">
              Please ensure all cells in the matrix grid are filled with valid numeric values.
            </div>
          </div>
        `;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  let stepsHtml = `
    <h2 style="font-family: 'Fraunces', serif; color: var(--navy); margin-top: 1rem; margin-bottom: 1.5rem; text-align: center; border-bottom: 2px solid var(--amber); padding-bottom: 0.5rem; font-size: 1.5rem;">Cofactor Expansion Method</h2>
  `;

  let methodSteps = generateCofactorExpansionSteps(A);
  stepsHtml += renderStepsListHTML(methodSteps);

  let finalDet = determinant(A);

  stepsHtml += `
        <div class="final-result animate-fade-in" style="text-align: center; padding: 2.5rem; background: #111827; color: #ffffff; border-radius: 16px; border: 1px solid var(--border); box-shadow: 0 10px 30px rgba(0,0,0,0.15); margin-top: 2.5rem;">
          <div style="font-size: 1.8rem; font-weight: 700; color: var(--amber); margin-bottom: 0.5rem; font-family:'Fraunces', serif;">✅ Determinant Successfully Calculated!</div>
          <div style="font-size: 1.05rem; opacity: 0.9; margin-bottom: 1.5rem;">The matrix determinant has been computed using Laplace Cofactor Expansion.</div>
          
          <div style="display:inline-block; text-align: left; padding: 1.5rem; background: rgba(255,255,255,0.06); border-radius: 12px; border: 1px solid rgba(255,255,255,0.12); min-width: 250px; box-sizing: border-box; width: 100%; max-width: 600px;">
            <div style="font-size:0.95rem; font-weight:600; color: rgba(255,255,255,0.7); border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; margin-bottom: 0.75rem;">Final Result:</div>
            <div style="margin-top: 1rem; text-align: center; font-size: 2.5rem; font-weight: 800; font-family: 'IBM Plex Mono', monospace; color: var(--amber);">
              det(A) = ${formatValueSimple(finalDet)}
            </div>
            
            ${renderDeterminantInterpretation(finalDet)}
          </div>
        </div>
      `;

  output.innerHTML = stepsHtml;
  output.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderStepsListHTML(steps) {
  let stepCount = 1;
  let html = "";
  steps.forEach(step => {
    let collapseAttr = step.isCollapsed ? 'style="display: none;"' : '';
    let rotateAttr = step.isCollapsed ? 'style="transform: rotate(-90deg);"' : '';
    html += `
          <div class="step-card">
            <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <div class="step-number">${stepCount++}</div>
                <div class="step-title">${step.title}</div>
              </div>
              <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);" ${rotateAttr}>▼</div>
            </div>
            <div class="step-content" ${collapseAttr}>
              ${step.content}
            </div>
          </div>
        `;
  });
  return html;
}

function getMinor(matrix, r, c) {
  return matrix.filter((_, rowIdx) => rowIdx !== r)
               .map(row => row.filter((_, colIdx) => colIdx !== c));
}

function renderDeterminantInterpretation(det) {
  let isSingular = Math.abs(det) < 1e-9;
  let textTitle = isSingular ? "Singular Matrix (det = 0)" : "Non-Singular Matrix (det ≠ 0)";
  let caseColor = isSingular ? "#d97706" : "var(--teal)";

  return `
    <div style="margin-top: 1.5rem; padding: 1.25rem; background: var(--bg); border: 1px solid var(--border); border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.02); box-sizing: border-box; width: 100%;">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed var(--border); padding-bottom: 0.5rem; margin-bottom: 0.75rem;">
        <span style="font-weight: 700; color: var(--navy); font-size: 1.1rem; font-family: 'Fraunces', serif;">Educational Interpretation</span>
        <span style="font-size: 0.75rem; font-weight: 600; padding: 2px 8px; border-radius: 99px; background: rgba(139, 92, 246, 0.1); color: #8b5cf6;">Purple: Final Result</span>
      </div>
      
      <div style="font-weight: 700; color: ${caseColor}; font-size: 1.15rem; margin-bottom: 0.75rem;">
        ${textTitle}
      </div>

      <div style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.95rem; color: var(--text); line-height: 1.5;">
        ${isSingular ? `
          <div style="display: flex; align-items: flex-start; gap: 6px;">
            <span style="color: #dc2626; font-weight: bold;">✕</span>
            <div><strong>Matrix Singular:</strong> The determinant equals exactly zero.</div>
          </div>
          <div style="display: flex; align-items: flex-start; gap: 6px;">
            <span style="color: #dc2626; font-weight: bold;">✕</span>
            <div><strong>Inverse Does Not Exist:</strong> A matrix has a defined inverse matrix (A<sup>-1</sup>) if and only if its determinant is non-zero. Since det(A) = 0, this matrix is non-invertible.</div>
          </div>
          <div style="display: flex; align-items: flex-start; gap: 6px;">
            <span style="color: #d97706; font-weight: bold;">⚠</span>
            <div><strong>Linear Dependence:</strong> The rows (and columns) of this matrix are linearly dependent, meaning at least one row can be written as a linear combination of the others.</div>
          </div>
        ` : `
          <div style="display: flex; align-items: flex-start; gap: 6px;">
            <span style="color: var(--teal); font-weight: bold;">✓</span>
            <div><strong>Matrix Non-Singular:</strong> The determinant is non-zero (${formatValueSimple(det)}).</div>
          </div>
          <div style="display: flex; align-items: flex-start; gap: 6px;">
            <span style="color: var(--teal); font-weight: bold;">✓</span>
            <div><strong>Inverse Exists:</strong> Since det(A) &ne; 0, the matrix inverse A<sup>-1</sup> is guaranteed to exist and can be computed.</div>
          </div>
          <div style="display: flex; align-items: flex-start; gap: 6px;">
            <span style="color: var(--teal); font-weight: bold;">✓</span>
            <div><strong>Linear Independence:</strong> The row vectors (and column vectors) are completely linearly independent. No row can be formed by combining the other rows.</div>
          </div>
        `}
      </div>
    </div>
  `;
}

function generateCofactorExpansionSteps(A) {
  let n = A.length;
  let steps = [];

  // Step 1: Original Matrix
  steps.push({
    title: "Original Matrix",
    isCollapsed: false,
    content: `
      <div class="step-desc" style="margin-bottom: 0.5rem;">We start with the given ${n}x${n} matrix A:</div>
      <div style="text-align: center; margin: 1rem 0;">
        ${matrixToHtml(A)}
      </div>
    `
  });

  if (n === 1) {
    let det = A[0][0];
    steps.push({
      title: "Direct Calculation",
      isCollapsed: false,
      content: `
        <div class="step-desc" style="margin-bottom: 0.5rem;">For a 1x1 matrix, the determinant is simply the single entry itself:</div>
        <div style="font-family: 'Fraunces', serif; font-size: 1.35rem; color: var(--navy); text-align: center; margin: 1.5rem 0;">
          Det(A) = ${formatValueSimple(det)}
        </div>
      `
    });
    return steps;
  }

  if (n === 2) {
    let a = A[0][0], b = A[0][1], c = A[1][0], d = A[1][1];
    let p1 = a * d, p2 = b * c;
    let det = p1 - p2;
    steps.push({
      title: "Direct Formula Application",
      isCollapsed: false,
      content: `
        <div class="step-desc" style="margin-bottom: 0.75rem;">For a 2x2 matrix, we use the standard cross-multiplication formula:</div>
        <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.15rem; color: var(--navy); margin-bottom: 1rem; text-align: center;">
          Det(A) = a<sub>11</sub>a<sub>22</sub> - a<sub>12</sub>a<sub>21</sub>
        </div>
        <div class="step-desc" style="margin-bottom: 0.75rem;">Substituting the entries into the formula:</div>
        <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.25rem; color: var(--navy); text-align: center; margin: 1.5rem 0;">
          Det(A) = (${formatValueSimple(a)} × ${formatValueSimple(d)}) - (${formatValueSimple(b)} × ${formatValueSimple(c)})
        </div>
        <div class="step-desc" style="margin-bottom: 0.75rem;">Showing intermediate products:</div>
        <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.25rem; color: var(--navy); text-align: center; margin: 1.5rem 0;">
          Det(A) = ${formatValueSimple(p1)} - (${formatValueSimple(p2)})
        </div>
        <div class="step-desc" style="margin-bottom: 0.75rem;">Performing the final subtraction:</div>
        <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.35rem; color: var(--teal); font-weight: 700; text-align: center; margin: 1.5rem 0;">
          Det(A) = ${formatValueSimple(det)}
        </div>
      `
    });
    return steps;
  }

  // For N >= 3
  // Step 2: Choose Row 1
  steps.push({
    title: "Select Expansion Row",
    isCollapsed: false,
    content: `
      <div class="step-desc" style="margin-bottom: 0.5rem;">We will expand along the **first row** of the matrix (standard Laplace cofactor expansion):</div>
      <div style="display: flex; gap: 1.5rem; justify-content: center; align-items: center; margin: 1rem 0; font-family: 'IBM Plex Mono', monospace; font-size: 1.1rem; color: var(--navy); flex-wrap: wrap;">
        ${A[0].map((val, idx) => `
          <div style="padding: 0.5rem 1rem; border: 2px solid var(--amber); border-radius: 8px; background: var(--bg); text-align: center; min-width: 80px;">
            a<sub>1,${idx+1}</sub> = <strong>${formatValueSimple(val)}</strong>
          </div>
        `).join('')}
      </div>
    `
  });

  // Step 3: Minor Calculations
  let minorCalculationsHtml = "";
  let minorDets = [];

  for (let j = 0; j < n; j++) {
    let sub = getMinor(A, 0, j);
    let detVal = determinant(sub);
    minorDets.push(detVal);

    let minorDetStepHtml = "";
    if (n === 3) {
      // 2x2 minor
      let ma = sub[0][0], mb = sub[0][1], mc = sub[1][0], md = sub[1][1];
      let mp1 = ma * md, mp2 = mb * mc;
      minorDetStepHtml = `
        <div style="margin-top: 0.5rem; font-family: 'IBM Plex Mono', monospace; font-size: 0.95rem;">
          det(M<sub>1,${j+1}</sub>) = (${formatValueSimple(ma)} × ${formatValueSimple(md)}) - (${formatValueSimple(mb)} × ${formatValueSimple(mc)})<br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= ${formatValueSimple(mp1)} - (${formatValueSimple(mp2)})<br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= <strong>${formatValueSimple(detVal)}</strong>
        </div>
      `;
    } else {
      // Larger minor, recursively get det
      minorDetStepHtml = `
        <div style="margin-top: 0.5rem; font-family: 'IBM Plex Mono', monospace; font-size: 0.95rem;">
          det(M<sub>1,${j+1}</sub>) = <strong>${formatValueSimple(detVal)}</strong> (calculated via further cofactor expansion)
        </div>
      `;
    }

    minorCalculationsHtml += `
      <div style="padding: 1.25rem; border: 1px solid var(--border); border-radius: 12px; background: var(--white); margin-bottom: 1.5rem; box-sizing: border-box; box-shadow: 0 4px 6px rgba(0,0,0,0.01); width: 100%;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed var(--border); padding-bottom: 0.5rem; margin-bottom: 0.75rem;">
          <span style="font-weight: 700; font-family: 'IBM Plex Mono', monospace; color: var(--navy); font-size: 1.05rem;">Term a<sub>1,${j+1}</sub> = ${formatValueSimple(A[0][j])}</span>
          <span style="font-size: 0.75rem; font-weight: 600; padding: 2px 8px; border-radius: 99px; background: rgba(59, 130, 246, 0.1); color: #3b82f6;">Blue: Minor Calculation</span>
        </div>
        <div class="step-desc" style="font-size: 0.9rem; margin-bottom: 0.5rem;">Remove **Row 1** and **Column ${j+1}** to find the minor matrix **M<sub>1,${j+1}</sub>**:</div>
        <div style="text-align: center; margin: 0.75rem 0;">
          ${matrixToHtml(sub)}
        </div>
        <div class="step-desc" style="font-size: 0.9rem; margin-bottom: 0.25rem; font-weight: 600; color: var(--navy);">Compute the determinant of the minor:</div>
        ${minorDetStepHtml}
      </div>
    `;
  }

  steps.push({
    title: "Calculate Every Minor Determinant",
    isCollapsed: false,
    content: `
      <div class="step-desc" style="margin-bottom: 1rem;">We extract the minor submatrices and solve their determinants one by one:</div>
      <div style="display: flex; flex-direction: column; gap: 0.5rem; width: 100%;">
        ${minorCalculationsHtml}
      </div>
    `
  });

  // Step 4: Apply Cofactor Signs
  let signMatrixHtml = "";
  if (n === 3) {
    signMatrixHtml = `
      <div style="display: inline-flex; align-items: center; font-family: 'IBM Plex Mono', monospace; font-size: 1.15rem; color: var(--navy); margin: 0.75rem 0;">
        <span style="font-size: 4rem; font-weight: 200; margin-right: 0.35rem; color: var(--navy); transform: scaleY(1.15);">&lbrack;</span>
        <div style="display: inline-flex; flex-direction: column; text-align: center; gap: 0.4rem; padding: 0 0.15rem; font-weight: 700;">
          <div>+ &nbsp; - &nbsp; +</div>
          <div>- &nbsp; + &nbsp; -</div>
          <div>+ &nbsp; - &nbsp; +</div>
        </div>
        <span style="font-size: 4rem; font-weight: 200; margin-left: 0.35rem; color: var(--navy); transform: scaleY(1.15);">&rbrack;</span>
      </div>
    `;
  } else {
    let signsRow = [];
    for (let j = 0; j < n; j++) {
      signsRow.push((j % 2 === 0) ? "+" : "-");
    }
    signMatrixHtml = `
      <div style="display: inline-flex; align-items: center; font-family: 'IBM Plex Mono', monospace; font-size: 1.15rem; color: var(--navy); margin: 0.75rem 0; font-weight: 700;">
        First Row Signs: &lbrack; ${signsRow.join(' , ')} &rbrack;
      </div>
    `;
  }

  steps.push({
    title: "Apply Cofactor Signs",
    isCollapsed: false,
    content: `
      <div class="step-desc" style="margin-bottom: 0.75rem;">Cofactors use a checkerboard sign overlay, where each element is multiplied by (-1)<sup>i+j</sup>:</div>
      <div style="text-align: center; margin: 1rem 0;">
        ${signMatrixHtml}
      </div>
      <div class="step-desc" style="margin-bottom: 0.5rem;">For expanding along Row 1, the sign multipliers are:</div>
      <div style="display: flex; flex-direction: column; gap: 0.4rem; font-family: 'IBM Plex Mono', monospace; font-size: 0.95rem; color: var(--navy); padding-left: 1rem; border-left: 2px solid var(--amber);">
        ${A[0].map((val, idx) => {
          let s = (idx % 2 === 0) ? 1 : -1;
          let sChar = s === 1 ? "+" : "-";
          return `<div>Term a<sub>1,${idx+1}</sub> = ${formatValueSimple(val)} &rarr; Sign multiplier: (-1)<sup>1+${idx+1}</sup> = <strong>${sChar}1</strong></div>`;
        }).join('')}
      </div>
    `
  });

  // Step 5: Substitute values
  let terms = [];
  let substitutedExpr = "";
  let substitutedNumbers = "";
  for (let j = 0; j < n; j++) {
    let sign = (j % 2 === 0) ? 1 : -1;
    let cellVal = A[0][j];
    let mDet = minorDets[j];
    let termVal = sign * cellVal * mDet;
    terms.push(termVal);

    let prefix = (j === 0) ? "" : ((sign === 1) ? " + " : " - ");
    substitutedExpr += `${prefix}a<sub>1,${j+1}</sub>(det(M<sub>1,${j+1}</sub>))`;
    
    let subNumPrefix = (j === 0) ? "" : ((sign === 1) ? " + " : " - ");
    substitutedNumbers += `${subNumPrefix}${formatValueSimple(cellVal)}(${formatValueSimple(mDet)})`;
  }

  steps.push({
    title: "Substitute and Expand Formula",
    isCollapsed: false,
    content: `
      <div class="step-desc" style="margin-bottom: 0.75rem;">We now assemble the determinant formula:</div>
      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.1rem; color: var(--navy); text-align: center; margin: 1rem 0;">
        Det(A) = ${substitutedExpr}
      </div>
      <div class="step-desc" style="margin-bottom: 0.75rem;">Substituting our calculated minor determinants and entries:</div>
      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.2rem; color: var(--navy); text-align: center; margin: 1.5rem 0;">
        Det(A) = ${substitutedNumbers}
      </div>
    `
  });

  // Step 6: Arithmetic Simplification
  let cleanTerms = [];
  for (let j = 0; j < n; j++) {
    let sign = (j % 2 === 0) ? 1 : -1;
    let tVal = sign * A[0][j] * minorDets[j];
    cleanTerms.push(tVal);
  }

  let stepArithmeticHtml = `
    <div class="step-desc" style="margin-bottom: 0.75rem;">Calculate the individual products for each term:</div>
    <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.25rem; color: var(--navy); text-align: center; margin: 1rem 0;">
      Det(A) = ${cleanTerms.map(val => formatValueSimple(val)).join(' + ').replace(/\+ -/g, '- ')}
    </div>
  `;

  let currentSum = cleanTerms[0];
  let runningArithmeticHtml = "";
  for (let j = 1; j < n; j++) {
    let nextVal = cleanTerms[j];
    let prevSum = currentSum;
    currentSum += nextVal;
    
    let remaining = cleanTerms.slice(j + 1);
    let remainingStr = remaining.length > 0 ? " + " + remaining.map(v => formatValueSimple(v)).join(' + ') : "";
    remainingStr = remainingStr.replace(/\+ -/g, '- ');

    runningArithmeticHtml += `
      <div class="step-desc" style="margin-bottom: 0.5rem;">Evaluate: **${formatValueSimple(prevSum)} + (${formatValueSimple(nextVal)})**</div>
      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.25rem; color: var(--navy); text-align: center; margin: 0.75rem 0;">
        Det(A) = ${formatValueSimple(currentSum)}${remainingStr}
      </div>
    `;
  }

  steps.push({
    title: "Arithmetic Simplification",
    isCollapsed: false,
    content: `
      ${stepArithmeticHtml}
      ${runningArithmeticHtml}
    `
  });

  return steps;
}

function generateRowReductionSteps(A) {
  let n = A.length;
  let steps = [];
  let M = copyMatrix(A);
  
  steps.push({
    title: "Original Matrix",
    isCollapsed: false,
    content: `
      <div class="step-desc" style="margin-bottom: 0.5rem;">We start with the given matrix A:</div>
      <div style="text-align: center; margin: 1rem 0;">
        ${matrixToHtml(M)}
      </div>
    `
  });

  let signFactor = 1;
  let swapCount = 0;

  for (let c = 0; c < n; c++) {
    let pivotRow = -1;
    for (let i = c; i < n; i++) {
      if (Math.abs(M[i][c]) > 1e-9) {
        pivotRow = i;
        break;
      }
    }

    if (pivotRow === -1) {
      steps.push({
        title: `Zero Pivot in Column ${c+1}`,
        isCollapsed: false,
        content: `
          <div class="step-desc" style="margin-bottom: 0.75rem; color: #dc2626;">
            Column ${c+1} has no non-zero entries at or below row ${c+1}.
          </div>
          <div class="step-desc" style="margin-bottom: 0.5rem;">
            This means the matrix is singular, and we cannot complete row reduction. Any upper triangular form will have a zero on the diagonal, so:
          </div>
          <div style="font-family: 'Fraunces', serif; font-size: 1.35rem; color: #dc2626; text-align: center; margin: 1.5rem 0;">
            Det(A) = 0
          </div>
        `
      });
      return { steps, determinant: 0 };
    }

    if (pivotRow !== c) {
      let beforeM = copyMatrix(M);
      let temp = M[c];
      M[c] = M[pivotRow];
      M[pivotRow] = temp;
      signFactor *= -1;
      swapCount++;

      steps.push({
        title: `Row Swap: R${c+1} ↔ R${pivotRow+1}`,
        isCollapsed: false,
        content: `
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed var(--border); padding-bottom: 0.5rem; margin-bottom: 0.75rem;">
            <span style="font-weight: 700; font-family: 'IBM Plex Mono', monospace; color: var(--navy); font-size: 1.05rem;">R<sub>${c+1}</sub> &harr; R<sub>${pivotRow+1}</sub></span>
            <span style="font-size: 0.75rem; font-weight: 600; padding: 2px 8px; border-radius: 99px; background: rgba(249, 115, 22, 0.1); color: #f97316;">Orange: Row Swap</span>
          </div>
          <div class="step-desc" style="margin-bottom: 0.75rem;">
            We swap Row ${c+1} and Row ${pivotRow+1} to position a non-zero pivot element **${formatValueSimple(M[c][c])}** on the diagonal.
          </div>
          <div class="step-desc" style="margin-bottom: 0.5rem; font-weight: 600; color: #f97316;">
            ⚠️ Crucial Rule: Swapping two rows changes the sign of the determinant!
          </div>
          <div style="display: flex; gap: 1rem; justify-content: center; align-items: center; margin: 1rem 0; flex-wrap: wrap;">
            <div>${matrixToHtml(beforeM)}</div>
            <div style="font-size: 1.5rem; color: var(--muted);">&rarr;</div>
            <div>${matrixToHtml(M)}</div>
          </div>
          <div class="step-desc" style="margin-top: 0.5rem; font-size: 0.95rem;">
            Accumulated determinant sign factor: **${signFactor}** (from ${swapCount} row swap${swapCount > 1 ? "s" : ""})
          </div>
        `
      });
    }

    let pivot = M[c][c];
    let rowOps = [];
    let beforeElimM = copyMatrix(M);
    let eliminated = false;

    for (let i = c + 1; i < n; i++) {
      if (Math.abs(M[i][c]) > 1e-9) {
        let factor = M[i][c] / pivot;
        for (let j = c; j < n; j++) {
          M[i][j] -= factor * M[c][j];
          if (Math.abs(M[i][j]) < 1e-9) M[i][j] = 0;
        }
        eliminated = true;

        let opSign = factor < 0 ? "+" : "-";
        let absFactorStr = formatValueSimple(Math.abs(factor));
        let opDesc = `R<sub>${i+1}</sub> &rarr; R<sub>${i+1}</sub> ${opSign} ${absFactorStr === "1" ? "" : absFactorStr + " "}R<sub>${c+1}</sub>`;
        rowOps.push(opDesc);
      }
    }

    if (eliminated) {
      steps.push({
        title: `Eliminate Column ${c+1} entries below diagonal`,
        isCollapsed: false,
        content: `
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed var(--border); padding-bottom: 0.5rem; margin-bottom: 0.75rem;">
            <span style="font-weight: 700; font-family: 'IBM Plex Mono', monospace; color: var(--navy); font-size: 1.05rem;">Row Operations</span>
            <span style="font-size: 0.75rem; font-weight: 600; padding: 2px 8px; border-radius: 99px; background: rgba(16, 185, 129, 0.1); color: #10b981;">Green: Row Operation</span>
          </div>
          <div class="step-desc" style="margin-bottom: 0.75rem;">
            We eliminate all entries below the diagonal in column ${c+1} using row operations. Row additions/subtractions **do not** alter the determinant.
          </div>
          <div style="margin-left: 1rem; border-left: 2px solid var(--teal); padding-left: 1rem; margin-bottom: 1rem; font-family: 'IBM Plex Mono', monospace; font-size: 0.95rem; color: var(--navy); display: flex; flex-direction: column; gap: 0.4rem;">
            ${rowOps.map(op => `<div>${op}</div>`).join('')}
          </div>
          <div style="display: flex; gap: 1rem; justify-content: center; align-items: center; margin: 1rem 0; flex-wrap: wrap;">
            <div>${matrixToHtml(beforeElimM)}</div>
            <div style="font-size: 1.5rem; color: var(--muted);">&rarr;</div>
            <div>${matrixToHtml(M)}</div>
          </div>
        `
      });
    }
  }

  let diagProduct = 1;
  let diagFormula = "";
  let diagSubstitutes = [];
  for (let i = 0; i < n; i++) {
    diagProduct *= M[i][i];
    diagSubstitutes.push(M[i][i]);
    diagFormula += (i === 0 ? "" : " × ") + `u<sub>${i+1},${i+1}</sub>`;
  }
  let finalDet = signFactor * diagProduct;

  steps.push({
    title: "Multiply Diagonal Elements",
    isCollapsed: false,
    content: `
      <div class="step-desc" style="margin-bottom: 0.5rem;">
        The matrix is now in **upper triangular form**. The determinant of an upper triangular matrix is the product of its diagonal elements:
      </div>
      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.15rem; color: var(--navy); text-align: center; margin: 1rem 0;">
        Det(Triangular) = ${diagFormula}
      </div>
      <div class="step-desc" style="margin-bottom: 0.5rem;">Substituting the main diagonal elements:</div>
      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.25rem; color: var(--navy); text-align: center; margin: 1.5rem 0;">
        Det(Triangular) = ${diagSubstitutes.map(val => formatValueSimple(val)).join(' × ')}
      </div>
      <div class="step-desc" style="margin-bottom: 0.5rem;">Product evaluation:</div>
      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.25rem; color: var(--navy); text-align: center; margin: 1.5rem 0;">
        Det(Triangular) = <strong>${formatValueSimple(diagProduct)}</strong>
      </div>
    `
  });

  steps.push({
    title: "Apply Sign Corrections",
    isCollapsed: false,
    content: `
      <div class="step-desc" style="margin-bottom: 0.5rem;">
        We scale the upper triangular determinant by our accumulated row swap sign factor (S = ${signFactor}):
      </div>
      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.25rem; color: var(--navy); text-align: center; margin: 1.5rem 0;">
        Det(A) = Sign Factor (S) × Det(Triangular)
      </div>
      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.35rem; color: var(--teal); font-weight: 700; text-align: center; margin: 1.5rem 0;">
        Det(A) = (${signFactor}) × ${formatValueSimple(diagProduct)} = ${formatValueSimple(finalDet)}
      </div>
    `
  });

  return { steps, determinant: finalDet };
}

function generateTriangularShortcutSteps(A) {
  let n = A.length;
  let steps = [];

  steps.push({
    title: "Original Matrix",
    isCollapsed: false,
    content: `
      <div class="step-desc" style="margin-bottom: 0.5rem;">We start with the given matrix A:</div>
      <div style="text-align: center; margin: 1rem 0;">
        ${matrixToHtml(A)}
      </div>
    `
  });

  let isUpper = isUpperTriangular(A);
  let isLower = isLowerTriangular(A);

  if (isUpper || isLower) {
    let diagProduct = 1;
    let diagSubstitutes = [];
    let diagFormula = "";
    for (let i = 0; i < n; i++) {
      diagProduct *= A[i][i];
      diagSubstitutes.push(A[i][i]);
      diagFormula += (i === 0 ? "" : " × ") + `a<sub>${i+1},${i+1}</sub>`;
    }

    steps.push({
      title: "Confirm Triangular Form",
      isCollapsed: false,
      content: `
        <div class="step-desc" style="margin-bottom: 0.75rem; color: var(--teal); font-weight: 600;">
          ✓ Verified! The matrix is already ${isUpper ? "Upper" : "Lower"} Triangular.
        </div>
        <div class="step-desc" style="font-size: 0.95rem;">
          In a triangular matrix, all entries ${isUpper ? "below" : "above"} the main diagonal are zero. 
          Therefore, the determinant is simply the product of the main diagonal entries.
        </div>
      `
    });

    steps.push({
      title: "Multiply Diagonal Elements",
      isCollapsed: false,
      content: `
        <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.15rem; color: var(--navy); text-align: center; margin: 1rem 0;">
          Det(A) = ${diagFormula}
        </div>
        <div class="step-desc" style="margin-bottom: 0.5rem;">Substituting the diagonal values:</div>
        <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.25rem; color: var(--navy); text-align: center; margin: 1.5rem 0;">
          Det(A) = ${diagSubstitutes.map(val => formatValueSimple(val)).join(' × ')}
        </div>
        <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.35rem; color: var(--teal); font-weight: 700; text-align: center; margin: 1.5rem 0;">
          Det(A) = ${formatValueSimple(diagProduct)}
        </div>
      `
    });

    return { steps, applicable: true, determinant: diagProduct };
  } else {
    steps.push({
      title: "Shortcut Not Applicable",
      isCollapsed: false,
      content: `
        <div class="step-card" style="border-left-color: #f59e0b; background: rgba(245, 158, 11, 0.02); padding: 1.5rem; margin-bottom: 1.5rem; box-sizing: border-box;">
          <div style="font-size: 1.15rem; font-weight: 700; color: #d97706; margin-bottom: 0.5rem;">
            ⚠️ Triangular Shortcut Not Applicable
          </div>
          <div style="font-size: 0.95rem; line-height: 1.5; color: var(--text);">
            This matrix is **not** triangular. It has non-zero elements both **above** and **below** the main diagonal.
            The diagonal shortcut is only defined for matrices that have zeros everywhere on one side of the main diagonal.
          </div>
        </div>
        <div class="step-desc" style="font-weight: 600; margin-bottom: 1rem; color: var(--navy);">
          Please select one of the following methods to solve this matrix step-by-step:
        </div>
        <div style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; margin-top: 1rem;">
          <button class="btn-primary" style="padding: 0.75rem 1.25rem; font-size: 0.95rem; background: var(--bg2); color: var(--navy); border: 1px solid var(--border);" onclick="window.selectDeterminantMethod('cofactor')">
            Switch to Cofactor Expansion
          </button>
          <button class="btn-primary" style="padding: 0.75rem 1.25rem; font-size: 0.95rem; background: var(--bg2); color: var(--navy); border: 1px solid var(--border);" onclick="window.selectDeterminantMethod('row-reduction')">
            Switch to Row Reduction
          </button>
        </div>
      `
    });

    return { steps, applicable: false, determinant: determinant(A) };
  }
}


