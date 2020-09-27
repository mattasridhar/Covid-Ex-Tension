console.log("SRI in pageScript");

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

const sendValueToBackgroundScript = (inputValue) => {
  console.log("SRI sending value to BackgroundScript: ", inputValue);
  let pageContent = {
    message: inputValue,
  };
  //   chrome.runtime.sendMessage(pageContent);
  chrome.runtime.sendMessage(pageContent, function (response) {
    //here response will be the word you want
    console.log("SRI in PageScript resp: ", response);
  });
};

const captureExtensionEvents = () => {
  document.getElementById("submit").addEventListener("click", () => {
    let inputValue = document.getElementById("myInput");
    // console.log("SRI value: ", inputValue.value);
    // sendValueToContentScript(inputValue.value);
    sendValueToBackgroundScript(inputValue.value);
  });
};

// var selection = chrome.extension.getBackgroundPage().word;
// alert(selection);

document.addEventListener("DOMContentLoaded", captureExtensionEvents, false);
