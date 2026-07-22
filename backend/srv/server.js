"use strict";

// Load .env
require("fs").existsSync(__dirname + "/../.env") &&
  require("fs").readFileSync(__dirname + "/../.env", "utf8")
    .split("\n")
    .forEach((line) => {
      const [key, ...rest] = line.split("=");
      const k = (key || "").trim();
      if (k && !k.startsWith("#") && !(k in process.env))
        process.env[k] = rest.join("=").trim();
    });

const cds  = require("@sap/cds");
const swagger = require("cds-swagger-ui-express");
const fs   = require("fs");
const path = require("path");
const os   = require("os");

cds.on("bootstrap", (app) => {
  app.use(swagger());
  app.get("/health", (_req, res) => res.json({ ok: true }));

  // ── POST /api/mxp/import-file  ────────────────────────────────────────────
  // Accepts a multipart XLSX upload and imports it.
  // Content-Type: multipart/form-data  field name: "file"
  app.post("/api/mxp/import-file", (req, res) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", async () => {
      try {
        const body = Buffer.concat(chunks);
        const ct   = req.headers["content-type"] || "";
        const boundary = ct.split("boundary=")[1];
        if (!boundary) return res.status(400).json({ ok: false, error: "Missing multipart boundary" });

        // Parse the single file part from multipart body
        const bBoundary = Buffer.from("--" + boundary);
        const start = body.indexOf(bBoundary) + bBoundary.length;
        const headerEnd = body.indexOf(Buffer.from("\r\n\r\n"), start) + 4;
        const nextBoundary = body.indexOf(bBoundary, headerEnd);
        const fileData = body.slice(headerEnd, nextBoundary - 2); // strip trailing \r\n

        const tmpPath = path.join(os.tmpdir(), `mxp_import_${Date.now()}.xlsx`);
        fs.writeFileSync(tmpPath, fileData);

        const { importFromFile } = require("./mxp/mxpImporter");
        const result = await importFromFile(tmpPath);
        fs.unlinkSync(tmpPath);
        res.json({ ok: true, ...result });
      } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
      }
    });
    req.on("error", (err) => res.status(500).json({ ok: false, error: err.message }));
  });

  // ── POST /api/mxp/import-path  ───────────────────────────────────────────
  // Imports from a file path on the server (handy for local dev).
  // Body: { "filePath": "/absolute/path/to/file.xlsx" }
  app.post("/api/mxp/import-path", express_json(), async (req, res) => {
    try {
      const { filePath } = req.body || {};
      if (!filePath) return res.status(400).json({ ok: false, error: "Missing filePath in request body" });
      if (!fs.existsSync(filePath)) return res.status(400).json({ ok: false, error: `File not found: ${filePath}` });
      const { importFromFile } = require("./mxp/mxpImporter");
      const result = await importFromFile(filePath);
      res.json({ ok: true, ...result });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  });
});

// express.json() mini helper (avoids adding body-parser dep)
function express_json() {
  return (req, _res, next) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => {
      try { req.body = JSON.parse(Buffer.concat(chunks).toString()); } catch { req.body = {}; }
      next();
    });
  };
}

module.exports = cds.server;
