
var selectedColor = "blue";

function changeColor(color) {
    selectedColor = color;

    var header = document.getElementById("header");
    var footer = document.getElementById("footer");
    var loginBtn = document.getElementById("loginBtn");
    var inputs = document.getElementsByTagName("input");
    var buttons = document.getElementsByClassName("theme-btn");

    var lightColor;
    var boxColor;
    var darkColor;
    var borderColor;

    if (color == "blue") {
        lightColor = "#bfdbfe";
        boxColor = "#eff6ff";
        darkColor = "#2563eb";
        borderColor = "#93b4f5";
    } else if (color == "green") {
        lightColor = "#bbf7d0";
        boxColor = "#f0fdf4";
        darkColor = "#16a34a";
        borderColor = "#86c99b";
    } else if (color == "yellow") {
        lightColor = "#fde68a";
        boxColor = "#fffbeb";
        darkColor = "#d97706";
        borderColor = "#e8bd68";
    } else {
        return;
    }

    header.style.backgroundColor = lightColor;
    footer.style.backgroundColor = lightColor;
    loginBtn.style.backgroundColor = darkColor;

    for (var i = 0; i < inputs.length; i++) {
        inputs[i].style.backgroundColor = boxColor;
        inputs[i].style.borderColor = borderColor;
    }

    for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("active");
        buttons[i].style.backgroundColor = "#eeeeee";
    }

    for (var i = 0; i < buttons.length; i++) {
        if (buttons[i].innerHTML.toLowerCase() == color) {
            buttons[i].classList.add("active");
            buttons[i].style.backgroundColor = darkColor;
        }
    }
}

function checkLogin() {
    var username = document.getElementById("username").value.trim();
    var password = document.getElementById("password").value;
    var message = document.getElementById("message");

    if (selectedColor == "blue" && username == "student" && password == "12345") {
        message.innerHTML = "Login Successful!";
        message.style.color = "green";
    } else {
        message.innerHTML = "Login Failed! Check your details.";
        message.style.color = "red";
    }
}
