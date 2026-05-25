
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

      // Category Filtering
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

          // Filter grid cards
          catCards.forEach(card => {
            const cardId = card.id.replace('cat-', '');
            if (catId === 'all') {
              card.style.display = 'block';
            } else {
              let match = false;
              if (catId === 'matrices' || catId === 'echelon') {
                match = (cardId === 'matrices');
              } else if (catId === 'eigen' || catId === 'diag') {
                match = (cardId === 'eigen');
              } else {
                match = (cardId === catId);
              }
              card.style.display = match ? 'block' : 'none';
            }
          });

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
    });
