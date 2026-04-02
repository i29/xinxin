// ========================================
// Animations - Particles, Effects, Stars
// ========================================

// Star field background
let cachedGradient: CanvasGradient | null = null;
let lastThemeKey = '';
let accentRgb = '139, 92, 246';

export function initStarField(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d', { alpha: false })!; // Alpha false for performance
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  interface Star {
    x: number;
    y: number;
    size: number;
    speed: number;
    opacity: number;
    twinkleSpeed: number;
    twinklePhase: number;
    isLarge: boolean;
  }

  const stars: Star[] = [];
  const STAR_COUNT = 30; // Reduced from 75 to 30

  for (let i = 0; i < STAR_COUNT; i++) {
    const size = Math.random() * 2 + 0.5;
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: size,
      speed: Math.random() * 0.2 + 0.03, // Reduced speed
      opacity: Math.random() * 0.6 + 0.2, // Reduced opacity range
      twinkleSpeed: Math.random() * 0.015 + 0.003, // Reduced twinkle speed
      twinklePhase: Math.random() * Math.PI * 2,
      isLarge: size > 1.2,
    });
  }

  function draw() {
    // 1. Draw cached gradient background
    const themeKey = `${currentTheme.primary}-${currentTheme.secondary}`;
    if (themeKey !== lastThemeKey || !cachedGradient) {
      cachedGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      cachedGradient.addColorStop(0, currentTheme.primary);
      cachedGradient.addColorStop(0.5, currentTheme.secondary);
      cachedGradient.addColorStop(1, currentTheme.primary);
      lastThemeKey = themeKey;
      accentRgb = hexToRgb(currentTheme.accent);
    }

    ctx.fillStyle = cachedGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Draw stars
    for (const star of stars) {
      star.twinklePhase += star.twinkleSpeed;
      const twinkle = Math.sin(star.twinklePhase) * 0.3 + 0.7;
      const alpha = star.opacity * twinkle;

      // Glow for larger stars
      if (star.isLarge) {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${accentRgb}, ${alpha * 0.1})`;
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fill();

      // Slow drift
      star.y += star.speed;
      if (star.y > canvas.height) {
        star.y = 0;
        star.x = Math.random() * canvas.width;
      }
    }

    requestAnimationFrame(draw);
  }

  draw();

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    cachedGradient = null; // Re-create on next draw
  });
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '139, 92, 246';
}

// Spawn floating emoji effect
export function spawnFloatingEmoji(container: HTMLElement, emoji: string, x?: number, y?: number) {
  const el = document.createElement('div');
  el.className = 'float-effect';
  el.textContent = emoji;
  el.style.left = (x ?? Math.random() * container.clientWidth) + 'px';
  el.style.top = (y ?? container.clientHeight * 0.5) + 'px';
  container.appendChild(el);
  el.addEventListener('animationend', () => el.remove());
}

// Dynamic Environment Colors
const SPECIES_THEMES: Record<string, { primary: string; secondary: string; accent: string }> = {
  cat: { primary: '#0a0e1a', secondary: '#1e1b4b', accent: '#f59e0b' }, // Purple/Indigo -> Gold
  dog: { primary: '#0a1a10', secondary: '#064e3b', accent: '#60a5fa' }, // Dark Green -> Blue
  rabbit: { primary: '#1a0a15', secondary: '#701a75', accent: '#f472b6' }, // Dark Pink -> Rose
  hamster: { primary: '#1a130a', secondary: '#78350f', accent: '#fdba74' }, // Dark Brown -> Orange
  fox: { primary: '#130a1a', secondary: '#4c1d95', accent: '#c084fc' }, // Dark Purple -> Violet
  unicorn: { primary: '#0a1a1a', secondary: '#164e63', accent: '#67e8f9' }, // Dark Teal -> Cyan
};

let currentTheme = { primary: '#0a0e1a', secondary: '#0f1629', accent: '#8b5cf6' };

export function updateEnvironment(speciesId: string, stageIndex: number) {
  const theme = SPECIES_THEMES[speciesId] || SPECIES_THEMES.cat;
  const root = document.documentElement;
  root.style.setProperty('--bg-primary', theme.primary);
  root.style.setProperty('--exp-color', theme.accent);

  // Update Habitat Background
  const env = document.getElementById('pet-environment');
  if (env) {
    env.style.background = theme.secondary;
    env.style.opacity = '1';

    // Gradient overlay for depth
    env.style.backgroundImage = `linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.4) 100%), ${theme.secondary}`;
  }

  root.style.setProperty('--star-speed-mult', (1 + stageIndex * 0.1).toString());

  // Apply visual integration to pet
  const pet = document.getElementById('pet-avatar');
  if (pet) {
    // Remove all old tints
    pet.className = pet.className
      .split(' ')
      .filter((c) => !c.startsWith('tint-'))
      .join(' ');
    pet.classList.add(`tint-${speciesId}`);
  }
}

export function updatePetShadow(x: string, y: string, visible: boolean = true) {
  const shadow = document.getElementById('pet-shadow');
  if (shadow) {
    shadow.style.left = x;
    shadow.style.top = `calc(${y} + 40px)`; // Offset shadow below pet
    shadow.style.opacity = visible ? '1' : '0';

    // Scale shadow based on vertical position
    const yVal = parseFloat(y) || 50;
    const scale = 0.5 + (yVal / 100) * 0.5;
    shadow.style.transform = `translate(-50%, 0) scale(${scale})`;
  }
}

export function renderHabitat(species: any) {
  const display = document.getElementById('pet-display')!;
  const sky = document.getElementById('habitat-sky')!;
  const ground = document.getElementById('habitat-ground')!;
  const mid = document.getElementById('habitat-mid')!;

  // Clear old dynamic props
  document.querySelectorAll('.habitat-prop, .env-particle').forEach((el) => el.remove());

  // 1. Texture & Atmosphere
  const env = species.environment;
  const pType = env.particleType;

  // Set ground texture
  ground.className = 'habitat-layer habitat-ground';
  if (species.id === 'dog' || species.id === 'hamster') ground.classList.add('texture-grass');
  else if (species.id === 'cat') ground.classList.add('texture-wood');
  else ground.classList.add('texture-stone');

  // Set sky atmosphere
  sky.style.background = env.background;

  // 2. High-Fidelity Particles
  if (pType !== 'none') {
    const pCount = 6; // Reduced from 12 to 6
    for (let i = 0; i < pCount; i++) {
      const p = document.createElement('div');
      p.className = `env-particle ${pType}`;
      p.style.left = `${Math.random() * 100}%`;
      p.style.top = `${Math.random() * 100}%`;
      p.style.animationDelay = `${Math.random() * 8}s`; // Longer delay

      if (pType === 'leaf') {
        const leaves = ['🍃', '🍂'];
        p.textContent = leaves[Math.floor(Math.random() * leaves.length)];
      }

      display.appendChild(p);
    }
  }

  // 3. High-Fidelity Mid Layer Props
  mid.innerHTML = '';
  const propCount = 3;
  for (let i = 0; i < propCount; i++) {
    const p = document.createElement('div');
    p.className = 'habitat-prop';
    p.style.left = `${10 + i * 35}%`;
    p.style.bottom = `${5 + Math.random() * 10}%`;

    // Draw species-specific high-fidelity props
    if (species.id === 'dog' || species.id === 'hamster') {
      // Bush/Bush Structure
      p.style.width = '80px';
      p.style.height = '60px';
      p.style.borderRadius = '50% 50% 0 0';
      p.style.background = 'linear-gradient(to bottom, #059669, #064e3b)';
      p.style.boxShadow = 'inset 0 10px 20px rgba(255,255,255,0.1)';
    } else if (species.id === 'cat') {
      // Modern Furniture block
      p.style.width = '60px';
      p.style.height = '100px';
      p.style.background = '#475569';
      p.style.borderRadius = '8px';
      p.style.borderRight = '10px solid #1e293b';
    } else {
      // Crystal/Mystic monolith
      p.style.width = '40px';
      p.style.height = '80px';
      p.style.background =
        'linear-gradient(135deg, rgba(139, 92, 246, 0.4), rgba(167, 139, 250, 0.4))';
      p.style.clipPath = 'polygon(50% 0%, 100% 20%, 80% 100%, 20% 100%, 0% 20%)';
      p.style.backdropFilter = 'blur(4px)';
      p.style.border = '1px solid rgba(255,255,255,0.2)';
    }
    mid.appendChild(p);
  }

  // 4. Ambient Lighting Overlay
  const overlay = document.createElement('div');
  overlay.className = 'habitat-prop habitat-prop-back';
  overlay.style.inset = '0';
  overlay.style.background = `radial-gradient(circle at 50% 20%, transparent 20%, rgba(0,0,0,0.6) 100%)`;
  overlay.style.mixBlendMode = 'multiply';
  display.appendChild(overlay);
}

export function updateFacilityIcons(species: any) {
  const foodIcon = document.querySelector('#facility-food .facility-icon');
  const toyIcon = document.querySelector('#facility-toy .facility-icon');
  const washIcon = document.querySelector('#facility-wash .facility-icon');

  if (foodIcon) foodIcon.textContent = species.environment.facilities.food;
  if (toyIcon) toyIcon.textContent = species.environment.facilities.toy;
  if (washIcon) washIcon.textContent = species.environment.facilities.wash;
}

// Spawn floating text (e.g., "+30 饥饿")
export function spawnFloatingText(
  container: HTMLElement,
  text: string,
  color: string,
  x?: number,
  y?: number
) {
  const el = document.createElement('div');
  el.className = 'float-text';
  el.textContent = text;
  el.style.color = color;
  el.style.left = (x ?? container.clientWidth * 0.5) + 'px';
  el.style.top = (y ?? container.clientHeight * 0.4) + 'px';
  container.appendChild(el);
  el.addEventListener('animationend', () => el.remove());
}

// Burst particles at position
export function burstParticles(
  container: HTMLElement,
  x: number,
  y: number,
  count: number = 8, // Reduced from 12 to 8
  color?: string
) {
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
    const dist = 40 + Math.random() * 60; // Reduced distance
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist;
    p.style.setProperty('--dx', dx + 'px');
    p.style.setProperty('--dy', dy + 'px');
    p.style.left = x + 'px';
    p.style.top = y + 'px';
    p.style.background = color || `hsl(${Math.random() * 360}, 70%, 60%)`;
    p.style.width = 3 + Math.random() * 4 + 'px'; // Reduced size
    p.style.height = p.style.width;
    container.appendChild(p);
    p.addEventListener('animationend', () => p.remove());
  }
}

// Shake element
export function shakeElement(el: HTMLElement) {
  el.classList.remove('shake');
  void el.offsetWidth; // reflow
  el.classList.add('shake');
}

// 3D Tilt Effect for cards
export function initTiltEffect(el: HTMLElement) {
  let lastTime = 0;
  const throttleTime = 16; // ~60fps

  el.addEventListener('mousemove', (e) => {
    const currentTime = Date.now();
    if (currentTime - lastTime < throttleTime) return;
    lastTime = currentTime;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation (max 10 degrees - reduced from 15)
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;

    // Add dynamic shine/glare effect
    const shineX = (x / rect.width) * 100;
    const shineY = (y / rect.height) * 100;
    el.style.background = `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(255,255,255,0.08) 0%, transparent 80%), var(--glass-bg)`;
  });

  el.addEventListener('mouseleave', () => {
    el.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    el.style.background = 'var(--glass-bg)';
  });
}

// Hatch explosion particles
export function hatchExplosion(container: HTMLElement) {
  const cx = container.clientWidth / 2;
  const cy = container.clientHeight / 2;
  const colors = ['#fbbf24', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#ffffff'];
  for (let i = 0; i < 40; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const angle = Math.random() * Math.PI * 2;
    const dist = 80 + Math.random() * 200;
    p.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
    p.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
    p.style.left = cx + 'px';
    p.style.top = cy + 'px';
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    const size = 5 + Math.random() * 10;
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    p.style.animationDuration = 0.8 + Math.random() * 0.8 + 's';
    container.appendChild(p);
    p.addEventListener('animationend', () => p.remove());
  }
}
