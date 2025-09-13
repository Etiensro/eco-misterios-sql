# Backend ECO Game

Backend en Node.js con SQLite para el juego educativo ECO.

## Instalación

```bash
cd backend
npm install
```

## Uso

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm start
```

El servidor se ejecutará en el puerto 3001 por defecto.

## Endpoints

### POST /api/query
Ejecuta una consulta SQL SELECT.
```json
{
  "query": "SELECT * FROM memorias_casa"
}
```

### POST /api/validate  
Valida si una consulta del usuario coincide con la esperada.
```json
{
  "userQuery": "SELECT * FROM memorias_casa",
  "expectedQuery": "SELECT * FROM memorias_casa"
}
```

### GET /api/schema/:tableName
Obtiene el esquema de una tabla específica.

### GET /api/health
Endpoint de estado del servidor.

## Base de Datos

Se crea automáticamente `artefacto_juego.db` con las siguientes tablas:

- **memorias_casa**: Registros del Nivel 1 (Casa de las Brujas)
- **ilusiones_xtabay**: Testimonios del Nivel 2 (La Xtabay)  
- **munecas_isla**: Muñecas del Nivel 3 (Isla de las Muñecas)

Los datos iniciales se insertan automáticamente al iniciar el servidor.