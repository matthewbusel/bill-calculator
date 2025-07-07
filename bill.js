/**
 * Bill Calculator Application
 * Calculates tips and splits bills among multiple people
 */

// DOM Elements
const form = document.querySelector("#form");
const submit = document.querySelector("#submit");
const peopleInput = document.querySelector("#num-ppl");
const billInput = document.querySelector("#bill");
const tipSelect = document.querySelector("#tip-per");
const resultContainer = document.querySelector("#result-container");
const loadingElement = document.querySelector("#loading");

// Error message elements
const peopleError = document.querySelector("#num-ppl-error");
const billError = document.querySelector("#bill-error");
const tipError = document.querySelector("#tip-per-error");

// Configuration
const CONFIG = {
  MAX_PEOPLE: 100,
  MIN_PEOPLE: 1,
  MAX_BILL: 999999,
  MIN_BILL: 0,
  CALCULATION_DELAY: 300 // ms for better UX
};

// State management
let isCalculating = false;

/**
 * Initialize the application
 */
function init() {
  attachEventListeners();
  setupFormValidation();
}

/**
 * Attach event listeners
 */
function attachEventListeners() {
  // Form submission
  form.addEventListener('submit', handleFormSubmit);
  
  // Real-time validation
  peopleInput.addEventListener('input', () => validateField('people'));
  billInput.addEventListener('input', () => validateField('bill'));
  tipSelect.addEventListener('change', () => validateField('tip'));
  
  // Clear errors on focus
  peopleInput.addEventListener('focus', () => clearError('people'));
  billInput.addEventListener('focus', () => clearError('bill'));
  tipSelect.addEventListener('focus', () => clearError('tip'));
}

/**
 * Setup form validation
 */
function setupFormValidation() {
  // Prevent invalid characters in number inputs
  [peopleInput, billInput].forEach(input => {
    input.addEventListener('keypress', (e) => {
      const char = String.fromCharCode(e.which);
      if (!/[0-9.]/.test(char) && e.which !== 8 && e.which !== 46) {
        e.preventDefault();
      }
    });
  });
}

/**
 * Handle form submission
 */
async function handleFormSubmit(e) {
  e.preventDefault();
  
  if (isCalculating) return;
  
  // Clear previous results
  clearResults();
  
  // Validate all fields
  const isValid = validateAllFields();
  
  if (isValid) {
    await calculateAndDisplayResults();
  }
}

/**
 * Validate all form fields
 */
function validateAllFields() {
  const peopleValid = validateField('people');
  const billValid = validateField('bill');
  const tipValid = validateField('tip');
  
  return peopleValid && billValid && tipValid;
}

/**
 * Validate individual field
 */
function validateField(fieldType) {
  switch (fieldType) {
    case 'people':
      return validatePeople();
    case 'bill':
      return validateBill();
    case 'tip':
      return validateTip();
    default:
      return false;
  }
}

/**
 * Validate number of people
 */
function validatePeople() {
  const value = peopleInput.value.trim();
  
  if (!value) {
    showError('people', 'Please enter the number of people');
    return false;
  }
  
  const numPeople = parseInt(value);
  
  if (isNaN(numPeople) || numPeople < CONFIG.MIN_PEOPLE) {
    showError('people', `Please enter at least ${CONFIG.MIN_PEOPLE} person`);
    return false;
  }
  
  if (numPeople > CONFIG.MAX_PEOPLE) {
    showError('people', `Maximum ${CONFIG.MAX_PEOPLE} people allowed`);
    return false;
  }
  
  clearError('people');
  return true;
}

/**
 * Validate bill amount
 */
function validateBill() {
  const value = billInput.value.trim();
  
  if (!value) {
    showError('bill', 'Please enter the bill amount');
    return false;
  }
  
  const billAmount = parseFloat(value);
  
  if (isNaN(billAmount) || billAmount <= CONFIG.MIN_BILL) {
    showError('bill', 'Please enter a valid bill amount greater than $0');
    return false;
  }
  
  if (billAmount > CONFIG.MAX_BILL) {
    showError('bill', `Maximum bill amount is $${CONFIG.MAX_BILL.toLocaleString()}`);
    return false;
  }
  
  clearError('bill');
  return true;
}

/**
 * Validate tip percentage
 */
function validateTip() {
  const value = tipSelect.value;
  
  if (!value) {
    showError('tip', 'Please select a tip percentage');
    return false;
  }
  
  clearError('tip');
  return true;
}

/**
 * Show error message
 */
function showError(fieldType, message) {
  const errorElement = getErrorElement(fieldType);
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.classList.add('visible');
  }
}

/**
 * Clear error message
 */
function clearError(fieldType) {
  const errorElement = getErrorElement(fieldType);
  if (errorElement) {
    errorElement.textContent = '';
    errorElement.classList.remove('visible');
  }
}

/**
 * Get error element by field type
 */
function getErrorElement(fieldType) {
  switch (fieldType) {
    case 'people':
      return peopleError;
    case 'bill':
      return billError;
    case 'tip':
      return tipError;
    default:
      return null;
  }
}

/**
 * Calculate and display results
 */
async function calculateAndDisplayResults() {
  try {
    isCalculating = true;
    showLoading();
    
    // Add small delay for better UX
    await new Promise(resolve => setTimeout(resolve, CONFIG.CALCULATION_DELAY));
    
    const results = calculateTip();
    displayResults(results);
    
  } catch (error) {
    showError('general', 'An error occurred while calculating. Please try again.');
    console.error('Calculation error:', error);
  } finally {
    isCalculating = false;
    hideLoading();
  }
}

/**
 * Calculate tip and split amounts
 */
function calculateTip() {
  const numPeople = parseInt(peopleInput.value);
  const billAmount = parseFloat(billInput.value);
  const tipPercentage = parseFloat(tipSelect.value);
  
  // Calculate amounts
  const tipAmount = billAmount * (tipPercentage / 100);
  const totalAmount = billAmount + tipAmount;
  const amountPerPerson = totalAmount / numPeople;
  const tipPerPerson = tipAmount / numPeople;
  
  return {
    numPeople,
    billAmount,
    tipPercentage,
    tipAmount,
    totalAmount,
    amountPerPerson,
    tipPerPerson
  };
}

/**
 * Display calculation results
 */
function displayResults(results) {
  const {
    numPeople,
    billAmount,
    tipPercentage,
    tipAmount,
    totalAmount,
    amountPerPerson,
    tipPerPerson
  } = results;
  
  resultContainer.innerHTML = `
    <div class="result-card">
      <h3>Bill Summary</h3>
      <div class="result-details">
        <div class="result-row">
          <span>Original Bill:</span>
          <span>$${billAmount.toFixed(2)}</span>
        </div>
        <div class="result-row">
          <span>Tip (${tipPercentage}%):</span>
          <span>$${tipAmount.toFixed(2)}</span>
        </div>
        <div class="result-row total">
          <span>Total Amount:</span>
          <span>$${totalAmount.toFixed(2)}</span>
        </div>
      </div>
      
      <div class="per-person-section">
        <h4>Per Person (${numPeople} people)</h4>
        <div class="per-person-amount">
          <div class="amount-large">$${amountPerPerson.toFixed(2)}</div>
          <div class="amount-label">Total per person</div>
        </div>
        <div class="tip-per-person">
          <span>Tip per person: $${tipPerPerson.toFixed(2)}</span>
        </div>
      </div>
    </div>
  `;
  
  // Scroll to results
  resultContainer.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Show loading state
 */
function showLoading() {
  submit.disabled = true;
  loadingElement.setAttribute('aria-hidden', 'false');
  loadingElement.style.display = 'block';
}

/**
 * Hide loading state
 */
function hideLoading() {
  submit.disabled = false;
  loadingElement.setAttribute('aria-hidden', 'true');
  loadingElement.style.display = 'none';
}

/**
 * Clear results
 */
function clearResults() {
  resultContainer.innerHTML = '';
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
