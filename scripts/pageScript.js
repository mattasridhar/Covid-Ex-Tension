console.log("SRI in pageScript");

const sendValueToContentScript = (inputValue) => {
  console.log("SRI sending value: ", inputValue);
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

const captureExtensionEvents = () => {
  document.getElementById("submit").addEventListener("click", () => {
    let inputValue = document.getElementById("myInput");
    // console.log("SRI value: ", inputValue.value);
    sendValueToContentScript(inputValue.value);
  });
};

document.addEventListener("DOMContentLoaded", captureExtensionEvents, false);
