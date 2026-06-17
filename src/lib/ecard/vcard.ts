export type VcardInput = {
  name: string;
  title: string;
  organization: string;
  phone: string;
  email: string;
  url: string;
  address?: {
    street: string;
    city: string;
    region: string;
    country: string;
  };
};

function escapeVcardValue(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,");
}

function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: "" };
  }
  const lastName = parts.pop() ?? "";
  return { firstName: parts.join(" "), lastName };
}

/** vCard 3.0 metni — tek tıkla rehbere kayıt için. */
export function buildVcard(input: VcardInput): string {
  const { firstName, lastName } = splitName(input.name);
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${escapeVcardValue(input.name)}`,
    `N:${escapeVcardValue(lastName)};${escapeVcardValue(firstName)};;;`,
    `ORG:${escapeVcardValue(input.organization)}`,
    `TITLE:${escapeVcardValue(input.title)}`,
    `TEL;TYPE=CELL,VOICE:${input.phone.replace(/\s/g, "")}`,
    `EMAIL;TYPE=INTERNET:${input.email}`,
    `URL:${input.url}`,
  ];

  if (input.address) {
    const { street, city, region, country } = input.address;
    lines.push(
      `ADR;TYPE=WORK:;;${escapeVcardValue(street)};${escapeVcardValue(city)};${escapeVcardValue(region)};;${escapeVcardValue(country)}`,
    );
  }

  lines.push("END:VCARD");
  return lines.join("\r\n");
}

export function downloadVcard(vcard: string, filename: string): void {
  const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename.endsWith(".vcf") ? filename : `${filename}.vcf`;
  anchor.click();
  URL.revokeObjectURL(url);
}
