const queryForm = document.getElementById("query-form");
const stateCheckbox = document.getElementById("cbx-3");
const passwordArea = document.querySelector(".password-container");

let username = document.getElementById("username");
let password = document.getElementById("password");
let application = document.getElementById("app");
let applicationPassword = document.getElementById("app-password");

const requestAPI = async () => {
  if (stateCheckbox.checked) {
    const response = await fetch("http://localhost:5000/storePassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username.value,
        userpass: password.value,
        application: application.value,
        password: applicationPassword.value,
      }),
    });

    const data = await response.json();
    changeLog(response.status, data.log, data.data);
  } else {
    const response = await fetch("http://localhost:5000/getPassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username.value,
        userpass: password.value,
        application: application.value,
      }),
    });

    const data = await response.json();
    changeLog(response.status, data.log, data.data);
  }
  username.value =
    password.value =
    application.value =
    applicationPassword.value =
      "";
};

const changeState = () => {
  if (stateCheckbox.checked) {
    document.querySelector(".button").innerHTML = "Store Password";
    document
      .querySelector("#app-password-container")
      .classList.remove("hidden");
    document.querySelector("#app-password").required = true;
  } else {
    document.querySelector(".button").innerHTML = "Get Password";
    document.querySelector("#app-password-container").classList.add("hidden");
    document.querySelector("#app-password").required = false;
  }
};

const changeLog = (
  responseStatus,
  log,
  data = "Password stored in Database successfully!"
) => {
  if (responseStatus !== 200) {
    document.querySelector(".password-container").style.color = "red";
    document.querySelector(".password-container").innerHTML = log;
    return;
  }
  document.querySelector(".password-container").style.color = "#fff";
  document.querySelector(".password-container").innerHTML = data;
};

const copyToClipboard = () => {
  const password = document.querySelector(".password-container").innerHTML;
  if (password.startsWith("Error") || password.startsWith("Password")) return;
  navigator.clipboard.writeText(password);
};

queryForm.addEventListener("submit", (e) => {
  e.preventDefault();
  requestAPI();
});

stateCheckbox.addEventListener("change", () => {
  changeState();
});

passwordArea.addEventListener("click", () => {
  copyToClipboard();
});
