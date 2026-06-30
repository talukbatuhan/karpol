/**
 * Bulk import product PNG pairs from a local folder into Supabase Storage + products.
 *
 * Usage:
 *   npm run import:kaplin
 *   npm run import:vantuz
 *   npm run import:plastikler
 *   npm run import:products -- --config scripts/import-vantuz.config.json --dry-run
 *   npm run import:plastikler -- --folder "Boru Plastikleri" --dry-run
 */

import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadConfig(configPath) {
  const resolved = path.isAbsolute(configPath)
    ? configPath
    : path.join(process.cwd(), configPath);
  const raw = fs.readFileSync(resolved, "utf8");
  return JSON.parse(raw);
}

function parseArgs(config) {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");

  let configPath = path.join(__dirname, "import-kaplin.config.json");
  const configIdx = args.indexOf("--config");
  if (configIdx >= 0) {
    configPath = args[configIdx + 1];
    if (!configPath) {
      console.error("--config requires a path");
      process.exit(1);
    }
  }

  let from = config.code_start ?? 1;
  let to = config.code_end ?? from;

  const fromIdx = args.indexOf("--from");
  if (fromIdx >= 0) {
    from = Number(args[fromIdx + 1]);
    if (!Number.isFinite(from)) {
      console.error("--from requires a number");
      process.exit(1);
    }
  }

  const toIdx = args.indexOf("--to");
  if (toIdx >= 0) {
    to = Number(args[toIdx + 1]);
    if (!Number.isFinite(to)) {
      console.error("--to requires a number");
      process.exit(1);
    }
  }

  let folderFilter = null;
  const folderIdx = args.indexOf("--folder");
  if (folderIdx >= 0) {
    folderFilter = args[folderIdx + 1];
    if (!folderFilter) {
      console.error("--folder requires a directory name");
      process.exit(1);
    }
  }

  return { dryRun, from, to, configPath, folderFilter };
}

function formatCode(prefix, num, pad) {
  return `${prefix}${String(num).padStart(pad, "0")}`;
}

function toSlug(code) {
  return code.toLowerCase();
}

function applyTitle(template, code) {
  return (template ?? "{code}").replaceAll("{code}", code);
}

function contentTypeFor(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".webp") return "image/webp";
  if (ext === ".pdf") return "application/pdf";
  return "application/octet-stream";
}

function buildMetadata(imagePath, technicalPath) {
  return {
    tool_href: "",
    specs: [],
    assets: { image: imagePath },
    technical_drawing: {
      enabled: true,
      image: technicalPath,
      caption_tr: "",
      caption_en: "",
    },
    technical_table: {
      enabled: false,
      title_tr: "",
      title_en: "",
      columns: [],
      rows: [],
    },
  };
}

function listCodesFromFolder(sourceDir, prefix) {
  const technicalMarker = "-Teknik";
  const codes = new Set();

  for (const name of fs.readdirSync(sourceDir)) {
    if (!name.toLowerCase().endsWith(".png")) continue;
    if (name.includes(technicalMarker)) continue;
    if (prefix && !name.startsWith(prefix)) continue;
    const code = name.slice(0, -path.extname(name).length);
    codes.add(code);
  }

  return sortCodes(codes, prefix);
}

function sortCodes(codes, prefix) {
  return [...codes].sort((a, b) => {
    if (prefix) {
      const numA = Number(a.slice(prefix.length));
      const numB = Number(b.slice(prefix.length));
      if (Number.isFinite(numA) && Number.isFinite(numB)) return numA - numB;
    }
    return a.localeCompare(b, undefined, { numeric: true });
  });
}

function listCodesFromRange(config, from, to) {
  const pad = config.code_pad ?? 3;
  const codes = [];
  for (let n = from; n <= to; n++) {
    codes.push(formatCode(config.code_prefix, n, pad));
  }
  return codes;
}

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local",
    );
    process.exit(1);
  }
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

async function uploadFile(supabase, bucket, storagePath, localPath, dryRun) {
  if (dryRun) {
    console.log(`  [dry-run] upload ${localPath} → ${bucket}/${storagePath}`);
    return;
  }

  const body = fs.readFileSync(localPath);
  const { error } = await supabase.storage.from(bucket).upload(storagePath, body, {
    upsert: true,
    contentType: contentTypeFor(localPath),
  });

  if (error) {
    throw new Error(`Storage upload failed (${storagePath}): ${error.message}`);
  }
}

async function upsertProduct(supabase, row, dryRun) {
  if (dryRun) {
    console.log(`  [dry-run] upsert product slug=${row.slug} status=${row.status}`);
    return "dry-run";
  }

  const { data: existing, error: selectError } = await supabase
    .from("products")
    .select("id")
    .eq("slug", row.slug)
    .maybeSingle();

  if (selectError) {
    throw new Error(`Product lookup failed (${row.slug}): ${selectError.message}`);
  }

  if (existing?.id) {
    const { error } = await supabase.from("products").update(row).eq("id", existing.id);
    if (error) throw new Error(`Product update failed (${row.slug}): ${error.message}`);
    return "updated";
  }

  const { error } = await supabase.from("products").insert(row);
  if (error) throw new Error(`Product insert failed (${row.slug}): ${error.message}`);
  return "created";
}

async function resolveCategoryId(supabase, slug, dryRun) {
  if (dryRun) return null;

  const { data: category, error } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(`Category lookup failed (${slug}): ${error.message}`);
  }
  if (!category?.id) {
    throw new Error(`Category not found: ${slug}`);
  }
  return category.id;
}

async function importFolderEntry(
  supabase,
  config,
  entry,
  sourceRoot,
  dryRun,
  summary,
) {
  const folderPath = path.join(sourceRoot, entry.dir);

  if (!fs.existsSync(folderPath)) {
    summary.failed++;
    summary.errors.push(`${entry.dir}: folder not found`);
    console.error(`\n✗ Folder not found: ${folderPath}`);
    return;
  }

  const codes = listCodesFromFolder(folderPath, entry.code_prefix ?? null);
  console.log(
    `\n=== ${entry.dir} → ${entry.category_slug} (${codes.length} products) ===`,
  );

  if (codes.length === 0) {
    summary.failed++;
    summary.errors.push(`${entry.dir}: no product images found`);
    console.error(`  ✗ no PNG products in folder`);
    return;
  }

  let categoryId = null;
  try {
    categoryId = await resolveCategoryId(supabase, entry.category_slug, dryRun);
  } catch (err) {
    summary.failed += codes.length;
    const msg = err instanceof Error ? err.message : String(err);
    summary.errors.push(`${entry.dir}: ${msg}`);
    console.error(`  ✗ ${msg}`);
    return;
  }

  for (const code of codes) {
    await importCode(supabase, config, categoryId, folderPath, code, dryRun, summary, {
      title_tr: entry.title_tr ?? config.title_tr,
      title_en: entry.title_en ?? config.title_en,
    });
  }
}

async function importCode(
  supabase,
  config,
  categoryId,
  sourceDir,
  code,
  dryRun,
  summary,
  titles = null,
) {
  const slug = toSlug(code);
  const imageFile = `${code}.png`;
  const technicalFile = `${code}-Teknik.png`;
  const imageLocal = path.join(sourceDir, imageFile);
  const technicalLocal = path.join(sourceDir, technicalFile);
  const imageStoragePath = imageFile;
  const technicalStoragePath = `technical/${technicalFile}`;

  console.log(`\n[${code}] slug=${slug}`);

  if (!fs.existsSync(imageLocal)) {
    summary.failed++;
    summary.errors.push(`${code}: missing ${imageFile}`);
    console.error(`  ✗ missing ${imageFile}`);
    return;
  }
  if (!fs.existsSync(technicalLocal)) {
    summary.failed++;
    summary.errors.push(`${code}: missing ${technicalFile}`);
    console.error(`  ✗ missing ${technicalFile}`);
    return;
  }

  try {
    await uploadFile(supabase, "product-images", imageStoragePath, imageLocal, dryRun);
    await uploadFile(
      supabase,
      "product-images",
      technicalStoragePath,
      technicalLocal,
      dryRun,
    );

    const row = {
      slug,
      category_id: categoryId,
      status: config.status,
      title_tr: applyTitle(titles?.title_tr ?? config.title_tr, code),
      title_en: applyTitle(titles?.title_en ?? config.title_en, code),
      description_tr: "",
      description_en: "",
      body_tr: "",
      body_en: "",
      metadata: buildMetadata(imageStoragePath, technicalStoragePath),
    };

    const result = await upsertProduct(supabase, row, dryRun);
    summary.ok++;
    if (result === "created") summary.created++;
    if (result === "updated") summary.updated++;
    console.log(`  ✓ ${result === "dry-run" ? "would upsert" : result}`);
  } catch (err) {
    summary.failed++;
    const msg = err instanceof Error ? err.message : String(err);
    summary.errors.push(`${code}: ${msg}`);
    console.error(`  ✗ ${msg}`);
  }
}

async function main() {
  const { dryRun, from, to, configPath, folderFilter } = parseArgs({});
  const config = loadConfig(configPath);
  const sourceDir = config.source_dir;

  if (!fs.existsSync(sourceDir)) {
    console.error(`Source folder not found: ${sourceDir}`);
    process.exit(1);
  }

  const supabase = getSupabase();
  const mode = config.mode ?? "range";
  const summary = { ok: 0, created: 0, updated: 0, failed: 0, errors: [] };

  if (mode === "folders") {
    let folders = config.folders ?? [];
    if (!folders.length) {
      console.error('mode "folders" requires a "folders" array in config');
      process.exit(1);
    }
    if (folderFilter) {
      folders = folders.filter((entry) => entry.dir === folderFilter);
      if (!folders.length) {
        console.error(`No folder config matches --folder "${folderFilter}"`);
        process.exit(1);
      }
    }

    console.log(
      `${dryRun ? "[DRY RUN] " : ""}folders import: ${folders.length} categor${
        folders.length === 1 ? "y" : "ies"
      } under ${sourceDir}`,
    );

    for (const entry of folders) {
      await importFolderEntry(supabase, config, entry, sourceDir, dryRun, summary);
    }
  } else {
    let codes =
      mode === "scan"
        ? listCodesFromFolder(sourceDir, config.code_prefix)
        : listCodesFromRange(config, from, to);

    if (mode === "scan" && (process.argv.includes("--from") || process.argv.includes("--to"))) {
      const pad = config.code_pad ?? 3;
      const fromCode = formatCode(config.code_prefix, from, pad);
      const toCode = formatCode(config.code_prefix, to, pad);
      const fromNum = from;
      const toNum = to;
      codes = codes.filter((code) => {
        const num = Number(code.slice(config.code_prefix.length));
        return num >= fromNum && num <= toNum;
      });
      console.log(`Filtered scan to numeric range ${fromCode}–${toCode}: ${codes.length} codes`);
    }

    let categoryId = null;
    try {
      categoryId = await resolveCategoryId(supabase, config.category_slug, dryRun);
    } catch (err) {
      console.error(err instanceof Error ? err.message : err);
      process.exit(1);
    }

    console.log(
      `${dryRun ? "[DRY RUN] " : ""}${mode} import: ${codes.length} products from ${sourceDir} → ${config.category_slug}`,
    );

    for (const code of codes) {
      await importCode(supabase, config, categoryId, sourceDir, code, dryRun, summary);
    }
  }

  console.log("\n--- Summary ---");
  console.log(`OK: ${summary.ok} (created: ${summary.created}, updated: ${summary.updated})`);
  console.log(`Failed: ${summary.failed}`);
  if (summary.errors.length) {
    for (const e of summary.errors) console.log(`  - ${e}`);
  }

  if (summary.failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
