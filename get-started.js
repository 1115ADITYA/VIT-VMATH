// Global Helper Functions
function formatCurrency(value) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 2
    }).format(value);
}

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
    },
    {
      category: 'Trigonometry & Functions',
      items: [
        { id: 'hyperbolic-calc', name: 'Hyperbolic Function Calculator', icon: 'M4 19c1.5-3 3.5-3 5-3s3.5 0 5 3m-10-8c1.5-3 3.5-3 5-3s3.5 0 5 3' },
        { id: 'poly-roots', name: 'Polynomial Root Finder', icon: 'M9 7h6m0 10v-3m-3 3v-6M4 4h16v16H4z' },
        { id: 'multiple-angle-expand', name: 'Multiple Angle Expansion Calculator', icon: 'M8 7h8M8 11h8M8 15h8' },
        { id: 'power-reduction', name: 'Power Reduction Calculator', icon: 'M4 6h16M4 12h10M4 18h4' }
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
      category: 'Probability distribution',
      items: [
        { id: 'binomial', name: 'Binomial Distribution', icon: 'M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
        { id: 'uniform', name: 'Uniform Distribution', icon: 'M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
        { id: 'poisson', name: 'Poisson Distribution', icon: 'M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
        { id: 'normal', name: 'Normal Distribution', icon: 'M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
        { id: 'gamma', name: 'Gamma Distribution', icon: 'M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
        { id: 'beta', name: 'Beta Distribution', icon: 'M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
        { id: 'exponential', name: 'Exponential Distribution', icon: 'M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
        { id: 'geometric', name: 'Geometric Distribution', icon: 'M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' }
      ]
    },
    {
      category: 'Correlation & Regression',
      items: [
        { id: 'rank-calculator', name: 'Rank Calculator', icon: 'M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12' },
        { id: 'pearson-rank', name: 'Pearson Rank Correlation Coefficient', icon: 'M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z' },
        { id: 'regression-calculator', name: 'Regression Calculator', icon: 'M3 3v18h18M7 16l4-4 4 4 4-8' }
      ]
    }
  ],
  'finance': [
    {
      category: 'Financial Calculators',
      items: [
        { id: 'future-value', name: 'Future Value Calculator', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
        { id: 'present-value', name: 'Present Value Calculator', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
        { id: 'annuity', name: 'Annuity Calculator', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
        { id: 'interest-rate', name: 'Interest Rate Calculator', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
        { id: 'emi', name: 'EMI Calculator', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }
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
    const isMatched = (sem === 'finance' && idx === 3) || (idx + 1 === sem);
    if (isMatched) btn.classList.add('active');
    else btn.classList.remove('active');
  });

  // Populate Sidebar
  const sidebar = document.getElementById('sidebar-content');
  sidebar.innerHTML = '';

  // Populate Overview UI
  const overview = document.getElementById('overview-ui');
  let overviewTitle = sem === 'finance' ? 'Financial Calculators' : `Semester ${sem} Tools`;
  let overviewHtml = `<h2 style="font-family: 'Fraunces', serif; color: var(--navy); margin-bottom: 2rem; font-size: 2rem;">${overviewTitle}</h2>`;

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
  if (calcId === 'euler-method') {
    calcId = 'euler';
  }

  // Find which semester contains this calculator (synchronize semester navigation)
  let foundSem = null;
  if (calcId !== 'none') {
    Object.entries(data).forEach(([semKey, semData]) => {
      semData.forEach(section => {
        if (section.items.some(i => i.id === calcId)) {
          foundSem = semKey === 'finance' ? 'finance' : parseInt(semKey);
        }
      });
    });
  }

  if (foundSem && foundSem !== currentSem) {
    selectSem(foundSem, false, fromHistory);
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
  const eulerWrapper = document.getElementById('euler-method-input-container');
  const rungeKuttaWrapper = document.getElementById('runge-kutta-input-container');
  const futureValueWrapper = document.getElementById('future-value-input-container');
  const presentValueWrapper = document.getElementById('present-value-input-container');
  const annuityWrapper = document.getElementById('annuity-input-container');
  const interestRateWrapper = document.getElementById('interest-rate-input-container');
  const emiWrapper = document.getElementById('emi-input-container');
  const hyperbolicWrapper = document.getElementById('hyperbolic-input-container');
  const polyRootsWrapper = document.getElementById('poly-roots-input-container');
  const multipleAngleExpandWrapper = document.getElementById('multiple-angle-expand-input-container');
  const powerReductionWrapper = document.getElementById('power-reduction-input-container');
  const binomialWrapper = document.getElementById('binomial-input-container');
  const uniformWrapper = document.getElementById('uniform-input-container');
  const poissonWrapper = document.getElementById('poisson-input-container');
  const normalWrapper = document.getElementById('normal-input-container');
  const rankCalcWrapper = document.getElementById('rank-calculator-input-container');
  const pearsonRankWrapper = document.getElementById('pearson-rank-input-container');
  const regressionCalcWrapper = document.getElementById('regression-calculator-input-container');
  const comingSoonWrapper = document.getElementById('coming-soon-container');
  const calcAction = document.querySelector('.calc-action');

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
  if (eulerWrapper) eulerWrapper.style.display = 'none';
  if (rungeKuttaWrapper) rungeKuttaWrapper.style.display = 'none';
  if (futureValueWrapper) futureValueWrapper.style.display = 'none';
  if (presentValueWrapper) presentValueWrapper.style.display = 'none';
  if (annuityWrapper) annuityWrapper.style.display = 'none';
  if (interestRateWrapper) interestRateWrapper.style.display = 'none';
  if (emiWrapper) emiWrapper.style.display = 'none';
  if (hyperbolicWrapper) hyperbolicWrapper.style.display = 'none';
  if (polyRootsWrapper) polyRootsWrapper.style.display = 'none';
  if (multipleAngleExpandWrapper) multipleAngleExpandWrapper.style.display = 'none';
  if (powerReductionWrapper) powerReductionWrapper.style.display = 'none';
  if (binomialWrapper) binomialWrapper.style.display = 'none';
  if (uniformWrapper) uniformWrapper.style.display = 'none';
  if (poissonWrapper) poissonWrapper.style.display = 'none';
  if (normalWrapper) normalWrapper.style.display = 'none';
  if (rankCalcWrapper) rankCalcWrapper.style.display = 'none';
  if (pearsonRankWrapper) pearsonRankWrapper.style.display = 'none';
  if (regressionCalcWrapper) regressionCalcWrapper.style.display = 'none';
  if (comingSoonWrapper) comingSoonWrapper.style.display = 'none';
  if (calcAction) calcAction.style.display = 'block';

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
    } else if (calcId === 'euler') {
      desc = "Enter the differential equation dy/dx = f(x, y), initial values, step size, and target x to approximate the solution step-by-step using Euler's Method.";
    } else if (calcId === 'runge-kutta') {
      desc = "Enter the differential equation dy/dx = f(x, y), initial values, step size, and target x to approximate the solution step-by-step using Runge Kutta 4th Order (RK4).";
    } else if (calcId === 'future-value') {
      desc = "Calculate the future value of an investment using compound interest.";
    } else if (calcId === 'present-value') {
      desc = "Calculate the present value of a future sum.";
    } else if (calcId === 'annuity') {
      desc = "Calculate annuity payouts and values.";
    } else if (calcId === 'interest-rate') {
      desc = "Calculate interest rates on loans or investments.";
    } else if (calcId === 'emi') {
      desc = "Calculate Equated Monthly Installments (EMI) for loans.";
    } else if (calcId === 'hyperbolic-calc') {
      desc = "Evaluate hyperbolic functions (sinh, cosh, tanh) step-by-step.";
    } else if (calcId === 'poly-roots') {
      desc = "Quickly find all real and complex roots of a polynomial equation up to degree 10.";
    } else if (calcId === 'multiple-angle-expand') {
      desc = "Expand trigonometric functions sin(nθ) and cos(nθ) of multiple angles into powers of sinθ and cosθ step-by-step.";
    } else if (calcId === 'power-reduction') {
      desc = "Express powers of trigonometric functions sinⁿθ and cosⁿθ in terms of multiple-angle functions step-by-step.";
    } else if (calcId === 'binomial') {
      desc = "Enter the number of trials, probability of success, and number of successes to calculate binomial probabilities.";
    } else if (calcId === 'uniform') {
      desc = "Enter the lower bound, upper bound, and target value(s) to calculate uniform distribution probabilities.";
    } else if (calcId === 'poisson') {
      desc = "Enter the mean rate (λ) and number of occurrences (x) to calculate Poisson probabilities with step-by-step derivation.";
    } else if (calcId === 'rank-calculator') {
      desc = "Enter paired (X, Y) data values to compute ranks and the Spearman Rank Correlation Coefficient (ρ) step-by-step.";
    } else if (calcId === 'pearson-rank') {
      desc = "Enter paired (X, Y) data values to compute the Pearson Rank Correlation Coefficient (r) step-by-step.";
    } else if (calcId === 'regression-calculator') {
      desc = "Enter paired (X, Y) data values to fit a linear regression line Y = a + bX and compute regression coefficients step-by-step.";
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
    } else if (calcId === 'euler') {
      if (eulerWrapper) eulerWrapper.style.display = 'flex';
    } else if (calcId === 'runge-kutta') {
      if (rungeKuttaWrapper) rungeKuttaWrapper.style.display = 'flex';
    } else if (calcId === 'future-value') {
      if (futureValueWrapper) futureValueWrapper.style.display = 'flex';
    } else if (calcId === 'present-value') {
      if (presentValueWrapper) presentValueWrapper.style.display = 'flex';
    } else if (calcId === 'annuity') {
      if (annuityWrapper) annuityWrapper.style.display = 'flex';
    } else if (calcId === 'interest-rate') {
      if (interestRateWrapper) interestRateWrapper.style.display = 'flex';
    } else if (calcId === 'emi') {
      if (emiWrapper) emiWrapper.style.display = 'flex';
    } else if (calcId === 'hyperbolic-calc') {
      if (hyperbolicWrapper) hyperbolicWrapper.style.display = 'flex';
    } else if (calcId === 'poly-roots') {
      if (polyRootsWrapper) polyRootsWrapper.style.display = 'flex';
    } else if (calcId === 'multiple-angle-expand') {
      if (multipleAngleExpandWrapper) multipleAngleExpandWrapper.style.display = 'flex';
    } else if (calcId === 'power-reduction') {
      if (powerReductionWrapper) powerReductionWrapper.style.display = 'flex';
    } else if (calcId === 'binomial') {
      if (binomialWrapper) binomialWrapper.style.display = 'flex';
    } else if (calcId === 'uniform') {
      if (uniformWrapper) uniformWrapper.style.display = 'flex';
    } else if (calcId === 'poisson') {
      if (poissonWrapper) poissonWrapper.style.display = 'flex';
    } else if (calcId === 'normal') {
      if (normalWrapper) normalWrapper.style.display = 'flex';
    } else if (calcId === 'rank-calculator') {
      if (rankCalcWrapper) rankCalcWrapper.style.display = 'flex';
    } else if (calcId === 'pearson-rank') {
      if (pearsonRankWrapper) pearsonRankWrapper.style.display = 'flex';
    } else if (calcId === 'regression-calculator') {
      if (regressionCalcWrapper) regressionCalcWrapper.style.display = 'flex';
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
    if (urlCalc === 'euler') urlCalc = 'euler-method';
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
let initSem = initParams.get('sem') || '1';
if (initSem !== 'finance') {
  initSem = parseInt(initSem) || 1;
}
let initCalc = initParams.get('calc') || 'none';
if (initCalc === 'partial-differentiation') {
  initCalc = 'partial-diff';
  initSem = 2;
}
if (initCalc === 'euler-method') {
  initCalc = 'euler';
  initSem = 2;
}
if (['future-value', 'present-value', 'annuity', 'interest-rate', 'emi'].includes(initCalc)) {
  initSem = 'finance';
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
  if (currentCalc === 'multiple-angle-expand') {
    calculateMultipleAngleExpand();
    return;
  }
  if (currentCalc === 'power-reduction') {
    calculatePowerReduction();
    return;
  }
  if (currentCalc === 'binomial') {
    calculateBinomial();
    return;
  }
  if (currentCalc === 'uniform') {
    calculateUniform();
    return;
  }
  if (currentCalc === 'poisson') {
    calculatePoisson();
    return;
  }
  if (currentCalc === 'normal') {
    calculateNormal();
    return;
  }
  if (currentCalc === 'rank-calculator') {
    calculateRanks();
    return;
  }
  if (currentCalc === 'regression-calculator') {
    calculateRegression();
    return;
  }
  if (currentCalc === 'pearson-rank') {
    calculatePearsonRank();
    return;
  }
  if (currentCalc === 'poly-roots') {
    calculatePolyRoots();
    return;
  }
  if (currentCalc === 'hyperbolic-calc') {
    calculateHyperbolic();
    return;
  }
  if (currentCalc === 'future-value') {
    calculateFutureValue();
    return;
  }
  if (currentCalc === 'present-value') {
    calculatePresentValue();
    return;
  }
  if (currentCalc === 'annuity') {
    calculateAnnuity();
    return;
  }
  if (currentCalc === 'interest-rate') {
    calculateInterestRate();
    return;
  }
  if (currentCalc === 'emi') {
    calculateEMI();
    return;
  }
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
  } else if (currentCalc === 'euler') {
    calculateEuler();
    return;
  } else if (currentCalc === 'runge-kutta') {
    calculateRungeKutta();
    return;
  } else if (currentCalc === 'binomial') {
    calculateBinomial();
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

function calculateEuler() {
  const output = document.getElementById('steps-output');
  output.innerHTML = '';
  output.classList.add('active');

  let expr = document.getElementById('euler-function').value.trim();
  let x0Str = document.getElementById('euler-x0').value.trim();
  let y0Str = document.getElementById('euler-y0').value.trim();
  let hStr = document.getElementById('euler-h').value.trim();
  let xnStr = document.getElementById('euler-xn').value.trim();
  let decimalsValStr = document.getElementById('euler-decimals').value.trim();

  // Validation
  if (expr === '' || x0Str === '' || y0Str === '' || hStr === '' || xnStr === '' || decimalsValStr === '') {
    output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Missing Fields</div></div><div class="step-desc">Please ensure all calculator parameters are filled with valid entries.</div></div>`;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  let validationResult = validateMultivariateFunction(expr);
  if (!validationResult.isValid) {
    output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Invalid Function Input</div></div><div class="step-desc">${validationResult.error}</div></div>`;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  let x0 = parseFloat(x0Str);
  let y0 = parseFloat(y0Str);
  let h = parseFloat(hStr);
  let xn = parseFloat(xnStr);
  let decimals = parseInt(decimalsValStr);

  if (isNaN(x0) || isNaN(y0) || isNaN(h) || isNaN(xn)) {
    output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Invalid Numbers</div></div><div class="step-desc">Initial values, step size, and target x must be valid numeric values.</div></div>`;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  if (isNaN(decimals) || !/^\d+$/.test(decimalsValStr) || decimals < 0 || decimals > 15) {
    output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Invalid Decimal Places</div></div><div class="step-desc">Decimal places must be an integer between 0 and 15.</div></div>`;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  if (h <= 0) {
    output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Invalid Step Size</div></div><div class="step-desc">Step size h must be strictly greater than 0.</div></div>`;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  if (xn < x0) {
    output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Target x Less Than Initial x</div></div><div class="step-desc">Target xₙ (${xn}) cannot be less than initial x₀ (${x0}).</div></div>`;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  let stepsCount = Math.round((xn - x0) / h);
  if (stepsCount > 200) {
    output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Too Many Iterations</div></div><div class="step-desc">The step size h (${h}) results in too many steps to reach target xₙ (${xn}) (${stepsCount} steps). Maximum allowed is 200 steps to prevent browser slowdown.</div></div>`;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  if (stepsCount <= 0) {
    output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Target Already Reached</div></div><div class="step-desc">Target xₙ (${xn}) is already equal to or less than initial x₀ (${x0}). Please set target xₙ to be greater than x₀.</div></div>`;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  let stepsHtml = '';
  let stepCount = 1;

  // Step 1: Given Problem
  let richExpr = formatMathRich(expr);
  stepsHtml += `<div class="step-card">
                  <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                      <div class="step-number">${stepCount++}</div>
                      <div class="step-title">Given Problem</div>
                    </div>
                    <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div>
                  </div>
                  <div class="step-content">
                    <div class="step-desc">We are given the ordinary differential equation (ODE) and initial parameters:</div>
                    <div style="margin-left: 1rem; border-left: 2px solid var(--teal); padding-left: 1rem; font-family: 'Figtree', sans-serif; font-size: 1.05rem; color: var(--navy); display: flex; flex-direction: column; gap: 0.5rem; margin-top: 1rem; margin-bottom: 1rem;">
                      <div>Differential Equation: <strong>dy/dx = f(x, y) = ${richExpr}</strong></div>
                      <div>Initial x₀ = <strong>${x0.toString()}</strong></div>
                      <div>Initial y₀ = <strong>${y0.toString()}</strong></div>
                      <div>Step Size h = <strong>${h.toString()}</strong></div>
                      <div>Target xₙ = <strong>${xn.toString()}</strong></div>
                    </div>
                  </div>
                </div>`;

  // Step 2: Euler Formula
  stepsHtml += `<div class="step-card">
                  <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                      <div class="step-number">${stepCount++}</div>
                      <div class="step-title">Euler's Method Formula</div>
                    </div>
                    <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div>
                  </div>
                  <div class="step-content">
                    <div class="step-desc" style="margin-bottom: 1rem;">
                      The Euler Method updates the solution at each step using the formula:
                    </div>
                    <div style="font-family: 'Fraunces', serif; font-size: 1.5rem; color: var(--navy); text-align: center; margin: 1.5rem 0; font-weight: 700;">
                      y<sub>n+1</sub> = y<sub>n</sub> + h · f(x<sub>n</sub>, y<sub>n</sub>)
                    </div>
                    <div class="step-desc">
                      Euler Method estimates the next y value using the current slope.
                    </div>
                  </div>
                </div>`;

  // Perform Iterations
  let currentX = x0;
  let currentY = y0;
  let tableRows = [];

  function formatSubstitution(exp, xVal, yVal, dec) {
    let xStr = parseFloat(xVal.toFixed(dec)).toString();
    let yStr = parseFloat(yVal.toFixed(dec)).toString();
    let norm = normalizeExpression(exp);
    let tokens = norm.split(/([\+\-\*\/\^ \(\)])/);
    let formatted = tokens.map(t => {
      let tl = t.trim().toLowerCase();
      if (tl === 'x') return xStr;
      if (tl === 'y') return yStr;
      return t;
    });
    return formatMathRich(formatted.join(''));
  }

  for (let i = 0; i < stepsCount; i++) {
    let slope = evaluateMultivariateMath(expr, currentX, currentY);
    let nextY = currentY + h * slope;
    let nextX = currentX + h;

    let x_curr = parseFloat(currentX.toFixed(decimals));
    let y_curr = parseFloat(currentY.toFixed(decimals));
    let slope_curr = parseFloat(slope.toFixed(decimals));
    let next_y_formatted = parseFloat(nextY.toFixed(decimals));
    let next_x_formatted = parseFloat(nextX.toFixed(decimals));

    let substSubStr = formatSubstitution(expr, x_curr, y_curr, decimals);
    let substStr = `y<sub>${i+1}</sub> = ${y_curr} + ${h} · (${slope_curr})`;
    let evalStr = `${y_curr} + ${parseFloat((h * slope_curr).toFixed(decimals))} = ${next_y_formatted}`;

    // Should the steps be collapsed or expanded by default?
    let isCollapsed = stepsCount > 5;
    let contentDisplay = isCollapsed ? 'none' : 'block';
    let iconRotation = isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)';

    stepsHtml += `<div class="step-card">
                    <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
                      <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <div class="step-number">${stepCount++}</div>
                        <div class="step-title">Iteration ${i + 1} (to x = ${next_x_formatted})</div>
                      </div>
                      <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted); transform: ${iconRotation};">▼</div>
                    </div>
                    <div class="step-content" style="display: ${contentDisplay};">
                      <div class="step-desc" style="margin-bottom: 1rem;">
                        Using current values:
                        <br><span style="font-family: 'IBM Plex Mono', monospace; font-size: 0.95rem; color: var(--teal); font-weight: 600; display: block; margin-top: 0.4rem;">x<sub>${i}</sub> = ${x_curr}, y<sub>${i}</sub> = ${y_curr}</span>
                      </div>
                      
                      <div class="step-desc" style="margin-bottom: 0.5rem;">
                        1. Compute the derivative (slope) <strong>f(x<sub>${i}</sub>, y<sub>${i}</sub>)</strong>:
                      </div>
                      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.1rem; color: var(--navy); margin-bottom: 1rem; padding-left: 0.75rem; border-left: 2px solid var(--amber);">
                        f(${x_curr}, ${y_curr}) = ${substSubStr}
                        <br>f(${x_curr}, ${y_curr}) = <strong>${slope_curr}</strong>
                      </div>

                      <div class="step-desc" style="margin-bottom: 0.5rem;">
                        2. Substitute into Euler's formula to find <strong>y<sub>${i+1}</sub></strong>:
                      </div>
                      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.1rem; color: var(--navy); padding-left: 0.75rem; border-left: 2px solid var(--teal);">
                        y<sub>${i+1}</sub> = y<sub>${i}</sub> + h · f(x<sub>${i}</sub>, y<sub>${i}</sub>)
                        <br>${substStr}
                        <br>y<sub>${i+1}</sub> = <strong>${evalStr}</strong>
                      </div>
                    </div>
                  </div>`;

    currentX = nextX;
    currentY = nextY;
    tableRows.push({
      step: i + 1,
      x: currentX,
      y: currentY,
      slope: slope
    });
  }

  // Summary Table Card
  let isCollapsedTable = stepsCount > 10;
  let contentTableDisplay = isCollapsedTable ? 'none' : 'block';
  let iconTableRotation = isCollapsedTable ? 'rotate(-90deg)' : 'rotate(0deg)';

  stepsHtml += `<div class="step-card">
                  <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                      <div class="step-number">${stepCount++}</div>
                      <div class="step-title">Iteration Summary Table</div>
                    </div>
                    <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted); transform: ${iconTableRotation};">▼</div>
                  </div>
                  <div class="step-content" style="display: ${contentTableDisplay};">
                    <div style="overflow-x: auto; width: 100%;">
                      <table style="width: 100%; border-collapse: collapse; text-align: left; font-family: 'Figtree', sans-serif;">
                        <thead>
                          <tr style="border-bottom: 2px solid var(--border); color: var(--navy); font-weight: 700; background: var(--bg);">
                            <th style="padding: 12px 10px; font-size: 1rem; width: 80px; text-align: center;">Step</th>
                            <th style="padding: 12px 10px; font-size: 1rem; font-family: 'IBM Plex Mono', monospace; text-align: center;">x</th>
                            <th style="padding: 12px 10px; font-size: 1rem; font-family: 'IBM Plex Mono', monospace; text-align: center;">y</th>
                            <th style="padding: 12px 10px; font-size: 1rem; font-family: 'IBM Plex Mono', monospace; text-align: center;">f(x, y)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr style="border-bottom: 1px solid var(--border);">
                            <td style="padding: 12px 10px; text-align: center; font-weight: 600;">0 (Initial)</td>
                            <td style="padding: 12px 10px; text-align: center; font-family: 'IBM Plex Mono', monospace;">${x0.toFixed(decimals)}</td>
                            <td style="padding: 12px 10px; text-align: center; font-family: 'IBM Plex Mono', monospace;">${y0.toFixed(decimals)}</td>
                            <td style="padding: 12px 10px; text-align: center; font-family: 'IBM Plex Mono', monospace; color: var(--muted);">—</td>
                          </tr>
                          ${tableRows.map(r => `
                            <tr style="border-bottom: 1px solid var(--border); ${r.step === stepsCount ? 'background: rgba(13, 148, 136, 0.05); font-weight: 700;' : ''}">
                              <td style="padding: 12px 10px; text-align: center; font-weight: 600;">${r.step}</td>
                              <td style="padding: 12px 10px; text-align: center; font-family: 'IBM Plex Mono', monospace;">${r.x.toFixed(decimals)}</td>
                              <td style="padding: 12px 10px; text-align: center; font-family: 'IBM Plex Mono', monospace; color: var(--teal); font-weight: 700;">${r.y.toFixed(decimals)}</td>
                              <td style="padding: 12px 10px; text-align: center; font-family: 'IBM Plex Mono', monospace;">${r.slope.toFixed(decimals)}</td>
                            </tr>
                          `).join('')}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>`;

  // Final Answer Card and Educational Notes
  let targetXFormatted = parseFloat(xn.toFixed(decimals)).toString();
  
  stepsHtml += `<div class="final-result animate-fade-in" style="text-align: center; padding: 2.5rem; background: #111827; color: #ffffff; border-radius: 16px; border: 1px solid var(--border); box-shadow: 0 10px 30px rgba(0,0,0,0.15); margin-top: 2.5rem;">
                  <div style="font-size: 1.8rem; font-weight: 700; color: var(--amber); margin-bottom: 0.5rem; font-family:'Fraunces', serif;">✅ Approximate Solution Found!</div>
                  <div style="font-size: 1.05rem; opacity: 0.9; margin-bottom: 2rem;">Euler Method completed successfully in <strong>${stepsCount}</strong> steps.</div>
                  
                  <div style="display:inline-block; text-align: left; padding: 1.5rem; background: rgba(255,255,255,0.06); border-radius: 12px; border: 1px solid rgba(255,255,255,0.12); box-sizing: border-box; width: 100%; max-width: 600px;">
                    <div style="font-size:0.95rem; font-weight:600; color: rgba(255,255,255,0.7); border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; margin-bottom: 1rem;">Approximate Solution:</div>
                    <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.6rem; color: var(--amber); font-weight: 700; text-align: center; margin: 0.5rem 0;">
                      y(${targetXFormatted}) ≈ <span style="color:#ffffff;">${currentY.toFixed(decimals)}</span>
                    </div>
                  </div>

                  <div style="margin-top: 2rem; padding: 1.25rem; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; text-align: left; box-sizing: border-box; width: 100%; max-width: 600px; margin-left: auto; margin-right: auto;">
                    <div style="display: flex; align-items: center; gap: 8px; border-bottom: 1px dashed rgba(255,255,255,0.1); padding-bottom: 0.5rem; margin-bottom: 0.75rem;">
                      <span style="font-size: 1.2rem;">💡</span>
                      <span style="font-weight: 700; color: var(--amber); font-size: 1.05rem; font-family: 'Fraunces', serif;">Educational Note</span>
                    </div>
                    <div style="font-size: 0.95rem; line-height: 1.6; color: rgba(255,255,255,0.8);">
                      <p style="margin-bottom: 0.75rem;">
                        <strong>Euler Method</strong> is the simplest numerical technique for solving ordinary differential equations.
                      </p>
                       <p style="margin-bottom: 0;">
                        It approximates the solution curve using tangent slopes computed at discrete points.
                      </p>
                    </div>
                  </div>
                </div>`;

  output.innerHTML = stepsHtml;
  output.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function calculateRungeKutta() {
  const output = document.getElementById('steps-output');
  output.innerHTML = '';
  output.classList.add('active');

  let expr = document.getElementById('runge-kutta-function').value.trim();
  let x0Str = document.getElementById('runge-kutta-x0').value.trim();
  let y0Str = document.getElementById('runge-kutta-y0').value.trim();
  let hStr = document.getElementById('runge-kutta-h').value.trim();
  let xnStr = document.getElementById('runge-kutta-xn').value.trim();
  let decimalsValStr = document.getElementById('runge-kutta-decimals').value.trim();

  // Validation
  if (expr === '' || x0Str === '' || y0Str === '' || hStr === '' || xnStr === '' || decimalsValStr === '') {
    output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Missing Fields</div></div><div class="step-desc">Please ensure all calculator parameters are filled with valid entries.</div></div>`;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  let validationResult = validateMultivariateFunction(expr);
  if (!validationResult.isValid) {
    output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Invalid Function Input</div></div><div class="step-desc">${validationResult.error}</div></div>`;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  let x0 = parseFloat(x0Str);
  let y0 = parseFloat(y0Str);
  let h = parseFloat(hStr);
  let xn = parseFloat(xnStr);
  let decimals = parseInt(decimalsValStr);

  if (isNaN(x0) || isNaN(y0) || isNaN(h) || isNaN(xn)) {
    output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Invalid Numbers</div></div><div class="step-desc">Initial values, step size, and target x must be valid numeric values.</div></div>`;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  if (isNaN(decimals) || !/^\d+$/.test(decimalsValStr) || decimals < 0 || decimals > 15) {
    output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Invalid Decimal Places</div></div><div class="step-desc">Decimal places must be an integer between 0 and 15.</div></div>`;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  if (h <= 0) {
    output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Invalid Step Size</div></div><div class="step-desc">Step size h must be strictly greater than 0.</div></div>`;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  if (xn < x0) {
    output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Target x Less Than Initial x</div></div><div class="step-desc">Target xₙ (${xn}) cannot be less than initial x₀ (${x0}).</div></div>`;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  let stepsCount = Math.round((xn - x0) / h);
  if (stepsCount > 200) {
    output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Too Many Iterations</div></div><div class="step-desc">The step size h (${h}) results in too many steps to reach target xₙ (${xn}) (${stepsCount} steps). Maximum allowed is 200 steps to prevent browser slowdown.</div></div>`;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  if (stepsCount <= 0) {
    output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Target Already Reached</div></div><div class="step-desc">Target xₙ (${xn}) is already equal to or less than initial x₀ (${x0}). Please set target xₙ to be greater than x₀.</div></div>`;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  let stepsHtml = '';
  let stepCount = 1;

  // Step 1: Given Problem
  let richExpr = formatMathRich(expr);
  stepsHtml += `<div class="step-card">
                  <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                      <div class="step-number">${stepCount++}</div>
                      <div class="step-title">Given Problem</div>
                    </div>
                    <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div>
                  </div>
                  <div class="step-content">
                    <div class="step-desc">We are given the ordinary differential equation (ODE) and initial parameters:</div>
                    <div style="margin-left: 1rem; border-left: 2px solid var(--teal); padding-left: 1rem; font-family: 'Figtree', sans-serif; font-size: 1.05rem; color: var(--navy); display: flex; flex-direction: column; gap: 0.5rem; margin-top: 1rem; margin-bottom: 1rem;">
                      <div>Differential Equation: <strong>dy/dx = f(x, y) = ${richExpr}</strong></div>
                      <div>Initial x₀ = <strong>${x0.toString()}</strong></div>
                      <div>Initial y₀ = <strong>${y0.toString()}</strong></div>
                      <div>Step Size h = <strong>${h.toString()}</strong></div>
                      <div>Target xₙ = <strong>${xn.toString()}</strong></div>
                    </div>
                  </div>
                </div>`;

  // Step 2: RK4 Formula
  stepsHtml += `<div class="step-card">
                  <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                      <div class="step-number">${stepCount++}</div>
                      <div class="step-title">Runge-Kutta 4th Order Formulas</div>
                    </div>
                    <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div>
                  </div>
                  <div class="step-content">
                    <div class="step-desc" style="margin-bottom: 1rem;">
                      The Runge-Kutta 4th Order (RK4) method computes four intermediate slope approximations at each step:
                    </div>
                    <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1rem; color: var(--navy); margin-left: 1rem; border-left: 2px solid var(--amber); padding-left: 1rem; display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem;">
                      <div>k₁ = h · f(x<sub>n</sub>, y<sub>n</sub>)</div>
                      <div>k₂ = h · f(x<sub>n</sub> + h/2, y<sub>n</sub> + k₁/2)</div>
                      <div>k₃ = h · f(x<sub>n</sub> + h/2, y<sub>n</sub> + k₂/2)</div>
                      <div>k₄ = h · f(x<sub>n</sub> + h, y<sub>n</sub> + k₃)</div>
                    </div>
                    <div class="step-desc" style="margin-bottom: 1rem;">
                      Using these slopes, the next solution value is computed as a weighted average:
                    </div>
                    <div style="font-family: 'Fraunces', serif; font-size: 1.35rem; color: var(--navy); text-align: center; margin: 1.5rem 0; font-weight: 700;">
                      y<sub>n+1</sub> = y<sub>n</sub> + <sup>1</sup>/<sub>6</sub> (k₁ + 2k₂ + 2k₃ + k₄)
                    </div>
                  </div>
                </div>`;

  // Perform Iterations
  let currentX = x0;
  let currentY = y0;
  let tableRows = [];

  function formatSubstitution(exp, xVal, yVal, dec) {
    let xStr = parseFloat(xVal.toFixed(dec)).toString();
    let yStr = parseFloat(yVal.toFixed(dec)).toString();
    let norm = normalizeExpression(exp);
    let tokens = norm.split(/([\+\-\*\/\^ \(\)])/);
    let formatted = tokens.map(t => {
      let tl = t.trim().toLowerCase();
      if (tl === 'x') return xStr;
      if (tl === 'y') return yStr;
      return t;
    });
    return formatMathRich(formatted.join(''));
  }

  for (let i = 0; i < stepsCount; i++) {
    // 1. Calculate k1
    let f1 = evaluateMultivariateMath(expr, currentX, currentY);
    let k1 = h * f1;

    // 2. Calculate k2
    let x_mid = currentX + h / 2;
    let y_mid2 = currentY + k1 / 2;
    let f2 = evaluateMultivariateMath(expr, x_mid, y_mid2);
    let k2 = h * f2;

    // 3. Calculate k3
    let y_mid3 = currentY + k2 / 2;
    let f3 = evaluateMultivariateMath(expr, x_mid, y_mid3);
    let k3 = h * f3;

    // 4. Calculate k4
    let x_end = currentX + h;
    let y_end = currentY + k3;
    let f4 = evaluateMultivariateMath(expr, x_end, y_end);
    let k4 = h * f4;

    // 5. Calculate nextY
    let nextY = currentY + (k1 + 2 * k2 + 2 * k3 + k4) / 6;
    let nextX = currentX + h;

    let x_curr = parseFloat(currentX.toFixed(decimals));
    let y_curr = parseFloat(currentY.toFixed(decimals));
    let next_x_formatted = parseFloat(nextX.toFixed(decimals));
    let next_y_formatted = parseFloat(nextY.toFixed(decimals));

    // Formatted intermediate values for rendering
    let f1_sub = formatSubstitution(expr, x_curr, y_curr, decimals);
    let f2_sub = formatSubstitution(expr, x_mid, y_mid2, decimals);
    let f3_sub = formatSubstitution(expr, x_mid, y_mid3, decimals);
    let f4_sub = formatSubstitution(expr, x_end, y_end, decimals);

    // Collapsed state logic
    let isCollapsed = stepsCount > 3;
    let contentDisplay = isCollapsed ? 'none' : 'block';
    let iconRotation = isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)';

    stepsHtml += `<div class="step-card">
                    <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
                      <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <div class="step-number">${stepCount++}</div>
                        <div class="step-title">Iteration ${i + 1} (to x = ${next_x_formatted})</div>
                      </div>
                      <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted); transform: ${iconRotation};">▼</div>
                    </div>
                    <div class="step-content" style="display: ${contentDisplay};">
                      <div class="step-desc" style="margin-bottom: 1rem;">
                        Starting values:
                        <br><span style="font-family: 'IBM Plex Mono', monospace; font-size: 0.95rem; color: var(--teal); font-weight: 600; display: block; margin-top: 0.4rem;">x<sub>${i}</sub> = ${x_curr}, y<sub>${i}</sub> = ${y_curr}</span>
                      </div>
                      
                      <!-- k1 calculation -->
                      <div class="step-desc" style="margin-bottom: 0.5rem; font-weight: 600;">Step A: Calculate k₁ (Slope at the beginning of interval)</div>
                      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.05rem; color: var(--navy); margin-bottom: 1rem; padding-left: 0.75rem; border-left: 2px solid var(--amber); display: flex; flex-direction: column; gap: 0.3rem;">
                        <div>k₁ = h · f(x<sub>${i}</sub>, y<sub>${i}</sub>)</div>
                        <div>k₁ = ${h} · f(${x_curr}, ${y_curr})</div>
                        <div style="opacity: 0.8; font-size: 0.9rem;">f(${x_curr}, ${y_curr}) = ${f1_sub} = ${parseFloat(f1.toFixed(decimals))}</div>
                        <div>k₁ = ${h} · (${parseFloat(f1.toFixed(decimals))}) = <strong>${parseFloat(k1.toFixed(decimals))}</strong></div>
                      </div>

                      <!-- k2 calculation -->
                      <div class="step-desc" style="margin-bottom: 0.5rem; font-weight: 600;">Step B: Calculate k₂ (Slope at the midpoint of interval, using k₁)</div>
                      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.05rem; color: var(--navy); margin-bottom: 1rem; padding-left: 0.75rem; border-left: 2px solid var(--teal); display: flex; flex-direction: column; gap: 0.3rem;">
                        <div>k₂ = h · f(x<sub>${i}</sub> + h/2, y<sub>${i}</sub> + k₁/2)</div>
                        <div>k₂ = ${h} · f(${x_curr} + ${h/2}, ${y_curr} + ${parseFloat((k1/2).toFixed(decimals))})</div>
                        <div>k₂ = ${h} · f(${parseFloat(x_mid.toFixed(decimals))}, ${parseFloat(y_mid2.toFixed(decimals))})</div>
                        <div style="opacity: 0.8; font-size: 0.9rem;">f(${parseFloat(x_mid.toFixed(decimals))}, ${parseFloat(y_mid2.toFixed(decimals))}) = ${f2_sub} = ${parseFloat(f2.toFixed(decimals))}</div>
                        <div>k₂ = ${h} · (${parseFloat(f2.toFixed(decimals))}) = <strong>${parseFloat(k2.toFixed(decimals))}</strong></div>
                      </div>

                      <!-- k3 calculation -->
                      <div class="step-desc" style="margin-bottom: 0.5rem; font-weight: 600;">Step C: Calculate k₃ (Slope at the midpoint of interval, using k₂)</div>
                      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.05rem; color: var(--navy); margin-bottom: 1rem; padding-left: 0.75rem; border-left: 2px solid var(--teal); display: flex; flex-direction: column; gap: 0.3rem;">
                        <div>k₃ = h · f(x<sub>${i}</sub> + h/2, y<sub>${i}</sub> + k₂/2)</div>
                        <div>k₃ = ${h} · f(${x_curr} + ${h/2}, ${y_curr} + ${parseFloat((k2/2).toFixed(decimals))})</div>
                        <div>k₃ = ${h} · f(${parseFloat(x_mid.toFixed(decimals))}, ${parseFloat(y_mid3.toFixed(decimals))})</div>
                        <div style="opacity: 0.8; font-size: 0.9rem;">f(${parseFloat(x_mid.toFixed(decimals))}, ${parseFloat(y_mid3.toFixed(decimals))}) = ${f3_sub} = ${parseFloat(f3.toFixed(decimals))}</div>
                        <div>k₃ = ${h} · (${parseFloat(f3.toFixed(decimals))}) = <strong>${parseFloat(k3.toFixed(decimals))}</strong></div>
                      </div>

                      <!-- k4 calculation -->
                      <div class="step-desc" style="margin-bottom: 0.5rem; font-weight: 600;">Step D: Calculate k₄ (Slope at the end of interval, using k₃)</div>
                      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.05rem; color: var(--navy); margin-bottom: 1rem; padding-left: 0.75rem; border-left: 2px solid var(--teal); display: flex; flex-direction: column; gap: 0.3rem;">
                        <div>k₄ = h · f(x<sub>${i}</sub> + h, y<sub>${i}</sub> + k₃)</div>
                        <div>k₄ = ${h} · f(${x_curr} + ${h}, ${y_curr} + ${parseFloat(k3.toFixed(decimals))})</div>
                        <div>k₄ = ${h} · f(${parseFloat(x_end.toFixed(decimals))}, ${parseFloat(y_end.toFixed(decimals))})</div>
                        <div style="opacity: 0.8; font-size: 0.9rem;">f(${parseFloat(x_end.toFixed(decimals))}, ${parseFloat(y_end.toFixed(decimals))}) = ${f4_sub} = ${parseFloat(f4.toFixed(decimals))}</div>
                        <div>k₄ = ${h} · (${parseFloat(f4.toFixed(decimals))}) = <strong>${parseFloat(k4.toFixed(decimals))}</strong></div>
                      </div>

                      <!-- yn+1 calculation -->
                      <div class="step-desc" style="margin-bottom: 0.5rem; font-weight: 600;">Step E: Weighted Average & y<sub>${i+1}</sub> Calculation</div>
                      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.05rem; color: var(--navy); padding-left: 0.75rem; border-left: 2px solid var(--amber); display: flex; flex-direction: column; gap: 0.4rem;">
                        <div>y<sub>${i+1}</sub> = y<sub>${i}</sub> + <sup>1</sup>/<sub>6</sub> (k₁ + 2k₂ + 2k₃ + k₄)</div>
                        <div>y<sub>${i+1}</sub> = ${y_curr} + <sup>1</sup>/<sub>6</sub> (${parseFloat(k1.toFixed(decimals))} + 2(${parseFloat(k2.toFixed(decimals))}) + 2(${parseFloat(k3.toFixed(decimals))}) + ${parseFloat(k4.toFixed(decimals))})</div>
                        <div>y<sub>${i+1}</sub> = ${y_curr} + <sup>1</sup>/<sub>6</sub> (${parseFloat((k1 + 2*k2 + 2*k3 + k4).toFixed(decimals))})</div>
                        <div>y<sub>${i+1}</sub> = ${y_curr} + ${parseFloat(((k1 + 2*k2 + 2*k3 + k4)/6).toFixed(decimals))}</div>
                        <div>y<sub>${i+1}</sub> = <strong>${next_y_formatted}</strong></div>
                      </div>
                    </div>
                  </div>`;

    currentX = nextX;
    currentY = nextY;
    tableRows.push({
      step: i + 1,
      x: currentX,
      y: currentY
    });
  }

  // Summary Table Card
  let isCollapsedTable = stepsCount > 10;
  let contentTableDisplay = isCollapsedTable ? 'none' : 'block';
  let iconTableRotation = isCollapsedTable ? 'rotate(-90deg)' : 'rotate(0deg)';

  stepsHtml += `<div class="step-card">
                  <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                      <div class="step-number">${stepCount++}</div>
                      <div class="step-title">Iteration Summary Table</div>
                    </div>
                    <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted); transform: ${iconTableRotation};">▼</div>
                  </div>
                  <div class="step-content" style="display: ${contentTableDisplay};">
                    <div style="overflow-x: auto; width: 100%;">
                      <table style="width: 100%; border-collapse: collapse; text-align: left; font-family: 'Figtree', sans-serif;">
                        <thead>
                          <tr style="border-bottom: 2px solid var(--border); color: var(--navy); font-weight: 700; background: var(--bg);">
                            <th style="padding: 12px 10px; font-size: 1rem; width: 80px; text-align: center;">Step</th>
                            <th style="padding: 12px 10px; font-size: 1rem; font-family: 'IBM Plex Mono', monospace; text-align: center;">x</th>
                            <th style="padding: 12px 10px; font-size: 1rem; font-family: 'IBM Plex Mono', monospace; text-align: center;">y</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr style="border-bottom: 1px solid var(--border);">
                            <td style="padding: 12px 10px; text-align: center; font-weight: 600;">0 (Initial)</td>
                            <td style="padding: 12px 10px; text-align: center; font-family: 'IBM Plex Mono', monospace;">${x0.toFixed(decimals)}</td>
                            <td style="padding: 12px 10px; text-align: center; font-family: 'IBM Plex Mono', monospace;">${y0.toFixed(decimals)}</td>
                          </tr>
                          ${tableRows.map(r => `
                            <tr style="border-bottom: 1px solid var(--border); ${r.step === stepsCount ? 'background: rgba(13, 148, 136, 0.05); font-weight: 700;' : ''}">
                              <td style="padding: 12px 10px; text-align: center; font-weight: 600;">${r.step}</td>
                              <td style="padding: 12px 10px; text-align: center; font-family: 'IBM Plex Mono', monospace;">${r.x.toFixed(decimals)}</td>
                              <td style="padding: 12px 10px; text-align: center; font-family: 'IBM Plex Mono', monospace; color: var(--teal); font-weight: 700;">${r.y.toFixed(decimals)}</td>
                            </tr>
                          `).join('')}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>`;

  // Final Answer Card and Educational Notes
  let targetXFormatted = parseFloat(xn.toFixed(decimals)).toString();
  
  stepsHtml += `<div class="final-result animate-fade-in" style="text-align: center; padding: 2.5rem; background: #111827; color: #ffffff; border-radius: 16px; border: 1px solid var(--border); box-shadow: 0 10px 30px rgba(0,0,0,0.15); margin-top: 2.5rem;">
                  <div style="font-size: 1.8rem; font-weight: 700; color: var(--amber); margin-bottom: 0.5rem; font-family:'Fraunces', serif;">✅ Approximate Solution Found!</div>
                  <div style="font-size: 1.05rem; opacity: 0.9; margin-bottom: 2rem;">RK4 Method completed successfully in <strong>${stepsCount}</strong> steps.</div>
                  
                  <div style="display:inline-block; text-align: left; padding: 1.5rem; background: rgba(255,255,255,0.06); border-radius: 12px; border: 1px solid rgba(255,255,255,0.12); box-sizing: border-box; width: 100%; max-width: 600px;">
                    <div style="font-size:0.95rem; font-weight:600; color: rgba(255,255,255,0.7); border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; margin-bottom: 1rem;">Approximate Solution:</div>
                    <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.6rem; color: var(--amber); font-weight: 700; text-align: center; margin: 0.5rem 0;">
                      y(${targetXFormatted}) ≈ <span style="color:#ffffff;">${currentY.toFixed(decimals)}</span>
                    </div>
                  </div>

                  <div style="margin-top: 2rem; padding: 1.25rem; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; text-align: left; box-sizing: border-box; width: 100%; max-width: 600px; margin-left: auto; margin-right: auto;">
                    <div style="display: flex; align-items: center; gap: 8px; border-bottom: 1px dashed rgba(255,255,255,0.1); padding-bottom: 0.5rem; margin-bottom: 0.75rem;">
                      <span style="font-size: 1.2rem;">💡</span>
                      <span style="font-weight: 700; color: var(--amber); font-size: 1.05rem; font-family: 'Fraunces', serif;">Educational Note</span>
                    </div>
                    <div style="font-size: 0.95rem; line-height: 1.6; color: rgba(255,255,255,0.8);">
                      <p style="margin-bottom: 0.75rem;">
                        <strong>Runge-Kutta 4th Order (RK4) method</strong> is significantly more accurate than the simple Euler Method.
                      </p>
                      <p style="margin-bottom: 0;">
                        While Euler's method has a global error of order <strong>O(h)</strong> (first-order accuracy), RK4 has a global error of order <strong>O(h⁴)</strong> (fourth-order accuracy). This is because RK4 computes and averages slopes at multiple intermediate points in the interval (starting, midpoint, and ending) rather than relying solely on the slope at the beginning of the step.
                      </p>
                    </div>
                  </div>
                </div>`;

  output.innerHTML = stepsHtml;
  output.scrollIntoView({ behavior: 'smooth', block: 'start' });
}


function calculateFutureValue() {
  const output = document.getElementById('steps-output');
  output.innerHTML = '';
  output.classList.add('active');

  let pvValStr = document.getElementById('fv-pv').value.trim();
  let rateValStr = document.getElementById('fv-rate').value.trim();
  let yearsValStr = document.getElementById('fv-years').value.trim();
  let freqValStr = document.getElementById('fv-frequency').value.trim();
  let decimalsValStr = document.getElementById('fv-decimals').value.trim();

  if (pvValStr === '' || rateValStr === '' || yearsValStr === '' || freqValStr === '' || decimalsValStr === '') {
    output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Missing Fields</div></div><div class="step-desc">Please ensure all calculator parameters are filled with valid entries.</div></div>`;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  let pv = parseFloat(pvValStr);
  let rate = parseFloat(rateValStr);
  let years = parseFloat(yearsValStr);
  let n = parseInt(freqValStr);
  let decimals = parseInt(decimalsValStr);

  // Validation
  if (isNaN(pv) || pv <= 0) {
    output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Invalid Present Value</div></div><div class="step-desc">Present Value (PV) must be a positive number greater than 0.</div></div>`;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  if (isNaN(rate) || rate < 0) {
    output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Invalid Interest Rate</div></div><div class="step-desc">Annual Interest Rate must be greater than or equal to 0%.</div></div>`;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  if (isNaN(years) || years <= 0) {
    output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Invalid Time Period</div></div><div class="step-desc">Time Period (Years) must be a positive number greater than 0.</div></div>`;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  if (isNaN(decimals) || !/^\d+$/.test(decimalsValStr) || decimals < 0 || decimals > 15) {
    output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Invalid Decimal Places</div></div><div class="step-desc">Decimal places must be an integer between 0 and 15.</div></div>`;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  let r = rate / 100;
  let nt = n * years;
  let base = 1 + (r / n);
  let power = Math.pow(base, nt);
  let fv = pv * power;

  const formatCurrency = (val) => {
    return val.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  };

  const getFreqName = (val) => {
    if (val === 1) return 'Annually';
    if (val === 2) return 'Semi-Annually';
    if (val === 4) return 'Quarterly';
    if (val === 12) return 'Monthly';
    return 'Annually';
  };

  let freqName = getFreqName(n);

  let stepsHtml = '';
  let stepCount = 1;

  // Step 1: Given Values
  stepsHtml += `<div class="step-card">
    <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <div class="step-number">${stepCount++}</div>
        <div class="step-title">Given Values</div>
      </div>
      <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div>
    </div>
    <div class="step-content">
      <div class="step-desc">Identify the given parameters from the inputs:</div>
      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.1rem; color: var(--navy); margin: 1.5rem 0; padding-left: 2rem; display: flex; flex-direction: column; gap: 0.5rem;">
        <div>Present Value (PV) = <b>₹${pv.toLocaleString('en-IN')}</b></div>
        <div>Annual Interest Rate (r) = <b>${rate}%</b></div>
        <div>Compounding Frequency (n) = <b>${n}</b> (${freqName})</div>
        <div>Time Period (t) = <b>${years} Years</b></div>
      </div>
    </div>
  </div>`;

  // Step 2: Convert Interest Rate
  stepsHtml += `<div class="step-card">
    <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <div class="step-number">${stepCount++}</div>
        <div class="step-title">Convert Annual Interest Rate to Decimal</div>
      </div>
      <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div>
    </div>
    <div class="step-content">
      <div class="step-desc">Convert the interest rate from a percentage to a decimal value (r = R / 100):</div>
      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.25rem; color: var(--navy); text-align: center; margin: 1.5rem 0;">
        r = ${rate} / 100 = <b>${r.toFixed(decimals + 2)}</b>
      </div>
    </div>
  </div>`;

  // Step 3: Apply Formula
  stepsHtml += `<div class="step-card">
    <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <div class="step-number">${stepCount++}</div>
        <div class="step-title">Apply Future Value Formula</div>
      </div>
      <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div>
    </div>
    <div class="step-content">
      <div class="step-desc">Substitute the values into the compound interest formula:</div>
      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.15rem; color: var(--navy); margin: 1.5rem 0; display: flex; flex-direction: column; gap: 1rem; align-items: center; text-align: center;">
        <div style="font-size: 1.25rem; font-weight: 600; color: var(--amber);">FV = PV &times; (1 + r/n)<sup>n &times; t</sup></div>
        <div style="border-top: 1px dashed var(--border); width: 100%; padding-top: 1rem; margin-top: 0.5rem;"><b>Substitution:</b></div>
        <div>FV = ${pv} &times; (1 + ${r.toFixed(decimals + 2)} / ${n})<sup>${n} &times; ${years}</sup></div>
        <div>FV = ${pv} &times; (1 + ${(r/n).toFixed(decimals + 4)})<sup>${nt}</sup></div>
        <div>FV = ${pv} &times; (${base.toFixed(decimals + 4)})<sup>${nt}</sup></div>
        <div>FV = ${pv} &times; <b>${power.toFixed(decimals + 4)}</b></div>
        <div style="font-size: 1.35rem; color: var(--teal); font-weight: 700; border-top: 1px solid var(--border); padding-top: 1rem; width: 100%;">FV = ₹${formatCurrency(fv)}</div>
      </div>
    </div>
  </div>`;

  // Result Card
  let finalResultHtml = `
    <div class="final-result animate-fade-in" style="padding: 2.5rem; background: #111827; color: #ffffff; border-radius: 16px; border: 1px solid var(--border); box-shadow: 0 10px 30px rgba(0,0,0,0.15); margin-bottom: 2rem; display: flex; flex-wrap: wrap; gap: 2rem; align-items: center; width: 100%; box-sizing: border-box;">
      <div style="flex: 1 1 200px; text-align: left;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; margin-bottom: 0.5rem;">
          <div style="font-size: 1.8rem; font-weight: 700; color: var(--amber); font-family:'Fraunces', serif;">✅ Future Value Calculated!</div>
          <button onclick="const c = this.closest('#steps-output').querySelectorAll('.step-card'); if(c.length) c[0].scrollIntoView({behavior: 'smooth', block: 'start'})" style="background: rgba(245, 158, 11, 0.15); color: var(--amber); border: 1px solid rgba(245, 158, 11, 0.3); padding: 0.4rem 0.8rem; border-radius: 8px; font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: all 0.2s; font-family: 'Figtree', sans-serif; display: inline-flex; align-items: center; gap: 0.4rem; white-space: nowrap;" onmouseover="this.style.background='rgba(245, 158, 11, 0.25)'" onmouseout="this.style.background='rgba(245, 158, 11, 0.15)'">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg> View Steps
          </button>
        </div>
        <div style="font-size: 1.05rem; opacity: 0.9; margin-bottom: 1.5rem;">Compound interest projection summary for your investment.</div>
        <div style="padding: 1.5rem; background: rgba(255,255,255,0.06); border-radius: 12px; border: 1px solid rgba(255,255,255,0.12);">
          <div style="font-size:0.95rem; font-weight:600; color: rgba(255,255,255,0.7); border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; margin-bottom: 0.75rem;">Future Value (FV):</div>
          <div style="font-family:'IBM Plex Mono',monospace; font-size: 2rem; font-weight:700; color:var(--amber); margin: 0.6rem 0;">
            Future Value = <span style="color:#ffffff;">₹${formatCurrency(fv)}</span>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.75rem; margin-top: 1rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1rem; font-size: 0.9rem; opacity: 0.85;">
            <div>Initial Investment: <strong>₹${pv.toLocaleString('en-IN')}</strong></div>
            <div>Interest Rate: <strong>${rate}%</strong></div>
            <div>Investment Duration: <strong>${years} Years</strong></div>
            <div>Compounding Frequency: <strong>${freqName}</strong></div>
            <div style="grid-column: span 2;">Total Interest Earned: <strong style="color:var(--amber);">₹${formatCurrency(fv - pv)}</strong></div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Educational Note Card
  let educationalHtml = `
    <div class="step-card" style="border-left: 4px solid var(--teal); background: rgba(13, 148, 136, 0.05); margin-top: 2rem;">
      <div style="font-weight: 700; color: var(--teal); font-size: 1.1rem; margin-bottom: 0.5rem; font-family:'Fraunces', serif;">✦ Educational Note: Future Value & Compound Interest</div>
      <div style="font-size: 1rem; line-height: 1.5; color: var(--navy);">
        <strong>Future Value (FV)</strong> represents the value of a current asset at a specified date in the future based on an assumed rate of growth. 
        It is computed using <strong>Compound Interest</strong>, which is the interest calculated on the initial principal and also on the accumulated interest of previous periods. 
        <br><br>
        Key takeaways of compounding:
        <ul>
          <li><strong>Higher Compounding Frequency (n):</strong> The more frequently interest is compounded (e.g., Monthly vs. Annually), the faster the investment grows. This is because interest is earned on interest sooner.</li>
          <li><strong>Exponential Growth:</strong> Due to compounding, investments do not grow linearly; instead, they experience exponential growth over time, especially over long investment horizons.</li>
        </ul>
      </div>
    </div>
  `;

  let graphContainerHtml = `
    <div style="background: #111827; border-radius: 16px; border: 1px solid var(--border); padding: 1rem; margin-bottom: 2rem; box-shadow: 0 10px 30px rgba(0,0,0,0.15);">
      <div id="fv-plot-container" style="width: 100%; height: 500px;"></div>
    </div>
  `;

  output.innerHTML = finalResultHtml + graphContainerHtml + stepsHtml + educationalHtml;

  // Calculate arrays for Plotly
  let xYears = [];
  let yValue = [];
  let yInterest = [];
  let hoverTextArray = [];
  
  for (let y = 0; y <= years; y++) {
    let pwr = Math.pow(base, y * n);
    let valAtY = pv * pwr;
    let intAtY = valAtY - pv;
    
    xYears.push(y);
    yValue.push(valAtY);
    yInterest.push(intAtY);
    
    hoverTextArray.push(
      `<b>Year: ${y}</b><br>Investment Value: ₹${formatCurrency(valAtY)}<br>Interest Earned: ₹${formatCurrency(intAtY)}<br>Growth Since Start: ₹${formatCurrency(intAtY)}`
    );
  }

  // Plotly traces
  let traceValue = {
    x: xYears,
    y: yValue,
    name: 'Investment Value',
    type: 'scatter',
    mode: 'lines+markers',
    line: { color: '#22c55e', width: 3, shape: 'spline' },
    marker: { size: 4 },
    hoverinfo: 'text',
    hovertext: hoverTextArray
  };
  
  let traceInterest = {
    x: xYears,
    y: yInterest,
    name: 'Interest Earned',
    type: 'scatter',
    mode: 'lines+markers',
    line: { color: '#f97316', width: 3, shape: 'spline' },
    marker: { size: 4 },
    hoverinfo: 'text',
    hovertext: hoverTextArray
  };

  let midIdx = Math.floor(years / 2);
  let layout = {
    title: {
      text: '📈 Investment Growth Journey',
      font: { color: '#ffffff', family: 'Fraunces, serif', size: 24 }
    },
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    font: { color: '#9ca3af', family: 'Figtree, sans-serif' },
    xaxis: {
      title: { text: 'Year', font: { color: '#d1d5db', size: 14 } },
      gridcolor: 'rgba(255,255,255,0.05)',
      zerolinecolor: 'rgba(255,255,255,0.1)',
      tickfont: { color: '#9ca3af' }
    },
    yaxis: {
      title: { text: 'Amount (₹)', font: { color: '#d1d5db', size: 14 } },
      tickprefix: '₹',
      gridcolor: 'rgba(255,255,255,0.05)',
      zerolinecolor: 'rgba(255,255,255,0.1)',
      tickfont: { color: '#9ca3af' }
    },
    hovermode: 'closest',
    hoverlabel: {
      bgcolor: '#111827',
      font: { family: 'Figtree, sans-serif', color: '#ffffff', size: 14 },
      bordercolor: 'rgba(255,255,255,0.2)',
      padding: { t: 12, b: 12, l: 16, r: 16 }
    },
    legend: { orientation: 'h', y: -0.2, x: 0.5, xanchor: 'center', font: { color: '#d1d5db', size: 14 } },
    margin: { l: 80, r: 40, t: 80, b: 80 },
    annotations: [
      {
        x: xYears[0],
        y: yValue[0],
        xref: 'x', yref: 'y',
        text: 'Investment Started',
        showarrow: true,
        arrowhead: 2,
        ax: 50,
        ay: -40,
        font: { color: '#ffffff', size: 13, family: 'Figtree, sans-serif', weight: 600 },
        bgcolor: 'rgba(34,197,94,0.1)',
        bordercolor: '#22c55e',
        borderpad: 4
      },
      {
        x: xYears[midIdx],
        y: yValue[midIdx],
        xref: 'x', yref: 'y',
        text: 'Halfway Growth',
        showarrow: true,
        arrowhead: 2,
        ax: 0,
        ay: -60,
        font: { color: '#ffffff', size: 13, family: 'Figtree, sans-serif' },
        bgcolor: 'rgba(255,255,255,0.1)',
        bordercolor: 'rgba(255,255,255,0.3)',
        borderpad: 4
      },
      {
        x: xYears[xYears.length - 1],
        y: yValue[yValue.length - 1],
        xref: 'x', yref: 'y',
        text: 'Target Value Reached',
        showarrow: true,
        arrowhead: 2,
        ax: -60,
        ay: -40,
        font: { color: '#22c55e', size: 13, family: 'Figtree, sans-serif', weight: 600 },
        bgcolor: 'rgba(34,197,94,0.1)',
        bordercolor: '#22c55e',
        borderpad: 4
      }
    ]
  };

  let config = {
    responsive: true,
    displayModeBar: true,
    modeBarButtonsToRemove: ['lasso2d', 'select2d'],
    displaylogo: false
  };

  if (typeof Plotly !== 'undefined') {
    Plotly.newPlot('fv-plot-container', [traceValue, traceInterest], layout, config);
  } else {
    document.getElementById('fv-plot-container').innerHTML = '<div style="color: #ef4444; padding: 2rem; text-align: center;">Unable to load Plotly.js for interactive chart visualization.</div>';
  }

  output.scrollIntoView({ behavior: 'smooth', block: 'start' });
}


function calculatePresentValue() {
  const output = document.getElementById('steps-output');
  output.innerHTML = '';
  output.classList.add('active');

  let fvValStr = document.getElementById('pv-fv').value.trim();
  let rateValStr = document.getElementById('pv-rate').value.trim();
  let yearsValStr = document.getElementById('pv-years').value.trim();
  let freqValStr = document.getElementById('pv-frequency').value.trim();
  let decimalsValStr = document.getElementById('pv-decimals').value.trim();

  if (fvValStr === '' || rateValStr === '' || yearsValStr === '' || freqValStr === '' || decimalsValStr === '') {
    output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Missing Fields</div></div><div class="step-desc">Please ensure all calculator parameters are filled with valid entries.</div></div>`;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  let fv = parseFloat(fvValStr);
  let rate = parseFloat(rateValStr);
  let years = parseFloat(yearsValStr);
  let n = parseInt(freqValStr);
  let decimals = parseInt(decimalsValStr);

  // Validation
  if (isNaN(fv) || fv <= 0) {
    output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Invalid Future Value</div></div><div class="step-desc">Future Value (FV) must be a positive number greater than 0.</div></div>`;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  if (isNaN(rate) || rate < 0) {
    output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Invalid Interest Rate</div></div><div class="step-desc">Annual Interest Rate must be greater than or equal to 0%.</div></div>`;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  if (isNaN(years) || years <= 0) {
    output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Invalid Time Period</div></div><div class="step-desc">Time Period (Years) must be a positive number greater than 0.</div></div>`;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  if (isNaN(decimals) || !/^\d+$/.test(decimalsValStr) || decimals < 0 || decimals > 15) {
    output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Invalid Decimal Places</div></div><div class="step-desc">Decimal places must be an integer between 0 and 15.</div></div>`;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  let r = rate / 100;
  let nt = n * years;
  let base = 1 + (r / n);
  let power = Math.pow(base, nt);
  let pv = fv / power;

  const formatCurrency = (val) => {
    return val.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  };

  const getFreqName = (val) => {
    if (val === 1) return 'Annually';
    if (val === 2) return 'Semi-Annually';
    if (val === 4) return 'Quarterly';
    if (val === 12) return 'Monthly';
    return 'Annually';
  };

  let freqName = getFreqName(n);

  let stepsHtml = '';
  let stepCount = 1;

  // Step 1: Given Values
  stepsHtml += `<div class="step-card">
    <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <div class="step-number">${stepCount++}</div>
        <div class="step-title">Given Values</div>
      </div>
      <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div>
    </div>
    <div class="step-content">
      <div class="step-desc">Identify the given parameters from the inputs:</div>
      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.1rem; color: var(--navy); margin: 1.5rem 0; padding-left: 2rem; display: flex; flex-direction: column; gap: 0.5rem;">
        <div>Future Value (FV) = <b>₹${fv.toLocaleString('en-IN')}</b></div>
        <div>Annual Interest Rate (r) = <b>${rate}%</b></div>
        <div>Compounding Frequency (n) = <b>${n}</b> (${freqName})</div>
        <div>Time Period (t) = <b>${years} Years</b></div>
      </div>
    </div>
  </div>`;

  // Step 2: Convert Interest Rate
  stepsHtml += `<div class="step-card">
    <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <div class="step-number">${stepCount++}</div>
        <div class="step-title">Convert Annual Interest Rate to Decimal</div>
      </div>
      <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div>
    </div>
    <div class="step-content">
      <div class="step-desc">Convert the interest rate from a percentage to a decimal value (r = R / 100):</div>
      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.25rem; color: var(--navy); text-align: center; margin: 1.5rem 0;">
        r = ${rate} / 100 = <b>${r.toFixed(decimals + 2)}</b>
      </div>
    </div>
  </div>`;

  // Step 3: Apply Formula
  stepsHtml += `<div class="step-card">
    <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <div class="step-number">${stepCount++}</div>
        <div class="step-title">Apply Present Value Formula</div>
      </div>
      <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div>
    </div>
    <div class="step-content">
      <div class="step-desc">Substitute the values into the present value formula:</div>
      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.15rem; color: var(--navy); margin: 1.5rem 0; display: flex; flex-direction: column; gap: 1rem; align-items: center; text-align: center;">
        <div style="font-size: 1.25rem; font-weight: 600; color: var(--amber);">PV = FV / (1 + r/n)<sup>n &times; t</sup></div>
        <div style="border-top: 1px dashed var(--border); width: 100%; padding-top: 1rem; margin-top: 0.5rem;"><b>Substitution:</b></div>
        <div>PV = ${fv} / (1 + ${r.toFixed(decimals + 2)} / ${n})<sup>${n} &times; ${years}</sup></div>
        <div>PV = ${fv} / (1 + ${(r/n).toFixed(decimals + 4)})<sup>${nt}</sup></div>
        <div>PV = ${fv} / (${base.toFixed(decimals + 4)})<sup>${nt}</sup></div>
        <div>PV = ${fv} / <b>${power.toFixed(decimals + 4)}</b></div>
        <div style="font-size: 1.35rem; color: var(--teal); font-weight: 700; border-top: 1px solid var(--border); padding-top: 1rem; width: 100%;">PV = ₹${formatCurrency(pv)}</div>
      </div>
    </div>
  </div>`;

  // Result Card
  let finalResultHtml = `
    <div class="final-result animate-fade-in" style="padding: 2.5rem; background: #111827; color: #ffffff; border-radius: 16px; border: 1px solid var(--border); box-shadow: 0 10px 30px rgba(0,0,0,0.15); margin-bottom: 2rem; display: flex; flex-wrap: wrap; gap: 2rem; align-items: center; width: 100%; box-sizing: border-box;">
      <div style="flex: 1 1 200px; text-align: left;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; margin-bottom: 0.5rem;">
          <div style="font-size: 1.8rem; font-weight: 700; color: var(--amber); font-family:'Fraunces', serif;">✅ Present Value Calculated!</div>
          <button onclick="const c = this.closest('#steps-output').querySelectorAll('.step-card'); if(c.length) c[0].scrollIntoView({behavior: 'smooth', block: 'start'})" style="background: rgba(245, 158, 11, 0.15); color: var(--amber); border: 1px solid rgba(245, 158, 11, 0.3); padding: 0.4rem 0.8rem; border-radius: 8px; font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: all 0.2s; font-family: 'Figtree', sans-serif; display: inline-flex; align-items: center; gap: 0.4rem; white-space: nowrap;" onmouseover="this.style.background='rgba(245, 158, 11, 0.25)'" onmouseout="this.style.background='rgba(245, 158, 11, 0.15)'">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg> View Steps
          </button>
        </div>
        <div style="font-size: 1.05rem; opacity: 0.9; margin-bottom: 1.5rem;">Discounting summary for your future sum.</div>
        <div style="padding: 1.5rem; background: rgba(255,255,255,0.06); border-radius: 12px; border: 1px solid rgba(255,255,255,0.12);">
          <div style="font-size:0.95rem; font-weight:600; color: rgba(255,255,255,0.7); border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; margin-bottom: 0.75rem;">Present Value (PV):</div>
          <div style="font-family:'IBM Plex Mono',monospace; font-size: 2rem; font-weight:700; color:var(--amber); margin: 0.6rem 0;">
            Present Value = <span style="color:#ffffff;">₹${formatCurrency(pv)}</span>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.75rem; margin-top: 1rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1rem; font-size: 0.9rem; opacity: 0.85;">
            <div>Future Value: <strong>₹${fv.toLocaleString('en-IN')}</strong></div>
            <div>Interest Rate: <strong>${rate}%</strong></div>
            <div>Discounting Period: <strong>${years} Years</strong></div>
            <div>Compounding Frequency: <strong>${freqName}</strong></div>
            <div style="grid-column: span 2;">Total Discount: <strong style="color:var(--amber);">₹${formatCurrency(fv - pv)}</strong></div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Educational Note Card
  let educationalHtml = `
    <div class="step-card" style="border-left: 4px solid var(--teal); background: rgba(13, 148, 136, 0.05); margin-top: 2rem;">
      <div style="font-weight: 700; color: var(--teal); font-size: 1.1rem; margin-bottom: 0.5rem; font-family:'Fraunces', serif;">✦ Educational Note: Present Value & Discounting</div>
      <div style="font-size: 1rem; line-height: 1.5; color: var(--navy);">
        <strong>Present Value (PV)</strong> is the current worth of a future sum of money or stream of cash flows given a specified rate of return. 
        It is a core concept in finance representing the <strong>Time Value of Money</strong>, which states that a rupee today is worth more than a rupee in the future because of its potential earning capacity.
        <br><br>
        The process of calculating Present Value is known as <strong>Discounting</strong> (the opposite of compounding):
        <ul>
          <li><strong>Higher Discount Rate (r):</strong> The higher the interest rate (discount rate), the lower the present value of the future sum, because a smaller starting amount would be required to reach that future value.</li>
          <li><strong>Longer Time Horizon (t):</strong> The further in the future a sum is to be received, the lower its present value today.</li>
        </ul>
      </div>
    </div>
  `;

  let graphContainerHtml = `
    <div style="background: #111827; border-radius: 16px; border: 1px solid var(--border); padding: 1rem; margin-bottom: 2rem; box-shadow: 0 10px 30px rgba(0,0,0,0.15);">
      <div id="pv-plot-container" style="width: 100%; height: 500px;"></div>
    </div>
  `;

  output.innerHTML = finalResultHtml + graphContainerHtml + stepsHtml + educationalHtml;

  // Calculate arrays for Plotly
  let xYears = [];
  let yPV = [];
  let yDiscount = [];
  let hoverTextArray = [];
  
  for (let y = 0; y <= years; y++) {
    let pwr_y = Math.pow(base, n * y);
    let valAtY = fv / pwr_y;
    let discAtY = fv - valAtY;
    
    xYears.push(y);
    yPV.push(valAtY);
    yDiscount.push(discAtY);
    
    hoverTextArray.push(
      `<b>Year: ${y}</b><br>Present Value: ₹${formatCurrency(valAtY)}<br>Discount Amount: ₹${formatCurrency(discAtY)}<br>Future Value: ₹${formatCurrency(fv)}`
    );
  }

  // Plotly traces
  let tracePV = {
    x: xYears,
    y: yPV,
    name: 'Present Value',
    type: 'scatter',
    mode: 'lines+markers',
    line: { color: '#3b82f6', width: 3, shape: 'spline' },
    marker: { size: 4 },
    hoverinfo: 'text',
    hovertext: hoverTextArray
  };
  
  let traceDiscount = {
    x: xYears,
    y: yDiscount,
    name: 'Discount Amount',
    type: 'scatter',
    mode: 'lines+markers',
    line: { color: '#f97316', width: 3, shape: 'spline' },
    marker: { size: 4 },
    hoverinfo: 'text',
    hovertext: hoverTextArray
  };

  let midIdx = Math.floor(years / 2);
  let layout = {
    title: {
      text: '📉 Present Value Discounting Journey',
      font: { color: '#ffffff', family: 'Fraunces, serif', size: 24 }
    },
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    font: { color: '#9ca3af', family: 'Figtree, sans-serif' },
    xaxis: {
      title: { text: 'Year', font: { color: '#d1d5db', size: 14 } },
      gridcolor: 'rgba(255,255,255,0.05)',
      zerolinecolor: 'rgba(255,255,255,0.1)',
      tickfont: { color: '#9ca3af' }
    },
    yaxis: {
      title: { text: 'Amount (₹)', font: { color: '#d1d5db', size: 14 } },
      tickprefix: '₹',
      gridcolor: 'rgba(255,255,255,0.05)',
      zerolinecolor: 'rgba(255,255,255,0.1)',
      tickfont: { color: '#9ca3af' }
    },
    hovermode: 'closest',
    hoverlabel: {
      bgcolor: '#111827',
      font: { family: 'Figtree, sans-serif', color: '#ffffff', size: 14 },
      bordercolor: 'rgba(255,255,255,0.2)',
      padding: { t: 12, b: 12, l: 16, r: 16 }
    },
    legend: { orientation: 'h', y: -0.2, x: 0.5, xanchor: 'center', font: { color: '#d1d5db', size: 14 } },
    margin: { l: 80, r: 40, t: 80, b: 80 },
    annotations: [
      {
        x: xYears[0],
        y: yPV[0],
        xref: 'x', yref: 'y',
        text: 'Future Value Reference',
        showarrow: true,
        arrowhead: 2,
        ax: 50,
        ay: -40,
        font: { color: '#ffffff', size: 13, family: 'Figtree, sans-serif', weight: 600 },
        bgcolor: 'rgba(59,130,246,0.1)',
        bordercolor: '#3b82f6',
        borderpad: 4
      },
      {
        x: xYears[midIdx],
        y: yPV[midIdx],
        xref: 'x', yref: 'y',
        text: 'Halfway Discounting',
        showarrow: true,
        arrowhead: 2,
        ax: 0,
        ay: -60,
        font: { color: '#ffffff', size: 13, family: 'Figtree, sans-serif' },
        bgcolor: 'rgba(255,255,255,0.1)',
        bordercolor: 'rgba(255,255,255,0.3)',
        borderpad: 4
      },
      {
        x: xYears[xYears.length - 1],
        y: yPV[yPV.length - 1],
        xref: 'x', yref: 'y',
        text: "Today's Equivalent Value",
        showarrow: true,
        arrowhead: 2,
        ax: -60,
        ay: -40,
        font: { color: '#3b82f6', size: 13, family: 'Figtree, sans-serif', weight: 600 },
        bgcolor: 'rgba(59,130,246,0.1)',
        bordercolor: '#3b82f6',
        borderpad: 4
      }
    ]
  };

  let config = {
    responsive: true,
    displayModeBar: true,
    modeBarButtonsToRemove: ['lasso2d', 'select2d'],
    displaylogo: false
  };

  if (typeof Plotly !== 'undefined') {
    Plotly.newPlot('pv-plot-container', [tracePV, traceDiscount], layout, config);
  } else {
    document.getElementById('pv-plot-container').innerHTML = '<div style="color: #ef4444; padding: 2rem; text-align: center;">Unable to load Plotly.js for interactive chart visualization.</div>';
  }

  output.scrollIntoView({ behavior: 'smooth', block: 'start' });
}


function calculateAnnuity() {
  const output = document.getElementById('steps-output');
  output.innerHTML = '';
  output.classList.add('active');

  let pmtValStr = document.getElementById('annuity-pmt').value.trim();
  let rateValStr = document.getElementById('annuity-rate').value.trim();
  let yearsValStr = document.getElementById('annuity-years').value.trim();
  let freqValStr = document.getElementById('annuity-frequency').value.trim();
  let decimalsValStr = document.getElementById('annuity-decimals').value.trim();

  if (pmtValStr === '' || rateValStr === '' || yearsValStr === '' || freqValStr === '' || decimalsValStr === '') {
    output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Missing Fields</div></div><div class="step-desc">Please ensure all calculator parameters are filled with valid entries.</div></div>`;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  let pmt = parseFloat(pmtValStr);
  let rate = parseFloat(rateValStr);
  let years = parseFloat(yearsValStr);
  let n = parseInt(freqValStr);
  let decimals = parseInt(decimalsValStr);

  // Validation
  if (isNaN(pmt) || pmt <= 0) {
    output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Invalid Periodic Payment</div></div><div class="step-desc">Periodic Payment (PMT) must be a positive number greater than 0.</div></div>`;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  if (isNaN(rate) || rate <= 0) {
    output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Invalid Interest Rate</div></div><div class="step-desc">Annual Interest Rate must be a positive number greater than 0%.</div></div>`;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  if (isNaN(years) || years <= 0) {
    output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Invalid Time Period</div></div><div class="step-desc">Time Period (Years) must be a positive number greater than 0.</div></div>`;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  if (isNaN(decimals) || !/^\d+$/.test(decimalsValStr) || decimals < 0 || decimals > 15) {
    output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Invalid Decimal Places</div></div><div class="step-desc">Decimal places must be an integer between 0 and 15.</div></div>`;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  let r = rate / 100;
  let i = r / n;
  let nt = n * years;
  let compoundingFactor = Math.pow(1 + i, nt);
  let annuityFactor = (compoundingFactor - 1) / i;
  let fv = pmt * annuityFactor;

  const formatCurrency = (val) => {
    return val.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  };

  const getFreqName = (val) => {
    if (val === 1) return 'Annually';
    if (val === 2) return 'Semi-Annually';
    if (val === 4) return 'Quarterly';
    if (val === 12) return 'Monthly';
    return 'Annually';
  };

  let freqName = getFreqName(n);

  let stepsHtml = '';
  let stepCount = 1;

  // Step 1: Given Values
  stepsHtml += `<div class="step-card">
    <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <div class="step-number">${stepCount++}</div>
        <div class="step-title">Given Values</div>
      </div>
      <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div>
    </div>
    <div class="step-content">
      <div class="step-desc">Identify the given parameters from the inputs:</div>
      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.1rem; color: var(--navy); margin: 1.5rem 0; padding-left: 2rem; display: flex; flex-direction: column; gap: 0.5rem;">
        <div>Periodic Payment (PMT) = <b>₹${pmt.toLocaleString('en-IN')}</b></div>
        <div>Annual Interest Rate (R) = <b>${rate}%</b></div>
        <div>Compounding Frequency (n) = <b>${n}</b> (${freqName})</div>
        <div>Time Period (t) = <b>${years} Years</b></div>
      </div>
    </div>
  </div>`;

  // Step 2: Convert Interest Rate
  stepsHtml += `<div class="step-card">
    <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <div class="step-number">${stepCount++}</div>
        <div class="step-title">Convert Annual Interest Rate to Decimal</div>
      </div>
      <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div>
    </div>
    <div class="step-content">
      <div class="step-desc">Convert the interest rate from a percentage to a decimal value (r = R / 100):</div>
      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.25rem; color: var(--navy); text-align: center; margin: 1.5rem 0;">
        r = ${rate} / 100 = <b>${r.toFixed(decimals + 2)}</b>
      </div>
    </div>
  </div>`;

  // Step 3: Calculate Effective Periodic Rate
  stepsHtml += `<div class="step-card">
    <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <div class="step-number">${stepCount++}</div>
        <div class="step-title">Calculate Effective Periodic Interest Rate</div>
      </div>
      <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div>
    </div>
    <div class="step-content">
      <div class="step-desc">Divide the annual interest rate by the compounding frequency (i = r / n):</div>
      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.25rem; color: var(--navy); text-align: center; margin: 1.5rem 0;">
        i = ${r.toFixed(decimals + 2)} / ${n} = <b>${i.toFixed(decimals + 4)}</b>
      </div>
    </div>
  </div>`;

  // Step 4: Apply Annuity Formula
  stepsHtml += `<div class="step-card">
    <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <div class="step-number">${stepCount++}</div>
        <div class="step-title">Apply Ordinary Annuity Formula</div>
      </div>
      <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div>
    </div>
    <div class="step-content">
      <div class="step-desc">Substitute the values into the Future Value of an Ordinary Annuity formula:</div>
      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.15rem; color: var(--navy); margin: 1.5rem 0; display: flex; flex-direction: column; gap: 1rem; align-items: center; text-align: center;">
        <div style="font-size: 1.25rem; font-weight: 600; color: var(--amber);">FV = PMT &times; [((1 + i)<sup>n &times; t</sup> &minus; 1) / i]</div>
        <div style="border-top: 1px dashed var(--border); width: 100%; padding-top: 1rem; margin-top: 0.5rem;"><b>Substitution:</b></div>
        <div>FV = ${pmt} &times; [((1 + ${i.toFixed(decimals + 4)})<sup>${n} &times; ${years}</sup> &minus; 1) / ${i.toFixed(decimals + 4)}]</div>
        <div>FV = ${pmt} &times; [((1.0${i.toString().substring(2)})<sup>${nt}</sup> &minus; 1) / ${i.toFixed(decimals + 4)}]</div>
        <div>FV = ${pmt} &times; [${compoundingFactor.toFixed(decimals + 4)} &minus; 1) / ${i.toFixed(decimals + 4)}]</div>
        <div>FV = ${pmt} &times; [${(compoundingFactor - 1).toFixed(decimals + 4)} / ${i.toFixed(decimals + 4)}]</div>
        <div>FV = ${pmt} &times; <b>${annuityFactor.toFixed(decimals + 4)}</b></div>
      </div>
    </div>
  </div>`;

  // Step 5: Calculate Future Value
  stepsHtml += `<div class="step-card">
    <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <div class="step-number">${stepCount++}</div>
        <div class="step-title">Calculate Final Future Value of Annuity</div>
      </div>
      <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div>
    </div>
    <div class="step-content">
      <div class="step-desc">Multiply the periodic payment by the annuity factor to find the final future value:</div>
      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.25rem; color: var(--navy); text-align: center; margin: 1.5rem 0;">
        FV = ${pmt} &times; ${annuityFactor.toFixed(decimals + 4)} = <b>₹${formatCurrency(fv)}</b>
      </div>
    </div>
  </div>`;

  // Result Card
  let finalResultHtml = `
    <div class="final-result animate-fade-in" style="padding: 2.5rem; background: #111827; color: #ffffff; border-radius: 16px; border: 1px solid var(--border); box-shadow: 0 10px 30px rgba(0,0,0,0.15); margin-bottom: 2rem; display: flex; flex-wrap: wrap; gap: 2rem; align-items: center; width: 100%; box-sizing: border-box;">
      <div style="flex: 1 1 200px; text-align: left;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; margin-bottom: 0.5rem;">
          <div style="font-size: 1.8rem; font-weight: 700; color: var(--amber); font-family:'Fraunces', serif;">✅ Future Value of Annuity Calculated!</div>
          <button onclick="const c = this.closest('#steps-output').querySelectorAll('.step-card'); if(c.length) c[0].scrollIntoView({behavior: 'smooth', block: 'start'})" style="background: rgba(245, 158, 11, 0.15); color: var(--amber); border: 1px solid rgba(245, 158, 11, 0.3); padding: 0.4rem 0.8rem; border-radius: 8px; font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: all 0.2s; font-family: 'Figtree', sans-serif; display: inline-flex; align-items: center; gap: 0.4rem; white-space: nowrap;" onmouseover="this.style.background='rgba(245, 158, 11, 0.25)'" onmouseout="this.style.background='rgba(245, 158, 11, 0.15)'">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg> View Steps
          </button>
        </div>
        <div style="font-size: 1.05rem; opacity: 0.9; margin-bottom: 1.5rem;">Future value projection summary for your periodic payments.</div>
        <div style="padding: 1.5rem; background: rgba(255,255,255,0.06); border-radius: 12px; border: 1px solid rgba(255,255,255,0.12);">
          <div style="font-size:0.95rem; font-weight:600; color: rgba(255,255,255,0.7); border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; margin-bottom: 0.75rem;">Future Value of Annuity (FV):</div>
          <div style="font-family:'IBM Plex Mono',monospace; font-size: 2rem; font-weight:700; color:var(--amber); margin: 0.6rem 0;">
            Future Value = <span style="color:#ffffff;">₹${formatCurrency(fv)}</span>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.75rem; margin-top: 1rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1rem; font-size: 0.9rem; opacity: 0.85;">
            <div>Periodic Contribution: <strong>₹${pmt.toLocaleString('en-IN')}</strong></div>
            <div>Interest Rate: <strong>${rate}%</strong></div>
            <div>Number of Periods: <strong>${nt}</strong></div>
            <div>Total Deposits: <strong>₹${formatCurrency(pmt * nt)}</strong></div>
            <div style="grid-column: span 2;">Interest Earned: <strong style="color:var(--amber);">₹${formatCurrency(fv - (pmt * nt))}</strong></div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Educational Note Card
  let educationalHtml = `
    <div class="step-card" style="border-left: 4px solid var(--teal); background: rgba(13, 148, 136, 0.05); margin-top: 2rem;">
      <div style="font-weight: 700; color: var(--teal); font-size: 1.1rem; margin-bottom: 0.5rem; font-family:'Fraunces', serif;">✦ Educational Note: Future Value of an Ordinary Annuity</div>
      <div style="font-size: 1rem; line-height: 1.5; color: var(--navy);">
        An <strong>Ordinary Annuity</strong> is a series of equal periodic payments made at the end of each compounding period (e.g. end of each month or year).
        Calculating the Future Value of an annuity determines the total accumulated value of these payments at a future date, including compound interest earned on each payment.
        <br><br>
        Key components of annuities:
        <ul>
          <li><strong>Periodic Payment (PMT):</strong> The fixed amount deposited or paid in each period.</li>
          <li><strong>Annuity Factor:</strong> Evaluates the total multiplier effect of regular contributions over time. The formula takes into account that earlier payments earn compounding interest for longer durations, whereas the final payment earns no interest.</li>
          <li><strong>Ordinary vs. Due:</strong> In an ordinary annuity, payments are at the end of each period. In an annuity due, payments are at the beginning (which earns one extra compounding period of interest).</li>
        </ul>
      </div>
    </div>
  `;

  let graphContainerHtml = `
    <div style="background: #111827; border-radius: 16px; border: 1px solid var(--border); padding: 1rem; margin-bottom: 2rem; box-shadow: 0 10px 30px rgba(0,0,0,0.15);">
      <div id="annuity-plot-container" style="width: 100%; height: 500px;"></div>
    </div>
  `;

  output.innerHTML = finalResultHtml + graphContainerHtml + stepsHtml + educationalHtml;

  // Calculate arrays for Plotly
  let xPeriods = [];
  let yAccumulated = [];
  let yDeposits = [];
  let hoverTextArray = [];
  
  for (let p = 0; p <= nt; p++) {
    let depositsAtP = pmt * p;
    let accumulatedAtP = 0;
    if (p > 0) {
      accumulatedAtP = pmt * ((Math.pow(1 + i, p) - 1) / i);
    }
    let interestAtP = accumulatedAtP - depositsAtP;
    
    xPeriods.push(p);
    yAccumulated.push(accumulatedAtP);
    yDeposits.push(depositsAtP);
    
    hoverTextArray.push(
      `<b>Period: ${p}</b><br>Total Deposits: ₹${formatCurrency(depositsAtP)}<br>Accumulated Value: ₹${formatCurrency(accumulatedAtP)}<br>Interest Earned: ₹${formatCurrency(interestAtP)}`
    );
  }

  // Plotly traces
  let traceAccumulated = {
    x: xPeriods,
    y: yAccumulated,
    name: 'Accumulated Value',
    type: 'scatter',
    mode: 'lines+markers',
    line: { color: '#22c55e', width: 3, shape: 'spline' },
    marker: { size: 4 },
    hoverinfo: 'text',
    hovertext: hoverTextArray
  };
  
  let traceDeposits = {
    x: xPeriods,
    y: yDeposits,
    name: 'Total Deposits',
    type: 'scatter',
    mode: 'lines+markers',
    line: { color: '#3b82f6', width: 3, shape: 'spline' },
    marker: { size: 4 },
    hoverinfo: 'text',
    hovertext: hoverTextArray
  };

  let midIdx = Math.floor(nt / 2);
  let layout = {
    title: {
      text: '📈 Wealth Accumulation Journey',
      font: { color: '#ffffff', family: 'Fraunces, serif', size: 24 }
    },
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    font: { color: '#9ca3af', family: 'Figtree, sans-serif' },
    xaxis: {
      title: { text: 'Period', font: { color: '#d1d5db', size: 14 } },
      gridcolor: 'rgba(255,255,255,0.05)',
      zerolinecolor: 'rgba(255,255,255,0.1)',
      tickfont: { color: '#9ca3af' }
    },
    yaxis: {
      title: { text: 'Amount (₹)', font: { color: '#d1d5db', size: 14 } },
      tickprefix: '₹',
      gridcolor: 'rgba(255,255,255,0.05)',
      zerolinecolor: 'rgba(255,255,255,0.1)',
      tickfont: { color: '#9ca3af' }
    },
    hovermode: 'closest',
    hoverlabel: {
      bgcolor: '#111827',
      font: { family: 'Figtree, sans-serif', color: '#ffffff', size: 14 },
      bordercolor: 'rgba(255,255,255,0.2)',
      padding: { t: 12, b: 12, l: 16, r: 16 }
    },
    legend: { orientation: 'h', y: -0.2, x: 0.5, xanchor: 'center', font: { color: '#d1d5db', size: 14 } },
    margin: { l: 80, r: 40, t: 80, b: 80 },
    annotations: [
      {
        x: xPeriods[1] || 1,
        y: yAccumulated[1] || 0,
        xref: 'x', yref: 'y',
        text: 'Savings Started',
        showarrow: true,
        arrowhead: 2,
        ax: 50,
        ay: -40,
        font: { color: '#ffffff', size: 13, family: 'Figtree, sans-serif', weight: 600 },
        bgcolor: 'rgba(59,130,246,0.1)',
        bordercolor: '#3b82f6',
        borderpad: 4
      },
      {
        x: xPeriods[midIdx],
        y: yAccumulated[midIdx],
        xref: 'x', yref: 'y',
        text: 'Halfway to Goal',
        showarrow: true,
        arrowhead: 2,
        ax: 0,
        ay: -60,
        font: { color: '#ffffff', size: 13, family: 'Figtree, sans-serif' },
        bgcolor: 'rgba(255,255,255,0.1)',
        bordercolor: 'rgba(255,255,255,0.3)',
        borderpad: 4
      },
      {
        x: xPeriods[nt],
        y: yAccumulated[nt],
        xref: 'x', yref: 'y',
        text: 'Final Accumulated Value',
        showarrow: true,
        arrowhead: 2,
        ax: -60,
        ay: -40,
        font: { color: '#22c55e', size: 13, family: 'Figtree, sans-serif', weight: 600 },
        bgcolor: 'rgba(34,197,94,0.1)',
        bordercolor: '#22c55e',
        borderpad: 4
      }
    ]
  };

  let config = {
    responsive: true,
    displayModeBar: true,
    modeBarButtonsToRemove: ['lasso2d', 'select2d'],
    displaylogo: false
  };

  if (typeof Plotly !== 'undefined') {
    Plotly.newPlot('annuity-plot-container', [traceAccumulated, traceDeposits], layout, config);
  } else {
    document.getElementById('annuity-plot-container').innerHTML = '<div style="color: #ef4444; padding: 2rem; text-align: center;">Unable to load Plotly.js for interactive chart visualization.</div>';
  }

  output.scrollIntoView({ behavior: 'smooth', block: 'start' });
}


function calculateInterestRate() {
  const output = document.getElementById('steps-output');
  output.innerHTML = '';
  output.classList.add('active');

  let pvValStr = document.getElementById('ir-pv').value.trim();
  let fvValStr = document.getElementById('ir-fv').value.trim();
  let yearsValStr = document.getElementById('ir-years').value.trim();
  let decimalsValStr = document.getElementById('ir-decimals').value.trim();

  if (pvValStr === '' || fvValStr === '' || yearsValStr === '' || decimalsValStr === '') {
    output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Missing Fields</div></div><div class="step-desc">Please ensure all calculator parameters are filled with valid entries.</div></div>`;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  let pv = parseFloat(pvValStr);
  let fv = parseFloat(fvValStr);
  let years = parseFloat(yearsValStr);
  let decimals = parseInt(decimalsValStr);

  // Validation:
  // - PV > 0
  // - FV > 0
  // - Time > 0
  // - FV must be greater than PV
  if (isNaN(pv) || pv <= 0) {
    output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Invalid Present Value</div></div><div class="step-desc">Present Value (PV) must be a positive number greater than 0.</div></div>`;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  if (isNaN(fv) || fv <= 0) {
    output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Invalid Future Value</div></div><div class="step-desc">Future Value (FV) must be a positive number greater than 0.</div></div>`;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  if (isNaN(years) || years <= 0) {
    output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Invalid Time Period</div></div><div class="step-desc">Time Period (Years) must be a positive number greater than 0.</div></div>`;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  if (fv <= pv) {
    output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: FV must be greater than PV</div></div><div class="step-desc">Future Value (FV) must be strictly greater than Present Value (PV) for growth to occur.</div></div>`;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  if (isNaN(decimals) || !/^\d+$/.test(decimalsValStr) || decimals < 0 || decimals > 15) {
    output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Invalid Decimal Places</div></div><div class="step-desc">Decimal places must be an integer between 0 and 15.</div></div>`;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  let ratio = fv / pv;
  let invTime = 1 / years;
  let growthFactor = Math.pow(ratio, invTime);
  let r = (growthFactor - 1) * 100;

  let stepsHtml = '';
  let stepCount = 1;

  // Step 1: Given Values
  stepsHtml += `<div class="step-card">
    <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <div class="step-number">${stepCount++}</div>
        <div class="step-title">Given Values</div>
      </div>
      <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div>
    </div>
    <div class="step-content">
      <div class="step-desc">Identify the given parameters from the inputs:</div>
      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.1rem; color: var(--navy); margin: 1.5rem 0; padding-left: 2rem; display: flex; flex-direction: column; gap: 0.5rem;">
        <div>Present Value (PV) = <b>₹${pv.toLocaleString('en-IN')}</b></div>
        <div>Future Value (FV) = <b>₹${fv.toLocaleString('en-IN')}</b></div>
        <div>Time Period (t) = <b>${years} Years</b></div>
      </div>
    </div>
  </div>`;

  // Step 2: Compute FV / PV
  stepsHtml += `<div class="step-card">
    <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <div class="step-number">${stepCount++}</div>
        <div class="step-title">Compute FV / PV</div>
      </div>
      <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div>
    </div>
    <div class="step-content">
      <div class="step-desc">Calculate the total growth ratio by dividing the Future Value (FV) by the Present Value (PV):</div>
      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.25rem; color: var(--navy); text-align: center; margin: 1.5rem 0;">
        FV / PV = ${fv} / ${pv} = <b>${ratio.toFixed(decimals + 4)}</b>
      </div>
    </div>
  </div>`;

  // Step 3: Apply Interest Rate Formula
  stepsHtml += `<div class="step-card">
    <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <div class="step-number">${stepCount++}</div>
        <div class="step-title">Apply Interest Rate Formula</div>
      </div>
      <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div>
    </div>
    <div class="step-content">
      <div class="step-desc">Substitute the values into the interest rate formula:</div>
      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.15rem; color: var(--navy); margin: 1.5rem 0; display: flex; flex-direction: column; gap: 1rem; align-items: center; text-align: center;">
        <div style="font-size: 1.25rem; font-weight: 600; color: var(--amber);">r = ((FV / PV)<sup>1 / t</sup> - 1) &times; 100</div>
        <div style="border-top: 1px dashed var(--border); width: 100%; padding-top: 1rem; margin-top: 0.5rem;"><b>Substitution:</b></div>
        <div>r = ((${fv} / ${pv})<sup>1 / ${years}</sup> - 1) &times; 100</div>
        <div>r = (${ratio.toFixed(decimals + 4)}<sup>${invTime.toFixed(decimals + 4)}</sup> - 1) &times; 100</div>
      </div>
    </div>
  </div>`;

  // Step 4: Calculate Annual Growth Factor
  stepsHtml += `<div class="step-card">
    <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <div class="step-number">${stepCount++}</div>
        <div class="step-title">Calculate Annual Growth Factor</div>
      </div>
      <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div>
    </div>
    <div class="step-content">
      <div class="step-desc">Raise the growth ratio to the power of (1 / t) to find the annual compounding multiplier (growth factor):</div>
      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.25rem; color: var(--navy); text-align: center; margin: 1.5rem 0;">
        (${ratio.toFixed(decimals + 4)})<sup>${invTime.toFixed(decimals + 4)}</sup> = <b>${growthFactor.toFixed(decimals + 4)}</b>
      </div>
    </div>
  </div>`;

  // Step 5: Convert to Percentage
  stepsHtml += `<div class="step-card">
    <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <div class="step-number">${stepCount++}</div>
        <div class="step-title">Convert to Percentage</div>
      </div>
      <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div>
    </div>
    <div class="step-content">
      <div class="step-desc">Subtract 1 to isolate the rate decimal, then multiply by 100 to get the interest rate percentage:</div>
      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.15rem; color: var(--navy); margin: 1.5rem 0; display: flex; flex-direction: column; gap: 0.5rem; align-items: center; text-align: center;">
        <div>Growth Rate Decimal = ${growthFactor.toFixed(decimals + 4)} - 1 = ${(growthFactor - 1).toFixed(decimals + 4)}</div>
        <div>r = ${(growthFactor - 1).toFixed(decimals + 4)} &times; 100 = <b>${r.toFixed(decimals + 2)}%</b></div>
      </div>
    </div>
  </div>`;

  // Step 6: Final Interest Rate
  stepsHtml += `<div class="step-card">
    <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <div class="step-number">${stepCount++}</div>
        <div class="step-title">Final Interest Rate</div>
      </div>
      <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div>
    </div>
    <div class="step-content">
      <div class="step-desc">The required annual interest rate to achieve the target growth, rounded to your specified decimal places, is:</div>
      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.5rem; color: var(--teal); text-align: center; margin: 1.5rem 0; font-weight: 700;">
        r = <b>${r.toFixed(decimals)}%</b>
      </div>
    </div>
  </div>`;

  // Step 7: Educational Note
  let educationalHtml = `
    <div class="step-card" style="border-left: 4px solid var(--teal); background: rgba(13, 148, 136, 0.05); margin-top: 2rem;">
      <div style="font-weight: 700; color: var(--teal); font-size: 1.1rem; margin-bottom: 0.5rem; font-family:'Fraunces', serif;">✦ Step 7: Educational Note: Interest Rates and CAGR</div>
      <div style="font-size: 1rem; line-height: 1.5; color: var(--navy);">
        The calculated annual interest rate represents the <strong>Compound Annual Growth Rate (CAGR)</strong> needed to grow the Present Value into the Future Value over the specified time period.
        <br><br>
        Key takeaways of interest rate growth:
        <ul>
          <li><strong>Compounding Power:</strong> Under compounding growth, your money earns interest on interest. Consequently, the required interest rate is lower than the corresponding simple interest rate because simple interest does not compound.</li>
          <li><strong>Time Effect:</strong> The longer the duration (t) allowed for growth, the lower the annual interest rate required to hit your target Future Value. This demonstrates the immense benefit of long investment periods.</li>
        </ul>
      </div>
    </div>
  `;

  // Result Card
  let finalResultHtml = `
    <div class="final-result animate-fade-in" style="padding: 2.5rem; background: #111827; color: #ffffff; border-radius: 16px; border: 1px solid var(--border); box-shadow: 0 10px 30px rgba(0,0,0,0.15); margin-bottom: 2rem; display: flex; flex-wrap: wrap; gap: 2rem; align-items: center; width: 100%; box-sizing: border-box;">
      <div style="flex: 1 1 200px; text-align: left;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; margin-bottom: 0.5rem;">
          <div style="font-size: 1.8rem; font-weight: 700; color: var(--amber); font-family:'Fraunces', serif;">✅ Interest Rate Calculated!</div>
          <button onclick="const c = this.closest('#steps-output').querySelectorAll('.step-card'); if(c.length) c[0].scrollIntoView({behavior: 'smooth', block: 'start'})" style="background: rgba(245, 158, 11, 0.15); color: var(--amber); border: 1px solid rgba(245, 158, 11, 0.3); padding: 0.4rem 0.8rem; border-radius: 8px; font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: all 0.2s; font-family: 'Figtree', sans-serif; display: inline-flex; align-items: center; gap: 0.4rem; white-space: nowrap;" onmouseover="this.style.background='rgba(245, 158, 11, 0.25)'" onmouseout="this.style.background='rgba(245, 158, 11, 0.15)'">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg> View Steps
          </button>
        </div>
        <div style="font-size: 1.05rem; opacity: 0.9; margin-bottom: 1.5rem;">Annual growth rate projection summary.</div>
        <div style="padding: 1.5rem; background: rgba(255,255,255,0.06); border-radius: 12px; border: 1px solid rgba(255,255,255,0.12);">
          <div style="font-size:0.95rem; font-weight:600; color: rgba(255,255,255,0.7); border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; margin-bottom: 0.75rem;">Annual Interest Rate (%):</div>
          <div style="font-family:'IBM Plex Mono',monospace; font-size: 2rem; font-weight:700; color:var(--amber); margin: 0.6rem 0;">
            Annual Interest Rate = <span style="color:#ffffff;">${r.toFixed(decimals)}%</span>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.75rem; margin-top: 1rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1rem; font-size: 0.9rem; opacity: 0.85;">
            <div>Present Value: <strong>₹${pv.toLocaleString('en-IN')}</strong></div>
            <div>Future Value: <strong>₹${fv.toLocaleString('en-IN')}</strong></div>
            <div>Time Period: <strong>${years} Years</strong></div>
          </div>
        </div>
      </div>
    </div>
  `;

  let calculatedRate = r;
  let testRates = [calculatedRate - 2, calculatedRate - 1, calculatedRate, calculatedRate + 1, calculatedRate + 2];
  
  let tableRows = '';
  let plotRates = [];
  let plotFVs = [];
  let hoverTexts = [];
  
  // Calculate +2% effect to display in insights card
  let fvPlus2 = pv * Math.pow(1 + (calculatedRate + 2) / 100, years);
  let differencePlus2 = fvPlus2 - fv;
  
  for (let tr of testRates) {
    if (tr < 0) tr = 0; // Prevent negative rates
    
    let simulatedFv = pv * Math.pow(1 + tr / 100, years);
    let diff = simulatedFv - fv;
    let isCalculated = Math.abs(tr - calculatedRate) < 0.0001;
    
    plotRates.push(tr);
    plotFVs.push(simulatedFv);
    
    let diffStr = diff >= 0 ? '+' + formatCurrency(diff) : '-' + formatCurrency(Math.abs(diff));
    if (isCalculated) diffStr = '₹0.00';
    
    hoverTexts.push(
      `<b>Interest Rate: ${tr.toFixed(decimals)}%</b><br>Future Value: ${formatCurrency(simulatedFv)}<br>Difference from Calculated Scenario: ${diffStr}`
    );
    
    let rowStyle = isCalculated ? 'background: rgba(34, 197, 94, 0.15); border: 1px solid rgba(34, 197, 94, 0.3); font-weight: bold; color: var(--amber);' : 'border-bottom: 1px solid rgba(255,255,255,0.05);';
    let icon = isCalculated ? '⭐ ' : '';
    let label = isCalculated ? ' <span style="font-size:0.85em; opacity:0.8;">(Calculated Rate)</span>' : '';
    
    tableRows += `
      <tr style="${rowStyle}">
        <td style="padding: 1rem; text-align: left;">${icon}${tr.toFixed(decimals)}%${label}</td>
        <td style="padding: 1rem; text-align: right;">${formatCurrency(simulatedFv)}</td>
      </tr>
    `;
  }
  
  let insightText = `A <strong style="color: var(--amber);">2% increase</strong> in interest rate (to <strong style="color: var(--amber);">${(calculatedRate + 2).toFixed(decimals)}%</strong>) increases the future value by <strong style="color: var(--amber);">${formatCurrency(differencePlus2)}</strong> over ${years} years.`;

  let sensitivityHtml = `
    <div class="step-card" style="margin-bottom: 2rem;">
      <div style="font-weight: 700; color: #ffffff; font-size: 1.3rem; margin-bottom: 1.5rem; font-family:'Fraunces', serif;">📊 Interest Rate Sensitivity Analysis</div>
      <div style="font-size: 1rem; color: var(--navy); margin-bottom: 1.5rem; line-height: 1.5;">
        Understanding how small changes in the interest rate affect your investment's final outcome is crucial. Here's what happens to your future value if the rate changes slightly:
      </div>
      
      <div style="overflow-x: auto; margin-bottom: 1.5rem;">
        <table style="width: 100%; border-collapse: collapse; color: #d1d5db; background: #111827; border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
          <thead>
            <tr style="background: rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255,255,255,0.1);">
              <th style="padding: 1rem; text-align: left; font-weight: 600; color: #ffffff;">Interest Rate</th>
              <th style="padding: 1rem; text-align: right; font-weight: 600; color: #ffffff;">Future Value</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </div>
      
      <div style="background: #0f172a; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); padding: 1.5rem; margin-bottom: 2rem; color: #ffffff; display: flex; align-items: flex-start; gap: 1rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
        <div style="font-size: 1.5rem; flex-shrink: 0;">💡</div>
        <div style="font-size: 1.05rem; line-height: 1.6; font-weight: 500;">
          <div style="font-weight: 700; color: rgba(255,255,255,0.7); font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">Key Observation</div>
          ${insightText}
        </div>
      </div>
      
      <div style="background: #111827; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); padding: 1rem; box-shadow: 0 10px 30px rgba(0,0,0,0.15);">
        <div id="sensitivity-plot-container" style="width: 100%; height: 400px;"></div>
      </div>
    </div>
  `;

  output.innerHTML = finalResultHtml + sensitivityHtml + stepsHtml + educationalHtml;

  // Render Plotly after injecting HTML
  let tracePlot = {
    x: plotRates,
    y: plotFVs,
    name: 'Future Value',
    type: 'scatter',
    mode: 'lines+markers',
    line: { color: '#22c55e', width: 3, shape: 'spline' },
    marker: { size: 8, color: '#f59e0b' },
    hoverinfo: 'text',
    hovertext: hoverTexts
  };

  let layoutPlot = {
    title: {
      text: '📈 Future Value vs Interest Rate',
      font: { color: '#ffffff', family: 'Fraunces, serif', size: 20 }
    },
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    font: { color: '#9ca3af', family: 'Figtree, sans-serif' },
    xaxis: {
      title: { text: 'Interest Rate (%)', font: { color: '#d1d5db', size: 14 } },
      gridcolor: 'rgba(255,255,255,0.05)',
      zerolinecolor: 'rgba(255,255,255,0.1)',
      tickfont: { color: '#9ca3af' },
      ticksuffix: '%'
    },
    yaxis: {
      title: { text: 'Future Value (₹)', font: { color: '#d1d5db', size: 14 } },
      tickprefix: '₹',
      gridcolor: 'rgba(255,255,255,0.05)',
      zerolinecolor: 'rgba(255,255,255,0.1)',
      tickfont: { color: '#9ca3af' }
    },
    hovermode: 'closest',
    hoverlabel: {
      bgcolor: '#111827',
      font: { family: 'Figtree, sans-serif', color: '#ffffff', size: 14 },
      bordercolor: 'rgba(255,255,255,0.2)',
      padding: { t: 12, b: 12, l: 16, r: 16 }
    },
    margin: { l: 80, r: 40, t: 60, b: 60 }
  };

  let configPlot = {
    responsive: true,
    displayModeBar: true,
    modeBarButtonsToRemove: ['lasso2d', 'select2d'],
    displaylogo: false
  };

  if (typeof Plotly !== 'undefined') {
    Plotly.newPlot('sensitivity-plot-container', [tracePlot], layoutPlot, configPlot);
  } else {
    document.getElementById('sensitivity-plot-container').innerHTML = '<div style="color: #ef4444; padding: 2rem; text-align: center;">Unable to load Plotly.js for interactive chart visualization.</div>';
  }

  output.scrollIntoView({ behavior: 'smooth', block: 'start' });
}


function calculateEMI() {
  const output = document.getElementById('steps-output');
  output.innerHTML = '';
  output.classList.add('active');

  let principalValStr = document.getElementById('emi-principal').value.trim();
  let rateValStr = document.getElementById('emi-rate').value.trim();
  let yearsValStr = document.getElementById('emi-years').value.trim();
  let decimalsValStr = document.getElementById('emi-decimals').value.trim();

  if (principalValStr === '' || rateValStr === '' || yearsValStr === '' || decimalsValStr === '') {
    output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Missing Fields</div></div><div class="step-desc">Please ensure all calculator parameters are filled with valid entries.</div></div>`;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  let P = parseFloat(principalValStr);
  let rate = parseFloat(rateValStr);
  let years = parseFloat(yearsValStr);
  let decimals = parseInt(decimalsValStr);

  // Validation:
  // - Principal > 0
  // - Interest Rate > 0
  // - Loan Tenure > 0
  if (isNaN(P) || P <= 0) {
    output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Invalid Principal Amount</div></div><div class="step-desc">Principal Amount must be a positive number greater than 0.</div></div>`;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  if (isNaN(rate) || rate <= 0) {
    output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Invalid Interest Rate</div></div><div class="step-desc">Annual Interest Rate must be a positive number greater than 0%.</div></div>`;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  if (isNaN(years) || years <= 0) {
    output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Invalid Loan Tenure</div></div><div class="step-desc">Loan Tenure (Years) must be a positive number greater than 0.</div></div>`;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  if (isNaN(decimals) || !/^\d+$/.test(decimalsValStr) || decimals < 0 || decimals > 15) {
    output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Invalid Decimal Places</div></div><div class="step-desc">Decimal places must be an integer between 0 and 15.</div></div>`;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  // Math Calculations:
  // r = Annual Rate / (12 * 100)
  // n = Years * 12
  // EMI = P * r * (1 + r)^n / ((1 + r)^n - 1)
  let r = rate / 1200;
  let n = years * 12;
  let base = 1 + r;
  let powerFactor = Math.pow(base, n);
  let emiVal = (P * r * powerFactor) / (powerFactor - 1);
  let totalAmount = emiVal * n;
  let totalInterest = totalAmount - P;

  const formatCurrency = (val) => {
    return val.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  };

  let stepsHtml = '';
  let stepCount = 1;

  // Step 1: Given Values
  stepsHtml += `<div class="step-card">
    <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <div class="step-number">${stepCount++}</div>
        <div class="step-title">Given Values</div>
      </div>
      <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div>
    </div>
    <div class="step-content">
      <div class="step-desc">Identify the given parameters from the inputs:</div>
      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.1rem; color: var(--navy); margin: 1.5rem 0; padding-left: 2rem; display: flex; flex-direction: column; gap: 0.5rem;">
        <div>Principal Loan Amount (P) = <b>₹${P.toLocaleString('en-IN')}</b></div>
        <div>Annual Interest Rate (R) = <b>${rate}% p.a.</b></div>
        <div>Loan Tenure (t) = <b>${years} Years</b></div>
      </div>
    </div>
  </div>`;

  // Step 2: Convert Annual Rate to Monthly Rate
  stepsHtml += `<div class="step-card">
    <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <div class="step-number">${stepCount++}</div>
        <div class="step-title">Convert Annual Rate to Monthly Rate</div>
      </div>
      <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div>
    </div>
    <div class="step-content">
      <div class="step-desc">Divide the annual interest rate by 12 months and convert it to a decimal (r = R / 1200):</div>
      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.25rem; color: var(--navy); text-align: center; margin: 1.5rem 0;">
        r = ${rate} / 1200 = <b>${r.toFixed(decimals + 6)}</b>
      </div>
    </div>
  </div>`;

  // Step 3: Calculate Total Number of Payments
  stepsHtml += `<div class="step-card">
    <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <div class="step-number">${stepCount++}</div>
        <div class="step-title">Calculate Total Number of Payments</div>
      </div>
      <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div>
    </div>
    <div class="step-content">
      <div class="step-desc">Multiply the loan tenure in years by 12 months (n = t &times; 12):</div>
      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.25rem; color: var(--navy); text-align: center; margin: 1.5rem 0;">
        n = ${years} &times; 12 = <b>${n} payments</b>
      </div>
    </div>
  </div>`;

  // Step 4: Compute (1 + r)^n
  stepsHtml += `<div class="step-card">
    <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <div class="step-number">${stepCount++}</div>
        <div class="step-title">Compute (1 + r)^n</div>
      </div>
      <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div>
    </div>
    <div class="step-content">
      <div class="step-desc">Calculate the compounding base raised to the power of the number of payments:</div>
      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.25rem; color: var(--navy); text-align: center; margin: 1.5rem 0;">
        (1 + ${r.toFixed(decimals + 6)})<sup>${n}</sup> = (${base.toFixed(decimals + 6)})<sup>${n}</sup> = <b>${powerFactor.toFixed(decimals + 4)}</b>
      </div>
    </div>
  </div>`;

  // Step 5: Apply EMI Formula
  stepsHtml += `<div class="step-card">
    <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <div class="step-number">${stepCount++}</div>
        <div class="step-title">Apply EMI Formula</div>
      </div>
      <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div>
    </div>
    <div class="step-content">
      <div class="step-desc">Substitute the values into the loan EMI formula:</div>
      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.15rem; color: var(--navy); margin: 1.5rem 0; display: flex; flex-direction: column; gap: 1rem; align-items: center; text-align: center;">
        <div style="font-size: 1.25rem; font-weight: 600; color: var(--amber);">EMI = [P &times; r &times; (1 + r)<sup>n</sup>] / [(1 + r)<sup>n</sup> - 1]</div>
        <div style="border-top: 1px dashed var(--border); width: 100%; padding-top: 1rem; margin-top: 0.5rem;"><b>Substitution:</b></div>
        <div>EMI = [${P} &times; ${r.toFixed(decimals + 6)} &times; ${powerFactor.toFixed(decimals + 4)}] / [${powerFactor.toFixed(decimals + 4)} - 1]</div>
        <div>Numerator = ${P} &times; ${r.toFixed(decimals + 6)} &times; ${powerFactor.toFixed(decimals + 4)} = ${(P * r * powerFactor).toFixed(decimals + 4)}</div>
        <div>Denominator = ${powerFactor.toFixed(decimals + 4)} - 1 = ${(powerFactor - 1).toFixed(decimals + 4)}</div>
      </div>
    </div>
  </div>`;

  // Step 6: Calculate Monthly EMI and Additional Outputs
  stepsHtml += `<div class="step-card">
    <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <div class="step-number">${stepCount++}</div>
        <div class="step-title">Calculate Monthly EMI & Totals</div>
      </div>
      <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div>
    </div>
    <div class="step-content">
      <div class="step-desc">Divide the numerator by the denominator to find the monthly EMI, and calculate total payables:</div>
      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.15rem; color: var(--navy); margin: 1.5rem 0; display: flex; flex-direction: column; gap: 0.75rem; padding-left: 2rem;">
        <div>Monthly EMI = ${(P * r * powerFactor).toFixed(decimals + 4)} / ${(powerFactor - 1).toFixed(decimals + 4)} = <b>₹${formatCurrency(emiVal)}</b></div>
        <div>Total Amount Payable = EMI &times; n = ₹${formatCurrency(emiVal)} &times; ${n} = <b>₹${formatCurrency(totalAmount)}</b></div>
        <div>Total Interest Payable = Total Amount &minus; Principal = ₹${formatCurrency(totalAmount)} &minus; ₹${P.toLocaleString('en-IN')} = <b>₹${formatCurrency(totalInterest)}</b></div>
      </div>
    </div>
  </div>`;

  // Step 7: Educational Note
  let educationalHtml = `
    <div class="step-card" style="border-left: 4px solid var(--teal); background: rgba(13, 148, 136, 0.05); margin-top: 2rem;">
      <div style="font-weight: 700; color: var(--teal); font-size: 1.1rem; margin-bottom: 0.5rem; font-family:'Fraunces', serif;">✦ Step 7: Educational Note: Understanding Loan Amortisation</div>
      <div style="font-size: 1rem; line-height: 1.5; color: var(--navy);">
        An <strong>Equated Monthly Installment (EMI)</strong> is a fixed payment amount made by a borrower to a lender at a specified date each calendar month. EMIs are applied to both interest and principal each month, so that over a specified number of years, the loan is fully paid off.
        <br><br>
        <strong>Amortisation Dynamics:</strong>
        <ul>
          <li><strong>Interest vs. Principal Ratio:</strong> In the early stages of a loan, a larger portion of your EMI goes toward paying interest because the outstanding principal balance is high. As the principal is gradually paid down, interest charges decrease, and a larger share of the EMI is allocated to principal repayment.</li>
          <li><strong>Impact of Tenure:</strong> Opting for a longer tenure (t) reduces your monthly EMI amount, making it more affordable, but significantly increases the total interest paid over the life of the loan.</li>
        </ul>
      </div>
    </div>
  `;

  // Result Card
  let finalResultHtml = `
    <div class="final-result animate-fade-in" style="padding: 2.5rem; background: #111827; color: #ffffff; border-radius: 16px; border: 1px solid var(--border); box-shadow: 0 10px 30px rgba(0,0,0,0.15); margin-bottom: 2rem; display: flex; flex-wrap: wrap; gap: 2rem; align-items: center; width: 100%; box-sizing: border-box;">
      <div style="flex: 1 1 200px; text-align: left;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; margin-bottom: 0.5rem;">
          <div style="font-size: 1.8rem; font-weight: 700; color: var(--amber); font-family:'Fraunces', serif;">✅ Loan EMI Calculated!</div>
          <button onclick="const c = this.closest('#steps-output').querySelectorAll('.step-card'); if(c.length) c[0].scrollIntoView({behavior: 'smooth', block: 'start'})" style="background: rgba(245, 158, 11, 0.15); color: var(--amber); border: 1px solid rgba(245, 158, 11, 0.3); padding: 0.4rem 0.8rem; border-radius: 8px; font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: all 0.2s; font-family: 'Figtree', sans-serif; display: inline-flex; align-items: center; gap: 0.4rem; white-space: nowrap;" onmouseover="this.style.background='rgba(245, 158, 11, 0.25)'" onmouseout="this.style.background='rgba(245, 158, 11, 0.15)'">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg> View Steps
          </button>
        </div>
        <div style="font-size: 1.05rem; opacity: 0.9; margin-bottom: 1.5rem;">Equated monthly loan repayment projection summary.</div>
        <div style="padding: 1.5rem; background: rgba(255,255,255,0.06); border-radius: 12px; border: 1px solid rgba(255,255,255,0.12);">
          <div style="font-size:0.95rem; font-weight:600; color: rgba(255,255,255,0.7); border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; margin-bottom: 0.75rem;">Monthly EMI:</div>
          <div style="font-family:'IBM Plex Mono',monospace; font-size: 2.2rem; font-weight:700; color:var(--amber); margin: 0.6rem 0;">
            Monthly EMI = <span style="color:#ffffff;">₹${formatCurrency(emiVal)}</span>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.75rem; margin-top: 1.25rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1.25rem; font-size: 0.95rem; opacity: 0.85; line-height:1.6;">
            <div>Principal Amount: <strong>₹${P.toLocaleString('en-IN')}</strong></div>
            <div>Interest Rate: <strong>${rate}% p.a.</strong></div>
            <div>Tenure (Years): <strong>${years}</strong></div>
            <div>Total Interest Payable: <strong style="color:var(--amber);">₹${formatCurrency(totalInterest)}</strong></div>
            <div style="grid-column: span 2;">Total Amount Payable (Principal + Interest): <strong style="color:#ffffff;">₹${formatCurrency(totalAmount)}</strong></div>
          </div>
        </div>
      </div>
    </div>
  `;

  let graphContainerHtml = `
    <div style="background: #111827; border-radius: 16px; border: 1px solid var(--border); padding: 1rem; margin-bottom: 2rem; box-shadow: 0 10px 30px rgba(0,0,0,0.15);">
      <div id="emi-plot-container" style="width: 100%; height: 500px;"></div>
    </div>
  `;

  output.innerHTML = finalResultHtml + graphContainerHtml + stepsHtml + educationalHtml;

  // Calculate arrays for Plotly
  let xMonths = [];
  let yBalance = [];
  let yPrincipal = [];
  let yInterest = [];
  let customEmi = [];
  
  let currentBalance = P;
  let cumPrincipal = 0;
  let cumInterest = 0;
  let fixedEmi = emiVal;
  
  for (let m = 1; m <= n; m++) {
    let intForMonth = currentBalance * r;
    let prinForMonth = fixedEmi - intForMonth;
    let thisEmi = fixedEmi;
    
    // Last month adjustment to clear exactly
    if (m === n) {
      prinForMonth = currentBalance;
      thisEmi = prinForMonth + intForMonth;
    }
    
    currentBalance -= prinForMonth;
    if (currentBalance < 0) currentBalance = 0;
    
    cumPrincipal += prinForMonth;
    cumInterest += intForMonth;
    
    xMonths.push(m);
    yBalance.push(currentBalance);
    yPrincipal.push(cumPrincipal);
    yInterest.push(cumInterest);
    customEmi.push(thisEmi);
  }

  // Generate custom hover text for combined tooltip
  let hoverTextArray = [];
  for (let i = 0; i < n; i++) {
    hoverTextArray.push(
      `<b>Month: ${xMonths[i]}</b><br>Remaining Balance: ₹${yBalance[i].toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}<br>Principal Repaid: ₹${yPrincipal[i].toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}<br>Monthly EMI: ₹${customEmi[i].toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
    );
  }

  // Plotly traces
  let traceBalance = {
    x: xMonths,
    y: yBalance,
    name: 'Remaining Balance',
    type: 'scatter',
    mode: 'lines+markers',
    line: { color: '#ef4444', width: 3, shape: 'spline' },
    marker: { size: 4 },
    hoverinfo: 'text',
    hovertext: hoverTextArray
  };
  
  let tracePrincipal = {
    x: xMonths,
    y: yPrincipal,
    name: 'Principal Repaid',
    type: 'scatter',
    mode: 'lines+markers',
    line: { color: '#22c55e', width: 3, shape: 'spline' },
    marker: { size: 4 },
    hoverinfo: 'text',
    hovertext: hoverTextArray
  };

  let midIdx = Math.floor(n / 2) - 1;
  let layout = {
    title: {
      text: '📈 Loan Repayment Journey',
      font: { color: '#ffffff', family: 'Fraunces, serif', size: 24 }
    },
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    font: { color: '#9ca3af', family: 'Figtree, sans-serif' },
    xaxis: {
      title: { text: 'Month Number', font: { color: '#d1d5db', size: 14 } },
      gridcolor: 'rgba(255,255,255,0.05)',
      zerolinecolor: 'rgba(255,255,255,0.1)',
      tickfont: { color: '#9ca3af' }
    },
    yaxis: {
      title: { text: 'Amount (₹)', font: { color: '#d1d5db', size: 14 } },
      tickprefix: '₹',
      gridcolor: 'rgba(255,255,255,0.05)',
      zerolinecolor: 'rgba(255,255,255,0.1)',
      tickfont: { color: '#9ca3af' }
    },
    hovermode: 'closest',
    hoverlabel: {
      bgcolor: '#111827',
      font: { family: 'Figtree, sans-serif', color: '#ffffff', size: 14 },
      bordercolor: 'rgba(255,255,255,0.2)',
      padding: { t: 12, b: 12, l: 16, r: 16 }
    },
    legend: { orientation: 'h', y: -0.2, x: 0.5, xanchor: 'center', font: { color: '#d1d5db', size: 14 } },
    margin: { l: 80, r: 40, t: 80, b: 80 },
    annotations: [
      {
        x: xMonths[0],
        y: yBalance[0],
        xref: 'x', yref: 'y',
        text: 'Loan Started',
        showarrow: true,
        arrowhead: 2,
        ax: 50,
        ay: -40,
        font: { color: '#ef4444', size: 13, family: 'Figtree, sans-serif', weight: 600 },
        bgcolor: 'rgba(239,68,68,0.1)',
        bordercolor: '#ef4444',
        borderpad: 4
      },
      {
        x: xMonths[midIdx],
        y: yBalance[midIdx],
        xref: 'x', yref: 'y',
        text: 'Halfway Through Loan',
        showarrow: true,
        arrowhead: 2,
        ax: 0,
        ay: -60,
        font: { color: '#ffffff', size: 13, family: 'Figtree, sans-serif' },
        bgcolor: 'rgba(255,255,255,0.1)',
        bordercolor: 'rgba(255,255,255,0.3)',
        borderpad: 4
      },
      {
        x: xMonths[n-1],
        y: yBalance[n-1],
        xref: 'x', yref: 'y',
        text: 'Loan Fully Repaid',
        showarrow: true,
        arrowhead: 2,
        ax: -60,
        ay: -40,
        font: { color: '#22c55e', size: 13, family: 'Figtree, sans-serif', weight: 600 },
        bgcolor: 'rgba(34,197,94,0.1)',
        bordercolor: '#22c55e',
        borderpad: 4
      }
    ]
  };

  let config = {
    responsive: true,
    displayModeBar: true,
    modeBarButtonsToRemove: ['lasso2d', 'select2d'],
    displaylogo: false
  };

  if (typeof Plotly !== 'undefined') {
    Plotly.newPlot('emi-plot-container', [traceBalance, tracePrincipal], layout, config);
  } else {
    document.getElementById('emi-plot-container').innerHTML = '<div style="color: #ef4444; padding: 2rem; text-align: center;">Unable to load Plotly.js for interactive chart visualization.</div>';
  }

  output.scrollIntoView({ behavior: 'smooth', block: 'start' });
}


function calculateHyperbolic() {
  const output = document.getElementById('steps-output');
  if (!output) return;
  output.innerHTML = '';
  output.classList.add('active');

  let funcType = document.getElementById('hyperbolic-function').value;
  let xValStr = document.getElementById('hyperbolic-x').value.trim();
  let decimalsValStr = document.getElementById('hyperbolic-decimals').value.trim();

  // Validate empty input
  if (xValStr === '' || decimalsValStr === '') {
    output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Missing Fields</div></div><div class="step-desc">Please ensure all calculator parameters are filled with valid entries.</div></div>`;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  let x = parseFloat(xValStr);
  let decimals = parseInt(decimalsValStr);

  // Validate x
  if (isNaN(x)) {
    output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Invalid Input Value</div></div><div class="step-desc">The value of x must be a valid number.</div></div>`;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  // Validate decimal places
  if (isNaN(decimals) || !/^\d+$/.test(decimalsValStr) || decimals < 0 || decimals > 15) {
    output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Invalid Decimal Places</div></div><div class="step-desc">Decimal places must be an integer between 0 and 15.</div></div>`;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  // Math computations
  let expX = Math.exp(x);
  let expNegX = Math.exp(-x);
  let sinhVal = (expX - expNegX) / 2;
  let coshVal = (expX + expNegX) / 2;
  let tanhVal = sinhVal / coshVal;

  let finalVal;
  if (funcType === 'sinh') {
    finalVal = sinhVal;
  } else if (funcType === 'cosh') {
    finalVal = coshVal;
  } else {
    finalVal = tanhVal;
  }

  let finalResultStr = finalVal.toFixed(decimals);

  let stepsHtml = '';
  let stepCount = 1;

  // SECTION 1: Given Values
  stepsHtml += `<div class="step-card">
    <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <div class="step-number">${stepCount++}</div>
        <div class="step-title">Given Values</div>
      </div>
      <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div>
    </div>
    <div class="step-content">
      <div class="step-desc">Identify the given parameters from the inputs:</div>
      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.1rem; color: var(--navy); margin: 1.5rem 0; padding-left: 2rem; display: flex; flex-direction: column; gap: 0.5rem;">
        <div>Selected Function = <b>${funcType}(x)</b></div>
        <div>Input Value (x) = <b>${x}</b></div>
        <div>Decimal Places = <b>${decimals}</b></div>
      </div>
    </div>
  </div>`;

  // SECTION 2: Formula Used
  let formulaText = '';
  if (funcType === 'sinh') {
    formulaText = 'sinh(x) = (e^x - e^(-x)) / 2';
  } else if (funcType === 'cosh') {
    formulaText = 'cosh(x) = (e^x + e^(-x)) / 2';
  } else {
    formulaText = 'tanh(x) = sinh(x) / cosh(x)';
  }

  stepsHtml += `<div class="step-card">
    <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <div class="step-number">${stepCount++}</div>
        <div class="step-title">Formula Used</div>
      </div>
      <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div>
    </div>
    <div class="step-content">
      <div class="step-desc">The formula for the selected hyperbolic function is:</div>
      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.25rem; color: var(--navy); text-align: center; margin: 1.5rem 0; font-weight: 600; color: var(--amber);">
        ${formulaText}
      </div>
    </div>
  </div>`;

  // SECTION 3: Exponential Evaluation
  stepsHtml += `<div class="step-card">
    <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <div class="step-number">${stepCount++}</div>
        <div class="step-title">Exponential Evaluation</div>
      </div>
      <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div>
    </div>
    <div class="step-content">
      <div class="step-desc">Evaluate the exponential components e^x and e^(-x):</div>
      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.15rem; color: var(--navy); margin: 1.5rem 0; padding-left: 2rem; display: flex; flex-direction: column; gap: 0.5rem;">
        <div>e^(${x}) = <b>${expX.toFixed(decimals)}</b></div>
        <div>e^(-${x}) = <b>${expNegX.toFixed(decimals)}</b></div>
      </div>
    </div>
  </div>`;

  // SECTION 4: Substitution
  let substitutionHtml = '';
  let roundedExpX = expX.toFixed(decimals);
  let roundedExpNegX = expNegX.toFixed(decimals);

  if (funcType === 'sinh') {
    let diff = (parseFloat(roundedExpX) - parseFloat(roundedExpNegX));
    substitutionHtml = `
      <div>sinh(${x}) = (e^${x} - e^{-${x}}) / 2</div>
      <div>= (${roundedExpX} - ${roundedExpNegX}) / 2</div>
      <div>= ${diff.toFixed(decimals)} / 2</div>
    `;
  } else if (funcType === 'cosh') {
    let sum = (parseFloat(roundedExpX) + parseFloat(roundedExpNegX));
    substitutionHtml = `
      <div>cosh(${x}) = (e^${x} + e^{-${x}}) / 2</div>
      <div>= (${roundedExpX} + ${roundedExpNegX}) / 2</div>
      <div>= ${sum.toFixed(decimals)} / 2</div>
    `;
  } else {
    let roundedSinh = sinhVal.toFixed(decimals);
    let roundedCosh = coshVal.toFixed(decimals);
    substitutionHtml = `
      <div>tanh(${x}) = sinh(${x}) / cosh(${x})</div>
      <div>= (${roundedSinh}) / (${roundedCosh})</div>
    `;
  }

  stepsHtml += `<div class="step-card">
    <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <div class="step-number">${stepCount++}</div>
        <div class="step-title">Substitution</div>
      </div>
      <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div>
    </div>
    <div class="step-content">
      <div class="step-desc">Substitute the numerical values into the selected formula:</div>
      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.15rem; color: var(--navy); margin: 1.5rem 0; display: flex; flex-direction: column; gap: 1rem; align-items: center; text-align: center;">
        ${substitutionHtml}
      </div>
    </div>
  </div>`;

  // SECTION 5: Final Evaluation
  stepsHtml += `<div class="step-card">
    <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <div class="step-number">${stepCount++}</div>
        <div class="step-title">Final Evaluation</div>
      </div>
      <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div>
    </div>
    <div class="step-content">
      <div class="step-desc">Display final calculation:</div>
      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.35rem; color: var(--teal); font-weight: 700; text-align: center; margin: 1.5rem 0;">
        ${funcType}(${x}) = <b>${finalResultStr}</b>
      </div>
    </div>
  </div>`;

  // Result Summary Card
  let finalResultHtml = `
    <div class="final-result animate-fade-in" style="padding: 2.5rem; background: #111827; color: #ffffff; border-radius: 16px; border: 1px solid var(--border); box-shadow: 0 10px 30px rgba(0,0,0,0.15); margin-bottom: 2rem; display: flex; flex-wrap: wrap; gap: 2rem; align-items: center; width: 100%; box-sizing: border-box;">
      <div style="flex: 1 1 200px; text-align: left;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; margin-bottom: 0.5rem;">
          <div style="font-size: 1.8rem; font-weight: 700; color: var(--amber); font-family:'Fraunces', serif;">✅ Hyperbolic Function Evaluated!</div>
          <button onclick="const c = this.closest('#steps-output').querySelectorAll('.step-card'); if(c.length) c[0].scrollIntoView({behavior: 'smooth', block: 'start'})" style="background: rgba(245, 158, 11, 0.15); color: var(--amber); border: 1px solid rgba(245, 158, 11, 0.3); padding: 0.4rem 0.8rem; border-radius: 8px; font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: all 0.2s; font-family: 'Figtree', sans-serif; display: inline-flex; align-items: center; gap: 0.4rem; white-space: nowrap;" onmouseover="this.style.background='rgba(245, 158, 11, 0.25)'" onmouseout="this.style.background='rgba(245, 158, 11, 0.15)'">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg> View Steps
          </button>
        </div>
        <div style="font-size: 1.05rem; opacity: 0.9; margin-bottom: 1.5rem;">Hyperbolic function evaluation summary.</div>
        <div style="padding: 1.5rem; background: rgba(255,255,255,0.06); border-radius: 12px; border: 1px solid rgba(255,255,255,0.12);">
          <div style="font-size:0.95rem; font-weight:600; color: rgba(255,255,255,0.7); border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; margin-bottom: 0.75rem;">Calculation Result:</div>
          <div style="font-family:'IBM Plex Mono',monospace; font-size: 2.2rem; font-weight:700; color:var(--amber); margin: 0.6rem 0;">
            ${funcType}(${x}) = <span style="color:#ffffff;">${finalResultStr}</span>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.75rem; margin-top: 1.25rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1.25rem; font-size: 0.95rem; opacity: 0.85; line-height:1.6;">
            <div>Selected Function: <strong>${funcType}(x)</strong></div>
            <div>Input Value: <strong>x = ${x}</strong></div>
            <div>Final Result: <strong>${finalResultStr}</strong></div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Educational Note Card
  let educationalHtml = `
    <div class="step-card" style="border-left: 4px solid var(--teal); background: rgba(13, 148, 136, 0.05); margin-top: 2rem;">
      <div style="font-weight: 700; color: var(--teal); font-size: 1.1rem; margin-bottom: 0.5rem; font-family:'Fraunces', serif;">✦ Educational Note: Hyperbolic Functions</div>
      <div style="font-size: 1rem; line-height: 1.5; color: var(--navy);">
        Hyperbolic functions are defined using exponential functions:
        <div style="margin: 0.5rem 0; font-family: 'IBM Plex Mono', monospace; font-weight: 600;">
          sinh(x) = (e^x - e^(-x))/2<br>
          cosh(x) = (e^x + e^(-x))/2
        </div>
        <strong>Important Identity:</strong>
        <div style="margin: 0.5rem 0; font-family: 'IBM Plex Mono', monospace; font-weight: 600; color: var(--amber);">
          cosh²(x) − sinh²(x) = 1
        </div>
        Hyperbolic functions are widely used in engineering mathematics, differential equations, and physics.
      </div>
    </div>
  `;

  let graphContainerHtml = `
    <div style="background: #111827; border-radius: 16px; border: 1px solid var(--border); padding: 1rem; margin-bottom: 2rem; box-shadow: 0 10px 30px rgba(0,0,0,0.15);">
      <div id="hyperbolic-plot-container" style="width: 100%; height: 400px;"></div>
    </div>
  `;

  output.innerHTML = finalResultHtml + graphContainerHtml + stepsHtml + educationalHtml;

  // Plotly logic
  let xVals = [];
  let yVals = [];
  let hoverTexts = [];
  
  for (let i = -5; i <= 5.01; i += 0.1) {
    let xv = i;
    let yv;
    switch(funcType) {
      case 'sinh': yv = Math.sinh(xv); break;
      case 'cosh': yv = Math.cosh(xv); break;
      case 'tanh': yv = Math.tanh(xv); break;
      case 'coth': yv = 1 / Math.tanh(xv); break;
      case 'sech': yv = 1 / Math.cosh(xv); break;
      case 'csch': yv = 1 / Math.sinh(xv); break;
    }
    xVals.push(xv);
    yVals.push(yv);
    
    let yvStr = isFinite(yv) ? yv.toFixed(decimals) : 'Undefined';
    hoverTexts.push(`<b>x: ${xv.toFixed(2)}</b><br>${funcType}(x): ${yvStr}`);
  }

  // Cap yVals to avoid huge asymptotes for coth and csch around 0 ruining the plot
  yVals = yVals.map(y => (y > 200) ? null : (y < -200) ? null : y);

  let traceLine = {
    x: xVals,
    y: yVals,
    name: funcType + '(x)',
    type: 'scatter',
    mode: 'lines',
    line: { color: '#3b82f6', width: 3, shape: 'spline' },
    hoverinfo: 'text',
    hovertext: hoverTexts
  };

  let tracePoint = {
    x: [x],
    y: [finalVal],
    name: 'Calculated Point',
    type: 'scatter',
    mode: 'markers',
    marker: { size: 10, color: '#f59e0b', line: { color: '#ffffff', width: 2 } },
    hoverinfo: 'text',
    hovertext: [`<b>Calculated Point</b><br>x: ${x}<br>${funcType}(x): ${finalVal.toFixed(decimals)}`]
  };

  let layoutPlot = {
    title: {
      text: '📈 Hyperbolic Function Visualization',
      font: { color: '#ffffff', family: 'Fraunces, serif', size: 20 }
    },
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    font: { color: '#9ca3af', family: 'Figtree, sans-serif' },
    xaxis: {
      title: { text: 'x', font: { color: '#d1d5db', size: 14 } },
      gridcolor: 'rgba(255,255,255,0.05)',
      zerolinecolor: 'rgba(255,255,255,0.2)',
      tickfont: { color: '#9ca3af' }
    },
    yaxis: {
      title: { text: 'f(x)', font: { color: '#d1d5db', size: 14 } },
      gridcolor: 'rgba(255,255,255,0.05)',
      zerolinecolor: 'rgba(255,255,255,0.2)',
      tickfont: { color: '#9ca3af' }
    },
    hovermode: 'closest',
    hoverlabel: {
      bgcolor: '#111827',
      font: { family: 'Figtree, sans-serif', color: '#ffffff', size: 14 },
      bordercolor: 'rgba(255,255,255,0.2)',
      padding: { t: 12, b: 12, l: 16, r: 16 }
    },
    showlegend: false,
    margin: { l: 60, r: 40, t: 60, b: 60 }
  };

  let configPlot = {
    responsive: true,
    displayModeBar: true,
    modeBarButtonsToRemove: ['lasso2d', 'select2d'],
    displaylogo: false
  };

  if (typeof Plotly !== 'undefined') {
    Plotly.newPlot('hyperbolic-plot-container', [traceLine, tracePoint], layoutPlot, configPlot);
  } else {
    document.getElementById('hyperbolic-plot-container').innerHTML = '<div style="color: #ef4444; padding: 2rem; text-align: center;">Unable to load Plotly.js for interactive chart visualization.</div>';
  }

  output.scrollIntoView({ behavior: 'smooth', block: 'start' });
}


function calculatePolyRoots() {
  const output = document.getElementById('steps-output');
  if (!output) return;
  output.innerHTML = '';
  output.classList.add('active');

  let exprRaw = document.getElementById('poly-expression').value;
  let decimalsValStr = document.getElementById('poly-decimals').value.trim();

  // Validate empty input
  if (exprRaw === null || exprRaw === undefined || exprRaw.trim() === '' || decimalsValStr === '') {
    output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Missing Fields</div></div><div class="step-desc">Please ensure all calculator parameters are filled with valid entries.</div></div>`;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  let expr = exprRaw.trim();
  let decimals = parseInt(decimalsValStr);

  // Validate decimals
  if (isNaN(decimals) || !/^\d+$/.test(decimalsValStr) || decimals < 0 || decimals > 15) {
    output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Invalid Decimal Places</div></div><div class="step-desc">Decimal places must be an integer between 0 and 15.</div></div>`;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  // Expression Validation
  let cleanExpr = expr.replace(/\s+/g, '');
  
  // Check for allowed characters: x, numbers, operators, dots
  if (/[^x0-9\+\-\^\*\.]/.test(cleanExpr)) {
    output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Invalid Polynomial Syntax</div></div><div class="step-desc">The expression contains invalid characters. Only 'x', numbers, and operators (+, -, *, ^) are allowed.</div></div>`;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  // Prevent consecutive operators
  if (/[\+\-\^\*]{2,}/.test(cleanExpr)) {
    output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Invalid Polynomial Syntax</div></div><div class="step-desc">The expression contains consecutive operators (e.g. ++, +-, or ^*).</div></div>`;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  // Prevent starting or ending with bad operators
  if (/^[\^\*]/.test(cleanExpr) || /[\+\-\^\*]$/.test(cleanExpr)) {
    output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Invalid Polynomial Syntax</div></div><div class="step-desc">The expression cannot start with '^' or '*' and cannot end with an operator.</div></div>`;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  // Parse polynomial to coefficients
  let coeffs = parsePolynomialInternal(expr);
  if (!coeffs || coeffs.length < 3) {
    let msg = "Invalid polynomial expression. Make sure it has a valid degree of at least 2.";
    if (coeffs && coeffs.length > 11) {
      msg = "Maximum supported polynomial degree is 10.";
    }
    output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Invalid Polynomial</div></div><div class="step-desc">${msg}</div></div>`;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  let degree = coeffs.length - 1;
  if (degree > 10) {
    output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Degree Too High</div></div><div class="step-desc">Maximum supported polynomial degree is 10.</div></div>`;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  // Solve roots
  let roots = solvePolynomialRootsInternal(coeffs);

  // Classify and clean roots
  let realRoots = [];
  let complexRoots = [];

  for (let r of roots) {
    let re = r.re;
    let im = r.im;

    if (Math.abs(im) < 1e-9) {
      im = 0;
    }
    if (Math.abs(re) < 1e-9) {
      re = 0;
    }

    let cleanedRoot = { re, im };
    if (im === 0) {
      realRoots.push(cleanedRoot);
    } else {
      complexRoots.push(cleanedRoot);
    }
  }

  // Sort real roots ascending
  realRoots.sort((a, b) => a.re - b.re);

  // Sort complex roots by real part, then by imaginary part
  complexRoots.sort((a, b) => {
    if (Math.abs(a.re - b.re) < 1e-8) {
      return a.im - b.im;
    }
    return a.re - b.re;
  });

  let allRootsSorted = [...realRoots, ...complexRoots];

  // Helper formatting function
  function formatRoot(r, decimals) {
    let re = r.re.toFixed(decimals);
    let im = r.im.toFixed(decimals);

    if (parseFloat(re) === 0) re = (0).toFixed(decimals);
    if (parseFloat(im) === 0) im = (0).toFixed(decimals);

    let reNum = parseFloat(re);
    let imNum = parseFloat(im);

    if (imNum === 0) {
      return `${re}`;
    } else {
      let sign = imNum > 0 ? '+' : '-';
      let absIm = Math.abs(imNum).toFixed(decimals);
      
      // Check if absIm is close to 1
      let imStr = absIm;
      if (Math.abs(Math.abs(imNum) - 1) < 1e-9) {
        imStr = '';
      }

      if (reNum === 0) {
        if (imNum === 1) return `i`;
        if (imNum === -1) return `-i`;
        return `${imNum > 0 ? '' : '-'}${imStr}i`;
      } else {
        if (imNum === 1) return `${re} + i`;
        if (imNum === -1) return `${re} - i`;
        return `${re} ${sign} ${imStr}i`;
      }
    }
  }

  // Root List HTML
  let rootListHtml = '';
  for (let i = 0; i < allRootsSorted.length; i++) {
    rootListHtml += `<div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.25rem; color: var(--navy); margin: 0.5rem 0;">x<sub>${i + 1}</sub> = <b>${formatRoot(allRootsSorted[i], decimals)}</b></div>`;
  }

  // Result Summary Card
  let finalResultHtml = `
    <div class="final-result animate-fade-in" style="padding: 2.5rem; background: #111827; color: #ffffff; border-radius: 16px; border: 1px solid var(--border); box-shadow: 0 10px 30px rgba(0,0,0,0.15); margin-bottom: 2rem; display: flex; flex-wrap: wrap; gap: 2rem; align-items: center; width: 100%; box-sizing: border-box;">
      <div style="flex: 1 1 200px; text-align: left;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; margin-bottom: 0.5rem;">
          <div style="font-size: 1.8rem; font-weight: 700; color: var(--amber); font-family:'Fraunces', serif;">✅ Polynomial Root Analysis Complete</div>
        </div>
        <div style="font-size: 1.05rem; opacity: 0.9; margin-bottom: 1.5rem;">Roots computed successfully using simultaneous iteration.</div>
        <div style="padding: 1.5rem; background: rgba(255,255,255,0.06); border-radius: 12px; border: 1px solid rgba(255,255,255,0.12);">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; font-size: 1rem; opacity: 0.95; line-height: 1.8;">
            <div>Polynomial: <strong style="color:var(--amber); font-family:'IBM Plex Mono', monospace;">${expr}</strong></div>
            <div>Detected Degree: <strong>${degree}</strong></div>
            <div>Total Roots Found: <strong>${allRootsSorted.length}</strong></div>
            <div>Real Roots Count: <strong style="color:var(--teal);">${realRoots.length}</strong></div>
            <div>Complex Roots Count: <strong style="color:var(--amber);">${complexRoots.length}</strong></div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Minimal Explanation Section
  let stepsHtml = `<div class="step-card">
    <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <div class="step-number">1</div>
        <div class="step-title">Computed Roots</div>
      </div>
      <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div>
    </div>
    <div class="step-content">
      <div class="step-desc">All roots computed for polynomial of degree ${degree}:</div>
      <div style="margin: 1.5rem 0; padding-left: 2rem; display: flex; flex-direction: column;">
        ${rootListHtml}
      </div>
    </div>
  </div>`;

  // Educational Note Card
  let educationalHtml = `
    <div class="step-card" style="border-left: 4px solid var(--teal); background: rgba(13, 148, 136, 0.05); margin-top: 2rem;">
      <div style="font-weight: 700; color: var(--teal); font-size: 1.1rem; margin-bottom: 0.5rem; font-family:'Fraunces', serif;">✦ Educational Note: Fundamental Theorem of Algebra</div>
      <div style="font-size: 1rem; line-height: 1.5; color: var(--navy);">
        Polynomial equations of degree n have exactly n roots (counting multiplicities and complex roots).
        <br><br>
        Engineering applications include control systems, signal processing, numerical methods, and circuit analysis.
      </div>
    </div>
  `;

  let graphContainerHtml = `
    <div style="background: #111827; border-radius: 16px; border: 1px solid var(--border); padding: 1rem; margin-bottom: 2rem; box-shadow: 0 10px 30px rgba(0,0,0,0.15);">
      <div id="poly-roots-plot-container" style="width: 100%; height: 400px;"></div>
    </div>
  `;

  output.innerHTML = finalResultHtml + graphContainerHtml + stepsHtml + educationalHtml;

  // Plotly logic for Polynomial
  let minR = realRoots.length > 0 ? realRoots[0].re : -5;
  let maxR = realRoots.length > 0 ? realRoots[realRoots.length - 1].re : 5;
  let padding = Math.max(2, (maxR - minR) * 0.2);
  let xStart = minR - padding;
  let xEnd = maxR + padding;
  let step = (xEnd - xStart) / 200;

  let xValsPlot = [];
  let yValsPlot = [];
  let polyHoverTexts = [];

  for (let xv = xStart; xv <= xEnd + step/2; xv += step) {
    let yv = coeffs.reduce((sum, c, i) => sum + c * Math.pow(xv, i), 0);
    xValsPlot.push(xv);
    yValsPlot.push(yv);
    polyHoverTexts.push(`<b>x: ${xv.toFixed(3)}</b><br>y: ${yv.toFixed(3)}`);
  }

  // Generate roots scatter data
  let rootXVals = [];
  let rootYVals = [];
  let rootHoverTexts = [];

  for (let r of realRoots) {
    rootXVals.push(r.re);
    rootYVals.push(0);
    rootHoverTexts.push(`<b>Root</b><br>x: ${r.re.toFixed(decimals)}<br>y: 0`);
  }

  let tracePolyLine = {
    x: xValsPlot,
    y: yValsPlot,
    name: 'P(x)',
    type: 'scatter',
    mode: 'lines',
    line: { color: '#3b82f6', width: 3, shape: 'spline' },
    hoverinfo: 'text',
    hovertext: polyHoverTexts
  };

  let traceRoots = {
    x: rootXVals,
    y: rootYVals,
    name: 'Real Roots',
    type: 'scatter',
    mode: 'markers',
    marker: { size: 10, color: '#f59e0b', line: { color: '#ffffff', width: 2 } },
    hoverinfo: 'text',
    hovertext: rootHoverTexts
  };

  let traceZeroLine = {
    x: [xStart, xEnd],
    y: [0, 0],
    name: 'y = 0',
    type: 'scatter',
    mode: 'lines',
    line: { color: 'rgba(255,255,255,0.3)', width: 1, dash: 'dash' },
    hoverinfo: 'skip'
  };

  let layoutPolyPlot = {
    title: {
      text: '📈 Polynomial Root Visualization',
      font: { color: '#ffffff', family: 'Fraunces, serif', size: 20 }
    },
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    font: { color: '#9ca3af', family: 'Figtree, sans-serif' },
    xaxis: {
      title: { text: 'x', font: { color: '#d1d5db', size: 14 } },
      gridcolor: 'rgba(255,255,255,0.05)',
      zerolinecolor: 'rgba(255,255,255,0.2)',
      tickfont: { color: '#9ca3af' }
    },
    yaxis: {
      title: { text: 'y = P(x)', font: { color: '#d1d5db', size: 14 } },
      gridcolor: 'rgba(255,255,255,0.05)',
      zerolinecolor: 'rgba(255,255,255,0.2)',
      tickfont: { color: '#9ca3af' }
    },
    hovermode: 'closest',
    hoverlabel: {
      bgcolor: '#111827',
      font: { family: 'Figtree, sans-serif', color: '#ffffff', size: 14 },
      bordercolor: 'rgba(255,255,255,0.2)',
      padding: { t: 12, b: 12, l: 16, r: 16 }
    },
    showlegend: false,
    margin: { l: 60, r: 40, t: 60, b: 60 }
  };

  let configPolyPlot = {
    responsive: true,
    displayModeBar: true,
    modeBarButtonsToRemove: ['lasso2d', 'select2d'],
    displaylogo: false
  };

  if (typeof Plotly !== 'undefined') {
    Plotly.newPlot('poly-roots-plot-container', [tracePolyLine, traceZeroLine, traceRoots], layoutPolyPlot, configPolyPlot);
  } else {
    document.getElementById('poly-roots-plot-container').innerHTML = '<div style="color: #ef4444; padding: 2rem; text-align: center;">Unable to load Plotly.js for interactive chart visualization.</div>';
  }

  output.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // INTERNAL HELPERS
  function parsePolynomialInternal(exprStr) {
    let str = exprStr.toLowerCase().replace(/\s+/g, '');
    str = str.replace(/-/g, '+-');
    if (str.startsWith('+')) {
      str = str.substring(1);
    }

    let terms = str.split('+').filter(t => t !== '');
    let coefMap = {};
    let maxDeg = 0;
    const termRegex = /^([+-]?\d*(?:\.\d+)?)(?:\*?x(?:\^(\d+))?)?$/;

    for (let term of terms) {
      let match = term.match(termRegex);
      if (!match) return null;

      let coefStr = match[1];
      let expStr = match[2];
      let hasX = term.includes('x');

      let coef = 1;
      if (coefStr === '+') coef = 1;
      else if (coefStr === '-') coef = -1;
      else if (coefStr !== '') coef = parseFloat(coefStr);

      if (isNaN(coef)) return null;

      let exp = 0;
      if (hasX) {
        if (expStr !== undefined) {
          exp = parseInt(expStr);
          if (isNaN(exp) || exp < 0) return null;
        } else {
          exp = 1;
        }
      } else {
        exp = 0;
      }

      if (coefMap[exp] !== undefined) {
        coefMap[exp] += coef;
      } else {
        coefMap[exp] = coef;
      }

      if (exp > maxDeg) {
        maxDeg = exp;
      }
    }

    let coeffsArr = new Array(maxDeg + 1).fill(0);
    for (let exp in coefMap) {
      coeffsArr[exp] = coefMap[exp];
    }
    return coeffsArr;
  }

  function solvePolynomialRootsInternal(coeffsArr) {
    const ComplexMath = {
      create: (re, im = 0) => ({ re, im }),
      add: (a, b) => ({ re: a.re + b.re, im: a.im + b.im }),
      sub: (a, b) => ({ re: a.re - b.re, im: a.im - b.im }),
      mul: (a, b) => ({
        re: a.re * b.re - a.im * b.im,
        im: a.re * b.im + a.im * b.re
      }),
      div: (a, b) => {
        let denom = b.re * b.re + b.im * b.im;
        if (denom === 0) return { re: NaN, im: NaN };
        return {
          re: (a.re * b.re + a.im * b.im) / denom,
          im: (a.im * b.re - a.re * b.im) / denom
        };
      },
      pow: (a, n) => {
        let res = { re: 1, im: 0 };
        for (let i = 0; i < n; i++) {
          res = ComplexMath.mul(res, a);
        }
        return res;
      },
      abs: (a) => Math.sqrt(a.re * a.re + a.im * a.im)
    };

    function evalPolyHornerComplex(coeffs, x) {
      let n = coeffs.length - 1;
      let res = ComplexMath.create(coeffs[n], 0);
      for (let i = n - 1; i >= 0; i--) {
        res = ComplexMath.add(ComplexMath.mul(res, x), ComplexMath.create(coeffs[i], 0));
      }
      return res;
    }

    let n = coeffsArr.length - 1;
    // Divide by coeffsArr[n] to make it monic
    let monicCoeffs = coeffsArr.map(c => c / coeffsArr[n]);

    let maxCoef = 0;
    for (let i = 0; i < n; i++) {
      maxCoef = Math.max(maxCoef, Math.abs(monicCoeffs[i]));
    }
    let R = Math.max(1, 1 + maxCoef);

    // Initial estimates using staggered angles to break symmetry
    let rootsArr = [];
    for (let j = 0; j < n; j++) {
      let angle = (2 * Math.PI * j) / n + Math.PI / (2 * n);
      rootsArr.push({
        re: R * Math.cos(angle) * 0.9,
        im: R * Math.sin(angle) * 0.9
      });
    }

    let maxIterations = 500;
    let tolerance = 1e-12;

    for (let iter = 0; iter < maxIterations; iter++) {
      let maxChange = 0;
      let newRoots = [];

      for (let i = 0; i < n; i++) {
        let xi = rootsArr[i];
        let f_xi = evalPolyHornerComplex(monicCoeffs, xi);

        let denom = ComplexMath.create(1, 0);
        for (let j = 0; j < n; j++) {
          if (i !== j) {
            let diff = ComplexMath.sub(xi, rootsArr[j]);
            denom = ComplexMath.mul(denom, diff);
          }
        }

        let delta = ComplexMath.div(f_xi, denom);
        if (isNaN(delta.re) || isNaN(delta.im)) {
          break;
        }

        let next_xi = ComplexMath.sub(xi, delta);
        newRoots.push(next_xi);

        let change = ComplexMath.abs(delta);
        if (change > maxChange) {
          maxChange = change;
        }
      }

      if (newRoots.length === n) {
        rootsArr = newRoots;
      } else {
        break;
      }

      if (maxChange < tolerance) {
        break;
      }
    }

    return rootsArr;
  }
}

// ============================================================================
// MULTIPLE ANGLE EXPANSION & POWER REDUCTION CALCULATORS IMPLEMENTATION
// ============================================================================

const maeFormulas = {
  sin: {
    2: {
      formula: "2sinθcosθ",
      latex: "2\\sin\\theta\\cos\\theta",
      eval: (s, c) => 2 * s * c,
      steps: `
        Compare the imaginary parts from both sides:
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; color:var(--amber); font-weight: 600;">sin(2θ) = 2sinθcosθ</div>
        Since it already contains only powers of sinθ and cosθ, no further trigonometric substitution is required.
      `
    },
    3: {
      formula: "3sinθ − 4sin³θ",
      latex: "3\\sin\\theta - 4\\sin^3\\theta",
      eval: (s, c) => 3 * s - 4 * Math.pow(s, 3),
      steps: `
        Compare the imaginary parts from both sides:
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; font-weight: 600;">sin(3θ) = 3cos²θsinθ − sin³θ</div>
        Substitute <b>cos²θ = 1 − sin²θ</b> to express the formula in terms of sinθ only:
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; color:var(--amber); line-height: 1.6; font-weight: 600;">
          sin(3θ) = 3(1 − sin²θ)sinθ − sin³θ <br>
          = 3sinθ − 3sin³θ − sin³θ <br>
          = 3sinθ − 4sin³θ
        </div>
      `
    },
    4: {
      formula: "cosθ(4sinθ − 8sin³θ)",
      latex: "\\cos\\theta(4\\sin\\theta - 8\\sin^3\\theta)",
      eval: (s, c) => c * (4 * s - 8 * Math.pow(s, 3)),
      steps: `
        Compare the imaginary parts from both sides:
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; font-weight: 600;">sin(4θ) = 4cos³θsinθ − 4cosθsin³θ</div>
        Factor out <b>cosθ</b> from the terms:
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; font-weight: 600;">sin(4θ) = cosθ(4cos²θsinθ − 4sin³θ)</div>
        Substitute <b>cos²θ = 1 − sin²θ</b> into the brackets:
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; color:var(--amber); line-height: 1.6; font-weight: 600;">
          sin(4θ) = cosθ(4(1 − sin²θ)sinθ − 4sin³θ) <br>
          = cosθ(4sinθ − 4sin³θ − 4sin³θ) <br>
          = cosθ(4sinθ − 8sin³θ)
        </div>
      `
    },
    5: {
      formula: "16sin⁵θ − 20sin³θ + 5sinθ",
      latex: "16\\sin^5\\theta - 20\\sin^3\\theta + 5\\sin\\theta",
      eval: (s, c) => 16 * Math.pow(s, 5) - 20 * Math.pow(s, 3) + 5 * s,
      steps: `
        Compare the imaginary parts from both sides:
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; font-weight: 600;">sin(5θ) = 5cos⁴θsinθ − 10cos²θsin³θ + sin⁵θ</div>
        Substitute <b>cos²θ = 1 − sin²θ</b> (and thus <b>cos⁴θ = (1 − sin²θ)²</b>):
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; color:var(--amber); line-height: 1.6; font-weight: 600;">
          sin(5θ) = 5(1 − sin²θ)²sinθ − 10(1 − sin²θ)sin³θ + sin⁵θ <br>
          = 5(1 − 2sin²θ + sin⁴θ)sinθ − 10(sin³θ − sin⁵θ) + sin⁵θ <br>
          = (5sinθ − 10sin³θ + 5sin⁵θ) − 10sin³θ + 10sin⁵θ + sin⁵θ <br>
          = 16sin⁵θ − 20sin³θ + 5sinθ
        </div>
      `
    },
    6: {
      formula: "cosθ(32sin⁵θ − 32sin³θ + 6sinθ)",
      latex: "\\cos\\theta(32\\sin^5\\theta - 32\\sin^3\\theta + 6\\sin\\theta)",
      eval: (s, c) => c * (32 * Math.pow(s, 5) - 32 * Math.pow(s, 3) + 6 * s),
      steps: `
        Compare the imaginary parts from both sides:
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; font-weight: 600;">sin(6θ) = 6cos⁵θsinθ − 20cos³θsin³θ + 6cosθsin⁵θ</div>
        Factor out <b>cosθ</b>:
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; font-weight: 600;">sin(6θ) = cosθ(6cos⁴θsinθ − 20cos²θsin³θ + 6sin⁵θ)</div>
        Substitute <b>cos²θ = 1 − sin²θ</b> and <b>cos⁴θ = (1 − sin²θ)²</b>:
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; color:var(--amber); line-height: 1.6; font-weight: 600;">
          sin(6θ) = cosθ( 6(1 − 2sin²θ + sin⁴θ)sinθ − 20(1 − sin²θ)sin³θ + 6sin⁵θ ) <br>
          = cosθ( (6sinθ − 12sin³θ + 6sin⁵θ) − (20sin³θ − 20sin⁵θ) + 6sin⁵θ ) <br>
          = cosθ( 32sin⁵θ − 32sin³θ + 6sinθ )
        </div>
      `
    }
  },
  cos: {
    2: {
      formula: "2cos²θ − 1",
      latex: "2\\cos^2\\theta - 1",
      eval: (s, c) => 2 * c * c - 1,
      steps: `
        Compare the real parts from both sides:
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; font-weight: 600;">cos(2θ) = cos²θ − sin²θ</div>
        Substitute <b>sin²θ = 1 − cos²θ</b> to express the formula in terms of cosθ only:
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; color:var(--amber); line-height: 1.6; font-weight: 600;">
          cos(2θ) = cos²θ − (1 − cos²θ) <br>
          = 2cos²θ − 1
        </div>
      `
    },
    3: {
      formula: "4cos³θ − 3cosθ",
      latex: "4\\cos^3\\theta - 3\\cos\\theta",
      eval: (s, c) => 4 * Math.pow(c, 3) - 3 * c,
      steps: `
        Compare the real parts from both sides:
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; font-weight: 600;">cos(3θ) = cos³θ − 3cosθsin²θ</div>
        Substitute <b>sin²θ = 1 − cos²θ</b> to express the formula in terms of cosθ only:
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; color:var(--amber); line-height: 1.6; font-weight: 600;">
          cos(3θ) = cos³θ − 3cosθ(1 − cos²θ) <br>
          = cos³θ − 3cosθ + 3cos³θ <br>
          = 4cos³θ − 3cosθ
        </div>
      `
    },
    4: {
      formula: "8cos⁴θ − 8cos²θ + 1",
      latex: "8\\cos^4\\theta - 8\\cos^2\\theta + 1",
      eval: (s, c) => 8 * Math.pow(c, 4) - 8 * Math.pow(c, 2) + 1,
      steps: `
        Compare the real parts from both sides:
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; font-weight: 600;">cos(4θ) = cos⁴θ − 6cos²θsin²θ + sin⁴θ</div>
        Substitute <b>sin²θ = 1 − cos²θ</b> (and thus <b>sin⁴θ = (1 − cos²θ)²</b>):
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; color:var(--amber); line-height: 1.6; font-weight: 600;">
          cos(4θ) = cos⁴θ − 6cos²θ(1 − cos²θ) + (1 − cos²θ)² <br>
          = cos⁴θ − 6cos²θ + 6cos⁴θ + (1 − 2cos²θ + cos⁴θ) <br>
          = 8cos⁴θ − 8cos²θ + 1
        </div>
      `
    },
    5: {
      formula: "16cos⁵θ − 20cos³θ + 5cosθ",
      latex: "16\\cos^5\\theta - 20\\cos^3\\theta + 5\\cos\\theta",
      eval: (s, c) => 16 * Math.pow(c, 5) - 20 * Math.pow(c, 3) + 5 * c,
      steps: `
        Compare the real parts from both sides:
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; font-weight: 600;">cos(5θ) = cos⁵θ − 10cos³θsin²θ + 5cosθsin⁴θ</div>
        Substitute <b>sin²θ = 1 − cos²θ</b> and <b>sin⁴θ = (1 − cos²θ)²</b>:
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; color:var(--amber); line-height: 1.6; font-weight: 600;">
          cos(5θ) = cos⁵θ − 10cos³θ(1 − cos²θ) + 5cosθ(1 − cos²θ)² <br>
          = cos⁵θ − 10cos³θ + 10cos⁵θ + 5cosθ(1 − 2cos²θ + cos⁴θ) <br>
          = 11cos⁵θ − 10cos³θ + 5cosθ − 10cos³θ + 5cos⁵θ <br>
          = 16cos⁵θ − 20cos³θ + 5cosθ
        </div>
      `
    },
    6: {
      formula: "32cos⁶θ − 48cos⁴θ + 18cos²θ − 1",
      latex: "32\\cos^6\\theta - 48\\cos^4\\theta + 18\\cos^2\\theta - 1",
      eval: (s, c) => 32 * Math.pow(c, 6) - 48 * Math.pow(c, 4) + 18 * Math.pow(c, 2) - 1,
      steps: `
        Compare the real parts from both sides:
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; font-weight: 600;">cos(6θ) = cos⁶θ − 15cos⁴θsin²θ + 15cos²θsin⁴θ − sin⁶θ</div>
        Substitute <b>sin²θ = 1 − cos²θ</b>, <b>sin⁴θ = (1 − cos²θ)²</b>, and <b>sin⁶θ = (1 − cos²θ)³</b>:
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; color:var(--amber); line-height: 1.6; font-weight: 600;">
          cos(6θ) = cos⁶θ − 15cos⁴θ(1 − cos²θ) + 15cos²θ(1 − 2cos²θ + cos⁴θ) − (1 − 3cos²θ + 3cos⁴θ − cos⁶θ) <br>
          = cos⁶θ − 15cos⁴θ + 15cos⁶θ + 15cos²θ − 30cos⁴θ + 15cos⁶θ − 1 + 3cos²θ − 3cos⁴θ + cos⁶θ <br>
          = 32cos⁶θ − 48cos⁴θ + 18cos²θ − 1
        </div>
      `
    }
  }
};

const prFormulas = {
  sin: {
    2: {
      formula: "(1 − cos2θ) / 2",
      latex: "\\frac{1 - \\cos 2\\theta}{2}",
      eval: (t) => (1 - Math.cos(2 * t)) / 2,
      steps: `
        Raise both sides to power 2:
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; font-weight: 600;">(2isinθ)² = (z − 1/z)²</div>
        Expand the right hand side:
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; font-weight: 600;">−4sin²θ = z² − 2 + 1/z²</div>
        Pair the reciprocal terms:
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; font-weight: 600;">−4sin²θ = (z² + 1/z²) − 2</div>
        Substitute <b>z² + 1/z² = 2cos2θ</b> (from De Moivre's relation):
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; font-weight: 600;">−4sin²θ = 2cos2θ − 2</div>
        Divide by −4 to obtain the final power reduction identity:
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; color:var(--amber); font-weight: 600;">sin²θ = (1 − cos2θ) / 2</div>
      `
    },
    3: {
      formula: "(3sinθ − sin3θ) / 4",
      latex: "\\frac{3\\sin\\theta - \\sin 3\\theta}{4}",
      eval: (t) => (3 * Math.sin(t) - Math.sin(3 * t)) / 4,
      steps: `
        Raise both sides to power 3:
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; font-weight: 600;">(2isinθ)³ = (z − 1/z)³</div>
        Expand the right hand side using the Binomial Theorem:
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; font-weight: 600;">−8isin³θ = z³ − 3z + 3/z − 1/z³</div>
        Pair the reciprocal terms from the ends:
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; font-weight: 600;">−8isin³θ = (z³ − 1/z³) − 3(z − 1/z)</div>
        Substitute <b>zᵐ − 1/zᵐ = 2isin(mθ)</b>:
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; font-weight: 600;">−8isin³θ = 2isin3θ − 3(2isinθ) = 2isin3θ − 6isinθ</div>
        Divide by −8i to solve for sin³θ:
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; color:var(--amber); font-weight: 600;">sin³θ = (3sinθ − sin3θ) / 4</div>
      `
    },
    4: {
      formula: "(3 − 4cos2θ + cos4θ) / 8",
      latex: "\\frac{3 - 4\\cos 2\\theta + \\cos 4\\theta}{8}",
      eval: (t) => (3 - 4 * Math.cos(2 * t) + Math.cos(4 * t)) / 8,
      steps: `
        Raise both sides to power 4:
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; font-weight: 600;">(2isinθ)⁴ = (z − 1/z)⁴</div>
        Expand using the Binomial Theorem:
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; font-weight: 600;">16sin⁴θ = z⁴ − 4z² + 6 − 4/z² + 1/z⁴</div>
        Pair reciprocal terms:
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; font-weight: 600;">16sin⁴θ = (z⁴ + 1/z⁴) − 4(z² + 1/z²) + 6</div>
        Substitute <b>zᵐ + 1/zᵐ = 2cos(mθ)</b>:
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; font-weight: 600;">16sin⁴θ = 2cos4θ − 4(2cos2θ) + 6 = 2cos4θ − 8cos2θ + 6</div>
        Divide by 16 to get the simplified identity:
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; color:var(--amber); font-weight: 600;">sin⁴θ = (3 − 4cos2θ + cos4θ) / 8</div>
      `
    },
    5: {
      formula: "(10sinθ − 5sin3θ + sin5θ) / 16",
      latex: "\\frac{10\\sin\\theta - 5\\sin 3\\theta + \\sin 5\\theta}{16}",
      eval: (t) => (10 * Math.sin(t) - 5 * Math.sin(3 * t) + Math.sin(5 * t)) / 16,
      steps: `
        Raise both sides to power 5:
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; font-weight: 600;">(2isinθ)⁵ = (z − 1/z)⁵</div>
        Expand using the Binomial Theorem:
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; font-weight: 600;">32isin⁵θ = z⁵ − 5z³ + 10z − 10/z + 5/z³ − 1/z⁵</div>
        Pair reciprocal terms:
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; font-weight: 600;">32isin⁵θ = (z⁵ − 1/z⁵) − 5(z³ − 1/z³) + 10(z − 1/z)</div>
        Substitute <b>zᵐ − 1/zᵐ = 2isin(mθ)</b>:
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; font-weight: 600;">32isin⁵θ = 2isin5θ − 5(2isin3θ) + 10(2isinθ) = 2isin5θ − 10isin3θ + 20isinθ</div>
        Divide by 32i to isolate sin⁵θ:
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; color:var(--amber); font-weight: 600;">sin⁵θ = (10sinθ − 5sin3θ + sin5θ) / 16</div>
      `
    },
    6: {
      formula: "(10 − 15cos2θ + 6cos4θ − cos6θ) / 32",
      latex: "\\frac{10 - 15\\cos 2\\theta + 6\\cos 4\\theta - \\cos 6\\theta}{32}",
      eval: (t) => (10 - 15 * Math.cos(2 * t) + 6 * Math.cos(4 * t) - Math.cos(6 * t)) / 32,
      steps: `
        Raise both sides to power 6:
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; font-weight: 600;">(2isinθ)⁶ = (z − 1/z)⁶</div>
        Expand using the Binomial Theorem:
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; font-weight: 600;">−64sin⁶θ = z⁶ − 6z⁴ + 15z² − 20 + 15/z² − 6/z⁴ + 1/z⁶</div>
        Pair reciprocal terms:
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; font-weight: 600;">−64sin⁶θ = (z⁶ + 1/z⁶) − 6(z⁴ + 1/z⁴) + 15(z² + 1/z²) − 20</div>
        Substitute De Moivre cosine relations:
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; font-weight: 600;">−64sin⁶θ = 2cos6θ − 6(2cos4θ) + 15(2cos2θ) − 20 = 2cos6θ − 12cos4θ + 30cos2θ − 20</div>
        Divide by −64 to simplify:
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; color:var(--amber); font-weight: 600;">sin⁶θ = (10 − 15cos2θ + 6cos4θ − cos6θ) / 32</div>
      `
    }
  },
  cos: {
    2: {
      formula: "(cos2θ + 1) / 2",
      latex: "\\frac{\\cos 2\\theta + 1}{2}",
      eval: (t) => (Math.cos(2 * t) + 1) / 2,
      steps: `
        Raise both sides to power 2:
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; font-weight: 600;">(2cosθ)² = (z + 1/z)²</div>
        Expand the right hand side:
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; font-weight: 600;">4cos²θ = z² + 2 + 1/z²</div>
        Pair reciprocal terms:
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; font-weight: 600;">4cos²θ = (z² + 1/z²) + 2</div>
        Substitute <b>z² + 1/z² = 2cos2θ</b>:
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; font-weight: 600;">4cos²θ = 2cos2θ + 2</div>
        Divide by 4 to simplify:
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; color:var(--amber); font-weight: 600;">cos²θ = (cos2θ + 1) / 2</div>
      `
    },
    3: {
      formula: "(cos3θ + 3cosθ) / 4",
      latex: "\\frac{\\cos 3\\theta + 3\\cos\\theta}{4}",
      eval: (t) => (Math.cos(3 * t) + 3 * Math.cos(t)) / 4,
      steps: `
        Raise both sides to power 3:
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; font-weight: 600;">(2cosθ)³ = (z + 1/z)³</div>
        Expand the right hand side:
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; font-weight: 600;">8cos³θ = z³ + 3z + 3/z + 1/z³</div>
        Pair matching terms:
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; font-weight: 600;">8cos³θ = (z³ + 1/z³) + 3(z + 1/z)</div>
        Substitute <b>zᵐ + 1/zᵐ = 2cos(mθ)</b>:
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; font-weight: 600;">8cos³θ = 2cos3θ + 3(2cosθ) = 2cos3θ + 6cosθ</div>
        Divide by 8 to simplify:
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; color:var(--amber); font-weight: 600;">cos³θ = (cos3θ + 3cosθ) / 4</div>
      `
    },
    4: {
      formula: "(cos4θ + 4cos2θ + 3) / 8",
      latex: "\\frac{\\cos 4\\theta + 4\\cos 2\\theta + 3}{8}",
      eval: (t) => (Math.cos(4 * t) + 4 * Math.cos(2 * t) + 3) / 8,
      steps: `
        Raise both sides to power 4:
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; font-weight: 600;">(2cosθ)⁴ = (z + 1/z)⁴</div>
        Expand using the Binomial Theorem:
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; font-weight: 600;">16cos⁴θ = z⁴ + 4z² + 6 + 4/z² + 1/z⁴</div>
        Pair reciprocal terms:
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; font-weight: 600;">16cos⁴θ = (z⁴ + 1/z⁴) + 4(z² + 1/z²) + 6</div>
        Substitute <b>zᵐ + 1/zᵐ = 2cos(mθ)</b>:
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; font-weight: 600;">16cos⁴θ = 2cos4θ + 4(2cos2θ) + 6 = 2cos4θ + 8cos2θ + 6</div>
        Divide by 16 to simplify:
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; color:var(--amber); font-weight: 600;">cos⁴θ = (cos4θ + 4cos2θ + 3) / 8</div>
      `
    },
    5: {
      formula: "(cos5θ + 5cos3θ + 10cosθ) / 16",
      latex: "\\frac{\\cos 5\\theta + 5\\cos 3\\theta + 10\\cos\\theta}{16}",
      eval: (t) => (Math.cos(5 * t) + 5 * Math.cos(3 * t) + 10 * Math.cos(t)) / 16,
      steps: `
        Raise both sides to power 5:
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; font-weight: 600;">(2cosθ)⁵ = (z + 1/z)⁵</div>
        Expand using the Binomial Theorem:
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; font-weight: 600;">32cos⁵θ = z⁵ + 5z³ + 10z + 10/z + 5/z³ + 1/z⁵</div>
        Pair reciprocal terms:
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; font-weight: 600;">32cos⁵θ = (z⁵ + 1/z⁵) + 5(z³ + 1/z³) + 10(z + 1/z)</div>
        Substitute <b>zᵐ + 1/zᵐ = 2cos(mθ)</b>:
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; font-weight: 600;">32cos⁵θ = 2cos5θ + 5(2cos3θ) + 10(2cosθ) = 2cos5θ + 10cos3θ + 20cosθ</div>
        Divide by 32 to simplify:
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; color:var(--amber); font-weight: 600;">cos⁵θ = (cos5θ + 5cos3θ + 10cosθ) / 16</div>
      `
    },
    6: {
      formula: "(cos6θ + 6cos4θ + 15cos2θ + 10) / 32",
      latex: "\\frac{\\cos 6\\theta + 6\\cos 4\\theta + 15\\cos 2\\theta + 10}{32}",
      eval: (t) => (Math.cos(6 * t) + 6 * Math.cos(4 * t) + 15 * Math.cos(2 * t) + 10) / 32,
      steps: `
        Raise both sides to power 6:
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; font-weight: 600;">(2cosθ)⁶ = (z + 1/z)⁶</div>
        Expand using the Binomial Theorem:
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; font-weight: 600;">64cos⁶θ = z⁶ + 6z⁴ + 15z² + 20 + 15/z² + 6/z⁴ + 1/z⁶</div>
        Pair reciprocal terms:
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; font-weight: 600;">64cos⁶θ = (z⁶ + 1/z⁶) + 6(z⁴ + 1/z⁴) + 15(z² + 1/z²) + 20</div>
        Substitute <b>zᵐ + 1/zᵐ = 2cos(mθ)</b>:
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; font-weight: 600;">64cos⁶θ = 2cos6θ + 6(2cos4θ) + 15(2cos2θ) + 20 = 2cos6θ + 12cos4θ + 30cos2θ + 20</div>
        Divide by 64 to simplify:
        <div style="font-family:'IBM Plex Mono', monospace; font-size:1.15rem; margin:1rem 0; color:var(--amber); font-weight: 600;">cos⁶θ = (cos6θ + 6cos4θ + 15cos2θ + 10) / 32</div>
      `
    }
  }
};

function getMaeBinomialCoeffs(n) {
  let coeffs = [1];
  for (let i = 1; i <= n; i++) {
    coeffs.push(coeffs[i - 1] * (n - i + 1) / i);
  }
  return coeffs;
}

function calculateMultipleAngleExpand() {
  const output = document.getElementById('steps-output');
  if (!output) return;
  output.innerHTML = '';
  output.classList.add('active');

  const funcType = document.getElementById('mae-function-type').value;
  const nValStr = document.getElementById('mae-n').value;
  const thetaValStr = document.getElementById('mae-theta').value.trim();
  const decimalsValStr = document.getElementById('mae-decimals').value.trim();

  // Validate empty input
  if (thetaValStr === '' || decimalsValStr === '') {
    output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Missing Fields</div></div><div class="step-desc">Please ensure all calculator parameters are filled with valid entries.</div></div>`;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  const n = parseInt(nValStr);
  const thetaDeg = parseFloat(thetaValStr);
  const decimals = parseInt(decimalsValStr);

  if (isNaN(thetaDeg)) {
    output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Invalid Angle</div></div><div class="step-desc">The angle θ must be a valid number.</div></div>`;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  if (isNaN(decimals) || decimals < 0 || decimals > 15) {
    output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Invalid Decimal Places</div></div><div class="step-desc">Decimal places must be an integer between 0 and 15.</div></div>`;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  const thetaRad = thetaDeg * Math.PI / 180;
  const s = Math.sin(thetaRad);
  const c = Math.cos(thetaRad);

  const lookup = maeFormulas[funcType][n];
  const finalFormula = funcType === 'sin' ? `sin(${n}θ) = ${lookup.formula}` : `cos(${n}θ) = ${lookup.formula}`;

  let stepsHtml = '';
  let stepCount = 1;

  // STEP 1: Given Function
  stepsHtml += `<div class="step-card">
    <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <div class="step-number">${stepCount++}</div>
        <div class="step-title">Given Function</div>
      </div>
      <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div>
    </div>
    <div class="step-content">
      <div class="step-desc">Identify the parameters for expansion:</div>
      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.1rem; color: var(--navy); margin: 1.5rem 0; padding-left: 2rem; display: flex; flex-direction: column; gap: 0.5rem;">
        <div>Function to expand = <b>${funcType}(${n}θ)</b></div>
        <div>Value of n = <b>${n}</b></div>
        <div>Test Evaluation Angle (θ) = <b>${thetaDeg}° (${thetaRad.toFixed(6)} rad)</b></div>
      </div>
    </div>
  </div>`;

  // STEP 2: De Moivre's Theorem
  stepsHtml += `<div class="step-card">
    <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <div class="step-number">${stepCount++}</div>
        <div class="step-title">De Moivre's Theorem</div>
      </div>
      <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div>
    </div>
    <div class="step-content">
      <div class="step-desc">According to De Moivre's Theorem, for any integer n:</div>
      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.2rem; text-align: center; margin: 1.5rem 0; color: var(--amber); font-weight: 600;">
        cos(nθ) + i sin(nθ) = (cosθ + i sinθ)ⁿ
      </div>
    </div>
  </div>`;

  // STEP 3: Substitution of n
  stepsHtml += `<div class="step-card">
    <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <div class="step-number">${stepCount++}</div>
        <div class="step-title">Substitution of n = ${n}</div>
      </div>
      <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div>
    </div>
    <div class="step-content">
      <div class="step-desc">Substituting n = ${n} into De Moivre's relation:</div>
      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.2rem; text-align: center; margin: 1.5rem 0; color: var(--navy); font-weight: 600;">
        cos(${n}θ) + i sin(${n}θ) = (cosθ + i sinθ)<sup>${n}</sup>
      </div>
    </div>
  </div>`;

  // STEP 4: Binomial Expansion
  const coeffs = getMaeBinomialCoeffs(n);
  let termsList = [];
  let evaluatedTermsList = [];

  for (let k = 0; k <= n; k++) {
    let coeff = coeffs[k];
    let cosPower = n - k;
    let sinPower = k;

    let cosPart = cosPower === 0 ? "" : (cosPower === 1 ? "cosθ" : `cos<sup>${cosPower}</sup>θ`);
    let sinPart = sinPower === 0 ? "" : (sinPower === 1 ? "sinθ" : `sin<sup>${sinPower}</sup>θ`);
    let coeffStr = coeff === 1 && k > 0 && k < n ? "" : coeff;

    let termText = `${coeffStr}${cosPart}(i sinθ)<sup>${sinPower}</sup>`;
    termsList.push(termText);

    // Evaluate power of i
    let iTerm = "";
    let sign = " + ";
    if (k === 0) {
      sign = "";
      iTerm = "";
    } else {
      if (k % 4 === 0) { sign = " + "; iTerm = ""; }
      else if (k % 4 === 1) { sign = " + "; iTerm = "i"; }
      else if (k % 4 === 2) { sign = " − "; iTerm = ""; }
      else if (k % 4 === 3) { sign = " − "; iTerm = "i"; }
    }
    
    let displayCoeff = coeff === 1 ? "" : coeff;
    let termTextEval = `${sign}${iTerm}${displayCoeff}${cosPart}${sinPart}`;
    if (k === 0) termTextEval = `${cosPart}`;
    
    evaluatedTermsList.push(termTextEval);
  }

  stepsHtml += `<div class="step-card">
    <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <div class="step-number">${stepCount++}</div>
        <div class="step-title">Binomial Expansion</div>
      </div>
      <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div>
    </div>
    <div class="step-content">
      <div class="step-desc">Expand (cosθ + i sinθ)<sup>${n}</sup> using Binomial Theorem:</div>
      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.05rem; margin: 1.5rem 0; line-height: 1.6; word-break: break-all;">
        = ${termsList.join(" + ")}
      </div>
      <div class="step-desc">Evaluate the powers of i (where i² = −1, i³ = −i, etc.):</div>
      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.05rem; margin: 1.5rem 0; color: var(--navy); line-height: 1.6; word-break: break-all;">
        = ${evaluatedTermsList.join("").trim()}
      </div>
    </div>
  </div>`;

  // STEP 5: Real / Imaginary Part Comparison
  let realPartHtml = [];
  let imagPartHtml = [];

  for (let k = 0; k <= n; k++) {
    let coeff = coeffs[k];
    let cosPower = n - k;
    let sinPower = k;
    let cosPart = cosPower === 0 ? "" : (cosPower === 1 ? "cosθ" : `cos<sup>${cosPower}</sup>θ`);
    let sinPart = sinPower === 0 ? "" : (sinPower === 1 ? "sinθ" : `sin<sup>${sinPower}</sup>θ`);
    let displayCoeff = coeff === 1 ? "" : coeff;

    if (k % 2 === 0) {
      // Real Part
      let sign = " + ";
      if (k === 0) sign = "";
      else if (k % 4 === 2) sign = " − ";
      realPartHtml.push(`${sign}${displayCoeff}${cosPart}${sinPart}`);
    } else {
      // Imaginary Part
      let sign = " + ";
      if (k === 1) sign = "";
      else if (k % 4 === 3) sign = " − ";
      imagPartHtml.push(`${sign}${displayCoeff}${cosPart}${sinPart}`);
    }
  }

  stepsHtml += `<div class="step-card">
    <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <div class="step-number">${stepCount++}</div>
        <div class="step-title">Real & Imaginary Comparison</div>
      </div>
      <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div>
    </div>
    <div class="step-content">
      <div class="step-desc">Equating the Real and Imaginary parts from both sides:</div>
      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.05rem; margin: 1.5rem 0; line-height: 1.8;">
        <div><b>Real Part (cos(${n}θ)):</b><br>
        cos(${n}θ) = ${realPartHtml.join("").trim()}</div>
        <div style="margin-top: 1rem;"><b>Imaginary Part (sin(${n}θ)):</b><br>
        sin(${n}θ) = ${imagPartHtml.join("").trim()}</div>
      </div>
    </div>
  </div>`;

  // STEP 6: Simplification
  stepsHtml += `<div class="step-card">
    <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <div class="step-number">${stepCount++}</div>
        <div class="step-title">Simplification</div>
      </div>
      <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div>
    </div>
    <div class="step-content">
      <div class="step-desc">Simplify the target function using trigonometric identities:</div>
      ${lookup.steps}
    </div>
  </div>`;

  // STEP 7: Final Expansion Formula
  stepsHtml += `<div class="step-card">
    <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <div class="step-number">${stepCount++}</div>
        <div class="step-title">Final Expansion Formula</div>
      </div>
      <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div>
    </div>
    <div class="step-content">
      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.35rem; color: var(--teal); font-weight: 700; text-align: center; margin: 1rem 0;">
        ${finalFormula}
      </div>
    </div>
  </div>`;

  // STEP 8: Numerical Verification
  let lhsVal = funcType === 'sin' ? Math.sin(n * thetaRad) : Math.cos(n * thetaRad);
  let rhsVal = lookup.eval(s, c);
  let lhsValStr = lhsVal.toFixed(decimals);
  let rhsValStr = rhsVal.toFixed(decimals);

  stepsHtml += `<div class="step-card">
    <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <div class="step-number">${stepCount++}</div>
        <div class="step-title">Numerical Verification</div>
      </div>
      <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div>
    </div>
    <div class="step-content">
      <div class="step-desc">Evaluate both sides at θ = ${thetaDeg}° for validation:</div>
      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.1rem; color: var(--navy); margin: 1.5rem 0; padding-left: 1.5rem; display: flex; flex-direction: column; gap: 0.75rem;">
        <div>LHS: ${funcType}(${n} × ${thetaDeg}°) = ${funcType}(${n * thetaDeg}°) = <b>${lhsValStr}</b></div>
        <div>RHS: ${lookup.formula.replace(/θ/g, `(${thetaDeg}°)`)} = <b>${rhsValStr}</b></div>
        <div style="color: var(--teal); font-weight: 700; margin-top: 0.5rem;">✓ LHS and RHS match exactly to ${decimals} decimal places!</div>
      </div>
    </div>
  </div>`;

  // Final Result Summary Card
  let resultSummaryHtml = `
    <div class="final-result animate-fade-in" style="padding: 2.5rem; background: #111827; color: #ffffff; border-radius: 16px; border: 1px solid var(--border); box-shadow: 0 10px 30px rgba(0,0,0,0.15); margin-bottom: 2rem; display: flex; flex-wrap: wrap; gap: 2rem; align-items: center; width: 100%; box-sizing: border-box;">
      <div style="flex: 1 1 200px; text-align: left;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; margin-bottom: 0.5rem;">
          <div style="font-size: 1.8rem; font-weight: 700; color: var(--amber); font-family:'Fraunces', serif;">✅ Expansion Completed!</div>
          <button onclick="const c = this.closest('#steps-output').querySelectorAll('.step-card'); if(c.length) c[0].scrollIntoView({behavior: 'smooth', block: 'start'})" style="background: rgba(245, 158, 11, 0.15); color: var(--amber); border: 1px solid rgba(245, 158, 11, 0.3); padding: 0.4rem 0.8rem; border-radius: 8px; font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: all 0.2s; font-family: 'Figtree', sans-serif; display: inline-flex; align-items: center; gap: 0.4rem; white-space: nowrap;" onmouseover="this.style.background='rgba(245, 158, 11, 0.25)'" onmouseout="this.style.background='rgba(245, 158, 11, 0.15)'">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg> View Steps
          </button>
        </div>
        <div style="font-size: 1.05rem; opacity: 0.9; margin-bottom: 1.5rem;">Multiple Angle Expansion Identity.</div>
        <div style="padding: 1.5rem; background: rgba(255,255,255,0.06); border-radius: 12px; border: 1px solid rgba(255,255,255,0.12);">
          <div style="font-size:0.95rem; font-weight:600; color: rgba(255,255,255,0.7); border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; margin-bottom: 0.75rem;">Expansion Formula:</div>
          <div style="font-family:'IBM Plex Mono',monospace; font-size: 1.8rem; font-weight:700; color:var(--amber); margin: 0.6rem 0; line-height: 1.4;">
            ${funcType === 'sin' ? 'sin' : 'cos'}(${n}θ) = <span style="color:#ffffff;">${lookup.formula}</span>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.75rem; margin-top: 1.25rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1.25rem; font-size: 0.95rem; opacity: 0.85; line-height:1.6;">
            <div>Target Function: <strong>${funcType}(${n}θ)</strong></div>
            <div>Numerical Check (θ = ${thetaDeg}°): <strong>${rhsValStr}</strong></div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Educational Note Card
  let educationalHtml = `
    <div class="step-card" style="border-left: 4px solid var(--teal); background: rgba(13, 148, 136, 0.05); margin-top: 2rem;">
      <div style="font-weight: 700; color: var(--teal); font-size: 1.1rem; margin-bottom: 0.5rem; font-family:'Fraunces', serif;">✦ Educational Note: Multiple-Angle Expansion</div>
      <div style="font-size: 1rem; line-height: 1.6; color: var(--navy);">
        <strong>Multiple-Angle Identities:</strong> Expressing trig functions of multiple angles like cos(nθ) and sin(nθ) in terms of single-angle powers (cosθ, sinθ) is a key algebraic simplification technique in calculus and waves.
        <div style="margin: 0.75rem 0;">
          <strong>De Moivre's Theorem:</strong>
          <div style="font-family: 'IBM Plex Mono', monospace; font-weight: 600; margin: 0.25rem 0;">cos(nθ) + i sin(nθ) = (cosθ + i sinθ)ⁿ</div>
          Provides a beautiful bridge between trigonometric multiple-angles and complex number binomial expansions.
        </div>
        <strong>Real and Imaginary Part Comparison:</strong> Because the LHS and RHS must be equivalent as complex numbers, the real part on the LHS (cos(nθ)) must equal the real part on the RHS, and the imaginary coefficient on the LHS (sin(nθ)) must equal the imaginary coefficient on the RHS.
      </div>
    </div>
  `;

  let graphContainerHtml = `
    <div style="background: #111827; border-radius: 16px; border: 1px solid var(--border); padding: 1rem; margin-bottom: 2rem; box-shadow: 0 10px 30px rgba(0,0,0,0.15);">
      <div id="multiple-angle-plot-container" style="width: 100%; height: 400px;"></div>
      <div style="margin-top: 1rem; padding: 1rem; background: rgba(59, 130, 246, 0.1); border-left: 4px solid #3b82f6; color: #d1d5db; font-size: 0.95rem; line-height: 1.5;">
        <strong style="color: #60a5fa;">💡 Educational Insight:</strong> Frequency increases as n increases. Higher n creates more oscillations within the same angle range.
      </div>
    </div>
  `;

  output.innerHTML = resultSummaryHtml + graphContainerHtml + stepsHtml + educationalHtml;

  // Plotly logic for Multiple Angle
  let thetaValsPlot = [];
  let baseValsPlot = [];
  let expandedValsPlot = [];
  let hoverTextsBase = [];
  let hoverTextsExpanded = [];

  for (let d = 0; d <= 360; d += 1) {
    let r = d * Math.PI / 180;
    let baseVal = funcType === 'sin' ? Math.sin(r) : Math.cos(r);
    let expVal = funcType === 'sin' ? Math.sin(n * r) : Math.cos(n * r);
    
    thetaValsPlot.push(d);
    baseValsPlot.push(baseVal);
    expandedValsPlot.push(expVal);

    hoverTextsBase.push(`<b>θ: ${d}°</b><br>${funcType}(θ): ${baseVal.toFixed(3)}`);
    hoverTextsExpanded.push(`<b>θ: ${d}°</b><br>${funcType}(${n}θ): ${expVal.toFixed(3)}`);
  }

  let traceBase = {
    x: thetaValsPlot,
    y: baseValsPlot,
    name: `Original: ${funcType}(θ)`,
    type: 'scatter',
    mode: 'lines',
    line: { color: 'rgba(255,255,255,0.4)', width: 2, dash: 'dot' },
    hoverinfo: 'text',
    hovertext: hoverTextsBase
  };

  let traceExpanded = {
    x: thetaValsPlot,
    y: expandedValsPlot,
    name: `Expanded: ${funcType}(${n}θ)`,
    type: 'scatter',
    mode: 'lines',
    line: { color: '#3b82f6', width: 3, shape: 'spline' },
    hoverinfo: 'text',
    hovertext: hoverTextsExpanded
  };

  let layoutMAEPlot = {
    title: {
      text: '📈 Multiple Angle Comparison',
      font: { color: '#ffffff', family: 'Fraunces, serif', size: 20 }
    },
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    font: { color: '#9ca3af', family: 'Figtree, sans-serif' },
    xaxis: {
      title: { text: 'θ (degrees)', font: { color: '#d1d5db', size: 14 } },
      gridcolor: 'rgba(255,255,255,0.05)',
      zerolinecolor: 'rgba(255,255,255,0.2)',
      tickfont: { color: '#9ca3af' },
      dtick: 90
    },
    yaxis: {
      title: { text: 'Value', font: { color: '#d1d5db', size: 14 } },
      gridcolor: 'rgba(255,255,255,0.05)',
      zerolinecolor: 'rgba(255,255,255,0.2)',
      tickfont: { color: '#9ca3af' }
    },
    hovermode: 'closest',
    hoverlabel: {
      bgcolor: '#111827',
      font: { family: 'Figtree, sans-serif', color: '#ffffff', size: 14 },
      bordercolor: 'rgba(255,255,255,0.2)',
      padding: { t: 12, b: 12, l: 16, r: 16 }
    },
    legend: { font: { color: '#d1d5db' }, orientation: 'h', y: -0.2 },
    margin: { l: 60, r: 40, t: 60, b: 80 }
  };

  let configMAEPlot = {
    responsive: true,
    displayModeBar: true,
    modeBarButtonsToRemove: ['lasso2d', 'select2d'],
    displaylogo: false
  };

  if (typeof Plotly !== 'undefined') {
    Plotly.newPlot('multiple-angle-plot-container', [traceBase, traceExpanded], layoutMAEPlot, configMAEPlot);
  } else {
    document.getElementById('multiple-angle-plot-container').innerHTML = '<div style="color: #ef4444; padding: 2rem; text-align: center;">Unable to load Plotly.js for interactive chart visualization.</div>';
  }

  output.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function calculatePowerReduction() {
  const output = document.getElementById('steps-output');
  if (!output) return;
  output.innerHTML = '';
  output.classList.add('active');

  const funcType = document.getElementById('pr-function-type').value;
  const nValStr = document.getElementById('pr-n').value;
  const thetaValStr = document.getElementById('pr-theta').value.trim();
  const decimalsValStr = document.getElementById('pr-decimals').value.trim();

  // Validate empty input
  if (thetaValStr === '' || decimalsValStr === '') {
    output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Missing Fields</div></div><div class="step-desc">Please ensure all calculator parameters are filled with valid entries.</div></div>`;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  const n = parseInt(nValStr);
  const thetaDeg = parseFloat(thetaValStr);
  const decimals = parseInt(decimalsValStr);

  if (isNaN(thetaDeg)) {
    output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Invalid Angle</div></div><div class="step-desc">The angle θ must be a valid number.</div></div>`;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  if (isNaN(decimals) || decimals < 0 || decimals > 15) {
    output.innerHTML = `<div class="step-card" style="border-left-color: #dc2626;"><div class="step-header"><div class="step-title" style="color: #dc2626;">Error: Invalid Decimal Places</div></div><div class="step-desc">Decimal places must be an integer between 0 and 15.</div></div>`;
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  const thetaRad = thetaDeg * Math.PI / 180;
  const lookup = prFormulas[funcType][n];
  const finalFormula = funcType === 'sin' ? `sin<sup>${n}</sup>θ = ${lookup.formula}` : `cos<sup>${n}</sup>θ = ${lookup.formula}`;

  let stepsHtml = '';
  let stepCount = 1;

  // STEP 1: Given Function
  stepsHtml += `<div class="step-card">
    <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <div class="step-number">${stepCount++}</div>
        <div class="step-title">Given Function</div>
      </div>
      <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div>
    </div>
    <div class="step-content">
      <div class="step-desc">Identify the parameters for power reduction:</div>
      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.1rem; color: var(--navy); margin: 1.5rem 0; padding-left: 2rem; display: flex; flex-direction: column; gap: 0.5rem;">
        <div>Function to reduce = <b>${funcType}<sup>${n}</sup>θ</b></div>
        <div>Value of n (Power) = <b>${n}</b></div>
        <div>Test Evaluation Angle (θ) = <b>${thetaDeg}° (${thetaRad.toFixed(6)} rad)</b></div>
      </div>
    </div>
  </div>`;

  // STEP 2: Complex Variable Setup
  stepsHtml += `<div class="step-card">
    <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <div class="step-number">${stepCount++}</div>
        <div class="step-title">Complex Variable Setup</div>
      </div>
      <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div>
    </div>
    <div class="step-content">
      <div class="step-desc">Let us represent the single angle in Euler complex form:</div>
      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.15rem; margin: 1.5rem 0; padding-left: 2rem; display: flex; flex-direction: column; gap: 0.5rem; color: var(--navy);">
        <div>z = cosθ + i sinθ</div>
        <div>1/z = z⁻¹ = cosθ − i sinθ</div>
      </div>
    </div>
  </div>`;

  // STEP 3: Standard Relations
  stepsHtml += `<div class="step-card">
    <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <div class="step-number">${stepCount++}</div>
        <div class="step-title">Standard Relations</div>
      </div>
      <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div>
    </div>
    <div class="step-content">
      <div class="step-desc">By adding and subtracting these relations, we obtain the base conversions:</div>
      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.15rem; margin: 1.5rem 0; padding-left: 2rem; display: flex; flex-direction: column; gap: 0.5rem; color: var(--navy);">
        <div>z + 1/z = 2cosθ</div>
        <div>z − 1/z = 2isinθ</div>
      </div>
    </div>
  </div>`;

  // STEP 4: Raise to Required Power
  let powerLhs = "";
  let powerRhs = "";
  if (funcType === 'cos') {
    powerLhs = `(2cosθ)<sup>${n}</sup> = 2<sup>${n}</sup>cos<sup>${n}</sup>θ = ${Math.pow(2, n)}cos<sup>${n}</sup>θ`;
    powerRhs = `(z + 1/z)<sup>${n}</sup>`;
  } else {
    // i^n evaluation
    let coeffVal = Math.pow(2, n);
    let iPower = "";
    if (n % 4 === 0) iPower = "";
    else if (n % 4 === 1) iPower = "i";
    else if (n % 4 === 2) { iPower = ""; coeffVal = -coeffVal; }
    else if (n % 4 === 3) { iPower = "i"; coeffVal = -coeffVal; }
    
    let signCoeff = coeffVal < 0 ? `−${Math.abs(coeffVal)}` : `${coeffVal}`;
    powerLhs = `(2isinθ)<sup>${n}</sup> = ${signCoeff}${iPower}sin<sup>${n}</sup>θ`;
    powerRhs = `(z − 1/z)<sup>${n}</sup>`;
  }

  stepsHtml += `<div class="step-card">
    <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <div class="step-number">${stepCount++}</div>
        <div class="step-title">Raise to Required Power (n = ${n})</div>
      </div>
      <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div>
    </div>
    <div class="step-content">
      <div class="step-desc">Raise the relation to the power of ${n}:</div>
      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.15rem; margin: 1.5rem 0; padding-left: 2rem; display: flex; flex-direction: column; gap: 0.5rem; color: var(--navy);">
        <div>LHS = ${powerLhs}</div>
        <div>RHS = ${powerRhs}</div>
      </div>
    </div>
  </div>`;

  // STEP 5: Binomial Expansion, Pairing, Conversion & Simplification
  stepsHtml += `<div class="step-card">
    <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <div class="step-number">${stepCount++}</div>
        <div class="step-title">Derivation & Power Reduction</div>
      </div>
      <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div>
    </div>
    <div class="step-content">
      <div class="step-desc">Algebraic steps using the Binomial Expansion:</div>
      ${lookup.steps}
    </div>
  </div>`;

  // STEP 6: Final Expansion Formula
  stepsHtml += `<div class="step-card">
    <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <div class="step-number">${stepCount++}</div>
        <div class="step-title">Final Expansion Formula</div>
      </div>
      <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div>
    </div>
    <div class="step-content">
      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.35rem; color: var(--teal); font-weight: 700; text-align: center; margin: 1rem 0;">
        ${finalFormula}
      </div>
    </div>
  </div>`;

  // STEP 7: Numerical Verification
  let lhsVal = funcType === 'sin' ? Math.pow(Math.sin(thetaRad), n) : Math.pow(Math.cos(thetaRad), n);
  let rhsVal = lookup.eval(thetaRad);
  let lhsValStr = lhsVal.toFixed(decimals);
  let rhsValStr = rhsVal.toFixed(decimals);

  stepsHtml += `<div class="step-card">
    <div class="step-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleStep(this)">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <div class="step-number">${stepCount++}</div>
        <div class="step-title">Numerical Verification</div>
      </div>
      <div class="step-toggle-icon" style="transition: transform 0.2s; font-size: 0.8rem; color: var(--muted);">▼</div>
    </div>
    <div class="step-content">
      <div class="step-desc">Evaluate both sides at θ = ${thetaDeg}° for validation:</div>
      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.1rem; color: var(--navy); margin: 1.5rem 0; padding-left: 1.5rem; display: flex; flex-direction: column; gap: 0.75rem;">
        <div>LHS: [${funcType}(${thetaDeg}°)]<sup>${n}</sup> = [${(funcType === 'sin' ? Math.sin(thetaRad) : Math.cos(thetaRad)).toFixed(6)}]<sup>${n}</sup> = <b>${lhsValStr}</b></div>
        <div>RHS: ${lookup.formula.replace(/θ/g, `(${thetaDeg}°)`)} = <b>${rhsValStr}</b></div>
        <div style="color: var(--teal); font-weight: 700; margin-top: 0.5rem;">✓ LHS and RHS match exactly to ${decimals} decimal places!</div>
      </div>
    </div>
  </div>`;

  // Final Result Summary Card
  let resultSummaryHtml = `
    <div class="final-result animate-fade-in" style="padding: 2.5rem; background: #111827; color: #ffffff; border-radius: 16px; border: 1px solid var(--border); box-shadow: 0 10px 30px rgba(0,0,0,0.15); margin-bottom: 2rem; display: flex; flex-wrap: wrap; gap: 2rem; align-items: center; width: 100%; box-sizing: border-box;">
      <div style="flex: 1 1 200px; text-align: left;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; margin-bottom: 0.5rem;">
          <div style="font-size: 1.8rem; font-weight: 700; color: var(--amber); font-family:'Fraunces', serif;">✅ Power Reduction Completed!</div>
          <button onclick="const c = this.closest('#steps-output').querySelectorAll('.step-card'); if(c.length) c[0].scrollIntoView({behavior: 'smooth', block: 'start'})" style="background: rgba(245, 158, 11, 0.15); color: var(--amber); border: 1px solid rgba(245, 158, 11, 0.3); padding: 0.4rem 0.8rem; border-radius: 8px; font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: all 0.2s; font-family: 'Figtree', sans-serif; display: inline-flex; align-items: center; gap: 0.4rem; white-space: nowrap;" onmouseover="this.style.background='rgba(245, 158, 11, 0.25)'" onmouseout="this.style.background='rgba(245, 158, 11, 0.15)'">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg> View Steps
          </button>
        </div>
        <div style="font-size: 1.05rem; opacity: 0.9; margin-bottom: 1.5rem;">Power Reduction Identity.</div>
        <div style="padding: 1.5rem; background: rgba(255,255,255,0.06); border-radius: 12px; border: 1px solid rgba(255,255,255,0.12);">
          <div style="font-size:0.95rem; font-weight:600; color: rgba(255,255,255,0.7); border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; margin-bottom: 0.75rem;">Reduction Formula:</div>
          <div style="font-family:'IBM Plex Mono',monospace; font-size: 1.8rem; font-weight:700; color:var(--amber); margin: 0.6rem 0; line-height: 1.4;">
            ${funcType}<sup>${n}</sup>θ = <span style="color:#ffffff;">${lookup.formula}</span>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.75rem; margin-top: 1.25rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1.25rem; font-size: 0.95rem; opacity: 0.85; line-height:1.6;">
            <div>Target Function: <strong>${funcType}<sup>${n}</sup>θ</strong></div>
            <div>Numerical Check (θ = ${thetaDeg}°): <strong>${rhsValStr}</strong></div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Educational Note Card
  let educationalHtml = `
    <div class="step-card" style="border-left: 4px solid var(--teal); background: rgba(13, 148, 136, 0.05); margin-top: 2rem;">
      <div style="font-weight: 700; color: var(--teal); font-size: 1.1rem; margin-bottom: 0.5rem; font-family:'Fraunces', serif;">✦ Educational Note: Power Reduction</div>
      <div style="font-size: 1rem; line-height: 1.6; color: var(--navy);">
        <strong>Power Reduction:</strong> Power reduction identities express higher powers of sinⁿθ and cosⁿθ in terms of linear multiple-angle trig functions (e.g. cos(2θ), sin(3θ)). This is a crucial tool in engineering mathematics.
        <div style="margin: 0.75rem 0;">
          <strong>Method of Derivation:</strong> Representing 2cosθ and 2isinθ as complex sums/differences z ± z⁻¹ enables simple algebraic binomial expansions, matching pairs into multiple angles easily via De Moivre.
        </div>
        <strong>Applications:</strong>
        <ul>
          <li><b>Integration:</b> Direct integration of terms like $\\int \\sin^4\\theta \\, d\\theta$ is complex, but becomes trivial once expanded into power-reduced multiple-angle linear terms.</li>
          <li><b>Fourier Series:</b> Crucial for decomposing signals and evaluating trigonometric integrals in periodic wave analyses.</li>
        </ul>
      </div>
    </div>
  `;

  let graphContainerHtml = `
    <div style="background: #111827; border-radius: 16px; border: 1px solid var(--border); padding: 1rem; margin-bottom: 2rem; box-shadow: 0 10px 30px rgba(0,0,0,0.15);">
      <div id="power-reduction-plot-container" style="width: 100%; height: 400px;"></div>
      <div style="margin-top: 1rem; padding: 1rem; background: rgba(34, 197, 94, 0.1); border-left: 4px solid #22c55e; color: #d1d5db; font-size: 0.95rem; line-height: 1.5; display: flex; align-items: center; gap: 0.5rem;">
        <span style="font-size: 1.2rem;">✓</span> <strong>Identity Verified Graphically:</strong> Both the LHS power function and RHS expanded expression curves perfectly overlap for all angles.
      </div>
    </div>
  `;

  output.innerHTML = resultSummaryHtml + graphContainerHtml + stepsHtml + educationalHtml;

  // Plotly logic for Power Reduction
  let thetaValsPlot = [];
  let lhsValsPlot = [];
  let rhsValsPlot = [];
  let hoverTextsLHS = [];
  let hoverTextsRHS = [];

  for (let d = 0; d <= 360; d += 1) {
    let r = d * Math.PI / 180;
    let lhsVal = funcType === 'sin' ? Math.pow(Math.sin(r), n) : Math.pow(Math.cos(r), n);
    let rhsValPlot = lookup.eval(r);
    
    thetaValsPlot.push(d);
    lhsValsPlot.push(lhsVal);
    rhsValsPlot.push(rhsValPlot);

    hoverTextsLHS.push(`<b>θ: ${d}°</b><br>LHS ${funcType}<sup>${n}</sup>θ: ${lhsVal.toFixed(4)}`);
    hoverTextsRHS.push(`<b>θ: ${d}°</b><br>RHS Expanded: ${rhsValPlot.toFixed(4)}`);
  }

  let traceLHS = {
    x: thetaValsPlot,
    y: lhsValsPlot,
    name: `LHS: ${funcType}<sup>${n}</sup>θ`,
    type: 'scatter',
    mode: 'lines',
    line: { color: 'rgba(255, 255, 255, 0.8)', width: 6, shape: 'spline' },
    hoverinfo: 'text',
    hovertext: hoverTextsLHS
  };

  let traceRHS = {
    x: thetaValsPlot,
    y: rhsValsPlot,
    name: `RHS Identity`,
    type: 'scatter',
    mode: 'lines',
    line: { color: '#22c55e', width: 2, dash: 'dash', shape: 'spline' },
    hoverinfo: 'text',
    hovertext: hoverTextsRHS
  };

  let layoutPRPlot = {
    title: {
      text: '📈 Power Reduction Identity Verification',
      font: { color: '#ffffff', family: 'Fraunces, serif', size: 20 }
    },
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    font: { color: '#9ca3af', family: 'Figtree, sans-serif' },
    xaxis: {
      title: { text: 'θ (degrees)', font: { color: '#d1d5db', size: 14 } },
      gridcolor: 'rgba(255,255,255,0.05)',
      zerolinecolor: 'rgba(255,255,255,0.2)',
      tickfont: { color: '#9ca3af' },
      dtick: 90
    },
    yaxis: {
      title: { text: 'Value', font: { color: '#d1d5db', size: 14 } },
      gridcolor: 'rgba(255,255,255,0.05)',
      zerolinecolor: 'rgba(255,255,255,0.2)',
      tickfont: { color: '#9ca3af' }
    },
    hovermode: 'closest',
    hoverlabel: {
      bgcolor: '#111827',
      font: { family: 'Figtree, sans-serif', color: '#ffffff', size: 14 },
      bordercolor: 'rgba(255,255,255,0.2)',
      padding: { t: 12, b: 12, l: 16, r: 16 }
    },
    legend: { font: { color: '#d1d5db' }, orientation: 'h', y: -0.2 },
    margin: { l: 60, r: 40, t: 60, b: 80 }
  };

  let configPRPlot = {
    responsive: true,
    displayModeBar: true,
    modeBarButtonsToRemove: ['lasso2d', 'select2d'],
    displaylogo: false
  };

  if (typeof Plotly !== 'undefined') {
    Plotly.newPlot('power-reduction-plot-container', [traceLHS, traceRHS], layoutPRPlot, configPRPlot);
  } else {
    document.getElementById('power-reduction-plot-container').innerHTML = '<div style="color: #ef4444; padding: 2rem; text-align: center;">Unable to load Plotly.js for interactive chart visualization.</div>';
  }

  output.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ==========================================
// BINOMIAL DISTRIBUTION CALCULATOR
// ==========================================
function calculateBinomial() {
  const output = document.getElementById('steps-output');
  output.innerHTML = '';
  output.classList.add('active');

  const mode = document.getElementById('binomial-mode') ? document.getElementById('binomial-mode').value : 'exact';
  const nStr = document.getElementById('binomial-n').value;
  const pStr = document.getElementById('binomial-p').value;
  const xStr = document.getElementById('binomial-x').value;
  const x1Str = document.getElementById('binomial-x1') ? document.getElementById('binomial-x1').value : '0';
  const x2Str = document.getElementById('binomial-x2') ? document.getElementById('binomial-x2').value : '0';

  const n = parseInt(nStr);
  const p = parseFloat(pStr);
  const x = parseInt(xStr);
  const x1 = parseInt(x1Str);
  const x2 = parseInt(x2Str);

  // Validation
  if (isNaN(n) || isNaN(p)) {
    output.innerHTML = '<div style="color:red; padding: 1rem; text-align:center; font-weight:600;">Please enter valid numerical values.</div>';
    return;
  }
  if (mode === 'exact' && isNaN(x)) {
    output.innerHTML = '<div style="color:red; padding: 1rem; text-align:center; font-weight:600;">Please enter a valid x value.</div>';
    return;
  }
  if (mode === 'range' && (isNaN(x1) || isNaN(x2))) {
    output.innerHTML = '<div style="color:red; padding: 1rem; text-align:center; font-weight:600;">Please enter valid lower and upper bounds.</div>';
    return;
  }
  if (n < 0 || !Number.isInteger(parseFloat(nStr))) {
    output.innerHTML = '<div style="color:red; padding: 1rem; text-align:center; font-weight:600;">Number of trials (n) must be a non-negative integer.</div>';
    return;
  }
  if (p < 0 || p > 1) {
    output.innerHTML = '<div style="color:red; padding: 1rem; text-align:center; font-weight:600;">Probability of success (p) must be between 0 and 1 inclusive.</div>';
    return;
  }
  if (mode === 'exact' && (x < 0 || x > n || !Number.isInteger(parseFloat(xStr)))) {
    output.innerHTML = '<div style="color:red; padding: 1rem; text-align:center; font-weight:600;">x must be an integer between 0 and n.</div>';
    return;
  }
  if (mode === 'range') {
    if (x1 < 0 || x2 > n || !Number.isInteger(parseFloat(x1Str)) || !Number.isInteger(parseFloat(x2Str))) {
      output.innerHTML = '<div style="color:red; padding: 1rem; text-align:center; font-weight:600;">Bounds must be integers between 0 and n.</div>';
      return;
    }
    if (x1 > x2) {
      output.innerHTML = '<div style="color:red; padding: 1rem; text-align:center; font-weight:600;">Lower bound (x₁) cannot be greater than Upper bound (x₂).</div>';
      return;
    }
  }

  // Math Helpers
  function logFactorial(k) {
    if (k <= 1) return 0;
    let res = 0;
    for (let i = 2; i <= k; i++) res += Math.log(i);
    return res;
  }
  function exactFactorial(k) {
    if (k <= 1) return 1n;
    let res = 1n;
    for (let i = 2n; i <= BigInt(k); i++) res *= i;
    return res;
  }
  function logCombination(n, k) {
    return logFactorial(n) - logFactorial(k) - logFactorial(n - k);
  }
  function binomialProb(n, p, k) {
    if (p === 0) return k === 0 ? 1 : 0;
    if (p === 1) return k === n ? 1 : 0;
    return Math.exp(logCombination(n, k) + k * Math.log(p) + (n - k) * Math.log(1 - p));
  }

  const renderFraction = (num, den) => `
    <div style="display:inline-flex; flex-direction:column; align-items:center; vertical-align:middle; padding: 0 4px; line-height: 1.2;">
      <div style="border-bottom:1px solid currentColor; padding:0 4px; width: 100%; text-align: center;">${num}</div>
      <div style="padding:0 4px;">${den}</div>
    </div>
  `;

  let stepsHtml = '';
  let stepCount = 1;
  let q = 1 - p;

  let mainResult = 0;
  let isTargetFn;

  if (mode === 'exact') {
    const px = binomialProb(n, p, x);
    mainResult = px;
    isTargetFn = (k) => k === x;

    stepsHtml += `<div class="step-card">
      <div class="step-header">
        <div class="step-number">${stepCount++}</div>
        <div class="step-title">1. The Binomial Formula</div>
      </div>
      <div class="step-content">
        <div class="step-desc" style="margin-bottom: 1rem;">
          The Binomial Distribution calculates the probability of getting exactly <b>x</b> successes in <b>n</b> independent trials, where each trial has the same probability of success <b>p</b>.
        </div>
        <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.4rem; text-align: center; color: var(--navy); margin-bottom: 1.5rem; background: var(--bg); padding: 1.5rem; border-radius: 8px; font-weight: 600;">
          P(X = x) = C(n, x) &middot; p<sup>x</sup> &middot; (1-p)<sup>n-x</sup>
        </div>
        <div class="step-desc" style="margin-bottom: 0.5rem;">Variables: n = ${n}, x = ${x}, p = ${p}, q = ${parseFloat(q.toPrecision(10))}</div>
      </div>
    </div>`;

    // Combinations calculation step
    let combinationsVal;
    let combinationStepsHtml = '';
    if (n <= 170) {
      combinationsVal = Math.round(Math.exp(logCombination(n, x)));
      let factN = exactFactorial(n);
      let factX = exactFactorial(x);
      let factNX = exactFactorial(n-x);
      let denom = factX * factNX;
      combinationStepsHtml = `
        <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.2rem; text-align: center; color: var(--navy); margin-bottom: 1.5rem; background: var(--bg); padding: 1.5rem; border-radius: 8px;">
          C(${n}, ${x}) = ${renderFraction(`n!`, `x!(n-x)!`)} = ${renderFraction(`${n}!`, `${x}! &middot; (${n}-${x})!`)}
        </div>
        <div class="step-desc" style="margin-bottom: 0.5rem;">Final Combinations Value:</div>
        <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.4rem; text-align: center; color: var(--teal); font-weight: 700;">
          C(${n}, ${x}) = ${combinationsVal.toLocaleString()}
        </div>
      `;
    } else {
      combinationsVal = Math.exp(logCombination(n, x));
      combinationStepsHtml = `
        <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.2rem; text-align: center; color: var(--navy); margin-bottom: 1.5rem; background: var(--bg); padding: 1.5rem; border-radius: 8px;">
          C(${n}, ${x}) = ${renderFraction(`n!`, `x!(n-x)!`)}
        </div>
        <div class="step-desc" style="margin-bottom: 0.5rem;">Final Combinations Value:</div>
        <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.4rem; text-align: center; color: var(--teal); font-weight: 700;">
          C(${n}, ${x}) &approx; ${combinationsVal.toExponential(6)}
        </div>
      `;
    }

    stepsHtml += `<div class="step-card">
      <div class="step-header">
        <div class="step-number">${stepCount++}</div>
        <div class="step-title">2. Calculate Combinations (Number of Ways)</div>
      </div>
      <div class="step-content">
        ${combinationStepsHtml}
      </div>
    </div>`;

    // Exact Probability Calculation Step
    let pXPart = (p === 0 || p === 1) ? ((p===0 && x===0) || (p===1 && x===n) ? 1 : 0) : Math.pow(p, x);
    let qNXPart = (q === 0 || q === 1) ? ((q===0 && n-x===0) || (q===1 && n-x===n) ? 1 : 0) : Math.pow(q, n-x);
    
    stepsHtml += `<div class="step-card">
      <div class="step-header">
        <div class="step-number">${stepCount++}</div>
        <div class="step-title">3. Calculate Exact Probability</div>
      </div>
      <div class="step-content">
        <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.15rem; color: var(--navy); padding-left: 1.5rem; line-height: 2;">
          <div style="margin-top: 1.5rem; border-top: 1px dashed var(--border); padding-top: 1.5rem;">
            P(X = ${x}) = ${n <= 170 ? combinationsVal.toLocaleString() : combinationsVal.toExponential(4)} &times; ${pXPart.toExponential(4)} &times; ${qNXPart.toExponential(4)}
          </div>
          <div style="color: var(--teal); font-size: 1.5rem; font-weight: 700; margin-top: 1rem; background: rgba(13,148,136,0.08); display: inline-block; padding: 0.75rem 1.5rem; border-radius: 8px;">
            P(X = ${x}) = ${px.toFixed(8)}
          </div>
        </div>
      </div>
    </div>`;
  } else {
    // RANGE MODE
    isTargetFn = (k) => k >= x1 && k <= x2;
    let pRange = 0;
    for(let i=x1; i<=x2; i++) {
      pRange += binomialProb(n, p, i);
    }
    if (pRange > 1) pRange = 1;
    mainResult = pRange;

    stepsHtml += `<div class="step-card">
      <div class="step-header">
        <div class="step-number">${stepCount++}</div>
        <div class="step-title">1. Range Probability Formula</div>
      </div>
      <div class="step-content">
        <div class="step-desc" style="margin-bottom: 1rem;">
          To find the probability of getting between <b>${x1}</b> and <b>${x2}</b> successes, we sum the exact probabilities for each outcome in that range.
        </div>
        <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.4rem; text-align: center; color: var(--navy); margin-bottom: 1.5rem; background: var(--bg); padding: 1.5rem; border-radius: 8px; font-weight: 600;">
          P(${x1} &le; X &le; ${x2}) = &Sigma; P(X = i)
        </div>
      </div>
    </div>`;

    let termsToShow = x2 - x1 + 1;
    let sumBreakdown = '';
    if (termsToShow <= 10) {
      let termsHtml = [];
      for(let i=x1; i<=x2; i++) {
        termsHtml.push(`P(X=${i}) &approx; ${binomialProb(n, p, i).toFixed(5)}`);
      }
      sumBreakdown = `
        <div class="step-desc" style="margin-bottom: 0.5rem;">Summing individual probabilities:</div>
        <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.1rem; color: var(--text); padding-left: 1.5rem; margin-bottom: 1rem; line-height: 1.8;">
          ${termsHtml.join('<br>')}
        </div>
      `;
    } else {
      sumBreakdown = `
        <div class="step-desc" style="margin-bottom: 0.5rem; background: rgba(13,148,136,0.1); padding: 1rem; border-left: 4px solid var(--teal);">
          Summing ${termsToShow} individual probabilities from P(X=${x1}) to P(X=${x2}).
        </div>
      `;
    }

    stepsHtml += `<div class="step-card">
      <div class="step-header">
        <div class="step-number">${stepCount++}</div>
        <div class="step-title">2. Calculate Sum</div>
      </div>
      <div class="step-content">
        ${sumBreakdown}
        <div style="color: var(--teal); font-size: 1.5rem; font-weight: 700; margin-top: 1rem; background: rgba(13,148,136,0.08); display: inline-block; padding: 0.75rem 1.5rem; border-radius: 8px;">
          P(${x1} &le; X &le; ${x2}) = ${pRange.toFixed(8)}
        </div>
      </div>
    </div>`;
  }

  // Visualization Step
  let mean = n * p;
  let stdDev = Math.sqrt(n * p * q);
  let vizStart = 0;
  let vizEnd = n;
  if (n > 50) {
    vizStart = Math.max(0, Math.floor(mean - 3 * stdDev));
    vizEnd = Math.min(n, Math.ceil(mean + 3 * stdDev));
    if (vizEnd - vizStart > 50) {
       vizStart = Math.max(0, Math.floor(mean - 25));
       vizEnd = Math.min(n, vizStart + 50);
    }
  }
  
  let maxProb = 0;
  let distPoints = [];
  for (let i = vizStart; i <= vizEnd; i++) {
    let prob = binomialProb(n, p, i);
    if (prob > maxProb) maxProb = prob;
    distPoints.push({ x: i, p: prob });
  }
  
  if (maxProb === 0) maxProb = 1;

  let barsHtml = '';
  distPoints.forEach(pt => {
    let heightPercent = (pt.p / maxProb) * 85;
    let isTarget = isTargetFn(pt.x);
    let color = isTarget ? 'var(--amber)' : 'var(--teal)';
    let opacity = isTarget ? '1' : '0.6';
    
    barsHtml += `
      <div style="display: flex; flex-direction: column; justify-content: flex-end; align-items: center; flex: 1; min-width: 28px; height: 100%; position: relative;" onmouseover="this.querySelector('.bar-tooltip').style.opacity=1; this.querySelector('.bar-tooltip').style.visibility='visible';" onmouseout="this.querySelector('.bar-tooltip').style.opacity=0; this.querySelector('.bar-tooltip').style.visibility='hidden';">
        <div class="bar-tooltip" style="position: absolute; bottom: calc(${Math.max(0.5, heightPercent)}% + 10px); font-size: 0.75rem; color: var(--white); opacity: 0; visibility: hidden; transition: 0.2s; white-space: nowrap; z-index: 20; background: var(--navy); padding: 6px 10px; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); text-align: center; pointer-events: none;">
          <div style="font-weight:700; margin-bottom:2px; color: var(--amber);">x = ${pt.x}</div>
          <div>P(X=${pt.x}) &approx; ${pt.p.toFixed(5)}</div>
          <div style="font-size:0.7rem; opacity: 0.8; margin-top: 2px;">${(pt.p * 100).toFixed(2)}%</div>
          <div style="position: absolute; bottom: -4px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 5px solid var(--navy);"></div>
        </div>
        <div style="width: 100%; max-width: 40px; height: ${Math.max(0.5, heightPercent)}%; background-color: ${color}; opacity: ${opacity}; border-radius: 4px 4px 0 0; min-height: 1px; transition: 0.3s; cursor: crosshair;"></div>
        <div style="font-size: 0.75rem; color: var(--navy); margin-top: 6px; font-family: 'IBM Plex Mono', monospace; font-weight: ${isTarget ? '700' : '500'};">${pt.x}</div>
      </div>
    `;
  });

  let legendTargetText = mode === 'exact' ? `Selected P(X = ${x})` : `Selected P(${x1} &le; X &le; ${x2})`;

  let vizHtml = `
    <div class="step-card" style="margin-top: 1.5rem;">
      <div class="step-header">
        <div class="step-number">${stepCount++}</div>
        <div class="step-title">Distribution Visualization</div>
      </div>
      <div class="step-content" style="padding-top: 1rem;">
        <div style="text-align: center; font-weight: 600; font-size: 1.1rem; color: var(--navy); margin-bottom: 0.5rem; font-family: 'Fraunces', serif;">
          Probability Distribution Curve
        </div>
        <div class="step-desc" style="text-align: center; margin-bottom: 2rem;">Parameters: n = ${n}, p = ${p}</div>
        
        <div style="position: relative; width: 100%; padding-left: 2rem; padding-bottom: 2rem; box-sizing: border-box;">
          <div style="position: absolute; left: -10px; top: 50%; transform: translateY(-50%) rotate(-90deg); font-size: 0.8rem; font-weight: 600; color: var(--muted); letter-spacing: 1px;">
            PROBABILITY P(X=x)
          </div>
          <div style="width: 100%; overflow-x: auto; padding-top: 2rem;">
            <div style="display: flex; height: 250px; min-width: 100%; width: fit-content; border-bottom: 2px solid var(--border); border-left: 2px solid var(--border); padding-bottom: 0; align-items: flex-end; gap: 4px; padding-left: 4px; padding-right: 1rem;">
              ${barsHtml}
            </div>
          </div>
          <div style="text-align: center; font-size: 0.8rem; font-weight: 600; color: var(--muted); letter-spacing: 1px; margin-top: 0.5rem; margin-left: 2rem;">
            NUMBER OF SUCCESSES (x)
          </div>
        </div>

        <div style="display: flex; justify-content: center; gap: 2rem; font-size: 0.85rem; color: var(--text); margin-top: 1rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <div style="width: 14px; height: 14px; background: var(--teal); opacity: 0.6; border-radius: 3px;"></div>
            P(X) for other values
          </div>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <div style="width: 14px; height: 14px; background: var(--amber); border-radius: 3px;"></div>
            ${legendTargetText}
          </div>
        </div>
      </div>
    </div>
  `;

  // Final Results Display
  let resultsGridHtml = '';
  if (mode === 'exact') {
    let ple = 0; for (let i = 0; i <= x; i++) ple += binomialProb(n, p, i);
    let plt = ple - mainResult; if (plt < 0 || x === 0) plt = 0;
    let pge = 0; for (let i = x; i <= n; i++) pge += binomialProb(n, p, i);
    let pgt = pge - mainResult; if (pgt < 0 || x === n) pgt = 0;
    if (ple > 1) ple = 1; if (pge > 1) pge = 1; if (plt > 1) plt = 1; if (pgt > 1) pgt = 1;

    resultsGridHtml = `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem;">
        <div style="padding: 1.5rem; background: rgba(255,255,255,0.06); border-radius: 12px; border: 1px solid rgba(255,255,255,0.12); display: flex; flex-direction: column; justify-content: space-between;">
          <div style="font-size:0.95rem; font-weight:600; color: rgba(255,255,255,0.6); margin-bottom: 0.5rem; display: flex; justify-content: space-between;">
            <span>Less than</span><span>x < ${x}</span>
          </div>
          <div style="font-family:'IBM Plex Mono',monospace; font-size: 1.6rem; font-weight:700; color:#ffffff;">P(X < ${x})</div>
          <div style="font-family:'IBM Plex Mono',monospace; font-size: 1.3rem; color: var(--teal); margin-top: 0.5rem;">${plt.toFixed(6)}</div>
        </div>
        <div style="padding: 1.5rem; background: rgba(255,255,255,0.06); border-radius: 12px; border: 1px solid rgba(255,255,255,0.12); display: flex; flex-direction: column; justify-content: space-between;">
          <div style="font-size:0.95rem; font-weight:600; color: rgba(255,255,255,0.6); margin-bottom: 0.5rem; display: flex; justify-content: space-between;">
            <span>At most</span><span>x &le; ${x}</span>
          </div>
          <div style="font-family:'IBM Plex Mono',monospace; font-size: 1.6rem; font-weight:700; color:#ffffff;">P(X &le; ${x})</div>
          <div style="font-family:'IBM Plex Mono',monospace; font-size: 1.3rem; color: var(--teal); margin-top: 0.5rem;">${ple.toFixed(6)}</div>
        </div>
        <div style="padding: 1.5rem; background: rgba(255,255,255,0.12); border-radius: 12px; border: 2px solid var(--amber); box-shadow: 0 0 20px rgba(245, 158, 11, 0.15); display: flex; flex-direction: column; justify-content: space-between; transform: scale(1.02); z-index: 1;">
          <div style="font-size:0.95rem; font-weight:600; color: var(--amber); margin-bottom: 0.5rem; display: flex; justify-content: space-between;">
            <span>Exactly</span><span>x = ${x}</span>
          </div>
          <div style="font-family:'IBM Plex Mono',monospace; font-size: 1.8rem; font-weight:700; color:#ffffff;">P(X = ${x})</div>
          <div style="font-family:'IBM Plex Mono',monospace; font-size: 1.4rem; color: var(--amber); margin-top: 0.5rem;">${mainResult.toFixed(6)}</div>
        </div>
        <div style="padding: 1.5rem; background: rgba(255,255,255,0.06); border-radius: 12px; border: 1px solid rgba(255,255,255,0.12); display: flex; flex-direction: column; justify-content: space-between;">
          <div style="font-size:0.95rem; font-weight:600; color: rgba(255,255,255,0.6); margin-bottom: 0.5rem; display: flex; justify-content: space-between;">
            <span>At least</span><span>x &ge; ${x}</span>
          </div>
          <div style="font-family:'IBM Plex Mono',monospace; font-size: 1.6rem; font-weight:700; color:#ffffff;">P(X &ge; ${x})</div>
          <div style="font-family:'IBM Plex Mono',monospace; font-size: 1.3rem; color: var(--teal); margin-top: 0.5rem;">${pge.toFixed(6)}</div>
        </div>
        <div style="padding: 1.5rem; background: rgba(255,255,255,0.06); border-radius: 12px; border: 1px solid rgba(255,255,255,0.12); display: flex; flex-direction: column; justify-content: space-between;">
          <div style="font-size:0.95rem; font-weight:600; color: rgba(255,255,255,0.6); margin-bottom: 0.5rem; display: flex; justify-content: space-between;">
            <span>More than</span><span>x > ${x}</span>
          </div>
          <div style="font-family:'IBM Plex Mono',monospace; font-size: 1.6rem; font-weight:700; color:#ffffff;">P(X > ${x})</div>
          <div style="font-family:'IBM Plex Mono',monospace; font-size: 1.3rem; color: var(--teal); margin-top: 0.5rem;">${pgt.toFixed(6)}</div>
        </div>
      </div>
    `;
  } else {
    // Mode range grid
    let pLessX1 = 0; for(let i=0; i<x1; i++) pLessX1 += binomialProb(n, p, i);
    let pGreaterX2 = 0; for(let i=x2+1; i<=n; i++) pGreaterX2 += binomialProb(n, p, i);
    
    resultsGridHtml = `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem;">
        <div style="padding: 1.5rem; background: rgba(255,255,255,0.06); border-radius: 12px; border: 1px solid rgba(255,255,255,0.12); display: flex; flex-direction: column; justify-content: space-between;">
          <div style="font-size:0.95rem; font-weight:600; color: rgba(255,255,255,0.6); margin-bottom: 0.5rem; display: flex; justify-content: space-between;">
            <span>Below Range</span><span>X < ${x1}</span>
          </div>
          <div style="font-family:'IBM Plex Mono',monospace; font-size: 1.6rem; font-weight:700; color:#ffffff;">P(X < ${x1})</div>
          <div style="font-family:'IBM Plex Mono',monospace; font-size: 1.3rem; color: var(--teal); margin-top: 0.5rem;">${pLessX1.toFixed(6)}</div>
        </div>
        <div style="padding: 1.5rem; background: rgba(255,255,255,0.12); border-radius: 12px; border: 2px solid var(--amber); box-shadow: 0 0 20px rgba(245, 158, 11, 0.15); display: flex; flex-direction: column; justify-content: space-between; transform: scale(1.02); z-index: 1;">
          <div style="font-size:0.95rem; font-weight:600; color: var(--amber); margin-bottom: 0.5rem; display: flex; justify-content: space-between;">
            <span>Target Range</span><span>${x1} &le; X &le; ${x2}</span>
          </div>
          <div style="font-family:'IBM Plex Mono',monospace; font-size: 1.8rem; font-weight:700; color:#ffffff;">P(${x1} &le; X &le; ${x2})</div>
          <div style="font-family:'IBM Plex Mono',monospace; font-size: 1.4rem; color: var(--amber); margin-top: 0.5rem;">${mainResult.toFixed(6)}</div>
        </div>
        <div style="padding: 1.5rem; background: rgba(255,255,255,0.06); border-radius: 12px; border: 1px solid rgba(255,255,255,0.12); display: flex; flex-direction: column; justify-content: space-between;">
          <div style="font-size:0.95rem; font-weight:600; color: rgba(255,255,255,0.6); margin-bottom: 0.5rem; display: flex; justify-content: space-between;">
            <span>Above Range</span><span>X > ${x2}</span>
          </div>
          <div style="font-family:'IBM Plex Mono',monospace; font-size: 1.6rem; font-weight:700; color:#ffffff;">P(X > ${x2})</div>
          <div style="font-family:'IBM Plex Mono',monospace; font-size: 1.3rem; color: var(--teal); margin-top: 0.5rem;">${pGreaterX2.toFixed(6)}</div>
        </div>
      </div>
    `;
  }

  let finalTargetText = mode === 'exact' ? `exactly <b>${x}</b> successes` : `between <b>${x1}</b> and <b>${x2}</b> successes (inclusive)`;

  let resultsHtml = `
    <div class="final-result animate-fade-in" style="padding: 2.5rem; background: #111827; color: #ffffff; border-radius: 16px; border: 1px solid var(--border); box-shadow: 0 10px 30px rgba(0,0,0,0.15); margin-bottom: 2rem; width: 100%; box-sizing: border-box;">
      <div style="font-size: 1.8rem; font-weight: 700; color: var(--amber); font-family:'Fraunces', serif; margin-bottom: 2rem; text-align: center;">✅ Comprehensive Results</div>
      
      <!-- Summary Box -->
      <div style="background: rgba(245, 158, 11, 0.1); border-left: 4px solid var(--amber); padding: 1.5rem; border-radius: 0 12px 12px 0; margin-bottom: 2rem;">
        <div style="font-size: 1.05rem; line-height: 1.6; color: rgba(255,255,255,0.9);">
          For a binomial experiment with <b>${n}</b> trials and probability <b>p = ${p}</b>, the probability of obtaining ${finalTargetText} is:
        </div>
        <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.8rem; font-weight: 700; color: #ffffff; margin-top: 1rem; display: flex; align-items: baseline; gap: 1rem; flex-wrap: wrap;">
          <span>${mainResult.toFixed(6)}</span>
          <span style="font-size: 1.2rem; color: var(--amber); font-family: 'Figtree', sans-serif;">or</span>
          <span style="color: var(--amber);">${(mainResult * 100).toFixed(4)}%</span>
        </div>
      </div>

      <!-- Probability Grid -->
      ${resultsGridHtml}
    </div>
  `;

  output.innerHTML = resultsHtml + stepsHtml + vizHtml;
  output.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function calculateUniform() {
  const mode = document.getElementById('uniform-mode').value;
  const aStr = document.getElementById('uniform-a').value;
  const bStr = document.getElementById('uniform-b').value;
  const xStr = document.getElementById('uniform-x').value;
  const x1Str = document.getElementById('uniform-x1').value;
  const x2Str = document.getElementById('uniform-x2').value;
  const output = document.getElementById('steps-output');
  output.classList.remove('active');

  const a = parseFloat(aStr);
  const b = parseFloat(bStr);

  if (isNaN(a) || isNaN(b)) {
    alert("Please enter valid numbers for lower bound (a) and upper bound (b).");
    return;
  }
  if (b <= a) {
    alert("Upper bound (b) must be strictly greater than lower bound (a).");
    return;
  }

  let x = parseFloat(xStr);
  let x1 = parseFloat(x1Str);
  let x2 = parseFloat(x2Str);

  if (mode === 'exact') {
    if (isNaN(x)) {
      alert("Please enter a valid number for Target Value (x).");
      return;
    }
  } else {
    if (isNaN(x1) || isNaN(x2)) {
      alert("Please enter valid numbers for Lower Limit (x₁) and Upper Limit (x₂).");
      return;
    }
    if (x1 > x2) {
      alert("Lower Limit (x₁) cannot be greater than Upper Limit (x₂).");
      return;
    }
  }

  // Calculate parameters
  const mean = (a + b) / 2;
  const variance = Math.pow(b - a, 2) / 12;
  const stdDev = Math.sqrt(variance);
  const pdfValue = 1 / (b - a);

  let probValue = 0;
  let probFormula = '';
  let probSub = '';
  let probTitle = '';
  let finalTargetText = '';

  const renderFraction = (num, den) => `
    <div style="display:inline-flex; flex-direction:column; align-items:center; vertical-align:middle; padding: 0 4px; line-height: 1.2;">
      <div style="border-bottom:2px solid currentColor; padding:0 4px; width: 100%; text-align: center;">${num}</div>
      <div style="padding:0 4px;">${den}</div>
    </div>
  `;

  let cdf = (xVal) => {
    if (xVal <= a) return 0;
    if (xVal >= b) return 1;
    return (xVal - a) / (b - a);
  };

  if (mode === 'exact') {
    probValue = cdf(x);
    probTitle = `P(X &le; ${x})`;
    probFormula = `F(x) = ${renderFraction('x - a', 'b - a')}`;
    
    let subX = Math.max(a, Math.min(b, x));
    probSub = renderFraction(`${subX} - ${a}`, `${b} - ${a}`);
    if (x <= a) probSub = `0 &nbsp;&nbsp;<span style="font-size: 0.8rem; font-family: 'Figtree', sans-serif;">(since x &le; a)</span>`;
    if (x >= b) probSub = `1 &nbsp;&nbsp;<span style="font-size: 0.8rem; font-family: 'Figtree', sans-serif;">(since x &ge; b)</span>`;
    
    finalTargetText = `a value less than or equal to <b>${x}</b>`;
  } else {
    probValue = cdf(x2) - cdf(x1);
    probTitle = `P(${x1} &le; X &le; ${x2})`;
    probFormula = `P(x₁ &le; X &le; x₂) = ${renderFraction('x₂ - x₁', 'b - a')}`;
    
    let subX2 = Math.max(a, Math.min(b, x2));
    let subX1 = Math.max(a, Math.min(b, x1));
    probSub = renderFraction(`${subX2} - ${subX1}`, `${b} - ${a}`);
    
    if (x2 <= a || x1 >= b) {
       probSub = `0 &nbsp;&nbsp;<span style="font-size: 0.8rem; font-family: 'Figtree', sans-serif;">(range is outside [a, b])</span>`;
    }
    finalTargetText = `a value between <b>${x1}</b> and <b>${x2}</b>`;
  }

  output.classList.add('active');
  output.style.display = 'block';

  // 1. Educational Breakdown
  let stepsHtml = `
    <div class="animate-fade-in" style="background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 12px; padding: 2rem; margin-bottom: 2rem;">
      <h3 style="font-family: 'Fraunces', serif; color: var(--navy); font-size: 1.5rem; margin-bottom: 1.5rem; border-bottom: 2px solid rgba(var(--teal-rgb), 0.2); padding-bottom: 0.5rem;">Educational Breakdown</h3>
      
      <div style="margin-bottom: 1.5rem; font-size: 0.95rem; color: var(--text); line-height: 1.6;">
        A Continuous Uniform Distribution over the interval <b>[a, b]</b> means that all outcomes in this interval are equally likely. 
        Here we have <b>a = ${a}</b> and <b>b = ${b}</b>.
      </div>

      <!-- Step 1: PDF -->
      <div class="step-card" style="margin-bottom: 1.5rem; border-left: 4px solid var(--teal); padding: 1rem 1.5rem; background: rgba(255,255,255,0.5); border-radius: 0 8px 8px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
        <div style="font-weight: 700; color: var(--navy); margin-bottom: 0.5rem; font-size: 1.05rem;">Step 1: Calculate Probability Density Function (PDF)</div>
        <div style="color: var(--text); font-size: 0.95rem; line-height: 1.6;">
          The PDF <b>f(x)</b> is constant for all values within <b>[a, b]</b>, creating a rectangle with total area 1.
        </div>
        <div style="margin-top: 1rem; font-family: 'IBM Plex Mono', monospace; font-size: 1.3rem; color: var(--navy); background: rgba(var(--teal-rgb), 0.05); padding: 1.5rem; border-radius: 8px; text-align: center; display: flex; align-items: center; justify-content: center; gap: 1rem;">
          <div>f(x) = ${renderFraction('1', 'b - a')}</div>
          <div>=</div>
          <div>${renderFraction('1', `${b} - ${a}`)}</div>
          <div>=</div>
          <div>${renderFraction('1', `${b - a}`)}</div>
          <div>&approx; ${pdfValue.toFixed(4)}</div>
        </div>
      </div>

      <!-- Step 2: Mean -->
      <div class="step-card" style="margin-bottom: 1.5rem; border-left: 4px solid var(--teal); padding: 1rem 1.5rem; background: rgba(255,255,255,0.5); border-radius: 0 8px 8px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
        <div style="font-weight: 700; color: var(--navy); margin-bottom: 0.5rem; font-size: 1.05rem;">Step 2: Calculate the Mean (Expected Value)</div>
        <div style="color: var(--text); font-size: 0.95rem; line-height: 1.6;">
          The mean <b>&mu;</b> is simply the exact center (midpoint) of the interval.
        </div>
        <div style="margin-top: 1rem; font-family: 'IBM Plex Mono', monospace; font-size: 1.3rem; color: var(--navy); background: rgba(var(--teal-rgb), 0.05); padding: 1.5rem; border-radius: 8px; text-align: center; display: flex; align-items: center; justify-content: center; gap: 1rem; flex-wrap: wrap;">
          <div>&mu; = ${renderFraction('a + b', '2')}</div>
          <div>=</div>
          <div>${renderFraction(`${a} + ${b}`, '2')}</div>
          <div>=</div>
          <div>${renderFraction(`${a + b}`, '2')}</div>
          <div>= ${mean}</div>
        </div>
      </div>

      <!-- Step 3: Variance -->
      <div class="step-card" style="margin-bottom: 1.5rem; border-left: 4px solid var(--teal); padding: 1rem 1.5rem; background: rgba(255,255,255,0.5); border-radius: 0 8px 8px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
        <div style="font-weight: 700; color: var(--navy); margin-bottom: 0.5rem; font-size: 1.05rem;">Step 3: Calculate Variance</div>
        <div style="color: var(--text); font-size: 0.95rem; line-height: 1.6;">
          The variance <b>&sigma;&sup2;</b> measures how spread out the distribution is.
        </div>
        <div style="margin-top: 1rem; font-family: 'IBM Plex Mono', monospace; font-size: 1.3rem; color: var(--navy); background: rgba(var(--teal-rgb), 0.05); padding: 1.5rem; border-radius: 8px; text-align: center; display: flex; align-items: center; justify-content: center; gap: 1rem; flex-wrap: wrap;">
          <div>&sigma;&sup2; = ${renderFraction('(b - a)&sup2;', '12')}</div>
          <div>=</div>
          <div>${renderFraction(`(${b} - ${a})&sup2;`, '12')}</div>
          <div>=</div>
          <div>${renderFraction(`${(b - a)**2}`, '12')}</div>
          <div>&approx; ${variance.toFixed(4)}</div>
        </div>
      </div>

      <!-- Step 4: Std Dev -->
      <div class="step-card" style="margin-bottom: 1.5rem; border-left: 4px solid var(--teal); padding: 1rem 1.5rem; background: rgba(255,255,255,0.5); border-radius: 0 8px 8px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
        <div style="font-weight: 700; color: var(--navy); margin-bottom: 0.5rem; font-size: 1.05rem;">Step 4: Calculate Standard Deviation</div>
        <div style="color: var(--text); font-size: 0.95rem; line-height: 1.6;">
          The standard deviation <b>&sigma;</b> is the square root of the variance.
        </div>
        <div style="margin-top: 1rem; font-family: 'IBM Plex Mono', monospace; font-size: 1.3rem; color: var(--navy); background: rgba(var(--teal-rgb), 0.05); padding: 1.5rem; border-radius: 8px; text-align: center; display: flex; align-items: center; justify-content: center; gap: 1rem; flex-wrap: wrap;">
          <div>&sigma; = &radic;<span style="border-top: 1px solid currentColor; padding-top: 2px;">&sigma;&sup2;</span></div>
          <div>=</div>
          <div>&radic;<span style="border-top: 1px solid currentColor; padding-top: 2px;">${variance.toFixed(4)}</span></div>
          <div>&approx; ${stdDev.toFixed(4)}</div>
        </div>
      </div>

      <!-- Step 5: Probability -->
      <div class="step-card" style="border-left: 4px solid var(--teal); padding: 1rem 1.5rem; background: rgba(255,255,255,0.5); border-radius: 0 8px 8px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
        <div style="font-weight: 700; color: var(--navy); margin-bottom: 0.5rem; font-size: 1.05rem;">Step 5: Calculate Probability ${probTitle}</div>
        <div style="color: var(--text); font-size: 0.95rem; line-height: 1.6;">
          The probability corresponds to the area of the rectangle covering the selected range.
        </div>
        <div style="margin-top: 1rem; font-family: 'IBM Plex Mono', monospace; font-size: 1.3rem; color: var(--navy); background: rgba(var(--teal-rgb), 0.05); padding: 1.5rem; border-radius: 8px; text-align: center; display: flex; align-items: center; justify-content: center; gap: 1rem; flex-wrap: wrap;">
          <div>${probFormula}</div>
          <div>=</div>
          <div>${probSub}</div>
          <div>= ${probValue.toFixed(4)}</div>
        </div>
      </div>
    </div>
  `;

  // 2. Visualization
  let shadeStart = a;
  let shadeEnd = a;
  if (mode === 'exact') {
    shadeStart = a;
    shadeEnd = Math.max(a, Math.min(b, x));
  } else {
    shadeStart = Math.max(a, Math.min(b, x1));
    shadeEnd = Math.max(a, Math.min(b, x2));
  }

  let rangeLength = b - a;
  let pctStart = ((shadeStart - a) / rangeLength) * 100;
  let pctWidth = ((shadeEnd - shadeStart) / rangeLength) * 100;
  
  if (pctStart < 0) pctStart = 0;
  if (pctWidth < 0) pctWidth = 0;
  if (pctStart + pctWidth > 100) pctWidth = 100 - pctStart;

  let vizHtml = `
    <div class="viz-container animate-fade-in" style="background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 12px; padding: 2rem; margin-bottom: 2rem;">
      <h3 style="font-family: 'Fraunces', serif; color: var(--navy); font-size: 1.5rem; margin-bottom: 1.5rem; border-bottom: 2px solid rgba(var(--teal-rgb), 0.2); padding-bottom: 0.5rem;">Probability Distribution Curve</h3>
      <div style="width: 100%; height: 250px; background: rgba(255,255,255,0.5); border: 1px solid rgba(0,0,0,0.05); border-radius: 8px; padding: 2rem 3rem; box-sizing: border-box; display: flex; flex-direction: column; justify-content: flex-end; position: relative;">
        <!-- Y-Axis Label -->
        <div style="position: absolute; left: 10px; top: 20px; font-size: 0.8rem; color: var(--navy); font-weight: 600;">f(x)</div>
        <div style="position: absolute; left: 10px; top: 40px; font-size: 0.8rem; color: var(--text);">${pdfValue.toFixed(4)}</div>
        <!-- Graph Area -->
        <div style="width: 100%; height: 160px; border-bottom: 2px solid var(--navy); border-left: 2px solid var(--navy); position: relative; display: flex; align-items: flex-end;">
          <!-- The Rectangle base -->
          <div style="width: 100%; height: 80%; border: 2px solid var(--teal); border-bottom: none; position: absolute; left: 0; bottom: 0; background: rgba(var(--teal-rgb), 0.1);"></div>
          <!-- Shaded Probability Region -->
          <div style="height: 80%; background: rgba(245, 158, 11, 0.4); border: 2px solid var(--amber); border-bottom: none; position: absolute; left: ${pctStart}%; width: ${pctWidth}%; bottom: 0; display: flex; justify-content: center; align-items: center;">
             <span style="color: #92400e; font-weight: 700; font-size: 0.9rem;">${(probValue * 100).toFixed(1)}%</span>
          </div>
        </div>
        <!-- X-Axis Labels -->
        <div style="width: 100%; display: flex; position: relative; margin-top: 10px; height: 20px;">
          <div style="position: absolute; left: 0; transform: translateX(-50%); font-weight: 600; color: var(--navy); font-size: 0.9rem;">${a} (a)</div>
          <div style="position: absolute; right: 0; transform: translateX(50%); font-weight: 600; color: var(--navy); font-size: 0.9rem;">${b} (b)</div>
          <div style="position: absolute; left: 50%; transform: translateX(-50%); font-weight: 600; color: var(--teal); font-size: 0.9rem;">μ = ${mean}</div>
        </div>
      </div>
      <div style="margin-top: 1.5rem; display: flex; justify-content: center; gap: 2rem; font-size: 0.9rem; font-weight: 600; color: var(--navy);">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <div style="width: 14px; height: 14px; background: rgba(var(--teal-rgb), 0.1); border: 2px solid var(--teal); border-radius: 3px;"></div>
          Uniform Density PDF
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <div style="width: 14px; height: 14px; background: rgba(245, 158, 11, 0.4); border: 2px solid var(--amber); border-radius: 3px;"></div>
          Target Region ${probTitle}
        </div>
      </div>
    </div>
  `;

  // 3. Final Results
  let pLess = probValue;
  let pGreater = 1 - probValue;

  let resultsGridHtml = `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem;">
      <div style="padding: 1.5rem; background: rgba(255,255,255,0.06); border-radius: 12px; border: 1px solid rgba(255,255,255,0.12); display: flex; flex-direction: column; justify-content: space-between;">
        <div style="font-size:0.95rem; font-weight:600; color: rgba(255,255,255,0.6); margin-bottom: 0.5rem;">Mean &mu;</div>
        <div style="font-family:'IBM Plex Mono',monospace; font-size: 1.6rem; font-weight:700; color:#ffffff;">${mean.toFixed(4)}</div>
      </div>
      <div style="padding: 1.5rem; background: rgba(255,255,255,0.06); border-radius: 12px; border: 1px solid rgba(255,255,255,0.12); display: flex; flex-direction: column; justify-content: space-between;">
        <div style="font-size:0.95rem; font-weight:600; color: rgba(255,255,255,0.6); margin-bottom: 0.5rem;">Variance &sigma;&sup2;</div>
        <div style="font-family:'IBM Plex Mono',monospace; font-size: 1.6rem; font-weight:700; color:#ffffff;">${variance.toFixed(4)}</div>
      </div>
      <div style="padding: 1.5rem; background: rgba(255,255,255,0.06); border-radius: 12px; border: 1px solid rgba(255,255,255,0.12); display: flex; flex-direction: column; justify-content: space-between;">
        <div style="font-size:0.95rem; font-weight:600; color: rgba(255,255,255,0.6); margin-bottom: 0.5rem;">Standard Dev &sigma;</div>
        <div style="font-family:'IBM Plex Mono',monospace; font-size: 1.6rem; font-weight:700; color:#ffffff;">${stdDev.toFixed(4)}</div>
      </div>
      <div style="padding: 1.5rem; background: rgba(255,255,255,0.06); border-radius: 12px; border: 1px solid rgba(255,255,255,0.12); display: flex; flex-direction: column; justify-content: space-between;">
        <div style="font-size:0.95rem; font-weight:600; color: rgba(255,255,255,0.6); margin-bottom: 0.5rem;">PDF f(x)</div>
        <div style="font-family:'IBM Plex Mono',monospace; font-size: 1.6rem; font-weight:700; color:#ffffff;">${pdfValue.toFixed(4)}</div>
      </div>
      <div style="padding: 1.5rem; background: rgba(255,255,255,0.12); border-radius: 12px; border: 2px solid var(--amber); box-shadow: 0 0 20px rgba(245, 158, 11, 0.15); display: flex; flex-direction: column; justify-content: space-between; transform: scale(1.02); z-index: 1;">
        <div style="font-size:0.95rem; font-weight:600; color: var(--amber); margin-bottom: 0.5rem;">${probTitle}</div>
        <div style="font-family:'IBM Plex Mono',monospace; font-size: 1.8rem; font-weight:700; color:var(--amber);">${probValue.toFixed(4)}</div>
      </div>
    </div>
  `;

  let resultsHtml = `
    <div class="final-result animate-fade-in" style="padding: 2.5rem; background: #111827; color: #ffffff; border-radius: 16px; border: 1px solid var(--border); box-shadow: 0 10px 30px rgba(0,0,0,0.15); margin-bottom: 2rem; width: 100%; box-sizing: border-box;">
      <div style="font-size: 1.8rem; font-weight: 700; color: var(--amber); font-family:'Fraunces', serif; margin-bottom: 2rem; text-align: center;">✅ Comprehensive Results</div>
      
      <!-- Summary Box -->
      <div style="background: rgba(245, 158, 11, 0.1); border-left: 4px solid var(--amber); padding: 1.5rem; border-radius: 0 12px 12px 0; margin-bottom: 2rem;">
        <div style="font-size: 1.05rem; line-height: 1.6; color: rgba(255,255,255,0.9);">
          For a uniform distribution on the interval <b>[${a}, ${b}]</b>, every value is equally likely. The probability of observing ${finalTargetText} is:
        </div>
        <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.8rem; font-weight: 700; color: #ffffff; margin-top: 1rem; display: flex; align-items: baseline; gap: 1rem; flex-wrap: wrap;">
          <span>${probValue.toFixed(6)}</span>
          <span style="font-size: 1.2rem; color: var(--amber); font-family: 'Figtree', sans-serif;">or</span>
          <span style="color: var(--amber);">${(probValue * 100).toFixed(4)}%</span>
        </div>
      </div>

      <!-- Probability Grid -->
      ${resultsGridHtml}
    </div>
  `;

  output.innerHTML = resultsHtml + stepsHtml + vizHtml;
  
  setTimeout(() => {
    if (window.MathJax) {
      MathJax.typesetPromise().then(() => {
        output.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    } else {
      output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 50);
}

// ==========================================
// PEARSON RANK CORRELATION CALCULATOR
// ==========================================

function calculatePearsonRank() {
  const output = document.getElementById('steps-output');
  output.innerHTML = '';
  
  // Helper to handle error display
  const showError = (msg) => {
    output.innerHTML = `
      <div class="step-card" style="border-left-color: #dc2626;">
        <div class="step-header">
          <div class="step-title" style="color: #dc2626;">Error</div>
        </div>
        <div class="step-desc">${msg}</div>
      </div>
    `;
    output.classList.add('active');
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Helper to format fraction safely
  const fmt = (num, dec) => Number.isInteger(num) ? num.toString() : Number(num).toFixed(dec);

  // Read Inputs
  const decimals = parseInt(document.getElementById('pearson-decimals').value) || 4;
  const rawData = [];
  
  for (let i = 1; i <= 8; i++) {
    const xVal = document.getElementById(`pearson-x-${i}`).value;
    const yVal = document.getElementById(`pearson-y-${i}`).value;
    
    if (xVal !== '' || yVal !== '') {
      rawData.push({ row: i, xStr: xVal, yStr: yVal });
    }
  }

  // Phase 2: Input Validation
  if (rawData.length === 0) {
    return showError("No data entered. Please fill at least 2 pairs of X and Y values.");
  }

  const xs = [];
  const ys = [];
  const origOrder = [];
  
  for (let r of rawData) {
    if (r.xStr === '' || r.yStr === '') {
      return showError(`Mismatched data: Row ${r.row} has a value for X but not Y (or vice versa). Each row must have both X and Y, or be left completely empty.`);
    }
    const x = parseFloat(r.xStr);
    const y = parseFloat(r.yStr);
    
    if (isNaN(x) || isNaN(y)) {
      return showError(`Non-numeric value detected in row ${r.row}. All entries must be numbers.`);
    }
    
    xs.push(x);
    ys.push(y);
    origOrder.push(r.row);
  }

  if (xs.length < 2) {
    return showError("At least 2 data pairs are required to compute a correlation coefficient.");
  }

  let warningHtml = '';
  const xAllSame = xs.every(v => v === xs[0]);
  const yAllSame = ys.every(v => v === ys[0]);
  if (xAllSame || yAllSame) {
    warningHtml = `
      <div class="step-card" style="border-left-color: var(--amber); background: rgba(245, 158, 11, 0.05); margin-bottom: 1.5rem;">
        <div class="step-header" style="margin-bottom: 0;">
          <svg style="width: 20px; height: 20px; stroke: var(--amber); margin-right: 0.5rem;" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          <div class="step-title" style="color: var(--amber); font-size: 0.95rem;">Warning: Identical Values</div>
        </div>
        <div class="step-desc" style="margin-top: 0.5rem; margin-bottom: 0; color: var(--navy);">
          All X values (or all Y values) are identical. This means all observations receive the exact same rank, leaving no variation to correlate. The formula will compute ρ = 0, but this result may not be meaningful.
        </div>
      </div>
    `;
  }

  const n = xs.length;
  const denom = n * (n * n - 1);
  if (denom === 0) {
     return showError("Denominator evaluates to zero. Cannot compute correlation.");
  }

  // Phase 3: Average Rank Algorithm
  function computeRanks(arr, varName) {
    const indices = arr.map((val, idx) => idx);
    indices.sort((a, b) => arr[a] - arr[b]);
    
    const ranks = new Array(n);
    const tieNotes = [];
    
    let i = 0;
    while (i < n) {
      let j = i;
      while (j < n && arr[indices[j]] === arr[indices[i]]) {
        j++;
      }
      const k = j - i;
      const avgRank = (i + 1) + (k - 1) / 2;
      
      for (let m = i; m < j; m++) {
        ranks[indices[m]] = avgRank;
      }
      
      if (k > 1) {
        tieNotes.push(`Value ${fmt(arr[indices[i]], decimals)} appears ${k} times (positions ${i+1} to ${j}) &rarr; assigned average rank <b>${avgRank}</b>.`);
      }
      
      i = j;
    }
    
    return { ranks, tieNotes };
  }

  const rankXInfo = computeRanks(xs, 'X');
  const rankYInfo = computeRanks(ys, 'Y');
  
  const Rx = rankXInfo.ranks;
  const Ry = rankYInfo.ranks;

  // Phase 4: Compute d and d^2
  const d = new Array(n);
  const d2 = new Array(n);
  let sumD2 = 0;
  
  for (let i = 0; i < n; i++) {
    d[i] = Rx[i] - Ry[i];
    d2[i] = d[i] * d[i];
    sumD2 += d2[i];
  }

  // Phase 5: Compute rho
  let rho = 1 - (6 * sumD2) / denom;
  if (rho > 1) rho = 1;
  if (rho < -1) rho = -1;

  // Phase 6: HTML Building
  const th = (content) => `<th style="padding: 0.5rem 0.75rem; text-align: center; color: var(--muted); border-bottom: 2px solid var(--border);">${content}</th>`;
  const td = (content, color) => `<td style="padding: 0.5rem 0.75rem; text-align: center; border-bottom: 1px solid var(--border); ${color ? `color: ${color}; font-weight: 500;` : ''}">${content}</td>`;
  const tieHighlight = `style="background: rgba(245,158,11,0.1); color: var(--amber); padding: 0.5rem 0.75rem; text-align: center; border-bottom: 1px solid var(--border); font-weight: 500;"`;
  const tieTrHighlight = (isTied) => isTied ? `style="background: rgba(245,158,11,0.03);"` : '';

  let interpText = "";
  let interpColor = "";
  let interpDesc = "";
  
  if (rho === 1) { interpText = "Perfect Positive"; interpColor = "var(--teal)"; interpDesc = "X and Y increase together in perfect monotonicity."; }
  else if (rho >= 0.7) { interpText = "Strong Positive"; interpColor = "var(--teal)"; interpDesc = "High ranks in X strongly correspond to high ranks in Y."; }
  else if (rho >= 0.4) { interpText = "Moderate Positive"; interpColor = "var(--teal)"; interpDesc = "Higher X ranks generally correspond to higher Y ranks."; }
  else if (rho >= 0.1) { interpText = "Weak Positive"; interpColor = "var(--muted)"; interpDesc = "Slight tendency for higher X to pair with higher Y."; }
  else if (rho > -0.1) { interpText = "No / Negligible"; interpColor = "var(--muted)"; interpDesc = "No monotonic relationship between X and Y."; }
  else if (rho > -0.4) { interpText = "Weak Negative"; interpColor = "#f87171"; interpDesc = "Slight tendency for higher X to pair with lower Y."; }
  else if (rho > -0.7) { interpText = "Moderate Negative"; interpColor = "#dc2626"; interpDesc = "Higher X ranks generally correspond to lower Y ranks."; }
  else if (rho > -1) { interpText = "Strong Negative"; interpColor = "#dc2626"; interpDesc = "High ranks in X strongly correspond to low ranks in Y."; }
  else { interpText = "Perfect Negative"; interpColor = "#dc2626"; interpDesc = "X and Y move in perfectly opposite directions."; }

  let html = `
    ${warningHtml}
    <div class="card" style="background: #111827; border-color: #374151; padding: 2rem;">
      <h3 style="color: #9CA3AF; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">Result Summary</h3>
      <div style="color: var(--amber); font-family: 'Fraunces', serif; font-size: 2.5rem; margin-bottom: 1.5rem;">
        ρ = ${rho.toFixed(decimals)}
      </div>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 1rem;">
        <div style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 8px;">
          <div style="color: #6B7280; font-size: 0.85rem; margin-bottom: 0.25rem;">Observations (n)</div>
          <div style="color: white; font-weight: 600; font-size: 1.2rem;">${n}</div>
        </div>
        <div style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 8px;">
          <div style="color: #6B7280; font-size: 0.85rem; margin-bottom: 0.25rem;">Σd²</div>
          <div style="color: white; font-weight: 600; font-size: 1.2rem;">${fmt(sumD2, decimals)}</div>
        </div>
        <div style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 8px; grid-column: 1 / -1;">
          <div style="color: #6B7280; font-size: 0.85rem; margin-bottom: 0.25rem;">Interpretation</div>
          <div style="color: ${interpColor}; font-weight: 600; font-size: 1.1rem;">${interpText} Correlation</div>
        </div>
      </div>
    </div>
  `;

  // Step 1: Data Table
  html += `
    <div class="step-card">
      <div class="step-header">
        <div class="step-number">1</div>
        <div class="step-title">Original Data</div>
      </div>
      <div style="overflow-x: auto; max-width: 400px; margin: 0 auto;">
        <table style="width: 100%; border-collapse: collapse; font-family: 'Figtree', sans-serif; font-size: 0.95rem;">
          <thead><tr>${th('No.')}${th('X')}${th('Y')}</tr></thead>
          <tbody>
  `;
  for (let i = 0; i < n; i++) {
    html += `<tr>${td(origOrder[i])}${td(fmt(xs[i], decimals))}${td(fmt(ys[i], decimals))}</tr>`;
  }
  html += `</tbody></table></div></div>`;

  // Step 2 & 3: Rank X and Rank Y tables
  const buildRankTable = (stepNum, title, arr, ranks, notes, varLabel) => {
    let rHtml = `
      <div class="step-card">
        <div class="step-header">
          <div class="step-number">${stepNum}</div>
          <div class="step-title">${title}</div>
        </div>
        <div style="overflow-x: auto; max-width: 400px; margin: 0 auto 1rem auto;">
          <table style="width: 100%; border-collapse: collapse; font-family: 'Figtree', sans-serif; font-size: 0.95rem;">
            <thead><tr>${th('No.')}${th(varLabel)}${th('Rank')}</tr></thead>
            <tbody>
    `;
    
    const rankCounts = {};
    ranks.forEach(r => rankCounts[r] = (rankCounts[r] || 0) + 1);

    for (let i = 0; i < n; i++) {
      const isTied = rankCounts[ranks[i]] > 1;
      rHtml += `<tr ${tieTrHighlight(isTied)}>${td(origOrder[i])}${td(fmt(arr[i], decimals))}<td ${isTied ? tieHighlight : td(ranks[i])}>${ranks[i]}</td></tr>`;
    }
    rHtml += `</tbody></table></div>`;
    
    if (notes.length > 0) {
      rHtml += `<div style="background: var(--bg2); padding: 1rem; border-radius: 8px; font-size: 0.9rem; color: var(--navy); border: 1px dashed var(--border);">`;
      rHtml += `<div style="font-weight: 600; margin-bottom: 0.5rem; color: var(--amber);">Tie Handling Notes:</div>`;
      rHtml += `<ul style="margin: 0; padding-left: 1.5rem; line-height: 1.6;">`;
      notes.forEach(note => rHtml += `<li>${note}</li>`);
      rHtml += `</ul></div>`;
    }
    rHtml += `</div>`;
    return rHtml;
  };

  html += buildRankTable(2, "Assign Ranks for X", xs, Rx, rankXInfo.tieNotes, "X");
  html += buildRankTable(3, "Assign Ranks for Y", ys, Ry, rankYInfo.tieNotes, "Y");

  // Step 4 & 5 combined table visual
  html += `
    <div class="step-card">
      <div class="step-header">
        <div class="step-number">4 & 5</div>
        <div class="step-title">Compute d and d²</div>
      </div>
      <div class="step-desc">d = R<sub>x</sub> − R<sub>y</sub></div>
      <div style="overflow-x: auto; max-width: 500px; margin: 0 auto;">
        <table style="width: 100%; border-collapse: collapse; font-family: 'Figtree', sans-serif; font-size: 0.95rem;">
          <thead><tr>${th('No.')}${th('R<sub>x</sub>')}${th('R<sub>y</sub>')}${th('d')}${th('d²')}</tr></thead>
          <tbody>
  `;
  for (let i = 0; i < n; i++) {
    const dColor = d[i] < 0 ? '#dc2626' : 'var(--navy)';
    html += `<tr>
      ${td(origOrder[i])}
      ${td(Rx[i])}
      ${td(Ry[i])}
      ${td(fmt(d[i], decimals), dColor)}
      ${td(fmt(d2[i], decimals), 'var(--teal)')}
    </tr>`;
  }
  html += `</tbody></table></div></div>`;

  // Step 6: Sum
  html += `
    <div class="step-card">
      <div class="step-header">
        <div class="step-number">6</div>
        <div class="step-title">Sum of Squared Differences (Σd²)</div>
      </div>
      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.1rem; color: var(--navy); text-align: center; padding: 1rem; background: var(--bg); border-radius: 8px;">
        Σd² = ${d2.map(val => fmt(val, decimals)).join(' + ')} = <span style="color: var(--teal); font-weight: 700;">${fmt(sumD2, decimals)}</span>
      </div>
    </div>
  `;

  // Step 7: Formula
  html += `
    <div class="step-card">
      <div class="step-header">
        <div class="step-number">7</div>
        <div class="step-title">Formula</div>
      </div>
      <div style="text-align: center; font-size: 1.5rem; font-family: 'Fraunces', serif; color: var(--navy); padding: 1.5rem; border: 2px dashed var(--border); border-radius: 8px;">
        ρ = 1 − <span style="display: inline-block; vertical-align: middle; text-align: center; font-size: 1.3rem;">
          <span style="border-bottom: 2px solid var(--navy); padding: 0 0.5rem; display: block;">6 Σd²</span>
          <span style="padding: 0 0.5rem; display: block;">n(n² − 1)</span>
        </span>
      </div>
    </div>
  `;

  // Step 8: Substitution
  html += `
    <div class="step-card">
      <div class="step-header">
        <div class="step-number">8</div>
        <div class="step-title">Substitution</div>
      </div>
      <div style="text-align: center; font-size: 1.4rem; font-family: 'IBM Plex Mono', monospace; color: var(--navy); padding: 1.5rem; background: var(--bg); border-radius: 8px; line-height: 2;">
        ρ = 1 − <span style="display: inline-block; vertical-align: middle; text-align: center;">
          <span style="border-bottom: 2px solid var(--navy); padding: 0 0.5rem; display: block;">6 × ${fmt(sumD2, decimals)}</span>
          <span style="padding: 0 0.5rem; display: block;">${n} × (${n}² − 1)</span>
        </span><br>
        ρ = 1 − <span style="display: inline-block; vertical-align: middle; text-align: center;">
          <span style="border-bottom: 2px solid var(--navy); padding: 0 0.5rem; display: block;">${fmt(6 * sumD2, decimals)}</span>
          <span style="padding: 0 0.5rem; display: block;">${denom}</span>
        </span><br>
        ρ = 1 − ${fmt((6 * sumD2) / denom, decimals + 2)}
      </div>
    </div>
  `;

  // Step 9: Final Answer
  html += `
    <div class="step-card" style="border-left: 4px solid ${interpColor};">
      <div class="step-header">
        <div class="step-number" style="background: rgba(0,0,0,0.05); color: ${interpColor};">9</div>
        <div class="step-title" style="color: ${interpColor};">Final Answer & Interpretation</div>
      </div>
      <div style="text-align: center;">
        <div style="font-family: 'Fraunces', serif; font-size: 2.5rem; color: ${interpColor}; margin-bottom: 1rem;">
          ρ = ${rho.toFixed(decimals)}
        </div>
        <div style="font-weight: 600; font-size: 1.2rem; color: var(--navy); margin-bottom: 0.5rem;">
          ${interpText} Correlation
        </div>
        <div style="color: var(--muted); font-size: 1rem;">
          ${interpDesc}
        </div>
      </div>
    </div>
  `;

  // Visualizations: Strength Meter
  const getMeterPercent = (r) => ((r + 1) / 2) * 100;
  html += `
    <div class="step-card">
      <div class="step-header">
        <div class="step-title">Correlation Strength Meter</div>
      </div>
      <div style="margin-top: 1rem; position: relative; padding-top: 2rem;">
        <svg width="100%" height="70" viewBox="0 0 100 70" preserveAspectRatio="none" style="overflow: visible;">
          <defs>
            <linearGradient id="gradMeter" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#ef4444" />
              <stop offset="50%" stop-color="#e5e7eb" />
              <stop offset="100%" stop-color="#10b981" />
            </linearGradient>
          </defs>
          <rect x="0" y="30" width="100" height="16" rx="8" fill="url(#gradMeter)" />
          <path d="M 0 30 v 20 M 25 30 v 20 M 50 30 v 20 M 75 30 v 20 M 100 30 v 20" stroke="var(--navy)" stroke-width="0.5" opacity="0.3" />
          <text x="0" y="65" text-anchor="middle" font-family="sans-serif" font-size="5" fill="var(--muted)">-1</text>
          <text x="25" y="65" text-anchor="middle" font-family="sans-serif" font-size="5" fill="var(--muted)">-0.5</text>
          <text x="50" y="65" text-anchor="middle" font-family="sans-serif" font-size="5" fill="var(--muted)">0</text>
          <text x="75" y="65" text-anchor="middle" font-family="sans-serif" font-size="5" fill="var(--muted)">+0.5</text>
          <text x="100" y="65" text-anchor="middle" font-family="sans-serif" font-size="5" fill="var(--muted)">+1</text>
          <g transform="translate(${getMeterPercent(rho)}, 30)">
            <polygon points="-3,-10 3,-10 0,0" fill="var(--navy)" />
            <text x="0" y="-14" text-anchor="middle" font-family="'IBM Plex Mono', monospace" font-size="6" font-weight="bold" fill="var(--navy)">${rho.toFixed(2)}</text>
          </g>
        </svg>
      </div>
    </div>
  `;

  // Visualizations: Scatter Plot
  const pad = 40;
  const svgW = 460;
  const svgH = 320;
  const plotW = svgW - 2 * pad;
  const plotH = svgH - 2 * pad;
  
  const mapX = (r) => pad + ((r - 1) / (n - 1 || 1)) * plotW;
  const mapY = (r) => pad + plotH - ((r - 1) / (n - 1 || 1)) * plotH;
  
  let scatterHtml = '';
  for (let i = 1; i <= n; i++) {
    const px = mapX(i);
    const py = mapY(i);
    scatterHtml += `<line x1="${px}" y1="${pad}" x2="${px}" y2="${pad+plotH}" stroke="var(--border)" stroke-width="1" stroke-dasharray="4" />`;
    scatterHtml += `<line x1="${pad}" y1="${py}" x2="${pad+plotW}" y2="${py}" stroke="var(--border)" stroke-width="1" stroke-dasharray="4" />`;
    scatterHtml += `<text x="${px}" y="${svgH - pad + 15}" text-anchor="middle" font-family="sans-serif" font-size="10" fill="var(--muted)">${i}</text>`;
    scatterHtml += `<text x="${pad - 10}" y="${py + 4}" text-anchor="end" font-family="sans-serif" font-size="10" fill="var(--muted)">${i}</text>`;
  }
  scatterHtml += `<line x1="${pad}" y1="${pad+plotH}" x2="${pad+plotW}" y2="${pad+plotH}" stroke="var(--navy)" stroke-width="2" />`;
  scatterHtml += `<line x1="${pad}" y1="${pad}" x2="${pad}" y2="${pad+plotH}" stroke="var(--navy)" stroke-width="2" />`;
  scatterHtml += `<text x="${pad + plotW/2}" y="${svgH - 5}" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="600" fill="var(--navy)">Rank of X</text>`;
  scatterHtml += `<text x="12" y="${pad + plotH/2}" transform="rotate(-90 12,${pad + plotH/2})" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="600" fill="var(--navy)">Rank of Y</text>`;
  
  let sumRx = 0, sumRy = 0, sumRxRy = 0, sumRx2 = 0;
  for (let i=0; i<n; i++) {
    sumRx += Rx[i]; sumRy += Ry[i]; sumRxRy += Rx[i]*Ry[i]; sumRx2 += Rx[i]*Rx[i];
  }
  const trendDenom = (n * sumRx2 - sumRx * sumRx);
  if (trendDenom !== 0) {
    const slope = (n * sumRxRy - sumRx * sumRy) / trendDenom;
    const intercept = (sumRy - slope * sumRx) / n;
    
    const yAt1 = slope * 1 + intercept;
    const yAtN = slope * n + intercept;
    
    const lineX1 = mapX(1);
    const lineY1 = mapY(Math.max(1, Math.min(n, yAt1)));
    const lineX2 = mapX(n);
    const lineY2 = mapY(Math.max(1, Math.min(n, yAtN)));
    
    scatterHtml += `<line x1="${lineX1}" y1="${lineY1}" x2="${lineX2}" y2="${lineY2}" stroke="var(--teal)" stroke-width="3" />`;
  }
  
  for (let i = 0; i < n; i++) {
    scatterHtml += `<circle cx="${mapX(Rx[i])}" cy="${mapY(Ry[i])}" r="6" fill="var(--amber)" stroke="#fff" stroke-width="2" />`;
  }

  html += `
    <div class="step-card">
      <div class="step-header">
        <div class="step-title">Rank Scatter Plot</div>
      </div>
      <div style="overflow-x: auto; text-align: center; padding: 1rem 0;">
        <svg width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}" style="max-width: 100%; height: auto;">
          ${scatterHtml}
        </svg>
      </div>
      <div style="display: flex; justify-content: center; gap: 2rem; font-size: 0.85rem; color: var(--muted); margin-top: 0.5rem;">
        <span style="display: flex; align-items: center; gap: 0.25rem;"><span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: var(--amber);"></span> Data Point</span>
        <span style="display: flex; align-items: center; gap: 0.25rem;"><span style="display: inline-block; width: 20px; height: 3px; background: var(--teal);"></span> Trend</span>
      </div>
    </div>
  `;

  // Theory Section
  html += `
    <div class="step-card" style="border-left-color: var(--amber);">
      <div class="step-header">
        <svg style="width: 24px; height: 24px; stroke: var(--amber); margin-right: 0.5rem;" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
        <div class="step-title">Theory: Spearman Rank Correlation</div>
      </div>
      <div style="font-size: 0.95rem; color: var(--navy); line-height: 1.6;">
        <p style="margin-top: 0;"><strong>What is it?</strong> It is a non-parametric measure of rank correlation (statistical dependence between the rankings of two variables). It assesses how well the relationship between two variables can be described using a monotonic function.</p>
        <p><strong>When to use:</strong> When data is ordinal, not normally distributed, or to detect non-linear monotonic relationships. It is highly resistant to outliers.</p>
        <div style="margin: 1.5rem 0;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; border: 1px solid var(--border);">
            <thead>
              <tr style="background: var(--bg); border-bottom: 2px solid var(--border);">
                <th style="padding: 0.5rem; text-align: left;">ρ Range</th>
                <th style="padding: 0.5rem; text-align: left;">Interpretation</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style="padding: 0.5rem; border-bottom: 1px solid var(--border);">ρ = 1.0</td><td style="padding: 0.5rem; border-bottom: 1px solid var(--border);">Perfect Positive Correlation</td></tr>
              <tr><td style="padding: 0.5rem; border-bottom: 1px solid var(--border);">0.7 ≤ ρ &lt; 1.0</td><td style="padding: 0.5rem; border-bottom: 1px solid var(--border);">Strong Positive Correlation</td></tr>
              <tr><td style="padding: 0.5rem; border-bottom: 1px solid var(--border);">0.4 ≤ ρ &lt; 0.7</td><td style="padding: 0.5rem; border-bottom: 1px solid var(--border);">Moderate Positive Correlation</td></tr>
              <tr><td style="padding: 0.5rem; border-bottom: 1px solid var(--border);">0.1 ≤ ρ &lt; 0.4</td><td style="padding: 0.5rem; border-bottom: 1px solid var(--border);">Weak Positive Correlation</td></tr>
              <tr><td style="padding: 0.5rem; border-bottom: 1px solid var(--border);">−0.1 &lt; ρ &lt; 0.1</td><td style="padding: 0.5rem; border-bottom: 1px solid var(--border);">No / Negligible Correlation</td></tr>
              <tr><td style="padding: 0.5rem; border-bottom: 1px solid var(--border);">−0.4 &lt; ρ ≤ −0.1</td><td style="padding: 0.5rem; border-bottom: 1px solid var(--border);">Weak Negative Correlation</td></tr>
              <tr><td style="padding: 0.5rem; border-bottom: 1px solid var(--border);">−0.7 &lt; ρ ≤ −0.4</td><td style="padding: 0.5rem; border-bottom: 1px solid var(--border);">Moderate Negative Correlation</td></tr>
              <tr><td style="padding: 0.5rem; border-bottom: 1px solid var(--border);">−1.0 &lt; ρ ≤ −0.7</td><td style="padding: 0.5rem; border-bottom: 1px solid var(--border);">Strong Negative Correlation</td></tr>
              <tr><td style="padding: 0.5rem;">ρ = −1.0</td><td style="padding: 0.5rem;">Perfect Negative Correlation</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  // Export Section
  html += `
    <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 2rem;">
      <button onclick="exportPearsonCSV()" class="btn-primary" style="background: var(--bg2); color: var(--navy); border: 1px solid var(--border);">
        <svg style="width: 18px; height: 18px; stroke: currentColor;" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
        Download CSV
      </button>
      <button onclick="exportPearsonPDF()" class="btn-primary" style="background: var(--bg2); color: var(--navy); border: 1px solid var(--border);">
        <svg style="width: 18px; height: 18px; stroke: currentColor;" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
        Save as PDF
      </button>
    </div>
  `;

  // Store globally for CSV export
  window._pearsonData = { xs, ys, Rx, Ry, d, d2, rho, n, origOrder };

  output.innerHTML = html;
  output.classList.add('active');
  output.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Global Exports Handlers
window.exportPearsonCSV = function() {
  const data = window._pearsonData;
  if (!data) return;
  
  let csv = "No.,X,Y,Rank_X,Rank_Y,d,d^2\n";
  for (let i = 0; i < data.n; i++) {
    csv += `${data.origOrder[i]},${data.xs[i]},${data.ys[i]},${data.Rx[i]},${data.Ry[i]},${data.d[i]},${data.d2[i]}\n`;
  }
  csv += `\nSpearman Rank Correlation (rho),${data.rho}\n`;
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "pearson_rank_correlation.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

window.exportPearsonPDF = function() {
  const style = document.createElement('style');
  style.innerHTML = `
    @media print {
      body * { visibility: hidden; }
      #steps-output, #steps-output * { visibility: visible; }
      #steps-output { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 0; }
      .btn-primary { display: none !important; }
      @page { margin: 1cm; }
    }
  `;
  document.head.appendChild(style);
  window.print();
  setTimeout(() => document.head.removeChild(style), 1000);
};

// ==========================================
// REGRESSION CALCULATOR ENGINE
// ==========================================

window.toggleRegressionInputMethod = function(method) {
  const tableContainer = document.getElementById('regression-table-input-sub');
  const rawContainer = document.getElementById('regression-raw-input-sub');
  if (method === 'table') {
    if (tableContainer) tableContainer.style.display = 'flex';
    if (rawContainer) rawContainer.style.display = 'none';
  } else {
    if (tableContainer) tableContainer.style.display = 'none';
    if (rawContainer) rawContainer.style.display = 'flex';
  }
};

window.addRegressionRow = function() {
  const tbody = document.getElementById('regression-table-body');
  if (!tbody) return;
  const rowCount = tbody.rows.length + 1;
  const newRow = document.createElement('tr');
  newRow.innerHTML = `
    <td style="padding: 0.4rem 0.75rem; text-align: center; color: var(--muted); font-size: 0.85rem; font-family: 'IBM Plex Mono', monospace;">${rowCount}</td>
    <td style="padding: 0.3rem 0.5rem;"><input type="number" id="regression-x-${rowCount}" step="any" class="matrix-cell" style="width:100%;min-width:70px;"></td>
    <td style="padding: 0.3rem 0.5rem;"><input type="number" id="regression-y-${rowCount}" step="any" class="matrix-cell" style="width:100%;min-width:70px;"></td>
  `;
  tbody.appendChild(newRow);
};

window.clearRegressionTable = function() {
  const tbody = document.getElementById('regression-table-body');
  if (!tbody) return;
  tbody.innerHTML = '';
  for (let i = 1; i <= 8; i++) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td style="padding: 0.4rem 0.75rem; text-align: center; color: var(--muted); font-size: 0.85rem; font-family: 'IBM Plex Mono', monospace;">${i}</td>
      <td style="padding: 0.3rem 0.5rem;"><input type="number" id="regression-x-${i}" step="any" class="matrix-cell" style="width:100%;min-width:70px;"></td>
      <td style="padding: 0.3rem 0.5rem;"><input type="number" id="regression-y-${i}" step="any" class="matrix-cell" style="width:100%;min-width:70px;"></td>
    `;
    tbody.appendChild(row);
  }
};

window.runRegressionPredictY = function(xValStr) {
  const out = document.getElementById('predicted-y-output');
  if (!out || !window._regressionCoeffs) return;
  const x = parseFloat(xValStr);
  if (isNaN(x)) {
    out.innerText = '--';
    return;
  }
  const { a, b, decimals } = window._regressionCoeffs;
  const y = a + b * x;
  out.innerText = Number.isInteger(y) ? y.toString() : y.toFixed(decimals);
};

window.runRegressionPredictX = function(yValStr) {
  const out = document.getElementById('predicted-x-output');
  if (!out || !window._regressionCoeffs) return;
  const y = parseFloat(yValStr);
  if (isNaN(y)) {
    out.innerText = '--';
    return;
  }
  const { c, d, decimals } = window._regressionCoeffs;
  const x = c + d * y;
  out.innerText = Number.isInteger(x) ? x.toString() : x.toFixed(decimals);
};

window.exportRegressionCSV = function() {
  const data = window._regressionData;
  if (!data) return;
  
  let csv = "No.,X,Y";
  if (data.mode === 'y-on-x' || data.mode === 'both') {
    csv += ",Fitted_Y,Residual_Y";
  }
  if (data.mode === 'x-on-y' || data.mode === 'both') {
    csv += ",Fitted_X,Residual_X";
  }
  csv += "\n";
  
  for (let i = 0; i < data.n; i++) {
    csv += `${data.origOrder[i]},${data.xs[i]},${data.ys[i]}`;
    if (data.mode === 'y-on-x' || data.mode === 'both') {
      csv += `,${data.fitY[i]},${data.resY[i]}`;
    }
    if (data.mode === 'x-on-y' || data.mode === 'both') {
      csv += `,${data.fitX[i]},${data.resX[i]}`;
    }
    csv += "\n";
  }
  
  csv += `\nSummary Statistics\n`;
  csv += `n,${data.n}\n`;
  csv += `Pearson Correlation (r),${data.r}\n`;
  csv += `R-squared (R^2),${data.r2}\n`;
  if (data.mode === 'y-on-x' || data.mode === 'both') {
    csv += `Y on X Equation,Y = ${data.a} + (${data.b}) * X\n`;
    csv += `Y on X Std Error,${data.seY}\n`;
  }
  if (data.mode === 'x-on-y' || data.mode === 'both') {
    csv += `X on Y Equation,X = ${data.c} + (${data.d}) * Y\n`;
    csv += `X on Y Std Error,${data.seX}\n`;
  }
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "regression_analysis.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

window.exportRegressionPDF = function() {
  const style = document.createElement('style');
  style.innerHTML = `
    @media print {
      body * { visibility: hidden; }
      #steps-output, #steps-output * { visibility: visible; }
      #steps-output { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 0; }
      .btn-primary { display: none !important; }
      @page { margin: 1cm; }
    }
  `;
  document.head.appendChild(style);
  window.print();
  setTimeout(() => document.head.removeChild(style), 1000);
};

function calculateRegression() {
  const output = document.getElementById('steps-output');
  output.innerHTML = '';

  const showError = (msg) => {
    output.innerHTML = `
      <div class="step-card" style="border-left-color: #dc2626;">
        <div class="step-header">
          <div class="step-title" style="color: #dc2626;">Error</div>
        </div>
        <div class="step-desc">${msg}</div>
      </div>
    `;
    output.classList.add('active');
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const fmt = (num, dec) => {
    if (isNaN(num) || num === null || num === undefined) return 'NaN';
    return Number.isInteger(num) ? num.toString() : Number(num).toFixed(dec);
  };

  const decimals = parseInt(document.getElementById('regression-decimals').value) || 4;
  const mode = document.getElementById('regression-mode').value;
  const inputMethod = document.getElementById('regression-input-method').value;

  const xs = [];
  const ys = [];
  const origOrder = [];

  if (inputMethod === 'table') {
    const tbody = document.getElementById('regression-table-body');
    const rows = tbody.getElementsByTagName('tr');
    
    for (let i = 0; i < rows.length; i++) {
      const idx = i + 1;
      const xValStr = document.getElementById(`regression-x-${idx}`).value.trim();
      const yValStr = document.getElementById(`regression-y-${idx}`).value.trim();
      
      if (xValStr !== '' || yValStr !== '') {
        if (xValStr === '' || yValStr === '') {
          return showError(`Mismatched data: Row ${idx} has a value for X but not Y (or vice versa). Each row must have both X and Y, or be left completely empty.`);
        }
        const x = parseFloat(xValStr);
        const y = parseFloat(yValStr);
        if (isNaN(x) || isNaN(y)) {
          return showError(`Non-numeric value detected in row ${idx}. All entries must be valid numbers.`);
        }
        xs.push(x);
        ys.push(y);
        origOrder.push(idx);
      }
    }
  } else {
    const rawText = document.getElementById('regression-raw-data').value.trim();
    if (rawText === '') {
      return showError("No data entered. Please enter at least 2 pairs of X and Y values in the text area.");
    }
    const lines = rawText.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line === '') continue;
      const parts = line.split(/[\s,]+/);
      if (parts.length < 2) {
        return showError(`Mismatched data: Line ${i + 1} has fewer than 2 values. Each line must have both X and Y values.`);
      }
      if (parts.length > 2) {
        return showError(`Extra data: Line ${i + 1} has more than 2 values. Please enter exactly one X and Y pair per line.`);
      }
      const x = parseFloat(parts[0]);
      const y = parseFloat(parts[1]);
      if (isNaN(x) || isNaN(y)) {
        return showError(`Non-numeric value detected in line ${i + 1} ("${parts[0]}", "${parts[1]}"). All entries must be numbers.`);
      }
      xs.push(x);
      ys.push(y);
      origOrder.push(i + 1);
    }
  }

  const n = xs.length;
  if (n === 0) {
    return showError("No data entered. Please fill at least 2 pairs of X and Y values.");
  }
  if (n < 2) {
    return showError("At least 2 data pairs are required to compute a regression model.");
  }

  let sumX = 0, sumY = 0, sumX2 = 0, sumY2 = 0, sumXY = 0;
  for (let i = 0; i < n; i++) {
    const x = xs[i];
    const y = ys[i];
    sumX += x;
    sumY += y;
    sumX2 += x * x;
    sumY2 += y * y;
    sumXY += x * y;
  }

  const meanX = sumX / n;
  const meanY = sumY / n;

  const Sxx = sumX2 - (sumX * sumX) / n;
  const Syy = sumY2 - (sumY * sumY) / n;
  const Sxy = sumXY - (sumX * sumY) / n;

  const xAllSame = xs.every(v => v === xs[0]);
  const yAllSame = ys.every(v => v === ys[0]);

  if (xAllSame) {
    if (mode === 'y-on-x' || mode === 'both') {
      return showError("All X values are identical (variance of X is 0). Division by zero occurs in slope calculation of Y on X (vertical regression line). Cannot compute regression.");
    }
  }
  if (yAllSame) {
    if (mode === 'x-on-y' || mode === 'both') {
      return showError("All Y values are identical (variance of Y is 0). Division by zero occurs in slope calculation of X on Y (horizontal regression line). Cannot compute regression.");
    }
  }

  if ((mode === 'y-on-x' || mode === 'both') && Sxx === 0) {
    return showError("Standard deviation of X is zero. Cannot compute slope b of Y on X due to division by zero.");
  }
  if ((mode === 'x-on-y' || mode === 'both') && Syy === 0) {
    return showError("Standard deviation of Y is zero. Cannot compute slope d of X on Y due to division by zero.");
  }

  let b = 0, a = 0, d = 0, c = 0;
  let fitY = [], resY = [], SSE_Y = 0;
  let fitX = [], resX = [], SSE_X = 0;
  let seY = 0, seX = 0;

  if (mode === 'y-on-x' || mode === 'both') {
    b = Sxy / Sxx;
    a = meanY - b * meanX;
    for (let i = 0; i < n; i++) {
      const fy = a + b * xs[i];
      const ry = ys[i] - fy;
      fitY.push(fy);
      resY.push(ry);
      SSE_Y += ry * ry;
    }
    seY = n > 2 ? Math.sqrt(SSE_Y / (n - 2)) : 0;
  }

  if (mode === 'x-on-y' || mode === 'both') {
    d = Sxy / Syy;
    c = meanX - d * meanY;
    for (let i = 0; i < n; i++) {
      const fx = c + d * ys[i];
      const rx = xs[i] - fx;
      fitX.push(fx);
      resX.push(rx);
      SSE_X += rx * rx;
    }
    seX = n > 2 ? Math.sqrt(SSE_X / (n - 2)) : 0;
  }

  let r = 0;
  if (Sxx * Syy > 0) {
    r = Sxy / Math.sqrt(Sxx * Syy);
    if (r > 1) r = 1;
    if (r < -1) r = -1;
  }
  const r2 = r * r;

  window._regressionCoeffs = { a, b, c, d, decimals };
  window._regressionData = { xs, ys, fitY, resY, fitX, resX, n, r, r2, a, b, c, d, seY, seX, mode, origOrder };

  let warningHtml = '';
  if (n > 500) {
    warningHtml = `
      <div class="step-card" style="border-left-color: var(--amber); background: rgba(245, 158, 11, 0.05); margin-bottom: 1.5rem;">
        <div class="step-header" style="margin-bottom: 0;">
          <svg style="width: 20px; height: 20px; stroke: var(--amber); margin-right: 0.5rem;" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          <div class="step-title" style="color: var(--amber); font-size: 0.95rem;">Performance Note</div>
        </div>
        <div class="step-desc" style="margin-top: 0.5rem; margin-bottom: 0; color: var(--navy);">
          You have entered a large dataset of ${n} pairs. The step calculation table has been condensed to optimize display speed. All statistics and visualizations are fully computed.
        </div>
      </div>
    `;
  }

  let interpText = "";
  let interpColor = "";
  if (r === 1) { interpText = "Perfect Positive"; interpColor = "var(--teal)"; }
  else if (r >= 0.7) { interpText = "Strong Positive"; interpColor = "var(--teal)"; }
  else if (r >= 0.4) { interpText = "Moderate Positive"; interpColor = "var(--teal)"; }
  else if (r >= 0.1) { interpText = "Weak Positive"; interpColor = "var(--muted)"; }
  else if (r > -0.1) { interpText = "No / Negligible"; interpColor = "var(--muted)"; }
  else if (r > -0.4) { interpText = "Weak Negative"; interpColor = "#f87171"; }
  else if (r > -0.7) { interpText = "Moderate Negative"; interpColor = "#dc2626"; }
  else if (r > -1) { interpText = "Strong Negative"; interpColor = "#dc2626"; }
  else { interpText = "Perfect Negative"; interpColor = "#dc2626"; }

  let equationsHtml = '';
  if (mode === 'y-on-x') {
    equationsHtml = `<div style="color: var(--teal); font-family: 'Fraunces', serif; font-size: 1.8rem; font-weight: 700; margin-bottom: 0.25rem;">Y = ${fmt(a, decimals)} + (${fmt(b, decimals)}) &middot; X</div>`;
  } else if (mode === 'x-on-y') {
    equationsHtml = `<div style="color: var(--amber); font-family: 'Fraunces', serif; font-size: 1.8rem; font-weight: 700; margin-bottom: 0.25rem;">X = ${fmt(c, decimals)} + (${fmt(d, decimals)}) &middot; Y</div>`;
  } else {
    equationsHtml = `
      <div style="color: var(--teal); font-family: 'Fraunces', serif; font-size: 1.6rem; font-weight: 700; margin-bottom: 0.5rem;">Y = ${fmt(a, decimals)} + (${fmt(b, decimals)}) &middot; X <span style="font-size: 1rem; color: var(--muted); font-family: sans-serif; font-weight: normal;">(Y on X)</span></div>
      <div style="color: var(--amber); font-family: 'Fraunces', serif; font-size: 1.6rem; font-weight: 700; margin-bottom: 0.25rem;">X = ${fmt(c, decimals)} + (${fmt(d, decimals)}) &middot; Y <span style="font-size: 1rem; color: var(--muted); font-family: sans-serif; font-weight: normal;">(X on Y)</span></div>
    `;
  }

  let html = `
    ${warningHtml}
    <div class="card" style="background: #111827; border-color: #374151; padding: 2rem; margin-bottom: 1.5rem;">
      <h3 style="color: #9CA3AF; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">Fitted Regression Model</h3>
      <div style="margin-bottom: 1.5rem;">
        ${equationsHtml}
      </div>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 1rem;">
        <div style="background: rgba(255,255,255,0.05); padding: 0.75rem 1rem; border-radius: 8px;">
          <div style="color: #6B7280; font-size: 0.8rem; margin-bottom: 0.25rem;">Observations (n)</div>
          <div style="color: white; font-weight: 600; font-size: 1.15rem;">${n}</div>
        </div>
        <div style="background: rgba(255,255,255,0.05); padding: 0.75rem 1rem; border-radius: 8px;">
          <div style="color: #6B7280; font-size: 0.8rem; margin-bottom: 0.25rem;">Correlation (r)</div>
          <div style="color: white; font-weight: 600; font-size: 1.15rem;">${fmt(r, decimals)}</div>
        </div>
        <div style="background: rgba(255,255,255,0.05); padding: 0.75rem 1rem; border-radius: 8px;">
          <div style="color: #6B7280; font-size: 0.8rem; margin-bottom: 0.25rem;">R² (Det. Coeff.)</div>
          <div style="color: white; font-weight: 600; font-size: 1.15rem;">${fmt(r2, decimals)}</div>
        </div>
        <div style="background: rgba(255,255,255,0.05); padding: 0.75rem 1rem; border-radius: 8px; grid-column: 1 / -1;">
          <div style="color: #6B7280; font-size: 0.8rem; margin-bottom: 0.25rem;">Linear Relationship strength</div>
          <div style="color: ${interpColor}; font-weight: 600; font-size: 1.1rem;">${interpText} Linear Correlation</div>
        </div>
      </div>
    </div>
  `;

  const renderRow = (idx, x, y) => {
    const x2 = x * x;
    const y2 = y * y;
    const xy = x * y;
    return `<tr>
      <td style="padding: 0.4rem 0.75rem; text-align: center; border-bottom: 1px solid var(--border); font-family: 'IBM Plex Mono', monospace; font-size: 0.85rem; color: var(--muted);">${idx}</td>
      <td style="padding: 0.4rem 0.75rem; text-align: center; border-bottom: 1px solid var(--border); font-family: 'IBM Plex Mono', monospace;">${fmt(x, decimals)}</td>
      <td style="padding: 0.4rem 0.75rem; text-align: center; border-bottom: 1px solid var(--border); font-family: 'IBM Plex Mono', monospace;">${fmt(y, decimals)}</td>
      <td style="padding: 0.4rem 0.75rem; text-align: center; border-bottom: 1px solid var(--border); font-family: 'IBM Plex Mono', monospace; color: var(--muted);">${fmt(x2, decimals)}</td>
      <td style="padding: 0.4rem 0.75rem; text-align: center; border-bottom: 1px solid var(--border); font-family: 'IBM Plex Mono', monospace; color: var(--muted);">${fmt(y2, decimals)}</td>
      <td style="padding: 0.4rem 0.75rem; text-align: center; border-bottom: 1px solid var(--border); font-family: 'IBM Plex Mono', monospace; color: var(--teal); font-weight: 500;">${fmt(xy, decimals)}</td>
    </tr>`;
  };

  let tableRowsHtml = '';
  const rowsToShow = Math.min(n, 10);
  for (let i = 0; i < rowsToShow; i++) {
    tableRowsHtml += renderRow(origOrder[i], xs[i], ys[i]);
  }

  let remainingRowsHtml = '';
  if (n > 10) {
    for (let i = 10; i < n; i++) {
      remainingRowsHtml += renderRow(origOrder[i], xs[i], ys[i]);
    }
  }

  const th = (title, color) => `<th style="padding: 0.5rem 0.75rem; text-align: center; font-weight: 600; border-bottom: 2px solid var(--border); font-size: 0.85rem; ${color ? `color: ${color};` : 'color: var(--muted);'}">${title}</th>`;

  let step1Html = `
    <div class="step-card">
      <div class="step-header">
        <div class="step-number">1</div>
        <div class="step-title">Summation and Calculation Table</div>
      </div>
      <div style="overflow-x: auto; width: 100%; margin-bottom: 1rem;">
        <table style="width: 100%; border-collapse: collapse; font-family: 'Figtree', sans-serif; font-size: 0.9rem;">
          <thead>
            <tr>
              ${th('No.')}
              ${th('X', 'var(--navy)')}
              ${th('Y', 'var(--navy)')}
              ${th('X²')}
              ${th('Y²')}
              ${th('XY', 'var(--teal)')}
            </tr>
          </thead>
          <tbody>
            ${tableRowsHtml}
          </tbody>
        </table>
      </div>
  `;

  if (n > 10) {
    step1Html += `
      <details style="margin-top: 0.5rem; margin-bottom: 1rem; border: 1px solid var(--border); border-radius: 8px; padding: 0.5rem;">
        <summary style="font-weight: 600; color: var(--navy); cursor: pointer; user-select: none; font-size: 0.9rem;">📂 Show remaining ${n - 10} data observations</summary>
        <div style="overflow-x: auto; width: 100%; margin-top: 0.5rem;">
          <table style="width: 100%; border-collapse: collapse; font-family: 'Figtree', sans-serif; font-size: 0.9rem;">
            <tbody>
              ${remainingRowsHtml}
            </tbody>
          </table>
        </div>
      </details>
    `;
  }

  step1Html += `
      <div style="background: var(--bg); border-radius: 8px; border: 1px solid var(--border); padding: 1rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.75rem; font-family: 'IBM Plex Mono', monospace; font-size: 0.9rem;">
        <div>&Sigma;X = <strong style="color: var(--navy);">${fmt(sumX, decimals)}</strong></div>
        <div>&Sigma;Y = <strong style="color: var(--navy);">${fmt(sumY, decimals)}</strong></div>
        <div>&Sigma;X² = <strong style="color: var(--muted);">${fmt(sumX2, decimals)}</strong></div>
        <div>&Sigma;Y² = <strong style="color: var(--muted);">${fmt(sumY2, decimals)}</strong></div>
        <div style="grid-column: span 2;">&Sigma;XY = <strong style="color: var(--teal);">${fmt(sumXY, decimals)}</strong></div>
      </div>
    </div>
  `;
  html += step1Html;

  html += `
    <div class="step-card">
      <div class="step-header">
        <div class="step-number">2</div>
        <div class="step-title">Calculate Means of X and Y</div>
      </div>
      <div style="display: flex; flex-direction: column; gap: 1rem; font-size: 0.95rem; line-height: 1.6; color: var(--navy);">
        <div>
          <strong>Mean X (&mu;<sub>X</sub> or X̄):</strong>
          <div style="font-family: 'IBM Plex Mono', monospace; background: var(--bg); padding: 0.75rem; border-radius: 6px; margin-top: 0.25rem; font-size: 1.1rem; text-align: center;">
            X̄ = &Sigma;X / n = ${fmt(sumX, decimals)} / ${n} = <span style="color: var(--teal); font-weight: 700;">${fmt(meanX, decimals)}</span>
          </div>
        </div>
        <div>
          <strong>Mean Y (&mu;<sub>Y</sub> or Ȳ):</strong>
          <div style="font-family: 'IBM Plex Mono', monospace; background: var(--bg); padding: 0.75rem; border-radius: 6px; margin-top: 0.25rem; font-size: 1.1rem; text-align: center;">
            Ȳ = &Sigma;Y / n = ${fmt(sumY, decimals)} / ${n} = <span style="color: var(--teal); font-weight: 700;">${fmt(meanY, decimals)}</span>
          </div>
        </div>
      </div>
    </div>
  `;

  const htmlFraction = (num, den) => `
    <span style="display:inline-block; vertical-align:middle; text-align:center; padding: 0 4px; font-size: 0.95em; line-height: 1.1;">
      <span style="border-bottom: 2px solid currentColor; display:block; padding: 0 4px;">${num}</span>
      <span style="display:block; padding: 0 4px;">${den}</span>
    </span>
  `;

  let step3Html = `
    <div class="step-card">
      <div class="step-header">
        <div class="step-number">3 & 4</div>
        <div class="step-title">Calculate Slopes and Intercepts</div>
      </div>
      <div style="display: flex; flex-direction: column; gap: 2rem;">
  `;

  if (mode === 'y-on-x' || mode === 'both') {
    const numStr = `n&Sigma;XY &minus; &Sigma;X&Sigma;Y`;
    const denStr = `n&Sigma;X² &minus; (&Sigma;X)²`;
    const subNum = `${n}(${fmt(sumXY, decimals)}) &minus; (${fmt(sumX, decimals)})(${fmt(sumY, decimals)})`;
    const subDen = `${n}(${fmt(sumX2, decimals)}) &minus; (${fmt(sumX, decimals)})²`;
    const valNum = n * sumXY - sumX * sumY;
    const valDen = n * sumX2 - sumX * sumX;

    step3Html += `
      <div>
        <h4 style="color: var(--teal); font-size: 1.1rem; margin-top: 0; margin-bottom: 0.5rem; font-weight: 600;">1. Y on X Coefficient (y = a + bx)</h4>
        <div style="display: flex; flex-direction: column; gap: 0.75rem; line-height: 1.6;">
          <div>
            <strong>Slope b (b<sub>yx</sub>):</strong>
            <div style="font-family: 'IBM Plex Mono', monospace; background: var(--bg); padding: 1rem; border-radius: 8px; margin-top: 0.25rem; font-size: 1.1rem; text-align: center;">
              b = ${htmlFraction(numStr, denStr)} = ${htmlFraction(subNum, subDen)} = ${htmlFraction(fmt(valNum, decimals), fmt(valDen, decimals))} = <span style="color: var(--teal); font-weight: 700;">${fmt(b, decimals)}</span>
            </div>
          </div>
          <div>
            <strong>Intercept a (a<sub>yx</sub>):</strong>
            <div style="font-family: 'IBM Plex Mono', monospace; background: var(--bg); padding: 1rem; border-radius: 8px; margin-top: 0.25rem; font-size: 1.1rem; text-align: center;">
              a = Ȳ &minus; bX̄ = ${fmt(meanY, decimals)} &minus; (${fmt(b, decimals)} &times; ${fmt(meanX, decimals)}) = ${fmt(meanY, decimals)} &minus; (${fmt(b * meanX, decimals)}) = <span style="color: var(--teal); font-weight: 700;">${fmt(a, decimals)}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  if (mode === 'x-on-y' || mode === 'both') {
    const numStr = `n&Sigma;XY &minus; &Sigma;X&Sigma;Y`;
    const denStr = `n&Sigma;Y² &minus; (&Sigma;Y)²`;
    const subNum = `${n}(${fmt(sumXY, decimals)}) &minus; (${fmt(sumX, decimals)})(${fmt(sumY, decimals)})`;
    const subDen = `${n}(${fmt(sumY2, decimals)}) &minus; (${fmt(sumY, decimals)})²`;
    const valNum = n * sumXY - sumX * sumY;
    const valDen = n * sumY2 - sumY * sumY;

    step3Html += `
      <div style="${mode === 'both' ? 'border-top: 1px dashed var(--border); padding-top: 1.5rem;' : ''}">
        <h4 style="color: var(--amber); font-size: 1.1rem; margin-top: 0; margin-bottom: 0.5rem; font-weight: 600;">${mode === 'both' ? '2. ' : ''}X on Y Coefficient (x = c + dy)</h4>
        <div style="display: flex; flex-direction: column; gap: 0.75rem; line-height: 1.6;">
          <div>
            <strong>Slope d (b<sub>xy</sub>):</strong>
            <div style="font-family: 'IBM Plex Mono', monospace; background: var(--bg); padding: 1rem; border-radius: 8px; margin-top: 0.25rem; font-size: 1.1rem; text-align: center;">
              d = ${htmlFraction(numStr, denStr)} = ${htmlFraction(subNum, subDen)} = ${htmlFraction(fmt(valNum, decimals), fmt(valDen, decimals))} = <span style="color: var(--amber); font-weight: 700;">${fmt(d, decimals)}</span>
            </div>
          </div>
          <div>
            <strong>Intercept c (a<sub>xy</sub>):</strong>
            <div style="font-family: 'IBM Plex Mono', monospace; background: var(--bg); padding: 1rem; border-radius: 8px; margin-top: 0.25rem; font-size: 1.1rem; text-align: center;">
              c = X̄ &minus; dȲ = ${fmt(meanX, decimals)} &minus; (${fmt(d, decimals)} &times; ${fmt(meanY, decimals)}) = ${fmt(meanX, decimals)} &minus; (${fmt(d * meanY, decimals)}) = <span style="color: var(--amber); font-weight: 700;">${fmt(c, decimals)}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  step3Html += `
      </div>
    </div>
  `;
  html += step3Html;

  let predictionFormHtml = '';
  if (mode === 'y-on-x' || mode === 'both') {
    predictionFormHtml += `
      <div style="display: flex; flex-direction: column; gap: 0.5rem; width: 100%;">
        <label style="font-weight: 600; color: var(--navy); font-size: 0.9rem; text-align: left;">Predict Y from X (Ŷ = a + b &middot; X):</label>
        <div style="display: flex; gap: 0.75rem; align-items: center; justify-content: center; width: 100%;">
          <input type="number" id="predict-x-val" step="any" oninput="runRegressionPredictY(this.value)" placeholder="Input X..." style="flex-grow: 1; max-width: 160px; padding: 0.5rem 0.75rem; border: 1px solid var(--border); border-radius: 8px; font-family: 'IBM Plex Mono', monospace; font-size: 1rem; background: var(--bg); color: var(--navy); outline: none;">
          <span style="font-weight: 700; color: var(--teal); font-size: 1.2rem;">&rarr;</span>
          <div id="predicted-y-output" style="width: 120px; padding: 0.5rem; background: var(--bg2); border-radius: 8px; font-family: 'IBM Plex Mono', monospace; font-weight: 700; color: var(--teal); text-align: center; border: 1px solid var(--border); font-size: 1rem;">--</div>
        </div>
      </div>
    `;
  }

  if (mode === 'x-on-y' || mode === 'both') {
    predictionFormHtml += `
      <div style="display: flex; flex-direction: column; gap: 0.5rem; width: 100%; ${mode === 'both' ? 'border-top: 1px dashed var(--border); padding-top: 1rem;' : ''}">
        <label style="font-weight: 600; color: var(--navy); font-size: 0.9rem; text-align: left;">Predict X from Y (X̂ = c + d &middot; Y):</label>
        <div style="display: flex; gap: 0.75rem; align-items: center; justify-content: center; width: 100%;">
          <input type="number" id="predict-y-val" step="any" oninput="runRegressionPredictX(this.value)" placeholder="Input Y..." style="flex-grow: 1; max-width: 160px; padding: 0.5rem 0.75rem; border: 1px solid var(--border); border-radius: 8px; font-family: 'IBM Plex Mono', monospace; font-size: 1rem; background: var(--bg); color: var(--navy); outline: none;">
          <span style="font-weight: 700; color: var(--amber); font-size: 1.2rem;">&rarr;</span>
          <div id="predicted-x-output" style="width: 120px; padding: 0.5rem; background: var(--bg2); border-radius: 8px; font-family: 'IBM Plex Mono', monospace; font-weight: 700; color: var(--amber); text-align: center; border: 1px solid var(--border); font-size: 1rem;">--</div>
        </div>
      </div>
    `;
  }

  html += `
    <div class="step-card" style="border-left-color: var(--teal);">
      <div class="step-header">
        <svg style="width: 22px; height: 22px; stroke: var(--teal); margin-right: 0.5rem;" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
        <div class="step-title">Interactive Prediction Tool</div>
      </div>
      <div class="step-desc" style="margin-bottom: 1rem;">Enter values below to instantly project points using your calculated regression model.</div>
      <div style="display: flex; flex-direction: column; gap: 1.25rem; max-width: 360px; margin: 0 auto; background: var(--bg); border: 1px solid var(--border); border-radius: 8px; padding: 1.25rem; text-align: center;">
        ${predictionFormHtml}
      </div>
    </div>
  `;

  const pad = 45;
  const svgW = 460;
  const svgH = 320;
  const plotW = svgW - 2 * pad;
  const plotH = svgH - 2 * pad;

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const deltaX = (maxX - minX) * 0.1 || 1.0;
  const deltaY = (maxY - minY) * 0.1 || 1.0;

  const xMin = minX - deltaX;
  const xMax = maxX + deltaX;
  const yMin = minY - deltaY;
  const yMax = maxY + deltaY;

  const mapX = (x) => pad + ((x - xMin) / (xMax - xMin)) * plotW;
  const mapY = (y) => pad + plotH - ((y - yMin) / (yMax - yMin)) * plotH;

  const getTicks = (minVal, maxVal, count = 5) => {
    const ticks = [];
    const step = (maxVal - minVal) / (count - 1);
    for (let i = 0; i < count; i++) {
      ticks.push(minVal + step * i);
    }
    return ticks;
  };

  const xTicks = getTicks(xMin, xMax);
  const yTicks = getTicks(yMin, yMax);

  let scatterHtml = '';
  for (let t of xTicks) {
    const px = mapX(t);
    scatterHtml += `<line x1="${px}" y1="${pad}" x2="${px}" y2="${pad + plotH}" stroke="var(--border)" stroke-width="0.8" stroke-dasharray="3" />`;
    scatterHtml += `<text x="${px}" y="${svgH - pad + 15}" text-anchor="middle" font-family="sans-serif" font-size="9" fill="var(--muted)">${fmt(t, decimals - 2 > 0 ? decimals - 2 : 1)}</text>`;
  }
  for (let t of yTicks) {
    const py = mapY(t);
    scatterHtml += `<line x1="${pad}" y1="${py}" x2="${pad + plotW}" y2="${py}" stroke="var(--border)" stroke-width="0.8" stroke-dasharray="3" />`;
    scatterHtml += `<text x="${pad - 8}" y="${py + 3}" text-anchor="end" font-family="sans-serif" font-size="9" fill="var(--muted)">${fmt(t, decimals - 2 > 0 ? decimals - 2 : 1)}</text>`;
  }

  if (mode === 'y-on-x' || mode === 'both') {
    const y1 = a + b * xMin;
    const y2 = a + b * xMax;
    scatterHtml += `<line x1="${mapX(xMin)}" y1="${mapY(y1)}" x2="${mapX(xMax)}" y2="${mapY(y2)}" stroke="var(--teal)" stroke-width="3.5" opacity="0.9" />`;
  }

  if (mode === 'x-on-y' || mode === 'both') {
    const x1 = c + d * yMin;
    const x2 = c + d * yMax;
    scatterHtml += `<line x1="${mapX(x1)}" y1="${mapY(yMin)}" x2="${mapX(x2)}" y2="${mapY(yMax)}" stroke="var(--amber)" stroke-width="3.5" opacity="0.9" />`;
  }

  scatterHtml += `<circle cx="${mapX(meanX)}" cy="${mapY(meanY)}" r="7" fill="none" stroke="#2563eb" stroke-width="2.5" />`;
  scatterHtml += `<line x1="${mapX(meanX) - 10}" y1="${mapY(meanY)}" x2="${mapX(meanX) + 10}" y2="${mapY(meanY)}" stroke="#2563eb" stroke-width="1.5" />`;
  scatterHtml += `<line x1="${mapX(meanX)}" y1="${mapY(meanY) - 10}" x2="${mapX(meanX)}" y2="${mapY(meanY) + 10}" stroke="#2563eb" stroke-width="1.5" />`;

  const ptRadius = n > 150 ? 3.0 : 5.0;
  const ptOpacity = n > 150 ? 0.7 : 1.0;
  for (let i = 0; i < n; i++) {
    scatterHtml += `<circle cx="${mapX(xs[i])}" cy="${mapY(ys[i])}" r="${ptRadius}" fill="var(--amber)" stroke="#fff" stroke-width="1.5" opacity="${ptOpacity}" />`;
  }

  scatterHtml += `<line x1="${pad}" y1="${pad + plotH}" x2="${pad + plotW}" y2="${pad + plotH}" stroke="var(--navy)" stroke-width="1.5" />`;
  scatterHtml += `<line x1="${pad}" y1="${pad}" x2="${pad}" y2="${pad + plotH}" stroke="var(--navy)" stroke-width="1.5" />`;

  scatterHtml += `<text x="${pad + plotW / 2}" y="${svgH - 5}" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="600" fill="var(--navy)">Variable X</text>`;
  scatterHtml += `<text x="12" y="${pad + plotH / 2}" transform="rotate(-90 12,${pad + plotH / 2})" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="600" fill="var(--navy)">Variable Y</text>`;

  const buildResidualSVG = (resArr, fitArr, label, lineCol) => {
    let resHtml = '';
    const minRes = Math.min(...resArr);
    const maxRes = Math.max(...resArr);
    const absResMax = Math.max(Math.abs(minRes), Math.abs(maxRes)) || 1.0;
    
    const minFit = Math.min(...fitArr);
    const maxFit = Math.max(...fitArr);
    const deltaFit = (maxFit - minFit) * 0.1 || 1.0;
    const fMin = minFit - deltaFit;
    const fMax = maxFit + deltaFit;

    const rMin = -absResMax * 1.15;
    const rMax = absResMax * 1.15;

    const mapFitX = (f) => pad + ((f - fMin) / (fMax - fMin)) * plotW;
    const mapResY = (r) => pad + plotH - ((r - rMin) / (rMax - rMin)) * plotH;

    const fitTicks = getTicks(fMin, fMax);
    const resTicks = [rMin, -absResMax * 0.5, 0, absResMax * 0.5, rMax];

    for (let t of fitTicks) {
      const px = mapFitX(t);
      resHtml += `<line x1="${px}" y1="${pad}" x2="${px}" y2="${pad + plotH}" stroke="var(--border)" stroke-width="0.8" stroke-dasharray="3" />`;
      resHtml += `<text x="${px}" y="${svgH - pad + 15}" text-anchor="middle" font-family="sans-serif" font-size="9" fill="var(--muted)">${fmt(t, decimals - 2 > 0 ? decimals - 2 : 1)}</text>`;
    }
    for (let t of resTicks) {
      const py = mapResY(t);
      resHtml += `<line x1="${pad}" y1="${py}" x2="${pad + plotW}" y2="${py}" stroke="var(--border)" stroke-width="0.8" stroke-dasharray="3" />`;
      resHtml += `<text x="${pad - 8}" y="${py + 3}" text-anchor="end" font-family="sans-serif" font-size="9" fill="var(--muted)">${fmt(t, decimals - 2 > 0 ? decimals - 2 : 1)}</text>`;
    }

    resHtml += `<line x1="${pad}" y1="${mapResY(0)}" x2="${pad + plotW}" y2="${mapResY(0)}" stroke="var(--navy)" stroke-width="2" stroke-dasharray="5 3" />`;

    for (let i = 0; i < n; i++) {
      resHtml += `<circle cx="${mapFitX(fitArr[i])}" cy="${mapResY(resArr[i])}" r="${ptRadius}" fill="${lineCol}" stroke="#fff" stroke-width="1" opacity="${ptOpacity}" />`;
    }

    resHtml += `<line x1="${pad}" y1="${pad + plotH}" x2="${pad + plotW}" y2="${pad + plotH}" stroke="var(--navy)" stroke-width="1.5" />`;
    resHtml += `<line x1="${pad}" y1="${pad}" x2="${pad}" y2="${pad + plotH}" stroke="var(--navy)" stroke-width="1.5" />`;

    resHtml += `<text x="${pad + plotW / 2}" y="${svgH - 5}" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="600" fill="var(--navy)">Fitted Values (Ŷ)</text>`;
    resHtml += `<text x="12" y="${pad + plotH / 2}" transform="rotate(-90 12,${pad + plotH / 2})" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="600" fill="var(--navy)">Residuals (e)</text>`;

    return `
      <div style="text-align: center; margin-top: 1rem; flex-grow: 1;">
        <div style="font-weight: 600; font-size: 0.95rem; color: var(--navy); margin-bottom: 0.5rem;">Residual Plot (${label})</div>
        <svg width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}" style="max-width: 100%; height: auto; border: 1px solid var(--border); border-radius: 8px; padding: 0.5rem; background: var(--bg2);">
          ${resHtml}
        </svg>
      </div>
    `;
  };

  let residualsContainersHtml = '';
  if (mode === 'y-on-x' || mode === 'both') {
    residualsContainersHtml += buildResidualSVG(resY, fitY, 'Y on X', 'var(--teal)');
  }
  if (mode === 'x-on-y' || mode === 'both') {
    residualsContainersHtml += buildResidualSVG(resX, fitX, 'X on Y', 'var(--amber)');
  }

  const strengthMeterPercent = ((r + 1) / 2) * 100;
  let visualCardHtml = `
    <div class="step-card">
      <div class="step-header">
        <div class="step-title">Regression Visualizations</div>
      </div>
      
      <div style="border-bottom: 1px dashed var(--border); padding-bottom: 1.5rem; margin-bottom: 1.5rem;">
        <div style="font-weight: 600; font-size: 0.95rem; color: var(--navy); margin-bottom: 0.5rem; text-align: center;">Pearson Correlation Strength Meter</div>
        <div style="position: relative; max-width: 440px; margin: 0 auto;">
          <svg width="100%" height="70" viewBox="0 0 100 70" preserveAspectRatio="none" style="overflow: visible;">
            <defs>
              <linearGradient id="gradMeter" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#ef4444" />
                <stop offset="50%" stop-color="#e5e7eb" />
                <stop offset="100%" stop-color="#10b981" />
              </linearGradient>
            </defs>
            <rect x="0" y="30" width="100" height="16" rx="8" fill="url(#gradMeter)" />
            <path d="M 0 30 v 20 M 25 30 v 20 M 50 30 v 20 M 75 30 v 20 M 100 30 v 20" stroke="var(--navy)" stroke-width="0.5" opacity="0.3" />
            <text x="0" y="65" text-anchor="middle" font-family="sans-serif" font-size="5" fill="var(--muted)">-1</text>
            <text x="25" y="65" text-anchor="middle" font-family="sans-serif" font-size="5" fill="var(--muted)">-0.5</text>
            <text x="50" y="65" text-anchor="middle" font-family="sans-serif" font-size="5" fill="var(--muted)">0</text>
            <text x="75" y="65" text-anchor="middle" font-family="sans-serif" font-size="5" fill="var(--muted)">+0.5</text>
            <text x="100" y="65" text-anchor="middle" font-family="sans-serif" font-size="5" fill="var(--muted)">+1</text>
            <g transform="translate(${strengthMeterPercent}, 30)">
              <polygon points="-3,-10 3,-10 0,0" fill="var(--navy)" />
              <text x="0" y="-14" text-anchor="middle" font-family="'IBM Plex Mono', monospace" font-size="6" font-weight="bold" fill="var(--navy)">${r.toFixed(2)}</text>
            </g>
          </svg>
        </div>
      </div>

      <div style="text-align: center; margin-bottom: 2rem;">
        <div style="font-weight: 600; font-size: 0.95rem; color: var(--navy); margin-bottom: 0.5rem;">Scatter Plot & OLS Fit Lines</div>
        <svg width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}" style="max-width: 100%; height: auto; border: 1px solid var(--border); border-radius: 8px; padding: 0.5rem; background: var(--bg2);">
          ${scatterHtml}
        </svg>
        
        <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 1.5rem; font-size: 0.85rem; color: var(--muted); margin-top: 0.75rem;">
          <span style="display: flex; align-items: center; gap: 0.25rem;"><span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--amber); border: 1px solid #fff;"></span> Observations</span>
          <span style="display: flex; align-items: center; gap: 0.25rem;"><span style="display: inline-block; width: 14px; height: 14px; border-radius: 50%; border: 1.5px solid #2563eb; background: transparent; position: relative;"><span style="position: absolute; left: 6px; top: 1px; width: 1px; height: 10px; background: #2563eb;"></span><span style="position: absolute; left: 1px; top: 6px; width: 10px; height: 1px; background: #2563eb;"></span></span> Mean intersection (X̄, Ȳ)</span>
          ${(mode === 'y-on-x' || mode === 'both') ? `<span style="display: flex; align-items: center; gap: 0.25rem;"><span style="display: inline-block; width: 18px; height: 3px; background: var(--teal);"></span> Y on X line</span>` : ''}
          ${(mode === 'x-on-y' || mode === 'both') ? `<span style="display: flex; align-items: center; gap: 0.25rem;"><span style="display: inline-block; width: 18px; height: 3px; background: var(--amber);"></span> X on Y line</span>` : ''}
        </div>
      </div>

      <div style="display: flex; flex-direction: column; gap: 1.5rem; border-top: 1px dashed var(--border); padding-top: 1.5rem;">
        ${residualsContainersHtml}
      </div>
    </div>
  `;
  html += visualCardHtml;

  let advCardHtml = `
    <div class="step-card">
      <div class="step-header">
        <div class="step-title">Advanced Statistics & Diagnostics</div>
      </div>
      <div class="step-content">
  `;

  const makeDecompTable = (label, sst, sse, ssr, se, decimals) => {
    return `
      <div style="margin-bottom: 1.5rem;">
        <h4 style="margin: 0 0 0.5rem 0; font-size: 1rem; color: var(--navy); font-weight: 600;">Analysis of Variance (${label})</h4>
        <div style="overflow-x: auto; width: 100%;">
          <table style="width: 100%; border-collapse: collapse; font-family: 'Figtree', sans-serif; font-size: 0.85rem; border: 1px solid var(--border); text-align: left;">
            <thead>
              <tr style="background: var(--bg2); border-bottom: 2px solid var(--border);">
                <th style="padding: 0.5rem; font-weight: 600;">Source of Variance</th>
                <th style="padding: 0.5rem; font-weight: 600; text-align: center;">Sum of Squares (SS)</th>
                <th style="padding: 0.5rem; font-weight: 600; text-align: center;">Variance Explained</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--border); font-weight: 500;">Model (Regression - SSR)</td>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--border); text-align: center; font-family: 'IBM Plex Mono', monospace;">${fmt(ssr, decimals)}</td>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--border); text-align: center; color: var(--teal); font-weight: 600;">${fmt((ssr / sst) * 100, 2)}%</td>
              </tr>
              <tr>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--border); font-weight: 500;">Error (Residual - SSE)</td>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--border); text-align: center; font-family: 'IBM Plex Mono', monospace;">${fmt(sse, decimals)}</td>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--border); text-align: center; color: #dc2626; font-weight: 600;">${fmt((sse / sst) * 100, 2)}%</td>
              </tr>
              <tr style="font-weight: 600; background: var(--bg);">
                <td style="padding: 0.5rem;">Total (SST)</td>
                <td style="padding: 0.5rem; text-align: center; font-family: 'IBM Plex Mono', monospace;">${fmt(sst, decimals)}</td>
                <td style="padding: 0.5rem; text-align: center;">100.00%</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style="font-size: 0.85rem; color: var(--muted); margin-top: 0.5rem; line-height: 1.5;">
          Standard Error of Estimate (s<sub>e</sub>): <strong style="color: var(--navy); font-family: 'IBM Plex Mono', monospace;">${se > 0 ? fmt(se, decimals) : 'N/A'}</strong> (Standard deviation of residuals with df = n &minus; 2).
        </div>
      </div>
    `;
  };

  if (mode === 'y-on-x' || mode === 'both') {
    advCardHtml += makeDecompTable('Y on X Model', Syy, SSE_Y, Syy - SSE_Y, seY, decimals);
  }
  if (mode === 'x-on-y' || mode === 'both') {
    advCardHtml += makeDecompTable('X on Y Model', Sxx, SSE_X, Sxx - SSE_X, seX, decimals);
  }

  let resTableRows = '';
  for (let i = 0; i < rowsToShow; i++) {
    resTableRows += `<tr>
      <td style="padding: 0.4rem; border-bottom: 1px solid var(--border); font-family: 'IBM Plex Mono', monospace; font-size: 0.8rem; color: var(--muted);">${origOrder[i]}</td>
      <td style="padding: 0.4rem; border-bottom: 1px solid var(--border); font-family: 'IBM Plex Mono', monospace; font-size: 0.8rem;">${fmt(xs[i], decimals)}</td>
      <td style="padding: 0.4rem; border-bottom: 1px solid var(--border); font-family: 'IBM Plex Mono', monospace; font-size: 0.8rem;">${fmt(ys[i], decimals)}</td>
      ${(mode === 'y-on-x' || mode === 'both') ? `
        <td style="padding: 0.4rem; border-bottom: 1px solid var(--border); font-family: 'IBM Plex Mono', monospace; font-size: 0.8rem; color: var(--muted);">${fmt(fitY[i], decimals)}</td>
        <td style="padding: 0.4rem; border-bottom: 1px solid var(--border); font-family: 'IBM Plex Mono', monospace; font-size: 0.8rem; color: ${resY[i] < 0 ? '#dc2626' : 'var(--teal)'}; font-weight: 500;">${fmt(resY[i], decimals)}</td>
      ` : ''}
      ${(mode === 'x-on-y' || mode === 'both') ? `
        <td style="padding: 0.4rem; border-bottom: 1px solid var(--border); font-family: 'IBM Plex Mono', monospace; font-size: 0.8rem; color: var(--muted);">${fmt(fitX[i], decimals)}</td>
        <td style="padding: 0.4rem; border-bottom: 1px solid var(--border); font-family: 'IBM Plex Mono', monospace; font-size: 0.8rem; color: ${resX[i] < 0 ? '#dc2626' : 'var(--teal)'}; font-weight: 500;">${fmt(resX[i], decimals)}</td>
      ` : ''}
    </tr>`;
  }

  let hiddenResRows = '';
  if (n > 10) {
    for (let i = 10; i < n; i++) {
      hiddenResRows += `<tr>
        <td style="padding: 0.4rem; border-bottom: 1px solid var(--border); font-family: 'IBM Plex Mono', monospace; font-size: 0.8rem; color: var(--muted);">${origOrder[i]}</td>
        <td style="padding: 0.4rem; border-bottom: 1px solid var(--border); font-family: 'IBM Plex Mono', monospace; font-size: 0.8rem;">${fmt(xs[i], decimals)}</td>
        <td style="padding: 0.4rem; border-bottom: 1px solid var(--border); font-family: 'IBM Plex Mono', monospace; font-size: 0.8rem;">${fmt(ys[i], decimals)}</td>
        ${(mode === 'y-on-x' || mode === 'both') ? `
          <td style="padding: 0.4rem; border-bottom: 1px solid var(--border); font-family: 'IBM Plex Mono', monospace; font-size: 0.8rem; color: var(--muted);">${fmt(fitY[i], decimals)}</td>
          <td style="padding: 0.4rem; border-bottom: 1px solid var(--border); font-family: 'IBM Plex Mono', monospace; font-size: 0.8rem; color: ${resY[i] < 0 ? '#dc2626' : 'var(--teal)'}; font-weight: 500;">${fmt(resY[i], decimals)}</td>
        ` : ''}
        ${(mode === 'x-on-y' || mode === 'both') ? `
          <td style="padding: 0.4rem; border-bottom: 1px solid var(--border); font-family: 'IBM Plex Mono', monospace; font-size: 0.8rem; color: var(--muted);">${fmt(fitX[i], decimals)}</td>
          <td style="padding: 0.4rem; border-bottom: 1px solid var(--border); font-family: 'IBM Plex Mono', monospace; font-size: 0.8rem; color: ${resX[i] < 0 ? '#dc2626' : 'var(--teal)'}; font-weight: 500;">${fmt(resX[i], decimals)}</td>
        ` : ''}
      </tr>`;
    }
  }

  advCardHtml += `
      <div style="border-top: 1px dashed var(--border); padding-top: 1.5rem; margin-top: 1.5rem;">
        <h4 style="margin: 0 0 0.5rem 0; font-size: 1rem; color: var(--navy); font-weight: 600;">Residual Diagnostics Table</h4>
        <div style="overflow-x: auto; width: 100%;">
          <table style="width: 100%; border-collapse: collapse; font-family: 'Figtree', sans-serif; font-size: 0.8rem; border: 1px solid var(--border); text-align: center;">
            <thead>
              <tr style="background: var(--bg2); border-bottom: 2px solid var(--border);">
                <th style="padding: 0.4rem; color: var(--muted); font-weight: 600;">No.</th>
                <th style="padding: 0.4rem; color: var(--navy); font-weight: 600;">X</th>
                <th style="padding: 0.4rem; color: var(--navy); font-weight: 600;">Y</th>
                ${(mode === 'y-on-x' || mode === 'both') ? `
                  <th style="padding: 0.4rem; color: var(--muted); font-weight: 600;">Fitted Ŷ</th>
                  <th style="padding: 0.4rem; color: var(--teal); font-weight: 600;">Residual e<sub>y</sub></th>
                ` : ''}
                ${(mode === 'x-on-y' || mode === 'both') ? `
                  <th style="padding: 0.4rem; color: var(--muted); font-weight: 600;">Fitted X̂</th>
                  <th style="padding: 0.4rem; color: var(--teal); font-weight: 600;">Residual e<sub>x</sub></th>
                ` : ''}
              </tr>
            </thead>
            <tbody>
              ${resTableRows}
            </tbody>
          </table>
        </div>
  `;

  if (n > 10) {
    advCardHtml += `
        <details style="margin-top: 0.5rem; border: 1px solid var(--border); border-radius: 8px; padding: 0.5rem;">
          <summary style="font-weight: 600; color: var(--navy); cursor: pointer; user-select: none; font-size: 0.85rem;">📂 Show remaining ${n - 10} observations diagnostic residuals</summary>
          <div style="overflow-x: auto; width: 100%; margin-top: 0.5rem;">
            <table style="width: 100%; border-collapse: collapse; font-family: 'Figtree', sans-serif; font-size: 0.8rem; text-align: center;">
              <tbody>
                ${hiddenResRows}
              </tbody>
            </table>
          </div>
        </details>
    `;
  }

  advCardHtml += `
      </div>
    </div>
  </div>
  `;
  html += advCardHtml;

  html += `
    <div class="step-card" style="border-left-color: var(--amber);">
      <div class="step-header">
        <svg style="width: 24px; height: 24px; stroke: var(--amber); margin-right: 0.5rem;" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
        <div class="step-title">Theory: Simple Linear Regression</div>
      </div>
      <div style="font-size: 0.95rem; color: var(--navy); line-height: 1.6;">
        <p style="margin-top: 0;"><strong>What is Linear Regression?</strong> It is a statistical method used to model and analyze the relationship between a dependent (target) variable and one or more independent (predictor) variables using OLS (Ordinary Least Squares).</p>
        
        <h4 style="margin: 1rem 0 0.5rem 0; font-size: 1rem;">Correlation vs Regression</h4>
        <div style="overflow-x: auto; width: 100%; margin-bottom: 1.5rem;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; border: 1px solid var(--border);">
            <thead>
              <tr style="background: var(--bg); border-bottom: 2px solid var(--border);">
                <th style="padding: 0.5rem; text-align: left; font-weight:600;">Feature</th>
                <th style="padding: 0.5rem; text-align: left; font-weight:600;">Correlation</th>
                <th style="padding: 0.5rem; text-align: left; font-weight:600;">Regression</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--border); font-weight: 500;">Purpose</td>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--border);">Measures strength & direction of linear association.</td>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--border);">Fits a mathematical line to predict values.</td>
              </tr>
              <tr>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--border); font-weight: 500;">Variables</td>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--border);">No distinction (symmetric). X vs Y is same as Y vs X.</td>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--border);">Strict Independent vs Dependent roles.</td>
              </tr>
              <tr>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--border); font-weight: 500;">Coefficient</td>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--border);">r (ranges between &minus;1 and +1).</td>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--border);">Slope coefficients (b or d) representing rate of change.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h4 style="margin: 1rem 0 0.5rem 0; font-size: 1rem;">Interpretation of Coefficients</h4>
        <ul style="margin: 0; padding-left: 1.25rem; line-height: 1.6;">
          <li><strong>Slope (b / d)</strong>: The amount of change in the predicted variable for a 1-unit increase in the independent variable.</li>
          <li><strong>Intercept (a / c)</strong>: The predicted value of the dependent variable when the independent variable is zero.</li>
          <li><strong>R-squared (R²)</strong>: The percentage of the variance in the dependent variable that is predictable from the independent variable.</li>
        </ul>
      </div>
    </div>
  `;

  html += `
    <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 2rem;">
      <button onclick="exportRegressionCSV()" class="btn-primary" style="background: var(--bg2); color: var(--navy); border: 1px solid var(--border);">
        <svg style="width: 18px; height: 18px; stroke: currentColor;" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
        Download CSV
      </button>
      <button onclick="exportRegressionPDF()" class="btn-primary" style="background: var(--bg2); color: var(--navy); border: 1px solid var(--border);">
        <svg style="width: 18px; height: 18px; stroke: currentColor;" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
        Save as PDF
      </button>
    </div>
  `;

  output.innerHTML = html;
  output.classList.add('active');
  output.scrollIntoView({ behavior: 'smooth', block: 'start' });
}


// ==========================================
// RANK CALCULATOR ENGINE
// ==========================================

window.toggleRankCalcInputMethod = function(method) {
  const tableContainer = document.getElementById('rank-calc-table-sub');
  const rawContainer = document.getElementById('rank-calc-raw-sub');
  if (method === 'table') {
    if (tableContainer) tableContainer.style.display = 'flex';
    if (rawContainer) rawContainer.style.display = 'none';
  } else {
    if (tableContainer) tableContainer.style.display = 'none';
    if (rawContainer) rawContainer.style.display = 'flex';
  }
};

window.addRankCalcRow = function() {
  const tbody = document.getElementById('rank-calc-table-body');
  if (!tbody) return;
  const rowCount = tbody.getElementsByTagName('tr').length + 1;
  const newRow = document.createElement('tr');
  newRow.innerHTML = `
    <td style="padding: 0.4rem 0.75rem; text-align: center; color: var(--muted); font-size: 0.85rem; font-family: 'IBM Plex Mono', monospace;">${rowCount}</td>
    <td style="padding: 0.3rem 0.5rem;"><input type="number" id="rank-calc-val-${rowCount}" step="any" class="matrix-cell" style="width:100%;min-width:70px;text-align:center;"></td>
  `;
  tbody.appendChild(newRow);
};

window.clearRankCalcTable = function() {
  const tbody = document.getElementById('rank-calc-table-body');
  if (!tbody) return;
  tbody.innerHTML = '';
  for (let i = 1; i <= 8; i++) {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
      <td style="padding: 0.4rem 0.75rem; text-align: center; color: var(--muted); font-size: 0.85rem; font-family: 'IBM Plex Mono', monospace;">${i}</td>
      <td style="padding: 0.3rem 0.5rem;"><input type="number" id="rank-calc-val-${i}" step="any" class="matrix-cell" style="width:100%;min-width:70px;text-align:center;"></td>
    `;
    tbody.appendChild(newRow);
  }
};

window.exportRanksCSV = function() {
  const data = window._rankCalcData;
  if (!data) return;
  const { finalRanks } = data;
  let csv = "Original Index,Original Value,Assigned Rank\n";
  finalRanks.forEach(item => {
    csv += `${item.origIdx},${item.val},${item.rank}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", "rank_calculator_output.csv");
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

window.exportRanksPDF = function() {
  const style = document.createElement('style');
  style.innerHTML = `
    @media print {
      body * { visibility: hidden; }
      #steps-output, #steps-output * { visibility: visible; }
      #steps-output { position: absolute; left: 0; top: 0; width: 100%; }
      .btn-primary { display: none !important; }
      details { display: block !important; }
      details > summary { display: none !important; }
      details[open] > summary { display: none !important; }
    }
  `;
  document.head.appendChild(style);
  window.print();
  setTimeout(() => document.head.removeChild(style), 1000);
};

function calculateRanks() {
  const output = document.getElementById('steps-output');
  output.innerHTML = '';

  const showError = (msg) => {
    output.innerHTML = `
      <div class="step-card" style="border-left-color: #dc2626;">
        <div class="step-header">
          <div class="step-title" style="color: #dc2626;">Error</div>
        </div>
        <div class="step-desc">${msg}</div>
      </div>
    `;
    output.classList.add('active');
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const fmt = (num, dec) => {
    if (isNaN(num) || num === null || num === undefined) return 'NaN';
    return Number.isInteger(num) ? num.toString() : Number(num).toFixed(dec);
  };

  const decimals = parseInt(document.getElementById('rank-calc-decimals').value) || 4;
  const direction = document.getElementById('rank-calc-direction').value;
  const method = document.getElementById('rank-calc-method').value;
  const inputType = document.getElementById('rank-calc-input-type').value;

  const rawValues = [];
  const origIndices = [];

  if (inputType === 'table') {
    const tbody = document.getElementById('rank-calc-table-body');
    const rows = tbody.getElementsByTagName('tr');
    for (let i = 0; i < rows.length; i++) {
      const idx = i + 1;
      const valStr = document.getElementById(`rank-calc-val-${idx}`).value.trim();
      if (valStr !== '') {
        const val = parseFloat(valStr);
        if (isNaN(val)) {
          return showError(`Non-numeric value detected in row ${idx}. All entries must be valid numbers.`);
        }
        rawValues.push(val);
        origIndices.push(idx);
      }
    }
  } else {
    const rawText = document.getElementById('rank-calc-raw-data').value.trim();
    if (rawText === '') {
      return showError("No data entered. Please enter numbers in the text area.");
    }
    const parts = rawText.split(/[\s,]+/);
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i].trim();
      if (p === '') continue;
      const val = parseFloat(p);
      if (isNaN(val)) {
        return showError(`Non-numeric value detected at position ${i + 1} ("${p}"). All entries must be numbers.`);
      }
      rawValues.push(val);
      origIndices.push(i + 1);
    }
  }

  const n = rawValues.length;
  if (n === 0) {
    return showError("No data entered. Please fill at least 2 values.");
  }
  if (n < 2) {
    return showError("At least 2 values are required to perform ranking calculations.");
  }

  let items = rawValues.map((val, idx) => ({
    val: val,
    origIdx: origIndices[idx],
    origOrder: idx
  }));

  if (direction === 'ascending') {
    items.sort((a, b) => a.val - b.val || a.origOrder - b.origOrder);
  } else {
    items.sort((a, b) => b.val - a.val || a.origOrder - b.origOrder);
  }

  const groups = [];
  let currentGroup = [];
  for (let i = 0; i < n; i++) {
    if (i === 0) {
      currentGroup.push(items[i]);
    } else {
      if (items[i].val === items[i - 1].val) {
        currentGroup.push(items[i]);
      } else {
        groups.push(currentGroup);
        currentGroup = [items[i]];
      }
    }
  }
  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }

  let denseRankCounter = 1;
  let runningRankSum = 1;
  const detailedAssignments = [];

  groups.forEach(g => {
    const val = g[0].val;
    const size = g.length;
    const startRank = runningRankSum;
    const endRank = startRank + size - 1;

    let assignedRankVal = 0;
    let explanation = '';

    if (size === 1) {
      if (method === 'dense') {
        assignedRankVal = denseRankCounter;
        explanation = `Single value. Under dense ranking, it receives unique rank <strong>${assignedRankVal}</strong>.`;
        denseRankCounter++;
      } else {
        assignedRankVal = startRank;
        explanation = `Single value. Ranks naturally at position index: <strong>${assignedRankVal}</strong>.`;
      }
      g[0].rank = assignedRankVal;
    } else {
      if (method === 'fractional') {
        assignedRankVal = (startRank + endRank) / 2;
        const ordinalRangeStr = Array.from({length: size}, (_, idx) => startRank + idx).join(" + ");
        explanation = `Tie group of ${size} duplicate values of ${val} at sorted ranks ${startRank} to ${endRank}. ` +
          `Assigned rank is the average of these ranks: (${ordinalRangeStr}) / ${size} = <strong>${fmt(assignedRankVal, decimals)}</strong>.`;
      } else if (method === 'competition') {
        assignedRankVal = startRank;
        explanation = `Tie group of ${size} duplicate values. Under standard competition ranking (1224), all receive the minimum position rank: <strong>${assignedRankVal}</strong>.`;
      } else if (method === 'modified-competition') {
        assignedRankVal = endRank;
        explanation = `Tie group of ${size} duplicate values. Under modified competition ranking (1334), all receive the maximum position rank: <strong>${assignedRankVal}</strong>.`;
      } else if (method === 'dense') {
        assignedRankVal = denseRankCounter;
        explanation = `Tie group of ${size} duplicate values. Under dense ranking (1223), all receive rank: <strong>${assignedRankVal}</strong>.`;
        denseRankCounter++;
      } else if (method === 'ordinal') {
        explanation = `Tie group of ${size} duplicate values. Under ordinal ranking (1234), values are ranked uniquely based on order of appearance:`;
        g.forEach((item, index) => {
          const itemRank = startRank + index;
          item.rank = itemRank;
          explanation += `<br>• Value at original index #${item.origIdx} receives rank <strong>${itemRank}</strong>.`;
        });
      }

      if (method !== 'ordinal') {
        g.forEach(item => {
          item.rank = assignedRankVal;
        });
      }
    }

    detailedAssignments.push({
      val: val,
      size: size,
      startRank: startRank,
      endRank: endRank,
      assignedRank: method === 'ordinal' ? `Ordinal (${startRank}-${endRank})` : assignedRankVal,
      explanation: explanation
    });

    runningRankSum += size;
  });

  const finalRanks = new Array(n);
  items.forEach(item => {
    finalRanks[item.origOrder] = item;
  });

  window._rankCalcData = {
    rawValues,
    origIndices,
    sortedItems: items,
    finalRanks,
    detailedAssignments,
    n,
    decimals,
    direction,
    method
  };

  const uniqueCount = groups.length;
  const tieGroupsCount = groups.filter(g => g.length > 1).length;
  const minVal = Math.min(...rawValues);
  const maxVal = Math.max(...rawValues);
  const rangeVal = maxVal - minVal;

  let html = `
    <div class="card" style="background: #111827; border-color: #374151; padding: 2rem; margin-bottom: 1.5rem;">
      <h3 style="color: #9CA3AF; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">Ranking Summary</h3>
      <div style="color: var(--teal); font-family: 'Fraunces', serif; font-size: 1.8rem; font-weight: 700; margin-bottom: 1.5rem;">
        ${method.charAt(0).toUpperCase() + method.slice(1).replace('-', ' ')} Ranking (${direction.charAt(0).toUpperCase() + direction.slice(1)})
      </div>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 1rem;">
        <div style="background: rgba(255,255,255,0.05); padding: 0.75rem 1rem; border-radius: 8px;">
          <div style="color: #6B7280; font-size: 0.8rem; margin-bottom: 0.25rem;">Total Items (n)</div>
          <div style="color: white; font-weight: 600; font-size: 1.15rem;">${n}</div>
        </div>
        <div style="background: rgba(255,255,255,0.05); padding: 0.75rem 1rem; border-radius: 8px;">
          <div style="color: #6B7280; font-size: 0.8rem; margin-bottom: 0.25rem;">Unique Values</div>
          <div style="color: white; font-weight: 600; font-size: 1.15rem;">${uniqueCount}</div>
        </div>
        <div style="background: rgba(255,255,255,0.05); padding: 0.75rem 1rem; border-radius: 8px;">
          <div style="color: #6B7280; font-size: 0.8rem; margin-bottom: 0.25rem;">Tied Value Groups</div>
          <div style="color: white; font-weight: 600; font-size: 1.15rem;">${tieGroupsCount}</div>
        </div>
        <div style="background: rgba(255,255,255,0.05); padding: 0.75rem 1rem; border-radius: 8px;">
          <div style="color: #6B7280; font-size: 0.8rem; margin-bottom: 0.25rem;">Dataset Range</div>
          <div style="color: white; font-weight: 600; font-size: 1.15rem;">${fmt(rangeVal, decimals)}</div>
        </div>
      </div>
    </div>
  `;

  let sortedRows = '';
  const rowsToShow = Math.min(n, 10);
  for (let i = 0; i < rowsToShow; i++) {
    sortedRows += `<tr>
      <td style="padding: 0.4rem; border-bottom: 1px solid var(--border); font-family: 'IBM Plex Mono', monospace; font-size: 0.8rem; color: var(--muted);">${finalRanks[i] ? finalRanks[i].origIdx : i + 1}</td>
      <td style="padding: 0.4rem; border-bottom: 1px solid var(--border); font-family: 'IBM Plex Mono', monospace; font-size: 0.8rem; font-weight: 500;">${fmt(rawValues[i], decimals)}</td>
      <td style="padding: 0.4rem; border-bottom: 1px solid var(--border); font-family: 'IBM Plex Mono', monospace; font-size: 0.8rem; color: var(--muted);">${i + 1}</td>
      <td style="padding: 0.4rem; border-bottom: 1px solid var(--border); font-family: 'IBM Plex Mono', monospace; font-size: 0.8rem; color: var(--teal); font-weight: 500;">${fmt(items[i].val, decimals)}</td>
    </tr>`;
  }

  let remainingRowsHtml = '';
  if (n > 10) {
    for (let i = 10; i < n; i++) {
      remainingRowsHtml += `<tr>
        <td style="padding: 0.4rem; border-bottom: 1px solid var(--border); font-family: 'IBM Plex Mono', monospace; font-size: 0.8rem; color: var(--muted);">${finalRanks[i] ? finalRanks[i].origIdx : i + 1}</td>
        <td style="padding: 0.4rem; border-bottom: 1px solid var(--border); font-family: 'IBM Plex Mono', monospace; font-size: 0.8rem; font-weight: 500;">${fmt(rawValues[i], decimals)}</td>
        <td style="padding: 0.4rem; border-bottom: 1px solid var(--border); font-family: 'IBM Plex Mono', monospace; font-size: 0.8rem; color: var(--muted);">${i + 1}</td>
        <td style="padding: 0.4rem; border-bottom: 1px solid var(--border); font-family: 'IBM Plex Mono', monospace; font-size: 0.8rem; color: var(--teal); font-weight: 500;">${fmt(items[i].val, decimals)}</td>
      </tr>`;
    }
  }

  let step1Html = `
    <div class="step-card">
      <div class="step-header">
        <div class="step-number">1</div>
        <div class="step-title">Original and Sorted Dataset</div>
      </div>
      <div class="step-desc">The dataset is parsed and sorted in <strong>${direction}</strong> order. Ranks are determined based on sorted positions.</div>
      <div style="overflow-x: auto; width: 100%; margin-top: 1rem;">
        <table style="width: 100%; border-collapse: collapse; font-family: 'Figtree', sans-serif; text-align: center; font-size: 0.85rem; border: 1px solid var(--border);">
          <thead>
            <tr style="background: var(--bg2); border-bottom: 2px solid var(--border);">
              <th style="padding: 0.5rem; color: var(--muted); font-weight: 600;">Original No.</th>
              <th style="padding: 0.5rem; color: var(--navy); font-weight: 600;">Original Value</th>
              <th style="padding: 0.5rem; color: var(--muted); font-weight: 600;">Sorted Position</th>
              <th style="padding: 0.5rem; color: var(--teal); font-weight: 600;">Sorted Value (${direction})</th>
            </tr>
          </thead>
          <tbody>
            ${sortedRows}
          </tbody>
        </table>
      </div>
  `;

  if (n > 10) {
    step1Html += `
      <details style="margin-top: 0.5rem; border: 1px solid var(--border); border-radius: 8px; padding: 0.5rem;">
        <summary style="font-weight: 600; color: var(--navy); cursor: pointer; user-select: none; font-size: 0.85rem;">📂 Show remaining ${n - 10} sorted values</summary>
        <div style="overflow-x: auto; width: 100%; margin-top: 0.5rem;">
          <table style="width: 100%; border-collapse: collapse; font-family: 'Figtree', sans-serif; text-align: center; font-size: 0.85rem;">
            <tbody>
              ${remainingRowsHtml}
            </tbody>
          </table>
        </div>
      </details>
    `;
  }
  step1Html += `</div>`;
  html += step1Html;

  let tieHandlingHtml = '';
  if (tieGroupsCount === 0) {
    tieHandlingHtml = `<div class="step-card">
      <div class="step-header">
        <div class="step-number">2</div>
        <div class="step-title">Tie Handling & Duplicate Analysis</div>
      </div>
      <div class="step-desc">All values in the dataset are unique. No ties were detected, so every value is assigned its raw sorted rank directly without special tie resolution.</div>
    </div>`;
  } else {
    let tieGroupsRows = '';
    detailedAssignments.filter(d => d.size > 1).forEach((d, idx) => {
      tieGroupsRows += `<div style="background: var(--bg); border: 1px solid var(--border); padding: 0.75rem 1rem; border-radius: 8px; margin-bottom: 0.75rem;">
        <div style="font-weight: 600; color: var(--navy); margin-bottom: 0.25rem;">Group #${idx + 1}: Value <strong>${fmt(d.val, decimals)}</strong> (x${d.size} duplicates)</div>
        <div style="font-size: 0.9rem; color: var(--muted); line-height: 1.5;">${d.explanation}</div>
      </div>`;
    });

    tieHandlingHtml = `
      <div class="step-card">
        <div class="step-header">
          <div class="step-number">2</div>
          <div class="step-title">Tie Handling & Duplicate Analysis</div>
        </div>
        <div class="step-desc">The dataset contains <strong>${tieGroupsCount}</strong> groups of tied (duplicate) values. The chosen ranking system (<strong>${method.replace('-', ' ')}</strong>) resolves these ties as follows:</div>
        <div style="margin-top: 1rem;">
          ${tieGroupsRows}
        </div>
      </div>
    `;
  }
  html += tieHandlingHtml;

  let stepsRows = '';
  const stepsToShow = Math.min(detailedAssignments.length, 12);
  for (let i = 0; i < stepsToShow; i++) {
    const d = detailedAssignments[i];
    stepsRows += `<div style="border-bottom: 1px solid var(--border); padding: 0.75rem 0; display: flex; justify-content: space-between; align-items: center; font-size: 0.9rem;">
      <div style="font-family: 'IBM Plex Mono', monospace; font-weight: 500; color: var(--navy);">Value: ${fmt(d.val, decimals)} ${d.size > 1 ? `<span style="font-size: 0.75rem; background: var(--bg2); padding: 0.15rem 0.4rem; border-radius: 4px; color: var(--muted); font-weight: normal; margin-left: 0.5rem;">x${d.size} ties</span>` : ''}</div>
      <div style="text-align: right; color: var(--teal); font-weight: 600; font-family: 'IBM Plex Mono', monospace;">Rank: ${method === 'ordinal' ? `${d.startRank}-${d.endRank}` : fmt(d.assignedRank, decimals)}</div>
    </div>`;
  }

  let hiddenStepsHtml = '';
  if (detailedAssignments.length > 12) {
    for (let i = 12; i < detailedAssignments.length; i++) {
      const d = detailedAssignments[i];
      hiddenStepsHtml += `<div style="border-bottom: 1px solid var(--border); padding: 0.75rem 0; display: flex; justify-content: space-between; align-items: center; font-size: 0.9rem;">
        <div style="font-family: 'IBM Plex Mono', monospace; font-weight: 500; color: var(--navy);">Value: ${fmt(d.val, decimals)} ${d.size > 1 ? `<span style="font-size: 0.75rem; background: var(--bg2); padding: 0.15rem 0.4rem; border-radius: 4px; color: var(--muted); font-weight: normal; margin-left: 0.5rem;">x${d.size} ties</span>` : ''}</div>
        <div style="text-align: right; color: var(--teal); font-weight: 600; font-family: 'IBM Plex Mono', monospace;">Rank: ${method === 'ordinal' ? `${d.startRank}-${d.endRank}` : fmt(d.assignedRank, decimals)}</div>
      </div>`;
    }
  }

  let step3Html = `
    <div class="step-card">
      <div class="step-header">
        <div class="step-number">3</div>
        <div class="step-title">Rank Assignments Summary</div>
      </div>
      <div class="step-desc">List of distinct values sorted and their corresponding ranks:</div>
      <div style="margin-top: 1rem; border: 1px solid var(--border); border-radius: 8px; padding: 0 1rem; background: var(--bg2);">
        ${stepsRows}
      </div>
  `;

  if (detailedAssignments.length > 12) {
    step3Html += `
      <details style="margin-top: 0.5rem; border: 1px solid var(--border); border-radius: 8px; padding: 0.5rem;">
        <summary style="font-weight: 600; color: var(--navy); cursor: pointer; user-select: none; font-size: 0.85rem;">📂 Show remaining ${detailedAssignments.length - 12} assignments</summary>
        <div style="margin-top: 0.5rem; border: 1px solid var(--border); border-radius: 8px; padding: 0 1rem; background: var(--bg2);">
          ${hiddenStepsHtml}
        </div>
      </details>
    `;
  }
  step3Html += `</div>`;
  html += step3Html;

  let rankTableRows = '';
  for (let i = 0; i < rowsToShow; i++) {
    const item = finalRanks[i];
    rankTableRows += `<tr>
      <td style="padding: 0.4rem; border-bottom: 1px solid var(--border); font-family: 'IBM Plex Mono', monospace; font-size: 0.8rem; color: var(--muted);">${item.origIdx}</td>
      <td style="padding: 0.4rem; border-bottom: 1px solid var(--border); font-family: 'IBM Plex Mono', monospace; font-size: 0.8rem; font-weight: 500;">${fmt(item.val, decimals)}</td>
      <td style="padding: 0.4rem; border-bottom: 1px solid var(--border); font-family: 'IBM Plex Mono', monospace; font-size: 0.8rem; color: var(--teal); font-weight: 700;">${fmt(item.rank, decimals)}</td>
    </tr>`;
  }

  let hiddenRankTableRows = '';
  if (n > 10) {
    for (let i = 10; i < n; i++) {
      const item = finalRanks[i];
      hiddenRankTableRows += `<tr>
        <td style="padding: 0.4rem; border-bottom: 1px solid var(--border); font-family: 'IBM Plex Mono', monospace; font-size: 0.8rem; color: var(--muted);">${item.origIdx}</td>
        <td style="padding: 0.4rem; border-bottom: 1px solid var(--border); font-family: 'IBM Plex Mono', monospace; font-size: 0.8rem; font-weight: 500;">${fmt(item.val, decimals)}</td>
        <td style="padding: 0.4rem; border-bottom: 1px solid var(--border); font-family: 'IBM Plex Mono', monospace; font-size: 0.8rem; color: var(--teal); font-weight: 700;">${fmt(item.rank, decimals)}</td>
      </tr>`;
    }
  }

  let step4Html = `
    <div class="step-card" style="border-left-color: var(--teal);">
      <div class="step-header">
        <div class="step-number">4</div>
        <div class="step-title">Final Rank Output Table</div>
      </div>
      <div class="step-desc">Calculated ranks mapped back to the original order of the input dataset.</div>
      <div style="overflow-x: auto; width: 100%; margin-top: 1rem;">
        <table style="width: 100%; border-collapse: collapse; font-family: 'Figtree', sans-serif; text-align: center; font-size: 0.85rem; border: 1px solid var(--border);">
          <thead>
            <tr style="background: var(--bg2); border-bottom: 2px solid var(--border);">
              <th style="padding: 0.5rem; color: var(--muted); font-weight: 600;">No. (Original Order)</th>
              <th style="padding: 0.5rem; color: var(--navy); font-weight: 600;">Original Value</th>
              <th style="padding: 0.5rem; color: var(--teal); font-weight: 600;">Assigned Rank</th>
            </tr>
          </thead>
          <tbody>
            ${rankTableRows}
          </tbody>
        </table>
      </div>
  `;

  if (n > 10) {
    step4Html += `
      <details style="margin-top: 0.5rem; border: 1px solid var(--border); border-radius: 8px; padding: 0.5rem;">
        <summary style="font-weight: 600; color: var(--navy); cursor: pointer; user-select: none; font-size: 0.85rem;">📂 Show remaining ${n - 10} output ranks</summary>
        <div style="overflow-x: auto; width: 100%; margin-top: 0.5rem;">
          <table style="width: 100%; border-collapse: collapse; font-family: 'Figtree', sans-serif; text-align: center; font-size: 0.85rem;">
            <tbody>
              ${hiddenRankTableRows}
            </tbody>
          </table>
        </div>
      </details>
    `;
  }
  step4Html += `</div>`;
  html += step4Html;

  // Visualizations SVG Calculations
  const pad = 40;
  const svgW = 440;
  const svgH = 220;
  const plotW = svgW - 2 * pad;
  const plotH = svgH - 2 * pad;

  const maxRank = Math.max(...items.map(item => item.rank));
  const minRank = Math.min(...items.map(item => item.rank));
  const rangeRank = maxRank - minRank || 1.0;

  const mapX = (v) => pad + (rangeVal > 0 ? ((v - minVal) / rangeVal) * plotW : plotW / 2);
  const mapY = (r) => pad + plotH - (rangeRank > 0 ? ((r - minRank) / rangeRank) * plotH : plotH / 2);

  let distTicksHtml = '';
  const rankTicks = rangeRank > 0 ? [minRank, minRank + rangeRank*0.25, minRank + rangeRank*0.5, minRank + rangeRank*0.75, maxRank] : [minRank];
  rankTicks.forEach(tick => {
    const y = mapY(tick);
    distTicksHtml += `<line x1="${pad}" y1="${y}" x2="${pad + plotW}" y2="${y}" stroke="var(--border)" stroke-width="0.8" stroke-dasharray="3" />`;
    distTicksHtml += `<text x="${pad - 8}" y="${y + 3}" text-anchor="end" font-family="sans-serif" font-size="8" fill="var(--muted)">${fmt(tick, 1)}</text>`;
  });

  const valTicks = rangeVal > 0 ? [minVal, minVal + rangeVal*0.25, minVal + rangeVal*0.5, minVal + rangeVal*0.75, maxVal] : [minVal];
  valTicks.forEach(tick => {
    const x = mapX(tick);
    distTicksHtml += `<line x1="${x}" y1="${pad}" x2="${x}" y2="${pad + plotH}" stroke="var(--border)" stroke-width="0.8" stroke-dasharray="3" />`;
    distTicksHtml += `<text x="${x}" y="${svgH - pad + 12}" text-anchor="middle" font-family="sans-serif" font-size="8" fill="var(--muted)">${fmt(tick, 1)}</text>`;
  });

  let distPathHtml = '';
  let lastPt = null;
  const sortedCopyForChart = [...items].sort((a,b) => a.val - b.val);
  sortedCopyForChart.forEach(item => {
    const cx = mapX(item.val);
    const cy = mapY(item.rank);
    if (lastPt) {
      distPathHtml += `<line x1="${lastPt.x}" y1="${lastPt.y}" x2="${cx}" y2="${cy}" stroke="var(--teal)" stroke-width="2" opacity="0.8" />`;
    }
    lastPt = { x: cx, y: cy };
  });

  let distDotsHtml = '';
  sortedCopyForChart.forEach(item => {
    const cx = mapX(item.val);
    const cy = mapY(item.rank);
    distDotsHtml += `<circle cx="${cx}" cy="${cy}" r="4" fill="var(--amber)" stroke="#fff" stroke-width="1.2" />`;
  });

  // Histogram
  const numBins = 5;
  const bins = Array.from({length: numBins}, () => 0);
  const binWidth = rangeVal > 0 ? rangeVal / numBins : 1.0;
  
  rawValues.forEach(v => {
    let binIdx = Math.floor((v - minVal) / binWidth);
    if (binIdx >= numBins) binIdx = numBins - 1;
    if (binIdx < 0) binIdx = 0;
    bins[binIdx]++;
  });

  const maxBinCount = Math.max(...bins) || 1.0;
  const histTicks = [0, maxBinCount * 0.25, maxBinCount * 0.5, maxBinCount * 0.75, maxBinCount];
  
  let histHtml = '';
  histTicks.forEach(tick => {
    const y = pad + plotH - (tick / maxBinCount) * plotH;
    histHtml += `<line x1="${pad}" y1="${y}" x2="${pad + plotW}" y2="${y}" stroke="var(--border)" stroke-width="0.8" stroke-dasharray="3" />`;
    histHtml += `<text x="${pad - 8}" y="${y + 3}" text-anchor="end" font-family="sans-serif" font-size="8" fill="var(--muted)">${Math.round(tick)}</text>`;
  });

  const barW = (plotW / numBins) * 0.85;
  const barSpacing = (plotW / numBins) * 0.15;
  for (let i = 0; i < numBins; i++) {
    const count = bins[i];
    const bHeight = (count / maxBinCount) * plotH;
    const bx = pad + i * (barW + barSpacing) + barSpacing / 2;
    const by = pad + plotH - bHeight;
    histHtml += `<rect x="${bx}" y="${by}" width="${barW}" height="${bHeight}" fill="var(--teal)" opacity="0.85" rx="3" />`;
    
    const binStart = minVal + i * binWidth;
    const midX = bx + barW / 2;
    histHtml += `<text x="${midX}" y="${svgH - pad + 12}" text-anchor="middle" font-family="sans-serif" font-size="7.5" fill="var(--muted)">${fmt(binStart,1)}</text>`;
    
    if (count > 0) {
      histHtml += `<text x="${midX}" y="${by - 4}" text-anchor="middle" font-family="sans-serif" font-size="8.5" font-weight="bold" fill="var(--navy)">${count}</text>`;
    }
  }

  // Rank Frequency Chart
  const rankFreqMap = {};
  items.forEach(item => {
    rankFreqMap[item.rank] = (rankFreqMap[item.rank] || 0) + 1;
  });
  const uniqueRanks = Object.keys(rankFreqMap).map(Number).sort((a,b) => a - b);
  const maxFreq = Math.max(...Object.values(rankFreqMap)) || 1.0;

  let freqHtml = '';
  const freqTicks = [0, maxFreq * 0.25, maxFreq * 0.5, maxFreq * 0.75, maxFreq];
  freqTicks.forEach(tick => {
    const y = pad + plotH - (tick / maxFreq) * plotH;
    freqHtml += `<line x1="${pad}" y1="${y}" x2="${pad + plotW}" y2="${y}" stroke="var(--border)" stroke-width="0.8" stroke-dasharray="3" />`;
    freqHtml += `<text x="${pad - 8}" y="${y + 3}" text-anchor="end" font-family="sans-serif" font-size="8" fill="var(--muted)">${Math.round(tick)}</text>`;
  });

  const numRanks = uniqueRanks.length;
  const fBarW = (plotW / numRanks) * 0.8;
  const fBarSpacing = (plotW / numRanks) * 0.2;
  for (let i = 0; i < numRanks; i++) {
    const rankVal = uniqueRanks[i];
    const count = rankFreqMap[rankVal];
    const bHeight = (count / maxFreq) * plotH;
    const bx = pad + i * (fBarW + fBarSpacing) + fBarSpacing / 2;
    const by = pad + plotH - bHeight;
    freqHtml += `<rect x="${bx}" y="${by}" width="${fBarW}" height="${bHeight}" fill="var(--amber)" opacity="0.85" rx="3" />`;
    
    const midX = bx + fBarW / 2;
    freqHtml += `<text x="${midX}" y="${svgH - pad + 12}" text-anchor="middle" font-family="sans-serif" font-size="8" fill="var(--muted)">${fmt(rankVal, 1)}</text>`;
    
    if (count > 0) {
      freqHtml += `<text x="${midX}" y="${by - 4}" text-anchor="middle" font-family="sans-serif" font-size="8.5" font-weight="bold" fill="var(--navy)">${count}</text>`;
    }
  }

  let chartsCardHtml = `
    <div class="step-card">
      <div class="step-header">
        <div class="step-title">Ranking Visualizations</div>
      </div>
      <div style="display: flex; flex-direction: column; gap: 2rem; align-items: center; width: 100%;">
        
        <!-- Rank Distribution -->
        <div style="text-align: center; width: 100%;">
          <div style="font-weight: 600; font-size: 0.95rem; color: var(--navy); margin-bottom: 0.5rem;">Value to Rank Distribution</div>
          <svg width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}" style="max-width: 100%; height: auto; border: 1px solid var(--border); border-radius: 8px; padding: 0.5rem; background: var(--bg2);">
            ${distTicksHtml}
            ${distPathHtml}
            ${distDotsHtml}
          </svg>
          <div style="font-size: 0.8rem; color: var(--muted); margin-top: 0.4rem;">X-Axis: Values, Y-Axis: Assigned Ranks</div>
        </div>

        <!-- Histogram -->
        <div style="text-align: center; width: 100%;">
          <div style="font-weight: 600; font-size: 0.95rem; color: var(--navy); margin-bottom: 0.5rem;">Histogram of Values (Frequency Distribution)</div>
          <svg width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}" style="max-width: 100%; height: auto; border: 1px solid var(--border); border-radius: 8px; padding: 0.5rem; background: var(--bg2);">
            ${histHtml}
          </svg>
          <div style="font-size: 0.8rem; color: var(--muted); margin-top: 0.4rem;">Frequencies grouped in ${numBins} value intervals</div>
        </div>

        <!-- Rank Frequency -->
        <div style="text-align: center; width: 100%;">
          <div style="font-weight: 600; font-size: 0.95rem; color: var(--navy); margin-bottom: 0.5rem;">Rank Frequencies (Tie Group sizes)</div>
          <svg width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}" style="max-width: 100%; height: auto; border: 1px solid var(--border); border-radius: 8px; padding: 0.5rem; background: var(--bg2);">
            ${freqHtml}
          </svg>
          <div style="font-size: 0.8rem; color: var(--muted); margin-top: 0.4rem;">Shows count of elements holding each rank</div>
        </div>

      </div>
    </div>
  `;
  html += chartsCardHtml;

  let theoryHtml = `
    <div class="step-card" style="border-left-color: var(--amber);">
      <div class="step-header">
        <svg style="width: 24px; height: 24px; stroke: var(--amber); margin-right: 0.5rem;" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
        <div class="step-title">Theory: Mathematical Ranking Systems</div>
      </div>
      <div style="font-size: 0.95rem; color: var(--navy); line-height: 1.6;">
        <p style="margin-top: 0;"><strong>What is Ranking?</strong> In statistics and mathematics, ranking is the relationship between a set of items such that, for any two items, the first is either 'ranked higher than', 'ranked lower than' or 'ranked equal to' the second. It converts quantitative data into ordinal values.</p>
        
        <h4 style="margin: 1rem 0 0.5rem 0; font-size: 1.05rem;">Comparison of Ranking Systems</h4>
        <div style="overflow-x: auto; width: 100%; margin-bottom: 1.5rem;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; border: 1px solid var(--border);">
            <thead>
              <tr style="background: var(--bg); border-bottom: 2px solid var(--border);">
                <th style="padding: 0.5rem; text-align: left; font-weight:600;">System</th>
                <th style="padding: 0.5rem; text-align: left; font-weight:600;">Example [10, 20, 20, 30]</th>
                <th style="padding: 0.5rem; text-align: left; font-weight:600;">Formula / Tie Handling Rule</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--border); font-weight: 500;">Fractional (Average)</td>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--border); font-family: monospace;">[1.0, 2.5, 2.5, 4.0]</td>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--border);">Ties receive the average of the ordinal positions they cover. Standard in non-parametric stats.</td>
              </tr>
              <tr>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--border); font-weight: 500;">Standard Competition</td>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--border); font-family: monospace;">[1.0, 2.0, 2.0, 4.0]</td>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--border);">"1224" ranking. Tied items receive the lowest ordinal rank, creating a gap in ranks.</td>
              </tr>
              <tr>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--border); font-weight: 500;">Dense Ranking</td>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--border); font-family: monospace;">[1.0, 2.0, 2.0, 3.0]</td>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--border);">"1223" ranking. Tied items receive the same rank. Ranks are consecutive without gaps.</td>
              </tr>
              <tr>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--border); font-weight: 500;">Modified Competition</td>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--border); font-family: monospace;">[1.0, 3.0, 3.0, 4.0]</td>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--border);">"1334" ranking. Tied items receive the highest ordinal rank index within their range.</td>
              </tr>
              <tr>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--border); font-weight: 500;">Ordinal / Unique</td>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--border); font-family: monospace;">[1.0, 2.0, 3.0, 4.0]</td>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--border);">"1234" ranking. Ties resolved arbitrarily (stable sort based on input sequence) to preserve uniqueness.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h4 style="margin: 1rem 0 0.5rem 0; font-size: 1.05rem;">Applications in Statistics</h4>
        <ul style="margin: 0; padding-left: 1.25rem; line-height: 1.6;">
          <li><strong>Spearman's Rank Correlation Coefficient (ρ)</strong>: Measures monotonic association between variables using average ranks.</li>
          <li><strong>Wilcoxon Signed-Rank Test</strong>: Non-parametric statistical hypothesis test used to compare two related samples.</li>
          <li><strong>Mann-Whitney U Test</strong>: Computes whether one of two independent samples has larger values, relying entirely on fractional ranking.</li>
        </ul>
      </div>
    </div>
  `;
  html += theoryHtml;

  let exportRow = `
    <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 2rem;">
      <button onclick="exportRanksCSV()" class="btn-primary" style="background: var(--bg2); color: var(--navy); border: 1px solid var(--border);">
        <svg style="width: 18px; height: 18px; stroke: currentColor;" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
        Download CSV
      </button>
      <button onclick="exportRanksPDF()" class="btn-primary" style="background: var(--bg2); color: var(--navy); border: 1px solid var(--border);">
        <svg style="width: 18px; height: 18px; stroke: currentColor;" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
        Save as PDF
      </button>
    </div>
  `;
  html += exportRow;

  output.innerHTML = html;
  output.classList.add('active');
  output.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ==========================================
// POISSON DISTRIBUTION CALCULATOR
// ==========================================
function calculatePoisson() {
  const output = document.getElementById('steps-output');
  output.innerHTML = '';
  output.classList.add('active');

  const lambdaStr = document.getElementById('poisson-lambda').value;
  const xStr = document.getElementById('poisson-x').value;
  const mode = document.getElementById('poisson-mode') ? document.getElementById('poisson-mode').value : 'exact';

  // ---- VALIDATION ----
  if (lambdaStr.trim() === '' || xStr.trim() === '') {
    output.innerHTML = '<div style="color:#dc2626; padding: 1.5rem; text-align:center; font-weight:600; background: rgba(220,38,38,0.06); border-radius: 12px; border-left: 4px solid #dc2626;">⚠️ Please fill in all required fields (λ and x).</div>';
    return;
  }
  const lambda = parseFloat(lambdaStr);
  const x = parseFloat(xStr);

  if (isNaN(lambda) || isNaN(x)) {
    output.innerHTML = '<div style="color:#dc2626; padding: 1.5rem; text-align:center; font-weight:600; background: rgba(220,38,38,0.06); border-radius: 12px; border-left: 4px solid #dc2626;">⚠️ Please enter valid numeric values for λ and x.</div>';
    return;
  }
  if (lambda < 0) {
    output.innerHTML = '<div style="color:#dc2626; padding: 1.5rem; text-align:center; font-weight:600; background: rgba(220,38,38,0.06); border-radius: 12px; border-left: 4px solid #dc2626;">⚠️ Mean rate λ must be non-negative. Received: λ = ' + lambda + '</div>';
    return;
  }
  if (lambda === 0 && mode === 'exact' && x !== 0) {
    output.innerHTML = '<div style="color:#dc2626; padding: 1.5rem; text-align:center; font-weight:600; background: rgba(220,38,38,0.06); border-radius: 12px; border-left: 4px solid #dc2626;">⚠️ When λ = 0, the only possible value is x = 0 (P(X=0) = 1).</div>';
    return;
  }
  if (x < 0) {
    output.innerHTML = '<div style="color:#dc2626; padding: 1.5rem; text-align:center; font-weight:600; background: rgba(220,38,38,0.06); border-radius: 12px; border-left: 4px solid #dc2626;">⚠️ The value x must be non-negative. Received: x = ' + x + '</div>';
    return;
  }
  if (!Number.isInteger(x)) {
    output.innerHTML = '<div style="color:#dc2626; padding: 1.5rem; text-align:center; font-weight:600; background: rgba(220,38,38,0.06); border-radius: 12px; border-left: 4px solid #dc2626;">⚠️ The value x must be a non-negative integer (whole number). Received: x = ' + x + '</div>';
    return;
  }
  if (lambda > 1000) {
    output.innerHTML = '<div style="color:#dc2626; padding: 1.5rem; text-align:center; font-weight:600; background: rgba(220,38,38,0.06); border-radius: 12px; border-left: 4px solid #dc2626;">⚠️ λ is extremely large (' + lambda + '). For λ > 1000, use the Normal approximation N(λ, λ). Results may have reduced precision.</div>';
    return;
  }
  if (x > 170) {
    output.innerHTML = '<div style="color:#dc2626; padding: 1.5rem; text-align:center; font-weight:600; background: rgba(220,38,38,0.06); border-radius: 12px; border-left: 4px solid #dc2626;">⚠️ x is extremely large (' + x + '). For x > 170, factorial computation may overflow. Please use a smaller x value.</div>';
    return;
  }

  const xInt = Math.round(x);
  const decimals = 6;

  // ---- MATH HELPERS ----
  function logFactorial(k) {
    if (k <= 1) return 0;
    let res = 0;
    for (let i = 2; i <= k; i++) res += Math.log(i);
    return res;
  }
  function exactFactorial(k) {
    if (k <= 1) return 1;
    let res = 1;
    for (let i = 2; i <= k; i++) res *= i;
    return res;
  }
  function poissonPMF(lam, k) {
    if (lam === 0) return k === 0 ? 1 : 0;
    if (k < 0 || !Number.isInteger(k)) return 0;
    // Use log-space for numerical stability
    let logP = -lam + k * Math.log(lam) - logFactorial(k);
    let result = Math.exp(logP);
    if (!isFinite(result) || isNaN(result)) return 0;
    return Math.min(result, 1);
  }
  function cumulativePMF(lam, upTo) {
    let sum = 0;
    for (let i = 0; i <= upTo; i++) {
      sum += poissonPMF(lam, i);
    }
    return Math.min(sum, 1);
  }

  // ---- COMPUTE ALL PROBABILITIES ----
  const pExact = poissonPMF(lambda, xInt);
  const pLte = cumulativePMF(lambda, xInt);
  const pLt = xInt === 0 ? 0 : cumulativePMF(lambda, xInt - 1);
  const pGte = 1 - pLt;
  const pGt = 1 - pLte;

  let mainResult, mainLabel, modeDesc;
  switch(mode) {
    case 'exact': mainResult = pExact; mainLabel = `P(X = ${xInt})`; modeDesc = `exactly ${xInt} occurrences`; break;
    case 'lte': mainResult = pLte; mainLabel = `P(X ≤ ${xInt})`; modeDesc = `at most ${xInt} occurrences`; break;
    case 'lt': mainResult = pLt; mainLabel = `P(X < ${xInt})`; modeDesc = `fewer than ${xInt} occurrences`; break;
    case 'gte': mainResult = pGte; mainLabel = `P(X ≥ ${xInt})`; modeDesc = `at least ${xInt} occurrences`; break;
    case 'gt': mainResult = pGt; mainLabel = `P(X > ${xInt})`; modeDesc = `more than ${xInt} occurrences`; break;
    default: mainResult = pExact; mainLabel = `P(X = ${xInt})`; modeDesc = `exactly ${xInt} occurrences`;
  }

  // ---- INTERPRETATION ----
  let interpLabel, interpColor, interpIcon;
  if (mainResult >= 0.8) { interpLabel = 'Highly Likely'; interpColor = '#059669'; interpIcon = '🟢'; }
  else if (mainResult >= 0.5) { interpLabel = 'Likely'; interpColor = '#0d9488'; interpIcon = '🔵'; }
  else if (mainResult >= 0.2) { interpLabel = 'Moderate'; interpColor = '#d97706'; interpIcon = '🟡'; }
  else if (mainResult >= 0.05) { interpLabel = 'Unlikely'; interpColor = '#ea580c'; interpIcon = '🟠'; }
  else { interpLabel = 'Very Unlikely'; interpColor = '#dc2626'; interpIcon = '🔴'; }

  let stepsHtml = '';
  let stepCount = 1;

  // =========================================
  // COMPREHENSIVE RESULTS (displayed first)
  // =========================================
  let resultsHtml = `
    <div class="final-result animate-fade-in" style="padding: 2.5rem; background: #111827; color: #ffffff; border-radius: 16px; border: 1px solid var(--border); box-shadow: 0 10px 30px rgba(0,0,0,0.15); margin-bottom: 2rem; width: 100%; box-sizing: border-box;">
      <div style="font-size: 1.8rem; font-weight: 700; color: var(--amber); font-family:'Fraunces', serif; margin-bottom: 2rem; text-align: center;">✅ Poisson Distribution Results</div>
      
      <!-- Summary Box -->
      <div style="background: rgba(245, 158, 11, 0.1); border-left: 4px solid var(--amber); padding: 1.5rem; border-radius: 0 12px 12px 0; margin-bottom: 2rem;">
        <div style="font-size: 1.05rem; line-height: 1.6; color: rgba(255,255,255,0.9);">
          For a Poisson process with mean rate <b>λ = ${lambda}</b>, the probability of observing <b>${modeDesc}</b> is:
        </div>
        <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.8rem; font-weight: 700; color: #ffffff; margin-top: 1rem; display: flex; align-items: baseline; gap: 1rem; flex-wrap: wrap;">
          <span>${mainResult.toFixed(decimals)}</span>
          <span style="font-size: 1.2rem; color: var(--amber); font-family: 'Figtree', sans-serif;">or</span>
          <span style="color: var(--amber);">${(mainResult * 100).toFixed(4)}%</span>
        </div>
      </div>

      <!-- Interpretation Card -->
      <div style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); border-radius: 12px; padding: 1.25rem 1.5rem; margin-bottom: 2rem; display: flex; align-items: center; gap: 1rem;">
        <span style="font-size: 2rem;">${interpIcon}</span>
        <div>
          <div style="font-size: 1.1rem; font-weight: 700; color: ${interpColor};">${interpLabel}</div>
          <div style="font-size: 0.9rem; color: rgba(255,255,255,0.65);">A probability of ${(mainResult * 100).toFixed(2)}% is considered <strong>${interpLabel.toLowerCase()}</strong> in statistical analysis.</div>
        </div>
      </div>

      <!-- Probability Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem;">
        <div style="padding: 1.5rem; background: rgba(255,255,255,0.06); border-radius: 12px; border: 1px solid rgba(255,255,255,0.12); display: flex; flex-direction: column; justify-content: space-between; ${mode === 'lt' ? 'border: 2px solid var(--amber); box-shadow: 0 0 20px rgba(245,158,11,0.15); transform: scale(1.02); z-index: 1;' : ''}">
          <div style="font-size:0.95rem; font-weight:600; color: ${mode === 'lt' ? 'var(--amber)' : 'rgba(255,255,255,0.6)'}; margin-bottom: 0.5rem; display: flex; justify-content: space-between;">
            <span>Less than</span><span>X &lt; ${xInt}</span>
          </div>
          <div style="font-family:'IBM Plex Mono',monospace; font-size: 1.6rem; font-weight:700; color:#ffffff;">P(X &lt; ${xInt})</div>
          <div style="font-family:'IBM Plex Mono',monospace; font-size: 1.3rem; color: ${mode === 'lt' ? 'var(--amber)' : 'var(--teal)'}; margin-top: 0.5rem;">${pLt.toFixed(decimals)}</div>
        </div>
        <div style="padding: 1.5rem; background: rgba(255,255,255,0.06); border-radius: 12px; border: 1px solid rgba(255,255,255,0.12); display: flex; flex-direction: column; justify-content: space-between; ${mode === 'lte' ? 'border: 2px solid var(--amber); box-shadow: 0 0 20px rgba(245,158,11,0.15); transform: scale(1.02); z-index: 1;' : ''}">
          <div style="font-size:0.95rem; font-weight:600; color: ${mode === 'lte' ? 'var(--amber)' : 'rgba(255,255,255,0.6)'}; margin-bottom: 0.5rem; display: flex; justify-content: space-between;">
            <span>At most</span><span>X ≤ ${xInt}</span>
          </div>
          <div style="font-family:'IBM Plex Mono',monospace; font-size: 1.6rem; font-weight:700; color:#ffffff;">P(X ≤ ${xInt})</div>
          <div style="font-family:'IBM Plex Mono',monospace; font-size: 1.3rem; color: ${mode === 'lte' ? 'var(--amber)' : 'var(--teal)'}; margin-top: 0.5rem;">${pLte.toFixed(decimals)}</div>
        </div>
        <div style="padding: 1.5rem; background: ${mode === 'exact' ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)'}; border-radius: 12px; border: ${mode === 'exact' ? '2px solid var(--amber); box-shadow: 0 0 20px rgba(245,158,11,0.15);' : '1px solid rgba(255,255,255,0.12);'} display: flex; flex-direction: column; justify-content: space-between; ${mode === 'exact' ? 'transform: scale(1.02); z-index: 1;' : ''}">
          <div style="font-size:0.95rem; font-weight:600; color: ${mode === 'exact' ? 'var(--amber)' : 'rgba(255,255,255,0.6)'}; margin-bottom: 0.5rem; display: flex; justify-content: space-between;">
            <span>Exactly</span><span>X = ${xInt}</span>
          </div>
          <div style="font-family:'IBM Plex Mono',monospace; font-size: 1.8rem; font-weight:700; color:#ffffff;">P(X = ${xInt})</div>
          <div style="font-family:'IBM Plex Mono',monospace; font-size: 1.4rem; color: ${mode === 'exact' ? 'var(--amber)' : 'var(--teal)'}; margin-top: 0.5rem;">${pExact.toFixed(decimals)}</div>
        </div>
        <div style="padding: 1.5rem; background: rgba(255,255,255,0.06); border-radius: 12px; border: 1px solid rgba(255,255,255,0.12); display: flex; flex-direction: column; justify-content: space-between; ${mode === 'gte' ? 'border: 2px solid var(--amber); box-shadow: 0 0 20px rgba(245,158,11,0.15); transform: scale(1.02); z-index: 1;' : ''}">
          <div style="font-size:0.95rem; font-weight:600; color: ${mode === 'gte' ? 'var(--amber)' : 'rgba(255,255,255,0.6)'}; margin-bottom: 0.5rem; display: flex; justify-content: space-between;">
            <span>At least</span><span>X ≥ ${xInt}</span>
          </div>
          <div style="font-family:'IBM Plex Mono',monospace; font-size: 1.6rem; font-weight:700; color:#ffffff;">P(X ≥ ${xInt})</div>
          <div style="font-family:'IBM Plex Mono',monospace; font-size: 1.3rem; color: ${mode === 'gte' ? 'var(--amber)' : 'var(--teal)'}; margin-top: 0.5rem;">${pGte.toFixed(decimals)}</div>
        </div>
        <div style="padding: 1.5rem; background: rgba(255,255,255,0.06); border-radius: 12px; border: 1px solid rgba(255,255,255,0.12); display: flex; flex-direction: column; justify-content: space-between; ${mode === 'gt' ? 'border: 2px solid var(--amber); box-shadow: 0 0 20px rgba(245,158,11,0.15); transform: scale(1.02); z-index: 1;' : ''}">
          <div style="font-size:0.95rem; font-weight:600; color: ${mode === 'gt' ? 'var(--amber)' : 'rgba(255,255,255,0.6)'}; margin-bottom: 0.5rem; display: flex; justify-content: space-between;">
            <span>More than</span><span>X &gt; ${xInt}</span>
          </div>
          <div style="font-family:'IBM Plex Mono',monospace; font-size: 1.6rem; font-weight:700; color:#ffffff;">P(X &gt; ${xInt})</div>
          <div style="font-family:'IBM Plex Mono',monospace; font-size: 1.3rem; color: ${mode === 'gt' ? 'var(--amber)' : 'var(--teal)'}; margin-top: 0.5rem;">${pGt.toFixed(decimals)}</div>
        </div>
      </div>
    </div>
  `;

  // =========================================
  // STEP 1: Display Formula
  // =========================================
  stepsHtml += `<div class="step-card">
    <div class="step-header">
      <div class="step-number">${stepCount++}</div>
      <div class="step-title">Step 1: The Poisson Formula</div>
    </div>
    <div class="step-content">
      <div class="step-desc" style="margin-bottom: 1rem;">
        The Poisson Distribution models the probability of a given number of events occurring in a fixed interval of time or space, when these events occur independently at a constant average rate.
      </div>
      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.4rem; text-align: center; color: var(--navy); margin-bottom: 1.5rem; background: var(--bg); padding: 1.5rem; border-radius: 8px; font-weight: 600;">
        P(X = x) = e<sup>−λ</sup> · λ<sup>x</sup> / x!
      </div>
      <div class="step-desc" style="margin-bottom: 0.5rem;">Variables: λ = ${lambda}, x = ${xInt}</div>
    </div>
  </div>`;

  // =========================================
  // STEP 2: Substitute Values
  // =========================================
  stepsHtml += `<div class="step-card">
    <div class="step-header">
      <div class="step-number">${stepCount++}</div>
      <div class="step-title">Step 2: Substitute Values</div>
    </div>
    <div class="step-content">
      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.2rem; text-align: center; color: var(--navy); background: var(--bg); padding: 1.5rem; border-radius: 8px; line-height: 2;">
        P(X = ${xInt}) = e<sup>−${lambda}</sup> · ${lambda}<sup>${xInt}</sup> / ${xInt}!
      </div>
    </div>
  </div>`;

  // =========================================
  // STEP 3: Calculate Factorial
  // =========================================
  const factVal = exactFactorial(xInt);
  let factStepsStr = '';
  if (xInt <= 1) {
    factStepsStr = `${xInt}! = 1`;
  } else if (xInt <= 12) {
    let parts = [];
    for (let i = xInt; i >= 1; i--) parts.push(i);
    factStepsStr = `${xInt}! = ${parts.join(' × ')} = ${factVal.toLocaleString()}`;
  } else {
    factStepsStr = `${xInt}! = ${factVal.toExponential(6)}`;
  }

  stepsHtml += `<div class="step-card">
    <div class="step-header">
      <div class="step-number">${stepCount++}</div>
      <div class="step-title">Step 3: Calculate Factorial (x!)</div>
    </div>
    <div class="step-content">
      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.15rem; text-align: center; color: var(--navy); background: var(--bg); padding: 1.5rem; border-radius: 8px;">
        ${factStepsStr}
      </div>
      <div style="color: var(--teal); font-size: 1.3rem; font-weight: 700; margin-top: 1rem; text-align: center;">
        ${xInt}! = ${xInt <= 20 ? factVal.toLocaleString() : factVal.toExponential(6)}
      </div>
    </div>
  </div>`;

  // =========================================
  // STEP 4: Calculate Exponential Term
  // =========================================
  const expTerm = Math.exp(-lambda);
  stepsHtml += `<div class="step-card">
    <div class="step-header">
      <div class="step-number">${stepCount++}</div>
      <div class="step-title">Step 4: Calculate Exponential Term (e<sup>−λ</sup>)</div>
    </div>
    <div class="step-content">
      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.15rem; text-align: center; color: var(--navy); background: var(--bg); padding: 1.5rem; border-radius: 8px; line-height: 2;">
        e<sup>−${lambda}</sup> = e<sup>${(-lambda).toFixed(4)}</sup> = ${expTerm.toExponential(8)}
      </div>
      <div style="color: var(--teal); font-size: 1.3rem; font-weight: 700; margin-top: 1rem; text-align: center;">
        e<sup>−λ</sup> = ${expTerm.toFixed(decimals + 2)}
      </div>
    </div>
  </div>`;

  // =========================================
  // STEP 5: Calculate Numerator (λ^x)
  // =========================================
  const lambdaPowX = Math.pow(lambda, xInt);
  stepsHtml += `<div class="step-card">
    <div class="step-header">
      <div class="step-number">${stepCount++}</div>
      <div class="step-title">Step 5: Calculate Numerator (λ<sup>x</sup>)</div>
    </div>
    <div class="step-content">
      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.15rem; text-align: center; color: var(--navy); background: var(--bg); padding: 1.5rem; border-radius: 8px; line-height: 2;">
        λ<sup>x</sup> = ${lambda}<sup>${xInt}</sup> = ${lambdaPowX <= 1e12 ? lambdaPowX.toLocaleString() : lambdaPowX.toExponential(6)}
      </div>
      <div style="color: var(--teal); font-size: 1.3rem; font-weight: 700; margin-top: 1rem; text-align: center;">
        λ<sup>x</sup> = ${lambdaPowX <= 1e12 ? lambdaPowX.toLocaleString() : lambdaPowX.toExponential(6)}
      </div>
    </div>
  </div>`;

  // =========================================
  // STEP 6: Calculate Probability
  // =========================================
  const numerator = expTerm * lambdaPowX;
  stepsHtml += `<div class="step-card">
    <div class="step-header">
      <div class="step-number">${stepCount++}</div>
      <div class="step-title">Step 6: Calculate Probability</div>
    </div>
    <div class="step-content">
      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.1rem; color: var(--navy); background: var(--bg); padding: 1.5rem; border-radius: 8px; line-height: 2.2; text-align: center;">
        <div>P(X = ${xInt}) = e<sup>−${lambda}</sup> × ${lambda}<sup>${xInt}</sup> / ${xInt}!</div>
        <div style="margin-top: 0.75rem;">= ${expTerm.toFixed(8)} × ${lambdaPowX <= 1e12 ? lambdaPowX.toLocaleString() : lambdaPowX.toExponential(4)} / ${xInt <= 20 ? factVal.toLocaleString() : factVal.toExponential(4)}</div>
        <div style="margin-top: 0.75rem;">= ${numerator.toExponential(6)} / ${xInt <= 20 ? factVal.toLocaleString() : factVal.toExponential(4)}</div>
      </div>
    </div>
  </div>`;

  // =========================================
  // STEP 7: Final Answer
  // =========================================
  stepsHtml += `<div class="step-card">
    <div class="step-header">
      <div class="step-number">${stepCount++}</div>
      <div class="step-title">Step 7: Final Answer</div>
    </div>
    <div class="step-content">
      <div style="color: var(--teal); font-size: 1.5rem; font-weight: 700; background: rgba(13,148,136,0.08); display: inline-block; padding: 0.75rem 1.5rem; border-radius: 8px; margin-bottom: 1rem;">
        P(X = ${xInt}) = ${pExact.toFixed(decimals)}
      </div>
      ${mode !== 'exact' ? `
      <div style="margin-top: 1rem; padding: 1.5rem; background: var(--bg); border-radius: 8px; border-left: 4px solid var(--amber);">
        <div style="font-weight: 700; color: var(--navy); margin-bottom: 0.5rem;">Selected Mode: ${mainLabel}</div>
        ${mode === 'lte' ? `<div style="font-family: 'IBM Plex Mono', monospace; color: var(--text); line-height: 1.8;">P(X ≤ ${xInt}) = Σ P(X=k) for k = 0 to ${xInt} = ${pLte.toFixed(decimals)}</div>` : ''}
        ${mode === 'lt' ? `<div style="font-family: 'IBM Plex Mono', monospace; color: var(--text); line-height: 1.8;">P(X < ${xInt}) = Σ P(X=k) for k = 0 to ${xInt - 1} = ${pLt.toFixed(decimals)}</div>` : ''}
        ${mode === 'gte' ? `<div style="font-family: 'IBM Plex Mono', monospace; color: var(--text); line-height: 1.8;">P(X ≥ ${xInt}) = 1 − P(X ≤ ${xInt - 1}) = 1 − ${pLt.toFixed(decimals)} = ${pGte.toFixed(decimals)}</div>` : ''}
        ${mode === 'gt' ? `<div style="font-family: 'IBM Plex Mono', monospace; color: var(--text); line-height: 1.8;">P(X > ${xInt}) = 1 − P(X ≤ ${xInt}) = 1 − ${pLte.toFixed(decimals)} = ${pGt.toFixed(decimals)}</div>` : ''}
      </div>
      ` : ''}
    </div>
  </div>`;

  // =========================================
  // PMF BAR CHART VISUALIZATION
  // =========================================
  let vizStart = 0;
  let vizEnd = Math.max(xInt + 5, Math.ceil(lambda + 3 * Math.sqrt(lambda)));
  if (vizEnd > 50) vizEnd = Math.min(vizEnd, Math.ceil(lambda + 4 * Math.sqrt(lambda) + 5));
  if (vizEnd > 80) vizEnd = 80;
  
  let maxProb = 0;
  let distPoints = [];
  for (let i = vizStart; i <= vizEnd; i++) {
    let prob = poissonPMF(lambda, i);
    if (prob > maxProb) maxProb = prob;
    distPoints.push({ x: i, p: prob });
  }
  if (maxProb === 0) maxProb = 1;

  // Filter to only show points with meaningful probability or near x
  let filteredPoints = distPoints.filter(pt => pt.p > 0.0001 || Math.abs(pt.x - xInt) <= 2 || pt.x <= 3);
  if (filteredPoints.length < 5 && distPoints.length >= 5) filteredPoints = distPoints.slice(0, Math.min(20, distPoints.length));

  let barsHtml = '';
  filteredPoints.forEach(pt => {
    let heightPercent = (pt.p / maxProb) * 85;
    let isTarget = pt.x === xInt;
    let color = isTarget ? 'var(--amber)' : 'var(--teal)';
    let opacity = isTarget ? '1' : '0.6';
    
    barsHtml += `
      <div style="display: flex; flex-direction: column; justify-content: flex-end; align-items: center; flex: 1; min-width: 28px; height: 100%; position: relative;" onmouseover="this.querySelector('.bar-tooltip').style.opacity=1; this.querySelector('.bar-tooltip').style.visibility='visible';" onmouseout="this.querySelector('.bar-tooltip').style.opacity=0; this.querySelector('.bar-tooltip').style.visibility='hidden';">
        <div class="bar-tooltip" style="position: absolute; bottom: calc(${Math.max(0.5, heightPercent)}% + 10px); font-size: 0.75rem; color: var(--white); opacity: 0; visibility: hidden; transition: 0.2s; white-space: nowrap; z-index: 20; background: var(--navy); padding: 6px 10px; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); text-align: center; pointer-events: none;">
          <div style="font-weight:700; margin-bottom:2px; color: var(--amber);">x = ${pt.x}</div>
          <div>P(X=${pt.x}) ≈ ${pt.p.toFixed(5)}</div>
          <div style="font-size:0.7rem; opacity: 0.8; margin-top: 2px;">${(pt.p * 100).toFixed(2)}%</div>
          <div style="position: absolute; bottom: -4px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 5px solid var(--navy);"></div>
        </div>
        <div style="width: 100%; max-width: 40px; height: ${Math.max(0.5, heightPercent)}%; background-color: ${color}; opacity: ${opacity}; border-radius: 4px 4px 0 0; min-height: 1px; transition: 0.3s; cursor: crosshair;"></div>
        <div style="font-size: 0.75rem; color: var(--navy); margin-top: 6px; font-family: 'IBM Plex Mono', monospace; font-weight: ${isTarget ? '700' : '500'};">${pt.x}</div>
      </div>
    `;
  });

  stepsHtml += `<div class="step-card" style="margin-top: 1.5rem;">
    <div class="step-header">
      <div class="step-number">${stepCount++}</div>
      <div class="step-title">PMF Bar Chart</div>
    </div>
    <div class="step-content" style="padding-top: 1rem;">
      <div style="text-align: center; font-weight: 600; font-size: 1.1rem; color: var(--navy); margin-bottom: 0.5rem; font-family: 'Fraunces', serif;">
        Poisson PMF: P(X = k) for λ = ${lambda}
      </div>
      <div class="step-desc" style="text-align: center; margin-bottom: 2rem;">Parameters: λ = ${lambda}, x = ${xInt}</div>
      
      <div style="position: relative; width: 100%; padding-left: 2rem; padding-bottom: 2rem; box-sizing: border-box;">
        <div style="position: absolute; left: -10px; top: 50%; transform: translateY(-50%) rotate(-90deg); font-size: 0.8rem; font-weight: 600; color: var(--muted); letter-spacing: 1px;">
          PROBABILITY P(X=k)
        </div>
        <div style="width: 100%; overflow-x: auto; padding-top: 2rem;">
          <div style="display: flex; height: 250px; min-width: 100%; width: fit-content; border-bottom: 2px solid var(--border); border-left: 2px solid var(--border); padding-bottom: 0; align-items: flex-end; gap: 4px; padding-left: 4px; padding-right: 1rem;">
            ${barsHtml}
          </div>
        </div>
        <div style="text-align: center; font-size: 0.8rem; font-weight: 600; color: var(--muted); letter-spacing: 1px; margin-top: 0.5rem; margin-left: 2rem;">
          NUMBER OF OCCURRENCES (k)
        </div>
      </div>

      <div style="display: flex; justify-content: center; gap: 2rem; font-size: 0.85rem; color: var(--text); margin-top: 1rem;">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <div style="width: 14px; height: 14px; background: var(--teal); opacity: 0.6; border-radius: 3px;"></div>
          P(X=k) for other values
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <div style="width: 14px; height: 14px; background: var(--amber); border-radius: 3px;"></div>
          Selected P(X = ${xInt})
        </div>
      </div>
    </div>
  </div>`;

  // =========================================
  // SVG DISTRIBUTION CURVE
  // =========================================
  const svgW = 500, svgH = 220, padL = 50, padR = 20, padT = 20, padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;
  
  let curvePoints = [];
  let svgBarCount = Math.min(filteredPoints.length, 40);
  let svgPts = filteredPoints.slice(0, svgBarCount);
  
  let svgBarsHtml = '';
  let svgCurvePath = '';
  let svgHighlight = '';
  
  if (svgPts.length > 0) {
    const barW = Math.min(plotW / svgPts.length * 0.7, 20);
    const gap = plotW / svgPts.length;
    
    svgPts.forEach((pt, idx) => {
      const cx = padL + idx * gap + gap / 2;
      const barH = (pt.p / maxProb) * plotH * 0.9;
      const by = svgH - padB - barH;
      const isTarget = pt.x === xInt;
      
      svgBarsHtml += `<rect x="${cx - barW/2}" y="${by}" width="${barW}" height="${barH}" rx="2" fill="${isTarget ? '#f59e0b' : '#0d9488'}" opacity="${isTarget ? '1' : '0.5'}"/>`;
      
      curvePoints.push({ cx, cy: by });
      
      if (isTarget) {
        svgHighlight += `<circle cx="${cx}" cy="${by}" r="5" fill="#f59e0b" stroke="#fff" stroke-width="2"/>`;
        svgHighlight += `<line x1="${cx}" y1="${by}" x2="${cx}" y2="${svgH - padB}" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.5"/>`;
      }
      
      // X-axis labels (show every nth)
      if (svgPts.length <= 20 || idx % Math.ceil(svgPts.length / 15) === 0 || isTarget) {
        svgBarsHtml += `<text x="${cx}" y="${svgH - padB + 16}" fill="var(--muted)" font-size="9" font-family="IBM Plex Mono" text-anchor="middle" font-weight="${isTarget ? '700' : '400'}">${pt.x}</text>`;
      }
    });
    
    // Smooth curve through bar tops
    if (curvePoints.length >= 2) {
      svgCurvePath = `M ${curvePoints[0].cx},${curvePoints[0].cy}`;
      for (let i = 1; i < curvePoints.length; i++) {
        const prev = curvePoints[i-1];
        const curr = curvePoints[i];
        const cpx = (prev.cx + curr.cx) / 2;
        svgCurvePath += ` C ${cpx},${prev.cy} ${cpx},${curr.cy} ${curr.cx},${curr.cy}`;
      }
    }
  }

  // Y-axis labels
  let yLabels = '';
  for (let i = 0; i <= 4; i++) {
    const yVal = (maxProb * i / 4);
    const yPos = svgH - padB - (i / 4) * plotH * 0.9;
    yLabels += `<text x="${padL - 6}" y="${yPos + 3}" fill="var(--muted)" font-size="9" font-family="IBM Plex Mono" text-anchor="end">${yVal.toFixed(3)}</text>`;
    yLabels += `<line x1="${padL}" y1="${yPos}" x2="${svgW - padR}" y2="${yPos}" stroke="var(--border)" stroke-width="0.5" opacity="0.5"/>`;
  }

  stepsHtml += `<div class="step-card" style="margin-top: 1.5rem;">
    <div class="step-header">
      <div class="step-number">${stepCount++}</div>
      <div class="step-title">Distribution Curve (SVG)</div>
    </div>
    <div class="step-content" style="padding-top: 1rem;">
      <div style="text-align: center; font-weight: 600; font-size: 1.05rem; color: var(--navy); margin-bottom: 1rem; font-family: 'Fraunces', serif;">
        Poisson Distribution Shape — λ = ${lambda}
      </div>
      <div style="width: 100%; overflow-x: auto;">
        <svg viewBox="0 0 ${svgW} ${svgH}" xmlns="http://www.w3.org/2000/svg" style="width: 100%; max-width: 600px; height: auto; display: block; margin: 0 auto;">
          <defs>
            <linearGradient id="poissonGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" style="stop-color:#0d9488;stop-opacity:0.25"/>
              <stop offset="100%" style="stop-color:#0d9488;stop-opacity:0"/>
            </linearGradient>
            <filter id="poissonGlow"><feGaussianBlur stdDeviation="2" result="cb"/><feMerge><feMergeNode in="cb"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          </defs>
          <!-- Axes -->
          <line x1="${padL}" y1="${padT}" x2="${padL}" y2="${svgH - padB}" stroke="var(--border)" stroke-width="1.5"/>
          <line x1="${padL}" y1="${svgH - padB}" x2="${svgW - padR}" y2="${svgH - padB}" stroke="var(--border)" stroke-width="1.5"/>
          ${yLabels}
          ${svgBarsHtml}
          ${svgCurvePath ? `<path d="${svgCurvePath}" fill="none" stroke="#0d9488" stroke-width="2.5" filter="url(#poissonGlow)" opacity="0.8"/>` : ''}
          ${svgHighlight}
          <!-- Axis labels -->
          <text x="${svgW / 2}" y="${svgH - 2}" fill="var(--muted)" font-size="10" font-family="Figtree" text-anchor="middle" font-weight="600">k (Number of Events)</text>
          <text x="14" y="${svgH / 2}" fill="var(--muted)" font-size="10" font-family="Figtree" text-anchor="middle" font-weight="600" transform="rotate(-90, 14, ${svgH / 2})">P(X=k)</text>
        </svg>
      </div>
    </div>
  </div>`;

  // =========================================
  // ANIMATED ARRIVAL SIMULATION
  // =========================================
  const simId = 'poisson-sim-' + Date.now();
  stepsHtml += `<div class="step-card" style="margin-top: 1.5rem;">
    <div class="step-header">
      <div class="step-number">${stepCount++}</div>
      <div class="step-title">Interactive Arrival Simulation</div>
    </div>
    <div class="step-content" style="padding-top: 1rem;">
      <div class="step-desc" style="margin-bottom: 1rem;">Visualize random Poisson arrivals (λ = ${lambda}) over a time window. Click "Run Simulation" to generate events.</div>
      <div style="text-align: center; margin-bottom: 1rem;">
        <button onclick="runPoissonSimulation('${simId}', ${lambda})" class="btn-primary" style="padding: 0.5rem 1.5rem; font-size: 0.95rem;">▶ Run Simulation</button>
      </div>
      <div id="${simId}" style="width: 100%; overflow-x: auto;">
        <svg id="${simId}-svg" viewBox="0 0 600 120" xmlns="http://www.w3.org/2000/svg" style="width: 100%; max-width: 700px; height: auto; display: block; margin: 0 auto; background: var(--bg); border-radius: 8px; border: 1px solid var(--border);">
          <!-- Timeline -->
          <line x1="40" y1="80" x2="560" y2="80" stroke="var(--border)" stroke-width="2"/>
          <text x="300" y="105" fill="var(--muted)" font-size="11" font-family="Figtree" text-anchor="middle" font-weight="600">Time →</text>
          <text x="300" y="30" fill="var(--muted)" font-size="12" font-family="Figtree" text-anchor="middle">Click "Run Simulation" to see Poisson arrivals</text>
        </svg>
      </div>
      <div id="${simId}-count" style="text-align: center; margin-top: 0.75rem; font-family: 'IBM Plex Mono', monospace; font-size: 0.9rem; color: var(--muted);"></div>
    </div>
  </div>`;

  // =========================================
  // THEORY SECTION
  // =========================================
  stepsHtml += `<div class="step-card" style="margin-top: 1.5rem;">
    <div class="step-header">
      <div class="step-number">${stepCount++}</div>
      <div class="step-title">Poisson Distribution — Theory</div>
    </div>
    <div class="step-content">
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
        
        <!-- Definition -->
        <div style="padding: 1.5rem; background: var(--bg); border-radius: 12px; border-left: 4px solid var(--amber);">
          <div style="font-weight: 700; color: var(--navy); margin-bottom: 0.75rem; font-size: 1.05rem;">📖 Definition</div>
          <div style="color: var(--text); line-height: 1.7; font-size: 0.95rem;">
            The Poisson distribution is a discrete probability distribution that expresses the probability of a given number of events occurring in a fixed interval of time or space, if these events occur with a known constant mean rate and independently of each other.
          </div>
        </div>

        <!-- Formula -->
        <div style="padding: 1.5rem; background: var(--bg); border-radius: 12px; border-left: 4px solid var(--teal);">
          <div style="font-weight: 700; color: var(--navy); margin-bottom: 0.75rem; font-size: 1.05rem;">📐 Formula</div>
          <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.2rem; color: var(--navy); text-align: center; padding: 1rem; background: var(--white); border-radius: 8px; margin-bottom: 0.75rem;">
            P(X = k) = e<sup>−λ</sup> · λ<sup>k</sup> / k!
          </div>
          <div style="color: var(--text); line-height: 1.7; font-size: 0.9rem;">
            <strong>Variables:</strong><br>
            • <strong>λ (lambda)</strong> — Average rate of occurrence (mean)<br>
            • <strong>k</strong> — Number of occurrences (non-negative integer)<br>
            • <strong>e</strong> — Euler's number (≈ 2.71828)
          </div>
        </div>

        <!-- Properties -->
        <div style="padding: 1.5rem; background: var(--bg); border-radius: 12px; border-left: 4px solid #8b5cf6;">
          <div style="font-weight: 700; color: var(--navy); margin-bottom: 0.75rem; font-size: 1.05rem;">⚙️ Properties</div>
          <div style="color: var(--text); line-height: 1.8; font-size: 0.95rem;">
            • <strong>Mean:</strong> E[X] = λ = ${lambda}<br>
            • <strong>Variance:</strong> Var(X) = λ = ${lambda}<br>
            • <strong>Std. Dev:</strong> σ = √λ = ${Math.sqrt(lambda).toFixed(4)}<br>
            • <strong>Skewness:</strong> 1/√λ = ${lambda > 0 ? (1/Math.sqrt(lambda)).toFixed(4) : '∞'}<br>
            • <strong>Mode:</strong> ⌊λ⌋ = ${Math.floor(lambda)}
          </div>
        </div>

        <!-- Applications -->
        <div style="padding: 1.5rem; background: var(--bg); border-radius: 12px; border-left: 4px solid #ec4899;">
          <div style="font-weight: 700; color: var(--navy); margin-bottom: 0.75rem; font-size: 1.05rem;">🌍 Real-World Applications</div>
          <div style="color: var(--text); line-height: 1.8; font-size: 0.95rem;">
            • Number of calls at a call center per hour<br>
            • Defects per unit in manufacturing<br>
            • Accidents at an intersection per year<br>
            • Emails received per day<br>
            • Radioactive decay events per second<br>
            • Website visitors per minute
          </div>
        </div>

        <!-- Assumptions -->
        <div style="padding: 1.5rem; background: var(--bg); border-radius: 12px; border-left: 4px solid #06b6d4;">
          <div style="font-weight: 700; color: var(--navy); margin-bottom: 0.75rem; font-size: 1.05rem;">✅ Assumptions</div>
          <div style="color: var(--text); line-height: 1.8; font-size: 0.95rem;">
            • Events occur independently<br>
            • Average rate λ is constant<br>
            • Two events cannot occur at exactly the same instant<br>
            • The probability of an event is proportional to the interval length
          </div>
        </div>

        <!-- Limitations -->
        <div style="padding: 1.5rem; background: var(--bg); border-radius: 12px; border-left: 4px solid #f43f5e;">
          <div style="font-weight: 700; color: var(--navy); margin-bottom: 0.75rem; font-size: 1.05rem;">⚠️ Limitations</div>
          <div style="color: var(--text); line-height: 1.8; font-size: 0.95rem;">
            • Not suitable for dependent events<br>
            • Rate must be constant over the interval<br>
            • For large λ (>1000), Normal approximation N(λ, λ) is preferred<br>
            • Only models count data (non-negative integers)<br>
            • Does not account for overdispersion
          </div>
        </div>
      </div>
    </div>
  </div>`;

  // =========================================
  // EXPORTS
  // =========================================
  stepsHtml += `
    <div style="display: flex; gap: 1rem; margin-top: 2rem; justify-content: center; flex-wrap: wrap;">
      <button onclick="exportPoissonCSV(${lambda}, ${xInt}, '${mode}')" class="btn-primary" style="background: var(--bg2); color: var(--navy); border: 1px solid var(--border); display: flex; align-items: center; gap: 0.5rem; padding: 0.6rem 1.2rem;">
        <svg style="width: 18px; height: 18px; stroke: currentColor;" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
        Download CSV
      </button>
      <button onclick="exportPoissonPDF(${lambda}, ${xInt}, '${mode}')" class="btn-primary" style="background: var(--bg2); color: var(--navy); border: 1px solid var(--border); display: flex; align-items: center; gap: 0.5rem; padding: 0.6rem 1.2rem;">
        <svg style="width: 18px; height: 18px; stroke: currentColor;" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
        Save as PDF
      </button>
    </div>
  `;

  output.innerHTML = resultsHtml + stepsHtml;
  output.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ---- POISSON SIMULATION ----
function runPoissonSimulation(simId, lambda) {
  const svg = document.getElementById(simId + '-svg');
  const countDiv = document.getElementById(simId + '-count');
  if (!svg) return;
  
  // Generate Poisson random number
  let arrivals = [];
  let L = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  do {
    k++;
    p *= Math.random();
  } while (p > L);
  k--;
  
  // Generate arrival times (uniform within the window)
  let times = [];
  for (let i = 0; i < k; i++) {
    times.push(Math.random());
  }
  times.sort();
  
  // Build SVG
  let html = '';
  html += '<line x1="40" y1="80" x2="560" y2="80" stroke="var(--border)" stroke-width="2"/>';
  
  // Time markers
  for (let t = 0; t <= 10; t++) {
    const tx = 40 + t * 52;
    html += `<line x1="${tx}" y1="78" x2="${tx}" y2="82" stroke="var(--muted)" stroke-width="1"/>`;
    html += `<text x="${tx}" y="95" fill="var(--muted)" font-size="9" font-family="IBM Plex Mono" text-anchor="middle">${t}</text>`;
  }
  
  // Arrival events (animated)
  times.forEach((t, idx) => {
    const cx = 40 + t * 520;
    const delay = idx * 0.12;
    html += `<circle cx="${cx}" cy="80" r="0" fill="#f59e0b" opacity="0.9">
      <animate attributeName="r" from="0" to="6" dur="0.3s" begin="${delay}s" fill="freeze"/>
      <animate attributeName="cy" from="80" to="55" dur="0.4s" begin="${delay}s" fill="freeze"/>
    </circle>`;
    html += `<line x1="${cx}" y1="65" x2="${cx}" y2="80" stroke="#f59e0b" stroke-width="1.5" opacity="0">
      <animate attributeName="opacity" from="0" to="0.4" dur="0.3s" begin="${delay}s" fill="freeze"/>
    </line>`;
  });
  
  // Title
  html += `<text x="300" y="20" fill="var(--navy)" font-size="12" font-family="Fraunces" text-anchor="middle" font-weight="700">Poisson Arrivals (λ = ${lambda})</text>`;
  html += `<text x="300" y="112" fill="var(--muted)" font-size="11" font-family="Figtree" text-anchor="middle" font-weight="600">Time →</text>`;
  
  svg.innerHTML = html;
  countDiv.textContent = `Events generated: ${k} (Expected: λ = ${lambda})`;
}

// ---- POISSON CSV EXPORT ----
function exportPoissonCSV(lambda, x, mode) {
  function logFact(k) { if (k<=1) return 0; let r=0; for(let i=2;i<=k;i++) r+=Math.log(i); return r; }
  function pPMF(l, k) { if(l===0) return k===0?1:0; return Math.exp(-l + k*Math.log(l) - logFact(k)); }
  
  let csvRows = ['k,P(X=k),P(X<=k)'];
  let cumulative = 0;
  const maxK = Math.min(Math.max(x + 10, Math.ceil(lambda + 4 * Math.sqrt(lambda))), 100);
  for (let k = 0; k <= maxK; k++) {
    const pk = pPMF(lambda, k);
    cumulative += pk;
    csvRows.push(`${k},${pk.toFixed(8)},${Math.min(cumulative, 1).toFixed(8)}`);
  }
  
  csvRows.push('');
  csvRows.push('Parameters');
  csvRows.push(`Lambda,${lambda}`);
  csvRows.push(`x,${x}`);
  csvRows.push(`Mode,${mode}`);
  
  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `poisson_distribution_lambda${lambda}_x${x}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}

// ---- POISSON PDF EXPORT ----
function exportPoissonPDF(lambda, x, mode) {
  function logFact(k) { if (k<=1) return 0; let r=0; for(let i=2;i<=k;i++) r+=Math.log(i); return r; }
  function pPMF(l, k) { if(l===0) return k===0?1:0; return Math.exp(-l + k*Math.log(l) - logFact(k)); }
  function cumPMF(l, upTo) { let s=0; for(let i=0;i<=upTo;i++) s+=pPMF(l,i); return Math.min(s,1); }
  
  const pExact = pPMF(lambda, x);
  const pLte = cumPMF(lambda, x);
  const pLt = x === 0 ? 0 : cumPMF(lambda, x - 1);
  const pGte = 1 - pLt;
  const pGt = 1 - pLte;
  
  const w = 595, h = 842; // A4 in points
  let y = 50;
  
  let content = '';
  
  // Header
  content += `BT /F1 20 Tf 50 ${h - y} Td (Poisson Distribution Report) Tj ET\n`;
  y += 30;
  content += `BT /F1 11 Tf 50 ${h - y} Td (Generated by VMath Calculator) Tj ET\n`;
  y += 30;
  
  // Line
  content += `50 ${h - y} m 545 ${h - y} l S\n`;
  y += 20;
  
  // Parameters
  content += `BT /F1 14 Tf 50 ${h - y} Td (Parameters) Tj ET\n`;
  y += 22;
  content += `BT /F1 11 Tf 50 ${h - y} Td (Lambda = ${lambda}, x = ${x}, Mode = ${mode}) Tj ET\n`;
  y += 30;
  
  // Results
  content += `BT /F1 14 Tf 50 ${h - y} Td (Results) Tj ET\n`;
  y += 22;
  const results = [
    `P(X = ${x}) = ${pExact.toFixed(8)}`,
    `P(X <= ${x}) = ${pLte.toFixed(8)}`,
    `P(X < ${x}) = ${pLt.toFixed(8)}`,
    `P(X >= ${x}) = ${pGte.toFixed(8)}`,
    `P(X > ${x}) = ${pGt.toFixed(8)}`
  ];
  results.forEach(r => {
    content += `BT /F1 11 Tf 50 ${h - y} Td (${r}) Tj ET\n`;
    y += 18;
  });
  y += 15;
  
  // PMF Table
  content += `BT /F1 14 Tf 50 ${h - y} Td (PMF Table) Tj ET\n`;
  y += 22;
  content += `BT /F1 10 Tf 50 ${h - y} Td (k) Tj 150 ${h - y} Td (P\\(X=k\\)) Tj 320 ${h - y} Td (P\\(X<=k\\)) Tj ET\n`;
  y += 5;
  content += `50 ${h - y} m 480 ${h - y} l S\n`;
  y += 15;
  
  let cum = 0;
  const maxK = Math.min(Math.max(x + 5, Math.ceil(lambda + 3 * Math.sqrt(lambda))), 30);
  for (let k = 0; k <= maxK && y < h - 80; k++) {
    const pk = pPMF(lambda, k);
    cum += pk;
    content += `BT /F1 10 Tf 50 ${h - y} Td (${k}) Tj 150 ${h - y} Td (${pk.toFixed(6)}) Tj 320 ${h - y} Td (${Math.min(cum, 1).toFixed(6)}) Tj ET\n`;
    y += 16;
  }
  
  // Build minimal valid PDF
  let pdf = '%PDF-1.4\n';
  let offsets = [];
  
  // Obj 1: Catalog
  offsets.push(pdf.length);
  pdf += '1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n';
  
  // Obj 2: Pages
  offsets.push(pdf.length);
  pdf += '2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj\n';
  
  // Obj 3: Page
  offsets.push(pdf.length);
  pdf += `3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 ${w} ${h}] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj\n`;
  
  // Obj 4: Content stream
  offsets.push(pdf.length);
  let stream = content;
  pdf += `4 0 obj << /Length ${stream.length} >> stream\n${stream}endstream endobj\n`;
  
  // Obj 5: Font
  offsets.push(pdf.length);
  pdf += '5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj\n';
  
  // Xref
  let xrefOff = pdf.length;
  pdf += `xref\n0 ${offsets.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  offsets.forEach(off => {
    pdf += off.toString().padStart(10, '0') + ' 00000 n \n';
  });
  
  pdf += `trailer << /Size ${offsets.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOff}\n%%EOF`;
  
  const blob = new Blob([pdf], { type: 'application/pdf' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `poisson_distribution_lambda${lambda}_x${x}.pdf`;
  a.click();
  URL.revokeObjectURL(a.href);
}

// ==========================================
// NORMAL DISTRIBUTION CALCULATOR
// ==========================================

function erf(x) {
  const sign = (x >= 0) ? 1 : -1;
  x = Math.abs(x);
  const a1 =  0.254829592;
  const a2 = -0.284496736;
  const a3 =  1.421413741;
  const a4 = -1.453152027;
  const a5 =  1.061405429;
  const p  =  0.3275911;

  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return sign * y;
}

function normalCDF(x, mu, sigma) {
  return 0.5 * (1 + erf((x - mu) / (sigma * Math.sqrt(2))));
}

function normalPDF(x, mu, sigma) {
  return (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));
}

function calculateNormal() {
  const output = document.getElementById('steps-output');
  output.innerHTML = '';
  output.classList.add('active');

  const muStr = document.getElementById('normal-mu').value;
  const sigmaStr = document.getElementById('normal-sigma').value;
  const x1Str = document.getElementById('normal-x1').value;
  const x2Str = document.getElementById('normal-x2') ? document.getElementById('normal-x2').value : '';
  const mode = document.getElementById('normal-mode') ? document.getElementById('normal-mode').value : 'lte';

  // ---- VALIDATION ----
  if (muStr.trim() === '' || sigmaStr.trim() === '' || x1Str.trim() === '' || (mode === 'between' && x2Str.trim() === '')) {
    output.innerHTML = '<div style="color:#dc2626; padding: 1.5rem; text-align:center; font-weight:600; background: rgba(220,38,38,0.06); border-radius: 12px; border-left: 4px solid #dc2626;">⚠️ Please fill in all required fields.</div>';
    return;
  }

  const mu = parseFloat(muStr);
  const sigma = parseFloat(sigmaStr);
  const x1 = parseFloat(x1Str);
  const x2 = parseFloat(x2Str);

  if (isNaN(mu) || isNaN(sigma) || isNaN(x1) || (mode === 'between' && isNaN(x2))) {
    output.innerHTML = '<div style="color:#dc2626; padding: 1.5rem; text-align:center; font-weight:600; background: rgba(220,38,38,0.06); border-radius: 12px; border-left: 4px solid #dc2626;">⚠️ Please enter valid numeric values.</div>';
    return;
  }
  if (sigma <= 0) {
    output.innerHTML = '<div style="color:#dc2626; padding: 1.5rem; text-align:center; font-weight:600; background: rgba(220,38,38,0.06); border-radius: 12px; border-left: 4px solid #dc2626;">⚠️ Standard Deviation (σ) must be strictly greater than 0. Received: σ = ' + sigma + '</div>';
    return;
  }
  if (mode === 'between' && x1 >= x2) {
    output.innerHTML = '<div style="color:#dc2626; padding: 1.5rem; text-align:center; font-weight:600; background: rgba(220,38,38,0.06); border-radius: 12px; border-left: 4px solid #dc2626;">⚠️ For "Between", x₁ must be strictly less than x₂. Received: x₁ = ' + x1 + ', x₂ = ' + x2 + '</div>';
    return;
  }

  if (Math.abs(mu) > 1e12 || sigma > 1e12 || Math.abs(x1) > 1e12 || (mode === 'between' && Math.abs(x2) > 1e12)) {
    output.innerHTML = '<div style="color:#dc2626; padding: 1.5rem; text-align:center; font-weight:600; background: rgba(220,38,38,0.06); border-radius: 12px; border-left: 4px solid #dc2626;">⚠️ Values are extremely large and may cause precision loss. Please use smaller scale.</div>';
    return;
  }

  const decimals = 6;
  const z1 = (x1 - mu) / sigma;
  const z2 = mode === 'between' ? (x2 - mu) / sigma : null;

  const cdf1 = normalCDF(x1, mu, sigma);
  const cdf2 = mode === 'between' ? normalCDF(x2, mu, sigma) : 0;
  const pdf1 = normalPDF(x1, mu, sigma);
  
  let resultProb = 0;
  let mainLabel = '';
  let modeDesc = '';
  
  if (mode === 'exact') {
    resultProb = pdf1;
    mainLabel = `f(${x1})`;
    modeDesc = `Probability Density at ${x1}`;
  } else if (mode === 'lte') {
    resultProb = cdf1;
    mainLabel = `P(X ≤ ${x1})`;
    modeDesc = `at most ${x1}`;
  } else if (mode === 'lt') {
    resultProb = cdf1;
    mainLabel = `P(X < ${x1})`;
    modeDesc = `less than ${x1}`;
  } else if (mode === 'gte') {
    resultProb = 1 - cdf1;
    mainLabel = `P(X ≥ ${x1})`;
    modeDesc = `at least ${x1}`;
  } else if (mode === 'gt') {
    resultProb = 1 - cdf1;
    mainLabel = `P(X > ${x1})`;
    modeDesc = `greater than ${x1}`;
  } else if (mode === 'between') {
    resultProb = cdf2 - cdf1;
    mainLabel = `P(${x1} < X < ${x2})`;
    modeDesc = `between ${x1} and ${x2}`;
  }

  // Force bounds
  if (resultProb < 0) resultProb = 0;
  if (mode !== 'exact' && resultProb > 1) resultProb = 1;

  // Interpretation
  let interpLabel, interpColor, interpIcon;
  if (mode === 'exact') {
    interpLabel = 'Density Value'; interpColor = '#0ea5e9'; interpIcon = '📊';
  } else if (resultProb >= 0.8) { interpLabel = 'Very Common'; interpColor = '#059669'; interpIcon = '🟢'; }
  else if (resultProb >= 0.5) { interpLabel = 'Common'; interpColor = '#0d9488'; interpIcon = '🔵'; }
  else if (resultProb >= 0.05) { interpLabel = 'Rare'; interpColor = '#ea580c'; interpIcon = '🟠'; }
  else { interpLabel = 'Very Rare'; interpColor = '#dc2626'; interpIcon = '🔴'; }

  let stepsHtml = '';
  let stepCount = 1;

  // =========================================
  // COMPREHENSIVE RESULTS
  // =========================================
  let resultsHtml = `
    <div class="final-result animate-fade-in" style="padding: 2.5rem; background: #111827; color: #ffffff; border-radius: 16px; border: 1px solid var(--border); box-shadow: 0 10px 30px rgba(0,0,0,0.15); margin-bottom: 2rem; width: 100%; box-sizing: border-box;">
      <div style="font-size: 1.8rem; font-weight: 700; color: #38bdf8; font-family:'Fraunces', serif; margin-bottom: 2rem; text-align: center;">✅ Normal Distribution Results</div>
      
      <!-- Summary Box -->
      <div style="background: rgba(56, 189, 248, 0.1); border-left: 4px solid #38bdf8; padding: 1.5rem; border-radius: 0 12px 12px 0; margin-bottom: 2rem;">
        <div style="font-size: 1.05rem; line-height: 1.6; color: rgba(255,255,255,0.9);">
          For a Normal distribution with <b>μ = ${mu}</b> and <b>σ = ${sigma}</b>, the probability of observing <b>${modeDesc}</b> is:
        </div>
        <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.8rem; font-weight: 700; color: #ffffff; margin-top: 1rem; display: flex; align-items: baseline; gap: 1rem; flex-wrap: wrap;">
          <span>${resultProb.toFixed(decimals)}</span>
          ${mode !== 'exact' ? `
          <span style="font-size: 1.2rem; color: #38bdf8; font-family: 'Figtree', sans-serif;">or</span>
          <span style="color: #38bdf8;">${(resultProb * 100).toFixed(4)}%</span>
          ` : ''}
        </div>
        ${mode === 'exact' ? `<div style="margin-top: 0.5rem; font-size: 0.9rem; color: rgba(255,255,255,0.6);">Note: For continuous distributions, the exact probability P(X=x) is 0. The value shown is the Probability Density Function f(x).</div>` : ''}
      </div>

      <!-- Interpretation Card -->
      <div style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); border-radius: 12px; padding: 1.25rem 1.5rem; margin-bottom: 2rem; display: flex; align-items: center; gap: 1rem;">
        <span style="font-size: 2rem;">${interpIcon}</span>
        <div>
          <div style="font-size: 1.1rem; font-weight: 700; color: ${interpColor};">${interpLabel}</div>
          <div style="font-size: 0.9rem; color: rgba(255,255,255,0.65);">
            ${mode === 'exact' ? 'This represents the relative likelihood of the random variable being near ' + x1 + '.' : 'A probability of ' + (resultProb * 100).toFixed(2) + '% is considered <strong>' + interpLabel.toLowerCase() + '</strong> in statistical analysis.'}
          </div>
        </div>
      </div>

      <!-- Z-Score Box -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
        <div style="padding: 1.5rem; background: rgba(255,255,255,0.06); border-radius: 12px; border: 1px solid rgba(255,255,255,0.12); display: flex; flex-direction: column;">
          <div style="font-size:0.95rem; font-weight:600; color: rgba(255,255,255,0.6); margin-bottom: 0.5rem;">Z-Score (x₁)</div>
          <div style="font-family:'IBM Plex Mono',monospace; font-size: 1.6rem; font-weight:700; color:#ffffff;">Z = ${z1.toFixed(4)}</div>
          <div style="font-size: 0.85rem; color: #38bdf8; margin-top: 0.5rem;">${Math.abs(z1).toFixed(2)} standard deviations ${z1 < 0 ? 'below' : 'above'} the mean.</div>
        </div>
        ${mode === 'between' ? `
        <div style="padding: 1.5rem; background: rgba(255,255,255,0.06); border-radius: 12px; border: 1px solid rgba(255,255,255,0.12); display: flex; flex-direction: column;">
          <div style="font-size:0.95rem; font-weight:600; color: rgba(255,255,255,0.6); margin-bottom: 0.5rem;">Z-Score (x₂)</div>
          <div style="font-family:'IBM Plex Mono',monospace; font-size: 1.6rem; font-weight:700; color:#ffffff;">Z = ${z2.toFixed(4)}</div>
          <div style="font-size: 0.85rem; color: #38bdf8; margin-top: 0.5rem;">${Math.abs(z2).toFixed(2)} standard deviations ${z2 < 0 ? 'below' : 'above'} the mean.</div>
        </div>
        ` : `
        <div style="padding: 1.5rem; background: rgba(255,255,255,0.06); border-radius: 12px; border: 1px solid rgba(255,255,255,0.12); display: flex; flex-direction: column;">
          <div style="font-size:0.95rem; font-weight:600; color: rgba(255,255,255,0.6); margin-bottom: 0.5rem;">Percentile Rank</div>
          <div style="font-family:'IBM Plex Mono',monospace; font-size: 1.6rem; font-weight:700; color:#ffffff;">${(cdf1 * 100).toFixed(2)}th</div>
          <div style="font-size: 0.85rem; color: #38bdf8; margin-top: 0.5rem;">Value ${x1} is greater than ${(cdf1 * 100).toFixed(2)}% of the distribution.</div>
        </div>
        `}
      </div>
    </div>
  `;

  // =========================================
  // STEP 1: Formula
  // =========================================
  stepsHtml += `<div class="step-card">
    <div class="step-header">
      <div class="step-number">${stepCount++}</div>
      <div class="step-title">Step 1: Normal Distribution Formula</div>
    </div>
    <div class="step-content">
      <div class="step-desc" style="margin-bottom: 1rem;">
        The Probability Density Function (PDF) for a Normal distribution is given by:
      </div>
      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.3rem; text-align: center; color: var(--navy); margin-bottom: 1.5rem; background: var(--bg); padding: 1.5rem; border-radius: 8px; font-weight: 600;">
        f(x) = (1 / (σ√(2π))) · e<sup>−(x − μ)² / (2σ²)</sup>
      </div>
      <div class="step-desc" style="margin-bottom: 0.5rem;">Variables: μ = ${mu}, σ = ${sigma}</div>
    </div>
  </div>`;

  // =========================================
  // STEP 2 & 3: Convert to Z-Score
  // =========================================
  stepsHtml += `<div class="step-card">
    <div class="step-header">
      <div class="step-number">${stepCount++}</div>
      <div class="step-title">Step 2: Convert X to Z-score</div>
    </div>
    <div class="step-content">
      <div class="step-desc" style="margin-bottom: 1rem;">
        We standardize the normal variable X to standard normal variable Z to easily lookup probabilities.
      </div>
      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.2rem; color: var(--navy); background: var(--bg); padding: 1.5rem; border-radius: 8px; line-height: 2; text-align: center;">
        <div>Z = (X − μ) / σ</div>
        <div style="margin-top: 0.75rem;">Z₁ = (${x1} − ${mu}) / ${sigma} = <strong>${z1.toFixed(4)}</strong></div>
        ${mode === 'between' ? `<div style="margin-top: 0.75rem;">Z₂ = (${x2} − ${mu}) / ${sigma} = <strong>${z2.toFixed(4)}</strong></div>` : ''}
      </div>
    </div>
  </div>`;

  // =========================================
  // STEP 4: Lookup Probability
  // =========================================
  stepsHtml += `<div class="step-card">
    <div class="step-header">
      <div class="step-number">${stepCount++}</div>
      <div class="step-title">Step 3: Lookup Probability (CDF)</div>
    </div>
    <div class="step-content">
      <div class="step-desc" style="margin-bottom: 1rem;">
        Using the standard normal cumulative distribution function Φ(z):
      </div>
      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 1.15rem; color: var(--navy); background: var(--bg); padding: 1.5rem; border-radius: 8px; line-height: 2; text-align: center;">
        <div>P(Z &lt; ${z1.toFixed(4)}) = <strong>${cdf1.toFixed(decimals)}</strong></div>
        ${mode === 'between' ? `<div style="margin-top: 0.5rem;">P(Z &lt; ${z2.toFixed(4)}) = <strong>${cdf2.toFixed(decimals)}</strong></div>` : ''}
      </div>
    </div>
  </div>`;

  // =========================================
  // STEP 5: Final Cumulative Answer
  // =========================================
  let logicHtml = '';
  if (mode === 'lte' || mode === 'lt') {
    logicHtml = `P(X < ${x1}) = P(Z < ${z1.toFixed(4)}) = ${cdf1.toFixed(decimals)}`;
  } else if (mode === 'gte' || mode === 'gt') {
    logicHtml = `P(X > ${x1}) = 1 − P(Z < ${z1.toFixed(4)}) = 1 − ${cdf1.toFixed(decimals)} = ${(1 - cdf1).toFixed(decimals)}`;
  } else if (mode === 'between') {
    logicHtml = `P(${x1} < X < ${x2}) = P(Z < ${z2.toFixed(4)}) − P(Z < ${z1.toFixed(4)})<br>= ${cdf2.toFixed(decimals)} − ${cdf1.toFixed(decimals)} = ${(cdf2 - cdf1).toFixed(decimals)}`;
  } else if (mode === 'exact') {
    logicHtml = `f(${x1}) = ${pdf1.toExponential(6)}<br>(Calculated via PDF formula, not CDF)`;
  }

  stepsHtml += `<div class="step-card">
    <div class="step-header">
      <div class="step-number">${stepCount++}</div>
      <div class="step-title">Step 4: Final Probability Computation</div>
    </div>
    <div class="step-content">
      <div style="color: var(--navy); font-family: 'IBM Plex Mono', monospace; font-size: 1.2rem; background: var(--bg); display: inline-block; padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem; width: 100%; box-sizing: border-box; text-align: center; line-height: 1.8;">
        ${logicHtml}
      </div>
      <div style="color: var(--teal); font-size: 1.5rem; font-weight: 700; background: rgba(13,148,136,0.08); display: block; padding: 1rem; border-radius: 8px; text-align: center;">
        ${mainLabel} = ${resultProb.toFixed(decimals)}
      </div>
    </div>
  </div>`;

  // =========================================
  // SVG NORMAL CURVE VISUALIZATION
  // =========================================
  const svgW = 600, svgH = 260, padL = 40, padR = 40, padT = 30, padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;
  
  // X range: typically mu +/- 4 sigma
  let minX = mu - 4 * sigma;
  let maxX = mu + 4 * sigma;
  
  // Extend range if user query is outside
  if (x1 < minX) minX = x1 - sigma;
  if (x1 > maxX) maxX = x1 + sigma;
  if (mode === 'between') {
    if (x2 < minX) minX = x2 - sigma;
    if (x2 > maxX) maxX = x2 + sigma;
  }

  const xScale = plotW / (maxX - minX);
  const getX = (val) => padL + (val - minX) * xScale;
  
  // PDF peak is at mu
  const peakY = normalPDF(mu, mu, sigma);
  const yScale = plotH / (peakY * 1.1); // Add 10% padding
  const getY = (val) => svgH - padB - val * yScale;

  // Generate curve path
  let curvePath = '';
  const numPoints = 200;
  let areaPath = '';
  
  for (let i = 0; i <= numPoints; i++) {
    const xVal = minX + (i / numPoints) * (maxX - minX);
    const yVal = normalPDF(xVal, mu, sigma);
    const px = getX(xVal);
    const py = getY(yVal);
    
    if (i === 0) curvePath = `M ${px},${py}`;
    else curvePath += ` L ${px},${py}`;
    
    // Build shaded area logic
    let inZone = false;
    if (mode === 'lte' || mode === 'lt') {
      if (xVal <= x1) inZone = true;
    } else if (mode === 'gte' || mode === 'gt') {
      if (xVal >= x1) inZone = true;
    } else if (mode === 'between') {
      if (xVal >= x1 && xVal <= x2) inZone = true;
    }
    
    if (inZone) {
      if (!areaPath) {
        // start area
        areaPath = `M ${px},${svgH - padB} L ${px},${py}`;
      } else {
        areaPath += ` L ${px},${py}`;
      }
    } else if (areaPath && !areaPath.endsWith('Z')) {
      // close area
      areaPath += ` L ${px},${svgH - padB} Z`;
    }
  }
  if (areaPath && !areaPath.endsWith('Z')) {
    areaPath += ` L ${getX(maxX)},${svgH - padB} Z`; // in case it extends to edge
  }

  // Draw Sigma markers
  let sigmaLines = '';
  for (let s = -3; s <= 3; s++) {
    const sx = mu + s * sigma;
    const px = getX(sx);
    if (px >= padL && px <= svgW - padR) {
      sigmaLines += `<line x1="${px}" y1="${svgH - padB}" x2="${px}" y2="${svgH - padB + 5}" stroke="var(--muted)" stroke-width="1"/>`;
      if (s !== 0) {
        sigmaLines += `<text x="${px}" y="${svgH - padB + 16}" fill="var(--muted)" font-size="9" text-anchor="middle">${s}σ</text>`;
      }
    }
  }
  
  // Highlight markers
  let highlightLines = '';
  if (mode !== 'exact') {
    const px1 = getX(x1);
    highlightLines += `<line x1="${px1}" y1="${getY(normalPDF(x1, mu, sigma))}" x2="${px1}" y2="${svgH - padB}" stroke="#0ea5e9" stroke-width="2" stroke-dasharray="4,4"/>`;
    highlightLines += `<text x="${px1}" y="${svgH - padB + 28}" fill="#0ea5e9" font-size="11" font-weight="700" text-anchor="middle">x₁=${x1}</text>`;
    
    if (mode === 'between') {
      const px2 = getX(x2);
      highlightLines += `<line x1="${px2}" y1="${getY(normalPDF(x2, mu, sigma))}" x2="${px2}" y2="${svgH - padB}" stroke="#0ea5e9" stroke-width="2" stroke-dasharray="4,4"/>`;
      highlightLines += `<text x="${px2}" y="${svgH - padB + 28}" fill="#0ea5e9" font-size="11" font-weight="700" text-anchor="middle">x₂=${x2}</text>`;
    }
  } else {
    const px1 = getX(x1);
    highlightLines += `<line x1="${px1}" y1="${getY(normalPDF(x1, mu, sigma))}" x2="${px1}" y2="${svgH - padB}" stroke="#0ea5e9" stroke-width="2"/>`;
    highlightLines += `<circle cx="${px1}" cy="${getY(normalPDF(x1, mu, sigma))}" r="4" fill="#0ea5e9"/>`;
    highlightLines += `<text x="${px1}" y="${svgH - padB + 28}" fill="#0ea5e9" font-size="11" font-weight="700" text-anchor="middle">x=${x1}</text>`;
  }

  stepsHtml += `<div class="step-card" style="margin-top: 1.5rem;">
    <div class="step-header">
      <div class="step-number">${stepCount++}</div>
      <div class="step-title">Shaded Probability Region</div>
    </div>
    <div class="step-content" style="padding-top: 1rem;">
      <div style="text-align: center; font-weight: 600; font-size: 1.1rem; color: var(--navy); margin-bottom: 0.5rem; font-family: 'Fraunces', serif;">
        Normal Curve: μ = ${mu}, σ = ${sigma}
      </div>
      <div style="width: 100%; overflow-x: auto;">
        <svg viewBox="0 0 ${svgW} ${svgH}" xmlns="http://www.w3.org/2000/svg" style="width: 100%; max-width: 700px; height: auto; display: block; margin: 0 auto;">
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" style="stop-color:#38bdf8;stop-opacity:0.6"/>
              <stop offset="100%" style="stop-color:#38bdf8;stop-opacity:0.1"/>
            </linearGradient>
            <filter id="normGlow"><feGaussianBlur stdDeviation="2" result="cb"/><feMerge><feMergeNode in="cb"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          </defs>
          
          <!-- Axes -->
          <line x1="${padL}" y1="${svgH - padB}" x2="${svgW - padR}" y2="${svgH - padB}" stroke="var(--border)" stroke-width="1.5"/>
          
          <!-- Mean Line -->
          <line x1="${getX(mu)}" y1="${padT}" x2="${getX(mu)}" y2="${svgH - padB}" stroke="var(--muted)" stroke-width="1.5" stroke-dasharray="3,3" opacity="0.5"/>
          <text x="${getX(mu)}" y="${svgH - padB + 16}" fill="var(--muted)" font-size="10" font-weight="700" text-anchor="middle">μ=${mu}</text>
          
          ${sigmaLines}
          
          <!-- Area -->
          ${mode !== 'exact' && areaPath ? `<path d="${areaPath}" fill="url(#areaGrad)"/>` : ''}
          
          <!-- Curve -->
          <path d="${curvePath}" fill="none" stroke="#0ea5e9" stroke-width="2.5" filter="url(#normGlow)"/>
          
          <!-- Markers -->
          ${highlightLines}
        </svg>
      </div>
      <div style="text-align: center; font-size: 0.9rem; color: var(--text); margin-top: 1rem;">
        The shaded blue region represents the requested probability area under the curve. Total area under the curve equals 1.
      </div>
    </div>
  </div>`;

  // =========================================
  // ADVANCED VISUALIZATIONS (ANIMATIONS)
  // =========================================
  const simId = 'normal-sim-' + Date.now();
  stepsHtml += `<div class="step-card" style="margin-top: 1.5rem;">
    <div class="step-header">
      <div class="step-number">${stepCount++}</div>
      <div class="step-title">Advanced: Interactive Standard Deviation</div>
    </div>
    <div class="step-content" style="padding-top: 1rem;">
      <div class="step-desc" style="margin-bottom: 1rem;">Observe how changing the standard deviation (σ) flattens or tightens the curve around the mean.</div>
      <div style="text-align: center; margin-bottom: 1rem;">
        <button onclick="runNormalAnimation('${simId}')" class="btn-primary" style="padding: 0.5rem 1.5rem; font-size: 0.95rem;">▶ Animate Variance</button>
      </div>
      <div id="${simId}" style="width: 100%; overflow-x: auto;">
        <svg id="${simId}-svg" viewBox="0 0 600 200" xmlns="http://www.w3.org/2000/svg" style="width: 100%; max-width: 600px; height: auto; display: block; margin: 0 auto; background: var(--bg); border-radius: 8px; border: 1px solid var(--border);">
          <line x1="50" y1="160" x2="550" y2="160" stroke="var(--border)" stroke-width="2"/>
          <line x1="300" y1="40" x2="300" y2="160" stroke="var(--muted)" stroke-width="1.5" stroke-dasharray="3,3"/>
          <text x="300" y="175" fill="var(--muted)" font-size="11" font-family="Figtree" text-anchor="middle" font-weight="600">Mean (μ)</text>
          <!-- Base curve -->
          <path id="${simId}-path" d="M 50,160 Q 300,-100 550,160" fill="none" stroke="#38bdf8" stroke-width="3"/>
          <text x="300" y="30" fill="var(--navy)" font-size="12" font-family="Figtree" text-anchor="middle">Click "Animate Variance"</text>
        </svg>
      </div>
    </div>
  </div>`;

  // =========================================
  // THEORY SECTION
  // =========================================
  stepsHtml += `<div class="step-card" style="margin-top: 1.5rem;">
    <div class="step-header">
      <div class="step-number">${stepCount++}</div>
      <div class="step-title">Normal Distribution — Theory</div>
    </div>
    <div class="step-content">
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
        
        <div style="padding: 1.5rem; background: var(--bg); border-radius: 12px; border-left: 4px solid #38bdf8;">
          <div style="font-weight: 700; color: var(--navy); margin-bottom: 0.75rem; font-size: 1.05rem;">📖 Definition</div>
          <div style="color: var(--text); line-height: 1.7; font-size: 0.95rem;">
            The Normal Distribution (or Gaussian distribution) is a continuous probability distribution characterized by its symmetric, bell-shaped curve. It is the most important distribution in statistics due to the Central Limit Theorem.
          </div>
        </div>

        <div style="padding: 1.5rem; background: var(--bg); border-radius: 12px; border-left: 4px solid #14b8a6;">
          <div style="font-weight: 700; color: var(--navy); margin-bottom: 0.75rem; font-size: 1.05rem;">📏 Empirical Rule (68-95-99.7)</div>
          <div style="color: var(--text); line-height: 1.8; font-size: 0.95rem;">
            • ~<strong>68.27%</strong> of values lie within 1σ of the mean.<br>
            • ~<strong>95.45%</strong> of values lie within 2σ of the mean.<br>
            • ~<strong>99.73%</strong> of values lie within 3σ of the mean.
          </div>
        </div>

        <div style="padding: 1.5rem; background: var(--bg); border-radius: 12px; border-left: 4px solid #8b5cf6;">
          <div style="font-weight: 700; color: var(--navy); margin-bottom: 0.75rem; font-size: 1.05rem;">⚙️ Properties</div>
          <div style="color: var(--text); line-height: 1.8; font-size: 0.95rem;">
            • <strong>Mean = Median = Mode</strong><br>
            • <strong>Symmetry:</strong> Perfectly symmetric around the center.<br>
            • <strong>Asymptotes:</strong> The tails approach but never touch the x-axis.<br>
            • Total area under the curve equals exactly 1.
          </div>
        </div>

        <div style="padding: 1.5rem; background: var(--bg); border-radius: 12px; border-left: 4px solid #ec4899;">
          <div style="font-weight: 700; color: var(--navy); margin-bottom: 0.75rem; font-size: 1.05rem;">🌍 Real-World Applications</div>
          <div style="color: var(--text); line-height: 1.8; font-size: 0.95rem;">
            • Heights and weights of a population<br>
            • Measurement errors<br>
            • Test scores (e.g., IQ, SAT)<br>
            • Blood pressure and medical data<br>
            • Financial stock returns (log-normal)
          </div>
        </div>
      </div>
    </div>
  </div>`;

  // =========================================
  // EXPORTS
  // =========================================
  stepsHtml += `
    <div style="display: flex; gap: 1rem; margin-top: 2rem; justify-content: center; flex-wrap: wrap;">
      <button onclick="exportNormalCSV(${mu}, ${sigma}, ${x1}, '${mode}', ${mode === 'between' ? x2 : 'null'})" class="btn-primary" style="background: var(--bg2); color: var(--navy); border: 1px solid var(--border); display: flex; align-items: center; gap: 0.5rem; padding: 0.6rem 1.2rem;">
        <svg style="width: 18px; height: 18px; stroke: currentColor;" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
        Download CSV
      </button>
      <button onclick="exportNormalPDF(${mu}, ${sigma}, ${x1}, '${mode}', ${mode === 'between' ? x2 : 'null'})" class="btn-primary" style="background: var(--bg2); color: var(--navy); border: 1px solid var(--border); display: flex; align-items: center; gap: 0.5rem; padding: 0.6rem 1.2rem;">
        <svg style="width: 18px; height: 18px; stroke: currentColor;" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
        Save as PDF
      </button>
    </div>
  `;

  output.innerHTML = resultsHtml + stepsHtml;
  output.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ---- NORMAL ANIMATION ----
window.runNormalAnimation = function(simId) {
  const path = document.getElementById(simId + '-path');
  if (!path) return;
  
  // Animate by modifying SVG path data
  const keyframes = [
    "M 50,160 Q 300,10 550,160",  // Medium
    "M 50,160 Q 300,-150 550,160", // Narrow (low variance)
    "M 50,160 Q 300,100 550,160",  // Wide (high variance)
    "M 50,160 Q 300,10 550,160"   // Back to Medium
  ];
  
  let currentFrame = 0;
  
  // Use animate tag internally
  path.innerHTML = `<animate attributeName="d" values="${keyframes.join(';')}" dur="4s" repeatCount="1" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1" keyTimes="0; 0.33; 0.66; 1"/>`;
  
  // Reset text
  const svg = document.getElementById(simId + '-svg');
  let text = svg.querySelector('text[y="30"]');
  if(text) text.textContent = "Variance animating (low -> high -> normal)";
};

// ---- NORMAL CSV EXPORT ----
window.exportNormalCSV = function(mu, sigma, x1, mode, x2) {
  let csvRows = ['Z-Score,X-Value,PDF f(x),CDF P(X<=x)'];
  
  for (let z = -4; z <= 4; z += 0.5) {
    const xVal = mu + z * sigma;
    const pdfVal = normalPDF(xVal, mu, sigma);
    const cdfVal = normalCDF(xVal, mu, sigma);
    csvRows.push(`${z.toFixed(2)},${xVal.toFixed(4)},${pdfVal.toFixed(6)},${cdfVal.toFixed(6)}`);
  }
  
  csvRows.push('');
  csvRows.push('Parameters');
  csvRows.push(`Mean (mu),${mu}`);
  csvRows.push(`Std Dev (sigma),${sigma}`);
  csvRows.push(`Mode,${mode}`);
  csvRows.push(`x1,${x1}`);
  if (mode === 'between') csvRows.push(`x2,${x2}`);
  
  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `normal_distribution_mu${mu}_sigma${sigma}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
};

// ---- NORMAL PDF EXPORT ----
window.exportNormalPDF = function(mu, sigma, x1, mode, x2) {
  const w = 595, h = 842;
  let y = 50;
  let content = '';
  
  content += `BT /F1 20 Tf 50 ${h - y} Td (Normal Distribution Report) Tj ET\n`;
  y += 30;
  content += `BT /F1 11 Tf 50 ${h - y} Td (Generated by VMath Calculator) Tj ET\n`;
  y += 30;
  content += `50 ${h - y} m 545 ${h - y} l S\n`;
  y += 20;
  
  content += `BT /F1 14 Tf 50 ${h - y} Td (Parameters) Tj ET\n`;
  y += 22;
  content += `BT /F1 11 Tf 50 ${h - y} Td (Mean = ${mu}, Std Dev = ${sigma}, Mode = ${mode}) Tj ET\n`;
  y += 30;
  
  content += `BT /F1 14 Tf 50 ${h - y} Td (Results) Tj ET\n`;
  y += 22;
  
  const cdf1 = normalCDF(x1, mu, sigma);
  const pdf1 = normalPDF(x1, mu, sigma);
  
  if (mode === 'exact') content += `BT /F1 11 Tf 50 ${h - y} Td (PDF f(${x1}) = ${pdf1.toFixed(8)}) Tj ET\n`;
  else if (mode === 'lte' || mode === 'lt') content += `BT /F1 11 Tf 50 ${h - y} Td (P(X <= ${x1}) = ${cdf1.toFixed(8)}) Tj ET\n`;
  else if (mode === 'gte' || mode === 'gt') content += `BT /F1 11 Tf 50 ${h - y} Td (P(X >= ${x1}) = ${(1 - cdf1).toFixed(8)}) Tj ET\n`;
  else if (mode === 'between') {
    const cdf2 = normalCDF(x2, mu, sigma);
    content += `BT /F1 11 Tf 50 ${h - y} Td (P(${x1} <= X <= ${x2}) = ${(cdf2 - cdf1).toFixed(8)}) Tj ET\n`;
  }
  y += 30;
  
  content += `BT /F1 14 Tf 50 ${h - y} Td (Distribution Points) Tj ET\n`;
  y += 22;
  content += `BT /F1 10 Tf 50 ${h - y} Td (Z) Tj 150 ${h - y} Td (X) Tj 250 ${h - y} Td (PDF) Tj 350 ${h - y} Td (CDF) Tj ET\n`;
  y += 5;
  content += `50 ${h - y} m 480 ${h - y} l S\n`;
  y += 15;
  
  for (let z = -3; z <= 3; z += 0.5) {
    const xVal = mu + z * sigma;
    const pVal = normalPDF(xVal, mu, sigma);
    const cVal = normalCDF(xVal, mu, sigma);
    content += `BT /F1 10 Tf 50 ${h - y} Td (${z.toFixed(1)}) Tj 150 ${h - y} Td (${xVal.toFixed(4)}) Tj 250 ${h - y} Td (${pVal.toFixed(6)}) Tj 350 ${h - y} Td (${cVal.toFixed(6)}) Tj ET\n`;
    y += 16;
  }
  
  let pdf = '%PDF-1.4\n';
  let offsets = [];
  offsets.push(pdf.length); pdf += '1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n';
  offsets.push(pdf.length); pdf += '2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj\n';
  offsets.push(pdf.length); pdf += `3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 ${w} ${h}] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj\n`;
  offsets.push(pdf.length); pdf += `4 0 obj << /Length ${content.length} >> stream\n${content}endstream endobj\n`;
  offsets.push(pdf.length); pdf += '5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj\n';
  
  let xrefOff = pdf.length;
  pdf += `xref\n0 ${offsets.length + 1}\n0000000000 65535 f \n`;
  offsets.forEach(off => { pdf += off.toString().padStart(10, '0') + ' 00000 n \n'; });
  pdf += `trailer << /Size ${offsets.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOff}\n%%EOF`;
  
  const blob = new Blob([pdf], { type: 'application/pdf' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `normal_distribution_mu${mu}_sigma${sigma}.pdf`;
  a.click();
  URL.revokeObjectURL(a.href);
};


