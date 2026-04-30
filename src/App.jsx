
import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────
   DESIGN TOKENS  (matching PRD spec)
   #0D0D0D bg · #00C853 accent · #FFFFFF text
───────────────────────────────────────── */

const G = "#00E64D";          // bright green CTA
const GD = "#00C853";         // green-dim hover
const CREAM = "#F5F0E8";      // Icons Edition palette

/* ── tiny utility: cn ── */
const cn = (...c) => c.filter(Boolean).join(" ");

/* ══════════════════════════════════════════
   MAGIC UI PRIMITIVES
══════════════════════════════════════════ */

/* Animated border beam */
function BorderBeam({ className }) {
  return (
    <span
      className={cn("pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden", className)}
      style={{ padding: "1px" }}
    >
      <span
        className="absolute inset-0 rounded-[inherit]"
        style={{
          background: `conic-gradient(from var(--angle,0deg), transparent 0%, ${G} 10%, transparent 20%)`,
          animation: "spin 4s linear infinite",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      <style>{`@keyframes spin{to{--angle:360deg}}`}</style>
    </span>
  );
}

/* Shimmer text */
function ShimmerText({ children, className }) {
  return (
    <span
      className={cn("relative inline-block", className)}
      style={{
        background: `linear-gradient(110deg,#fff 30%,${G} 50%,#fff 70%)`,
        backgroundSize: "200% auto",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        animation: "shimmer 3s linear infinite",
      }}
    >
      {children}
      <style>{`@keyframes shimmer{from{background-position:200% center}to{background-position:-200% center}}`}</style>
    </span>
  );
}

/* Animated number counter */
function Counter({ target, suffix = "", prefix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef();
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0;
        const step = target / 60;
        const t = setInterval(() => {
          start += step;
          if (start >= target) { setVal(target); clearInterval(t); }
          else setVal(Math.floor(start));
        }, 16);
      }
    });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{prefix}{val}{suffix}</span>;
}

/* Particle field background */
function ParticleField() {
  const canvasRef = useRef();
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let w = canvas.width = canvas.offsetWidth;
    let h = canvas.height = canvas.offsetHeight;
    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.3, a: Math.random(),
    }));
    let raf;
    function draw() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,230,77,${p.a * 0.4})`;
        ctx.fill();
      });
      // lines between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0,230,77,${(1 - dist / 100) * 0.08})`;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    }
    draw();
    const resize = () => { w = canvas.width = canvas.offsetWidth; h = canvas.height = canvas.offsetHeight; };
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />;
}

/* Noise texture overlay */
function Noise() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-10 opacity-[0.03]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "128px",
      }}
    />
  );
}

/* Glow orb */
function Orb({ color = G, size = 600, x = "50%", y = "50%", opacity = 0.12 }) {
  return (
    <div
      className="pointer-events-none absolute rounded-full"
      style={{
        width: size, height: size,
        left: x, top: y,
        transform: "translate(-50%,-50%)",
        background: `radial-gradient(circle,${color} 0%,transparent 70%)`,
        opacity,
        filter: "blur(1px)",
      }}
    />
  );
}

/* ══════════════════════════════════════════
   SHADCN-STYLE COMPONENTS
══════════════════════════════════════════ */

function Badge({ children, variant = "green" }) {
  const styles = {
    green: { background: "rgba(0,230,77,0.12)", color: G, border: `1px solid rgba(0,230,77,0.3)` },
    gray: { background: "rgba(255,255,255,0.06)", color: "#888", border: "1px solid rgba(255,255,255,0.1)" },
    amber: { background: "rgba(251,191,36,0.1)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.25)" },
  };
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-mono tracking-widest" style={styles[variant]}>
      {children}
    </span>
  );
}

function Button({ children, variant = "primary", size = "md", onClick, className }) {
  const base = "relative inline-flex items-center justify-center gap-2 font-semibold tracking-wide transition-all duration-200 select-none cursor-pointer";
  const sizes = { sm: "px-4 py-2 text-sm rounded-lg", md: "px-6 py-3 text-sm rounded-xl", lg: "px-8 py-4 text-base rounded-xl" };
  const variants = {
    primary: { background: G, color: "#000", boxShadow: `0 0 20px rgba(0,230,77,0.3)` },
    outline: { background: "transparent", color: G, border: `1.5px solid ${G}`, boxShadow: "none" },
    ghost: { background: "rgba(255,255,255,0.05)", color: "#fff", border: "1px solid rgba(255,255,255,0.1)" },
  };
  return (
    <button
      onClick={onClick}
      className={cn(base, sizes[size], "hover:scale-[1.03] active:scale-[0.98]", className)}
      style={variants[variant]}
    >
      {children}
    </button>
  );
}

function Card({ children, className, glow = false }) {
  return (
    <div
      className={cn("relative rounded-2xl p-6 transition-all duration-300", className)}
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(12px)",
        boxShadow: glow ? `0 0 40px rgba(0,230,77,0.08)` : "none",
      }}
    >
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════
   NAVIGATION
══════════════════════════════════════════ */

const NAV_LINKS = ["About", "Features", "News", "Community", "Ratings", "Player Stats"];

function Navbar({ activeSection, onBuy }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(5,5,5,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.07)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-black text-sm" style={{ background: G }}>FC</div>
          <span className="font-black text-white tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
            EA SPORTS <span style={{ color: G }}>FC 26</span>
          </span>
        </div>
        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(l => (
            <a
              key={l}
              href={`#${l.toLowerCase().replace(" ", "-")}`}
              className="px-3 py-2 text-sm rounded-lg transition-colors duration-200"
              style={{ color: activeSection === l ? G : "#888" }}
            >
              {l}
            </a>
          ))}
        </div>
        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Badge variant="green">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: G }} />
            Available Now
          </Badge>
          <Button size="sm" onClick={onBuy}>Buy Now →</Button>
        </div>
        {/* Mobile toggle */}
        <button className="md:hidden text-white p-2" onClick={() => setMobileOpen(!mobileOpen)}>
          <div className="w-5 h-0.5 bg-white mb-1 transition-all" style={{ transform: mobileOpen ? "rotate(45deg) translate(2px,5px)" : "" }} />
          <div className="w-5 h-0.5 bg-white mb-1 transition-all" style={{ opacity: mobileOpen ? 0 : 1 }} />
          <div className="w-5 h-0.5 bg-white transition-all" style={{ transform: mobileOpen ? "rotate(-45deg) translate(2px,-5px)" : "" }} />
        </button>
      </div>
      {mobileOpen && (
        <div className="md:hidden px-6 pb-4" style={{ background: "rgba(5,5,5,0.98)" }}>
          {NAV_LINKS.map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(" ", "-")}`} className="block py-2.5 text-sm border-b" style={{ color: "#888", borderColor: "rgba(255,255,255,0.07)" }} onClick={() => setMobileOpen(false)}>{l}</a>
          ))}
          <Button className="mt-4 w-full" onClick={() => { setMobileOpen(false); onBuy(); }}>Buy Now →</Button>
        </div>
      )}
    </nav>
  );
}

/* ══════════════════════════════════════════
   HERO SECTION
══════════════════════════════════════════ */

function Hero({ onBuy }) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: "#050505" }}>
      <ParticleField />
      <Noise />
      <Orb x="80%" y="30%" size={700} opacity={0.1} />
      <Orb x="10%" y="70%" size={500} opacity={0.06} />

      {/* Diagonal grid lines */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `repeating-linear-gradient(45deg,rgba(0,230,77,1) 0,rgba(0,230,77,1) 1px,transparent 0,transparent 50%)`,
        backgroundSize: "60px 60px",
      }} />

      <div className="relative z-20 max-w-7xl mx-auto px-6 pt-28 pb-16 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left */}
        <div>
          <div
            className="mb-6 transition-all duration-700"
            style={{ opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(20px)" }}
          >
            <Badge variant="green">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: G }} />
              EA SPORTS FC™ 26 · Official Site
            </Badge>
          </div>

          <h1
            className="font-black leading-[0.95] mb-6 transition-all duration-700 delay-100"
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(3rem, 8vw, 6rem)",
              opacity: loaded ? 1 : 0,
              transform: loaded ? "none" : "translateY(20px)",
            }}
          >
            <span className="text-white block">THE</span>
            <ShimmerText className="block">CLUB IS</ShimmerText>
            <span className="text-white block">YOURS.</span>
          </h1>

          <p
            className="text-lg mb-8 max-w-lg leading-relaxed transition-all duration-700 delay-200"
            style={{ color: "#777", opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(20px)" }}
          >
            Powered by your feedback. Rebuilt from the ground up with Manager Live Challenges,
            the all-new Archetypes system, and Football Ultimate Team innovations.
          </p>

          <div
            className="flex flex-wrap gap-4 mb-10 transition-all duration-700 delay-300"
            style={{ opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(20px)" }}
          >
            <Button size="lg" onClick={onBuy}>Buy Now →</Button>
            <Button variant="outline" size="lg">▶ Watch Trailer</Button>
          </div>

          {/* Platform strip */}
          <div
            className="flex flex-wrap gap-2 transition-all duration-700 delay-500"
            style={{ opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(10px)" }}
          >
            {["EA App", "PS5/4", "Xbox", "Switch", "Steam", "Epic"].map(p => (
              <span key={p} className="px-3 py-1.5 rounded-lg text-xs font-mono" style={{ background: "rgba(255,255,255,0.05)", color: "#555", border: "1px solid rgba(255,255,255,0.08)" }}>{p}</span>
            ))}
          </div>
        </div>

        {/* Right — abstract cover art mockup */}
        <div
          className="relative flex justify-center transition-all duration-1000 delay-300"
          style={{ opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateX(40px)" }}
        >
          <div className="relative w-80 h-96">
            {/* Glowing card */}
            <div
              className="absolute inset-0 rounded-3xl"
              style={{
                background: `linear-gradient(135deg,#0f1f0f 0%,#050505 50%,#001a0a 100%)`,
                border: `1px solid rgba(0,230,77,0.2)`,
                boxShadow: `0 0 80px rgba(0,230,77,0.15), inset 0 0 80px rgba(0,230,77,0.03)`,
              }}
            >
              <BorderBeam />
            </div>

            {/* Cover content */}
            <div className="relative z-10 flex flex-col h-full p-8 justify-between">
              <div>
                <div className="text-xs font-mono mb-1" style={{ color: G }}>EA SPORTS</div>
                <div className="text-5xl font-black" style={{ fontFamily: "'Syne',sans-serif", color: "#fff", letterSpacing: "-0.03em" }}>FC<br /><span style={{ color: G }}>26</span></div>
              </div>
              {/* Silhouettes */}
              <div className="flex gap-4 justify-center items-end py-4">
                {["IBRAHIMOVIĆ", "ZIDANE", "MORGAN"].map((name, i) => (
                  <div key={name} className="text-center">
                    <div
                      className="rounded-2xl mb-2 mx-auto"
                      style={{
                        width: i === 1 ? 70 : 52,
                        height: i === 1 ? 90 : 68,
                        background: `linear-gradient(180deg,rgba(0,230,77,0.15) 0%,rgba(0,230,77,0.03) 100%)`,
                        border: `1px solid rgba(0,230,77,${i === 1 ? 0.4 : 0.15})`,
                      }}
                    />
                    <div className="text-[8px] font-mono tracking-widest" style={{ color: "#444" }}>{name}</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-1">
                {["ICONS", "EDITION"].map(t => (
                  <span key={t} className="text-[10px] font-black tracking-widest" style={{ color: G }}>{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Floating accent cards */}
          <div className="absolute -right-8 top-12 px-3 py-2 rounded-xl text-xs font-mono" style={{ background: "rgba(0,230,77,0.08)", border: "1px solid rgba(0,230,77,0.2)", color: G }}>
            🏆 TOTY 2026
          </div>
          <div className="absolute -left-6 bottom-16 px-3 py-2 rounded-xl text-xs font-mono" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#888" }}>
            ⚽ FUT 26
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20">
        <span className="text-xs font-mono" style={{ color: "#444" }}>SCROLL</span>
        <div className="w-px h-12" style={{ background: `linear-gradient(to bottom,${G},transparent)`, animation: "fadeInDown 2s ease infinite" }} />
        <style>{`@keyframes fadeInDown{0%,100%{opacity:0;transform:translateY(-8px)}50%{opacity:1;transform:translateY(0)}}`}</style>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   STATS BAR
══════════════════════════════════════════ */

function StatsBar() {
  const stats = [
    { label: "Supported Platforms", val: 7, suffix: "" },
    { label: "Game Modes", val: 6, suffix: "+" },
    { label: "Buy Now CTR Target", val: 8, suffix: "%" },
    { label: "Core Web Vitals LCP", val: 2.5, suffix: "s", prefix: "<" },
  ];
  return (
    <div className="relative overflow-hidden" style={{ background: "rgba(0,230,77,0.04)", borderTop: "1px solid rgba(0,230,77,0.12)", borderBottom: "1px solid rgba(0,230,77,0.12)" }}>
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map(s => (
          <div key={s.label} className="text-center">
            <div className="text-3xl md:text-4xl font-black mb-1" style={{ fontFamily: "'Syne',sans-serif", color: G }}>
              <Counter target={s.val} suffix={s.suffix} prefix={s.prefix || ""} />
            </div>
            <div className="text-xs font-mono tracking-widest" style={{ color: "#555" }}>{s.label.toUpperCase()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   FEATURES CAROUSEL
══════════════════════════════════════════ */

const FEATURES = [
  {
    tag: "NEW · PLAYER CAREER",
    title: "Archetypes",
    desc: "Brand-new Archetypes inspired by greats of the game. Select your base Archetype, earn XP, upgrade attributes, and unlock legendary Archetype Perks.",
    icon: "⭐",
    accent: G,
  },
  {
    tag: "NEW · MANAGER CAREER",
    title: "Manager Live Challenges",
    desc: "Real-world football events drive in-game challenges. React to the live football calendar and prove your managerial instincts week by week.",
    icon: "🏆",
    accent: "#fbbf24",
  },
  {
    tag: "FUT 26",
    title: "Football Ultimate Team",
    desc: "UEFA Road to the Final, Squad Battles, Rivals, Champions and Draft — plus World Tour Season Stats and FUT innovations built from community feedback.",
    icon: "⚽",
    accent: "#38bdf8",
  },
  {
    tag: "CLUBS",
    title: "Pro Clubs & Volta",
    desc: "Build your club from the ground up. New deep customization tools, online modes, and a social experience designed for communities.",
    icon: "🏟",
    accent: "#a78bfa",
  },
  {
    tag: "SEASONAL",
    title: "TOTY & TOTS",
    desc: "Team of the Year and Team of the Season — time-limited content campaigns with the most sought-after player items in FUT history.",
    icon: "🌟",
    accent: "#fb923c",
  },
  {
    tag: "RATINGS",
    title: "Player Ratings",
    desc: "Rebuilt Ratings system informed by community and performance data. Every attribute reflects real-world impact on the virtual pitch.",
    icon: "📊",
    accent: "#34d399",
  },
  {
    tag: "COMMUNITY",
    title: "FC Feedback",
    desc: "For the first time, community feedback is directly embedded into the development pipeline. Your voice shapes FC 26.",
    icon: "💬",
    accent: G,
  },
];

function FeaturesCarousel() {
  const [active, setActive] = useState(0);
  const f = FEATURES[active];
  return (
    <section id="features" className="relative py-28 overflow-hidden" style={{ background: "#050505" }}>
      <Orb x="50%" y="50%" size={800} opacity={0.05} />
      <Noise />
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <Badge variant="gray" className="mb-4">04 · Features</Badge>
          <h2 className="text-4xl md:text-6xl font-black text-white" style={{ fontFamily: "'Syne',sans-serif", letterSpacing: "-.02em" }}>
            Game-changing <span style={{ color: G }}>features</span>
          </h2>
        </div>

        {/* Main feature display */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
          <div key={active} style={{ animation: "fadeUp .4s ease" }}>
            <Badge variant="green" className="mb-4">{f.tag}</Badge>
            <h3 className="text-5xl font-black text-white mb-4" style={{ fontFamily: "'Syne',sans-serif" }}>{f.title}</h3>
            <p className="text-lg leading-relaxed mb-8" style={{ color: "#666" }}>{f.desc}</p>
            <Button variant="outline">Learn More →</Button>
          </div>

          {/* Feature visual */}
          <div className="relative">
            <div
              className="relative rounded-3xl overflow-hidden flex items-center justify-center"
              style={{
                height: 320,
                background: `radial-gradient(circle at 50% 50%,${f.accent}18 0%,rgba(5,5,5,0.8) 70%)`,
                border: `1px solid ${f.accent}30`,
                boxShadow: `0 0 60px ${f.accent}10`,
              }}
            >
              <div style={{ fontSize: 120, opacity: 0.3, animation: "pop .4s ease" }}>{f.icon}</div>
              <div className="absolute bottom-0 left-0 right-0 h-1/3" style={{ background: "linear-gradient(to top,rgba(5,5,5,1),transparent)" }} />
              <div className="absolute bottom-6 left-6">
                <div className="text-xs font-mono mb-1" style={{ color: f.accent, opacity: 0.8 }}>{f.tag}</div>
                <div className="text-2xl font-black text-white" style={{ fontFamily: "'Syne',sans-serif" }}>{f.title}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Dot nav + arrow */}
        <div className="flex items-center justify-center gap-4">
          <button className="w-10 h-10 rounded-full border flex items-center justify-center text-white hover:border-green-500 transition-colors" style={{ borderColor: "rgba(255,255,255,0.15)" }} onClick={() => setActive((active - 1 + FEATURES.length) % FEATURES.length)}>←</button>
          <div className="flex gap-2">
            {FEATURES.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{ width: i === active ? 24 : 6, background: i === active ? G : "rgba(255,255,255,0.15)" }}
              />
            ))}
          </div>
          <button className="w-10 h-10 rounded-full border flex items-center justify-center text-white hover:border-green-500 transition-colors" style={{ borderColor: "rgba(255,255,255,0.15)" }} onClick={() => setActive((active + 1) % FEATURES.length)}>→</button>
        </div>
      </div>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}@keyframes pop{from{transform:scale(.7);opacity:0}to{transform:scale(1);opacity:.3}}`}</style>
    </section>
  );
}

/* ══════════════════════════════════════════
   GAME MODES GRID
══════════════════════════════════════════ */

const MODES = [
  { icon: "⚽", name: "Football Ultimate Team", sub: "FUT 26", desc: "UEFA Road to the Final · Squad Battles · Rivals · Champions · Draft · World Tour Season Stats", hot: true },
  { icon: "🏆", name: "Manager Career", sub: "Live Challenges", desc: "React to real-world football events through Manager Live Challenges. Your squad, your decisions.", hot: true },
  { icon: "⭐", name: "Player Career", sub: "Archetypes", desc: "Choose your Archetype, earn XP, unlock attributes and legendary Perks." },
  { icon: "🏟", name: "Clubs", sub: "Pro Clubs", desc: "Build your club online with friends. Deep customization and community-driven progression." },
  { icon: "🌆", name: "Volta Football", sub: "Street Mode", desc: "Fast, creative street football back with new courts and style-based gameplay." },
  { icon: "📊", name: "Player Stats & Ratings", sub: "Data Hub", desc: "Real-time stats and rebuilt community-informed ratings for thousands of players." },
];

function GameModes() {
  return (
    <section id="about" className="py-28" style={{ background: "#080808" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <Badge variant="gray" className="mb-4">02 · Game Modes</Badge>
            <h2 className="text-4xl md:text-5xl font-black text-white" style={{ fontFamily: "'Syne',sans-serif", letterSpacing: "-.02em" }}>
              Every way to <span style={{ color: G }}>play.</span>
            </h2>
          </div>
          <Button variant="ghost">View All Features →</Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODES.map((m, i) => (
            <Card
              key={m.name}
              className="group cursor-pointer hover:border-green-900 transition-all duration-300"
              glow={m.hot}
            >
              {m.hot && (
                <div className="absolute top-4 right-4">
                  <Badge variant="green">NEW</Badge>
                </div>
              )}
              <div className="text-4xl mb-4">{m.icon}</div>
              <div className="text-xs font-mono mb-1" style={{ color: G }}>{m.sub}</div>
              <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Syne',sans-serif" }}>{m.name}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "#555" }}>{m.desc}</p>
              <div className="mt-4 pt-4 border-t flex items-center justify-between" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <span className="text-xs font-mono" style={{ color: "#444" }}>EXPLORE MODE</span>
                <span style={{ color: G }}>→</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   EDITIONS / BUY
══════════════════════════════════════════ */

function Editions({ onBuy }) {
  const platforms = ["EA App", "PS5", "PS4", "Xbox", "Switch", "Steam", "Epic"];
  return (
    <section id="community" className="py-28 relative overflow-hidden" style={{ background: "#050505" }}>
      <Orb x="30%" y="50%" size={600} opacity={0.07} />
      <Noise />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <Badge variant="gray" className="mb-4">Buy · Editions</Badge>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-4" style={{ fontFamily: "'Syne',sans-serif", letterSpacing: "-.02em" }}>
            Choose your <span style={{ color: G }}>edition.</span>
          </h2>
          <p style={{ color: "#555" }}>Available on 7 platforms. Pre-order now for exclusive bonuses.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12">
          {/* Standard Edition */}
          <div className="relative rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="p-8">
              <div className="text-xs font-mono mb-2" style={{ color: "#555" }}>STANDARD EDITION</div>
              <div className="text-3xl font-black text-white mb-1" style={{ fontFamily: "'Syne',sans-serif" }}>FC 26</div>
              <div className="text-sm mb-6" style={{ color: "#555" }}>Base game · All platforms</div>
              <ul className="space-y-2 mb-8">
                {["Full base game access", "Online multiplayer", "FUT access", "Clubs & Career modes"].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm" style={{ color: "#888" }}>
                    <span style={{ color: G }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full" onClick={() => onBuy("standard")}>Buy Standard →</Button>
            </div>
          </div>

          {/* Icons Edition */}
          <div className="relative rounded-2xl overflow-hidden" style={{ background: `linear-gradient(135deg,${CREAM}08 0%,rgba(5,5,5,0.9) 100%)`, border: `1.5px solid ${G}40`, boxShadow: `0 0 60px rgba(0,230,77,0.08)` }}>
            <div className="absolute top-4 right-4">
              <Badge variant="green">⭐ Icons Edition</Badge>
            </div>
            <div className="p-8">
              <div className="text-xs font-mono mb-2" style={{ color: G }}>ICONS EDITION</div>
              <div className="text-3xl font-black text-white mb-1" style={{ fontFamily: "'Syne',sans-serif" }}>FC 26 Icons</div>
              <div className="flex gap-2 mb-6">
                {["Ibrahimović", "Zidane", "Morgan"].map(n => (
                  <span key={n} className="text-xs px-2 py-1 rounded-lg" style={{ background: `${CREAM}15`, color: CREAM, border: `1px solid ${CREAM}20` }}>{n}</span>
                ))}
              </div>
              <ul className="space-y-2 mb-8">
                {["Everything in Standard", "3 Icon Loan Players", "ICONS Edition FUT items", "Early Access (3 days)", "Exclusive kit & badge"].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm" style={{ color: "#aaa" }}>
                    <span style={{ color: G }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Button className="w-full" onClick={() => onBuy("icons")}>Buy Icons Edition →</Button>
            </div>
          </div>
        </div>

        {/* Platform strip */}
        <div className="text-center">
          <div className="text-xs font-mono mb-4" style={{ color: "#444" }}>AVAILABLE ON</div>
          <div className="flex flex-wrap justify-center gap-3">
            {platforms.map(p => (
              <div key={p} className="px-4 py-2 rounded-xl text-sm font-mono flex items-center gap-2" style={{ background: "rgba(255,255,255,0.04)", color: "#666", border: "1px solid rgba(255,255,255,0.07)" }}>
                {p}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   NEWS SECTION
══════════════════════════════════════════ */

const NEWS = [
  {
    tag: "NEWS ARTICLE",
    date: "March 27, 2026",
    title: "Football Ultimate Team 26 — UEFA Road to the Final",
    excerpt: "The biggest FUT campaign of the year is here. UEFA Road to the Final returns with upgraded live content, dynamic item upgrades, and new SBC structures.",
    accent: "#38bdf8",
  },
  {
    tag: "DEEP DIVE",
    date: "April 2, 2026",
    title: "Archetypes System: Everything You Need to Know",
    excerpt: "From choosing your base Archetype to unlocking legendary Perks — the complete breakdown of FC 26's most exciting new Career mode feature.",
    accent: G,
  },
  {
    tag: "PATCH NOTES",
    date: "April 10, 2026",
    title: "Manager Live Challenges — First Season Preview",
    excerpt: "The first wave of Manager Live Challenges has been revealed. Real-world football events now directly power your in-game experience.",
    accent: "#fbbf24",
  },
];

function News() {
  return (
    <section id="news" className="py-28" style={{ background: "#080808" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <Badge variant="gray" className="mb-4">News</Badge>
            <h2 className="text-4xl md:text-5xl font-black text-white" style={{ fontFamily: "'Syne',sans-serif", letterSpacing: "-.02em" }}>
              Latest from <span style={{ color: G }}>FC 26.</span>
            </h2>
          </div>
          <Button variant="ghost">All News →</Button>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {NEWS.map((n, i) => (
            <div
              key={i}
              className="group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              {/* Color bar top */}
              <div className="h-1 w-full" style={{ background: `linear-gradient(to right,${n.accent},transparent)` }} />

              {/* Image placeholder */}
              <div className="h-40 flex items-center justify-center text-5xl" style={{ background: `radial-gradient(circle,${n.accent}12 0%,rgba(5,5,5,0) 70%)` }}>
                ⚽
              </div>

              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Badge variant="gray">{n.tag}</Badge>
                  <span className="text-xs font-mono" style={{ color: "#444" }}>{n.date}</span>
                </div>
                <h3 className="text-base font-bold text-white mb-2 leading-snug group-hover:text-green-400 transition-colors" style={{ fontFamily: "'Syne',sans-serif" }}>{n.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#555" }}>{n.excerpt}</p>
                <div className="mt-4 pt-4 border-t flex items-center gap-1 text-xs font-mono transition-colors" style={{ borderColor: "rgba(255,255,255,0.06)", color: "#444" }}>
                  <span className="group-hover:text-green-400 transition-colors">READ MORE</span>
                  <span className="group-hover:text-green-400 transition-colors group-hover:translate-x-1 transition-transform inline-block">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   COMMUNITY / FC FEEDBACK
══════════════════════════════════════════ */

function Community() {
  const pillars = [
    { icon: "🗣", title: "FC Feedback", desc: "Submit, vote, and track feature requests directly influencing development." },
    { icon: "🌍", title: "World Tour Stats", desc: "Global FUT leaderboards and season-level performance tracking." },
    { icon: "📅", title: "TOTY & TOTS", desc: "Vote for your Team of the Year. Shape the most iconic items in FUT history." },
    { icon: "🎮", title: "Content Creators", desc: "Dedicated creator hub, early access programs, and partnership opportunities." },
  ];
  return (
    <section id="ratings" className="py-28 relative overflow-hidden" style={{ background: "#050505" }}>
      <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: `repeating-linear-gradient(0deg,rgba(0,230,77,1) 0,rgba(0,230,77,1) 1px,transparent 0,transparent 80px),repeating-linear-gradient(90deg,rgba(0,230,77,1) 0,rgba(0,230,77,1) 1px,transparent 0,transparent 80px)`, backgroundSize: "80px 80px" }} />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <Badge variant="gray" className="mb-4">Community</Badge>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-4" style={{ fontFamily: "'Syne',sans-serif", letterSpacing: "-.02em" }}>
            Built <span style={{ color: G }}>with you.</span>
          </h2>
          <p className="max-w-xl mx-auto text-lg" style={{ color: "#555" }}>
            FC 26 is the first installment where community feedback is directly embedded in the development pipeline. Your voice. Your game.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {pillars.map(p => (
            <Card key={p.title} className="text-center hover:border-green-900 transition-all duration-300 cursor-pointer group">
              <div className="text-4xl mb-4">{p.icon}</div>
              <h3 className="font-bold text-white mb-2 group-hover:text-green-400 transition-colors" style={{ fontFamily: "'Syne',sans-serif" }}>{p.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "#555" }}>{p.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   PLAYER STATS SECTION
══════════════════════════════════════════ */

const SAMPLE_PLAYERS = [
  { name: "Ibrahimović", pos: "ST", overall: 95, pace: 78, shooting: 97, passing: 82, dribbling: 88, defending: 40, physical: 93 },
  { name: "Zidane", pos: "CM", overall: 96, pace: 75, shooting: 88, passing: 97, dribbling: 95, defending: 72, physical: 78 },
  { name: "Alex Morgan", pos: "ST", overall: 91, pace: 90, shooting: 89, passing: 83, dribbling: 87, defending: 50, physical: 72 },
];

function StatBar({ label, val }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-mono w-4" style={{ color: "#555" }}>{label}</span>
      <div className="flex-1 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${val}%`, background: val >= 90 ? G : val >= 75 ? "#fbbf24" : "#888" }} />
      </div>
      <span className="text-xs font-mono w-5" style={{ color: val >= 90 ? G : "#666" }}>{val}</span>
    </div>
  );
}

function PlayerStats() {
  const [selected, setSelected] = useState(0);
  const p = SAMPLE_PLAYERS[selected];
  return (
    <section id="player-stats" className="py-28" style={{ background: "#080808" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <Badge variant="gray" className="mb-4">Player Stats</Badge>
            <h2 className="text-4xl md:text-5xl font-black text-white" style={{ fontFamily: "'Syne',sans-serif", letterSpacing: "-.02em" }}>
              Icons <span style={{ color: G }}>revealed.</span>
            </h2>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 mb-8">
          {SAMPLE_PLAYERS.map((pl, i) => (
            <div
              key={pl.name}
              onClick={() => setSelected(i)}
              className="rounded-2xl p-5 cursor-pointer transition-all duration-300"
              style={{
                background: i === selected ? `rgba(0,230,77,0.06)` : "rgba(255,255,255,0.02)",
                border: `1px solid ${i === selected ? `rgba(0,230,77,0.3)` : "rgba(255,255,255,0.07)"}`,
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-bold text-white" style={{ fontFamily: "'Syne',sans-serif" }}>{pl.name}</div>
                  <div className="text-xs font-mono" style={{ color: "#555" }}>{pl.pos} · Icons Edition</div>
                </div>
                <div className="text-3xl font-black" style={{ fontFamily: "'Syne',sans-serif", color: i === selected ? G : "#444" }}>{pl.overall}</div>
              </div>
              {i === selected && (
                <div className="space-y-2 pt-3 border-t" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                  <StatBar label="PAC" val={pl.pace} />
                  <StatBar label="SHO" val={pl.shooting} />
                  <StatBar label="PAS" val={pl.passing} />
                  <StatBar label="DRI" val={pl.dribbling} />
                  <StatBar label="DEF" val={pl.defending} />
                  <StatBar label="PHY" val={pl.physical} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   LEGAL / COMPLIANCE
══════════════════════════════════════════ */

function Legal() {
  return (
    <section className="py-16" style={{ background: "#030303", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-wrap gap-3 mb-8">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center font-black text-sm" style={{ background: "rgba(255,255,255,0.06)", color: "#888" }}>E</div>
            <div>
              <div className="text-xs font-bold text-white">ESRB · Everyone</div>
              <div className="text-[10px] font-mono" style={{ color: "#444" }}>Users Interact · In-Game Purchases (Includes Random Items)</div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.1)" }}>
            <span className="text-amber-400 font-mono text-xs font-bold">FC POINTS</span>
            <div>
              <div className="text-xs font-bold text-white">Deadline: June 15, 2026</div>
              <div className="text-[10px] font-mono" style={{ color: "#555" }}>Full 6,000 FC Points distribution</div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.1)" }}>
            <span className="text-red-400 font-mono text-xs font-bold">CUTOFF</span>
            <div>
              <div className="text-xs font-bold text-white">Sept 15, 2026</div>
              <div className="text-[10px] font-mono" style={{ color: "#555" }}>After this date: 0 FC Points</div>
            </div>
          </div>
        </div>
        <div className="space-y-3 text-[11px] leading-relaxed font-mono" style={{ color: "#333" }}>
          <p>* Other conditions & restrictions apply. See ea.com/games/ea-sports-fc/fc-26/game-disclaimers for details.</p>
          <p>** The EA SPORTS FC 26 Football Ultimate Team World Tour Season Stats are based on gameplay in the following modes only: Squad Battles, Rivals, Champions, and Draft.</p>
          <p>†† You must complete the steps to obtain the initial FC Points distribution by June 15, 2026 to receive all 6,000 FC Points. If you redeem after September 15, 2026, you will not receive any FC Points.</p>
          <p>§ Excludes TOTY, Debut & Champion ICONS; TOTY Honourable Mention & Classic XI Heroes; all SBC, Objectives, Season & Premium Pass & ICON Swaps Player Content.</p>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   FOOTER
══════════════════════════════════════════ */

const SOCIALS = [
  { label: "IG", name: "Instagram" },
  { label: "X", name: "X / Twitter" },
  { label: "FB", name: "Facebook" },
  { label: "YT", name: "YouTube" },
  { label: "TT", name: "TikTok" },
];

function Footer() {
  return (
    <footer style={{ background: "#030303", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-10">
          {/* Logo */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-black text-xs" style={{ background: G }}>FC</div>
              <span className="font-black text-white" style={{ fontFamily: "'Syne',sans-serif" }}>EA SPORTS FC 26</span>
            </div>
            <div className="text-xs font-mono" style={{ color: "#444" }}>ea.com/games/ea-sports-fc/fc-26</div>
          </div>

          {/* Socials */}
          <div className="flex gap-2">
            {SOCIALS.map(s => (
              <button key={s.name} title={s.name} className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-mono transition-all duration-200 hover:border-green-700" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#666" }}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Footer links */}
        <div className="flex flex-wrap gap-6 mb-10">
          {["Home", "Buy", "News", "EA App (Windows)", "EA App (Mac)", "Sports Games"].map(l => (
            <a key={l} href="#" className="text-xs font-mono transition-colors hover:text-green-400" style={{ color: "#444" }}>{l}</a>
          ))}
        </div>

        <div className="pt-6 border-t flex flex-col md:flex-row items-start md:items-center justify-between gap-4" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
          <div className="text-[10px] font-mono" style={{ color: "#333" }}>
            © 2026 Electronic Arts Inc. EA, EA SPORTS, EA SPORTS FC, FC 26 and their respective logos are trademarks of Electronic Arts Inc.
          </div>
          <div className="flex gap-1">
            <button className="px-3 py-1.5 text-xs font-mono rounded-lg" style={{ background: "rgba(255,255,255,0.04)", color: "#444", border: "1px solid rgba(255,255,255,0.07)" }}>EN ▾</button>
            <button className="px-3 py-1.5 text-xs font-mono rounded-lg" style={{ background: "rgba(255,255,255,0.04)", color: "#444", border: "1px solid rgba(255,255,255,0.07)" }}>↑ Top</button>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ══════════════════════════════════════════
   CHECKOUT DATA & MODAL
══════════════════════════════════════════ */

const EDITIONS_DATA = {
  standard: {
    name: "FC 26 Standard Edition",
    badge: "STANDARD EDITION",
    price: 59.99,
    features: ["Full base game access", "Online multiplayer", "FUT access", "Clubs & Career modes"],
  },
  icons: {
    name: "FC 26 Icons Edition",
    badge: "ICONS EDITION",
    price: 79.99,
    features: ["Everything in Standard", "3 Icon Loan Players", "ICONS Edition FUT items", "Early Access (3 days)", "Exclusive kit & badge"],
  },
};

const CHECKOUT_PLATFORMS = ["EA App", "PS5", "PS4", "Xbox Series X|S", "Nintendo Switch", "Steam", "Epic Games"];

function CheckoutModal({ open, edition, onClose, onSelectEdition }) {
  const [step, setStep] = useState(0);
  const [platform, setPlatform] = useState("EA App");
  const [form, setForm] = useState({ name: "", card: "", expiry: "", cvv: "" });
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  useEffect(() => {
    if (open) {
      setStep(0);
      setForm({ name: "", card: "", expiry: "", cvv: "" });
      setErrors({});
      setProcessing(false);
      setOrderNumber("");
    }
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  const ed = EDITIONS_DATA[edition] || EDITIONS_DATA.standard;

  function fmtCard(v) {
    return v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  }
  function fmtExpiry(v) {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? d.slice(0, 2) + "/" + d.slice(2) : d;
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (form.card.replace(/\s/g, "").length !== 16) e.card = "Enter a valid 16-digit card number";
    if (!/^\d{2}\/\d{2}$/.test(form.expiry)) e.expiry = "Enter MM/YY format";
    if (!/^\d{3,4}$/.test(form.cvv)) e.cvv = "Enter 3 or 4 digit CVV";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handlePay() {
    if (!validate()) return;
    setProcessing(true);
    await new Promise(r => setTimeout(r, 1800));
    setOrderNumber(`FC26-${Date.now().toString(36).toUpperCase()}`);
    setProcessing(false);
    setStep(2);
  }

  function inputStyle(field) {
    return {
      background: "rgba(255,255,255,0.04)",
      border: `1px solid ${errors[field] ? "#ef4444" : "rgba(255,255,255,0.1)"}`,
      color: "#fff",
      outline: "none",
      width: "100%",
      padding: "12px 16px",
      borderRadius: "12px",
      fontSize: "14px",
      transition: "border-color 0.2s",
    };
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl overflow-hidden"
        style={{
          background: "#0a0a0a",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 0 100px rgba(0,230,77,0.08), 0 40px 80px rgba(0,0,0,0.8)",
          maxHeight: "90vh",
          overflowY: "auto",
          animation: "fadeUp 0.3s ease",
        }}
      >
        <BorderBeam />

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-black text-xs" style={{ background: G }}>FC</div>
            <span className="font-bold text-white text-sm">EA SPORTS FC 26</span>
          </div>
          {step < 2 && (
            <div className="flex items-center gap-2">
              {["Order Review", "Payment"].map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all"
                      style={{ background: i <= step ? G : "rgba(255,255,255,0.08)", color: i <= step ? "#000" : "#444" }}
                    >
                      {i + 1}
                    </div>
                    <span className="text-[11px] font-mono hidden sm:block" style={{ color: i === step ? "#ccc" : "#444" }}>{s}</span>
                  </div>
                  {i === 0 && <div className="w-6 h-px" style={{ background: "rgba(255,255,255,0.1)" }} />}
                </div>
              ))}
            </div>
          )}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all"
            style={{ background: "rgba(255,255,255,0.05)", color: "#555" }}
          >
            ✕
          </button>
        </div>

        <div className="p-6">

          {/* ── STEP 0: Order Review ── */}
          {step === 0 && (
            <div style={{ animation: "fadeUp .25s ease" }}>
              <h3 className="text-xl font-black text-white mb-5" style={{ fontFamily: "'Syne',sans-serif" }}>Order Review</h3>

              {/* Edition picker */}
              <div className="mb-5">
                <div className="text-[11px] font-mono mb-2.5 tracking-widest" style={{ color: "#444" }}>SELECT EDITION</div>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(EDITIONS_DATA).map(([key, data]) => (
                    <div
                      key={key}
                      onClick={() => onSelectEdition(key)}
                      className="p-4 rounded-xl cursor-pointer transition-all duration-200"
                      style={{
                        background: key === edition ? "rgba(0,230,77,0.05)" : "rgba(255,255,255,0.02)",
                        border: `1.5px solid ${key === edition ? "rgba(0,230,77,0.35)" : "rgba(255,255,255,0.07)"}`,
                      }}
                    >
                      <div className="text-[10px] font-mono mb-1 tracking-widest" style={{ color: key === edition ? G : "#333" }}>{data.badge}</div>
                      <div className="text-sm font-bold text-white mb-1.5" style={{ fontFamily: "'Syne',sans-serif" }}>
                        {key === "standard" ? "Standard" : "Icons"}
                      </div>
                      <div className="text-xl font-black" style={{ color: G, fontFamily: "'Syne',sans-serif" }}>${data.price.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Platform picker */}
              <div className="mb-5">
                <div className="text-[11px] font-mono mb-2.5 tracking-widest" style={{ color: "#444" }}>SELECT PLATFORM</div>
                <div className="flex flex-wrap gap-2">
                  {CHECKOUT_PLATFORMS.map(p => (
                    <button
                      key={p}
                      onClick={() => setPlatform(p)}
                      className="px-3 py-1.5 rounded-lg text-[11px] font-mono transition-all duration-200"
                      style={{
                        background: platform === p ? "rgba(0,230,77,0.08)" : "rgba(255,255,255,0.03)",
                        border: `1px solid ${platform === p ? "rgba(0,230,77,0.35)" : "rgba(255,255,255,0.07)"}`,
                        color: platform === p ? G : "#555",
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Order summary */}
              <div className="rounded-xl p-4 mb-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="text-sm font-bold text-white">{ed.name}</div>
                    <div className="text-[11px] font-mono mt-0.5" style={{ color: "#444" }}>{platform}</div>
                  </div>
                  <div className="text-sm font-bold text-white">${ed.price.toFixed(2)}</div>
                </div>
                <ul className="space-y-1 mb-3">
                  {ed.features.map(f => (
                    <li key={f} className="flex items-center gap-1.5 text-xs" style={{ color: "#555" }}>
                      <span style={{ color: G }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <div className="pt-3 border-t flex justify-between items-center" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  <span className="text-xs font-mono" style={{ color: "#444" }}>ORDER TOTAL</span>
                  <span className="text-lg font-black" style={{ color: G, fontFamily: "'Syne',sans-serif" }}>${ed.price.toFixed(2)}</span>
                </div>
              </div>

              <Button className="w-full" size="lg" onClick={() => setStep(1)}>Continue to Payment →</Button>
            </div>
          )}

          {/* ── STEP 1: Payment ── */}
          {step === 1 && (
            <div style={{ animation: "fadeUp .25s ease" }}>
              <h3 className="text-xl font-black text-white mb-5" style={{ fontFamily: "'Syne',sans-serif" }}>Payment Details</h3>

              {/* Mini order recap */}
              <div className="flex items-center justify-between mb-5 px-4 py-3 rounded-xl" style={{ background: "rgba(0,230,77,0.04)", border: "1px solid rgba(0,230,77,0.12)" }}>
                <div>
                  <div className="text-[10px] font-mono tracking-widest mb-0.5" style={{ color: G }}>{ed.badge}</div>
                  <div className="text-sm text-white">{platform}</div>
                </div>
                <div className="text-xl font-black" style={{ color: G, fontFamily: "'Syne',sans-serif" }}>${ed.price.toFixed(2)}</div>
              </div>

              <div className="space-y-4 mb-5">
                <div>
                  <label className="text-[11px] font-mono tracking-widest mb-2 block" style={{ color: "#444" }}>CARDHOLDER NAME</label>
                  <input
                    type="text"
                    placeholder="Full name on card"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    style={inputStyle("name")}
                  />
                  {errors.name && <div className="text-xs mt-1" style={{ color: "#ef4444" }}>{errors.name}</div>}
                </div>

                <div>
                  <label className="text-[11px] font-mono tracking-widest mb-2 block" style={{ color: "#444" }}>CARD NUMBER</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={form.card}
                    onChange={e => setForm(f => ({ ...f, card: fmtCard(e.target.value) }))}
                    style={{ ...inputStyle("card"), fontFamily: "'DM Mono', monospace" }}
                  />
                  {errors.card && <div className="text-xs mt-1" style={{ color: "#ef4444" }}>{errors.card}</div>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-mono tracking-widest mb-2 block" style={{ color: "#444" }}>EXPIRY</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={form.expiry}
                      onChange={e => setForm(f => ({ ...f, expiry: fmtExpiry(e.target.value) }))}
                      style={{ ...inputStyle("expiry"), fontFamily: "'DM Mono', monospace" }}
                    />
                    {errors.expiry && <div className="text-xs mt-1" style={{ color: "#ef4444" }}>{errors.expiry}</div>}
                  </div>
                  <div>
                    <label className="text-[11px] font-mono tracking-widest mb-2 block" style={{ color: "#444" }}>CVV</label>
                    <input
                      type="password"
                      placeholder="•••"
                      value={form.cvv}
                      onChange={e => setForm(f => ({ ...f, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) }))}
                      style={{ ...inputStyle("cvv"), fontFamily: "'DM Mono', monospace" }}
                    />
                    {errors.cvv && <div className="text-xs mt-1" style={{ color: "#ef4444" }}>{errors.cvv}</div>}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-5 text-[11px] font-mono" style={{ color: "#333" }}>
                <span>🔒</span>
                <span>Secured with 256-bit SSL encryption · No card data stored</span>
              </div>

              <div className="flex gap-3">
                <Button variant="ghost" size="md" onClick={() => setStep(0)} className="flex-shrink-0">← Back</Button>
                <button
                  onClick={handlePay}
                  disabled={processing}
                  className="flex-1 py-3.5 rounded-xl font-bold text-black text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: G, boxShadow: `0 0 20px rgba(0,230,77,0.25)`, opacity: processing ? 0.75 : 1 }}
                >
                  {processing ? (
                    <span className="flex items-center justify-center gap-2">
                      <span
                        className="w-4 h-4 rounded-full border-2 border-black/30 border-t-black inline-block"
                        style={{ animation: "chkSpin 0.7s linear infinite" }}
                      />
                      Processing...
                    </span>
                  ) : `Pay $${ed.price.toFixed(2)} →`}
                </button>
              </div>
              <style>{`@keyframes chkSpin{to{transform:rotate(360deg)}}`}</style>
            </div>
          )}

          {/* ── STEP 2: Confirmation ── */}
          {step === 2 && (
            <div className="text-center py-6" style={{ animation: "fadeUp .3s ease" }}>
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ background: "rgba(0,230,77,0.1)", border: `1.5px solid rgba(0,230,77,0.35)`, boxShadow: "0 0 30px rgba(0,230,77,0.1)" }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke={G} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <h3 className="text-2xl font-black text-white mb-1" style={{ fontFamily: "'Syne',sans-serif" }}>Order Confirmed!</h3>
              <p className="text-sm mb-6" style={{ color: "#555" }}>Your EA SPORTS FC 26 purchase is complete.</p>

              <div className="rounded-xl p-5 mb-5 text-left" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                {[
                  ["ORDER NUMBER", orderNumber],
                  ["EDITION", ed.badge],
                  ["PLATFORM", platform],
                  ["TOTAL PAID", `$${ed.price.toFixed(2)}`],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between items-center py-2 border-b last:border-0" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                    <span className="text-[11px] font-mono tracking-widest" style={{ color: "#444" }}>{label}</span>
                    <span className="text-xs font-mono font-bold" style={{ color: label === "TOTAL PAID" || label === "ORDER NUMBER" ? G : "#ccc" }}>{value}</span>
                  </div>
                ))}
              </div>

              <p className="text-[11px] font-mono mb-6" style={{ color: "#333" }}>
                A confirmation receipt has been sent to your email.<br />
                Access your game through the {platform} store.
              </p>

              <Button className="w-full" onClick={onClose}>Back to FC 26 →</Button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   ROOT APP
══════════════════════════════════════════ */

export default function App() {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedEdition, setSelectedEdition] = useState("standard");

  function openCheckout(edition = "standard") {
    setSelectedEdition(edition || "standard");
    setCheckoutOpen(true);
  }

  return (
    <div style={{ background: "#050505", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');
  
        html{scroll-behavior:smooth}
        ::-webkit-scrollbar{width:4px;background:#050505}
        ::-webkit-scrollbar-thumb{background:#1a1a1a;border-radius:99px}
      `}</style>

      <CheckoutModal
        open={checkoutOpen}
        edition={selectedEdition}
        onClose={() => setCheckoutOpen(false)}
        onSelectEdition={setSelectedEdition}
      />
      <Navbar activeSection="" onBuy={() => openCheckout()} />
      <Hero onBuy={() => openCheckout()} />
      <StatsBar />
      <GameModes />
      <FeaturesCarousel />
      <Editions onBuy={openCheckout} />
      <News />
      <Community />
      <PlayerStats />
      <Legal />
      <Footer />
    </div>
  );
}
