console.log("SRI in background");
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
  console.log("SRI in bg onMsg: ", msg);
  //   if(msg.check)
  //       word = msg.check;
  if (msg.message === "SRIDHAR") sendResponse("SRI heard");
});
