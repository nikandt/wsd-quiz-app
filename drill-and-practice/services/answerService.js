import { sql } from "../database/database.js";


const addAnswer = async (user_id, question_id, question_answer_id) => {
    await sql`INSERT INTO question_answers
        (user_id, question_id, question_answer_option_id)
          VALUES (${user_id}, ${question_id}, ${question_answer_id})`;
};

const countAnswers = async () => {
    const rows = await sql`SELECT COUNT(*) FROM question_answers`;
    return rows[0].count;
};  

export {
    addAnswer,
    countAnswers
};