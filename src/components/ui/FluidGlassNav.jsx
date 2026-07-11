/* eslint-disable react/no-unknown-property */
import * as THREE from 'three';
import { useRef, useState, useEffect, memo } from 'react';
import { Canvas, createPortal, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, MeshTransmissionMaterial, Environment } from '@react-three/drei';
import { easing } from 'maath';

// Pre-load the bar GLB
useGLTF.preload('/assets/3d/bar.glb');

const GlassBarMesh = memo(function GlassBarMesh() {
  const meshRef = useRef();
  const { nodes } = useGLTF('/assets/3d/bar.glb');
  const { viewport } = useThree();

  useFrame((state, delta) => {
    // Keep the bar locked at center but add a highly fluid liquid floating effect
    if (meshRef.current) {
      // Bob up and down very slightly
      const yOffset = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      // Gentle rocking rotation
      const rotX = Math.PI / 2 + Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
      const rotY = Math.cos(state.clock.elapsedTime * 1.2) * 0.05;
      const rotZ = Math.sin(state.clock.elapsedTime * 1.8) * 0.02;

      easing.damp3(meshRef.current.position, [0, yOffset, 15], 0.25, delta);
      easing.dampE(meshRef.current.rotation, [rotX, rotY, rotZ], 0.25, delta);
    }
  });

  // Auto-scale: fill the viewport width using geometry bounding box
  const geo = nodes['Cube']?.geometry;
  let scaleX = 1;
  let scaleY = 1;
  let scaleZ = 1;
  
  if (geo) {
    geo.computeBoundingBox();
    const geoW = (geo.boundingBox?.max?.x ?? 1) - (geo.boundingBox?.min?.x ?? 0) || 1;
    // Stretch it horizontally to fill the nav width (with a bit of bleed)
    scaleX = (viewport.width * 1.1) / geoW;
    // Scale vertically to fill the nav height, keeping it looking like a pill
    scaleY = viewport.height * 0.8; 
    scaleZ = 1.5; // Thicker so refraction works better
  }

  return (
    <>
      {/* Studio environment provides a bright, clean white/grey reflection, perfect for light mode */}
      <Environment preset="studio" />
      <ambientLight intensity={3} />
      <directionalLight position={[10, 10, 10]} intensity={4} color="#ffffff" />
      
      <mesh
        ref={meshRef}
        scale={[scaleX, scaleY, scaleZ]}
        rotation-x={Math.PI / 2}
        geometry={nodes['Cube']?.geometry}
        position={[0, 0, 15]}
      >
        <MeshTransmissionMaterial
          transmission={1}
          roughness={0.05}
          thickness={15}
          ior={1.25}
          chromaticAberration={0.15}
          anisotropy={0.3}
          distortion={0.5}
          distortionScale={0.5}
          temporalDistortion={0.2}
          color="#ffffff"
          attenuationColor="#ffffff"
          attenuationDistance={1}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
    </>
  );
});

export default function FluidGlassNav({
  navItems,
  activeTab,
  theme,
  scrollToSection,
  toggleTheme,
  showThemeHint,
  navIndicatorRef,
  handleNavHover,
  handleNavLeave,
  setView,
  children,
}) {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 56 });

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(() => {
      const { width } = containerRef.current.getBoundingClientRect();
      setDimensions({ width, height: 56 });
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <nav
      ref={containerRef}
      className={`nav-pill nav-fluid-glass ${activeTab === 'about' ? 'about-active' : ''} ${theme === 'light' ? 'light-mode' : ''}`}
      style={{ overflow: 'hidden', padding: 0 }}
    >
      {/* Three.js fluid glass canvas — renders the glass bar mesh as background */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        {dimensions.width > 0 && (
          <Canvas
            camera={{ position: [0, 0, 20], fov: 20 }}
            gl={{ alpha: true, antialias: true }}
            style={{ width: '100%', height: '100%', display: 'block' }}
          >
            <GlassBarMesh />
          </Canvas>
        )}
      </div>

      {/* Actual nav content overlaid on top of the glass effect */}
      <div className="nav-inner-content" style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '5px 10px' }}>
        {/* Left Brand */}
        <div className="nav-brand" onClick={() => scrollToSection('home')} style={{ cursor: 'pointer' }}>
          <span>loop</span>
          <span className="nav-brand-dot">.</span>
        </div>

        {/* Center Links */}
        <div className="nav-links" onMouseLeave={handleNavLeave}>
          <div ref={navIndicatorRef} className="nav-indicator" />
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item}`}
              data-tab={item}
              className={`nav-item ${activeTab === item ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(item);
              }}
              onMouseEnter={handleNavHover}
            >
              {activeTab === item ? `[ ${item} ]` : item}
            </a>
          ))}
        </div>

        {/* Right: theme toggle + hint + CTA */}
        <div className="nav-right-group">
          {showThemeHint && (
            <span className="nav-theme-hint">press [t] to switch theme</span>
          )}
          <button
            className="nav-theme-btn"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? '☀' : '☾'}
          </button>
          <a href="#auth" className="nav-cta" onClick={(e) => { e.preventDefault(); setView('auth'); }}>
            get started ↗
          </a>
        </div>
      </div>
    </nav>
  );
}
