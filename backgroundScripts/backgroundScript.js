// console.log("SRI in background");

let countrySelected = "canada";
let provinceSelected = "ontario";
let citySelected = "waterloo";

let apiBaseUrl = `https://api.covid19api.com/`;
let countryNames = ["Select your country"];
let countryCodes = ["opt"];
window.country = "Select your country";
window.province = "Select your province";
let provinceNames = ["Select your province"];
let covidData = [];

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
      // console.log("SRI in loadJSON: ");
      data.forEach((entry) => {
        // console.log(
        //   "Country Entry: ",
        //   entry.Country,
        //   " Country Code: ",
        //   entry.ISO2
        // );
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
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yyyy = now.getFullYear();

  const today = `${yyyy}-${mm}-${dd}T00:00:00Z`;
  console.log("Today Date: ", today, " Country: ", countryCode);
  const apiCovidInfoURL = `${apiBaseUrl}country/${countryCode}?from=2020-03-01T00:00:00Z&to=${today}`;
  await fetch(apiCovidInfoURL)
    .then((response) => response.json())
    .then((data) => {
      // console.log("SRI in loadJSON: ");
      data.forEach((entry) => {
        // console.log("Covid Response: ", entry);
        covidData.push(entry);
        if (entry.Province !== "" && !provinceNames.includes(entry.Province)) {
          provinceNames.push(entry.Province);
        }
      });
      /* msgToExtension.message = {
        covidData,
        provinceNames,
        defaultProvince: window.province,
      };
      msgToExtension.type = "covidInfo";
      console.log("SRI getCovid msgToExtnsion: ", msgToExtension);

      chrome.runtime.onMessage.addListener(function (
        msgFromExtension,
        sender,
        sendResponse
      ) {
        console.log("SRI in bg onMsg: ");

        sendResponse(msgToExtension);
      }); */
    })
    .catch((error) => {
      console.log("Error occured while fetching Covid Data: ", error);
    });
};

// Perform actions only when the Extension is clicked
chrome.browserAction.onClicked.addListener((tab) => {
  // console.log("SRI Extension Clicked!");
  msgToExtension.message = { defaultCountry: window.country };
  msgToExtension.type = "extensionToContent";
  chrome.tabs.sendMessage(tab.id, msgToExtension); //send the message to the content script
});

// Listen to messages coming from Extension page
chrome.runtime.onMessage.addListener(function (
  msgFromExtension,
  sender,
  sendResponse
) {
  // console.log("SRI in bg onMsg: ");
  dealWithExtensionMessage(msgFromExtension);

  // sendResponse(dealWithExtensionMessage(msgFromExtension));
});

/* // For handling the sending and receiving of the Extension messages
const sendMessageToExtension = () => {

// Listen to messages coming from Extension page
chrome.runtime.onMessage.addListener(function (
  msgFromExtension,
  sender,
  sendResponse
) {
  // console.log("SRI in bg onMsg: ");

  sendResponse(dealWithExtensionMessage(msgFromExtension));
});

} */

// For handling the sending and receiving of the extension messages
const sendValueToExtension = (msgToExtension) => {
  console.log("SRI sending value to Extension: ", msgToExtension);

  // Sending response from Background
  chrome.runtime.sendMessage(msgToExtension);
  /* chrome.runtime.sendMessage(msgToBackground, function (msgFromBackground) {
    // Listening to response from background Script
    // console.log("SRI in PageScript resp: ", msgFromBackground);
    // window.selectedCountry = response.defaultCountry;
    handleResponseFromBackground(msgFromBackground);
  }); */
};

// Respond as per the message from Extension message
const dealWithExtensionMessage = (msgFromExtension) => {
  switch (msgFromExtension.type) {
    case "extensionLoaded":
      // console.log("SRI in bg dealWithExtnsnMsg: ", msgFromExtension);
      // console.log("SRI in bg windowCntry: ", window.country);
      msgToExtension.message = {
        countryNames,
        countryCodes,
        defaultCountry: window.country,
      };
      msgToExtension.type = "extensionLoaded";

      sendValueToExtension(msgToExtension);
      break;
    // return msgToExtension;
    case "provinceSelected":
      console.log(
        "SRI in bg selectdProvince: ",
        msgFromExtension.message.selectedProvince
      );
      window.province = msgFromExtension.message.selectedProvince;
      msgToExtension.message = {};
      msgToExtension.type = "done";
      // console.log("SRI msgToExtnsion: ", msgToExtension);

      sendValueToExtension(msgToExtension);
      break;
    // return msgToExtension;
    case "countrySelected":
      console.log(
        "SRI in bg selectdCntry: ",
        msgFromExtension.message.selectedCode
      );
      window.country = msgFromExtension.message.selectedCountry;
      getCovidInfo(window.country).then(() => {
        msgToExtension.message = {
          covidData,
          provinceNames,
          defaultProvince: window.province,
        };
        msgToExtension.type = "covidInfo"; //"waiting"; //
        console.log("SRI getCovid then msgToExtnsion: ", msgToExtension);

        sendValueToExtension(msgToExtension);
      });

      msgToExtension.message = {};
      msgToExtension.type = "waiting";
      console.log("SRI msgToExtnsion: ", msgToExtension);

      return msgToExtension;
    // case "waiting":
    //   msgToExtension.message = {};
    //   msgToExtension.type = "waiting";
    //   console.log("SRI waiting msgToExtnsion: ", msgToExtension);

    //   return msgToExtension;

    default:
      break;
  }
};

// Get the Covid Information
