const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

const symbols = ' ~`!@#$%^&*()_-+={[}]|:;"<,>.?/ ';

//initially
let password = "";
let passwordLength = 10;
let checkCount = 0;

handleSlider();
//set strength circle color to grey
setIndicator("#ccc");

//set passwordLength
function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
  //or kuch bhi karna chahiye ? - HW
  const min = inputSlider.min;
  const max = inputSlider.max;
  inputSlider.style.backgroundSize =
    ((passwordLength - min) * 100) / (max - min) + "% 100%";
}

handleSlider();

// Sets Color And Shadow ;
function setIndicator(color) {
  indicator.style.backgroundColor = color;
  // Shadow
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

// Generating Random Number;

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min; //Because we Only want 1 number;
}

// Generates Random Integer;
function generateRandomNumber() {
  return getRndInteger(0, 9);
}

// Generates UpperCase Character;
function generateUpperCase() {
  return String.fromCharCode(getRndInteger(65, 91)); //Generates Character From ASCII code;
}
function generateLowerCase() {
  return String.fromCharCode(getRndInteger(97, 122)); //Generates Character From ASCII code;
}

// Generates Symbols;
function generateSymbols() {
  const randNum = getRndInteger(0, symbols.length);
  return symbols.charAt(randNum);
}

function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;
  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numbersCheck.checked) hasNum = true;
  if (symbolsCheck.checked) hasSym = true;

  if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
    setIndicator("#0f0");
  }
  else if (
    (hasLower || hasUpper) &&
    (hasNum || hasSym) &&
    passwordLength >= 6
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  } 
}

// Copy to ClipBoard
async function copyContent() {
  // to copy from clipboard;

  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "copied";
  }
  catch (e) {
    copyMsg.innerText = "Failed";
  }
  // To make copy wala Span Visible;
  copyMsg.classList.add("active");

  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}

function shufflePassword(array) {
  // Fisher Yates Method Used to shuffle Password;
  for (let i = array.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = "";
  array.forEach((el) => (str += el));
  return str;
}
 
// Event Listener for the changes which Occur when we slide slider;
// 
inputSlider.addEventListener('input', (e) => {
  passwordLength = e.target.value;
  handleSlider();
});

// Agar kuchh hai to hi copy hoga;
copyBtn.addEventListener('click', () => {
  if (passwordDisplay.value)
    copyContent();
});

// Handling CheckboxChanges;
function handleCheckBoxChange() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked)
      checkCount++;
  });

  // Special Condition; agar Password length chhoti hai check Count se
  // then password length me checkcount daalna padega;
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
}
// EventListener on CheckBoxes;
allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener('change', handleCheckBoxChange);
});

// Event Listener On Generate Password;
generateBtn.addEventListener("click", () => {
  // None of the Checkboxes are Selected;
  if (checkCount == 0) return;
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }

  // Let start the Journey to find the new Password;
  console.log("Starting The Journey");
  // remove Old Password;
  password = "";

  // Lets put the stuff mentioned by Checkboxes;

  // if (uppercaseCheck.checked) {
  //   password += generateUpperCase();
  // }

  // if (lowercaseCheck.checked) {
  //   password += generateLowerCase();
  // }

  // Lets say we have password of length 10 after putting the contents of checked boxes
  // we have to rtandomly choose the left 6 characters;
  // for that we are writing this below Function;

  let funcArr = [];
  if (uppercaseCheck.checked) funcArr.push(generateUpperCase);
  if (lowercaseCheck.checked) funcArr.push(generateLowerCase);
  if (numbersCheck.checked) funcArr.push(generateRandomNumber);
  if (symbolsCheck.checked) funcArr.push(generateSymbols);

  // Compulsory Addition; means the contents of Checked boxes;
  for (let i = 0; i < funcArr.length; i++) {
    password += funcArr[i]();
  }
  console.log("Compulsory Addition Done");

  // Remaining Addition;
  for (let i = 0; i < passwordLength - funcArr.length; i++) {
    let randIndex = getRndInteger(0, funcArr.length);
    password += funcArr[randIndex]();
  }
  console.log("Remaining Addition Done");

  // Shuffle the Password;
  password = shufflePassword(Array.from(password));
  console.log("Shuffle Done");
  // show in UI
  passwordDisplay.value = password;

  // Calculate Strength;
  calcStrength();
});
