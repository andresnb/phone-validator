document.addEventListener('DOMContentLoaded', function () {
  const nationalitySelector = document.getElementById('nationality');
  const countryCodeSelector = document.getElementById('countryCode');
  const phoneInput = document.getElementById('phone');
  const validationResult = document.getElementById('validationResult');

  for (const country in phoneFormats) {
    create_options(nationalitySelector, country, phoneFormats[country].country_name);
    create_options(countryCodeSelector, country, phoneFormats[country].country_code, true);
  }

  nationalitySelector.addEventListener('change', function () {
      countryCodeSelector.value = nationalitySelector.value;
  });

  function create_options(selector, value, text, showEmoji = false){
    const option = document.createElement('option');
    option.value = value;
    option.textContent = text;
    selector.appendChild(option);

    if (showEmoji) {
      const emojiCode = phoneFormats[value].emoji;
      option.textContent = `${emojiCode} ${text}`;
    }
  }

  function validateLength(){
    const selectedCountry = nationalitySelector.value;
    const phone = phoneInput.value.trim();

    const countryData = phoneFormats[selectedCountry];
    if (countryData) {
      const phoneCheck = checkLength(countryData, phone);
      if (phoneCheck.valid == false){
        validationResult.textContent = phoneCheck.message
      }
    } else {
      validationResult.textContent = "Invalid conutry code.";
    }

  }

  function validatePhoneNumber() {
    const selectedCountry = nationalitySelector.value;
    const countryCode = countryCodeSelector.value;
    const phone = phoneInput.value.trim();

    if (!selectedCountry) {
      validationResult.textContent = "Please select a nationality.";
      return;
    }

    if (!countryCode) {
      validationResult.textContent = "Please select a phone prefix.";
      return;
    }

    if (!phone) {
      validationResult.textContent = "Please enter a phone number.";
      return;
    }

    const countryData = phoneFormats[selectedCountry];
    if (countryData) {
      const phoneCheck = checkNumber(countryData, phone);
      validationResult.textContent = phoneCheck.valid ? "Valid phone number" : phoneCheck.message;
    } else {
      validationResult.textContent = "Invalid conutry code.";
    }
  }

  function checkNumber(countryData, phoneNumber) {
    const { country_code, phone_length, country_name } = countryData;

    const countryCode = country_code.replace('+', '');
    const phoneNoPrefix = removePrefixFromPhoneNumber(phoneNumber, countryData);
    const formattedPhoneNumber = countryCode + phoneNoPrefix.replace(/\D/g, ''); // Remove all non-digit characters

    if (!formattedPhoneNumber.startsWith(countryCode)) {
      error_msg = "Phone number must start with the country code"
      return {message:error_msg, valid: false}; // Phone number must start with the country code
    }
    // if (phoneNoPrefix.length === phone_length){
    //   return {valid: true}
    // }else{
    //   error_msg = "In "+country_name+" phones should have "+phone_length+" digits instead of "+phoneNoPrefix.length+"."
    //   return {message:error_msg, valid: false}
    // }
  }

  function checkLength(countryData, phoneNumber){
    const { country_code, phone_length, country_name } = countryData;

    const phoneNoPrefix = removePrefixFromPhoneNumber(phoneNumber, countryData);
    let error_msg = ""
    if (phoneNoPrefix.length === phone_length){
      return {valid: true}
    }else{
      error_msg = "In "+country_name+" phones should have "+phone_length+" digits instead of "+phoneNoPrefix.length+". If you think your phone is ok. Leave it there."
      return {message:error_msg, valid: false}
    }

  }

  function removePrefixFromPhoneNumber(phoneNumber, countryData) {
    const formattedPhoneNumber = phoneNumber.replace(/\D/g, ''); // Remove all non-digit characters
    const trunkPrefix = countryData.trunk_prefix;
    if (trunkPrefix && formattedPhoneNumber.startsWith(trunkPrefix)) {
      // Remove the prefix from the phone number
      const withoutPrefix = formattedPhoneNumber.substring(trunkPrefix.length);
      return withoutPrefix;
    }
  
    // If no prefix or prefix doesn't match, return the original phone number
    return formattedPhoneNumber;
  }
  
  function fetchUserCountryCode() {
    fetch('https://ipinfo.io?token=f639fc606f20db')
      .then((response) => response.json())
      .then((data) => {
        const countryCode = data.country;
        const selectedCountry = Object.keys(phoneFormats).find((country) => country === countryCode);
        if (selectedCountry) {
          nationalitySelector.value = selectedCountry;
          countryCodeSelector.value = selectedCountry;
        }
      })
      .catch((error) => {
        console.error('Error fetching user IP details:', error);
      });
  }

  function restrictInput(event) {
    const allowedCharacters = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);

    if (!allowedCharacters.test(inputChar)) {
        event.preventDefault();
    }
  }

  function handlePaste(event) {
    const pastedText = event.clipboardData.getData('text');
    const digitsOnly = pastedText.replace(/\D/g, ''); // Remove all non-digit characters
    event.preventDefault();
    document.execCommand('insertText', false, digitsOnly);
  }

  fetchUserCountryCode();

  document.getElementById('validateButton').addEventListener('click', validatePhoneNumber);
  document.getElementById('phone').addEventListener('keypress', restrictInput);
  document.getElementById('phone').addEventListener('paste', handlePaste); // Handle paste event
  document.getElementById('phone').addEventListener('focusout', validateLength); 
});
