class InteractiveGraph {
  constructor(containerId, options) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;
    
    this.container.innerHTML = '';
    this.container.style.position = 'relative';
    this.container.style.width = '100%';
    this.container.style.height = '400px';
    this.container.style.overflow = 'hidden';
    this.container.style.borderRadius = '12px';
    this.container.style.border = '1px solid var(--border)';
    this.container.style.background = 'var(--bg)';
    this.container.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.03)';
    
    this.canvas = document.createElement('canvas');
    this.canvas.style.display = 'block';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.ctx = this.canvas.getContext('2d');
    this.container.appendChild(this.canvas);
    
    this.tooltip = document.createElement('div');
    this.tooltip.style.position = 'absolute';
    this.tooltip.style.display = 'none';
    this.tooltip.style.background = 'var(--navy)';
    this.tooltip.style.color = '#fff';
    this.tooltip.style.padding = '8px 12px';
    this.tooltip.style.borderRadius = '6px';
    this.tooltip.style.fontSize = '12px';
    this.tooltip.style.fontFamily = "'IBM Plex Mono', monospace";
    this.tooltip.style.pointerEvents = 'none';
    this.tooltip.style.zIndex = '10';
    this.tooltip.style.whiteSpace = 'pre';
    this.tooltip.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    this.container.appendChild(this.tooltip);

    this.options = Object.assign({
      expr: 'x',
      root: 0,
      minX: -10,
      maxX: 10,
      minY: -10,
      maxY: 10,
      iterations: [],
      type: 'function',
      methodData: {}
    }, options);

    this.isDragging = false;
    this.lastMouse = { x: 0, y: 0 };
    this.mouseHover = { x: 0, y: 0, active: false };

    this.resize = this.resize.bind(this);
    window.addEventListener('resize', this.resize);
    
    this.setupEvents();
    this.resize();
    
    // Animation state
    this.animFrame = 0;
    this.maxFrames = this.options.iterations.length * 60; // 1 second per iteration
    if (this.maxFrames > 0) {
      this.animate();
    } else {
      this.draw();
    }
  }

  setupEvents() {
    const startDrag = (clientX, clientY) => {
      this.isDragging = true;
      this.lastMouse = { x: clientX, y: clientY };
      this.canvas.style.cursor = 'grabbing';
    };

    const endDrag = () => {
      this.isDragging = false;
      this.canvas.style.cursor = 'default';
    };

    const doDrag = (clientX, clientY) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseHover = { 
        x: clientX - rect.left, 
        y: clientY - rect.top, 
        active: true 
      };

      if (this.isDragging) {
        const dx = clientX - this.lastMouse.x;
        const dy = clientY - this.lastMouse.y;
        this.lastMouse = { x: clientX, y: clientY };
        
        const scaleX = (this.options.maxX - this.options.minX) / this.canvas.width;
        const scaleY = (this.options.maxY - this.options.minY) / this.canvas.height;
        
        this.options.minX -= dx * scaleX;
        this.options.maxX -= dx * scaleX;
        this.options.minY += dy * scaleY; // Y is inverted on canvas
        this.options.maxY += dy * scaleY;
        
        this.draw();
      } else {
        this.checkTooltip();
      }
    };

    // Mouse events
    this.canvas.addEventListener('mousedown', (e) => startDrag(e.clientX, e.clientY));
    window.addEventListener('mouseup', endDrag);
    this.canvas.addEventListener('mousemove', (e) => doDrag(e.clientX, e.clientY));

    // Touch events
    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        startDrag(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: false });
    
    window.addEventListener('touchend', endDrag);
    
    this.canvas.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1) {
        e.preventDefault(); // Prevent scrolling while panning the graph
        doDrag(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: false });

    this.canvas.addEventListener('mouseleave', () => {
      this.mouseHover.active = false;
      this.tooltip.style.display = 'none';
      this.draw();
    });

    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const mathX = this.screenToMathX(mouseX);
      const mathY = this.screenToMathY(mouseY);
      
      const zoomFactor = e.deltaY > 0 ? 1.1 : 0.9;
      
      const rangeX = this.options.maxX - this.options.minX;
      const rangeY = this.options.maxY - this.options.minY;
      
      this.options.minX = mathX - (mathX - this.options.minX) * zoomFactor;
      this.options.maxX = mathX + (this.options.maxX - mathX) * zoomFactor;
      this.options.minY = mathY - (mathY - this.options.minY) * zoomFactor;
      this.options.maxY = mathY + (this.options.maxY - mathY) * zoomFactor;
      
      this.draw();
    });
  }

  resize() {
    const rect = this.container.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
    this.draw();
  }

  screenToMathX(sx) {
    return this.options.minX + (sx / this.canvas.width) * (this.options.maxX - this.options.minX);
  }

  screenToMathY(sy) {
    return this.options.maxY - (sy / this.canvas.height) * (this.options.maxY - this.options.minY);
  }

  mathToScreenX(mx) {
    return ((mx - this.options.minX) / (this.options.maxX - this.options.minX)) * this.canvas.width;
  }

  mathToScreenY(my) {
    return this.canvas.height - ((my - this.options.minY) / (this.options.maxY - this.options.minY)) * this.canvas.height;
  }

  getThemeColors() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
      grid: isDark ? '#334155' : '#e2e8f0',
      axis: isDark ? '#94a3b8' : '#64748b',
      curve: isDark ? '#fbbf24' : '#d97706',
      text: isDark ? '#f8fafc' : '#0f172a',
      highlight: '#0d9488',
      danger: '#ef4444'
    };
  }

  animate() {
    if (this.animFrame < this.maxFrames) {
      this.animFrame += 1;
      this.draw();
      requestAnimationFrame(() => this.animate());
    }
  }

  draw() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const colors = this.getThemeColors();

    ctx.clearRect(0, 0, w, h);

    // Draw Grid
    ctx.strokeStyle = colors.grid;
    ctx.lineWidth = 1;
    ctx.beginPath();
    
    // Find nice grid intervals
    const rangeX = this.options.maxX - this.options.minX;
    const stepX = Math.pow(10, Math.floor(Math.log10(rangeX)) - 1) * (rangeX < 5 ? 1 : 5);
    const startX = Math.floor(this.options.minX / stepX) * stepX;
    for (let x = startX; x <= this.options.maxX; x += stepX) {
      const sx = this.mathToScreenX(x);
      ctx.moveTo(sx, 0);
      ctx.lineTo(sx, h);
    }

    const rangeY = this.options.maxY - this.options.minY;
    const stepY = Math.pow(10, Math.floor(Math.log10(rangeY)) - 1) * (rangeY < 5 ? 1 : 5);
    const startY = Math.floor(this.options.minY / stepY) * stepY;
    for (let y = startY; y <= this.options.maxY; y += stepY) {
      const sy = this.mathToScreenY(y);
      ctx.moveTo(0, sy);
      ctx.lineTo(w, sy);
    }
    ctx.stroke();

    // Draw Axes
    ctx.strokeStyle = colors.axis;
    ctx.lineWidth = 2;
    ctx.beginPath();
    const y0 = this.mathToScreenY(0);
    if (y0 >= 0 && y0 <= h) {
      ctx.moveTo(0, y0);
      ctx.lineTo(w, y0);
    }
    const x0 = this.mathToScreenX(0);
    if (x0 >= 0 && x0 <= w) {
      ctx.moveTo(x0, 0);
      ctx.lineTo(x0, h);
    }
    ctx.stroke();

    // Draw Function Curve
    ctx.strokeStyle = colors.curve;
    ctx.lineWidth = 3;
    ctx.beginPath();
    let first = true;
    for (let px = 0; px <= w; px += 2) {
      const mx = this.screenToMathX(px);
      const my = typeof evaluateMath === 'function' ? evaluateMath(this.options.expr, mx) : 0;
      if (isNaN(my) || !isFinite(my)) {
        first = true;
        continue;
      }
      const py = this.mathToScreenY(my);
      if (first) {
        ctx.moveTo(px, py);
        first = false;
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.stroke();

    // Draw Method Specific Visuals
    if (this.options.type === 'newton') {
      this.drawNewton(ctx, colors);
    } else if (this.options.type === 'false-position') {
      this.drawFalsePosition(ctx, colors);
    } else if (this.options.type === 'integration') {
      this.drawIntegration(ctx, colors);
    }
  }

  drawNewton(ctx, colors) {
    if (!this.options.iterations || this.options.iterations.length === 0) return;
    
    // Animation progress (0 to maxFrames)
    // 60 frames per iteration
    const currentIterIndex = Math.min(
      Math.floor(this.animFrame / 60), 
      this.options.iterations.length - 1
    );
    const iterProgress = (this.animFrame % 60) / 60; // 0 to 1

    for (let i = 0; i <= currentIterIndex; i++) {
      const iter = this.options.iterations[i];
      const isCurrent = i === currentIterIndex;
      const xn_screen = this.mathToScreenX(iter.xn);
      const fxn_screen = this.mathToScreenY(iter.fxn);
      const y0_screen = this.mathToScreenY(0);

      // Draw vertical line from x-axis to curve
      ctx.strokeStyle = colors.danger;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(xn_screen, y0_screen);
      
      let endY = fxn_screen;
      if (isCurrent && iterProgress < 0.33) {
        // Animate vertical line drawing up/down
        const p = iterProgress / 0.33;
        endY = y0_screen + (fxn_screen - y0_screen) * p;
      }
      ctx.lineTo(xn_screen, endY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw tangent line
      if (!isCurrent || iterProgress >= 0.33) {
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(xn_screen, fxn_screen);
        
        const nextX_screen = this.mathToScreenX(iter.xnext);
        let tx = nextX_screen;
        let ty = y0_screen;
        
        if (isCurrent && iterProgress < 0.66) {
          // Animate tangent line
          const p = (iterProgress - 0.33) / 0.33;
          tx = xn_screen + (nextX_screen - xn_screen) * p;
          ty = fxn_screen + (y0_screen - fxn_screen) * p;
        }
        
        ctx.lineTo(tx, ty);
        ctx.stroke();
        
        // Draw next x point
        if (!isCurrent || iterProgress >= 0.66) {
          ctx.fillStyle = colors.highlight;
          ctx.beginPath();
          ctx.arc(nextX_screen, y0_screen, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw point on curve
      ctx.fillStyle = colors.danger;
      ctx.beginPath();
      ctx.arc(xn_screen, fxn_screen, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawFalsePosition(ctx, colors) {
    if (!this.options.iterations || this.options.iterations.length === 0) return;
    
    const currentIterIndex = Math.min(
      Math.floor(this.animFrame / 60), 
      this.options.iterations.length - 1
    );
    const iterProgress = (this.animFrame % 60) / 60;

    for (let i = 0; i <= currentIterIndex; i++) {
      const iter = this.options.iterations[i];
      const isCurrent = i === currentIterIndex;
      
      const ax_screen = this.mathToScreenX(iter.a);
      const ay_screen = this.mathToScreenY(iter.fa);
      const bx_screen = this.mathToScreenX(iter.b);
      const by_screen = this.mathToScreenY(iter.fb);
      const rx_screen = this.mathToScreenX(iter.xr);
      const y0_screen = this.mathToScreenY(0);

      // Draw vertical lines for bounds
      ctx.strokeStyle = colors.danger;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(ax_screen, y0_screen);
      ctx.lineTo(ax_screen, ay_screen);
      ctx.moveTo(bx_screen, y0_screen);
      ctx.lineTo(bx_screen, by_screen);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw points at a and b
      ctx.fillStyle = colors.danger;
      ctx.beginPath();
      ctx.arc(ax_screen, ay_screen, 4, 0, Math.PI * 2);
      ctx.arc(bx_screen, by_screen, 4, 0, Math.PI * 2);
      ctx.fill();

      // Draw Secant
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(ax_screen, ay_screen);
      
      let ex = bx_screen;
      let ey = by_screen;
      if (isCurrent && iterProgress < 0.5) {
        const p = iterProgress / 0.5;
        ex = ax_screen + (bx_screen - ax_screen) * p;
        ey = ay_screen + (by_screen - ay_screen) * p;
      }
      ctx.lineTo(ex, ey);
      ctx.stroke();

      // Draw xr point
      if (!isCurrent || iterProgress >= 0.5) {
        ctx.fillStyle = colors.highlight;
        ctx.beginPath();
        ctx.arc(rx_screen, y0_screen, 5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = colors.highlight;
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.moveTo(rx_screen, y0_screen);
        ctx.lineTo(rx_screen, this.mathToScreenY(iter.fxr));
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
  }

  drawIntegration(ctx, colors) {
    if (!this.options.methodData || !this.options.methodData.points) return;
    
    const pts = this.options.methodData.points;
    const method = this.options.methodData.method; // trapezoidal, simpson-1-3, simpson-3-8
    const y0_screen = this.mathToScreenY(0);

    ctx.fillStyle = 'rgba(13, 148, 136, 0.2)'; // teal with opacity
    ctx.strokeStyle = colors.highlight;
    ctx.lineWidth = 2;

    if (method === 'trapezoidal') {
      for (let i = 0; i < pts.length - 1; i++) {
        const p1 = pts[i];
        const p2 = pts[i+1];
        const x1s = this.mathToScreenX(p1.x);
        const y1s = this.mathToScreenY(p1.y);
        const x2s = this.mathToScreenX(p2.x);
        const y2s = this.mathToScreenY(p2.y);
        
        ctx.beginPath();
        ctx.moveTo(x1s, y0_screen);
        ctx.lineTo(x1s, y1s);
        ctx.lineTo(x2s, y2s);
        ctx.lineTo(x2s, y0_screen);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    } else if (method === 'simpson-1-3') {
      // Draw parabolic segments (quadratic curve)
      for (let i = 0; i < pts.length - 2; i += 2) {
        const p1 = pts[i];
        const p2 = pts[i+1];
        const p3 = pts[i+2];
        const x1s = this.mathToScreenX(p1.x);
        const x3s = this.mathToScreenX(p3.x);
        
        ctx.beginPath();
        ctx.moveTo(x1s, y0_screen);
        
        // Approximate parabola with small segments
        for (let px = x1s; px <= x3s; px++) {
          const mx = this.screenToMathX(px);
          // Lagrange polynomial for 3 points
          const l1 = ((mx - p2.x)*(mx - p3.x)) / ((p1.x - p2.x)*(p1.x - p3.x));
          const l2 = ((mx - p1.x)*(mx - p3.x)) / ((p2.x - p1.x)*(p2.x - p3.x));
          const l3 = ((mx - p1.x)*(mx - p2.x)) / ((p3.x - p1.x)*(p3.x - p2.x));
          const my = p1.y*l1 + p2.y*l2 + p3.y*l3;
          ctx.lineTo(px, this.mathToScreenY(my));
        }
        ctx.lineTo(x3s, y0_screen);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    } else if (method === 'simpson-3-8') {
      // Cubic segments
      for (let i = 0; i < pts.length - 3; i += 3) {
        const p1 = pts[i];
        const p2 = pts[i+1];
        const p3 = pts[i+2];
        const p4 = pts[i+3];
        const x1s = this.mathToScreenX(p1.x);
        const x4s = this.mathToScreenX(p4.x);
        
        ctx.beginPath();
        ctx.moveTo(x1s, y0_screen);
        
        for (let px = x1s; px <= x4s; px++) {
          const mx = this.screenToMathX(px);
          const l1 = ((mx - p2.x)*(mx - p3.x)*(mx - p4.x)) / ((p1.x - p2.x)*(p1.x - p3.x)*(p1.x - p4.x));
          const l2 = ((mx - p1.x)*(mx - p3.x)*(mx - p4.x)) / ((p2.x - p1.x)*(p2.x - p3.x)*(p2.x - p4.x));
          const l3 = ((mx - p1.x)*(mx - p2.x)*(mx - p4.x)) / ((p3.x - p1.x)*(p3.x - p2.x)*(p3.x - p4.x));
          const l4 = ((mx - p1.x)*(mx - p2.x)*(mx - p3.x)) / ((p4.x - p1.x)*(p4.x - p2.x)*(p4.x - p3.x));
          const my = p1.y*l1 + p2.y*l2 + p3.y*l3 + p4.y*l4;
          ctx.lineTo(px, this.mathToScreenY(my));
        }
        ctx.lineTo(x4s, y0_screen);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    }

    // Draw partition points
    for (let p of pts) {
      ctx.fillStyle = colors.danger;
      ctx.beginPath();
      ctx.arc(this.mathToScreenX(p.x), this.mathToScreenY(p.y), 4, 0, Math.PI * 2);
      ctx.fill();
      
      // Vertical dashed line to axis
      ctx.strokeStyle = colors.danger;
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(this.mathToScreenX(p.x), y0_screen);
      ctx.lineTo(this.mathToScreenX(p.x), this.mathToScreenY(p.y));
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  checkTooltip() {
    if (!this.mouseHover.active) return;
    
    const mx = this.screenToMathX(this.mouseHover.x);
    const my = this.screenToMathY(this.mouseHover.y);
    
    let tooltipText = '';
    let closestDist = 20; // max screen pixels
    
    if (this.options.type === 'newton') {
      for (let i = 0; i < this.options.iterations.length; i++) {
        const iter = this.options.iterations[i];
        const sx = this.mathToScreenX(iter.xn);
        const sy = this.mathToScreenY(iter.fxn);
        const dist = Math.hypot(sx - this.mouseHover.x, sy - this.mouseHover.y);
        
        if (dist < closestDist) {
          closestDist = dist;
          tooltipText = `Iter: ${iter.iter}\nx: ${iter.xn.toFixed(4)}\ny: ${iter.fxn.toFixed(4)}\nf'(x): ${iter.fprime.toFixed(4)}`;
        }
      }
    } else if (this.options.type === 'false-position') {
      for (let i = 0; i < this.options.iterations.length; i++) {
        const iter = this.options.iterations[i];
        const sx = this.mathToScreenX(iter.xr);
        const sy = this.mathToScreenY(iter.fxr);
        const dist = Math.hypot(sx - this.mouseHover.x, sy - this.mouseHover.y);
        
        if (dist < closestDist) {
          closestDist = dist;
          tooltipText = `Iter: ${iter.iter}\nx_r: ${iter.xr.toFixed(4)}\nf(x_r): ${iter.fxr.toFixed(4)}\nInt: [${iter.a.toFixed(2)}, ${iter.b.toFixed(2)}]`;
        }
      }
    } else if (this.options.type === 'integration') {
      if (this.options.methodData && this.options.methodData.points) {
        for (let i = 0; i < this.options.methodData.points.length; i++) {
          const p = this.options.methodData.points[i];
          const sx = this.mathToScreenX(p.x);
          const sy = this.mathToScreenY(p.y);
          const dist = Math.hypot(sx - this.mouseHover.x, sy - this.mouseHover.y);
          
          if (dist < closestDist) {
            closestDist = dist;
            tooltipText = `Point: ${i}\nx: ${p.x.toFixed(4)}\ny: ${p.y.toFixed(4)}`;
          }
        }
      }
    }

    if (tooltipText) {
      this.tooltip.innerText = tooltipText;
      this.tooltip.style.display = 'block';
      this.tooltip.style.left = (this.mouseHover.x + 15) + 'px';
      this.tooltip.style.top = (this.mouseHover.y + 15) + 'px';
    } else {
      this.tooltip.style.display = 'none';
    }
  }
}

window.InteractiveGraph = InteractiveGraph;
