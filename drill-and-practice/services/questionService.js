import { sql } from "../database/database.js";

const getQuestions = async (id) => {
  const rows = await sql`SELECT * FROM questions where topic_id = ${id}`;

  return rows;
};

const addQuestion = async (userID, topicID, text) => {
    await sql`INSERT INTO questions
        (user_id, topic_id, question_text)
          VALUES (${userID}, ${topicID}, ${text})`;
};

const getQuestion = async (questionID) => {
    const rows = await sql`SELECT * FROM questions where id = ${questionID}`;

    return rows;
};  

const deleteQuestion = async (id) => {
    await sql`DELETE FROM questions where id = ${id}`;
};

const randomQuestionWithTopic = async (topic_id) => {
    const rows = await sql`SELECT * FROM questions where topic_id = ${topic_id} ORDER by RANDOM() LIMIT 1`;

    return rows[0];
};  

const randomQuestion = async () => {
    const rows = await sql`SELECT * FROM questions ORDER by RANDOM() LIMIT 1`;

    return rows[0];
};  

const countQuestions = async () => {
    const rows = await sql`SELECT COUNT(*) FROM questions`;
    return rows[0].count;
};  

export {
    getQuestions,
    addQuestion,
    getQuestion,
    deleteQuestion,
    randomQuestionWithTopic,
    randomQuestion,
    countQuestions
};