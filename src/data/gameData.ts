// gameData.ts
import { runQuery } from "@/utils/apiClient";

export interface DatabaseRecord {
  [key: string]: any;
}

export interface GameDatabase {
  [tableName: string]: DatabaseRecord[];
}

// Funciones para obtener datos de la BD
export async function loadMemoriasCasa(): Promise<DatabaseRecord[]> {
  const res = await runQuery("SELECT * FROM memorias_casa");
  return res.success ? res.data || [] : [];
}

export async function loadIlusionesXtabay(): Promise<DatabaseRecord[]> {
  const res = await runQuery("SELECT * FROM ilusiones_xtabay");
  return res.success ? res.data || [] : [];
}

export async function loadMunecasIsla(): Promise<DatabaseRecord[]> {
  const res = await runQuery("SELECT * FROM munecas_isla");
  return res.success ? res.data || [] : [];
}

// Base de datos completa (cargada dinámicamente)
export async function getGameDatabase(): Promise<GameDatabase> {
  const [memoriasCasa, ilusionesXtabay, munecasIsla] = await Promise.all([
    loadMemoriasCasa(),
    loadIlusionesXtabay(),
    loadMunecasIsla(),
  ]);

  return {
    memorias_casa: memoriasCasa,
    ilusiones_xtabay: ilusionesXtabay,
    munecas_isla: munecasIsla,
  };
}

// Definición de niveles y retos
export interface Challenge {
  id: number;
  title: string;
  description: string;
  expectedQuery: string;
  hints: string[];
  table: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Level {
  id: number;
  name: string;
  scenario: string;
  description: string;
  challenges: Challenge[];
  videos: {
    intro: string;
    between: string;
    outro: string;
  };
  scenarioImage: string;
}

// ⚡ gameLevels se mantiene igual, solo que la data ahora viene de getGameDatabase()
export const gameLevels: Level[] = [
  {
    id: 1,
    name: "La Casa de las Brujas",
    scenario: "Una vieja casa colonial donde ocurrieron eventos traumáticos...",
    description: "Investiga los registros de la casa para descubrir la verdad sobre lo que pasó con la niña.",
    videos: {
      intro: "/videos/casa_brujas_intro.mp4",
      between: "/videos/casa_brujas_between.mp4",
      outro: "/videos/casa_brujas_outro.mp4"
    },
    scenarioImage: "/images/casa_brujas.jpg",
    challenges: [
      {
        id: 1,
        title: "Primeras Pistas",
        description: "Muestra todos los registros de la tabla memorias_casa para comenzar la investigación.",
        expectedQuery: "SELECT * FROM memorias_casa",
        hints: [
          "Usa SELECT para obtener datos de una tabla",
          "El asterisco (*) significa 'todas las columnas'"
        ],
        table: "memorias_casa",
        difficulty: 'easy'
      },
      {
        id: 2,
        title: "Organizando las Evidencias",
        description: "Ordena los registros por nombre de persona alfabéticamente para organizar las evidencias.",
        expectedQuery: "SELECT * FROM memorias_casa ORDER BY nombre_persona",
        hints: [
          "Usa ORDER BY para ordenar los resultados",
          "Especifica la columna por la cual quieres ordenar"
        ],
        table: "memorias_casa",
        difficulty: 'easy'
      }
    ]
  },
  {
    id: 2,
    name: "La Xtabay",
    scenario: "En los bosques de Yucatán, una entidad seduce a los viajeros...",
    description: "Analiza los testimonios para distinguir entre víctimas y sobrevivientes de la Xtabay.",
    videos: {
      intro: "/videos/xtabay_intro.mp4",
      between: "/videos/xtabay_between.mp4",
      outro: "/videos/xtabay_outro.mp4"
    },
    scenarioImage: "/images/xtabay.jpg",
    challenges: [
      {
        id: 3,
        title: "Testimonios Verdaderos",
        description: "Encuentra solo los testimonios verdaderos de quienes resistieron a la Xtabay.",
        expectedQuery: 'SELECT * FROM ilusiones_xtabay WHERE testimonio = "true"',
        hints: [
          "Usa WHERE para filtrar registros",
          "El valor booleano 'true' indica testimonios verdaderos"
        ],
        table: "ilusiones_xtabay",
        difficulty: 'medium'
      },
      {
        id: 4,
        title: "Contando Víctimas",
        description: "Agrupa los testimonios por su veracidad y cuenta cuántos hay de cada tipo.",
        expectedQuery: "SELECT testimonio, COUNT(*) as total FROM ilusiones_xtabay GROUP BY testimonio",
        hints: [
          "Usa GROUP BY para agrupar registros",
          "COUNT(*) cuenta el número de registros en cada grupo"
        ],
        table: "ilusiones_xtabay",
        difficulty: 'medium'
      }
    ]
  },
  {
    id: 3,
    name: "Isla de las Muñecas",
    scenario: "Una isla misteriosa llena de muñecas colgadas de los árboles...",
    description: "Investiga las energías de las muñecas para encontrar la protección contra las fuerzas oscuras.",
    videos: {
      intro: "/videos/isla_munecas_intro.mp4",
      between: "/videos/isla_munecas_between.mp4",
      outro: "/videos/isla_munecas_outro.mp4"
    },
    scenarioImage: "/images/isla_munecas.jpg",
    challenges: [
      {
        id: 5,
        title: "Energías Malignas",
        description: "Encuentra grupos de muñecas por tipo de energía que tengan más de 1 muñeca.",
        expectedQuery: "SELECT energia, COUNT(*) as cantidad FROM munecas_isla GROUP BY energia HAVING COUNT(*) > 1",
        hints: [
          "Usa HAVING para filtrar grupos después de GROUP BY",
          "HAVING funciona con funciones agregadas como COUNT()"
        ],
        table: "munecas_isla",
        difficulty: 'hard'
      },
      {
        id: 6,
        title: "La Protectora",
        description: "Encuentra la muñeca protectora y combínala con sus características usando una consulta compleja.",
        expectedQuery: "SELECT m1.nombre_muneca, m1.energia, m1.descripcion FROM munecas_isla m1 INNER JOIN (SELECT energia FROM munecas_isla WHERE energia = 'protectora') m2 ON m1.energia = m2.energia",
        hints: [
          "Usa INNER JOIN para combinar tablas",
          "Puedes hacer un JOIN de una tabla consigo misma usando alias"
        ],
        table: "munecas_isla",
        difficulty: 'hard'
      }
    ]
  }
];

// Video final
export const finalGameVideo = "/videos/final_game.mp4";

// Configuración de dificultades
export const difficultySettings = {
  easy: { timeLimit: 600000, name: "Fácil" }, // 10 minutos
  medium: { timeLimit: 300000, name: "Medio" }, // 5 minutos
  hard: { timeLimit: 180000, name: "Difícil" } // 3 minutos
};
