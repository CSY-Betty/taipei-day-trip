// 處理登入畫面
let loginRegisterButton = document.getElementById("loginRegisterButton");
let loginDialog = document.getElementById("loginDialog");
let loginClose = document.getElementById("loginClose");
let loginError = document.getElementById("loginError");
let loginRegist = document.getElementById("loginRegist");

loginRegisterButton.addEventListener("click", function() {
    loginDialog.showModal();
})

loginClose.addEventListener("click", function() {
    loginDialog.close();
})

loginRegist.addEventListener("click", function() {
    loginDialog.close();
    registDialog.showModal();
});

// 處理註冊畫面
let registDialog = document.getElementById("registDialog");
let registClose = document.getElementById("registClose");
let registLogin = document.getElementById("registLogin");

registClose.addEventListener("click", function() {
    registDialog.close();
})

registLogin.addEventListener("click", function() {
    registDialog.close();
    loginDialog.showModal();
})


// 處理-登入驗證
let loginButton = document.getElementById("loginButton");
let loginEmail = document.getElementById("loginEmail");
let loginPassword = document.getElementById("loginPassword");

loginButton.addEventListener("click", function() {
    const email = loginEmail.value;
    const password = loginPassword.value;

    const login = {
        email: email,
        password: password
    }

    fetch(`/api/user/auth`, {method: "PUT", headers: {"Content-Type": "application/json"}, body: JSON.stringify(login)})
    .then(response => {
        if (response.status === 200) {
            const token = response.headers.get("Authorization");
            localStorage.setItem("token", token);
            loginDialog.close();
        }
        else if (response.status === 400 ) {
            loginDialog.style.height = "307px";
            loginError.style.display = "block";
            loginError.innerHTML = "電子郵件或密碼錯誤"
        }
    })
    .catch (error => {
        console.log("發生錯誤: ", error);
    });
})


// 處理-註冊驗證
let registButton = document.getElementById("registButton");
let registName = document.getElementById("registName");
let registEmail = document.getElementById("registEmail");
let registPassword = document.getElementById("registPassword");
let registMessage = document.getElementById("registMessage");

registButton.addEventListener("click", function() {
    const name = registName.value;
    const email = registEmail.value;
    const password = registPassword.value;

    const signup = {
        name : name,
        email : email,
        password : password
    };

    fetch(`/api/user`, {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(signup)})
    .then(response => {
        if (response.status === 200) {
            registDialog.style.height = "369px";
            registMessage.style.display = "block";
            // registMessage.style.bottom = "47px";
            registMessage.innerHTML = "註冊成功，請登入系統";
            registMessage.style.color = "green";
        }
        else if (response.status === 400) {
            registDialog.style.height = "369px";
            registMessage.style.display = "block";
            // registMessage.style.bottom = "47px";
            registMessage.innerHTML = "Email 已經註冊用戶";
        }
    })
    .catch (error => {
        console.log("發生錯誤: ", error);
    })
})