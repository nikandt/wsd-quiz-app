import { sql } from "../database/database.js";

const addUser = async (email, password) => {
  await sql`INSERT INTO users
      (email, password)
        VALUES (${email}, ${password})`;
};

const findUserByEmail = async (email) => {
    const rows = await sql`SELECT * FROM users WHERE email = ${email}`;
    return rows;
  };

  const resetDataBase = async (email) => {
    await sql`TRUNCATE TABLE question_answers, question_answer_options, questions, topics, users CASCADE;`;
  
    await sql`INSERT INTO users (email, password, admin) VALUES ('admin@admin.com','$2a$10$IML8QCf6xA.alRbW.CG5PuvYc3Qs94vJvoTwbsSehs8s515cUMuZa', true);`;
    await sql`INSERT INTO topics (user_id, name) VALUES ((SELECT id FROM users WHERE email = 'admin@admin.com'), 'Finnish language');`;

  };

  export { addUser, findUserByEmail, resetDataBase };
 