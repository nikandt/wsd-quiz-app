import * as questionService from "../../services/questionService.js";
import * as optionService from "../../services/optionService.js";
import { validasaur } from "../../deps.js";

const questionValidationRules = {
    question_text: [validasaur.required, validasaur.minLength(1)]
};

const optionValidationRules = {
    option_text: [validasaur.required, validasaur.minLength(1)],
    is_correct: [validasaur.required],
};

const getQuestionData = async (request) => {
    const body = request.body({ type: "form" });
    const params = await body.value;
    return {
        question_text: params.get("question_text"),
    };
};

const getOptionData = async (request) => {
    const body = request.body({ type: "form" });
    const params = await body.value;
    return {
        option_text: params.get("option_text"),
        is_correct: params.has("is_correct"),
    };
};

const addQuestion = async ({response, request, render, user, params }) =>{
    const data = await getQuestionData(request);
    const [passes, errors] = await validasaur.validate(
        data,
        questionValidationRules
      );  

    if (!passes) {
        data.user = user;
        data.errors = errors;
        data.id = params.id;
        data.questions = await questionService.getQuestions(params.id);
        render("topic.eta", data);
    } else {
        await questionService.addQuestion(user.id, params.id, data.question_text);
        response.redirect("/topics/"+params.id);
    }
};

const addOption = async ({response, request, render, params }) =>{
    const data = await getOptionData(request);
    const [passes, errors] = await validasaur.validate(
        data,
        optionValidationRules
      );  
      
    if (!passes) {
        const question = (await questionService.getQuestion(params.qId))[0];
        question.answer_text = data.option_text;
        question.answerOptions = await optionService.getAnswerOptions(params.qId);
        question.errors = errors;
        render("question.eta", question);
    } else {
        await optionService.addAnswerOption(params.qId, data.option_text, data.is_correct);
        response.redirect("/topics/"+params.id+"/questions/"+params.qId);
    }
};

const showQuestion = async ({ params, render }) => {
    const questions = await questionService.getQuestion(params.qId);
    const answerOptions = await optionService.getAnswerOptions(params.qId);
    const question = questions[0];
    question.answer_text = "";
    question.answerOptions = answerOptions;
    render("question.eta", question);
};

const deleteOption = async({params, response}) => {
    await optionService.deleteAnswerOption(params.oId);
    response.redirect("/topics/"+params.tId+"/questions/"+params.qId);
};

const deleteQuestion = async({params, response, user}) => {
    await questionService.deleteQuestion(params.qId);
    response.redirect("/topics/"+params.tId);
};
  
export { addQuestion, showQuestion, addOption, deleteOption, deleteQuestion};
