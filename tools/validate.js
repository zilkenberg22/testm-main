function isNullOrUndefined(value) {
  if (null === value || undefined === value || value === "") return true;
  else return false;
}

function emailValidate(email) {
  if (isNullOrUndefined(email))
    return { error: true, message: "И-Майл хаягаа оруулна уу" };
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return { error: !re.test(email), message: "И-Майл хаягаа зөв оруулна уу" };
}

function userNameValidate(userName) {
  if (isNullOrUndefined(userName))
    return { error: true, message: "Хэрэглэгчийн нэрээ оруулна уу" };
}

function passwordValidate(password) {
  var re = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
  return {
    error: !re.test(password),
    message: "Нууц үг шаардлага хангаагүй байна",
  };
}

export function signupValidate(form) {
  const userName = userNameValidate(form.userName);
  if (userName?.error) return userName;

  const email = emailValidate(form.email);
  if (email?.error) return email;

  const password = passwordValidate(form.password);
  if (password?.error) return password;
}

export function loginValidate(form) {
  const email = emailValidate(form.email);
  if (email?.error) return email;
}
