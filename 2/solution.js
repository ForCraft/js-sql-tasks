import postgres from "postgres";

const config = {
  host: "127.0.0.1",
  user: "postgres",
  password: "",
  port: 5432,
};

// BEGIN (write your solution here)
export default async (articles) => {
  const sql = postgres(config);

  try {
    // 1. Создаем таблицу если её нет
    await sql`
      CREATE TABLE IF NOT EXISTS articles (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        description VARCHAR(255)
      )
    `;

    // 2. Если нет данных для вставки
    if (!articles || articles.length === 0) {
      await sql.end();
      return [];
    }

    // 3. ВАЖНО: Используем плейсхолдеры для защиты от SQL injection
    const ids = [];
    
    for (const article of articles) {
      // ПРАВИЛЬНО: Используем плейсхолдеры ${}
      const result = await sql`
        INSERT INTO articles (title, description)
        VALUES (${article.title}, ${article.description})
        RETURNING id
      `;
      ids.push(result[0].id);
    }

    await sql.end();
    return ids;

  } catch (error) {
    await sql.end();
    console.error('Error:', error.message);
    throw error;
  }
};
// END
