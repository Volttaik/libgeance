"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface Props {
  size?: number;
  speed?: number;
  spinning?: boolean;
}

export default function DiamondSpinner({ size = 120, speed = 0.02, spinning = true }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = false;
    mount.appendChild(renderer.domElement);

    /* ── Scene / Camera ── */
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0.1, 5.5);
    camera.lookAt(0, -0.1, 0);

    /* ── Materials ── */
    // Dark charcoal base so unlit faces are deep black/dark
    // flatShading means each triangular face gets one solid colour —
    // faces angled toward a bright light go near-white (specular),
    // away from lights stay charcoal/black, giving strong contrast.
    const crownMat = new THREE.MeshPhongMaterial({
      color: new THREE.Color(0x1c1c1c),
      specular: new THREE.Color(0xffffff),
      shininess: 600,
      flatShading: true,
    });

    const pavilionMat = new THREE.MeshPhongMaterial({
      color: new THREE.Color(0x141414),
      specular: new THREE.Color(0xffffff),
      shininess: 500,
      flatShading: true,
    });

    /* ── Geometry: brilliant-cut diamond with pointed top ── */
    const diamond = new THREE.Group();

    // Crown — 8-sided cone tapering to a sharp point at the top
    // radiusTop=0 → sharp point; radiusBottom=0.56 → meets girdle
    const crownGeo = new THREE.CylinderGeometry(0.0, 0.56, 0.72, 8, 1, false);
    const crownMesh = new THREE.Mesh(crownGeo, crownMat);
    // center at y=0.36 → tip at y=0.72, base at y=0
    crownMesh.position.y = 0.36;
    diamond.add(crownMesh);

    // Girdle — thin flat band at max width
    const girdleGeo = new THREE.CylinderGeometry(0.57, 0.57, 0.045, 8, 1, false);
    const girdleMesh = new THREE.Mesh(girdleGeo, crownMat);
    girdleMesh.position.y = 0.0;
    diamond.add(girdleMesh);

    // Pavilion — 8-sided cone tapering to culet (pointed bottom)
    const pavilionGeo = new THREE.CylinderGeometry(0.56, 0.0, 1.15, 8, 1, false);
    const pavilionMesh = new THREE.Mesh(pavilionGeo, pavilionMat);
    pavilionMesh.position.y = -0.575;
    diamond.add(pavilionMesh);

    // Slight tilt so you see the pointed crown and pavilion tip at once
    diamond.rotation.x = 0.12;
    scene.add(diamond);

    /* ── Lighting ── */
    // Ambient keeps everything faintly visible
    scene.add(new THREE.AmbientLight(0xffffff, 0.35));

    const lightDefs: [[number, number, number], number, number][] = [
      // position              color       intensity
      [[3.0,  5.0,  3.5],  0xffffff,  4.5],  // top-right-front  → blazing white on crown tip
      [[-3.5, 3.0,  2.5],  0xffffff,  2.8],  // top-left-front   → other crown facets
      [[0.5, -3.5,  3.0],  0xffffff,  2.2],  // bottom-front     → pavilion sparkle
      [[0.0,  5.5, -1.5],  0xeeeeff,  2.0],  // top-back         → back crown tip
      [[-1.5, -2.0, -3.0], 0xffffff,  1.6],  // bottom-back      → more pavilion contrast
      [[4.0,  0.5, -1.0],  0xffffff,  1.8],  // right-mid        → side facets
      [[-4.0,  0.5,  0.0], 0xffffff,  1.2],  // left-mid         → balance
    ];

    for (const [pos, color, intensity] of lightDefs) {
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(...pos);
      scene.add(light);
    }

    /* ── Animation ── */
    let id: number;
    const tick = () => {
      id = requestAnimationFrame(tick);
      if (spinning) diamond.rotation.y += speed;
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(id);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [size, speed, spinning]);

  return <div ref={mountRef} style={{ width: size, height: size, display: "inline-block", lineHeight: 0 }} />;
}
