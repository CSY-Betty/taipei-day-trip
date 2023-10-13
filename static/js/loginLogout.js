import { fetchUserData } from "./fetchAPI.js";

function validateAndLogin(email, password) {
	if (email.trim() === "" || password.trim() === "") {
		return Promise.reject("請輸入電子郵件或密碼");
	}
	const loginData = {
		email: email,
		password: password,
	};

	return fetchUserData(
		"/api/user/auth",
		"PUT",
		{ "Content-Type": "application/json" },
		JSON.stringify(loginData)
	).then((data) => {
		localStorage.setItem("token", data.token);
		return "登入成功";
	});
}

function validateAndSignup(name, email, password) {
	const emailRule =
		/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;

	if (!emailRule.test(email)) {
		return Promise.reject("Email 錯誤，請重新輸入");
	} else if (name.trim() === "" || password.trim() === "") {
		return Promise.reject("請輸入姓名或密碼");
	}

	const signup = {
		name: name,
		email: email,
		password: password,
	};

	return fetchUserData(
		"/api/user",
		"POST",
		{ "Content-Type": "application/json" },
		JSON.stringify(signup)
	).then((message) => {
		return message;
	});
}

function showModalAndClose(dialogToShow, dialogToClose) {
	if (dialogToShow) {
		dialogToShow.showModal();
	}
	if (dialogToClose) {
		dialogToClose.close();
	}
}

function displayError(message) {
	loginDialog.style.height = "307px";
	loginError.style.display = "block";
	document.getElementById("loginError").innerHTML = message;
}

function handleLogin() {
	document
		.getElementById("loginButton")
		.addEventListener("click", function () {
			const email = document.getElementById("loginEmail").value;
			const password = document.getElementById("loginPassword").value;

			validateAndLogin(email, password)
				.then((message) => {
					showModalAndClose(null, loginDialog);
					location.reload();
				})
				.catch((error) => {
					displayError(error);
				});
		});
}

function displayMessage(message, color = "red") {
	let registMessage = document.getElementById("registMessage");
	registDialog.style.height = "369px";
	registMessage.style.display = "block";
	registMessage.innerHTML = message;
	registMessage.style.color = color;
}

function handleRegist() {
	document
		.getElementById("registButton")
		.addEventListener("click", function () {
			const name = document.getElementById("registName").value;
			const email = document.getElementById("registEmail").value;
			const password = document.getElementById("registPassword").value;

			validateAndSignup(name, email, password)
				.then((message) => {
					displayMessage(message, "green");
				})
				.catch((error) => {
					displayMessage(error);
				});
		});
}

const loginDialog = document.getElementById("loginDialog");
const registDialog = document.getElementById("registDialog");

export function setupLoginDialogHandlers() {
	document
		.getElementById("loginRegisterButton")
		.addEventListener("click", () => showModalAndClose(loginDialog, null));

	document
		.getElementById("loginClose")
		.addEventListener("click", () => showModalAndClose(null, loginDialog));

	document
		.getElementById("loginRegist")
		.addEventListener("click", () =>
			showModalAndClose(registDialog, loginDialog)
		);

	document
		.getElementById("loginClose")
		.addEventListener("click", () => showModalAndClose(null, registDialog));

	document
		.getElementById("registLogin")
		.addEventListener("click", () =>
			showModalAndClose(loginDialog, registDialog)
		);

	document
		.getElementById("registClose")
		.addEventListener("click", () => showModalAndClose(null, registDialog));

	document
		.getElementById("logoutButton")
		.addEventListener("click", function () {
			localStorage.removeItem("token");
			location.reload();
		});

	handleLogin();
	handleRegist();
}
