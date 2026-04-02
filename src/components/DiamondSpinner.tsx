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
    camera.position.set(0, 0.3, 5.5);
    camera.lookAt(0, 0, 0);

    /* ── Material ── */
    // flatShading means every triangular face gets one solid colour
    // so faces angled toward a bright light go near-white, away go dark
    const mat = new THREE.MeshPhongMaterial({
      color: new THREE.Color(0x1c1c1c),
      specular: new THREE.Color(0xffffff),
      shininess: 500,
      flatShading: true,
    });

    /* ── Geometry: brilliant-cut diamond ── */
    const diamond = new THREE.Group();

    // Table face — flat octagonal top
    const tableGeo = new THREE.CylinderGeometry(0.30, 0.30, 0.03, 8, 1, false);
    diamond.add(new THREE.Mesh(tableGeo, mat));
    diamond.children[diamond.children.length - 1].position.y = 0.58;

    // Crown — truncated 8-sided cone (table edge → girdle)
    const crownGeo = new THREE.CylinderGeometry(0.30, 0.56, 0.52, 8, 1, false);
    const crownMesh = new THREE.Mesh(crownGeo, mat);
    crownMesh.position.y = 0.29;
    diamond.add(crownMesh);

    // Girdle — thin flat band at max width
    const girdleGeo = new THREE.CylinderGeometry(0.57, 0.57, 0.055, 8, 1, false);
    const girdleMesh = new THREE.Mesh(girdleGeo, mat);
    girdleMesh.position.y = 0.0;
    diamond.add(girdleMesh);

    // Pavilion — 8-sided cone tapering to culet
    const pavilionGeo = new THREE.CylinderGeometry(0.56, 0.0, 1.15, 8, 1, false);
    const pavilionMesh = new THREE.Mesh(pavilionGeo, mat);
    pavilionMesh.position.y = -0.60;
    diamond.add(pavilionMesh);

    // Slight tilt so you see both crown top and pavilion tip at the same time
    diamond.rotation.x = 0.15;
    scene.add(diamond);

    /* ── Lighting ── 
       Multiple directional lights from very different angles ensure
       at least 2–3 faces are always close to white (specular highlight)
       while opposite faces stay dark charcoal. ── */

    // Soft ambient so nothing is pitch black
    scene.add(new THREE.AmbientLight(0xffffff, 0.22));

    const lightDefs = [
      // position,                 color,     intensity
      [[3.0,  4.5,  3.0], 0xffffff, 3.8],   // top-right-front  → bright white on crown
      [[-3.5, 2.5,  2.5], 0xffffff, 2.2],   // top-left-front   → hits other crown facets
      [[0.5, -3.5,  3.0], 0xffffff, 2.5],   // bottom-front     → illuminates pavilion
      [[0.0,  5.0, -1.5], 0xeeeeff, 1.8],   // top-back         → back crown facets
      [[-1.5, -2.0, -3.0], 0xffffff, 1.4],  // bottom-back      → more pavilion sparkle
      [[4.0,  0.5, -1.0], 0xffffff, 1.6],   // right-mid        → side facets
    ] as [[number, number, number], number, number][];

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
