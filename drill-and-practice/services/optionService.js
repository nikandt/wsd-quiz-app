import { sql } from "../database/database.js";

const getAnswerOptions = async (question_id) => {
  const rows = await sql`SELECT * FROM question_answer_options where question_id = ${question_id}`;

  return rows;
};

const getAnswerOption = async (id) => {
    const row = (await sql`SELECT * FROM question_answer_options where id = ${id}`)[0];
  
    return row;
};

const getRightAnswer = async (question_id) => {
    const row = (await sql`SELECT * FROM question_answer_options
    WHERE question_id = ${question_id} AND is_correct = TRUE;`)[0];
  
    return row;
};

const addAnswerOption = async (question_id, option_text, is_correct) => {
    await sql`INSERT INTO question_answer_options
        (question_id, option_text, is_correct)
          VALUES (${question_id}, ${option_text}, ${is_correct})`;
};

const deleteAnswerOption = async (id) => {
    await sql`DELETE FROM question_answer_options where id = ${id}`;
};


export {
    getAnswerOptions,
    addAnswerOption,
    deleteAnswerOption,
    getAnswerOption,
    getRightAnswer
};