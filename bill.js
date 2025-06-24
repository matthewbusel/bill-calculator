// Select elements
const form = document.querySelector('#form');
const people = document.querySelector('#num-ppl');
const bill = document.querySelector('#bill');
const tip = document.querySelector('#tip-per');
const resultContainer = document.querySelector('.result-container');

// Event listeners
form.addEventListener('submit', function(e) {
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
  let numPpl = parseFloat(people.value);
  let billAmt = parseFloat(bill.value);
  let tipPer = parseFloat(tip.value);

  // Calculate bill per person
  let billPerson = billAmt / numPpl;

  // Calculate tip per person
  let tipPerson = billPerson * (tipPer / 100);

  // Round to two decimals
  tipPerson = tipPerson.toFixed(2);

  // Display tip
  resultContainer.innerHTML = `<h2>$${tipPerson}</h2><h3>per person</h3>`
};
