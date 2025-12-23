import postgres from "postgres";

const config = {
  host: "127.0.0.1",
  user: "postgres",
  password: "",
  port: 5432,
};

// BEGIN (write your solution here)
export default async () => {
  // Подключаемся к базе данных postgres
  const sql = postgres({
    ...config,
    database: 'postgres',
  });

  try {
    // 1. Создаем таблицу articles
    await sql`
      CREATE TABLE IF NOT EXISTS articles (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description VARCHAR(255) NOT NULL
      )
    `;

    // 2. Добавляем как минимум одну запись
    await sql`
      INSERT INTO articles (title, description)
      VALUES ('First Article', 'This is the first article description')
      ON CONFLICT DO NOTHING
    `;

    console.log('✅ Таблица articles создана и данные добавлены');
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    throw error;
  } finally {
    await sql.end();
  }
};
// END
