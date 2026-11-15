
let currentInput = "0";
let previousInput = "";
let operator = "";

const mainDisplay = document.getElementById("mainDisplay");
const historyDisplay = document.getElementById("historyDisplay");

function updateDisplay() {
    mainDisplay.innerText = currentInput;

    if (operator != "") {
        historyDisplay.innerText = previousInput + " " + operator;
    } else {
        historyDisplay.innerText = "";
    }
}

function appendNumber(number) {
    if (currentInput == "0") {
        currentInput = number;
    } else {
        currentInput += number;
    }

    updateDisplay();
}

function appendDecimal() {
    if (!currentInput.includes(".")) {
        currentInput += ".";
    }

    updateDisplay();
}

function appendOperator(op) {
    previousInput = currentInput;
    operator = op;
    currentInput = "0";

    updateDisplay();
}

function calculate() {
    let a = parseFloat(previousInput);
    let b = parseFloat(currentInput);
    let result;

    if (operator == "+") {
        result = a + b;
    }
    else if (operator == "-") {
        result = a - b;
    }
    else if (operator == "*") {
        result = a * b;
    }
    else if (operator == "/") {
        if (b == 0) {
            currentInput = "Cannot divide by zero";
            mainDisplay.innerText = currentInput;
            operator = "";
            return;
        }
        result = a / b;
    }
    else {
        return;
    }

    historyDisplay.innerText = previousInput + " " + operator + " " + currentInput + " =";

    currentInput = String(Number(result.toFixed(8)));
    operator = "";

    mainDisplay.innerText = currentInput;
}

function clearEntry() {
    currentInput = "0";
    updateDisplay();
}

function clearAll() {
    currentInput = "0";
    previousInput = "";
    operator = "";

    updateDisplay();
}

function deleteLast() {
    currentInput = currentInput.slice(0, -1);

    if (currentInput == "" || currentInput == "-") {
        currentInput = "0";
    }

    updateDisplay();
}

function toggleSign() {
    if (currentInput != "0") {
        currentInput = String(-Number(currentInput));
    }

    updateDisplay();
}

document.addEventListener("keydown", function(e) {

    if (e.key >= "0" && e.key <= "9") {
        appendNumber(e.key);
    }

    else if (e.key == "+") {
        appendOperator("+");
    }

    else if (e.key == "-") {
        appendOperator("-");
    }

    else if (e.key == "*") {
        appendOperator("*");
    }

    else if (e.key == "/") {
        appendOperator("/");
    }

    else if (e.key == "Enter" || e.key == "=") {
        calculate();
    }

    else if (e.key == "Backspace") {
        deleteLast();
    }

    else if (e.key == "Escape") {
        clearAll();
    }

    else if (e.key == ".") {
        appendDecimal();
    }

});
