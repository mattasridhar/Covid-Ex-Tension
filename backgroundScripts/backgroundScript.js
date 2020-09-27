console.log("SRI in background");
// Perform actions only when the Extension is clicked
chrome.browserAction.onClicked.addListener((tab) => {
  console.log("SRI Extension Clicked!");
  let backgroundContent = {
    message: "SRIDHAR",
  };
  chrome.tabs.sendMessage(tab.id, backgroundContent); //send the message to the content script
});
