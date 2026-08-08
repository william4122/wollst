import React, { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import * as THREE from "three";
import { gsap } from "gsap";
import "./style.css";
const capabilities = [
  {
    number: "01",
    title: "THINK",
    text: "Strategy, architecture and product direction that connect technology to real business outcomes."
  },
  {
    number: "02",
    title: "BUILD",
    text: "Systems, automation and technology designed to solve the problem rather than simply add another tool."
  },
  {
    number: "03",
    title: "IMPROVE",
    text: "Optimization, security and scale that keep the system useful long after launch."
  }
];
const projects = [
  {
    number: "01",
    title: "Intelligent Security Platform",
    text: "A modern security experience designed around visibility, automation and rapid response."
  },
  {
    number: "02",
    title: "Operational Intelligence",
    text: "Turning fragmented technical data into decisions people can actually act on."
  },
  {
    number: "03",
    title: "Automation Engine",
    text: "Removing repetitive work so teams can spend more time solving meaningful problems."
  }
];
function Scene() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = 7;
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    // --------------------------------------------------
    // PARTICLES
    // --------------------------------------------------
    const particleCount = window.innerWidth < 700 ? 900 : 1800;
    const positions = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const radius = 2.4 + Math.random() * 2.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;
      originalPositions[i3] = x;
      originalPositions[i3 + 1] = y;
      originalPositions[i3 + 2] = z;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    const material = new THREE.PointsMaterial({
      size: window.innerWidth < 700 ? 0.025 : 0.035,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    // --------------------------------------------------
    // CORE
    // --------------------------------------------------
    const coreGeometry = new THREE.IcosahedronGeometry(1.35, 2);
    const coreMaterial = new THREE.MeshBasicMaterial({
      wireframe: true,
      transparent: true,
      opacity: 0.18
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(core);
    // --------------------------------------------------
    // RINGS
    // --------------------------------------------------
    const rings = [];
    for (let i = 0; i < 3; i++) {
      const ringGeometry = new THREE.TorusGeometry(
        2.0 + i * 0.45,
        0.008,
        8,
        160
      );
      const ringMaterial = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0.15
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.random() * Math.PI;
      ring.rotation.y = Math.random() * Math.PI;
      scene.add(ring);
      rings.push(ring);
    }
    // --------------------------------------------------
    // SCROLL STATE
    // --------------------------------------------------
    let targetScroll = 0;
    let currentScroll = 0;
    const updateScroll = () => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      targetScroll =
        maxScroll > 0 ? window.scrollY / maxScroll : 0;
    };
    window.addEventListener("scroll", updateScroll, {
      passive: true
    });
    // --------------------------------------------------
    // ANIMATION
    // --------------------------------------------------
    let animationFrame;
    const animate = () => {
      animationFrame = requestAnimationFrame(animate);
      currentScroll +=
        (targetScroll - currentScroll) * 0.055;
      const time = performance.now() * 0.0003;
      particles.rotation.y += 0.0007;
      particles.rotation.x =
        Math.sin(time * 0.5) * 0.08;
      core.rotation.x += 0.0015;
      core.rotation.y += 0.002;
      rings.forEach((ring, index) => {
        ring.rotation.x += 0.0005 * (index + 1);
        ring.rotation.y += 0.0008 * (index + 1);
      });
      // Scroll drives the camera.
      camera.position.z =
        7 - currentScroll * 4.2;
      camera.position.x =
        Math.sin(currentScroll * Math.PI * 2) *
        0.7;
      camera.position.y =
        Math.cos(currentScroll * Math.PI * 1.5) *
        0.45;
      camera.rotation.z =
        currentScroll * Math.PI * 0.12;
      // The environment expands as we travel through it.
      const environmentScale =
        1 + currentScroll * 1.8;
      particles.scale.setScalar(environmentScale);
      core.scale.setScalar(
        1 + currentScroll * 0.5
      );
      renderer.render(scene, camera);
    };
    animate();
    // --------------------------------------------------
    // RESIZE
    // --------------------------------------------------
    const resize = () => {
      camera.aspect =
        window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        window.innerWidth,
        window.innerHeight
      );
    };
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener(
        "scroll",
        updateScroll
      );
      window.removeEventListener(
        "resize",
        resize
      );
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      coreGeometry.dispose();
      coreMaterial.dispose();
      rings.forEach((ring) => {
        ring.geometry.dispose();
        ring.material.dispose();
      });
    };
  }, []);
  return <canvas ref={canvasRef} className="scene" />;
}
function SectionReveal({ children, className = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    const element = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          gsap.to(element, {
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: "power3.out"
          });
        } else {
          gsap.to(element, {
            opacity: 0,
            y: 45,
            duration: 0.6,
            ease: "power2.out"
          });
        }
      },
      {
        threshold: 0.15
      }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
    >
      {children}
    </div>
  );
}
function App() {
  return (
    <>
      <Scene />
      <div className="noise" />
      <header className="nav">
        <div className="nav-logo">
          WR<span>.</span>
        </div>
        <a href="#contact" className="nav-link">
          CONTACT
        </a>
      </header>
      <main>
        {/* HERO */}
        <section className="hero section">
          <div className="hero-content">
            <div className="eyebrow">
              WILL RODRIGUEZ
            </div>
            <h1>
              I turn complex
              <br />
              technology into
              <br />
              <span>business advantage.</span>
            </h1>
            <p className="hero-description">
              Product thinking, technical execution and
              systems designed around outcomes.
            </p>
            <a href="#contact" className="primary-button">
              START A CONVERSATION
              <span>↗</span>
            </a>
          </div>
          <div className="scroll-indicator">
            <span>SCROLL TO EXPLORE</span>
            <div />
          </div>
        </section>
        {/* PROBLEM */}
        <section className="section problem">
          <SectionReveal>
            <div className="eyebrow">
              THE PROBLEM
            </div>
            <h2>
              Complexity
              <br />
              isn't the problem.
            </h2>
            <div className="statement">
              <span>01</span>
              <p>
                Unmanaged complexity is.
              </p>
            </div>
            <p className="body-copy">
              Great technology should make a business
              clearer, faster and more capable — not create
              another layer of problems to manage.
            </p>
          </SectionReveal>
        </section>
        {/* APPROACH */}
        <section className="section approach">
          <SectionReveal>
            <div className="eyebrow">
              THE APPROACH
            </div>
            <h2>
              Think.
              <br />
              Build.
              <br />
              Improve.
            </h2>
            <div className="capabilities">
              {capabilities.map((item) => (
                <article
                  className="capability"
                  key={item.number}
                >
                  <div className="capability-number">
                    {item.number}
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </SectionReveal>
        </section>
        {/* STATEMENT */}
        <section className="section statement-section">
          <SectionReveal>
            <div className="giant-statement">
              <span>WHAT IF</span>
              <strong>
                YOUR SYSTEM
                <br />
                COULD DO MORE?
              </strong>
            </div>
          </SectionReveal>
        </section>
        {/* PROOF */}
        <section className="section proof">
          <SectionReveal>
            <div className="eyebrow">
              EXECUTION
            </div>
            <h2>
              Ideas are cheap.
              <br />
              <span>Execution isn't.</span>
            </h2>
            <div className="metrics">
              <div>
                <strong>10K+</strong>
                <span>ENDPOINTS</span>
              </div>
              <div>
                <strong>99.9%</strong>
                <span>UPTIME</span>
              </div>
              <div>
                <strong>40+</strong>
                <span>SYSTEMS</span>
              </div>
              <div>
                <strong>12</strong>
                <span>PROJECTS</span>
              </div>
            </div>
            <div className="projects">
              {projects.map((project) => (
                <article
                  className="project"
                  key={project.number}
                >
                  <span>{project.number}</span>
                  <div>
                    <h3>{project.title}</h3>
                    <p>{project.text}</p>
                  </div>
                  <span className="project-arrow">
                    ↗
                  </span>
                </article>
              ))}
            </div>
          </SectionReveal>
        </section>
        {/* CONTACT */}
        <section
          id="contact"
          className="section contact"
        >
          <SectionReveal>
            <div className="contact-content">
              <div className="eyebrow">
                WHAT'S NEXT?
              </div>
              <h2>
                Let's build
                <br />
                <span>something useful.</span>
              </h2>
              <p>
                Have a problem worth solving?
              </p>
              <a
                href="mailto:hello@example.com"
                className="primary-button large"
              >
                START A CONVERSATION
                <span>↗</span>
              </a>
            </div>
          </SectionReveal>
        </section>
      </main>
      <footer>
        <span>© 2026 WILL RODRIGUEZ</span>
        <span>BUILT WITH INTENT.</span>
      </footer>
    </>
  );
}
createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);