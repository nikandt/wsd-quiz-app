import { bcrypt } from "../../deps.js";
import * as userService from "../../services/userService.js";
import { validasaur } from "../../deps.js";

const validationRules = {
  email: [validasaur.required, validasaur.isEmail],
  password: [validasaur.required, validasaur.minLength(4)],
};

const getData = async (request) => {
  const data = {
    email: "",
    password: "",
    errors: {},
  };

  if (request) {
    const body = request.body();
    const params = await body.value;
    data.email = params.get("email");
    data.password = params.get("password");
  }

  return data;
};

const registerUser = async ({ render, request, response }) => {
  const data = await getData(request);
  const [passes, errors] = await validasaur.validate(data, validationRules);
  if (!passes) {
    data.errors = errors;
    render("registration.eta", data);
    return;
  }
  const usersWithThisEmail = await userService.findUserByEmail(data.email);
  if(usersWithThisEmail.length != 0)
  {
    data.errors.email = { emailExists: "This email has already been registered" };
    render("registration.eta", data);
    return;
  }

  await userService.addUser(
    data.email,
    await bcrypt.hash(data.password),
  );

  response.redirect("/auth/login");
};

const showRegistrationForm = ({ render }) => {
  render("registration.eta", {email: "", password: ""});
};

export { registerUser, showRegistrationForm };
