/* ==========================================================================
   ORBIT — MASTER INTERACTIVE HOROLOGY FILM CONTROLLER
   GSAP ScrollTrigger + Lenis + Canvas 200-Frame Preloader & Scrub Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Register GSAP Plugins
  gsap.registerPlugin(ScrollTrigger);

  // Initialize Lenis Smooth Scroll
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.5
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Sync GSAP ScrollTrigger with Lenis
  lenis.on('scroll', () => {
    ScrollTrigger.update();
    updateScrollProgress();
  });

  // Right-Edge Scroll Progress Indicator Bar
  const scrollProgress = document.getElementById('scrollProgress');
  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
    if (scrollProgress) {
      scrollProgress.style.height = `${progress}%`;
    }
  }

  // ==========================================================================
  // 1. CUSTOM DESKTOP CURSOR & PERSPECTIVE TILT
  // ==========================================================================
  const cursor = document.getElementById('custom-cursor');
  const watchImages = document.querySelectorAll('.transition-watch-img, .object-watch-img, .floating-watch-img, .final-watch-img');

  if (window.innerWidth > 1024 && cursor) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      const windowWidthHalf = window.innerWidth / 2;
      const windowHeightHalf = window.innerHeight / 2;

      const tiltX = (mouseY - windowHeightHalf) / windowHeightHalf * -8;
      const tiltY = (mouseX - windowWidthHalf) / windowWidthHalf * 8;

      watchImages.forEach(img => {
        if (img) img.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      });
    });

    function renderCursor() {
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    document.querySelectorAll('[data-cursor]').forEach(el => {
      el.addEventListener('mouseenter', () => {
        const type = el.getAttribute('data-cursor');
        cursor.className = '';
        if (type === 'explore') {
          cursor.classList.add('cursor-explore');
          cursor.textContent = 'EXPLORE';
        } else if (type === 'open') {
          cursor.classList.add('cursor-open');
          cursor.textContent = 'OPEN';
        } else if (type === 'nav') {
          cursor.classList.add('cursor-nav');
          cursor.textContent = '';
        }
      });

      el.addEventListener('mouseleave', () => {
        cursor.className = '';
        cursor.textContent = '';
      });
    });
  }

  // ==========================================================================
  // 2. MOBILE OVERLAY MENU
  // ==========================================================================
  const btnMobileToggle = document.getElementById('btnMobileToggle');
  const btnCloseMobile = document.getElementById('btnCloseMobile');
  const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');

  if (btnMobileToggle && mobileMenuOverlay) {
    btnMobileToggle.addEventListener('click', () => mobileMenuOverlay.classList.add('open'));
  }
  if (btnCloseMobile && mobileMenuOverlay) {
    btnCloseMobile.addEventListener('click', () => mobileMenuOverlay.classList.remove('open'));
  }
  document.querySelectorAll('.mobile-menu-link').forEach(link => {
    link.addEventListener('click', () => mobileMenuOverlay && mobileMenuOverlay.classList.remove('open'));
  });

  // ==========================================================================
  // 3. STEP 5 HERO CANVAS — 200-FRAME SCRUBBING ENGINE
  // ==========================================================================
  const heroCanvas = document.getElementById('hero-canvas');
  const heroCtx = heroCanvas ? heroCanvas.getContext('2d') : null;
  const frameCount = 200;
  const heroFrames = [];
  const heroFrameState = { currentFrame: 0 };

  function pad(num, size) {
    let s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
  }

  let loadedCount = 0;
  for (let i = 1; i <= frameCount; i++) {
    const img = new Image();
    img.src = `frames/frame_${pad(i, 4)}.jpg`;
    img.onload = () => {
      loadedCount++;
      if (i === 1 && heroCtx) {
        renderHeroFrame(0);
      }
    };
    heroFrames.push(img);
  }

  function resizeHeroCanvas() {
    if (!heroCanvas) return;
    heroCanvas.width = window.innerWidth * (window.devicePixelRatio || 1);
    heroCanvas.height = window.innerHeight * (window.devicePixelRatio || 1);
    renderHeroFrame(Math.floor(heroFrameState.currentFrame));
  }
  if (heroCanvas) {
    resizeHeroCanvas();
    window.addEventListener('resize', resizeHeroCanvas);
  }

  function renderHeroFrame(index) {
    if (!heroCtx || !heroCanvas) return;
    const img = heroFrames[Math.min(frameCount - 1, Math.max(0, Math.floor(index)))];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const canvasWidth = heroCanvas.width;
    const canvasHeight = heroCanvas.height;
    heroCtx.clearRect(0, 0, canvasWidth, canvasHeight);

    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = canvasWidth / canvasHeight;

    let renderW, renderH, offsetX, offsetY;
    if (canvasRatio > imgRatio) {
      renderW = canvasWidth;
      renderH = canvasWidth / imgRatio;
      offsetX = 0;
      offsetY = (canvasHeight - renderH) / 2;
    } else {
      renderH = canvasHeight;
      renderW = canvasHeight * imgRatio;
      offsetX = (canvasWidth - renderW) / 2;
      offsetY = 0;
    }

    heroCtx.drawImage(img, offsetX, offsetY, renderW, renderH);
  }

  // Hero Canvas Scroll Scrubbing & Typography Overlay Timing
  const heroText1 = document.getElementById('heroText1');
  const heroText2 = document.getElementById('heroText2');
  const heroText3 = document.getElementById('heroText3');
  const heroText4 = document.getElementById('heroText4');
  const heroText5 = document.getElementById('heroText5');

  ScrollTrigger.create({
    trigger: '#scene-hero',
    start: 'top top',
    end: '+=350%',
    pin: true,
    scrub: 0.5,
    onUpdate: (self) => {
      const p = self.progress;
      const frameIndex = Math.min(frameCount - 1, Math.floor(p * (frameCount - 1)));
      heroFrameState.currentFrame = frameIndex;
      renderHeroFrame(frameIndex);

      if (heroText1) heroText1.classList.toggle('active', p >= 0.04 && p <= 0.14);
      if (heroText2) heroText2.classList.toggle('active', p >= 0.20 && p <= 0.32);
      if (heroText3) heroText3.classList.toggle('active', p >= 0.40 && p <= 0.52);
      if (heroText4) heroText4.classList.toggle('active', p >= 0.63 && p <= 0.75);
      if (heroText5) heroText5.classList.toggle('active', p >= 0.84 && p <= 0.93);
    }
  });

  // ==========================================================================
  // 4. HERO → POST-HERO TRANSITION SCENE
  // ==========================================================================
  const transitionWatchImg = document.getElementById('transitionWatchImg');
  const transitionOrbitRing = document.getElementById('transitionOrbitRing');
  const transitionStatement = document.getElementById('transitionStatement');

  gsap.timeline({
    scrollTrigger: {
      trigger: '#scene-hero-transition',
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
      pin: true
    }
  })
  .fromTo(transitionWatchImg, { scale: 1.2, opacity: 0.5 }, { scale: 0.85, opacity: 1, duration: 2 })
  .fromTo(transitionOrbitRing, { scale: 0.3, opacity: 0 }, { scale: 2.2, opacity: 0.8, duration: 2 }, 0)
  .fromTo(transitionStatement, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1 }, '-=1');

  // ==========================================================================
  // 5. SECOND HERO — WATCH COMES ALIVE
  // ==========================================================================
  const secondHeroVideo = document.getElementById('productMotionVideo');
  const secondHeroStatement = document.getElementById('secondHeroStatement');

  gsap.timeline({
    scrollTrigger: {
      trigger: '#scene-watch-alive',
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
      pin: true
    }
  })
  .fromTo(secondHeroVideo, { scale: 0.8, filter: 'brightness(0.6)' }, { scale: 1.0, filter: 'brightness(1.0)', duration: 2 })
  .fromTo(secondHeroStatement, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1 }, '-=1');

  // ==========================================================================
  // 6. WATCH AS OBJECT — BUILT AROUND TIME (WITH CONNECTOR SVG LINES)
  // ==========================================================================
  const objectWatchImg = document.getElementById('objectWatchImg');
  const builtStatement = document.getElementById('builtStatement');
  const line1 = document.getElementById('line1');
  const line2 = document.getElementById('line2');
  const line3 = document.getElementById('line3');
  const dot1 = document.getElementById('dot1');
  const dot2 = document.getElementById('dot2');
  const dot3 = document.getElementById('dot3');
  const techLabel1 = document.getElementById('techLabel1');
  const techLabel2 = document.getElementById('techLabel2');
  const techLabel3 = document.getElementById('techLabel3');

  gsap.timeline({
    scrollTrigger: {
      trigger: '#scene-built-around-time',
      start: 'top top',
      end: '+=200%',
      scrub: 1,
      pin: true,
      onUpdate: (self) => {
        const p = self.progress;
        if (techLabel1) techLabel1.classList.toggle('active', p >= 0.25 && p <= 0.5);
        if (techLabel2) techLabel2.classList.toggle('active', p >= 0.5 && p <= 0.75);
        if (techLabel3) techLabel3.classList.toggle('active', p >= 0.75 && p <= 0.95);
      }
    }
  })
  .fromTo(objectWatchImg, { scale: 1.45, filter: 'brightness(0.7)' }, { scale: 1.0, filter: 'brightness(1.0)', duration: 2 })
  .to([line1, line2, line3], { strokeDashoffset: 0, duration: 1.5 }, '-=1')
  .to([dot1, dot2, dot3], { opacity: 1, duration: 0.5 }, '-=1')
  .fromTo(builtStatement, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1 }, '-=1');

  // ==========================================================================
  // 7. MECHANICAL MOVEMENT ENGINE & CANVAS
  // ==========================================================================
  const mechCanvas = document.getElementById('mechanical-canvas');
  let mechCtx = mechCanvas ? mechCanvas.getContext('2d') : null;

  function resizeMechCanvas() {
    if (!mechCanvas) return;
    mechCanvas.width = window.innerWidth;
    mechCanvas.height = window.innerHeight;
  }
  if (mechCanvas) {
    resizeMechCanvas();
    window.addEventListener('resize', resizeMechCanvas);

    let gearAngle = 0;
    let balanceOsc = 0;

    function drawMechanicalGears() {
      if (!mechCtx) return;
      mechCtx.clearRect(0, 0, mechCanvas.width, mechCanvas.height);

      const cx = mechCanvas.width / 2;
      const cy = mechCanvas.height / 2;
      const radius = Math.min(cx, cy) * 0.36;

      gearAngle += 0.012;
      balanceOsc += 0.1;

      mechCtx.save();
      mechCtx.translate(cx, cy);
      mechCtx.rotate(gearAngle);
      mechCtx.strokeStyle = 'rgba(184, 162, 122, 0.45)';
      mechCtx.lineWidth = 1.5;

      const teeth = 28;
      for (let i = 0; i < teeth; i++) {
        const a = (i / teeth) * Math.PI * 2;
        const x1 = Math.cos(a) * radius;
        const y1 = Math.sin(a) * radius;
        const x2 = Math.cos(a) * (radius + 14);
        const y2 = Math.sin(a) * (radius + 14);

        mechCtx.beginPath();
        mechCtx.moveTo(x1, y1);
        mechCtx.lineTo(x2, y2);
        mechCtx.stroke();
      }
      mechCtx.restore();

      mechCtx.save();
      mechCtx.translate(cx, cy);
      mechCtx.rotate(Math.sin(balanceOsc) * 0.35);
      mechCtx.strokeStyle = 'rgba(217, 222, 229, 0.6)';
      mechCtx.lineWidth = 2;
      mechCtx.beginPath();
      mechCtx.arc(0, 0, radius * 0.62, 0, Math.PI * 2);
      mechCtx.stroke();
      mechCtx.restore();

      requestAnimationFrame(drawMechanicalGears);
    }
    drawMechanicalGears();
  }

  const mechMacroImg = document.getElementById('mechMacroImg');
  const mechStatement = document.getElementById('mechStatement');

  gsap.timeline({
    scrollTrigger: {
      trigger: '#scene-mechanical',
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
      pin: true
    }
  })
  .fromTo(mechMacroImg, { scale: 1.35, rotate: -3 }, { scale: 1.0, rotate: 3, duration: 2 })
  .fromTo(mechStatement, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1.0, duration: 1 }, '-=1');

  // ==========================================================================
  // 8. ORBITAL FIELD — PRECISION IN MOTION
  // ==========================================================================
  const orbitalWatchImg = document.getElementById('orbitalWatchImg');
  const orbitalSvg = document.getElementById('orbitalSvg');
  const orbitalStatement = document.getElementById('orbitalStatement');

  gsap.timeline({
    scrollTrigger: {
      trigger: '#scene-orbital-field',
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
      pin: true
    }
  })
  .fromTo(orbitalWatchImg, { rotateZ: -12, scale: 0.85 }, { rotateZ: 12, scale: 1.1, duration: 2 })
  .to(orbitalSvg, { rotate: 360, duration: 2 }, 0)
  .fromTo(orbitalStatement, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1 }, '-=1');

  // ==========================================================================
  // 9. MATERIAL JOURNEY SWITCHER
  // ==========================================================================
  const matDotBtns = document.querySelectorAll('.material-dot-btn');
  const matSlides = {
    metal: document.getElementById('mat-slide-metal'),
    sapphire: document.getElementById('mat-slide-sapphire'),
    dial: document.getElementById('mat-slide-dial'),
    leather: document.getElementById('mat-slide-leather')
  };

  matDotBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const mat = btn.getAttribute('data-material');
      matDotBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      Object.keys(matSlides).forEach(k => {
        if (matSlides[k]) matSlides[k].classList.remove('active');
      });
      if (matSlides[mat]) matSlides[mat].classList.add('active');
    });
  });

  ScrollTrigger.create({
    trigger: '#scene-material-journey',
    start: 'top top',
    end: '+=200%',
    pin: true,
    scrub: 1,
    onUpdate: (self) => {
      const p = self.progress;
      const keys = ['metal', 'sapphire', 'dial', 'leather'];
      const idx = Math.min(3, Math.floor(p * 4));
      const activeMat = keys[idx];

      matDotBtns.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-material') === activeMat);
      });
      Object.keys(matSlides).forEach(k => {
        if (matSlides[k]) matSlides[k].classList.toggle('active', k === activeMat);
      });
    }
  });

  // ==========================================================================
  // 10. DIAL CHRONOGRAPHY & SECOND HAND CANVAS
  // ==========================================================================
  const dialCanvas = document.getElementById('dial-canvas');
  let dialCtx = dialCanvas ? dialCanvas.getContext('2d') : null;
  let secondHandProgress = 0;

  function resizeDialCanvas() {
    if (!dialCanvas) return;
    dialCanvas.width = window.innerWidth;
    dialCanvas.height = window.innerHeight;
  }
  if (dialCanvas) {
    resizeDialCanvas();
    window.addEventListener('resize', resizeDialCanvas);

    function drawDialChronography() {
      if (!dialCtx) return;
      dialCtx.clearRect(0, 0, dialCanvas.width, dialCanvas.height);

      const cx = dialCanvas.width / 2;
      const cy = dialCanvas.height / 2;
      const radius = Math.min(cx, cy) * 0.4;

      dialCtx.save();
      dialCtx.translate(cx, cy);

      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
        const x1 = Math.cos(a) * (radius + 20);
        const y1 = Math.sin(a) * (radius + 20);
        const x2 = Math.cos(a) * (radius + 38);
        const y2 = Math.sin(a) * (radius + 38);

        dialCtx.strokeStyle = (i % 3 === 0) ? '#B8A27A' : 'rgba(8, 17, 31, 0.4)';
        dialCtx.lineWidth = (i % 3 === 0) ? 2.5 : 1;

        dialCtx.beginPath();
        dialCtx.moveTo(x1, y1);
        dialCtx.lineTo(x2, y2);
        dialCtx.stroke();
      }

      dialCtx.beginPath();
      dialCtx.arc(0, 0, radius, 0, Math.PI * 2);
      dialCtx.strokeStyle = 'rgba(184, 162, 122, 0.35)';
      dialCtx.lineWidth = 1;
      dialCtx.stroke();

      const angleRad = secondHandProgress * Math.PI * 2 - Math.PI / 2;
      const handLength = radius + (secondHandProgress * 60);
      const handX = Math.cos(angleRad) * handLength;
      const handY = Math.sin(angleRad) * handLength;

      dialCtx.beginPath();
      dialCtx.moveTo(0, 0);
      dialCtx.lineTo(handX, handY);
      dialCtx.strokeStyle = '#B8A27A';
      dialCtx.lineWidth = 2;
      dialCtx.stroke();

      dialCtx.beginPath();
      dialCtx.arc(0, 0, 5, 0, Math.PI * 2);
      dialCtx.fillStyle = '#08111F';
      dialCtx.fill();
      dialCtx.strokeStyle = '#B8A27A';
      dialCtx.stroke();

      dialCtx.restore();
      requestAnimationFrame(drawDialChronography);
    }
    drawDialChronography();
  }

  ScrollTrigger.create({
    trigger: '#scene-dial',
    start: 'top top',
    end: '+=150%',
    pin: true,
    scrub: 0.5,
    onUpdate: (self) => {
      secondHandProgress = self.progress;
    }
  });

  // ==========================================================================
  // 11. HUMAN MOMENT LIGHTING ENGINE
  // ==========================================================================
  const humanWristImg = document.getElementById('humanWristImg');
  const phaseTags = {
    morning: document.getElementById('tag-morning'),
    golden: document.getElementById('tag-golden'),
    blue: document.getElementById('tag-blue'),
    night: document.getElementById('tag-night')
  };

  ScrollTrigger.create({
    trigger: '#scene-human-moment',
    start: 'top top',
    end: '+=200%',
    pin: true,
    scrub: 1,
    onUpdate: (self) => {
      const p = self.progress;
      if (!humanWristImg) return;

      if (p < 0.25) {
        humanWristImg.style.filter = 'brightness(1.0) sepia(0.05)';
        Object.keys(phaseTags).forEach(k => phaseTags[k] && phaseTags[k].classList.toggle('active', k === 'morning'));
      } else if (p < 0.5) {
        humanWristImg.style.filter = 'brightness(1.1) sepia(0.35)';
        Object.keys(phaseTags).forEach(k => phaseTags[k] && phaseTags[k].classList.toggle('active', k === 'golden'));
      } else if (p < 0.75) {
        humanWristImg.style.filter = 'brightness(0.85) hue-rotate(170deg) saturate(1.2)';
        Object.keys(phaseTags).forEach(k => phaseTags[k] && phaseTags[k].classList.toggle('active', k === 'blue'));
      } else {
        humanWristImg.style.filter = 'brightness(0.65) contrast(1.15)';
        Object.keys(phaseTags).forEach(k => phaseTags[k] && phaseTags[k].classList.toggle('active', k === 'night'));
      }
    }
  });

  // ==========================================================================
  // 12. DYNAMIC NAVBAR THEME SWITCHER
  // ==========================================================================
  const mainHeader = document.getElementById('mainHeader');
  const body = document.body;

  const scenes = document.querySelectorAll('.hero-scene');
  scenes.forEach(scene => {
    const bg = scene.getAttribute('data-bg');
    const theme = scene.getAttribute('data-theme');

    ScrollTrigger.create({
      trigger: scene,
      start: 'top 50%',
      end: 'bottom 50%',
      onEnter: () => {
        if (bg) body.style.backgroundColor = bg;
        if (theme && mainHeader) {
          mainHeader.className = `fixed-nav theme-${theme} scrolled`;
        }
      },
      onEnterBack: () => {
        if (bg) body.style.backgroundColor = bg;
        if (theme && mainHeader) {
          mainHeader.className = `fixed-nav theme-${theme} scrolled`;
        }
      }
    });
  });
});
