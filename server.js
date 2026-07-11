// server.ts
import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import crypto from "crypto";
import pg from "pg";
import { fileURLToPath } from "url";

// src/data.ts
var PRODUCTS_LIST = [
  {
    id: "robe-ceremonie-wax",
    name: "Robe de C\xE9r\xE9monie Wax Imp\xE9rial",
    category: "Tenues de C\xE9r\xE9monie",
    description: "Spectaculaire robe longue de c\xE9r\xE9monie avec volants \xE9l\xE9gants et col structur\xE9, fa\xE7onn\xE9e dans un Wax africain premium. Livr\xE9e avec son foulard (Gele) assorti.",
    price: "Sur devis (D\xE8s 25 000 FCFA)",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=800",
    badge: "Populaire",
    details: ["Tissu Wax 100% coton cir\xE9 lourd", "Volants asym\xE9triques en cascade", "Foulard (Gele) de c\xE9r\xE9monie coordonn\xE9", "Ajustement parfait garanti"]
  },
  {
    id: "tailleur-chic-blanc",
    name: "Ensemble Tailleur Blanc Floral",
    category: "Pr\xEAt-\xE0-porter & Tailleurs",
    description: "Tailleur deux pi\xE8ces ultra-chic compos\xE9 d\u2019une veste crois\xE9e cintr\xE9e \xE0 boutons recouverts et d\u2019une jupe assortie. Orn\xE9 d\u2019\xE9l\xE9gantes broderies florales vert \xE9meraude.",
    price: "Sur devis (D\xE8s 35 000 FCFA)",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800",
    badge: "Tendance",
    details: ["Tissu cr\xEApe de soie lourd haut de gamme", "Broderies florales ex\xE9cut\xE9es avec minutie", "Veste \xE0 \xE9paulettes structur\xE9es", "Jupe droite doubl\xE9e"]
  },
  {
    id: "bonnet-satin-premium",
    name: "Bonnet de Nuit en Satin Double Face",
    category: "Accessoires en Satin",
    description: "Le secret de beaut\xE9 pour vos cheveux. Ce bonnet double couche r\xE9duit le frottement nocturne, \xE9vite la d\xE9shydratation des boucles et pr\xE9vient la casse.",
    price: "3 500 FCFA",
    image: "https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&q=80&w=800",
    badge: "Best-Seller",
    details: ["Satin de soie fluide double \xE9paisseur", "Bande \xE9lastique douce et hypoallerg\xE9nique", "Mod\xE8le r\xE9versible (deux couleurs)", "Adapt\xE9 pour tresses, boucles, dreadlocks"]
  },
  {
    id: "chouchous-satin-premium",
    name: "Chouchous Soyeux en Satin",
    category: "Accessoires en Satin",
    description: "Chouchous color\xE9s qui maintiennent vos coiffures sans casser la fibre capillaire ni laisser de pli. Disponibles en une vari\xE9t\xE9 de coloris \xE9tincelants.",
    price: "1 000 FCFA / unit\xE9",
    image: "https://images.unsplash.com/photo-1621644040604-db9cfbaec7cf?auto=format&fit=crop&q=80&w=800",
    badge: "Nouveau",
    details: ["100% satin de soie glissant", "\xC9lastique interne de haute r\xE9sistance", "Large choix de coloris (Pastels & Joyaux)", "Prot\xE8ge les cheveux des fourches"]
  },
  {
    id: "tablier-cuisine-chef",
    name: 'Tablier Ajustable "Chef"',
    category: "Linge de Maison & Accessoires",
    description: "Tablier bicolore haut de gamme, mariant coton lourd et finitions soign\xE9es. \xC9quip\xE9 d\u2019une grande poche avant fonctionnelle pour tous vos ustensiles.",
    price: "5 000 FCFA",
    image: "https://images.unsplash.com/photo-1577106263724-2c8e03bfe9cf?auto=format&fit=crop&q=80&w=800",
    badge: "Exclusif",
    details: ["Toile de coton \xE9pais trait\xE9 antitaches", "Grande poche ventrale compartiment\xE9e", "Sangles crois\xE9es r\xE9glables", 'Broderie "Chef" de qualit\xE9']
  },
  {
    id: "robe-evasee-wax",
    name: "Robe \xC9vas\xE9e d\u2019\xC9t\xE9 en Wax",
    category: "Pr\xEAt-\xE0-porter & Tailleurs",
    description: "Une ravissante robe d\u2019\xE9t\xE9 fluide avec une coupe \xE9vas\xE9e qui sublime la silhouette. Parfaite pour exprimer votre \xE9l\xE9gance naturelle lors des journ\xE9es ensoleill\xE9es.",
    price: "18 000 FCFA",
    image: "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&q=80&w=800",
    badge: "\xC9dition Limit\xE9e",
    details: ["Tissu 100% coton Wax authentique", "D\xE9collet\xE9 en V flatteur", "Poches lat\xE9rales discr\xE8tes", "Zip invisible au dos"]
  }
];

// server.ts
dotenv.config();
var { Pool } = pg;
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var app = express();
var port = process.env.PORT || 3e3;
app.use(express.json({ limit: "10mb" }));
var DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "data");
var UPLOADS_DIR = path.join(DATA_DIR, "uploads");
var PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
var ORDERS_FILE = path.join(DATA_DIR, "orders.json");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
var usePostgres = !!process.env.DATABASE_URL;
var pool = null;
if (usePostgres) {
  console.log("PostgreSQL database URL detected. Initializing connection pool...");
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
      // Required for Neon serverless PostgreSQL connection
    }
  });
} else {
  console.log("No DATABASE_URL found. Running in local JSON-file mode.");
}
function getProducts() {
  if (fs.existsSync(PRODUCTS_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(PRODUCTS_FILE, "utf-8"));
    } catch (e) {
      console.error("Error reading products file, falling back to default list", e);
    }
  }
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(PRODUCTS_LIST, null, 2));
  return PRODUCTS_LIST;
}
function getOrders() {
  if (fs.existsSync(ORDERS_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(ORDERS_FILE, "utf-8"));
    } catch (e) {
      console.error("Error reading orders file", e);
    }
  }
  return [];
}
async function initializeDatabase() {
  if (!usePostgres || !pool) return;
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        price VARCHAR(100) NOT NULL,
        image TEXT NOT NULL,
        badge VARCHAR(100),
        details TEXT[] NOT NULL
      )
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(100) PRIMARY KEY,
        date VARCHAR(100) NOT NULL,
        client_name VARCHAR(255) NOT NULL,
        service_title VARCHAR(255) NOT NULL,
        fabric_option VARCHAR(50) NOT NULL,
        details TEXT NOT NULL,
        status VARCHAR(50) NOT NULL
      )
    `);
    console.log("PostgreSQL tables verified.");
    const checkProducts = await pool.query("SELECT COUNT(*) FROM products");
    if (parseInt(checkProducts.rows[0].count, 10) === 0) {
      console.log("Products table is empty. Seeding default products...");
      for (const p of PRODUCTS_LIST) {
        await pool.query(
          "INSERT INTO products (id, name, category, description, price, image, badge, details) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
          [p.id, p.name, p.category, p.description, p.price, p.image, p.badge || null, p.details]
        );
      }
      console.log("Default products seeded successfully.");
    }
  } catch (err) {
    console.error("Failed to initialize PostgreSQL database:", err);
  }
}
var ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "vero2026";
var sessions = /* @__PURE__ */ new Map();
var SESSION_DURATION = 2 * 60 * 60 * 1e3;
var loginAttempts = /* @__PURE__ */ new Map();
var MAX_FAILED_ATTEMPTS = 5;
var LOCKOUT_COOLDOWN = 15 * 60 * 1e3;
var verifySessionToken = (token) => {
  const session = sessions.get(token);
  if (!session) return false;
  if (session.expires < Date.now()) {
    sessions.delete(token);
    return false;
  }
  session.expires = Date.now() + SESSION_DURATION;
  return true;
};
var requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Session non valide ou expir\xE9e. Veuillez vous reconnecter." });
    return;
  }
  const token = authHeader.substring(7);
  if (!verifySessionToken(token)) {
    res.status(401).json({ error: "Session non valide ou expir\xE9e. Veuillez vous reconnecter." });
    return;
  }
  next();
};
app.post("/api/login", (req, res) => {
  const { password } = req.body;
  const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown";
  const attempts = loginAttempts.get(clientIp);
  if (attempts && attempts.lockUntil && attempts.lockUntil > Date.now()) {
    const minutesLeft = Math.ceil((attempts.lockUntil - Date.now()) / 6e4);
    res.status(429).json({
      success: false,
      error: `Trop de tentatives de connexion. Acc\xE8s bloqu\xE9. R\xE9essayez dans ${minutesLeft} minute(s).`
    });
    return;
  }
  if (password === ADMIN_PASSWORD) {
    loginAttempts.delete(clientIp);
    const token = crypto.randomBytes(32).toString("hex");
    sessions.set(token, { expires: Date.now() + SESSION_DURATION });
    res.json({ success: true, token });
  } else {
    const count = (attempts ? attempts.count : 0) + 1;
    if (count >= MAX_FAILED_ATTEMPTS) {
      loginAttempts.set(clientIp, { count, lockUntil: Date.now() + LOCKOUT_COOLDOWN });
      res.status(429).json({
        success: false,
        error: "Trop de tentatives infructueuses. Acc\xE8s bloqu\xE9 pendant 15 minutes."
      });
    } else {
      loginAttempts.set(clientIp, { count });
      res.status(400).json({
        success: false,
        error: `Code d\u2019acc\xE8s incorrect. Il vous reste ${MAX_FAILED_ATTEMPTS - count} tentative(s).`
      });
    }
  }
});
app.get("/api/verify-token", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    if (verifySessionToken(token)) {
      res.json({ success: true });
      return;
    }
  }
  res.status(401).json({ success: false });
});
app.get("/api/products", async (req, res) => {
  if (usePostgres && pool) {
    try {
      const result = await pool.query("SELECT * FROM products");
      const products = result.rows.map((row) => ({
        id: row.id,
        name: row.name,
        category: row.category,
        description: row.description,
        price: row.price,
        image: row.image,
        badge: row.badge || void 0,
        details: row.details
      }));
      res.json(products);
    } catch (err) {
      console.error("Failed to query products from Postgres:", err);
      res.status(500).json({ error: "Erreur lors de la r\xE9cup\xE9ration du catalogue." });
    }
  } else {
    res.json(getProducts());
  }
});
app.put("/api/products", requireAuth, async (req, res) => {
  const products = req.body;
  if (!Array.isArray(products)) {
    res.status(400).json({ error: "Format invalide. Liste attendue." });
    return;
  }
  if (usePostgres && pool) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query("TRUNCATE TABLE products");
      for (const p of products) {
        await client.query(
          "INSERT INTO products (id, name, category, description, price, image, badge, details) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
          [p.id, p.name, p.category, p.description, p.price, p.image, p.badge || null, p.details]
        );
      }
      await client.query("COMMIT");
      res.json({ success: true });
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("Failed to save products to Postgres:", err);
      res.status(500).json({ error: "Erreur lors de la sauvegarde du catalogue." });
    } finally {
      client.release();
    }
  } else {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
    res.json({ success: true });
  }
});
app.post("/api/upload", requireAuth, (req, res) => {
  const { fileName, data } = req.body;
  if (!fileName || !data) {
    res.status(400).json({ error: "Fichier ou donn\xE9es d'image manquants." });
    return;
  }
  const cleanName = path.basename(fileName).replace(/[^a-zA-Z0-9.-]/g, "_");
  const extension = path.extname(cleanName).toLowerCase();
  const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
  if (!allowedExtensions.includes(extension)) {
    res.status(400).json({
      error: "Extension de fichier non autoris\xE9e (uniquement JPG, PNG, WEBP, GIF)."
    });
    return;
  }
  const matches = data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    res.status(400).json({ error: "Format Base64 invalide." });
    return;
  }
  const mimeType = matches[1];
  if (!mimeType.startsWith("image/")) {
    res.status(400).json({ error: "Le fichier transmis doit \xEAtre une image." });
    return;
  }
  const fileBuffer = Buffer.from(matches[2], "base64");
  const uniqueFileName = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}${extension}`;
  const filePath = path.join(UPLOADS_DIR, uniqueFileName);
  try {
    fs.writeFileSync(filePath, fileBuffer);
    res.json({ url: `/uploads/${uniqueFileName}` });
  } catch (err) {
    console.error("Failed to save file:", err);
    res.status(500).json({ error: "Erreur lors de la sauvegarde du fichier image." });
  }
});
app.get("/api/orders", requireAuth, async (req, res) => {
  if (usePostgres && pool) {
    try {
      const result = await pool.query("SELECT * FROM orders ORDER BY date DESC");
      const ordersList = result.rows.map((row) => ({
        id: row.id,
        date: row.date,
        clientName: row.client_name,
        serviceTitle: row.service_title,
        fabricOption: row.fabric_option,
        details: row.details,
        status: row.status
      }));
      res.json(ordersList);
    } catch (err) {
      console.error("Failed to query orders from Postgres:", err);
      res.status(500).json({ error: "Erreur lors de la r\xE9cup\xE9ration des commandes." });
    }
  } else {
    res.json(getOrders());
  }
});
app.post("/api/orders", async (req, res) => {
  const { clientName, serviceTitle, fabricOption, details } = req.body;
  if (!clientName || !serviceTitle || !details) {
    res.status(400).json({ error: "Informations de commande manquantes." });
    return;
  }
  const id = `order-${Date.now()}`;
  const date = (/* @__PURE__ */ new Date()).toISOString();
  const status = "Nouveau";
  if (usePostgres && pool) {
    try {
      await pool.query(
        "INSERT INTO orders (id, date, client_name, service_title, fabric_option, details, status) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        [id, date, clientName, serviceTitle, fabricOption, details, status]
      );
      res.json({
        success: true,
        order: { id, date, clientName, serviceTitle, fabricOption, details, status }
      });
    } catch (err) {
      console.error("Failed to save order to Postgres:", err);
      res.status(500).json({ error: "Erreur lors de la sauvegarde de la commande." });
    }
  } else {
    const orders = getOrders();
    const newOrder = { id, date, clientName, serviceTitle, fabricOption, details, status };
    orders.unshift(newOrder);
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
    res.json({ success: true, order: newOrder });
  }
});
app.post("/api/orders/update-status", requireAuth, async (req, res) => {
  const { id, status } = req.body;
  if (!id || !status) {
    res.status(400).json({ error: "Param\xE8tres manquants." });
    return;
  }
  if (usePostgres && pool) {
    try {
      const result = await pool.query(
        "UPDATE orders SET status = $1 WHERE id = $2 RETURNING *",
        [status, id]
      );
      if (result.rows.length === 0) {
        res.status(404).json({ error: "Commande non trouv\xE9e." });
        return;
      }
      const row = result.rows[0];
      res.json({
        success: true,
        order: {
          id: row.id,
          date: row.date,
          clientName: row.client_name,
          serviceTitle: row.service_title,
          fabricOption: row.fabric_option,
          details: row.details,
          status: row.status
        }
      });
    } catch (err) {
      console.error("Failed to update order status in Postgres:", err);
      res.status(500).json({ error: "Erreur lors de la mise \xE0 jour." });
    }
  } else {
    const orders = getOrders();
    const orderIdx = orders.findIndex((o) => o.id === id);
    if (orderIdx === -1) {
      res.status(404).json({ error: "Commande non trouv\xE9e." });
      return;
    }
    orders[orderIdx].status = status;
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
    res.json({ success: true, order: orders[orderIdx] });
  }
});
app.delete("/api/orders/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  if (usePostgres && pool) {
    try {
      const result = await pool.query("DELETE FROM orders WHERE id = $1 RETURNING *", [id]);
      if (result.rows.length === 0) {
        res.status(404).json({ error: "Commande non trouv\xE9e." });
        return;
      }
      res.json({ success: true });
    } catch (err) {
      console.error("Failed to delete order from Postgres:", err);
      res.status(500).json({ error: "Erreur lors de la suppression." });
    }
  } else {
    const orders = getOrders();
    const filtered = orders.filter((o) => o.id !== id);
    if (orders.length === filtered.length) {
      res.status(404).json({ error: "Commande non trouv\xE9e." });
      return;
    }
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(filtered, null, 2));
    res.json({ success: true });
  }
});
app.use("/uploads", express.static(UPLOADS_DIR));
var isProd = process.env.NODE_ENV === "production" || fs.existsSync(path.join(__dirname, "dist")) && !process.argv.includes("--dev");
async function configureFrontend() {
  await initializeDatabase();
  if (!isProd) {
    console.log("Starting server in DEVELOPMENT mode with Vite middleware...");
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode...");
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}
configureFrontend().catch((err) => {
  console.error("Failed to start server:", err);
});
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
