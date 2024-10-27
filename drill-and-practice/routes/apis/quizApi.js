import * as questionService from "../../services/questionService.js";
import * as optionService from "../../services/optionService.js";

const randomQuiz = async ({ response }) => {
    const question = await questionService.randomQuestion();
    if(question == null)
    {
        response.body = {};
        return;
    }
    const answerOptions = await optionService.getAnswerOptions(question.id);
    const formattedAnswerOptions = answerOptions.map(option => ({
        optionId: option.id,
        optionText: option.option_text
    }));
    const data = {
        questionId: question.id,
        questionText: question.question_text,
        answerOptions: formattedAnswerOptions
    };

    response.body = data;
};


const answerQuiz = async ({ request, response }) => {
    const body = request.body({ type: "json" });
    const document = await body.value;
    const answerOption = await optionService.getAnswerOption(document.optionId);
    if(answerOption == null)
    {
        response.status = 200;
        return;
    }

    const data = {
        correct: answerOption.is_correct
    };

    response.body = data;
};


export { randomQuiz, answerQuiz };