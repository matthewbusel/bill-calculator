// Select elements
const form = document.querySelector("#form");
const submit = document.querySelector("#submit");
const people = document.querySelector("#num-ppl");
const bill = document.querySelector("#bill");
const tip = document.querySelector("#tip-per");
const resultContainer = document.querySelector(".result-container");

// Event listeners
submit.addEventListener('click', function(e) {
  e.preventDefault();
  if (!people.value || !bill.value || !tip.value) {
    alert('Please complete form')
  } else {
    calculateTip();
  }
})

// Calculate tip
function calculateTip() {
  // Inputted values
  let numPpl = people.value;
  let billAmt = bill.value;
  let tipPer = tip.value;

  // Calculate bill per person
  let billPerson = billAmt / numPpl;

  // Calculate tip per person
  let tipPerson = billPerson * (tipPer / 100);

  // Round to two decimals
  tipPerson = tipPerson.toFixed(2);

  // Display tip
  resultContainer.innerHTML = `<h2>$${tipPerson}</h2><h3>per person</h3>`
};
