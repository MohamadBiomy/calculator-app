// DOM elements
const themeToggle = document.querySelector(".toggle")
const screen = document.querySelector(".screen")
const currResult = document.querySelector(".screen p")
const accResult = document.querySelectorAll(".screen span span")[0]
const resultOperator = document.querySelector(".screen span span:last-of-type")
const keyspad = document.querySelector(".keyspad")
const numberKeys = document.querySelectorAll(".keyspad .num")
const dotKey = keyspad.querySelector(".dot")
const operationKeys = document.querySelectorAll(".keyspad .operator")
const deleteKey = keyspad.querySelector(".delete")
const resetKey = keyspad.querySelector(".reset")
const equalKey = keyspad.querySelector(".equal")

// Variables
const colorSchemeMedia = window.matchMedia('(prefers-color-scheme: dark)');
let currValue = "0"
let accValue = ""
let currOperator = ""
let isResulted = false

// Prefers color scheme
// add listener for color scheme changes
colorSchemeMedia.addEventListener('change', handleColorSchemeChange);
// initial check
if (!document.body.dataset.theme) {
  handleColorSchemeChange(colorSchemeMedia);
}


// Theme toggle
themeToggle.addEventListener("click", (e) => {
  if (document.body.dataset.theme === "2") {
    document.body.dataset.theme = "0" 
  } else {
    document.body.dataset.theme = `${+document.body.dataset.theme + 1}`
  }
})


// Calculating
// numbers keys
numberKeys.forEach(key => {
  key.addEventListener("click", () => {

    // check if the screen has math error
    if (currValue === "Math Error") {
      currValue = "0"
      currResult.textContent = currValue
    }

    if (isResulted) {
      currValue = "0"
      isResulted = false
    }

    if (currValue === "0") {
      currValue = key.textContent
    } else {
      currValue += key.textContent
    }
    currResult.textContent = addComma(currValue)
  })
})
// dot key
dotKey.addEventListener("click", () => {
  if (!currValue.includes(".")) { // disable adding two (.) dots 
    currValue += "."
    currResult.textContent = addComma(currValue)
  }
})
// delete key
deleteKey.addEventListener('click', () => {
  if (currValue === "Math Error") {
    currValue = "0"
    currResult.textContent = currValue
    return
  }
  if (isResulted) {
    console.log(currValue)
  }
  if (currValue !== "0") {
    currValue = currValue.slice(0, currValue.length - 1)
    if (currValue.length == 0) {
      currValue = "0"
    }
    currResult.textContent = addComma(currValue)
  }
})
// reset key 
resetKey.addEventListener("click", () => {
  currValue = "0"
  currResult.textContent = currValue
  accValue = ""
  accResult.textContent = accValue
  resultOperator.textContent = "="
})
// operation keys 
operationKeys.forEach(key => {
  key.addEventListener("click", () => {
    
    if (accValue === "") {
      accValue = currValue
      accResult.textContent = accValue
      resultOperator.textContent = key.dataset.operation;

      currValue = ""
      currResult.textContent = currValue
    } else {

      if (currValue === "") {
        resultOperator.textContent = key.dataset.operation
        return
      }

      let value1 = accValue
      let value2 = currValue
      let operator = resultOperator.textContent

      let result = calc(operator, value1, value2)

      if (result !== undefined) {

        accValue = result
        accResult.textContent = accValue
        resultOperator.textContent = key.dataset.operation

        currValue = ""
        currResult.textContent = currValue

      } else {
        accValue = ""
        accResult.textContent = accValue
        resultOperator.textContent = "="
        currValue = "Math Error"
        currResult.textContent = currValue
      }


    }


  })
})
// equal key
equalKey.addEventListener("click", () => {
  if (currValue === "") {
    currResult.textContent = addComma(accValue)
    accValue = ""
    accResult.textContent = accValue
    resultOperator.textContent = "="
    currValue = addComma(accValue.toString())
    isResulted = true
  } else if (accValue !== "") {
    let result = calc(resultOperator.textContent, accValue, currValue)
    if (result === undefined) {
      accValue = ""
      accResult.textContent = accValue
      resultOperator.textContent = "="
      currValue = "Math Error"
      currResult.textContent = currValue
    } else {
      currResult.textContent = addComma(result.toString())
      accValue = ""
      accResult.textContent = accValue
      resultOperator.textContent = "="
      currValue = result.toString()
      isResulted = true
    }
  }
})


// When pressing keyboard keys
window.addEventListener("keydown", (e) => {
  const key = e.key;
  const numKeys = document.querySelectorAll('.num');
  const operatorKeys = document.querySelectorAll('.operator');
  const equalKey = document.querySelector('.equal');
  const deleteKey = document.querySelector('.delete');
  const resetKey = document.querySelector('.reset');
  const dotKey = document.querySelector('.dot');

  // Handle number keys
  if (/^[0-9]$/.test(key)) {
    numKeys.forEach(num => {
      if (num.textContent === key) {
        num.click();
      }
    });
  }
  // Handle operator keys
  else if (['+', '-', '*', '/'].includes(key)) {
    operatorKeys.forEach(op => {
      if (op.textContent === key || (key === '*' && op.textContent === 'x')) {
        op.click();
      }
    });
  }
  // Handle equal key
  else if (key === 'Enter' || key === '=') {
    equalKey.click();
  }
  // Handle delete key
  else if (key === 'Backspace' || key === "Delete") {
    deleteKey.click();
  }
  // Handle reset key
  else if (key === 'Escape') {
    resetKey.click();
  }
  // Handle dot key
  else if (key === '.') {
    dotKey.click();
  }
  // Handle theme toggle with Ctrl + Y
  else if (key === 'm' && e.ctrlKey) {
    themeToggle.click()
  }

})


/* ---------- FUNCTIONS ---------- */ 

// function to handle color scheme changes
function handleColorSchemeChange(e) {
  if (e.matches) {
    // dark mode is active
    document.body.setAttribute('data-theme', '2');
  } else {
    // light mode is active
    document.body.setAttribute('data-theme', '1');
  }
}

// add comma after three digits
function addComma(str) {
  let minus = ""
  if (+str < 0) {
    str = str.toString().slice(1)
    minus = "-"
  }
  let int = str.split(".")[0].split("")
  int = int.reverse()
  let float = str.split(".")[1]
  float = float !== undefined ? "." + float : ""
  for (let i = 3; i < int.length; i += 4) {
    int.splice(i, 0, ",")
  }
  int = int.reverse()
  return [minus, ...int, ...float].join("")
}

// calc
function calc(operator, val1, val2) {
  let result;
  val1 = parseFloat(val1)
  val2 = parseFloat(val2)
  switch (operator) {
    case "+":
      result = val1 + val2
      break;
    case "-":
      result = val1 - val2
      break;
    case "x":
      result = val1 * val2
      break;
    case "/": 
      result = val1 / val2
      break;
  }

  if (result === 0) return result
  if (result === Infinity || result === -Infinity) return undefined

  return result || undefined

}