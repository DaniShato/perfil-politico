
/* Perfil Político — Constelación animada */

(() => {
  const svg = document.getElementById("constelacion-svg");
  if (!svg) return;

  const nodes = [...svg.querySelectorAll("#const-nodes circle")];
  const lines = [...svg.querySelectorAll("#const-lines line")];
  const core = svg.querySelector("#const-core");
  const ring = svg.querySelector("#const-ring-outer");

  if (nodes.length !== 4 || !core || !ring) return;

  // Configuración personalizada
  const CONFIG = {
    speed: 1.4,
    amplitudeX: 14,
    amplitudeY: 16.8,
    frequencyX: 0.48,
    frequencyY: 0.37,
    coreRadius: 23,
    corePulse: 1,
    pulseFrequency: 0.9,
    rotationSpeed: 2.5,
    nodeRadius: 9,
    lineWidth: 3.4
  };

  // Posiciones de equilibrio
  const base = [
    { x: 68,  y: 92  },
    { x: 278, y: 66  },
    { x: 302, y: 252 },
    { x: 119, y: 299 },
    { x: 198, y: 180 }
  ];

  const connections = lines.map(line => ({
    element: line,
    from: Number(line.dataset.from),
    to: Number(line.dataset.to)
  }));

  const motionPreference = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  let frameId = null;
  let elapsed = 0;
  let lastTime = null;
  let isVisible = true;

  nodes.forEach(node => {
    node.setAttribute("r", CONFIG.nodeRadius);
  });

  lines.forEach(line => {
    line.setAttribute("stroke-width", CONFIG.lineWidth);
  });

  function getPositions(t) {
    return base.map((point, i) => {
      const factor = i === 4 ? 0.45 : 1;

      return {
        x: point.x + CONFIG.amplitudeX * factor *
          Math.sin(CONFIG.frequencyX * t + i * 1.7),

        y: point.y + CONFIG.amplitudeY * factor *
          Math.sin(CONFIG.frequencyY * t + i * 2.2)
      };
    });
  }

  function render(t, animated = true) {
    const positions = animated ? getPositions(t) : base;

    // Movimiento de los nodos negros
    nodes.forEach((node, i) => {
      node.setAttribute("cx", positions[i].x);
      node.setAttribute("cy", positions[i].y);
    });

    // Actualización de las conexiones
    connections.forEach(({ element, from, to }) => {
      const a = positions[from];
      const b = positions[to];

      element.setAttribute("x1", a.x);
      element.setAttribute("y1", a.y);
      element.setAttribute("x2", b.x);
      element.setAttribute("y2", b.y);
    });

    // Movimiento y pulsación del núcleo amarillo
    core.setAttribute("cx", positions[4].x);
    core.setAttribute("cy", positions[4].y);

    core.setAttribute(
      "r",
      CONFIG.coreRadius +
      (animated
        ? CONFIG.corePulse * Math.sin(t * CONFIG.pulseFrequency)
        : 0)
    );

    // Rotación del anillo exterior
    ring.setAttribute(
      "transform",
      `rotate(${animated ? t * CONFIG.rotationSpeed : 0}, 180, 180)`
    );
  }

  function animate(now) {
    if (lastTime === null) lastTime = now;

    const dt = Math.min((now - lastTime) / 1000, 0.05);

    lastTime = now;
    elapsed += dt * CONFIG.speed;

    render(elapsed);

    frameId = requestAnimationFrame(animate);
  }

  function start() {
    if (frameId !== null) return;
    if (motionPreference.matches) return;
    if (!isVisible || document.hidden) return;

    lastTime = null;
    frameId = requestAnimationFrame(animate);
  }

  function stop() {
    if (frameId !== null) {
      cancelAnimationFrame(frameId);
      frameId = null;
    }

    lastTime = null;
  }

  function syncAnimation() {
    if (motionPreference.matches) {
      stop();
      render(0, false);
    } else if (isVisible && !document.hidden) {
      start();
    } else {
      stop();
    }
  }

  // Pausar cuando la constelación no sea visible
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        syncAnimation();
      },
      { threshold: 0 }
    );

    observer.observe(svg);
  }

  document.addEventListener(
    "visibilitychange",
    syncAnimation
  );

  motionPreference.addEventListener(
    "change",
    syncAnimation
  );

  render(0, false);
  syncAnimation();
})();
