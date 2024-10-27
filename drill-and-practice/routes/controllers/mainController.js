import * as userService from "../../services/userService.js";
import * as questionService from "../../services/questionService.js";
import * as answerService from "../../services/answerService.js";


const showMain = async ({ render }) => {
  const countQuestions = await questionService.countQuestions();
  const countAnswers = await answerService.countAnswers();
  render("main.eta", {countAnswers: countAnswers, countQuestions: countQuestions});
};

export { showMain };
 