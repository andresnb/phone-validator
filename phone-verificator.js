function restrictInput(event) {
  const allowedCharacters = /[0-9+]/;
  const inputChar = String.fromCharCode(event.charCode);

  if (!allowedCharacters.test(inputChar)) {
      event.preventDefault();
  }
}

const phoneNumber = document.getElementById('phoneNumber');
phoneNumber.addEventListener('keypress', restrictInput);