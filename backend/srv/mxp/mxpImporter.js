"use strict";

const cds  = require("@sap/cds");
const XLSX = require("xlsx");

const LOG   = cds.log("MxpImporter");
const BATCH = 500;

function norm(v) {
  if (v == null) return null;
  const s = String(v).trim();
  return s || null;
}

// Maps one XLSX row → MxpCustomers row
function mapRow(row) {
  return {
    externalId:    norm(row["CRM Account ID"])                     || null,
    customerName:  norm(row["CRM Account Name"])                   || "Unknown",
    industry:      norm(row["Customer Industry (SAP Mastercode)"]) || null,
    region:        norm(row["Global Region"]) || norm(row["Country"]) || null,
    owner:         norm(row["Account Owner Name"])                 || null,
    country:       norm(row["Country"])                            || null,
    planningEntity: norm(row["Planning Entity"])                   || null,
    planningGroup:  norm(row["Planning Group"])                    || null,
    erpAccount:    norm(row["ERP Account"])                        || null,
    city:          norm(row["City"])                               || null,
  };
}

async function importFromFile(filePath) {
  LOG.info("Reading XLSX:", filePath);
  const wb   = XLSX.readFile(filePath, { cellDates: true });
  const ws   = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(ws, { defval: null });
  LOG.info(`Parsed ${rows.length} rows`);

  const db = await cds.connect.to("db");

  // Load existing keys for upsert
  const existing = await db.run("SELECT externalId FROM rig_tracker_MxpCustomers WHERE externalId IS NOT NULL");
  const existingSet = new Set(existing.map(e => e.externalId));
  LOG.info(`${existingSet.size} existing MXP customers in DB`);

  const now = new Date().toISOString();
  const toInsert = [];
  const toUpdate = [];
  const errors   = [];

  for (const row of rows) {
    try {
      const mapped = mapRow(row);
      if (!mapped.externalId) continue;
      if (existingSet.has(mapped.externalId)) {
        toUpdate.push(mapped);
      } else {
        toInsert.push(mapped);
      }
    } catch (err) {
      errors.push(`Row ${row["CRM Account ID"] || "?"}: ${err.message}`);
    }
  }

  LOG.info(`insert: ${toInsert.length}, update: ${toUpdate.length}`);

  const cols = ["externalId","customerName","industry","region","owner","country","planningEntity","planningGroup","erpAccount","city"];

  // Batch inserts
  let inserted = 0;
  for (let i = 0; i < toInsert.length; i += BATCH) {
    const chunk = toInsert.slice(i, i + BATCH);
    const ph = chunk.map(() => `(${cols.map(() => "?").join(",")})`).join(",");
    const vals = chunk.flatMap(r => cols.map(c => r[c] ?? null));
    try {
      await db.run(`INSERT OR IGNORE INTO rig_tracker_MxpCustomers (${cols.join(",")}) VALUES ${ph}`, vals);
      inserted += chunk.length;
    } catch {
      for (const r of chunk) {
        try {
          await db.run(`INSERT OR IGNORE INTO rig_tracker_MxpCustomers (${cols.join(",")}) VALUES (${cols.map(() => "?").join(",")})`, cols.map(c => r[c] ?? null));
          inserted++;
        } catch (e) { errors.push(`Insert ${r.externalId}: ${e.message}`); }
      }
    }
    if (i % 20000 === 0 && i > 0) LOG.info(`Inserted ${inserted}/${toInsert.length}…`);
  }

  // Updates
  let updated = 0;
  const updCols = cols.filter(c => c !== "externalId");
  for (const r of toUpdate) {
    try {
      await db.run(
        `UPDATE rig_tracker_MxpCustomers SET ${updCols.map(c => `${c}=?`).join(",")} WHERE externalId=?`,
        [...updCols.map(c => r[c] ?? null), r.externalId]
      );
      updated++;
    } catch (e) { errors.push(`Update ${r.externalId}: ${e.message}`); }
  }

  LOG.info("Import complete", { total: rows.length, inserted, updated, failed: errors.length });
  return { total: rows.length, inserted, updated, failed: errors.length, errors: errors.slice(0, 20) };
}

module.exports = { importFromFile };
