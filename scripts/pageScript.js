import { MapCreator } from "./MapCreator.js";

const loaderDiv = document.getElementById("loader");
const contentDiv = document.getElementById("content");
const mapDiv = document.getElementById("covidMapDiv");
const countriesListSelect = document.getElementById("countriesList");
const provincesListSelect = document.getElementById("provincesList");
const provinceLoader = document.getElementById("provinceLoader");
const mapLoader = document.getElementById("mapLoader");
const submitButton = document.getElementById("submitButton");
const updateButton = document.getElementById("updateButton");
const infoText = document.getElementById("infoText");

const defaultCountryOption = "Select your country";
window.selectedCountry = "Select your country";
const defaultProvinceOption = "Select your province";
window.selectedProvince = "Select your province";
window.createdMap = "";
window.isMapShown = false;
window.latitude = 0;
window.longitude = 0;
window.zoomType = "";
window.covidData = [];
window.covidDisplayInfo = {
  confirmed: 0,
  recovered: 0,
  deaths: 0,
};

let msgToBackground = {
  message: {},
  type: "",
};

// Send the readyness of the Extension DOM and listen to the events
const extensionReady = () => {
  msgToBackground.message = {};
  msgToBackground.type = `extensionLoaded`;
  sendValueToBackgroundScript();
  captureExtensionEvents();
};

// Listen and handle the different DOM even w.r.t. to the extension
const captureExtensionEvents = () => {
  // Listening to selection in Countries dropdown
  countriesListSelect.addEventListener("change", () => {
    provinceLoader.style.display = "block";
    selectedCountry =
      countriesListSelect.options[countriesListSelect.selectedIndex];
    zoomType = "country";
    provincesListSelect.innerHTML = "";
    selectedProvince = "Select your province";
    infoText.innerHTML = "";
    covidDisplayInfo = {
      confirmed: 0,
      recovered: 0,
      deaths: 0,
    };

    // Notify BackgroundScript and get fresh covid data for the new Country
    msgToBackground.message = {
      selectedCountry: selectedCountry.value,
      selectedCode: selectedCountry.id,
    };
    msgToBackground.type = "countrySelected";
    sendValueToBackgroundScript();
  });

  // Listening to selection in Provinces dropdown
  provincesListSelect.addEventListener("change", () => {
    selectedProvince =
      provincesListSelect.options[provincesListSelect.selectedIndex].value;
    zoomType = "province";

    // Notify BackgroundScript about the Province selection so that its set on next rendering of the extension UI
    msgToBackground.message = {
      selectedProvince, //: selectedProvince.value,
    };
    msgToBackground.type = "provinceSelected";
    sendValueToBackgroundScript();
  });

  // Listening to the Click of Submit button
  submitButton.addEventListener("click", () => {
    updateButton.style.display = "block";
    submitButton.style.display = "none";
    mapDiv.style.display = "block";
    provinceLoader.style.display = "none";

    handleCovidInfo(covidData, selectedProvince);
    isMapShown = true;

    // Create the Map
    createdMap = MapCreator(
      createdMap,
      latitude,
      longitude,
      zoomType,
      covidDisplayInfo
    );
    infoText.innerHTML = `COVID Status : # of People Impacted <br> Confirmed: ${covidDisplayInfo.confirmed} <br> Recovered: ${covidDisplayInfo.recovered} <br> Deaths: ${covidDisplayInfo.deaths}`;

    // Notify BackgroundScript about the Map being Rendered
    msgToBackground.message = {
      isMapShown,
      latitude,
      longitude,
      zoomType,
      covidData,
      covidDisplayInfo,
    };
    msgToBackground.type = "mapRendered";
    sendValueToBackgroundScript();
  });

  // Listening to the Click of Update button
  updateButton.addEventListener("click", () => {
    updateButton.style.display = "block";
    submitButton.style.display = "none";
    mapDiv.style.display = "block";
    provinceLoader.style.display = "none";

    handleCovidInfo(covidData, selectedProvince);

    isMapShown = true;

    // Create the Map
    MapCreator(createdMap, latitude, longitude, zoomType, covidDisplayInfo);

    infoText.innerHTML = `COVID Status : # of People Impacted <br> Confirmed: ${covidDisplayInfo.confirmed} <br> Recovered: ${covidDisplayInfo.recovered} <br> Deaths: ${covidDisplayInfo.deaths}`;

    // Notify BackgroundScript about the Map being re-rendered and update the information
    msgToBackground.message = {
      isMapShown,
      latitude,
      longitude,
      zoomType,
      covidData,
      covidDisplayInfo,
    };
    msgToBackground.type = "mapRendered";
    sendValueToBackgroundScript();
  });
};

// Listen to messages coming from Background Script
chrome.runtime.onMessage.addListener(function (
  msgFromBackground,
  sender,
  sendResponse
) {
  handleResponseFromBackground(msgFromBackground);
});

// For handling the sending and receiving of the background messages
const sendValueToBackgroundScript = () => {
  // Sending to Background
  chrome.runtime.sendMessage(msgToBackground);
};

// Handle the response from the background based on the response type respoectively
const handleResponseFromBackground = (backgroundResponse) => {
  switch (backgroundResponse.type) {
    case "extensionLoaded":
      if (backgroundResponse.message.isMapShown) {
        isMapShown = backgroundResponse.message.isMapShown;
        latitude = backgroundResponse.message.latitude;
        longitude = backgroundResponse.message.longitude;
        zoomType = backgroundResponse.message.zoomType;
        selectedCountry = backgroundResponse.message.defaultCountry;
        selectedProvince = backgroundResponse.message.defaultProvince;
        covidData = backgroundResponse.message.covidData;
        covidDisplayInfo = backgroundResponse.message.covidDisplayInfo;

        mapDiv.style.display = "block";
        contentDiv.style.display = "contents";
        submitButton.style.display = "none";
        updateButton.style.display = "block";

        createdMap = MapCreator(
          createdMap,
          latitude,
          longitude,
          zoomType,
          covidDisplayInfo
        );
        infoText.innerHTML = `COVID Status : # of People Impacted <br> Confirmed: ${covidDisplayInfo.confirmed} <br> Recovered: ${covidDisplayInfo.recovered} <br> Deaths: ${covidDisplayInfo.deaths}`;
      }

      if (backgroundResponse.message.countryNames.length !== 0) {
        loaderDiv.style.display = "none";
        contentDiv.style.display = "contents";
        provinceLoader.style.display = "block";

        populateCountries(
          backgroundResponse.message.countryNames,
          backgroundResponse.message.countryCodes,
          backgroundResponse.message.defaultCountry,
          backgroundResponse.message.provinceNames,
          backgroundResponse.message.defaultProvince
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
      break;
    case "covidInfo":
      loaderDiv.style.display = "none";
      contentDiv.style.display = "contents";
      mapDiv.style.display = "none";
      populateProvinces(
        backgroundResponse.message.provinceNames,
        backgroundResponse.message.defaultProvince
      );
      covidData = backgroundResponse.message.covidData;
      break;
    case "mapRendered":
      isMapShown = backgroundResponse.message.isMapShown;
      latitude = backgroundResponse.message.latitude;
      longitude = backgroundResponse.message.longitude;
      zoomType = backgroundResponse.message.zoomType;
      break;
    case "provinceSelected":
    case "done":
    default:
      break;
  }
};

// Extract the required covid Information from the received Covid Data
const handleCovidInfo = (data, provinceName) => {
  let latArray = [];
  let longArray = [];
  latitude = 0;
  longitude = 0;
  covidDisplayInfo = {
    confirmed: 0,
    recovered: 0,
    deaths: 0,
  };
  data.forEach(function (covidEntry) {
    // If Province is available and an option is Selected then store its Latitude and Longitude. Else store the Latitude & Longitude information in an Array
    if (
      provinceName !== undefined &&
      provinceName !== null &&
      provinceName !== "" &&
      provinceName.trim().toLowerCase() !==
        defaultProvinceOption.trim().toLowerCase() &&
      covidEntry.Province === provinceName
    ) {
      latitude = covidEntry.Lat;
      longitude = covidEntry.Lon;
      covidDisplayInfo.confirmed = covidEntry.Confirmed;
      covidDisplayInfo.recovered = covidEntry.Recovered;
      covidDisplayInfo.deaths = covidEntry.Deaths;
      zoomType = "country";
    } else {
      latArray.push(covidEntry.Lat);
      longArray.push(covidEntry.Lon);
      // covidData = data;
      covidDisplayInfo.confirmed += covidEntry.Confirmed;
      covidDisplayInfo.recovered += covidEntry.Recovered;
      covidDisplayInfo.deaths += covidEntry.Deaths;
    }
  });

  // If there is no province info then get the latitude and longitude info by getting the median of the values stored in the Array
  if (
    provinceName !== undefined &&
    provinceName !== null &&
    provinceName !== "" &&
    provinceName.trim().toLowerCase() ===
      defaultProvinceOption.trim().toLowerCase()
  ) {
    const minLat = Math.min(...latArray);
    const maxLat = Math.max(...latArray);
    const minLong = Math.min(...longArray);
    const maxLong = Math.max(...longArray);

    latitude = (minLat + maxLat) / 2;
    longitude = (minLong + maxLong) / 2;
  }
};

// Populates the Countries dropdown list
const populateCountries = (
  countryNames,
  countryCodes,
  defaultCountry,
  provinceNames,
  defaultProvince
) => {
  for (let i = 0; i < countryNames.length; i++) {
    const option = document.createElement("option");
    option.value = countryNames[i].trim();
    option.id = countryCodes[i];
    option.text = countryNames[i].trim();
    if (countryNames[i].toLowerCase() === defaultCountry.toLowerCase()) {
      option.selected = true;
      selectedCountry = defaultCountry;
    } else if (
      countryNames[i].toLowerCase() === selectedCountry.toLowerCase()
    ) {
      option.selected = true;
    }

    countriesListSelect.appendChild(option);
  }

  populateProvinces(provinceNames, defaultProvince);
};

// Populates the Provinces dropdown list
const populateProvinces = (provinceNames, defaultProvince) => {
  provincesListSelect.innerHTML = "";
  if (provinceNames.length > 1) {
    for (let i = 0; i < provinceNames.length; i++) {
      const option = document.createElement("option");
      option.value = provinceNames[i].trim();
      option.id = `${i}`;
      option.text = provinceNames[i].trim();
      if (provinceNames[i].toLowerCase() === defaultProvince.toLowerCase()) {
        option.selected = true;
        selectedProvince = defaultProvince;
      } else if (
        provinceNames[i].toLowerCase() === selectedProvince.toLowerCase()
      ) {
        option.selected = true;
      }

      provincesListSelect.appendChild(option);
      provinceLoader.style.display = "none";
      provincesListSelect.style.display = "block";
    }
  } else {
    provincesListSelect.style.display = "none";
    provinceLoader.style.display = "none";
  }
};

// Not used but can be used for more interaction
const sendValueToContentScript = (inputValue) => {
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
