export type BoxDimensions = {
  x: number;
  y: number;
  z: number;
  weight: string;
  netVol: string;
  boxVol: string;
  surfaceText: string;
  color: string;
};

export const makaraBoxes: BoxDimensions[] = [
  {
    x: 600,
    y: 372,
    z: 300,
    weight: "25,2 kg",
    netVol: "0,0526 m³",
    boxVol: "0,0670 m³",
    surfaceText: "(Ø60 x Ø30 x 93 mm) x 200 adet",
    color: "#0B1F3A",
  },
  {
    x: 600,
    y: 258,
    z: 300,
    weight: "15,2 kg",
    netVol: "0,0365 m³",
    boxVol: "0,0464 m³",
    surfaceText: "(Ø60 x Ø20 x 64,5 mm) x 200 adet",
    color: "#0B1F3A",
  },
  {
    x: 800,
    y: 394,
    z: 400,
    weight: "34,4 kg",
    netVol: "0,0990 m³",
    boxVol: "0,1261 m³",
    surfaceText: "(Ø80 x Ø20 x 98,5 mm) x 200 adet",
    color: "#0B1F3A",
  },
];

export function parseVolM3(str: string): number {
  return parseFloat(str.replace(",", ".").replace(/\s*m³/i, "").trim());
}

export function parseWeightKg(str: string): number {
  return parseFloat(str.replace(",", ".").replace(/\s*kg/i, "").trim());
}

export function formatVolM3(v: number): string {
  return `${v.toFixed(4).replace(".", ",")} m³`;
}

export function formatWeightKg(v: number): string {
  return `${v.toFixed(1).replace(".", ",")} kg`;
}

export function calculateCombinedBox(): BoxDimensions {
  let totalWeight = 0;
  let totalNetVol = 0;
  let totalBoxVol = 0;
  makaraBoxes.forEach((b) => {
    totalWeight += parseWeightKg(b.weight);
    totalNetVol += parseVolM3(b.netVol);
    totalBoxVol += parseVolM3(b.boxVol);
  });
  const x = Math.max(...makaraBoxes.map((b) => b.x));
  const z = Math.max(...makaraBoxes.map((b) => b.z));
  const totalBoxVolMm3 = totalBoxVol * 1e9;
  const y = Math.ceil(totalBoxVolMm3 / (x * z));

  return {
    x,
    y,
    z,
    weight: formatWeightKg(totalWeight),
    netVol: formatVolM3(totalNetVol),
    boxVol: formatVolM3(totalBoxVol),
    surfaceText: "Tüm Makaralar — 3 tip x 200 adet (600 adet)",
    color: "#0B1F3A",
  };
}
