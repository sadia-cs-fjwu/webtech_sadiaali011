let result = document.getElementById("result");
let expression = document.getElementById("expression");
let historyPanel = document.getElementById("historyPanel");
let historyList = document.getElementById("historyList");
let memoryPanel = document.getElementById("memoryPanel");
let memoryList = document.getElementById("memoryList");
let menuPanel = document.getElementById("menuPanel");

let firstNumber = null;
let operator = null;
let waitingForNumber = false;
let memoryItems = [];
let historyItems = [];
let repeatOperator = null;
let repeatNumber = null;

function format(n) {
    if (!Number.isFinite(n)) return "Error";
    return String(Number(n.toPrecision(12)));
}

function number(n) {
    if (result.value === "Error") clearAll();

    if (waitingForNumber) {
        result.value = n;
        waitingForNumber = false;
    } else if (result.value === "0") {
        result.value = n;
    } else if (result.value.length < 16) {
        result.value += n;
    }

    repeatOperator = null;
    repeatNumber = null;
}

function decimal() {
    if (result.value === "Error") clearAll();

    if (waitingForNumber) {
        result.value = "0.";
        waitingForNumber = false;
    } else if (!result.value.includes(".")) {
        result.value += ".";
    }
}

function operate(a, b, op) {
    if (op === "+") return a + b;
    if (op === "-") return a - b;
    if (op === "*") return a * b;
    if (op === "/") return b === 0 ? NaN : a / b;
}

function chooseOperator(op) {
    if (result.value === "Error") return;

    let current = Number(result.value);

    if (operator !== null && !waitingForNumber) {
        current = operate(firstNumber, current, operator);
        result.value = format(current);

        if (result.value === "Error") {
            clearAll();
            return;
        }

        current = Number(result.value);
    }

    firstNumber = current;
    operator = op;
    waitingForNumber = true;
    repeatOperator = null;
    repeatNumber = null;

    expression.textContent = format(current) + " " + op;
}

function calculate() {
    if (result.value === "Error") return;

    let a, b, op;

    if (operator !== null) {
        if (waitingForNumber) return;

        a = firstNumber;
        b = Number(result.value);
        op = operator;

        repeatOperator = op;
        repeatNumber = b;
    } else if (repeatOperator !== null) {
        a = Number(result.value);
        b = repeatNumber;
        op = repeatOperator;
    } else {
        return;
    }

    let answer = operate(a, b, op);
    let calculation =
        format(a) + " " + op + " " + format(b) + " =";

    expression.textContent = calculation;
    result.value = format(answer);

    if (result.value !== "Error") {
        historyItems.unshift({
            expression: calculation,
            answer: result.value
        });

        updateHistory();
    }

    firstNumber = null;
    operator = null;
    waitingForNumber = true;
}

function clearAll() {
    result.value = "0";
    expression.textContent = "";
    firstNumber = null;
    operator = null;
    waitingForNumber = false;
    repeatOperator = null;
    repeatNumber = null;
}

function clearEntry() {
    result.value = "0";
}

function backspace() {
    if (result.value === "Error") {
        clearAll();
        return;
    }

    if (waitingForNumber) return;

    if (result.value.length > 1) {
        result.value = result.value.slice(0, -1);
    } else {
        result.value = "0";
    }
}

function changeSign() {
    if (result.value !== "Error") {
        result.value = format(-Number(result.value));
    }
}

function percentage() {
    if (result.value === "Error") return;

    let current = Number(result.value);
    let answer;

    if (firstNumber !== null && operator !== null) {
        if (operator === "+" || operator === "-") {
            answer = firstNumber * current / 100;
        } else {
            answer = current / 100;
        }
    } else {
        answer = current / 100;
    }

    result.value = format(answer);
    waitingForNumber = false;
}

function squareRoot() {
    if (result.value === "Error") return;

    let n = Number(result.value);

    if (n < 0) {
        result.value = "Error";
        return;
    }

    expression.textContent = "√(" + result.value + ")";
    result.value = format(Math.sqrt(n));
    waitingForNumber = true;
}

function square() {
    if (result.value === "Error") return;

    let n = Number(result.value);

    expression.textContent = "sqr(" + result.value + ")";
    result.value = format(n * n);
    waitingForNumber = true;
}

function reciprocal() {
    if (result.value === "Error") return;

    let n = Number(result.value);

    if (n === 0) {
        result.value = "Error";
        return;
    }

    expression.textContent = "1/(" + result.value + ")";
    result.value = format(1 / n);
    waitingForNumber = true;
}

function updateMemoryButtons() {
    let hasMemory = memoryItems.length > 0;

    document.getElementById("mc").disabled = !hasMemory;
    document.getElementById("mr").disabled = !hasMemory;
}

function memoryClear() {
    memoryItems = [];
    updateMemoryButtons();
    updateMemoryList();
}

function memoryRecall() {
    if (memoryItems.length === 0) return;

    result.value = format(memoryItems[0]);
    waitingForNumber = true;
}

function memorySave() {
    if (result.value === "Error") return;

    memoryItems.unshift(Number(result.value));
    updateMemoryButtons();
    updateMemoryList();
}

function memoryAdd() {
    if (result.value === "Error") return;

    if (memoryItems.length === 0) {
        memoryItems.unshift(Number(result.value));
    } else {
        memoryItems[0] += Number(result.value);
    }

    updateMemoryButtons();
    updateMemoryList();
}

function memorySubtract() {
    if (result.value === "Error") return;

    if (memoryItems.length === 0) {
        memoryItems.unshift(-Number(result.value));
    } else {
        memoryItems[0] -= Number(result.value);
    }

    updateMemoryButtons();
    updateMemoryList();
}

function toggleMemory() {
    memoryPanel.style.display =
        memoryPanel.style.display === "block" ? "none" : "block";

    historyPanel.style.display = "none";
    menuPanel.style.display = "none";

    updateMemoryList();
}

function updateMemoryList() {
    memoryList.innerHTML = "";

    if (memoryItems.length === 0) {
        memoryList.textContent = "There's nothing saved in memory";
        return;
    }

    memoryItems.forEach(function(value) {
        let item = document.createElement("div");
        item.className = "memory-item";
        item.textContent = format(value);

        item.onclick = function() {
            result.value = format(value);
            waitingForNumber = true;
            memoryPanel.style.display = "none";
        };

        memoryList.appendChild(item);
    });
}

function toggleHistory() {
    historyPanel.style.display =
        historyPanel.style.display === "block" ? "none" : "block";

    memoryPanel.style.display = "none";
    menuPanel.style.display = "none";
}

function updateHistory() {
    historyList.innerHTML = "";

    if (historyItems.length === 0) {
        historyList.textContent = "There's no history yet";
        return;
    }

    historyItems.forEach(function(item) {
        let row = document.createElement("div");
        row.className = "history-item";

        let exp = document.createElement("div");
        exp.className = "history-expression";
        exp.textContent = item.expression;

        let ans = document.createElement("div");
        ans.className = "history-answer";
        ans.textContent = item.answer;

        row.appendChild(exp);
        row.appendChild(ans);

        row.onclick = function() {
            result.value = item.answer;
            waitingForNumber = true;
            historyPanel.style.display = "none";
        };

        historyList.appendChild(row);
    });
}

function clearHistory() {
    historyItems = [];
    updateHistory();
}

function toggleMenu() {
    menuPanel.style.display =
        menuPanel.style.display === "block" ? "none" : "block";

    historyPanel.style.display = "none";
    memoryPanel.style.display = "none";
}

function closeMenu() {
    menuPanel.style.display = "none";
}

document.addEventListener("keydown", function(event) {
    if (event.ctrlKey || event.altKey || event.metaKey) return;

    let key = event.key;

    if (key >= "0" && key <= "9") {
        number(key);
    } else if (key === ".") {
        decimal();
    } else if (["+", "-", "*", "/"].includes(key)) {
        chooseOperator(key);
    } else if (key === "Enter" || key === "=") {
        event.preventDefault();
        calculate();
    } else if (key === "Backspace") {
        backspace();
    } else if (key === "Escape") {
        clearAll();
    } else if (key === "%") {
        percentage();
    }
});

updateMemoryButtons();
updateHistory();
