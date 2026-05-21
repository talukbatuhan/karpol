"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  calculateCombinedBox,
  makaraBoxes,
  type BoxDimensions,
} from "@/features/tools/makara/boxes";

export type MakaraToolLabels = {
  selectTitle: string;
  dataTitle: string;
  weightLabel: string;
  netVolLabel: string;
  boxVolLabel: string;
  allDataTitle: string;
  allWeightLabel: string;
  allNetVolLabel: string;
  allBoxVolLabel: string;
  hint: string;
  options: string[];
  watermark: string;
};

type AxisLabel = "x" | "y" | "z";

function getContainerSize(container: HTMLElement) {
  const w = container.clientWidth;
  const h = container.clientHeight;
  return {
    width: w > 0 ? w : 1,
    height: h > 0 ? h : 1,
  };
}

export function MakaraTool({ labels }: { labels: MakaraToolLabels }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const labelElsRef = useRef<Record<AxisLabel, HTMLDivElement | null>>({
    x: null,
    y: null,
    z: null,
  });
  const labelsRef = useRef(labels);
  labelsRef.current = labels;

  const [selection, setSelection] = useState("0");
  const [dims, setDims] = useState<BoxDimensions>(makaraBoxes[0]);
  const [panel, setPanel] = useState({
    dataTitle: labels.dataTitle,
    weightLabel: labels.weightLabel,
    netVolLabel: labels.netVolLabel,
    boxVolLabel: labels.boxVolLabel,
  });
  const readyRef = useRef(false);
  const skipSelectionEffectRef = useRef(true);

  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;
    boxMesh: THREE.Mesh | null;
    currentDims: BoxDimensions;
    sceneMeshes: THREE.Mesh[];
    tempV: THREE.Vector3;
    raf: number;
  } | null>(null);

  const edgesMaterial = useRef(
    new THREE.LineBasicMaterial({ color: "#ffffff", linewidth: 2 }),
  );

  const createTextTexture = useCallback(
    (text: string, boxWidth: number, boxHeight: number, color: string) => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (!context) return new THREE.CanvasTexture(document.createElement("canvas"));
      const qualityScale = 2;
      canvas.width = boxWidth * qualityScale;
      canvas.height = boxHeight * qualityScale;
      context.fillStyle = color;
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "#ffffff";
      const fontSize = Math.min(
        boxHeight * qualityScale * 0.1,
        boxWidth * qualityScale * 0.045,
      );
      context.font = `bold ${fontSize}px 'DM Sans', sans-serif`;
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(text, canvas.width / 2, canvas.height / 2);
      return new THREE.CanvasTexture(canvas);
    },
    [],
  );

  const clearScene = useCallback(() => {
    const s = sceneRef.current;
    if (!s) return;
    s.sceneMeshes.forEach((obj) => s.scene.remove(obj));
    s.sceneMeshes = [];
    s.boxMesh = null;
  }, []);

  const makeSingleBox = useCallback(
    (
      boxDims: BoxDimensions,
      posX: number,
      posY: number,
      posZ: number,
      colorHex: string,
    ) => {
      const s = sceneRef.current;
      if (!s) return null;
      const mat = new THREE.MeshStandardMaterial({
        color: colorHex,
        transparent: true,
        opacity: 0.85,
      });
      const geo = new THREE.BoxGeometry(boxDims.x, boxDims.y, boxDims.z);
      const tex = createTextTexture(
        boxDims.surfaceText,
        boxDims.x,
        boxDims.y,
        colorHex,
      );
      const materials = [
        mat,
        mat,
        mat,
        mat,
        new THREE.MeshBasicMaterial({ map: tex, transparent: true }),
        mat,
      ];
      const mesh = new THREE.Mesh(geo, materials);
      mesh.position.set(posX, posY, posZ);
      const edgesGeo = new THREE.EdgesGeometry(geo);
      const edges = new THREE.LineSegments(edgesGeo, edgesMaterial.current);
      mesh.add(edges);
      s.scene.add(mesh);
      s.sceneMeshes.push(mesh);
      return mesh;
    },
    [createTextTexture],
  );

  const applyDims = useCallback(
    (boxDims: BoxDimensions, allMode: boolean) => {
      const s = sceneRef.current;
      if (!s) return;
      const L = labelsRef.current;
      clearScene();
      s.currentDims = boxDims;
      setDims(boxDims);
      s.boxMesh = makeSingleBox(
        boxDims,
        0,
        boxDims.y / 2 - 200,
        0,
        boxDims.color,
      );

      if (allMode) {
        setPanel({
          dataTitle: L.allDataTitle,
          weightLabel: L.allWeightLabel,
          netVolLabel: L.allNetVolLabel,
          boxVolLabel: L.allBoxVolLabel,
        });
      } else {
        setPanel({
          dataTitle: L.dataTitle,
          weightLabel: L.weightLabel,
          netVolLabel: L.netVolLabel,
          boxVolLabel: L.boxVolLabel,
        });
      }
    },
    [clearScene, makeSingleBox],
  );

  const loadSelection = useCallback(
    (value: string) => {
      const val = parseInt(value, 10);
      if (val === 3) applyDims(calculateCombinedBox(), true);
      else applyDims(makaraBoxes[val], false);
    },
    [applyDims],
  );

  const loadSelectionRef = useRef(loadSelection);
  loadSelectionRef.current = loadSelection;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const { width: initW, height: initH } = getContainerSize(container);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#FAF8F3");

    const camera = new THREE.PerspectiveCamera(45, initW / initH, 1, 10000);
    camera.position.set(1800, 1200, 1800);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(initW, initH);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(500, 1000, 500);
    scene.add(dirLight);

    const gridHelper = new THREE.GridHelper(4000, 30, 0x94a3b8, 0xe2e8f0);
    gridHelper.position.y = -200;
    scene.add(gridHelper);

    sceneRef.current = {
      scene,
      camera,
      renderer,
      controls,
      boxMesh: null,
      currentDims: makaraBoxes[0],
      sceneMeshes: [],
      tempV: new THREE.Vector3(),
      raf: 0,
    };

    readyRef.current = true;
    loadSelectionRef.current("0");

    const updateLabelPosition = (
      mesh: THREE.Mesh,
      localX: number,
      localY: number,
      localZ: number,
    ): { left: number; top: number; visible: boolean } => {
      const s = sceneRef.current;
      if (!s) return { left: 0, top: 0, visible: false };

      const { width, height } = getContainerSize(container);
      if (width <= 1 && height <= 1) {
        return { left: 0, top: 0, visible: false };
      }

      s.tempV.set(localX, localY, localZ);
      mesh.localToWorld(s.tempV);
      s.tempV.project(s.camera);

      if (s.tempV.z > 1) return { left: 0, top: 0, visible: false };

      const left = (s.tempV.x * 0.5 + 0.5) * width;
      const top = (s.tempV.y * -0.5 + 0.5) * height;

      if (!Number.isFinite(left) || !Number.isFinite(top)) {
        return { left: 0, top: 0, visible: false };
      }

      return { left, top, visible: true };
    };

    const applyAxisLabel = (
      axis: AxisLabel,
      mesh: THREE.Mesh,
      localX: number,
      localY: number,
      localZ: number,
      text: string,
    ) => {
      const el = labelElsRef.current[axis];
      if (!el) return;
      const pos = updateLabelPosition(mesh, localX, localY, localZ);
      if (!pos.visible) {
        el.style.display = "none";
        return;
      }
      el.style.display = "block";
      el.style.left = `${pos.left}px`;
      el.style.top = `${pos.top}px`;
      el.textContent = text;
    };

    const resizeRenderer = () => {
      const s = sceneRef.current;
      if (!s) return;
      const { width, height } = getContainerSize(container);
      s.camera.aspect = width / height;
      s.camera.updateProjectionMatrix();
      s.renderer.setSize(width, height);
    };

    const animate = () => {
      const s = sceneRef.current;
      if (!s) return;
      s.raf = requestAnimationFrame(animate);
      s.controls.update();
      s.renderer.render(s.scene, s.camera);

      if (s.boxMesh) {
        const d = s.currentDims;
        applyAxisLabel(
          "x",
          s.boxMesh,
          0,
          -d.y / 2,
          d.z / 2 + 20,
          `X: ${d.x} mm`,
        );
        applyAxisLabel(
          "y",
          s.boxMesh,
          -d.x / 2 - 20,
          0,
          d.z / 2,
          `Y: ${d.y} mm`,
        );
        applyAxisLabel(
          "z",
          s.boxMesh,
          d.x / 2 + 20,
          -d.y / 2,
          0,
          `Z: ${d.z} mm`,
        );
      }
    };
    animate();

    const resizeObserver = new ResizeObserver(() => resizeRenderer());
    resizeObserver.observe(container);
    window.addEventListener("resize", resizeRenderer);

    return () => {
      readyRef.current = false;
      resizeObserver.disconnect();
      window.removeEventListener("resize", resizeRenderer);
      cancelAnimationFrame(sceneRef.current?.raf ?? 0);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      sceneRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- scene init once
  }, []);

  useEffect(() => {
    if (!readyRef.current) return;
    if (skipSelectionEffectRef.current) {
      skipSelectionEffectRef.current = false;
      return;
    }
    loadSelectionRef.current(selection);
  }, [selection]);

  const handleSelect = (value: string) => {
    setSelection(value);
  };

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden bg-ivory-50"
    >
      <div className="pointer-events-none absolute left-5 top-5 z-10 w-[min(320px,calc(100%-2.5rem))] border border-navy-800 bg-ivory-50 p-5">
        <h3 className="border-b-2 border-navy-800/10 pb-2 font-display text-base font-bold text-navy-950">
          {labels.selectTitle}
        </h3>
        <select
          value={selection}
          onChange={(e) => handleSelect(e.target.value)}
          className="pointer-events-auto mt-4 w-full cursor-pointer border border-navy-800 bg-ivory-100 px-3 py-2 font-sans text-sm text-navy-950 outline-none focus:border-gold-500"
        >
          {labels.options.map((opt, i) => (
            <option key={opt} value={String(i)}>
              {opt}
            </option>
          ))}
        </select>
        <p className="mt-3 font-sans text-[11px] leading-relaxed text-navy-800/70">
          {labels.hint}
        </p>
      </div>

      <div className="pointer-events-none absolute bottom-5 right-5 z-10 w-[min(320px,calc(100%-2.5rem))] border border-navy-800 bg-ivory-50 p-5">
        <h3 className="border-b-2 border-navy-800/10 pb-2 font-display text-base font-bold text-navy-950">
          {panel.dataTitle}
        </h3>
        <div className="mt-4 space-y-2 font-sans text-sm text-navy-800">
          <div className="flex justify-between border-b border-navy-800/10 pb-2">
            <span>{panel.weightLabel}</span>
            <span className="font-semibold text-navy-950">{dims.weight}</span>
          </div>
          <div className="flex justify-between border-b border-navy-800/10 pb-2">
            <span>{panel.netVolLabel}</span>
            <span className="font-semibold text-navy-950">{dims.netVol}</span>
          </div>
          <div className="flex justify-between">
            <span>{panel.boxVolLabel}</span>
            <span className="font-semibold text-navy-950">{dims.boxVol}</span>
          </div>
        </div>
      </div>

      {(["x", "y", "z"] as const).map((axis) => {
        const color =
          axis === "x"
            ? "text-[#dc2626]"
            : axis === "y"
              ? "text-[#16a34a]"
              : "text-[#2563eb]";
        return (
          <div
            key={axis}
            ref={(el) => {
              labelElsRef.current[axis] = el;
            }}
            className={`pointer-events-none absolute z-[5] hidden -translate-x-1/2 -translate-y-1/2 border border-navy-800/40 bg-ivory-50/95 px-2 py-1 font-mono text-xs font-bold ${color}`}
            aria-hidden
          />
        );
      })}

      <p className="pointer-events-none absolute bottom-5 left-5 z-10 font-mono text-[11px] italic text-navy-800/50">
        {labels.watermark}
      </p>
    </div>
  );
}
