import { MapCreator } from "./MapCreator.js";

console.log("SRI in pageScript");
const selectElement = document.getElementById("countriesList");

/* // Create the Map
const createdMap = MapCreator(); */

// Send the readyness of the Extension DOM and listen to the events
const extensionReady = () => {
  console.log("SRI Extension Ready: ");
  sendValueToBackgroundScript(`extensionLoaded`);
  captureExtensionEvents();
};

const captureExtensionEvents = () => {
  document.getElementById("submit").addEventListener("click", () => {
    let selectedCountry = document.getElementById("countriesList");
    console.log("SRI value: ", selectedCountry.value);
    // sendValueToContentScript(inputValue.value);
    sendValueToBackgroundScript(selectedCountry.value);
  });
};

// For handling the sending and receiving of the background messages
const sendValueToBackgroundScript = (inputValue) => {
  console.log("SRI sending value to BackgroundScript: ", inputValue);
  let pageContent = {
    message: inputValue,
    cnt: 100,
  };
  // Sending and waiting for response from Background
  //   chrome.runtime.sendMessage(pageContent);
  chrome.runtime.sendMessage(pageContent, function (response) {
    // Listening to response from background Script
    // console.log("SRI in PageScript resp: ", response);
    handleResponseFromBackground(response);
  });
};

const handleResponseFromBackground = (backgroundResponse) => {
  console.log("SRI in handleBgResp: ", backgroundResponse);
  if (backgroundResponse.countryNames.length !== 0) {
    document.getElementById("loader").style.display = "none";
    document.getElementById("content").style.display = "contents";
    populateCountries(
      backgroundResponse.countryNames,
      backgroundResponse.countryCodes
    );
  } else {
    document.getElementById("loader").style.display = "block";
    document.getElementById("content").style.display = "none";
    document.getElementById("mymap").style.display = "none";
  }
};

const populateCountries = (countryNames, countryCodes) => {
  console.log("Country Entry: ", countryNames, " Country Code: ", countryCodes);
  for (let i = 0; i < countryNames.length; i++) {
    const option = document.createElement("option");
    option.value = countryNames[i].trim();
    option.id = countryCodes[i];
    option.text = countryNames[i].trim();
    selectElement.appendChild(option);
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
