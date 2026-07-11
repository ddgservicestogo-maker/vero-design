import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import crypto from 'crypto';
import pg from 'pg';
import { fileURLToPath } from 'url';
import { PRODUCTS_LIST } from './src/data';
import { Product } from './src/types';

dotenv.config();

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Enable JSON body parser with a high limit for Base64 image uploads
app.use(express.json({ limit: '10mb' }));

// Directories setup
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// PostgreSQL Connection Pool (if DATABASE_URL is defined)
const usePostgres = !!process.env.DATABASE_URL;
let pool: pg.Pool | null = null;

if (usePostgres) {
  console.log('PostgreSQL database URL detected. Initializing connection pool...');
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false // Required for Neon serverless PostgreSQL connection
    }
  });
} else {
  console.log('No DATABASE_URL found. Running in local JSON-file mode.');
}

// Helper to initialize products in JSON mode
function getProducts(): Product[] {
  if (fs.existsSync(PRODUCTS_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf-8'));
    } catch (e) {
      console.error('Error reading products file, falling back to default list', e);
    }
  }
  // Initialize with defaults if empty/non-existent
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(PRODUCTS_LIST, null, 2));
  return PRODUCTS_LIST;
}

// Helper to read orders in JSON mode
interface Order {
  id: string;
  date: string;
  clientName: string;
  serviceTitle: string;
  fabricOption: 'client' | 'vero';
  details: string;
  status: 'Nouveau' | 'En cours' | 'Terminé' | 'Archivé';
}

function getOrders(): Order[] {
  if (fs.existsSync(ORDERS_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf-8'));
    } catch (e) {
      console.error('Error reading orders file', e);
    }
  }
  return [];
}

// PostgreSQL Schema Initialization
async function initializeDatabase() {
  if (!usePostgres || !pool) return;
  
  try {
    // 1. Create products table
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
    
    // 2. Create orders table
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
    
    console.log('PostgreSQL tables verified.');

    // 3. Seed default products if table is empty
    const checkProducts = await pool.query('SELECT COUNT(*) FROM products');
    if (parseInt(checkProducts.rows[0].count, 10) === 0) {
      console.log('Products table is empty. Seeding default products...');
      for (const p of PRODUCTS_LIST) {
        await pool.query(
          'INSERT INTO products (id, name, category, description, price, image, badge, details) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
          [p.id, p.name, p.category, p.description, p.price, p.image, p.badge || null, p.details]
        );
      }
      console.log('Default products seeded successfully.');
    }
  } catch (err) {
    console.error('Failed to initialize PostgreSQL database:', err);
  }
}

// Authentication & Session management
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'vero2026';

// Session tracking with 2 hours inactivity expiration
const sessions = new Map<string, { expires: number }>();
const SESSION_DURATION = 2 * 60 * 60 * 1000; 

// Brute Force protection for login attempts
const loginAttempts = new Map<string, { count: number; lockUntil?: number }>();
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_COOLDOWN = 15 * 60 * 1000; // 15 minutes lockout

const verifySessionToken = (token: string): boolean => {
  const session = sessions.get(token);
  if (!session) return false;
  if (session.expires < Date.now()) {
    sessions.delete(token); // clear expired session
    return false;
  }
  // Sliding window: renew session duration on activity
  session.expires = Date.now() + SESSION_DURATION;
  return true;
};

// Auth middleware
const requireAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Session non valide ou expirée. Veuillez vous reconnecter.' });
    return;
  }
  const token = authHeader.substring(7);
  if (!verifySessionToken(token)) {
    res.status(401).json({ error: 'Session non valide ou expirée. Veuillez vous reconnecter.' });
    return;
  }
  next();
};

// API Endpoints

// 1. Authenticate / Login (With rate limiting protection)
app.post('/api/login', (req, res) => {
  const { password } = req.body;
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';

  // Check lockout status
  const attempts = loginAttempts.get(clientIp);
  if (attempts && attempts.lockUntil && attempts.lockUntil > Date.now()) {
    const minutesLeft = Math.ceil((attempts.lockUntil - Date.now()) / 60000);
    res.status(429).json({ 
      success: false, 
      error: `Trop de tentatives de connexion. Accès bloqué. Réessayez dans ${minutesLeft} minute(s).` 
    });
    return;
  }

  if (password === ADMIN_PASSWORD) {
    // Reset login attempts count on success
    loginAttempts.delete(clientIp);

    // Generate secure dynamic token
    const token = crypto.randomBytes(32).toString('hex');
    sessions.set(token, { expires: Date.now() + SESSION_DURATION });
    res.json({ success: true, token });
  } else {
    // Log failed attempt
    const count = (attempts ? attempts.count : 0) + 1;
    if (count >= MAX_FAILED_ATTEMPTS) {
      loginAttempts.set(clientIp, { count, lockUntil: Date.now() + LOCKOUT_COOLDOWN });
      res.status(429).json({ 
        success: false, 
        error: 'Trop de tentatives infructueuses. Accès bloqué pendant 15 minutes.' 
      });
    } else {
      loginAttempts.set(clientIp, { count });
      res.status(400).json({ 
        success: false, 
        error: `Code d’accès incorrect. Il vous reste ${MAX_FAILED_ATTEMPTS - count} tentative(s).` 
      });
    }
  }
});

// 2. Verify Session Token
app.get('/api/verify-token', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    if (verifySessionToken(token)) {
      res.json({ success: true });
      return;
    }
  }
  res.status(401).json({ success: false });
});

// 3. Fetch Products
app.get('/api/products', async (req, res) => {
  if (usePostgres && pool) {
    try {
      const result = await pool.query('SELECT * FROM products');
      const products: Product[] = result.rows.map(row => ({
        id: row.id,
        name: row.name,
        category: row.category,
        description: row.description,
        price: row.price,
        image: row.image,
        badge: row.badge || undefined,
        details: row.details
      }));
      res.json(products);
    } catch (err) {
      console.error('Failed to query products from Postgres:', err);
      res.status(500).json({ error: 'Erreur lors de la récupération du catalogue.' });
    }
  } else {
    res.json(getProducts());
  }
});

// 4. Save Products Array (updates/overwrites whole list)
app.put('/api/products', requireAuth, async (req, res) => {
  const products: Product[] = req.body;
  if (!Array.isArray(products)) {
    res.status(400).json({ error: 'Format invalide. Liste attendue.' });
    return;
  }
  
  if (usePostgres && pool) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('TRUNCATE TABLE products');
      for (const p of products) {
        await client.query(
          'INSERT INTO products (id, name, category, description, price, image, badge, details) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
          [p.id, p.name, p.category, p.description, p.price, p.image, p.badge || null, p.details]
        );
      }
      await client.query('COMMIT');
      res.json({ success: true });
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('Failed to save products to Postgres:', err);
      res.status(500).json({ error: 'Erreur lors de la sauvegarde du catalogue.' });
    } finally {
      client.release();
    }
  } else {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
    res.json({ success: true });
  }
});

// 5. Image Upload (Decodes Base64 payloads with safety audits)
app.post('/api/upload', requireAuth, (req, res) => {
  const { fileName, data } = req.body;
  if (!fileName || !data) {
    res.status(400).json({ error: 'Fichier ou données d\'image manquants.' });
    return;
  }

  // Sanitize filename to prevent directory traversal
  const cleanName = path.basename(fileName).replace(/[^a-zA-Z0-9.-]/g, '_');
  
  // Enforce strict file extension allowlist
  const extension = path.extname(cleanName).toLowerCase();
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
  if (!allowedExtensions.includes(extension)) {
    res.status(400).json({ 
      error: 'Extension de fichier non autorisée (uniquement JPG, PNG, WEBP, GIF).' 
    });
    return;
  }

  // Parse Base64 data
  const matches = data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    res.status(400).json({ error: 'Format Base64 invalide.' });
    return;
  }

  // Restrict MIME type to images only
  const mimeType = matches[1];
  if (!mimeType.startsWith('image/')) {
    res.status(400).json({ error: 'Le fichier transmis doit être une image.' });
    return;
  }

  const fileBuffer = Buffer.from(matches[2], 'base64');
  const uniqueFileName = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${extension}`;
  const filePath = path.join(UPLOADS_DIR, uniqueFileName);

  try {
    fs.writeFileSync(filePath, fileBuffer);
    res.json({ url: `/uploads/${uniqueFileName}` });
  } catch (err) {
    console.error('Failed to save file:', err);
    res.status(500).json({ error: 'Erreur lors de la sauvegarde du fichier image.' });
  }
});

// 6. Get Orders
app.get('/api/orders', requireAuth, async (req, res) => {
  if (usePostgres && pool) {
    try {
      const result = await pool.query('SELECT * FROM orders ORDER BY date DESC');
      const ordersList = result.rows.map(row => ({
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
      console.error('Failed to query orders from Postgres:', err);
      res.status(500).json({ error: 'Erreur lors de la récupération des commandes.' });
    }
  } else {
    res.json(getOrders());
  }
});

// 7. Submit Custom Order (Public)
app.post('/api/orders', async (req, res) => {
  const { clientName, serviceTitle, fabricOption, details } = req.body;
  if (!clientName || !serviceTitle || !details) {
    res.status(400).json({ error: 'Informations de commande manquantes.' });
    return;
  }

  const id = `order-${Date.now()}`;
  const date = new Date().toISOString();
  const status = 'Nouveau' as const;

  if (usePostgres && pool) {
    try {
      await pool.query(
        'INSERT INTO orders (id, date, client_name, service_title, fabric_option, details, status) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [id, date, clientName, serviceTitle, fabricOption, details, status]
      );
      res.json({ 
        success: true, 
        order: { id, date, clientName, serviceTitle, fabricOption, details, status } 
      });
    } catch (err) {
      console.error('Failed to save order to Postgres:', err);
      res.status(500).json({ error: 'Erreur lors de la sauvegarde de la commande.' });
    }
  } else {
    const orders = getOrders();
    const newOrder = { id, date, clientName, serviceTitle, fabricOption, details, status };
    orders.unshift(newOrder);
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
    res.json({ success: true, order: newOrder });
  }
});

// 8. Update Order Status
app.post('/api/orders/update-status', requireAuth, async (req, res) => {
  const { id, status } = req.body;
  if (!id || !status) {
    res.status(400).json({ error: 'Paramètres manquants.' });
    return;
  }

  if (usePostgres && pool) {
    try {
      const result = await pool.query(
        'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
        [status, id]
      );
      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Commande non trouvée.' });
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
      console.error('Failed to update order status in Postgres:', err);
      res.status(500).json({ error: 'Erreur lors de la mise à jour.' });
    }
  } else {
    const orders = getOrders();
    const orderIdx = orders.findIndex(o => o.id === id);
    if (orderIdx === -1) {
      res.status(404).json({ error: 'Commande non trouvée.' });
      return;
    }

    orders[orderIdx].status = status;
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
    res.json({ success: true, order: orders[orderIdx] });
  }
});

// 9. Delete/Archive Order
app.delete('/api/orders/:id', requireAuth, async (req, res) => {
  const { id } = req.params;

  if (usePostgres && pool) {
    try {
      const result = await pool.query('DELETE FROM orders WHERE id = $1 RETURNING *', [id]);
      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Commande non trouvée.' });
        return;
      }
      res.json({ success: true });
    } catch (err) {
      console.error('Failed to delete order from Postgres:', err);
      res.status(500).json({ error: 'Erreur lors de la suppression.' });
    }
  } else {
    const orders = getOrders();
    const filtered = orders.filter(o => o.id !== id);
    
    if (orders.length === filtered.length) {
      res.status(404).json({ error: 'Commande non trouvée.' });
      return;
    }

    fs.writeFileSync(ORDERS_FILE, JSON.stringify(filtered, null, 2));
    res.json({ success: true });
  }
});

// Serve uploads folder statically
app.use('/uploads', express.static(UPLOADS_DIR));

// Integrate Frontend
const isProd = process.env.NODE_ENV === 'production' || (fs.existsSync(path.join(__dirname, 'dist')) && !process.argv.includes('--dev'));

async function configureFrontend() {
  // Initialize Database schema (PostgreSQL mode only)
  await initializeDatabase();

  if (!isProd) {
    // Development mode: Vite dev server middleware
    console.log('Starting server in DEVELOPMENT mode with Vite middleware...');
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // Production mode: serve static files
    console.log('Starting server in PRODUCTION mode...');
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}

configureFrontend().catch((err) => {
  console.error('Failed to start server:', err);
});
