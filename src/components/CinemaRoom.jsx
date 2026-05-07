import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function CinemaRoom({ scrollProgressRef }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let W = window.innerWidth, H = window.innerHeight;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.8;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x030303, 10, 22);
    scene.background = new THREE.Color(0x050404);

    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 50);
    camera.position.set(0, 1.2, 6);
    camera.lookAt(0, 1.8, -4);

    // ── MATERIALS ──
    const wallMat    = new THREE.MeshStandardMaterial({ color: 0x0d0a0a, roughness: 1.0 });
    const floorMat   = new THREE.MeshStandardMaterial({ color: 0x0a0808, roughness: 1.0 });
    const seatFabric = new THREE.MeshStandardMaterial({ color: 0x8B1A1A, roughness: 0.85 });
    const seatMetal  = new THREE.MeshStandardMaterial({ color: 0x282828, roughness: 0.7, metalness: 0.4 });
    const screenMat  = new THREE.MeshStandardMaterial({
      color: 0x000000,
      emissive: new THREE.Color(0xf8f4e8),
      emissiveIntensity: 0.55,
    });

    // ── ROOM SHELL ──
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(16, 22), floorMat);
    floor.rotation.x = -Math.PI / 2; floor.position.set(0, -1.0, -2); scene.add(floor);

    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(16, 10), wallMat);
    backWall.position.set(0, 3, -10); scene.add(backWall);

    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(22, 10), wallMat);
    leftWall.rotation.y = Math.PI / 2; leftWall.position.set(-7.0, 3, -2); scene.add(leftWall);

    const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(22, 10), wallMat);
    rightWall.rotation.y = -Math.PI / 2; rightWall.position.set(7.0, 3, -2); scene.add(rightWall);

    const ceil = new THREE.Mesh(new THREE.PlaneGeometry(16, 22), wallMat);
    ceil.rotation.x = Math.PI / 2; ceil.position.set(0, 5.5, -2); scene.add(ceil);

    // ── CINEMA SCREEN ──
    const surroundMat = new THREE.MeshStandardMaterial({ color: 0x020202, roughness: 1.0 });
    const surround = new THREE.Mesh(new THREE.PlaneGeometry(16.0, 10.0), surroundMat);
    surround.position.set(0, 3.2, -9.02); scene.add(surround);

    const screen = new THREE.Mesh(new THREE.PlaneGeometry(14.8, 8.3), screenMat);
    screen.position.set(0, 3.2, -9.0); scene.add(screen);

    const trimMat = new THREE.MeshStandardMaterial({
      color: 0xE8D5A3, emissive: new THREE.Color(0xE8D5A3), emissiveIntensity: 1.4,
    });
    [[14.9, 0.05, 0, 3.2 + 4.2, -8.98],[14.9, 0.05, 0, 3.2 - 4.2, -8.98],
     [0.05, 8.5, -7.5, 3.2, -8.98],[0.05, 8.5, 7.5, 3.2, -8.98],
    ].forEach(([w, h, tx, ty, tz]) => {
      const t = new THREE.Mesh(new THREE.PlaneGeometry(w, h), trimMat);
      t.position.set(tx, ty, tz); scene.add(t);
    });

    // ── SEATS — rotated to face the screen ──
    function makeSeat(x, y, z) {
      const g = new THREE.Group();
      const back = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.70, 0.09), seatFabric);
      back.position.set(0, 0.35, 0); g.add(back);
      const cush = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.08, 0.44), seatFabric);
      cush.position.set(0, 0.01, 0.18); g.add(cush);
      [-0.32, 0.32].forEach(ax => {
        const arm = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, 0.40), seatMetal);
        arm.position.set(ax, 0.09, 0.14); g.add(arm);
      });
      [-0.20, 0.20].forEach(lx => {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.52, 0.05), seatMetal);
        leg.position.set(lx, -0.26, 0); g.add(leg);
      });
      // Face toward the screen (−z direction)
      g.rotation.y = Math.PI;
      g.position.set(x, y, z);
      return g;
    }

    [4.5, 3.0, 1.5, 0.0, -1.5].forEach(z => {
      for (let i = 0; i < 11; i++) scene.add(makeSeat((i - 5) * 0.80, -1.0, z));
    });

    // ── WALL SCONCES ──
    const sconceMat = new THREE.MeshStandardMaterial({
      color: 0x2a1604, emissive: new THREE.Color(0xD4882A), emissiveIntensity: 1.5,
    });
    [-6.8, 6.8].forEach(wx => {
      [3.0, 0.5, -2.0].forEach(wz => {
        const cone = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.20, 7), sconceMat);
        cone.position.set(wx, 2.6, wz); scene.add(cone);
        const sl = new THREE.PointLight(0xD4882A, 8, 6);
        sl.position.set(wx < 0 ? wx + 0.6 : wx - 0.6, 2.3, wz); scene.add(sl);
      });
    });

    // ── LIGHTING ──
    scene.add(new THREE.HemisphereLight(0x3a2a10, 0x0a0504, 1.5));
    scene.add(new THREE.AmbientLight(0x1a1008, 6));
    const seatFill = new THREE.PointLight(0xD4A060, 12, 18);
    seatFill.position.set(0, 4.0, 2.0); scene.add(seatFill);
    const frontFill = new THREE.PointLight(0xC09050, 8, 12);
    frontFill.position.set(0, 3.5, 5.0); scene.add(frontFill);
    const projLight = new THREE.SpotLight(0xF2E4B8, 30, 30, Math.PI / 10, 0.25, 1.5);
    projLight.position.set(0, 7, 8);
    projLight.target.position.set(0, 3.2, -9);
    scene.add(projLight); scene.add(projLight.target);
    const bounce = new THREE.PointLight(0xE8D5A3, 5, 18);
    bounce.position.set(0, 3.2, -7.5); scene.add(bounce);

    // ── PROJECTOR BEAM ──
    const beamGeo = new THREE.CylinderGeometry(0.04, 3.4, 19, 18, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0xF5EAB0, transparent: true, opacity: 0.028,
      side: THREE.BackSide, depthWrite: false,
    });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.set(0, 4.9, -0.5);
    beam.rotation.x = Math.atan2(-(3.2 - 7), -(-9 - 8)) - Math.PI / 2;
    scene.add(beam);

    // ── PAPER CONFETTI (replaces dust particles) ──
    const confettiColorHex = [0xF5F0E8, 0xE8D5A3, 0xD4622A, 0xFFFFFF, 0xE8C8A0];
    const PER_COLOR = 60;
    const TOTAL = confettiColorHex.length * PER_COLOR;
    const confettiGeo = new THREE.PlaneGeometry(0.06, 0.10);

    // Per-piece state
    const cx   = new Float32Array(TOTAL); // x position
    const cy   = new Float32Array(TOTAL); // y position
    const cz   = new Float32Array(TOTAL); // z position
    const crx  = new Float32Array(TOTAL); // rotation x
    const cry  = new Float32Array(TOTAL); // rotation y
    const crz  = new Float32Array(TOTAL); // rotation z
    const cvx  = new Float32Array(TOTAL); // drift x velocity
    const cvy  = new Float32Array(TOTAL); // fall speed
    const crvx = new Float32Array(TOTAL); // rot vel x
    const crvy = new Float32Array(TOTAL); // rot vel y
    const crvz = new Float32Array(TOTAL); // rot vel z

    function resetPiece(i) {
      cx[i]  = (Math.random() - 0.5) * 13;
      cy[i]  = 0.5 + Math.random() * 5.0;
      cz[i]  = 5.5 - Math.random() * 13.0;
      crx[i] = Math.random() * Math.PI * 2;
      cry[i] = Math.random() * Math.PI * 2;
      crz[i] = Math.random() * Math.PI * 2;
      cvx[i] = (Math.random() - 0.5) * 0.003;
      cvy[i] = 0.004 + Math.random() * 0.006;
      crvx[i] = (Math.random() - 0.5) * 0.04;
      crvy[i] = (Math.random() - 0.5) * 0.03;
      crvz[i] = (Math.random() - 0.5) * 0.05;
    }

    for (let i = 0; i < TOTAL; i++) resetPiece(i);

    const dummy = new THREE.Object3D();
    const confettiMeshes = confettiColorHex.map((hex, ci) => {
      const mat = new THREE.MeshBasicMaterial({ color: hex, side: THREE.DoubleSide });
      const mesh = new THREE.InstancedMesh(confettiGeo, mat, PER_COLOR);
      mesh.frustumCulled = false;
      for (let i = 0; i < PER_COLOR; i++) {
        const gi = ci * PER_COLOR + i;
        dummy.position.set(cx[gi], cy[gi], cz[gi]);
        dummy.rotation.set(crx[gi], cry[gi], crz[gi]);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
      scene.add(mesh);
      return mesh;
    });

    // ── MOUSE PARALLAX ──
    let mx = 0, my = 0;
    const onMouseMove = e => {
      mx = (e.clientX / window.innerWidth  - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove);

    // ── RENDER LOOP ──
    let t = 0, animId;
    function animate() {
      animId = requestAnimationFrame(animate);
      t += 0.007;

      // Scroll-driven camera zoom
      const p   = scrollProgressRef ? scrollProgressRef.current : 0;
      const baseZ = 6 - 8 * p, baseY = 1.2 + 1.6 * p;
      const lookY = 1.8 + 1.4 * p, lookZ = -4 - 5 * p;
      const par   = 1 - p * 0.8;

      camera.position.x += (mx * 0.3 * par - camera.position.x) * 0.03;
      camera.position.y += (baseY - my * 0.15 * par - camera.position.y) * 0.05;
      camera.position.z += (baseZ - camera.position.z) * 0.05;
      camera.lookAt(camera.position.x * 0.25 * par, lookY, lookZ);

      // Update paper confetti
      confettiMeshes.forEach((mesh, ci) => {
        for (let i = 0; i < PER_COLOR; i++) {
          const gi = ci * PER_COLOR + i;
          cx[gi]  += cvx[gi] + Math.sin(t * 0.5 + gi * 0.07) * 0.001;
          cy[gi]  -= cvy[gi];
          crx[gi] += crvx[gi];
          cry[gi] += crvy[gi];
          crz[gi] += crvz[gi];
          if (cy[gi] < 0.3) resetPiece(gi);

          dummy.position.set(cx[gi], cy[gi], cz[gi]);
          dummy.rotation.set(crx[gi], cry[gi], crz[gi]);
          dummy.scale.set(1, 1, 1);
          dummy.updateMatrix();
          mesh.setMatrixAt(i, dummy.matrix);
        }
        mesh.instanceMatrix.needsUpdate = true;
      });

      screenMat.emissiveIntensity = 0.55
        + Math.sin(t * 0.55) * 0.02
        + (Math.random() > 0.997 ? Math.random() * 0.08 : 0);
      beamMat.opacity = 0.028 + Math.sin(t * 0.38) * 0.006;
      projLight.intensity = 30 + Math.sin(t * 0.3) * 1.5;

      renderer.render(scene, camera);
    }
    animate();

    const onResize = () => {
      W = window.innerWidth; H = window.innerHeight;
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      renderer.setSize(W, H);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, [scrollProgressRef]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'block' }}
    />
  );
}
