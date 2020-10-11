import { MapCreator } from "./MapCreator.js";

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
  // Sending and waiting for response from Background
  //   chrome.runtime.sendMessage(pageContent);
  chrome.runtime.sendMessage(pageContent, function (response) {
    // Listening to response from background Script
    console.log("SRI in PageScript resp: ", response);
  });
};

const captureExtensionEvents = () => {
  document.getElementById("submit").addEventListener("click", () => {
    let inputValue = document.getElementById("myInput");
    console.log("SRI value: ", inputValue.value);
    // sendValueToContentScript(inputValue.value);
    sendValueToBackgroundScript(inputValue.value);
  });
};

const createdMap = MapCreator();

document.addEventListener("DOMContentLoaded", captureExtensionEvents, false);
