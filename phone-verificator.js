function restrictInput(event) {
  const allowedCharacters = /[0-9+]/;
  const inputChar = String.fromCharCode(event.charCode);
  console.log(event)
  if (!allowedCharacters.test(inputChar)) {
      event.preventDefault();
  }
}

function validatePhoneNumber() {
  let pattern = /^\+?\d+$/
  const phoneNumber = document.getElementById('phoneNumber').value;
  const isValidPhoneNumber = pattern.test(phoneNumber) 

  if (isValidPhoneNumber) {
      alert('Phone number is valid!');
  } else {
      alert('Invalid phone number! Please enter a valid phone number starting with "+" and containing at least one digit.');
  }
}

const phoneNumber = document.getElementById('phoneNumber');
const form = document.getElementById('form');

phoneNumber.addEventListener('keypress', restrictInput);
form.addEventListener('submit', function(event) {
    event.preventDefault();
    validatePhoneNumber();
});