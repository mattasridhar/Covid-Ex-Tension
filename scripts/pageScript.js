import { MapCreator } from "./MapCreator.js";

// console.log("SRI in pageScript");

const loaderDiv = document.getElementById("loader");
const contentDiv = document.getElementById("content");
const mapDiv = document.getElementById("covidMapDiv");
// const mapArea = document.getElementById("covidMap");
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
  /* console.log("SRI Extension Ready: ", isMapShown);
  if (isMapShown) {
    console.log("SRI Map already shown");
    mapArea.style.display = "block";
    mapDiv.style.display = "block";
    contentDiv.style.display = "contents";
  } */
  msgToBackground.message = {};
  msgToBackground.type = `extensionLoaded`;
  sendValueToBackgroundScript();
  captureExtensionEvents();
};

// Listen and handle the different DOM even w.r.t. to the extension
const captureExtensionEvents = () => {
  // Listening to selection in Countries dropdown
  countriesListSelect.addEventListener("change", () => {
    // console.log("SRI selected country: ", countriesListSelect.selectedIndex);
    provinceLoader.style.display = "block";
    selectedCountry =
      countriesListSelect.options[countriesListSelect.selectedIndex];
    // console.log("SRI value: ", selectedCountry.id);
    zoomType = "country";
    provincesListSelect.innerHTML = "";
    selectedProvince = "Select your province";
    infoText.innerHTML = "";
    covidDisplayInfo = {
      confirmed: 0,
      recovered: 0,
      deaths: 0,
    };
    // sendValueToContentScript(inputValue.value);
    msgToBackground.message = {
      selectedCountry: selectedCountry.value,
      selectedCode: selectedCountry.id,
    };
    msgToBackground.type = "countrySelected";
    sendValueToBackgroundScript();
  });

  // Listening to selection in Provinces dropdown
  provincesListSelect.addEventListener("change", () => {
    // console.log("SRI selected province: ", provincesListSelect.selectedIndex);
    selectedProvince =
      provincesListSelect.options[provincesListSelect.selectedIndex].value;
    // console.log("SRI province value: ", selectedProvince);
    zoomType = "province";
    // selectedProvince = selectedProvince;
    msgToBackground.message = {
      selectedProvince, //: selectedProvince.value,
    };
    msgToBackground.type = "provinceSelected";
    sendValueToBackgroundScript();
  });

  // Listening to the Click of Submit button
  submitButton.addEventListener("click", () => {
    // let selectedCountry =
    //   countriesListSelect.options[countriesListSelect.selectedIndex];
    // console.log("SRI value: ", selectedCountry.id);
    // sendValueToContentScript(inputValue.value);
    updateButton.style.display = "block";
    submitButton.style.display = "none";
    // mapArea.style.display = "block";
    mapDiv.style.display = "block";
    provinceLoader.style.display = "none";

    handleCovidInfo(covidData, selectedProvince);

    if (!isMapShown) {
      console.log(
        "SRI Map creating: ",
        covidDisplayInfo,
        " Country: ",
        selectedCountry.value,
        " Province: ",
        selectedProvince
      );
      isMapShown = true;
      // Create the Map
      createdMap = MapCreator(
        createdMap,
        latitude,
        longitude,
        zoomType,
        covidDisplayInfo
      );
    }
    infoText.innerHTML = `COVID Status : # of People Impacted <br> Confirmed: ${covidDisplayInfo.confirmed} <br> Recovered: ${covidDisplayInfo.recovered} <br> Deaths: ${covidDisplayInfo.deaths}`;

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
    // mapArea.style.display = "block";
    mapDiv.style.display = "block";
    provinceLoader.style.display = "none";
    console.log(
      "SRI Map UPDATE: ",
      covidDisplayInfo,
      " Country: ",
      selectedCountry.value,
      " Province: ",
      selectedProvince
    );
    handleCovidInfo(covidData, selectedProvince);

    isMapShown = true;

    // Create the Map
    MapCreator(createdMap, latitude, longitude, zoomType, covidDisplayInfo);

    infoText.innerHTML = `COVID Status : # of People Impacted <br> Confirmed: ${covidDisplayInfo.confirmed} <br> Recovered: ${covidDisplayInfo.recovered} <br> Deaths: ${covidDisplayInfo.deaths}`;

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
  // console.log("SRI in extnsion onMsg: ", msgFromBackground);
  handleResponseFromBackground(msgFromBackground);
});

// For handling the sending and receiving of the background messages
const sendValueToBackgroundScript = () => {
  // console.log("SRI sending value to BackgroundScript: ", msgToBackground);

  // Sending to Background
  chrome.runtime.sendMessage(msgToBackground);
};

// Handle the response from the background based on the response type respoectively
const handleResponseFromBackground = (backgroundResponse) => {
  // console.log("SRI in handleBgResp: ", backgroundResponse);
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

        // console.log("SRI Map already shown");
        // mapArea.style.display = "block";
        mapDiv.style.display = "block";
        contentDiv.style.display = "contents";
        submitButton.style.display = "none";
        updateButton.style.display = "block";

        // handleCovidInfo(covidData, selectedProvince);

        createdMap = MapCreator(
          createdMap,
          latitude,
          longitude,
          zoomType,
          covidDisplayInfo
        );
        infoText.innerHTML = `COVID Status : # of People Impacted <br> Confirmed: ${covidDisplayInfo.confirmed} <br> Recovered: ${covidDisplayInfo.recovered} <br> Deaths: ${covidDisplayInfo.deaths}`;
      }

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
      // handleCovidInfo(backgroundResponse.message.covidData);
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
  // console.log("SRI handleCovidInfo: ", data, " Province: ", provinceName);
  let latArray = [];
  let longArray = [];
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
      /* onsole.log(
        "SRI has a province: ",
        covidEntry.Province,
        " Latitute: ",
        covidEntry.Lat,
        " Longitude: ",
        covidEntry.Lon
      );
      console.log(
        "SRI has a confirmed: ",
        covidEntry.Confirmed,
        " Recovered: ",
        covidEntry.Recovered,
        " Deaths: ",
        covidEntry.Deaths
      ); */
      latitude = covidEntry.Lat;
      longitude = covidEntry.Lon;
      covidDisplayInfo.confirmed = covidEntry.Confirmed;
      covidDisplayInfo.recovered = covidEntry.Recovered;
      covidDisplayInfo.deaths = covidEntry.Deaths;
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
    // console.log("SRI array info: ", latArray, " long: ", longArray);
    const minLat = Math.min(...latArray);
    const maxLat = Math.max(...latArray);
    const minLong = Math.min(...longArray);
    const maxLong = Math.max(...longArray);
    /* console.log(
      "SRI minLat: ",
      minLat,
      " maxLat: ",
      maxLat,
      " minLong: ",
      minLong,
      " maxLong: ",
      maxLong
    ); */
    latitude = (minLat + maxLat) / 2;
    longitude = (minLong + maxLong) / 2;
  }
  // console.log("SRI covid displayInfo: ", covidDisplayInfo);
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
