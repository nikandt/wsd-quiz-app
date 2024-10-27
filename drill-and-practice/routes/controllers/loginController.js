import * as userService from "../../services/userService.js";
import { bcrypt } from "../../deps.js";

const processLogin = async ({ request, response, state, render }) => {
  const body = request.body({ type: "form" });
  const params = await body.value;
  const email = params.get("email");
  const password = params.get("password");
  const userFromDatabase = await userService.findUserByEmail(email);
  if (userFromDatabase.length != 1) {
    render("login.eta", {email: email ,errors: { email: { notFound: "This email has not been registered" }}});
    return;
  }

  const user = userFromDatabase[0];
  const passwordMatches = await bcrypt.compare(
    password,
    user.password,
  );

  if (!passwordMatches) {
    render("login.eta", {email: email ,errors: { password: { inCorrect: "Incorrect password" }}});
    return;
  }

  await state.session.set("user", user);
  response.redirect("/topics");
};

const showLoginForm = ({ render }) => {
  render("login.eta", {email: ""});
};

export { processLogin, showLoginForm };
