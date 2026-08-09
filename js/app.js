/* ==========================================================================
   ORBIT — ULTRA-LUXURY ANIMATION ENGINE & HOROLOGY CONTROLLER
   Hero (200 Frame Canvas Scrubbing Engine - Approved)
   Sections 02–10: High-End Cinematic Motion & Interactive Depth
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Register GSAP Plugins
  gsap.registerPlugin(ScrollTrigger);

  // Initialize Lenis Smooth Scroll with Liquid Inertia
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1.0,
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
  // 1. SUBTLE 3D PARALLAX & WEIGHTLESS FLOATING ANIMATION
  // ==========================================================================
  const watchImages = document.querySelectorAll('.transition-watch-img, .object-watch-img, .floating-watch-img, .final-watch-img');

  if (window.innerWidth > 1024) {
    window.addEventListener('mousemove', (e) => {
      const windowWidthHalf = window.innerWidth / 2;
      const windowHeightHalf = window.innerHeight / 2;

      const tiltX = (e.clientY - windowHeightHalf) / windowHeightHalf * -3.5;
      const tiltY = (e.clientX - windowWidthHalf) / windowWidthHalf * 3.5;

      watchImages.forEach(img => {
        if (img) img.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      });
    });
  }

  // Weightless Floating Motion for Key Watch Assets
  gsap.to('.floating-watch-img', {
    y: '-=12',
    duration: 3,
    repeat: -1,
    yoyo: true,
    ease: 'power1.inOut'
  });

  gsap.to('.object-watch-img', {
    y: '-=8',
    duration: 3.5,
    repeat: -1,
    yoyo: true,
    ease: 'power1.inOut'
  });

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
  // 3. SECTION 01: HERO CANVAS — 200-FRAME SCRUBBING ENGINE (APPROVED)
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

  const heroText1 = document.getElementById('heroText1');
  const heroText2 = document.getElementById('heroText2');
  const heroText3 = document.getElementById('heroText3');
  const heroText4 = document.getElementById('heroText4');
  const heroText5 = document.getElementById('heroText5');

  // Hero: PINNED
  ScrollTrigger.create({
    trigger: '#scene-hero',
    start: 'top top',
    end: '+=300%',
    pin: true,
    scrub: 0.8,
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
  // 4. SECTION 02: THE WATCH AWAKENS — CINEMATIC COMMERCIAL SHOT
  // ==========================================================================
  const watchAwakensContainer = document.getElementById('watchAwakensContainer');
  const transitionWatchImg = document.getElementById('transitionWatchImg');
  const transitionOrbitRing = document.getElementById('transitionOrbitRing');
  const transitionStatement = document.getElementById('transitionStatement');
  const caseGlint = document.getElementById('caseGlint');
  const sapphireGlint = document.getElementById('sapphireGlint');
  const sec2Specs = document.getElementById('sec2Specs');

  gsap.timeline({
    scrollTrigger: {
      trigger: '#scene-hero-transition',
      start: 'top top',
      end: '+=250%',
      scrub: 1.0,
      pin: true,
      onUpdate: (self) => {
        const p = self.progress;
        const sceneSec2 = document.getElementById('scene-hero-transition');
        if (sceneSec2) {
          sceneSec2.style.backgroundColor = p > 0.45 ? '#101A2D' : '#070B14';
        }
        if (caseGlint) {
          caseGlint.style.opacity = (p > 0.15 && p < 0.5) ? '1' : '0';
          caseGlint.style.left = `${(p - 0.15) * 220}%`;
        }
        if (sapphireGlint) {
          sapphireGlint.style.opacity = (p > 0.45 && p < 0.8) ? '1' : '0';
        }
      }
    }
  })
  .fromTo(transitionWatchImg, 
    { scale: 1.25, rotateY: -4, rotateZ: -2, opacity: 0.7 }, 
    { scale: 0.95, rotateY: 3.5, rotateZ: 2, opacity: 1, duration: 1.5 }
  )
  .fromTo(transitionOrbitRing, { scale: 0.3, opacity: 0 }, { scale: 1.6, opacity: 0.22, duration: 1.5 }, 0)
  .fromTo(transitionStatement, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 1 }, 0.2)
  .fromTo(sec2Specs, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 1 }, 0.4)
  .to(transitionWatchImg, { scale: 1.35, x: '-8%', rotateY: 5, rotateZ: 4, duration: 1 })
  .to(transitionWatchImg, { scale: 3.2, opacity: 0.05, duration: 1 });

  // ==========================================================================
  // 5. SECTION 03: PRODUCT MOTION
  // ==========================================================================
  const secondHeroVideo = document.getElementById('productMotionVideo');
  const secondHeroStatement = document.getElementById('secondHeroStatement');

  gsap.timeline({
    scrollTrigger: {
      trigger: '#scene-watch-alive',
      start: 'top top',
      end: '+=100%',
      scrub: 1.0,
      pin: true
    }
  })
  .fromTo(secondHeroVideo, { scale: 0.85 }, { scale: 1.0, duration: 2 })
  .fromTo(secondHeroStatement, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 1 }, '-=1');

  // ==========================================================================
  // 6. SECTION 04: PHYSICAL ARCHITECTURE — LIGHT TRACE & BLUEPRINT PINNING
  // ==========================================================================
  const objectWatchImg = document.getElementById('objectWatchImg');
  const lightTraceBeam = document.getElementById('lightTraceBeam');
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
      end: '+=160%',
      scrub: 1.0,
      pin: true,
      onUpdate: (self) => {
        const p = self.progress;

        if (lightTraceBeam) {
          lightTraceBeam.style.opacity = (p > 0.1 && p < 0.95) ? '1' : '0';
          if (p < 0.38) {
            lightTraceBeam.style.top = '32%';
            lightTraceBeam.style.left = '32%';
          } else if (p < 0.68) {
            lightTraceBeam.style.top = '15%';
            lightTraceBeam.style.left = '50%';
          } else {
            lightTraceBeam.style.top = '62%';
            lightTraceBeam.style.left = '68%';
          }
        }

        if (techLabel1) techLabel1.classList.toggle('active', p >= 0.20 && p < 0.45);
        if (techLabel2) techLabel2.classList.toggle('active', p >= 0.45 && p < 0.70);
        if (techLabel3) techLabel3.classList.toggle('active', p >= 0.70 && p <= 0.95);
      }
    }
  })
  .fromTo(objectWatchImg, { scale: 1.22, rotateY: -3 }, { scale: 0.98, rotateY: 2, duration: 2 })
  .to([line1, line2, line3], { strokeDashoffset: 0, duration: 1.5 }, 0.2)
  .to([dot1, dot2, dot3], { opacity: 0.8, duration: 0.5 }, 0.4)
  .fromTo(builtStatement, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 1 }, 0.3);

  // ==========================================================================
  // 7. SECTION 05: MECHANICAL MOVEMENT
  // ==========================================================================
  const mechCanvas = document.getElementById('mechanical-canvas');
  const mechMacroImg = document.getElementById('mechMacroImg');
  const mechStatement = document.getElementById('mechStatement');
  const specReserve = document.getElementById('specReserve');
  const specOscillation = document.getElementById('specOscillation');
  const specJewels = document.getElementById('specJewels');
  const specRotor = document.getElementById('specRotor');
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
      const radius = Math.min(cx, cy) * 0.35;

      gearAngle += 0.008;
      balanceOsc += 0.08;

      mechCtx.save();
      mechCtx.translate(cx, cy);
      mechCtx.rotate(gearAngle);
      mechCtx.strokeStyle = 'rgba(184, 162, 122, 0.35)';
      mechCtx.lineWidth = 1.2;

      const teeth = 24;
      for (let i = 0; i < teeth; i++) {
        const a = (i / teeth) * Math.PI * 2;
        const x1 = Math.cos(a) * radius;
        const y1 = Math.sin(a) * radius;
        const x2 = Math.cos(a) * (radius + 12);
        const y2 = Math.sin(a) * (radius + 12);

        mechCtx.beginPath();
        mechCtx.moveTo(x1, y1);
        mechCtx.lineTo(x2, y2);
        mechCtx.stroke();
      }
      mechCtx.restore();

      mechCtx.save();
      mechCtx.translate(cx, cy);
      mechCtx.rotate(Math.sin(balanceOsc) * 0.25);
      mechCtx.strokeStyle = 'rgba(245, 241, 232, 0.3)';
      mechCtx.lineWidth = 1.5;
      mechCtx.beginPath();
      mechCtx.arc(0, 0, radius * 0.6, 0, Math.PI * 2);
      mechCtx.stroke();
      mechCtx.restore();

      requestAnimationFrame(drawMechanicalGears);
    }
    drawMechanicalGears();
  }

  gsap.timeline({
    scrollTrigger: {
      trigger: '#scene-mechanical',
      start: 'top top',
      end: '+=150%',
      scrub: 1.0,
      pin: true,
      onUpdate: (self) => {
        const p = self.progress;
        if (specReserve) specReserve.classList.toggle('active', p >= 0.18 && p < 0.42);
        if (specOscillation) specOscillation.classList.toggle('active', p >= 0.42 && p < 0.68);
        if (specJewels) specJewels.classList.toggle('active', p >= 0.68 && p < 0.88);
        if (specRotor) specRotor.classList.toggle('active', p >= 0.88 && p <= 0.98);
      }
    }
  })
  .fromTo(mechMacroImg, { scale: 1.35, x: '-5%', y: '3%' }, { scale: 1.0, x: '0%', y: '0%', duration: 2 })
  .fromTo(mechStatement, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 1 }, '-=1');

  // ==========================================================================
  // 8. SECTION 06: ORBITAL DYNAMICS — ASTRONOMICAL ROTATION & ORBIT LOCK MOMENT
  // ==========================================================================
  const orbitalWatchImg = document.getElementById('orbitalWatchImg');
  const orbitalSvg = document.getElementById('orbitalSvg');
  const orbitalStatement = document.getElementById('orbitalStatement');
  const ringCircleLock = document.getElementById('ringCircleLock');
  const orbitalHalo = document.getElementById('orbitalHalo');
  const orbitalTelemetry = document.getElementById('orbitalTelemetry');

  gsap.timeline({
    scrollTrigger: {
      trigger: '#scene-orbital-field',
      start: 'top top',
      end: '+=150%',
      scrub: 1.0,
      pin: true,
      onUpdate: (self) => {
        const p = self.progress;

        if (ringCircleLock) {
          ringCircleLock.classList.toggle('active-lock', p >= 0.45 && p <= 0.68);
        }

        if (orbitalHalo) {
          orbitalHalo.style.transform = `scale(${1 + p * 0.4})`;
          orbitalHalo.style.opacity = (p > 0.1 && p < 0.9) ? `${0.4 + p * 0.4}` : '0.2';
        }
      }
    }
  })
  .fromTo(orbitalWatchImg, { rotateZ: -8, scale: 0.88 }, { rotateZ: 3, scale: 1.08, duration: 1.5 })
  .fromTo(orbitalSvg, { rotate: 0 }, { rotate: 240, duration: 2 }, 0)
  .fromTo(orbitalStatement, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 1 }, 0.2)
  .fromTo(orbitalTelemetry, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 1 }, 0.4)
  .to(orbitalWatchImg, { scale: 0.98, rotateZ: 0, duration: 1 });

  // ==========================================================================
  // 9. SECTION 07: MATERIAL PURITY — MACRO LENS FOCUS & SCROLL SCRUBBING
  // ==========================================================================
  const matDotBtns = document.querySelectorAll('.material-dot-btn');
  const matSlides = {
    metal: document.getElementById('mat-slide-metal'),
    sapphire: document.getElementById('mat-slide-sapphire'),
    dial: document.getElementById('mat-slide-dial'),
    leather: document.getElementById('mat-slide-leather')
  };

  const matBgs = {
    metal: '#070B14',
    sapphire: '#0A1424',
    dial: '#060E1A',
    leather: '#0B0E14'
  };

  function activateMaterial(mat) {
    matDotBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-material') === mat);
    });

    Object.keys(matSlides).forEach(k => {
      if (matSlides[k]) matSlides[k].classList.toggle('active', k === mat);
    });

    const matSec = document.getElementById('scene-material-journey');
    if (matSec && matBgs[mat]) {
      matSec.style.backgroundColor = matBgs[mat];
      document.body.style.backgroundColor = matBgs[mat];
    }
  }

  matDotBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const mat = btn.getAttribute('data-material');
      activateMaterial(mat);
    });
  });

  ScrollTrigger.create({
    trigger: '#scene-material-journey',
    start: 'top top',
    end: '+=180%',
    pin: true,
    scrub: 0.8,
    onUpdate: (self) => {
      const p = self.progress;
      const keys = ['metal', 'sapphire', 'dial', 'leather'];
      const idx = Math.min(3, Math.floor(p * 4));
      const activeMat = keys[idx];
      activateMaterial(activeMat);
    }
  });

  // ==========================================================================
  // 10. SECTION 08: DIAL CHRONOGRAPHY
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
      const radius = Math.min(cx, cy) * 0.38;

      dialCtx.save();
      dialCtx.translate(cx, cy);

      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
        const x1 = Math.cos(a) * (radius + 18);
        const y1 = Math.sin(a) * (radius + 18);
        const x2 = Math.cos(a) * (radius + 32);
        const y2 = Math.sin(a) * (radius + 32);

        dialCtx.strokeStyle = (i % 3 === 0) ? '#B8A27A' : 'rgba(245, 241, 232, 0.25)';
        dialCtx.lineWidth = (i % 3 === 0) ? 2 : 1;

        dialCtx.beginPath();
        dialCtx.moveTo(x1, y1);
        dialCtx.lineTo(x2, y2);
        dialCtx.stroke();
      }

      dialCtx.beginPath();
      dialCtx.arc(0, 0, radius, 0, Math.PI * 2);
      dialCtx.strokeStyle = 'rgba(184, 162, 122, 0.25)';
      dialCtx.lineWidth = 1;
      dialCtx.stroke();

      const angleRad = secondHandProgress * Math.PI * 2 - Math.PI / 2;
      const handLength = radius + (secondHandProgress * 65);
      const handX = Math.cos(angleRad) * handLength;
      const handY = Math.sin(angleRad) * handLength;

      dialCtx.beginPath();
      dialCtx.moveTo(0, 0);
      dialCtx.lineTo(handX, handY);
      dialCtx.strokeStyle = 'rgba(184, 162, 122, 0.85)';
      dialCtx.lineWidth = 1.5;
      dialCtx.stroke();

      dialCtx.beginPath();
      dialCtx.arc(handX, handY, 3, 0, Math.PI * 2);
      dialCtx.fillStyle = '#B8A27A';
      dialCtx.fill();

      dialCtx.beginPath();
      dialCtx.arc(0, 0, 4, 0, Math.PI * 2);
      dialCtx.fillStyle = '#F5F1E8';
      dialCtx.fill();

      dialCtx.restore();
      requestAnimationFrame(drawDialChronography);
    }
    drawDialChronography();
  }

  ScrollTrigger.create({
    trigger: '#scene-dial',
    start: 'top top',
    end: '+=80%',
    pin: true,
    scrub: 0.8,
    onUpdate: (self) => {
      secondHandProgress = self.progress;
    }
  });

  // ==========================================================================
  // 11. SECTION 09: HUMAN TEMPORALITY — 3 DISTINCT VISUAL VIEWS ON SCROLL
  // ==========================================================================
  const humanSlides = {
    morning: document.getElementById('human-slide-morning'),
    golden: document.getElementById('human-slide-golden'),
    blue: document.getElementById('human-slide-blue')
  };

  const humanPhaseTags = {
    morning: document.getElementById('tag-morning'),
    golden: document.getElementById('tag-golden'),
    blue: document.getElementById('tag-blue')
  };

  ScrollTrigger.create({
    trigger: '#scene-human-moment',
    start: 'top top',
    end: '+=180%',
    pin: true,
    scrub: 0.8,
    onUpdate: (self) => {
      const p = self.progress;
      let activePhase = 'morning';

      if (p < 0.35) {
        activePhase = 'morning';
      } else if (p < 0.70) {
        activePhase = 'golden';
      } else {
        activePhase = 'blue';
      }

      Object.keys(humanSlides).forEach(k => {
        if (humanSlides[k]) humanSlides[k].classList.toggle('active', k === activePhase);
      });

      Object.keys(humanPhaseTags).forEach(k => {
        if (humanPhaseTags[k]) humanPhaseTags[k].classList.toggle('active', k === activePhase);
      });
    }
  });

  // ==========================================================================
  // 12. SECTION 10: FINAL PRODUCT SCENE
  // ==========================================================================
  const finalWatchWrapper = document.getElementById('finalWatchWrapper');
  const finalStatement = document.getElementById('finalStatement');
  const finalCtaBtn = document.getElementById('finalCtaBtn');

  if (finalWatchWrapper && finalStatement && finalCtaBtn) {
    gsap.timeline({
      scrollTrigger: {
        trigger: '#scene-final-product',
        start: 'top 75%',
        end: 'bottom 25%',
        scrub: 0.8
      }
    })
    .fromTo(finalWatchWrapper, { scale: 0.92, opacity: 0.5, y: 25 }, { scale: 1.0, opacity: 1, y: 0, duration: 2 })
    .fromTo(finalStatement, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1.2 }, '-=0.8')
    .fromTo(finalCtaBtn, { opacity: 0, scale: 0.94, y: 12 }, { opacity: 1, scale: 1.0, y: 0, duration: 1 }, '-=0.6');
  }

  // Lenis Smooth Scroll Binding for Anchor Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = anchor.getAttribute('href');
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        lenis.scrollTo(targetEl, { offset: 0, duration: 1.6 });
      }
    });
  });

  // Dynamic Background Sync
  const body = document.body;
  const scenes = document.querySelectorAll('.hero-scene');
  scenes.forEach(scene => {
    const bg = scene.getAttribute('data-bg');

    ScrollTrigger.create({
      trigger: scene,
      start: 'top 50%',
      end: 'bottom 50%',
      onEnter: () => {
        if (bg) body.style.backgroundColor = bg;
      },
      onEnterBack: () => {
        if (bg) body.style.backgroundColor = bg;
      }
    });
  });

  // Refresh GSAP ScrollTrigger Layout Boundaries
  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });
});
