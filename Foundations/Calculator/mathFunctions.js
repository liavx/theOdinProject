function add(a, b) { return a + b; }
function subtract(a, b) { return a - b; }
function multiply(a, b) { return a * b; }
function divide(a, b) {
  if (b === 0) throw new Error("Division by zero is not allowed");
  return a / b;
}
function modulus(a, b) { return a % b; }
function sqrt(a) {
  if (a < 0) throw new Error("Square root of negative number");
  return Math.sqrt(a);
}
function operate(operator, a, b) {
  switch (operator) {
    case '+': return add(a, b);
    case '-': return subtract(a, b);
    case '*': return multiply(a, b);
    case '/': return divide(a, b);
    case '%': return modulus(a, b);
    default: throw new Error("Invalid operator");
  }
}
let pressTimer;
const clearButton = document.querySelector(".clear");
const DISPLAY = document.querySelector(".display");
let EXPRESSION = '';
let MEMORY = { operand1: null, operator: null, result: null, calculated: false };

const handleBackspace = () => {
  if (DISPLAY.textContent.length > 1) {
    DISPLAY.textContent = DISPLAY.textContent.slice(0, -1);
    EXPRESSION = EXPRESSION.slice(0, -1);
  } else {
    DISPLAY.textContent = '0';
    EXPRESSION = '';
  }
};


const handleClear = () => {
  DISPLAY.textContent = '0';
  EXPRESSION = '';
  MEMORY = { operand1: null, operator: null, result: null, calculated: false };
};

const handleValueInput = (value) => {
  if (DISPLAY.textContent === '0' || MEMORY.calculated || EXPRESSION.endsWith('=')) {
    DISPLAY.textContent = value;
    EXPRESSION = value;
    MEMORY.calculated = false;
  } else {
    DISPLAY.textContent += value;
    EXPRESSION += value;
  }
};

const handleOperatorInput = (operator) => {
  handleSqrtClosure();
  if (operator === '√') {
    DISPLAY.textContent += '√';
    EXPRESSION += '√(';
    return;
  }

  if (MEMORY.calculated) {
    EXPRESSION = `${DISPLAY.textContent} ${operator} `;
  } else {
    EXPRESSION += ` ${operator} `;
  }

  DISPLAY.textContent = EXPRESSION;
  MEMORY.calculated = false;
};

const handleSqrtClosure = () => {
  if (EXPRESSION.includes('√(') && !EXPRESSION.includes(')')) {
    EXPRESSION += ')';
    DISPLAY.textContent += ')';
  }
};

const parseSqrt = (expr) => {
  return expr.replace(/√\(([^)]+)\)/g, (_, inner) => {
    const val = evaluateExpression(inner);
    return sqrt(val);
  });
};

const evaluateExpression = (expr) => {
  expr = parseSqrt(expr);
  const tokens = expr.match(/(-?\d+\.?\d*|\+|\-|\*|\/|%)/g);
  if (!tokens) throw new Error("Invalid expression");
  const values = [...tokens];

  const applyOrder = (ops) => {
    for (let i= 0 ; i < values.length ; i++){
      if(ops.includes(values[i])){
      const a = parseFloat(values[i-1]);
      const b = parseFloat(values[i+1]);
      const result = operate(values[i],a,b);
      values.splice(i-1,3,result.toString())
      i-=1;
      }
    }

  }
  applyOrder(["*","/","%"]);
  applyOrder(["+","-"]);
  

  return parseFloat(values[0]);
};

const handleEqualInput = () => {
  handleSqrtClosure();
  try {
    const result = evaluateExpression(EXPRESSION);
    DISPLAY.textContent = Number.isInteger(result) ? result : result.toFixed(3);
    MEMORY.result = result;
    MEMORY.calculated = true;
    EXPRESSION += ' =';
  } catch (err) {
    DISPLAY.textContent = err.message;
    MEMORY.calculated = true;
  }
};

const handleDecimalInput = () => {
  const lastNum = DISPLAY.textContent.split(/[\+\-\*\/]/).pop();
  if (!lastNum.includes('.')) {
    DISPLAY.textContent += '.';
    EXPRESSION += '.';
  }
};

const flashButton = (button) => {
  button.classList.add("pressed");
  setTimeout(() => button.classList.remove("pressed"), 100);
};


const handleToggleSign = () => {
  const match = DISPLAY.textContent.match(/-?\d+\.?\d*$/);
  if (match) {
    const number = match[0]; // Use [0], not [1]
    const toggled = number.startsWith('-') ? number.slice(1) : '-' + number;
    DISPLAY.textContent = DISPLAY.textContent.replace(/-?\d+\.?\d*$/, toggled);
    EXPRESSION = EXPRESSION.replace(/-?\d+\.?\d*$/, toggled);
  }
};

document.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", (e) => {
    const text = e.target.textContent;
    if (DISPLAY.textContent.match(/Error|NaN|Division/i)) {
      handleClear();
    }
    if (text === "-/+") {
      handleToggleSign();
    } 
      else if (e.target.classList.contains("operand")) {
      handleValueInput(text);
    } else if (e.target.classList.contains("decimal")) {
      handleDecimalInput();
    } else if (e.target.classList.contains("operator")) {
      handleOperatorInput(text);
    } else if (e.target.classList.contains("equal")) {
      handleEqualInput();
    }
    flashButton(e.target);
  });
});

clearButton.addEventListener("mousedown", () => {
  pressTimer = setTimeout(handleClear, 500);
});

clearButton.addEventListener("mouseup", () => {
  clearTimeout(pressTimer);
  if (!MEMORY.calculated) handleBackspace();
});


