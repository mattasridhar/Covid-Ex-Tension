import { MapCreator } from "./MapCreator.js";

// console.log("SRI in pageScript");

const loaderDiv = document.getElementById("loader");
const contentDiv = document.getElementById("content");
const mapDiv = document.getElementById("myMap");
const mapArea = document.getElementById("mapid");
const countriesListSelect = document.getElementById("countriesList");
const provincesListSelect = document.getElementById("provincesList");
const provinceLoader = document.getElementById("provinceLoader");
const mapLoader = document.getElementById("mapLoader");
const submitButton = document.getElementById("submitButton");
const updateButton = document.getElementById("updateButton");

const defaultCountryOption = "Select your country";
window.selectedCountry = "Select your country";
const defaultProvinceOption = "Select your province";
window.selectedProvince = "Select your province";
window.createdMap;

let msgToBackground = {
  message: {},
  type: "",
};

// Send the readyness of the Extension DOM and listen to the events
const extensionReady = () => {
  // console.log("SRI Extension Ready: ");
  msgToBackground.message = {};
  msgToBackground.type = `extensionLoaded`;
  sendValueToBackgroundScript();
  captureExtensionEvents();
};

const captureExtensionEvents = () => {
  countriesListSelect.addEventListener("change", () => {
    console.log("SRI selected country: ", countriesListSelect.selectedIndex);
    let selectedCountry =
      countriesListSelect.options[countriesListSelect.selectedIndex];
    console.log("SRI value: ", selectedCountry.id);
    // sendValueToContentScript(inputValue.value);
    msgToBackground.message = {
      selectedCountry: selectedCountry.value,
      selectedCode: selectedCountry.id,
    };
    msgToBackground.type = "countrySelected";
    sendValueToBackgroundScript();
  });

  submitButton.addEventListener("click", () => {
    let selectedCountry =
      countriesListSelect.options[countriesListSelect.selectedIndex];
    console.log("SRI value: ", selectedCountry.id);
    // sendValueToContentScript(inputValue.value);
    msgToBackground.message = {
      selectedCountry: selectedCountry.value,
      selectedCode: selectedCountry.id,
    };
    msgToBackground.type = "countrySelected";
    updateButton.style.display = "block";
    submitButton.style.display = "none";
    submitButton.style.display = "none";
    sendValueToBackgroundScript();
  });

  updateButton.addEventListener("click", () => {
    let selectedCountry =
      countriesListSelect.options[countriesListSelect.selectedIndex];
    console.log("SRI updated value: ", selectedCountry.id);
    // sendValueToContentScript(inputValue.value);
    msgToBackground.message = {
      selectedCountry: selectedCountry.value,
      selectedCode: selectedCountry.id,
    };
    msgToBackground.type = "countrySelected";
    sendValueToBackgroundScript();
  });
};

// Listen to messages coming from Background Script
chrome.runtime.onMessage.addListener(function (
  msgFromBackground,
  sender,
  sendResponse
) {
  console.log("SRI in extnsion onMsg: ", msgFromBackground);
  handleResponseFromBackground(msgFromBackground);
});

// For handling the sending and receiving of the background messages
const sendValueToBackgroundScript = () => {
  console.log("SRI sending value to BackgroundScript: ", msgToBackground);

  // Sending and waiting for response from Background
  chrome.runtime.sendMessage(msgToBackground);
  /* chrome.runtime.sendMessage(msgToBackground, function (msgFromBackground) {
    // Listening to response from background Script
    // console.log("SRI in PageScript resp: ", msgFromBackground);
    // window.selectedCountry = response.defaultCountry;
    handleResponseFromBackground(msgFromBackground);
  }); */
};

const handleResponseFromBackground = (backgroundResponse) => {
  console.log("SRI in handleBgResp: ", backgroundResponse);
  switch (backgroundResponse.type) {
    case "extensionLoaded":
      /* if (
        backgroundResponse.message.defaultCountry.toLowerCase() !==
        defaultOption.toLowerCase()
      ) {
        console.log(
          "SRI country previously selected: ",
          backgroundResponse.message.defaultCountry
        );
      } else */ if (
        backgroundResponse.message.countryNames.length !== 0
      ) {
        loaderDiv.style.display = "none";
        contentDiv.style.display = "contents";
        provinceLoader.style.display = "block";
        populateCountries(
          backgroundResponse.message.countryNames,
          backgroundResponse.message.countryCodes,
          backgroundResponse.message.defaultCountry
        );
      } else {
        loaderDiv.style.display = "block";
        contentDiv.style.display = "none";
        mapDiv.style.display = "none";
      }
      break;
    case "countrySelected":
      loaderDiv.style.display = "none";
      contentDiv.style.display = "contents";
      mapDiv.style.display = "none";
      provinceLoader.style.display = "none";
      provincesListSelect.style.display = "block";

      // Create the Map
      // window.createdMap = MapCreator();
      break;
    case "covidInfo":
      loaderDiv.style.display = "none";
      contentDiv.style.display = "contents";
      mapDiv.style.display = "none";
      provinceLoader.style.display = "none";
      provincesListSelect.style.display = "block";
      populateProvinces(
        backgroundResponse.message.provinceNames,
        backgroundResponse.message.defaultProvince
      );
      break;
    case "waiting":
      msgToBackground.message = {};
      msgToBackground.type = "waiting";
      console.log("SRI  waiting msgToBg: ", msgToBackground);
      // sendValueToBackgroundScript();
      break;
    case "done":
    default:
      break;
  }
};

const populateCountries = (countryNames, countryCodes, defaultCountry) => {
  /* console.log(
    "Country Entry: ",
    countryNames,
    " Country Code: ",
    countryCodes,
    " DefaultCntry: ",
    defaultCountry
  ); */
  for (let i = 0; i < countryNames.length; i++) {
    const option = document.createElement("option");
    option.value = countryNames[i].trim();
    option.id = countryCodes[i];
    option.text = countryNames[i].trim();
    if (countryNames[i].toLowerCase() === defaultCountry.toLowerCase()) {
      option.selected = true;
      window.selectedCountry = defaultCountry;
    } else if (
      countryNames[i].toLowerCase() === window.selectedCountry.toLowerCase()
    ) {
      option.selected = true;
    }

    countriesListSelect.appendChild(option);
  }
};

const populateProvinces = (provinceNames, defaultProvince) => {
  console.log(
    "Province Entry: ",
    provinceNames,
    " DefaultProvince: ",
    defaultProvince
  );
  for (let i = 0; i < provinceNames.length; i++) {
    const option = document.createElement("option");
    option.value = provinceNames[i].trim();
    option.id = `${i}`;
    option.text = provinceNames[i].trim();
    if (provinceNames[i].toLowerCase() === defaultProvince.toLowerCase()) {
      option.selected = true;
      window.selectedProvince = defaultProvince;
    } else if (
      provinceNames[i].toLowerCase() === window.selectedProvince.toLowerCase()
    ) {
      option.selected = true;
    }

    provincesListSelect.appendChild(option);
  }
};

const sendValueToContentScript = (inputValue) => {
  console.log("SRI sending value to ContentScript: ", inputValue);
  const params = {
    active: true,
    currentWindow: true,
  };
  chrome.tabs.query(params, (tabs) => {
    let pageContent = {
      message: inputValue,
    };
    chrome.tabs.sendMessage(tabs[0].id, pageContent);
  });
};

document.addEventListener("DOMContentLoaded", extensionReady, false);
