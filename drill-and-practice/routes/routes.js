import { Router } from "../deps.js";
import * as mainController from "./controllers/mainController.js";
import * as topicController from "./controllers/topicController.js";
import * as questionController from "./controllers/questionController.js";
import * as registrationController from "./controllers/registrationController.js";
import * as loginController from "./controllers/loginController.js";
import * as quizController from "./controllers/quizController.js";
import * as quizApi from "./apis/quizApi.js";

const router = new Router();

router.get("/", mainController.showMain);

router.get("/topics", topicController.listTopics);
router.post("/topics", topicController.addTopic);
router.get("/topics/:id", topicController.showTopic);
router.post("/topics/:id/delete", topicController.deleteTopic);

router.post("/topics/:id/questions", questionController.addQuestion);
router.get("/topics/:id/questions/:qId", questionController.showQuestion);
router.post("/topics/:id/questions/:qId/options", questionController.addOption);
router.post("/topics/:tId/questions/:qId/options/:oId/delete", questionController.deleteOption);
router.post("/topics/:tId/questions/:qId/delete", questionController.deleteQuestion);

router.get("/quiz", quizController.listQuizes);
router.get("/quiz/:tId", quizController.randomQuiz);
router.get("/quiz/:tId/questions/:qId", quizController.showQuiz);
router.post("/quiz/:tId/questions/:qId/options/:oId", quizController.answerQuestion);
router.get("/quiz/:tId/questions/:qId/incorrect", quizController.incorrectAnswer);
router.get("/quiz/:tId/questions/:qId/correct", quizController.correctAnswer);

router.get("/api/questions/random", quizApi.randomQuiz);
router.post("/api/questions/answer", quizApi.answerQuiz);

router.get("/auth/register", registrationController.showRegistrationForm);
router.post("/auth/register", registrationController.registerUser);

router.get("/auth/login", loginController.showLoginForm);
router.post("/auth/login", loginController.processLogin);

export { router };
