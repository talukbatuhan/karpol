export type ParsedMarkdownTable = {
  headers: string[];
  rows: string[][];
};

export type ParseMarkdownTableResult =
  | { ok: true; table: ParsedMarkdownTable }
  | { ok: false; error: string };

function splitRow(line: string): string[] {
  const trimmed = line.trim();
  if (!trimmed) return [];

  if (trimmed.includes("|")) {
    let inner = trimmed;
    if (inner.startsWith("|")) inner = inner.slice(1);
    if (inner.endsWith("|")) inner = inner.slice(0, -1);
    return inner.split("|").map((cell) => cell.trim());
  }

  if (trimmed.includes("\t")) {
    return trimmed.split("\t").map((cell) => cell.trim());
  }

  return [];
}

function isSeparatorCells(cells: string[]): boolean {
  if (cells.length === 0) return false;
  return cells.every((cell) => /^:?-{1,}:?$/.test(cell.replace(/\s/g, "")));
}

function isNumericish(value: string): boolean {
  const cell = value.trim();
  if (!cell) return false;
  return (
    /^[\d.×Øø\s°+-]+$/.test(cell) ||
    /^[\d]+([.,]\d+)?$/.test(cell) ||
    /^\d+\s*×\s*/.test(cell)
  );
}

function looksLikeHeaderRow(row: string[]): boolean {
  if (row.length <= 1) return true;
  const valueCells = row.slice(1);
  const numericCount = valueCells.filter(isNumericish).length;
  return numericCount < valueCells.length / 2;
}

function defaultHeaders(columnCount: number): string[] {
  if (columnCount === 2) return ["Özellik", "Değer"];
  return Array.from({ length: columnCount }, (_, index) => `Sütun ${index + 1}`);
}

function parseTableLines(lines: string[]): ParseMarkdownTableResult {
  const tableLines = lines
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && splitRow(line).length > 0);

  if (tableLines.length === 0) {
    return { ok: false, error: "Tablo bulunamadı. Markdown veya Excel satırlarını yapıştırın." };
  }

  const parsedRows = tableLines.map(splitRow);
  const separatorIndex = parsedRows.findIndex(isSeparatorCells);

  let headers: string[];
  let dataRows: string[][];

  if (separatorIndex === 0) {
    return {
      ok: false,
      error: "Başlık satırı eksik. İlk satır sütun adları olmalı.",
    };
  }

  if (separatorIndex > 0) {
    headers = parsedRows[0];
    dataRows = parsedRows.slice(separatorIndex + 1);
  } else if (parsedRows.length === 1) {
    const row = parsedRows[0];
    if (looksLikeHeaderRow(row)) {
      return {
        ok: false,
        error: "En az bir veri satırı gerekli (başlık + ayırıcı + satırlar).",
      };
    }
    headers = defaultHeaders(row.length);
    dataRows = [row];
  } else if (!looksLikeHeaderRow(parsedRows[0])) {
    const columnCount = parsedRows[0].length;
    const consistent = parsedRows.every((row) => row.length === columnCount);
    if (!consistent) {
      return { ok: false, error: "Satırlardaki sütun sayısı tutarsız." };
    }
    headers = defaultHeaders(columnCount);
    dataRows = parsedRows;
  } else {
    headers = parsedRows[0];
    dataRows = parsedRows.slice(1);
    if (dataRows.length > 0 && isSeparatorCells(dataRows[0])) {
      dataRows = dataRows.slice(1);
    }
  }

  headers = headers.filter((cell) => cell.length > 0);
  dataRows = dataRows
    .map((row) => row.slice(0, headers.length))
    .filter((row) => row.some((cell) => cell.length > 0));

  if (headers.length === 0) {
    return { ok: false, error: "Sütun başlıkları okunamadı." };
  }

  if (dataRows.length === 0) {
    return { ok: false, error: "Veri satırı bulunamadı." };
  }

  const normalizedRows = dataRows.map((row) => {
    const cells = [...row];
    while (cells.length < headers.length) cells.push("");
    return cells.slice(0, headers.length);
  });

  return {
    ok: true,
    table: { headers, rows: normalizedRows },
  };
}

export function parseMarkdownTable(text: string): ParseMarkdownTableResult {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  return parseTableLines(lines);
}

/** Append mode: header/separator varsa atlar, yalnızca veri satırlarını döner. */
export function parseMarkdownTableDataRows(text: string): ParseMarkdownTableResult {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const tableLines = lines
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && splitRow(line).length > 0);

  if (tableLines.length === 0) {
    return { ok: false, error: "Eklenecek satır bulunamadı." };
  }

  const parsedRows = tableLines.map(splitRow);
  const separatorIndex = parsedRows.findIndex(isSeparatorCells);

  let dataRows: string[][];

  if (separatorIndex >= 0) {
    dataRows = parsedRows.slice(separatorIndex + 1);
  } else if (parsedRows.length > 1 && !isSeparatorCells(parsedRows[0])) {
    const firstLooksLikeHeader =
      parsedRows[0].some((cell) => /[a-zA-ZğüşıöçĞÜŞİÖÇ]/.test(cell)) &&
      parsedRows[1]?.some((cell) => /^[\d.×Øø\s-]+$/.test(cell) || /^KRP-/i.test(cell));

    dataRows = firstLooksLikeHeader ? parsedRows.slice(1) : parsedRows;
  } else {
    dataRows = parsedRows;
  }

  dataRows = dataRows.filter(
    (row) => !isSeparatorCells(row) && row.some((cell) => cell.length > 0),
  );

  if (dataRows.length === 0) {
    return { ok: false, error: "Eklenecek veri satırı bulunamadı." };
  }

  return {
    ok: true,
    table: { headers: [], rows: dataRows },
  };
}

export function padRowToLength(row: string[], length: number): string[] {
  const cells = [...row];
  while (cells.length < length) cells.push("");
  return cells.slice(0, length);
}
