console.log("SRI in background");

let countrySelected = "canada";
let provinceSelected = "ontario";
let citySelected = "waterloo";

let apiBaseUrl = `https://api.covid19api.com/`;
let countryNames = [];
let countryCodes = [];
window.count = 0;

// Get all country Names for which we have Covid information
const getCountryNames = async () => {
  const apiCountriesURL = `${apiBaseUrl}countries`;
  await fetch(apiCountriesURL)
    .then((response) => response.json())
    .then((data) => {
      console.log("SRI in loadJSON: ");
      data.forEach((entry) => {
        // console.log(
        //   "Country Entry: ",
        //   entry.Country,
        //   " Country Code: ",
        //   entry.ISO2
        // );
        countryNames.push(entry.Country);
        countryCodes.push(entry.ISO2);
      });
    })
    .catch((error) => {
      console.log("Error occured while fetching Data: ", error);
    });
};
getCountryNames();

// Perform actions only when the Extension is clicked
chrome.browserAction.onClicked.addListener((tab) => {
  console.log("SRI Extension Clicked!");
  let backgroundContent = {
    message: "SRIDHAR",
  };
  chrome.tabs.sendMessage(tab.id, backgroundContent); //send the message to the content script
});

// Listen to messages coming from Extension page
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  console.log("SRI in bg onMsg: ", msg.message);
  //   if(msg.check)
  //       word = msg.check;
  if (msg.message === "extensionLoaded") {
    sendResponse({ countryNames, countryCodes });
  }

  if (msg.message === "SRIDHAR") {
    sendResponse("SRI heard");
  }
});

// Get the Covid Information
