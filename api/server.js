const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

const pool = new Pool({
  host: process.env.DB_HOST || 'db',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'ci_user',
  password: process.env.DB_PASSWORD || 'ci_password',
  database: process.env.DB_NAME || 'ci_demo_db',
});

async function initDb(retries = 15) {
  for (let i = 1; i <= retries; i++) {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS mensajes (
          id SERIAL PRIMARY KEY,
          contenido TEXT NOT NULL,
          creado_en TIMESTAMP DEFAULT NOW()
        );
      `);
      await pool.query(
        `INSERT INTO mensajes (contenido) VALUES ($1)`,
        [`Contenedor API conectado correctamente a PostgreSQL - intento ${i}`]
      );
      console.log(`[API] Conexion a PostgreSQL establecida correctamente (intento ${i}).`);
      console.log('[API] Los dos contenedores (api y db) estan comunicados entre si.');
      return;
    } catch (err) {
      console.log(`[API] Intento ${i}/${retries}: esperando a que el contenedor de PostgreSQL este listo... (${err.message})`);
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
  console.error('[API] No fue posible conectar a la base de datos tras varios intentos.');
}

app.get('/', (req, res) => {
  res.json({ mensaje: 'API de demostracion - Proyecto Integracion Continua', entregable: 'Semana 3 - GitHub + Docker' });
});

app.get('/status', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*)::int AS total FROM mensajes');
    const ultimo = await pool.query('SELECT contenido, creado_en FROM mensajes ORDER BY id DESC LIMIT 1');
    res.json({
      estado: 'ok',
      contenedor_api: 'api',
      contenedor_bd: 'db',
      comunicacion: 'exitosa',
      total_registros: result.rows[0].total,
      ultimo_mensaje: ultimo.rows[0],
    });
  } catch (err) {
    res.status(500).json({ estado: 'error', detalle: err.message });
  }
});

app.listen(port, () => {
  console.log(`[API] Servidor escuchando en el puerto ${port}`);
  initDb();
});
