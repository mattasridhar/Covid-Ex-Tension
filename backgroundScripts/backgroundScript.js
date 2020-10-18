let countrySelected = "canada";
let provinceSelected = "ontario";
let citySelected = "waterloo";

let apiBaseUrl = `https://api.covid19api.com/`;
let countryNames = ["Select your country"];
let countryCodes = ["opt"];
window.country = "Select your country";
window.province = "Select your province";
let provinceNames = ["Select your province"];

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

let msgToExtension = {
  message: {},
  type: "",
};

// Get all country Names for which we have Covid information
const getCountryNames = async () => {
  const apiCountriesURL = `${apiBaseUrl}countries`;
  await fetch(apiCountriesURL)
    .then((response) => response.json())
    .then((data) => {
      data.forEach((entry) => {
        countryNames.push(entry.Country);
        countryCodes.push(entry.Slug);
      });
    })
    .catch((error) => {
      console.log("Error occured while fetching Countries List: ", error);
    });
};
getCountryNames();

// Get all Covid information for the given country
const getCovidInfo = async (countryCode) => {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const yd = String(now.getDate() - 1).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yyyy = now.getFullYear();

  const today = `${yyyy}-${mm}-${dd}T00:00:00Z`;
  const yesterday = `${yyyy}-${mm}-${yd}T00:00:00Z`;
  const apiCovidInfoURL = `${apiBaseUrl}country/${countryCode}?from=2020-03-01T00:00:00Z&to=${today}`;
  await fetch(apiCovidInfoURL)
    .then((response) => response.json())
    .then((data) => {
      data.forEach((entry) => {
        // Store the latest covid Data
        if (entry.Date === yesterday) {
          covidData.push(entry);
        }
        if (entry.Province !== "" && !provinceNames.includes(entry.Province)) {
          provinceNames.push(entry.Province);
        }
      });
    })
    .catch((error) => {
      console.log("Error occured while fetching Covid Data: ", error);
    });
};

// Perform actions only when the Extension is clicked
chrome.browserAction.onClicked.addListener((tab) => {
  msgToExtension.message = { defaultCountry: country };
  msgToExtension.type = "extensionToContent";
  chrome.tabs.sendMessage(tab.id, msgToExtension); //send the message to the content script
});

// Listen to messages coming from Extension page
chrome.runtime.onMessage.addListener(function (
  msgFromExtension,
  sender,
  sendResponse
) {
  dealWithExtensionMessage(msgFromExtension);
});

// For handling the sending and receiving of the Extension messages
const sendValueToExtension = (msgToExtension) => {
  // Sending response from Background
  chrome.runtime.sendMessage(msgToExtension);
};

// Respond as per the message type for each Extension message
const dealWithExtensionMessage = (msgFromExtension) => {
  switch (msgFromExtension.type) {
    case "extensionLoaded":
      msgToExtension.message = {
        countryNames,
        countryCodes,
        provinceNames,
        defaultCountry: country,
        defaultProvince: province,
        isMapShown,
        latitude,
        longitude,
        zoomType,
        covidData,
        covidDisplayInfo,
      };
      msgToExtension.type = "extensionLoaded";

      sendValueToExtension(msgToExtension);
      break;
    case "provinceSelected":
      province = msgFromExtension.message.selectedProvince;
      msgToExtension.message = {};
      msgToExtension.type = "provinceSelected";

      sendValueToExtension(msgToExtension);
      break;
    case "countrySelected":
      country = msgFromExtension.message.selectedCountry;
      provinceNames = ["Select your province"];
      province = "Select your province";
      covidData = [];
      getCovidInfo(country).then(() => {
        msgToExtension.message = {
          covidData,
          provinceNames,
          defaultProvince: province,
        };
        msgToExtension.type = "covidInfo";

        sendValueToExtension(msgToExtension);
      });

      msgToExtension.message = {};
      msgToExtension.type = "waiting";
      return msgToExtension;
    case "mapRendered":
      isMapShown = msgFromExtension.message.isMapShown;
      latitude = msgFromExtension.message.latitude;
      longitude = msgFromExtension.message.longitude;
      zoomType = msgFromExtension.message.zoomType;
      covidDisplayInfo = msgFromExtension.message.covidDisplayInfo;
      covidData = msgFromExtension.message.covidData;
      msgToExtension.message = {
        isMapShown,
        latitude,
        longitude,
        zoomType,
      };
      msgToExtension.type = "mapRendered";

      sendValueToExtension(msgToExtension);
      break;
    default:
      break;
  }
};
