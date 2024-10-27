import * as topicService from "../../services/topicService.js";
import * as questionService from "../../services/questionService.js";

import { validasaur } from "../../deps.js";

const topicValidationRules = {
  name: [validasaur.required, validasaur.minLength(1)]
};


const listTopics = async ({ render, user }) => {
    render("topics.eta", {
      topics: await topicService.listTopics(), user: user, name: ""
    });
};

const getTopicData = async (request) => {
    const body = request.body({ type: "form" });
    const params = await body.value;
    return {
        name: params.get("name"),
    };
};


const addTopic = async ({response, request, render, user }) =>{
    if(!user.admin)
    {
        response.status = 401;
        return;
    }
    const data = await getTopicData(request);
    const [passes, errors] = await validasaur.validate(
        data,
        topicValidationRules
      );  

    if (!passes) {
        data.user = user;
        data.errors = errors;
        data.topics = await topicService.listTopics();
        render("topics.eta", data);
    } else {
        await topicService.addTopic(user.id, data.name);
        response.redirect("/topics");
    }
};

const deleteTopic = async({params, response, user}) => {
    if(!user.admin)
    {
        response.status = 401;
        return;
    }
    await topicService.deleteTopic(params.id);
    response.redirect("/topics");
};
  

const showTopic = async ({ params, render }) => {
    render("topic.eta", {
      questions: await questionService.getQuestions(params.id), question_text: "", id: params.id
    });
};


export { listTopics, addTopic, deleteTopic, showTopic };
