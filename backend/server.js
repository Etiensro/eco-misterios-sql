const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Crear/conectar base de datos
const dbPath = path.join(__dirname, 'artefacto_juego.db');
const db = new sqlite3.Database(dbPath);

// Inicializar base de datos
function initializeDatabase() {
  // Tabla memorias_casa (Nivel 1)
  db.run(`CREATE TABLE IF NOT EXISTS memorias_casa (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_persona TEXT NOT NULL,
    tipo_registro TEXT NOT NULL,
    detalle TEXT NOT NULL
  )`);

  // Tabla ilusiones_xtabay (Nivel 2)  
  db.run(`CREATE TABLE IF NOT EXISTS ilusiones_xtabay (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    testimonio TEXT NOT NULL,
    verdadero BOOLEAN NOT NULL,
    detalle TEXT NOT NULL
  )`);

  // Tabla munecas_isla (Nivel 3)
  db.run(`CREATE TABLE IF NOT EXISTS munecas_isla (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_muneca TEXT NOT NULL,
    energia TEXT NOT NULL,
    descripcion TEXT NOT NULL
  )`);

  // Insertar datos iniciales
  insertInitialData();
}

function insertInitialData() {
  // Datos Nivel 1: La Casa de las Brujas
  const memoriasCasa = [
    { nombre_persona: "Don Alfredo", tipo_registro: "diario", detalle: "Maltrato físico a la niña" },
    { nombre_persona: "Doña Carmen", tipo_registro: "testimonio", detalle: "Escuchó llantos en la noche" },
    { nombre_persona: "María Elena", tipo_registro: "diario", detalle: "La niña tenía marcas extrañas" },
    { nombre_persona: "Padre José", tipo_registro: "confesión", detalle: "Don Alfredo confesó sus pecados" },
    { nombre_persona: "Dr. Morales", tipo_registro: "reporte", detalle: "Lesiones compatibles con abuso" },
    { nombre_persona: "Vecina Ana", tipo_registro: "testimonio", detalle: "Vio la casa embrujada después" }
  ];

  // Datos Nivel 2: La Xtabay
  const ilusionesXtabay = [
    { nombre_persona: "Juan Pérez", testimonio: false, detalle: "Fue seducido por la Xtabay" },
    { nombre_persona: "Carlos López", testimonio: true, detalle: "Logró resistir sus encantos" },
    { nombre_persona: "Miguel Torres", testimonio: false, detalle: "Perdió la razón por una noche" },
    { nombre_persona: "Antonio Ruiz", testimonio: true, detalle: "Reconoció las señales de peligro" },
    { nombre_persona: "Rafael Santos", testimonio: false, detalle: "Siguió la luz engañosa" },
    { nombre_persona: "David Moreno", testimonio: true, detalle: "Escapó antes del amanecer" }
  ];

  // Datos Nivel 3: Isla de las Muñecas
  const munecasIsla = [
    { nombre_muneca: "Rosalinda", energia: "oscura", descripcion: "Cabeza rota, mirada fija" },
    { nombre_muneca: "Esperanza", energia: "neutral", descripcion: "Vestido blanco, ojos cerrados" },
    { nombre_muneca: "Dolores", energia: "oscura", descripcion: "Brazos amputados, sonrisa siniestra" },
    { nombre_muneca: "Luz María", energia: "neutral", descripcion: "Cabello dorado, poses normal" },
    { nombre_muneca: "Carmen", energia: "oscura", descripcion: "Ojos rojos, vestido rasgado" },
    { nombre_muneca: "Ana Isabel", energia: "neutral", descripcion: "Muñeca de porcelana intacta" },
    { nombre_muneca: "Guadalupe", energia: "protectora", descripcion: "Aureola dorada, manos juntas" }
  ];

  // Verificar si ya existen datos
  db.get("SELECT COUNT(*) as count FROM memorias_casa", (err, row) => {
    if (err) {
      console.error('Error verificando datos:', err);
      return;
    }
    
    if (row.count === 0) {
      console.log('Insertando datos iniciales...');
      
      // Insertar memorias_casa
      memoriasCasa.forEach(memoria => {
        db.run(
          "INSERT INTO memorias_casa (nombre_persona, tipo_registro, detalle) VALUES (?, ?, ?)",
          [memoria.nombre_persona, memoria.tipo_registro, memoria.detalle]
        );
      });

      // Insertar ilusiones_xtabay
      ilusionesXtabay.forEach(ilusion => {
        db.run(
          "INSERT INTO ilusiones_xtabay (testimonio, verdadero, detalle) VALUES (?, ?, ?)",
          [ilusion.testimonio, ilusion.verdadero, ilusion.detalle]
        );
      });

      // Insertar munecas_isla
      munecasIsla.forEach(muneca => {
        db.run(
          "INSERT INTO munecas_isla (nombre_muneca, energia, descripcion) VALUES (?, ?, ?)",
          [muneca.nombre_muneca, muneca.energia, muneca.descripcion]
        );
      });

      console.log('Datos iniciales insertados correctamente.');
    }
  });
}

// Endpoint para ejecutar consultas SQL
app.post('/api/query', (req, res) => {
  const { query } = req.body;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'La consulta SQL es requerida'
    });
  }

  // Validar que solo sean consultas SELECT
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery.startsWith('select')) {
    return res.status(400).json({
      success: false,
      error: 'Solo se permiten consultas SELECT'
    });
  }

  // Ejecutar consulta
  db.all(query, (err, rows) => {
    if (err) {
      console.error('Error ejecutando consulta:', err);
      return res.status(400).json({
        success: false,
        error: `Error en la consulta SQL: ${err.message}`
      });
    }

    res.json({
      success: true,
      data: rows,
      message: `Consulta ejecutada exitosamente. ${rows.length} registro(s) encontrado(s).`
    });
  });
});

// Endpoint para validar consulta
app.post('/api/validate', (req, res) => {
  const { userQuery, expectedQuery } = req.body;

  if (!userQuery || !expectedQuery) {
    return res.status(400).json({
      success: false,
      error: 'Se requieren ambas consultas para validar'
    });
  }

  // Normalizar consultas para comparación
  const normalizeQuery = (query) => 
    query.toLowerCase()
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/;$/, '');

  const userNormalized = normalizeQuery(userQuery);
  const expectedNormalized = normalizeQuery(expectedQuery);

  // Permitir algunas variaciones
  const variations = [
    expectedNormalized,
    expectedNormalized.replace('count(*)', 'count(*)'),
    expectedNormalized.replace(' as total', ''),
    expectedNormalized.replace(' as cantidad', ''),
  ];

  const isValid = variations.some(variation => userNormalized === variation);

  res.json({
    success: true,
    isValid
  });
});

// Endpoint para obtener esquemas de tablas
app.get('/api/schema/:tableName', (req, res) => {
  const { tableName } = req.params;
  
  db.all(`PRAGMA table_info(${tableName})`, (err, columns) => {
    if (err) {
      return res.status(400).json({
        success: false,
        error: `Error obteniendo esquema de tabla: ${err.message}`
      });
    }

    res.json({
      success: true,
      tableName,
      columns: columns.map(col => ({
        name: col.name,
        type: col.type,
        notNull: col.notnull === 1,
        primaryKey: col.pk === 1
      }))
    });
  });
});

// Endpoint de salud
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Inicializar base de datos al iniciar el servidor
initializeDatabase();

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor ECO ejecutándose en puerto ${PORT}`);
  console.log(`Base de datos SQLite: ${dbPath}`);
});

// Manejo de cierre graceful
process.on('SIGINT', () => {
  console.log('\nCerrando servidor...');
  db.close((err) => {
    if (err) {
      console.error('Error cerrando base de datos:', err);
    } else {
      console.log('Base de datos cerrada correctamente.');
    }
    process.exit(0);
  });
});