function populateNationalitySelector() {
  const nationalitySelect = document.getElementById("nationality");

  for (const country in phoneFormats) {
    const option = document.createElement("option");
    option.value = country;
    option.textContent = country;
    nationalitySelect.appendChild(option);
  }
}

function getUserIPInfo() {
  fetch("https://ipinfo.io/json?token=f639fc606f20db") // Replace YOUR_IPINFO_TOKEN with your ipinfo.io token
    .then((response) => response.json())
    .then((data) => {
      const nationalitySelect = document.getElementById("nationality");
      const countryCodeSelect = document.getElementById("countryCode");

      const userCountry = data.country;
      const userCountryOption = nationalitySelect.querySelector(`option[value="${userCountry}"]`);

      if (userCountryOption) {
        nationalitySelect.value = userCountry;
        countryCodeSelect.value = phoneFormats[userCountry].country_code;
      } else {
        nationalitySelect.value = "";
        countryCodeSelect.value = "";
        countryCodeSelect.disabled = true;
        nationalitySelect.insertAdjacentHTML('afterend', '<p>Your current country is not in the list.</p>');
      }
    })
    .catch((error) => console.error("Error loading user IP information:", error));
}

function validatePhoneNumber() {
  const nationalitySelect = document.getElementById("nationality");
  const selectedCountry = nationalitySelect.value;
  const phoneNumberInput = document.getElementById("phone");
  const phoneNumber = phoneNumberInput.value.trim();

  if (selectedCountry === "") {
    displayValidationResult("Please select a nationality.");
    return;
  }

  if (phoneNumber === "") {
    displayValidationResult("Please enter a phone number.");
    return;
  }

  const countryInfo = phoneFormats[selectedCountry];
  if (!countryInfo) {
    displayValidationResult("Invalid nationality selected.");
    return;
  }

  const regexPattern = new RegExp(`^\\+?${countryInfo.country_code}(${countryInfo.mobile_codes.join("|")})\\d{${countryInfo.phone_length - countryInfo.country_code.length - 1}}$`);
  if (regexPattern.test(phoneNumber)) {
    displayValidationResult("Phone number is valid.");
  } else {
    displayValidationResult("Invalid phone number.");
  }
}

function displayValidationResult(message) {
  document.getElementById("validationResult").textContent = message;
}

// Wait for the DOM to load before populating the nationality selector and fetching user IP information
document.addEventListener("DOMContentLoaded", () => {
  populateNationalitySelector();
  getUserIPInfo();

  const validateButton = document.getElementById("validateBtn");
  validateButton.addEventListener("click", validatePhoneNumber);
});
