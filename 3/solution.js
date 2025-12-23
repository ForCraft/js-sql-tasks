import postgres from "postgres";

const config = {
  host: "127.0.0.1",
  user: "postgres",
  password: "",
  port: 5432,
};

export default async (book) => {
  // BEGIN (write your solution here)
  const pool = postgres({
    ...config,
    // Не указываем конкретную базу - тест сам подключится к нужной
  });

  // Вставляем данные с использованием плейсхолдеров для безопасности
  const query = pool`
    INSERT INTO books (title, author) 
    VALUES (${book.title}, ${book.author})
    RETURNING title, author
  `;

  const result = await query;
  
  // Закрываем пул
  await pool.end();
  
  return result[0];
  // END
};
