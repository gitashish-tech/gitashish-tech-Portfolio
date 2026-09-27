/* =========================================================
   ASHISH GADE — CYBERSECURITY PORTFOLIO
   Modular JS: smooth scroll, reveals, 3D hero, SOC visuals,
   project canvases, constellation, form validation.
   ========================================================= */

(() => {
  "use strict";

  const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const IS_TOUCH = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  const IS_MOBILE = window.innerWidth < 780;

  /* ---------------------------------------------------
     0. LOADER
  --------------------------------------------------- */
  function initLoader() {
    const loader = document.getElementById("loader");
    if (!loader) return;
    window.addEventListener("load", () => {
      setTimeout(() => loader.classList.add("hidden"), 900);
    });
    // fallback in case 'load' already fired
    setTimeout(() => loader.classList.add("hidden"), 3000);
  }

  /* ---------------------------------------------------
     1. SMOOTH SCROLL (Lenis) + GSAP ScrollTrigger bridge
  --------------------------------------------------- */
  let lenis = null;

  function initSmoothScroll() {
    if (REDUCED_MOTION || typeof Lenis === "undefined") return;

    lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      touchMultiplier: 1.1,
    });

    lenis.on("scroll", () => {
      if (window.ScrollTrigger) ScrollTrigger.update();
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    if (window.gsap && window.ScrollTrigger) {
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }
  }

  /* ---------------------------------------------------
     2. CUSTOM CURSOR
  --------------------------------------------------- */
  function initCursor() {
    if (IS_TOUCH) return;
    const dot = document.querySelector(".cursor-dot");
    const ring = document.querySelector(".cursor-ring");
    if (!dot || !ring) return;

    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;

    window.addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
    });

    function loop() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    }
    loop();

    document.querySelectorAll("a, button, .tilt-card, input, textarea").forEach((el) => {
      el.addEventListener("mouseenter", () => ring.classList.add("hovering"));
      el.addEventListener("mouseleave", () => ring.classList.remove("hovering"));
    });
  }

  /* ---------------------------------------------------
     3. NAVBAR: scroll state, active link, mobile menu
  --------------------------------------------------- */
  function initNavbar() {
    const navbar = document.getElementById("navbar");
    const links = document.querySelectorAll("[data-nav]");
    const indicator = document.getElementById("navIndicator");
    const toggle = document.getElementById("navToggle");
    const mobileMenu = document.getElementById("mobileMenu");
    const sections = [...document.querySelectorAll("main section[id]")];

    window.addEventListener("scroll", () => {
      navbar.classList.toggle("scrolled", window.scrollY > 40);
    }, { passive: true });

    function moveIndicator(el) {
      if (!el || !indicator) return;
      indicator.style.width = el.offsetWidth + "px";
      indicator.style.transform = `translateX(${el.offsetLeft}px)`;
    }

    function setActive(id) {
      links.forEach((l) => {
        const match = l.getAttribute("href") === `#${id}`;
        l.classList.toggle("active", match);
        if (match) moveIndicator(l);
      });
    }

    const initialActive = document.querySelector(".nav-link.active");
    requestAnimationFrame(() => moveIndicator(initialActive));
    window.addEventListener("resize", () => moveIndicator(document.querySelector(".nav-link.active")));

    if (window.gsap && window.ScrollTrigger) {
      sections.forEach((sec) => {
        ScrollTrigger.create({
          trigger: sec,
          start: "top 50%",
          end: "bottom 50%",
          onEnter: () => setActive(sec.id),
          onEnterBack: () => setActive(sec.id),
        });
      });
    }

    toggle?.addEventListener("click", () => {
      const open = mobileMenu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.querySelectorAll("[data-nav-mobile]").forEach((a) => {
      a.addEventListener("click", () => mobileMenu.classList.remove("open"));
    });
  }

  /* ---------------------------------------------------
     4. SCROLL REVEALS (GSAP)
  --------------------------------------------------- */
  function initReveals() {
    if (!window.gsap) return;
    gsap.registerPlugin(ScrollTrigger);

    document.querySelectorAll("[data-reveal]").forEach((el, i) => {
      gsap.fromTo(
        el,
        { autoAlpha: 0, y: REDUCED_MOTION ? 0 : 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: REDUCED_MOTION ? 0.01 : 0.9,
          ease: "power3.out",
          delay: (i % 4) * 0.05,
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    // timeline progress bar
    const progress = document.getElementById("timelineProgress");
    const timeline = document.querySelector(".timeline");
    if (progress && timeline) {
      gsap.to(progress, {
        height: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: timeline,
          start: "top 70%",
          end: "bottom 60%",
          scrub: 0.6,
        },
      });
    }
  }

  /* ---------------------------------------------------
     5. MAGNETIC BUTTONS
  --------------------------------------------------- */
  function initMagnetic() {
    if (IS_TOUCH || REDUCED_MOTION) return;
    document.querySelectorAll(".magnetic").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.4}px)`;
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "translate(0,0)";
      });
    });
  }

  /* ---------------------------------------------------
     6. 3D TILT CARDS
  --------------------------------------------------- */
  function initTilt() {
    if (IS_TOUCH || REDUCED_MOTION) return;
    document.querySelectorAll("[data-tilt]").forEach((card) => {
      const strength = 10;
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(700px) rotateX(${(-py * strength).toFixed(2)}deg) rotateY(${(px * strength).toFixed(2)}deg) translateZ(6px)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "perspective(700px) rotateX(0) rotateY(0) translateZ(0)";
      });
    });
  }

  /* ---------------------------------------------------
     7. HERO 3D SCENE (Three.js)
     Floating glass shield + rotating rings + particles
  --------------------------------------------------- */
  function initHeroScene() {
    const mount = document.getElementById("hero-3d");
    if (!mount || typeof THREE === "undefined") return;

    const width = mount.clientWidth || 500;
    const height = mount.clientHeight || 500;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 9);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // --- Shield core (icosahedron, wireframe glass look) ---
    const shieldGeo = new THREE.IcosahedronGeometry(2.1, 1);
    const shieldMat = new THREE.MeshBasicMaterial({
      color: 0x4cf3ff,
      wireframe: true,
      transparent: true,
      opacity: 0.55,
    });
    const shield = new THREE.Mesh(shieldGeo, shieldMat);
    group.add(shield);

    const shieldInnerGeo = new THREE.IcosahedronGeometry(1.5, 0);
    const shieldInnerMat = new THREE.MeshBasicMaterial({
      color: 0x35ffb0,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const shieldInner = new THREE.Mesh(shieldInnerGeo, shieldInnerMat);
    group.add(shieldInner);

    // --- Rotating security rings ---
    const rings = [];
    [2.7, 3.3, 3.9].forEach((r, i) => {
      const ringGeo = new THREE.TorusGeometry(r, 0.008, 8, 100);
      const ringMat = new THREE.MeshBasicMaterial({
        color: i === 1 ? 0x35ffb0 : 0x4cf3ff,
        transparent: true,
        opacity: 0.35,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2 + i * 0.35;
      ring.rotation.y = i * 0.5;
      group.add(ring);
      rings.push(ring);
    });

    // --- Glowing nodes on outer ring ---
    const nodeGeo = new THREE.SphereGeometry(0.045, 12, 12);
    const nodeMat = new THREE.MeshBasicMaterial({ color: 0x4cf3ff });
    const nodes = [];
    const nodeCount = IS_MOBILE ? 8 : 14;
    for (let i = 0; i < nodeCount; i++) {
      const node = new THREE.Mesh(nodeGeo, nodeMat.clone());
      const angle = (i / nodeCount) * Math.PI * 2;
      const radius = 3.9;
      node.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius * 0.4, Math.sin(angle) * radius);
      group.add(node);
      nodes.push(node);
    }

    // --- Particle field (encrypted data points) ---
    const particleCount = IS_MOBILE ? 250 : 700;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const r = 5 + Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x4cf3ff,
      size: 0.02,
      transparent: true,
      opacity: 0.5,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // mouse parallax
    let targetX = 0, targetY = 0;
    window.addEventListener("mousemove", (e) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 0.6;
      targetY = (e.clientY / window.innerHeight - 0.5) * 0.4;
    });

    function resize() {
      const w = mount.clientWidth || 500;
      const h = mount.clientHeight || 500;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener("resize", resize);

    let raf;
    const clock = new THREE.Clock();
    function animate() {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      shield.rotation.y = t * 0.15;
      shield.rotation.x = t * 0.07;
      shieldInner.rotation.y = -t * 0.22;
      shieldInner.rotation.x = t * 0.1;

      rings.forEach((ring, i) => {
        ring.rotation.z = t * (0.08 + i * 0.03);
      });

      nodes.forEach((node, i) => {
        node.material.opacity = 0.6 + Math.sin(t * 2 + i) * 0.4;
        node.scale.setScalar(1 + Math.sin(t * 2 + i) * 0.3);
      });

      particles.rotation.y = t * 0.02;

      group.rotation.y += (targetX - group.rotation.y) * 0.04;
      group.rotation.x += (-targetY - group.rotation.x) * 0.04;

      renderer.render(scene, camera);
    }

    if (REDUCED_MOTION) {
      renderer.render(scene, camera);
    } else {
      animate();
    }

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else if (!REDUCED_MOTION) animate();
    });
  }

  /* ---------------------------------------------------
     8. HERO BACKGROUND CANVAS (grid + binary + nodes)
  --------------------------------------------------- */
  function initBgCanvas() {
    const canvas = document.getElementById("bg-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w, h, dpr;

    const binaryChars = ["0", "1"];
    let glyphs = [];
    let nodesArr = [];

    function resize() {
      dpr = Math.min(window.devicePixelRatio, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildScene();
    }

    function buildScene() {
      const count = IS_MOBILE ? 20 : 45;
      glyphs = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        v: binaryChars[Math.floor(Math.random() * 2)],
        speed: 0.15 + Math.random() * 0.35,
        opacity: 0.06 + Math.random() * 0.14,
      }));
      const nodeCount = IS_MOBILE ? 10 : 22;
      nodesArr = Array.from({ length: nodeCount }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 1 + Math.random() * 1.5,
      }));
    }

    function drawGrid() {
      const size = 64;
      ctx.strokeStyle = "rgba(76,243,255,0.045)";
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += size) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = 0; y < h; y += size) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }
    }

    function drawNodes() {
      ctx.strokeStyle = "rgba(76,243,255,0.08)";
      for (let i = 0; i < nodesArr.length; i++) {
        for (let j = i + 1; j < nodesArr.length; j++) {
          const a = nodesArr[i], b = nodesArr[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 180) {
            ctx.globalAlpha = 1 - d / 180;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      nodesArr.forEach((n) => {
        ctx.fillStyle = "rgba(53,255,176,0.5)";
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
      });
    }

    function drawGlyphs() {
      ctx.font = "12px 'JetBrains Mono', monospace";
      glyphs.forEach((g) => {
        ctx.fillStyle = `rgba(76,243,255,${g.opacity})`;
        ctx.fillText(g.v, g.x, g.y);
        g.y += g.speed;
        if (g.y > h) { g.y = -10; g.x = Math.random() * w; }
      });
    }

    let raf;
    function loop() {
      ctx.clearRect(0, 0, w, h);
      drawGrid();
      drawNodes();
      drawGlyphs();
      raf = requestAnimationFrame(loop);
    }

    resize();
    window.addEventListener("resize", resize);

    if (REDUCED_MOTION) {
      drawGrid(); drawNodes(); drawGlyphs();
    } else {
      loop();
    }
  }

  /* ---------------------------------------------------
     9. SOC BACKGROUND CANVAS (subtle scan particles)
  --------------------------------------------------- */
  function initSocCanvas() {
    const canvas = document.getElementById("soc-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w, h, dpr, dots;

    function resize() {
      dpr = Math.min(window.devicePixelRatio, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = IS_MOBILE ? 30 : 70;
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vy: 0.1 + Math.random() * 0.3,
      }));
    }

    function loop() {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(76,243,255,0.35)";
      dots.forEach((d) => {
        ctx.beginPath(); ctx.arc(d.x, d.y, 1, 0, Math.PI * 2); ctx.fill();
        d.y -= d.vy;
        if (d.y < 0) d.y = h;
      });
      requestAnimationFrame(loop);
    }

    resize();
    window.addEventListener("resize", resize);
    if (!REDUCED_MOTION) loop();
  }

  /* ---------------------------------------------------
     10. SOC GLOBE (Three.js rotating network sphere)
  --------------------------------------------------- */
  function initSocGlobe() {
    const mount = document.getElementById("soc-globe");
    if (!mount || typeof THREE === "undefined") return;

    const width = mount.clientWidth || 400;
    const height = mount.clientHeight || 320;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const wireGeo = new THREE.SphereGeometry(2, 20, 16);
    const wireMat = new THREE.MeshBasicMaterial({ color: 0x4cf3ff, wireframe: true, transparent: true, opacity: 0.28 });
    globeGroup.add(new THREE.Mesh(wireGeo, wireMat));

    // network points on sphere surface
    const pointCount = IS_MOBILE ? 18 : 34;
    const pts = [];
    for (let i = 0; i < pointCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / pointCount);
      const theta = Math.sqrt(pointCount * Math.PI) * phi;
      const x = 2 * Math.cos(theta) * Math.sin(phi);
      const y = 2 * Math.sin(theta) * Math.sin(phi);
      const z = 2 * Math.cos(phi);
      pts.push(new THREE.Vector3(x, y, z));
    }
    const pointGeo = new THREE.SphereGeometry(0.03, 8, 8);
    const pointMat = new THREE.MeshBasicMaterial({ color: 0x35ffb0 });
    pts.forEach((p) => {
      const m = new THREE.Mesh(pointGeo, pointMat);
      m.position.copy(p);
      globeGroup.add(m);
    });

    // a handful of connecting arcs
    const lineMat = new THREE.LineBasicMaterial({ color: 0x4cf3ff, transparent: true, opacity: 0.35 });
    for (let i = 0; i < pointCount; i += 3) {
      const a = pts[i], b = pts[(i + 7) % pointCount];
      const geo = new THREE.BufferGeometry().setFromPoints([a, b]);
      globeGroup.add(new THREE.Line(geo, lineMat));
    }

    function resize() {
      const w = mount.clientWidth || 400;
      const h = mount.clientHeight || 320;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener("resize", resize);

    const clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      globeGroup.rotation.y = t * 0.18;
      globeGroup.rotation.x = Math.sin(t * 0.2) * 0.15;
      renderer.render(scene, camera);
    }
    if (REDUCED_MOTION) renderer.render(scene, camera);
    else animate();
  }

  /* ---------------------------------------------------
     11. SOC LINE GRAPH (animated SVG polyline)
  --------------------------------------------------- */
  function initSocGraph() {
    const line = document.getElementById("soc-line");
    if (!line) return;
    const points = 40;
    let phase = 0;

    function render() {
      let str = "";
      for (let i = 0; i <= points; i++) {
        const x = (i / points) * 400;
        const y = 50 + Math.sin(i * 0.5 + phase) * 18 + Math.sin(i * 0.2 + phase * 1.7) * 8;
        str += `${x.toFixed(1)},${y.toFixed(1)} `;
      }
      line.setAttribute("points", str.trim());
      phase += 0.035;
      if (!REDUCED_MOTION) requestAnimationFrame(render);
    }
    render();
  }

  /* ---------------------------------------------------
     12. PROJECT CANVASES (lightweight 2D visuals)
  --------------------------------------------------- */
  function initProjectCanvases() {
    document.querySelectorAll(".project-canvas").forEach((canvas) => {
      const type = canvas.dataset.project;
      const ctx = canvas.getContext("2d");
      let w, h, dpr;

      function resize() {
        dpr = Math.min(window.devicePixelRatio, 2);
        w = canvas.clientWidth; h = canvas.clientHeight;
        canvas.width = w * dpr; canvas.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      resize();
      window.addEventListener("resize", resize);

      let t = 0;
      function frame() {
        t += 0.016;
        ctx.clearRect(0, 0, w, h);
        if (type === "malware") drawMalware(ctx, w, h, t);
        else if (type === "stego") drawStego(ctx, w, h, t);
        else if (type === "ev") drawEv(ctx, w, h, t);
        else if (type === "voice") drawVoice(ctx, w, h, t);
        else if (type === "tracker") drawTracker(ctx, w, h, t);
        else if (type === "portal") drawPortal(ctx, w, h, t);
        else if (type === "dashboard") drawDashboard(ctx, w, h, t);
        else if (type === "ecommerce") drawEcommerce(ctx, w, h, t);
        if (!REDUCED_MOTION) requestAnimationFrame(frame);
      }
      frame();
    });
  }

  function drawMalware(ctx, w, h, t) {
    ctx.strokeStyle = "rgba(76,243,255,0.15)";
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 20 + i * 22, 0, Math.PI * 2);
      ctx.stroke();
    }
    const scanY = (Math.sin(t * 0.8) * 0.5 + 0.5) * h;
    const grad = ctx.createLinearGradient(0, scanY - 20, 0, scanY + 20);
    grad.addColorStop(0, "rgba(53,255,176,0)");
    grad.addColorStop(0.5, "rgba(53,255,176,0.35)");
    grad.addColorStop(1, "rgba(53,255,176,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, scanY - 20, w, 40);

    ctx.fillStyle = "rgba(76,243,255,0.5)";
    for (let i = 0; i < 10; i++) {
      const angle = (i / 10) * Math.PI * 2 + t * 0.3;
      const r = 60 + Math.sin(t + i) * 10;
      const x = w / 2 + Math.cos(angle) * r;
      const y = h / 2 + Math.sin(angle) * r * 0.6;
      ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.fill();
    }
  }

  function drawStego(ctx, w, h, t) {
    const cols = 14, rows = 10;
    const cw = w / cols, ch = h / rows;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const n = Math.sin(x * 0.6 + t) * Math.cos(y * 0.6 + t * 0.7);
        const alpha = 0.04 + Math.abs(n) * 0.12;
        ctx.fillStyle = n > 0 ? `rgba(76,243,255,${alpha})` : `rgba(53,255,176,${alpha})`;
        ctx.fillRect(x * cw, y * ch, cw - 2, ch - 2);
      }
    }
  }

  function drawEv(ctx, w, h, t) {
    ctx.strokeStyle = "rgba(76,243,255,0.12)";
    for (let x = 0; x < w; x += 30) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
    for (let y = 0; y < h; y += 30) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

    const nodes = [[0.2,0.3],[0.5,0.2],[0.8,0.4],[0.35,0.7],[0.7,0.75],[0.5,0.5]];
    ctx.strokeStyle = "rgba(53,255,176,0.4)";
    for (let i = 0; i < nodes.length - 1; i++) {
      const [ax, ay] = nodes[i], [bx, by] = nodes[i + 1];
      ctx.beginPath(); ctx.moveTo(ax * w, ay * h); ctx.lineTo(bx * w, by * h); ctx.stroke();
    }
    nodes.forEach(([nx, ny], i) => {
      const pulse = 3 + Math.sin(t * 2 + i) * 1.4;
      ctx.fillStyle = "rgba(76,243,255,0.8)";
      ctx.beginPath(); ctx.arc(nx * w, ny * h, pulse, 0, Math.PI * 2); ctx.fill();
    });
  }

  // --- Project 04: Voice-to-Code — waveform morphing into code lines ---
  function drawVoice(ctx, w, h, t) {
    ctx.strokeStyle = "rgba(76,243,255,0.08)";
    for (let x = 0; x < w; x += 24) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }

    // audio waveform (top half)
    const midY = h * 0.38;
    ctx.strokeStyle = "rgba(76,243,255,0.85)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 4) {
      const n = Math.sin(x * 0.05 + t * 3) * Math.sin(x * 0.011 + t) * (h * 0.16);
      const y = midY + n;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.strokeStyle = "rgba(76,243,255,0.25)";
    ctx.beginPath(); ctx.moveTo(0, midY); ctx.lineTo(w, midY); ctx.stroke();

    // code lines (bottom half) fading in/out like a typewriter
    const baseY = h * 0.62;
    const lineWidths = [0.5, 0.75, 0.35, 0.65, 0.25];
    ctx.font = "11px 'JetBrains Mono', monospace";
    lineWidths.forEach((lw, i) => {
      const reveal = (Math.sin(t * 0.8 + i * 0.6) * 0.5 + 0.5);
      const y = baseY + i * 16;
      const fullW = w * 0.7 * lw;
      const drawW = fullW * reveal;
      ctx.strokeStyle = "rgba(53,255,176,0.6)";
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(w * 0.15, y); ctx.lineTo(w * 0.15 + drawW, y); ctx.stroke();
    });
  }

  // --- Project 05: Task Tracker — kanban columns with moving cards ---
  function drawTracker(ctx, w, h, t) {
    const cols = 3;
    const colW = w / cols;
    const colors = ["rgba(76,243,255,0.5)", "rgba(160,140,255,0.5)", "rgba(53,255,176,0.5)"];

    for (let c = 0; c < cols; c++) {
      const x = c * colW;
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.strokeRect(x + 8, 10, colW - 16, h - 20);

      const cardCount = 2 + (c % 2);
      for (let i = 0; i < cardCount; i++) {
        const bob = Math.sin(t * 1.4 + i + c) * 3;
        const cardY = 24 + i * 34 + bob;
        ctx.fillStyle = "rgba(255,255,255,0.05)";
        ctx.fillRect(x + 14, cardY, colW - 28, 22);
        ctx.strokeStyle = colors[c];
        ctx.lineWidth = 1.5;
        ctx.strokeRect(x + 14, cardY, colW - 28, 22);
        ctx.fillStyle = colors[c];
        ctx.fillRect(x + 20, cardY + 8, (colW - 40) * (0.4 + 0.3 * Math.sin(t + i)), 3);
      }
    }
  }

  // --- Project 06: Permit Portal — document with animated status stamp ---
  function drawPortal(ctx, w, h, t) {
    const cx = w / 2, cy = h / 2;
    const docW = w * 0.34, docH = h * 0.62;

    ctx.fillStyle = "rgba(255,255,255,0.04)";
    ctx.fillRect(cx - docW / 2, cy - docH / 2, docW, docH);
    ctx.strokeStyle = "rgba(160,140,255,0.5)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(cx - docW / 2, cy - docH / 2, docW, docH);

    // document lines
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 5; i++) {
      const ly = cy - docH / 2 + 14 + i * 11;
      const lw = docW * (i === 4 ? 0.4 : 0.75);
      ctx.beginPath(); ctx.moveTo(cx - docW / 2 + 10, ly); ctx.lineTo(cx - docW / 2 + 10 + lw, ly); ctx.stroke();
    }

    // rotating approval stamp / ring
    const pulse = Math.sin(t * 1.5) * 0.5 + 0.5;
    ctx.save();
    ctx.translate(cx + docW * 0.42, cy - docH * 0.28);
    ctx.rotate(t * 0.6);
    ctx.strokeStyle = `rgba(53,255,176,${0.4 + pulse * 0.4})`;
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, 0, 16, 0, Math.PI * 1.5); ctx.stroke();
    ctx.restore();
    ctx.fillStyle = `rgba(53,255,176,${0.6 + pulse * 0.4})`;
    ctx.font = "9px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText("OK", cx + docW * 0.42, cy - docH * 0.28 + 3);

    // floating filter tags below
    ["Status", "Date", "Type"].forEach((label, i) => {
      const fx = cx - docW * 0.7 + i * 40;
      const fy = cy + docH / 2 + 22 + Math.sin(t + i) * 3;
      ctx.fillStyle = "rgba(76,243,255,0.12)";
      ctx.fillRect(fx - 16, fy - 8, 34, 16);
      ctx.strokeStyle = "rgba(76,243,255,0.4)";
      ctx.strokeRect(fx - 16, fy - 8, 34, 16);
    });
  }

  // --- Project 07: Data Dashboard — animated bar chart + trend line ---
  function drawDashboard(ctx, w, h, t) {
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    for (let y = h * 0.15; y < h * 0.85; y += (h * 0.7) / 4) {
      ctx.beginPath(); ctx.moveTo(w * 0.1, y); ctx.lineTo(w * 0.9, y); ctx.stroke();
    }

    const barCount = 7;
    const barAreaW = w * 0.8, barAreaX = w * 0.1;
    const barW = (barAreaW / barCount) * 0.5;
    for (let i = 0; i < barCount; i++) {
      const bx = barAreaX + (barAreaW / barCount) * i + (barAreaW / barCount - barW) / 2;
      const barH = (h * 0.55) * (0.35 + 0.5 * (Math.sin(t * 1.1 + i * 1.3) * 0.5 + 0.5));
      const by = h * 0.85 - barH;
      const grad = ctx.createLinearGradient(0, by, 0, h * 0.85);
      grad.addColorStop(0, "rgba(76,243,255,0.75)");
      grad.addColorStop(1, "rgba(76,243,255,0.1)");
      ctx.fillStyle = grad;
      ctx.fillRect(bx, by, barW, barH);
    }

    // overlaid trend line
    ctx.strokeStyle = "rgba(53,255,176,0.85)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= barCount; i++) {
      const x = barAreaX + (barAreaW / barCount) * i;
      const y = h * 0.55 + Math.sin(t * 1.1 + i * 1.1) * (h * 0.12);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // --- Project 08: E-Commerce Analysis — animated donut chart ---
  function drawEcommerce(ctx, w, h, t) {
    const cx = w * 0.32, cy = h / 2, r = Math.min(w, h) * 0.28;
    const segments = [0.38, 0.24, 0.21, 0.17];
    const colors = ["76,243,255", "53,255,176", "160,140,255", "255,255,255"];
    let start = -Math.PI / 2 + t * 0.15;
    segments.forEach((seg, i) => {
      const end = start + seg * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, start, end);
      ctx.closePath();
      ctx.fillStyle = `rgba(${colors[i]},${i === 0 ? 0.55 : 0.3})`;
      ctx.fill();
      start = end;
    });
    ctx.beginPath(); ctx.arc(cx, cy, r * 0.55, 0, Math.PI * 2);
    ctx.fillStyle = "#0b0e10"; ctx.fill();

    // small trend bars beside the donut
    const barX = w * 0.62;
    for (let i = 0; i < 5; i++) {
      const bh = (h * 0.4) * (0.3 + 0.5 * (Math.sin(t * 1.2 + i) * 0.5 + 0.5));
      ctx.fillStyle = "rgba(76,243,255,0.55)";
      ctx.fillRect(barX + i * 14, h * 0.72 - bh, 8, bh);
    }
  }

  /* ---------------------------------------------------
     13. CONSTELLATION (interests) — canvas nodes + lines
  --------------------------------------------------- */
  function initConstellation() {
    const canvas = document.getElementById("constellation-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const labels = ["SOC", "Threat Detection", "Malware Analysis", "Network Security", "Vulnerability Analysis", "AI Security", "Incident Response"];
    let w, h, dpr, nodes;
    let mouse = { x: -9999, y: -9999 };

    function resize() {
      dpr = Math.min(window.devicePixelRatio, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildNodes();
    }

    function buildNodes() {
      const cx = w / 2, cy = h / 2;
      const radius = Math.min(w, h) * 0.32;
      nodes = labels.map((label, i) => {
        const angle = (i / labels.length) * Math.PI * 2 - Math.PI / 2;
        return {
          label,
          x: cx + Math.cos(angle) * radius,
          y: cy + Math.sin(angle) * radius,
          baseX: cx + Math.cos(angle) * radius,
          baseY: cy + Math.sin(angle) * radius,
        };
      });
      nodes.push({ label: "CORE", x: cx, y: cy, baseX: cx, baseY: cy, core: true });
    }

    canvas.addEventListener("mousemove", (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    });
    canvas.addEventListener("mouseleave", () => { mouse.x = -9999; mouse.y = -9999; });

    function draw() {
      ctx.clearRect(0, 0, w, h);
      const core = nodes[nodes.length - 1];

      // lines from core to each node
      nodes.slice(0, -1).forEach((n) => {
        const d = Math.hypot(n.x - mouse.x, n.y - mouse.y);
        const near = d < 60;
        ctx.strokeStyle = near ? "rgba(53,255,176,0.7)" : "rgba(76,243,255,0.18)";
        ctx.lineWidth = near ? 1.6 : 1;
        ctx.beginPath(); ctx.moveTo(core.x, core.y); ctx.lineTo(n.x, n.y); ctx.stroke();
      });

      // outer ring connections
      for (let i = 0; i < nodes.length - 1; i++) {
        const a = nodes[i], b = nodes[(i + 1) % (nodes.length - 1)];
        ctx.strokeStyle = "rgba(76,243,255,0.08)";
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }

      // core node
      ctx.fillStyle = "rgba(76,243,255,0.9)";
      ctx.beginPath(); ctx.arc(core.x, core.y, 6, 0, Math.PI * 2); ctx.fill();
      ctx.font = "600 11px 'JetBrains Mono', monospace";
      ctx.fillStyle = "#4CF3FF";
      ctx.textAlign = "center";
      ctx.fillText("CORE", core.x, core.y - 14);

      nodes.slice(0, -1).forEach((n) => {
        const d = Math.hypot(n.x - mouse.x, n.y - mouse.y);
        const near = d < 60;
        ctx.fillStyle = near ? "#35FFB0" : "rgba(243,246,247,0.8)";
        ctx.beginPath(); ctx.arc(n.x, n.y, near ? 5 : 3.5, 0, Math.PI * 2); ctx.fill();

        ctx.font = near ? "600 12px 'Space Grotesk', sans-serif" : "500 11px 'Space Grotesk', sans-serif";
        ctx.fillStyle = near ? "#F3F6F7" : "rgba(138,146,153,0.85)";
        ctx.fillText(n.label, n.x, n.y - 12);
      });

      if (!REDUCED_MOTION) requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    draw();
  }

  /* ---------------------------------------------------
     14. CONTACT FORM VALIDATION
  --------------------------------------------------- */
  function initContactForm() {
    const form = document.getElementById("contactForm");
    if (!form) return;
    const status = document.getElementById("formStatus");

    const fields = {
      name: { el: document.getElementById("name"), err: document.getElementById("nameError") },
      email: { el: document.getElementById("email"), err: document.getElementById("emailError") },
      message: { el: document.getElementById("message"), err: document.getElementById("messageError") },
    };

    function validEmail(v) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    }

    function setError(key, msg) {
      const f = fields[key];
      f.err.textContent = msg || "";
      f.el.closest(".form-field").classList.toggle("error", !!msg);
    }

    function validate() {
      let ok = true;
      if (!fields.name.el.value.trim()) { setError("name", "Please enter your name."); ok = false; }
      else setError("name", "");

      if (!fields.email.el.value.trim()) { setError("email", "Please enter your email."); ok = false; }
      else if (!validEmail(fields.email.el.value.trim())) { setError("email", "Enter a valid email address."); ok = false; }
      else setError("email", "");

      if (!fields.message.el.value.trim() || fields.message.el.value.trim().length < 10) {
        setError("message", "Message should be at least 10 characters.");
        ok = false;
      } else setError("message", "");

      return ok;
    }

    Object.values(fields).forEach((f) => {
      f.el.addEventListener("blur", validate);
      f.el.addEventListener("input", () => {
        if (f.el.closest(".form-field").classList.contains("error")) validate();
      });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validate()) {
        status.textContent = "";
        return;
      }
      handleContactSubmit(form, status);
    });
  }

  // Replace this function body with a real request to EmailJS,
  // Formspree, or your own backend endpoint when ready.
  function handleContactSubmit(form, status) {
    status.style.color = "var(--green)";
    status.textContent = "Sending...";

    // Example integration point (Formspree):
    // fetch('https://formspree.io/f/yourFormId', {
    //   method: 'POST',
    //   headers: { Accept: 'application/json' },
    //   body: new FormData(form)
    // }).then(...)

    setTimeout(() => {
      status.textContent = "Message ready to send — connect a backend (EmailJS/Formspree) to deliver it.";
      form.reset();
    }, 700);
  }

  /* ---------------------------------------------------
     INIT
  --------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    initLoader();
    initSmoothScroll();
    initCursor();
    initNavbar();
    initReveals();
    initMagnetic();
    initTilt();
    initHeroScene();
    initBgCanvas();
    initSocCanvas();
    initSocGlobe();
    initSocGraph();
    initProjectCanvases();
    initConstellation();
    initContactForm();
  });
})();
