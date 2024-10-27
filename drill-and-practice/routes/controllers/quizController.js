import * as topicService from "../../services/topicService.js";
import * as questionService from "../../services/questionService.js";
import * as optionService from "../../services/optionService.js";
import * as answerService from "../../services/answerService.js";

const listQuizes = async ({ render }) => {
    const currentTopics = await topicService.listTopics();
    currentTopics.sort((a, b) => a.name.localeCompare(b.name));
    render("quizes.eta", {topics: currentTopics, clickedEmptyQuiz: null});
};

const randomQuiz = async ({ response, params, render }) => {
    const question = await questionService.randomQuestionWithTopic(params.tId);
    if(question == null)
    {
        const currentTopics = await topicService.listTopics();
        render("quizes.eta", {topics: currentTopics, clickedEmptyQuiz: true});
        return;
    }
    response.redirect("/quiz/"+params.tId+"/questions/"+question.id);
};

const showQuiz = async ({ render, response, params }) => {
    const question = (await questionService.getQuestion(params.qId))[0];
    if(question == null)
    {
        response.redirect("/quiz/"+params.tId);
    }
    const options = (await optionService.getAnswerOptions(question.id));
    question.options = options;
    
    render("quiz.eta", question);
};

const answerQuestion = async ({ response, params, user }) => {
    await answerService.addAnswer(user.id, params.qId, params.oId);
    const answerOption = await optionService.getAnswerOption(params.oId);
    if(answerOption.is_correct)
    {
        response.redirect("/quiz/"+params.tId+"/questions/"+params.qId+"/correct");
    }else{
        response.redirect("/quiz/"+params.tId+"/questions/"+params.qId+"/incorrect");
    }
};

const incorrectAnswer= async ({ render, params }) => {
    const rightAnswer = await optionService.getRightAnswer(params.qId);
    render("answer.eta", {correct: false, topic_id: params.tId, correct_option: rightAnswer.option_text});
};

const correctAnswer= async ({ render, params }) => {
    render("answer.eta", {correct: true, topic_id: params.tId});
};


export {listQuizes, randomQuiz, showQuiz, answerQuestion, incorrectAnswer, correctAnswer};