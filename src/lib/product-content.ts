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
};

const contentMap: Record<string, RichProductContent> = {
  "polyurethane:yildiz-kaplinler": {
    name: "Polyurethane Yıldız Kaplinler",
    slug: "yildiz-kaplinler",
    category: "polyurethane",
    shortDescription:
      "Yüksek darbe dayanımı ve titreşim sönümleme özellikli poliüretan yıldız kaplin çözümleri.",
    intro:
      "Yıldız kaplinler, tahrik sistemlerinde mil hizasızlıklarını tolere ederken titreşim ve şok yüklerini sönümleyerek ekipman ömrünü uzatır. Bu sayfa, 3D inceleme, teknik tablo, ölçü matrisi ve teknik resim/doküman akışını tek bir üründe birleştirmek için hazırlandı.",
    modelEmbedUrl: null,
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
  },
};

export function getRichProductContent(
  category: string,
  slug: string,
): RichProductContent | null {
  const key = `${category}:${slug}`;
  return contentMap[key] ?? null;
}
