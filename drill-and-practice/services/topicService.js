import { sql } from "../database/database.js";

const addTopic = async (userId, name) => {
  await sql`INSERT INTO topics
      (user_id, name)
        VALUES (${userId}, ${name})
        ON CONFLICT (name)
        DO NOTHING;`;
};

const listTopics = async () => {
  const rows = await sql`SELECT * FROM topics ORDER BY name ASC;`;

  return rows;
};

const deleteTopic = async (id) => {
    await sql`DELETE FROM topics where id = ${id}`;
}

export {
    addTopic,
    listTopics,
    deleteTopic,
};