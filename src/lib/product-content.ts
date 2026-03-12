type ProductSpec = {
  label: string;
  value: string;
};

type ProductTableRow = {
  size: string;
  outerDiameter: string;
  innerDiameter: string;
  width: string;
};

type ProductAsset = {
  title: string;
  url: string;
};

export type RichProductContent = {
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
  intro: string;
  modelEmbedUrl: string | null;
  imageGallery: ProductAsset[];
  technicalDrawings: ProductAsset[];
  documents: ProductAsset[];
  specs: ProductSpec[];
  sizeTable: ProductTableRow[];
  highlights: string[];
  applications: string[];
  compatibleMachines: string[];
};

const contentMap: Record<string, RichProductContent> = {
  "polyurethane-components:yildiz-kaplinler": {
    name: "Polyurethane Yıldız Kaplinler",
    slug: "yildiz-kaplinler",
    category: "polyurethane-components",
    shortDescription:
      "Yüksek darbe dayanımı ve titreşim sönümleme özellikli poliüretan yıldız kaplin çözümleri.",
    intro:
      "Yıldız kaplinler, tahrik sistemlerinde mil hizasızlıklarını tolere ederken titreşim ve şok yüklerini sönümleyerek ekipman ömrünü uzatır. Bu sayfa, 3D inceleme, teknik tablo, ölçü matrisi ve teknik resim/doküman akışını tek bir üründe birleştirmek için hazırlandı.",
    modelEmbedUrl: "https://sketchfab.com/models/embed-code-placeholder",
    imageGallery: [
      { title: "Ürün Perspektif Görseli", url: "https://karpol.net/media/star-coupling-01.webp" },
      { title: "Kesit Görünüm", url: "https://karpol.net/media/star-coupling-02.webp" },
      { title: "Uygulama Üzerinde", url: "https://karpol.net/media/star-coupling-03.webp" },
    ],
    technicalDrawings: [
      { title: "Yıldız Kaplin Teknik Resim PDF", url: "https://karpol.net/drawings/star-coupling-tech-drawing.pdf" },
      { title: "2D DXF Çizim", url: "https://karpol.net/drawings/star-coupling-profile.dxf" },
    ],
    documents: [
      { title: "Ürün Teknik Föyü", url: "https://karpol.net/docs/star-coupling-datasheet.pdf" },
      { title: "Malzeme Dayanım Raporu", url: "https://karpol.net/docs/polyurethane-material-report.pdf" },
    ],
    specs: [
      { label: "Malzeme", value: "Cast Polyurethane Elastomer" },
      { label: "Sertlik", value: "92 ±3 Shore A" },
      { label: "Çalışma Sıcaklığı", value: "-30°C / +80°C" },
      { label: "Renk", value: "Kırmızı, Sarı, Mavi (opsiyonel)" },
      { label: "Standart", value: "DIN / müşteri ölçüsüne göre özel üretim" },
      { label: "Kimyasal Dayanım", value: "Yağ ve grese karşı yüksek direnç" },
    ],
    sizeTable: [
      { size: "L-090", outerDiameter: "54 mm", innerDiameter: "18 mm", width: "14 mm" },
      { size: "L-095", outerDiameter: "67 mm", innerDiameter: "24 mm", width: "18 mm" },
      { size: "L-099", outerDiameter: "84 mm", innerDiameter: "30 mm", width: "20 mm" },
      { size: "L-100", outerDiameter: "102 mm", innerDiameter: "35 mm", width: "25 mm" },
    ],
    highlights: [
      "Mil hizasızlıklarında stabil güç iletimi",
      "Aşınma ve darbeye karşı uzun servis ömrü",
      "Düşük bakım maliyeti ve kolay değişim",
      "Makineye özel geometri ve sertlik seçeneği",
    ],
    applications: [
      "Konveyör tahrik sistemleri",
      "Mermer ve taş işleme makineleri",
      "Pompa ve kompresör grupları",
      "Ağır hizmet redüktör bağlantıları",
    ],
    compatibleMachines: [
      "Simec Mermer Cila",
      "Breton Parlatma Hattı",
      "Pedrini Blok Kesim",
      "Gaspari Menegini"
    ]
  },
  "polyurethane-components:guide-roller": {
    name: "Polyurethane Guide Roller",
    slug: "guide-roller",
    category: "polyurethane-components",
    shortDescription: "High-precision polyurethane guide roller for stable marble slab transport.",
    intro: "Engineered for superior load-bearing and noise reduction, these guide rollers ensure smooth slab movement in polishing lines.",
    modelEmbedUrl: "https://sketchfab.com/models/embed-code-placeholder-roller",
    imageGallery: [
      { title: "Guide Roller Front View", url: "https://placehold.co/800x600/e2e8f0/1e293b?text=Guide+Roller+Front" },
      { title: "Side Profile", url: "https://placehold.co/800x600/e2e8f0/1e293b?text=Side+Profile" },
      { title: "Assembly Detail", url: "https://placehold.co/800x600/e2e8f0/1e293b?text=Assembly+Detail" },
    ],
    technicalDrawings: [
      { title: "Guide Roller Assembly PDF", url: "https://example.com/drawings/guide-roller.pdf" },
    ],
    documents: [
      { title: "Technical Datasheet", url: "https://example.com/docs/guide-roller-specs.pdf" },
    ],
    specs: [
      { label: "Material", value: "High-Performance Polyurethane" },
      { label: "Hardness", value: "95 Shore A" },
      { label: "Core Material", value: "Aluminum / Steel" },
      { label: "Working Temp", value: "-20°C / +90°C" },
    ],
    sizeTable: [
      { size: "GR-100", outerDiameter: "100 mm", innerDiameter: "25 mm", width: "40 mm" },
      { size: "GR-125", outerDiameter: "125 mm", innerDiameter: "30 mm", width: "50 mm" },
    ],
    highlights: [
      "Excellent abrasion resistance against stone dust",
      "Low noise operation",
      "High load capacity",
      "Chemical resistant to polishing fluids"
    ],
    applications: [
      "Marble Polishing Lines",
      "Slab Calibration Machines",
      "Edge Polishing"
    ],
    compatibleMachines: [
      "Simec Polisher",
      "Breton Gang Saw",
      "Gaspari Menegini"
    ]
  },
  "vulkollan-components:drive-wheel": {
    name: "Vulkollan Drive Wheel",
    slug: "drive-wheel",
    category: "vulkollan-components",
    shortDescription: "Heavy-duty Vulkollan drive wheel for extreme load and high-speed applications.",
    intro: "Vulkollan wheels offer the highest mechanical performance for driving heavy stone blocks with minimal deformation.",
    modelEmbedUrl: "https://sketchfab.com/models/embed-code-placeholder-wheel",
    imageGallery: [
      { title: "Drive Wheel Iso", url: "https://placehold.co/800x600/e2e8f0/1e293b?text=Drive+Wheel+Iso" },
      { title: "Tread Pattern", url: "https://placehold.co/800x600/e2e8f0/1e293b?text=Tread+Pattern" },
    ],
    technicalDrawings: [
      { title: "Wheel Dimension Drawing", url: "https://example.com/drawings/drive-wheel.pdf" },
    ],
    documents: [
      { title: "Vulkollan Material Specs", url: "https://example.com/docs/vulkollan-specs.pdf" },
    ],
    specs: [
      { label: "Material", value: "Original Vulkollan®" },
      { label: "Hardness", value: "93 Shore A" },
      { label: "Bonding", value: "Chemical bonding to steel center" },
      { label: "Load Capacity", value: "Up to 2500 kg" },
    ],
    sizeTable: [
      { size: "VW-200", outerDiameter: "200 mm", innerDiameter: "50 mm", width: "80 mm" },
      { size: "VW-250", outerDiameter: "250 mm", innerDiameter: "60 mm", width: "100 mm" },
    ],
    highlights: [
      "Highest dynamic load capacity",
      "Low rolling resistance",
      "Minimal heat build-up",
      "Superior tear strength"
    ],
    applications: [
      "Block Cutters",
      "Gantry Cranes",
      "Heavy Transport AGVs"
    ],
    compatibleMachines: [
      "Breton Gang Saw",
      "Pedrini Block Cutter",
      "Simec Polisher"
    ]
  },
  "rubber-components:vibration-dampener": {
    name: "Rubber Vibration Dampener",
    slug: "vibration-dampener",
    category: "rubber-components",
    shortDescription: "Industrial rubber mount to isolate machine vibration and reduce noise.",
    intro: "Critical for precision stone cutting, these dampeners absorb high-frequency vibrations to ensure smooth surface finish.",
    modelEmbedUrl: "https://sketchfab.com/models/embed-code-placeholder-dampener",
    imageGallery: [
      { title: "Dampener Unit", url: "https://placehold.co/800x600/e2e8f0/1e293b?text=Dampener+Unit" },
      { title: "Installation View", url: "https://placehold.co/800x600/e2e8f0/1e293b?text=Installation+View" },
    ],
    technicalDrawings: [
      { title: "Mounting Dimensions", url: "https://example.com/drawings/dampener.pdf" },
    ],
    documents: [
      { title: "Vibration Analysis Data", url: "https://example.com/docs/vibration-data.pdf" },
    ],
    specs: [
      { label: "Material", value: "NR / NBR Rubber" },
      { label: "Hardness", value: "55-70 Shore A" },
      { label: "Metal Parts", value: "Galvanized Steel" },
      { label: "Damping Ratio", value: "0.15 - 0.25" },
    ],
    sizeTable: [
      { size: "VD-50", outerDiameter: "50 mm", innerDiameter: "M10", width: "40 mm" },
      { size: "VD-75", outerDiameter: "75 mm", innerDiameter: "M12", width: "50 mm" },
    ],
    highlights: [
      "Effective vibration isolation",
      "Noise reduction up to 20dB",
      "Corrosion resistant metal parts",
      "Maintenance free"
    ],
    applications: [
      "Machine Feet",
      "Motor Mounts",
      "Hydraulic Pump Isolation"
    ],
    compatibleMachines: [
      "Simec Polisher",
      "Gaspari Menegini",
      "Pedrini Block Cutter"
    ]
  },
};

export function getRichProductContent(
  category: string,
  slug: string,
): RichProductContent | null {
  const key = `${category}:${slug}`;
  return contentMap[key] ?? null;
}

export function getRichProductsByCategory(category: string): RichProductContent[] {
  return Object.values(contentMap).filter((item) => item.category === category);
}
