// ===================== STARFIELD ANIMATION =====================
(function() {
    const canvas = document.getElementById('starfield');
    const ctx = canvas.getContext('2d');
    let stars = [];
  
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  
    function initStars() {
      stars = [];
      for (let i = 0; i < 200; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.5 + 0.3,
          speed: Math.random() * 0.5 + 0.2,
          phase: Math.random() * Math.PI * 2,
          color: ['#fff','#c084fc','#f472b6','#7dd3fc'][Math.floor(Math.random()*4)]
        });
      }
    }
  
    function draw(t) {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      stars.forEach(s => {
        const alpha = 0.3 + 0.7 * Math.abs(Math.sin(t * 0.001 * s.speed + s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = alpha;
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }
  
    window.addEventListener('resize', () => { resize(); initStars(); });
    resize(); initStars(); requestAnimationFrame(draw);
  })();
  
  // ===================== CONFETTI SYSTEM =====================
  const confettiCanvas = document.getElementById('confetti-canvas');
  const cCtx = confettiCanvas.getContext('2d');
  let confettiPieces = [];
  let confettiActive = false;
  const COLORS = ['#c084fc','#f472b6','#7dd3fc','#fde68a','#86efac'];
  
  function spawnConfetti(count) {
    for (let i = 0; i < count; i++) {
      confettiPieces.push({
        x: Math.random() * window.innerWidth,
        y: -10,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2,
        rot: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 8,
        w: Math.random() * 10 + 6,
        h: Math.random() * 5 + 4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        opacity: 1,
        wave: Math.random() * Math.PI * 2,
        waveSpeed: Math.random() * 0.05 + 0.02
      });
    }
  }
  
  function drawConfetti() {
    cCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confettiPieces.forEach((p, i) => {
      p.y += p.vy;
      p.x += Math.sin(p.wave) * 1.5;
      p.wave += p.waveSpeed;
      if (p.y > window.innerHeight) p.opacity -= 0.03;
      cCtx.save();
      cCtx.globalAlpha = Math.max(0, p.opacity);
      cCtx.translate(p.x, p.y);
      cCtx.rotate(p.rot * Math.PI / 180);
      cCtx.fillStyle = p.color;
      cCtx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
      cCtx.restore();
    });
    confettiPieces = confettiPieces.filter(p => p.opacity > 0);
    requestAnimationFrame(drawConfetti);
  }
  
  function startConfetti() {
    confettiActive = true;
    const burst = () => { if(confettiActive) { spawnConfetti(20); setTimeout(burst, 400); }};
    burst();
    setTimeout(() => confettiActive = false, 5000);
  }
  
  // Initial subtle background confetti
  setInterval(() => {
      if (document.getElementById('page-intro').classList.contains('active')) spawnConfetti(2);
  }, 1000);
  drawConfetti();
  
  // ===================== NAVIGATION =====================
  function showPage(id) {
    const tr = document.getElementById('transition');
    tr.classList.add('visible');
    setTimeout(() => {
      document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
      document.getElementById(id).classList.add('active');
      window.scrollTo(0,0);
      setTimeout(() => tr.classList.remove('visible'), 300);
    }, 400);
  }
  
  function goToCaptcha() { showPage('page-captcha'); setTimeout(initCaptchas, 600); }
  function goToReveal() { showPage('page-reveal'); setTimeout(startConfetti, 500); }
  
  // ===================== CAPTCHA DATA =====================
  let currentStep = 0;
  const totalSteps = 7;
  let stepState = {};
  
  const captchas = [
    {
      type: 'grid-select',
      title: 'Select all the squares that contain a fox related emoji',
      gridItems: [{e:'🦊',fox:true},{e:'🐱',fox:false},{e:'🐾',fox:true},{e:'🪽',fox:false},{e:'🦝',fox:false},{e:'🐰',fox:false},{e:'🏔️',fox:true},{e:'🪶',fox:false},{e:'🐶',fox:false},{e:'🦊',fox:true},{e:'🐻',fox:false},{e:'🌲',fox:true},{e:'🍆',fox:false},{e:'🦁',fox:false},{e:'💃',fox:false},{e:'🐯',fox:false}],
      validate: (sel) => [0,2,6,9,11].every(i => sel.includes(i)) && sel.length === 5
    },
    {
      type: 'text-input',
      title: 'Prove you are a fox',
      subtitle: 'Type exactly: "I am a very good fox"',
      expected: 'i am a very good fox',
      validate: (val) => val.trim().toLowerCase() === 'i am a very good fox'
    },
    {
      type: 'sequence',
      title: 'Order the fox life cycle',
      items: [{e:'🦊',l:'Adult',o:4},{e:'🌰',l:'Den',o:1},{e:'🐾',l:'Hunting',o:3},{e:'🍼',l:'Kit',o:2},{e:'🪦',l:'Ded :c',o:5}],
      validate: (clicks) => clicks.join(',') === '1,3,4,0,2'
    },
    {
      type: 'word-select',
      title: 'Select fox-related words',
      words: [{w:'vixen',f:true},{w:'den',f:true},{w:'purring',f:false},{w:'kit',f:true},{w:'feline',f:false},{w:'bark',f:true},{w:'AAAAAAA',f:true},{w:'bushy tail',f:true},{w:'roar',f:false},{w:'canine',f:true}],
      validate: (sel) => [0,1,3,5,6,7,9].every(i => sel.includes(i)) && sel.length === 7
    },
    {
      type: 'slider',
      title: 'Drag the fox to safety',
      validate: (val) => val >= 95
    },
    {
      type: 'grid-select',
      title: 'Select all fox habitats',
      gridItems: [{e:'🌲',fox:true},{e:'🏙️',fox:true},{e:'🌊',fox:false},{e:'🏔️',fox:true},{e:'🌿',fox:true},{e:'🐚',fox:false},{e:'🍂',fox:true},{e:'🌺',fox:false},{e:'☃️❄️',fox:true},{e:'🌋',fox:false},{e:'🌾',fox:true},{e:'🪸',fox:false},{e:'🦊',fox:true},{e:'🌵',fox:false},{e:'🌙',fox:true},{e:'🌊',fox:false}],
      validate: (sel) => [0,1,3,4,6,8,10,12,14].every(i => sel.includes(i)) && sel.length === 9
    },
    {
      type: 'text-input',
      title: 'Final verification',
      subtitle: 'Complete: "The quick brown fox jumps over the lazy ___"',
      validate: (val) => val.trim().toLowerCase() === 'dog'
    }
  ];
  
  function updateProgress() {
    const pct = (currentStep / totalSteps) * 100;
    document.getElementById('progress-fill').style.width = pct + '%';
    document.getElementById('progress-label').textContent = `Step ${currentStep} of ${totalSteps}`;
  }
  
  function initCaptchas() { currentStep = 0; updateProgress(); renderStep(0); }
  
  function renderStep(idx) {
    if (idx >= captchas.length) { goToReveal(); return; }
    const cap = captchas[idx];
    const container = document.getElementById('captcha-container');
    container.innerHTML = '';
    stepState[idx] = { selected: [], clicks: [] };
  
    const card = document.createElement('div');
    card.className = 'captcha-card';
    
    let content = `<h2>${cap.title}</h2><p class="subtitle">${cap.subtitle || ''}</p>`;
  
    if (cap.type === 'grid-select') {
      content += `<div class="img-grid">${cap.gridItems.map((item,i) => `<div class="img-cell" onclick="toggleCell(this,${idx},${i})">${item.e}</div>`).join('')}</div>`;
    } else if (cap.type === 'text-input') {
      content += `<input type="text" class="captcha-text-input" id="inp-${idx}" placeholder="Your answer...">`;
    } else if (cap.type === 'sequence') {
      content += `<div class="sequence-grid">${cap.items.map((item,i) => `<div class="seq-cell" onclick="clickSeq(this,${idx},${i})"><div>${item.e}</div><div style="font-size:0.5rem">${item.l}</div></div>`).join('')}</div>`;
    } else if (cap.type === 'word-select') {
      content += `<div class="word-cloud">${cap.words.map((w,i) => `<span class="word-chip" onclick="toggleWord(this,${idx},${i})">${w.w}</span>`).join('')}</div>`;
    } else if (cap.type === 'slider') {
      content += `<input type="range" min="0" max="100" value="0" class="fox-slider" oninput="stepState[${idx}].value = this.value">`;
    }
  
    content += `<div class="error-msg" id="err-${idx}">Try again, little fox! 🦊</div>`;
    content += `<button class="btn-verify" onclick="verifyStep(${idx})">Verify →</button>`;
    
    card.innerHTML = content;
    container.appendChild(card);
  }
  
  // Interactivity Helpers
  window.toggleCell = (el, idx, i) => {
    el.classList.toggle('selected');
    const sel = stepState[idx].selected;
    sel.includes(i) ? sel.splice(sel.indexOf(i),1) : sel.push(i);
  };
  
  window.toggleWord = (el, idx, i) => {
    el.classList.toggle('selected');
    const sel = stepState[idx].selected;
    sel.includes(i) ? sel.splice(sel.indexOf(i),1) : sel.push(i);
  };
  
  window.clickSeq = (el, idx, i) => {
    const state = stepState[idx];
    const clickIndex = state.clicks.indexOf(i);
  
    if (clickIndex > -1) {
      // 1. If already clicked, REMOVE it (Unselect)
      state.clicks.splice(clickIndex, 1);
    } else {
      // 2. If not clicked, ADD it (Select)
      state.clicks.push(i);
    }
  
    // 3. REFRESH UI: Update numbers for all cells in this grid
    const grid = el.parentElement;
    const allCells = grid.querySelectorAll('.seq-cell');
  
    allCells.forEach((cell, cellIdx) => {
      // Check if this specific cell index is in our clicks array
      const orderInArray = state.clicks.indexOf(cellIdx);
      
      // Clear existing numbers
      const existingNum = cell.querySelector('.order-num');
      if (existingNum) existingNum.remove();
  
      if (orderInArray > -1) {
        // It is selected: add the "ordered" class and the new position number
        cell.classList.add('ordered');
        const numEl = document.createElement('div');
        numEl.className = 'order-num';
        numEl.textContent = orderInArray + 1; // +1 because index starts at 0
        cell.appendChild(numEl);
      } else {
        // It is not selected: remove the "ordered" class
        cell.classList.remove('ordered');
      }
    });
  };
  
  window.verifyStep = (idx) => {
    const cap = captchas[idx];
    let valid = false;
    if (cap.type === 'grid-select') valid = cap.validate(stepState[idx].selected);
    else if (cap.type === 'text-input') valid = cap.validate(document.getElementById(`inp-${idx}`).value);
    else if (cap.type === 'sequence') valid = cap.validate(stepState[idx].clicks);
    else if (cap.type === 'word-select') valid = cap.validate(stepState[idx].selected);
    else if (cap.type === 'slider') valid = cap.validate(stepState[idx].value);
  
    if (valid) {
      currentStep++;
      updateProgress();
      renderStep(idx + 1);
      spawnPaws();
    } else {
      document.getElementById(`err-${idx}`).classList.add('show');
    }
  };
  
  function spawnPaws() {
    for (let i = 0; i < 5; i++) {
      const p = document.createElement('div');
      p.className = 'fox-paw-trail';
      p.textContent = '🐾';
      p.style.left = Math.random() * window.innerWidth + 'px';
      p.style.top = Math.random() * window.innerHeight + 'px';
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 2000);
    }
  }
  
  window.downloadDrawing = (e) => {
    e.preventDefault();
    const btn = document.getElementById('download-btn');
    btn.textContent = '🦊 Downloading...';
    setTimeout(() => {
      btn.textContent = '✓ Downloaded!';
      startConfetti();
    }, 1000);
  };