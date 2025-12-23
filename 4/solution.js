import postgres from "postgres";

const config = {
  host: "127.0.0.1",
  user: "postgres",
  password: "",
  port: 5432,
};

// BEGIN (write your solution here)
export default async (user, roomNumber, price) => {
  // Создаем подключение
  const sql = postgres(config);
  
  try {
    // Используем встроенную поддержку транзакций через sql.begin()
    await sql.begin(async (transaction) => {
      // 1. Добавляем пользователя
      const [userRow] = await transaction`
        INSERT INTO users (username, phone)
        VALUES (${user.username}, ${user.phone})
        RETURNING id
      `;
      
      // 2. Находим комнату по номеру
      const [roomRow] = await transaction`
        SELECT id FROM rooms WHERE room_number = ${roomNumber}
      `;
      
      // 3. Создаем заказ
      await transaction`
        INSERT INTO orders (user_id, room_id, price)
        VALUES (${userRow.id}, ${roomRow.id}, ${price})
      `;
      
      // 4. Обновляем статус комнаты
      await transaction`
        UPDATE rooms 
        SET status = 'reserved'
        WHERE id = ${roomRow.id}
      `;
    });
    // Если дошли сюда - транзакция успешно закоммичена
    
  } catch (error) {
    // При ошибке внутри sql.begin() транзакция автоматически откатывается
    throw error; // Выбрасываем ошибку как требуется
  } finally {
    // Закрываем подключение
    await sql.end();
  }
};
// END
