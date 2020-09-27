console.log("SRIDHAR");

// perform action only when the extension is clicked and the desired message is obtained from backgroundScript
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("SRI request in content: ", request);
  if (request !== null && request.message === "SRIDHAR") {
    let paras = document.getElementsByTagName("p");
    for (para of paras) {
      para.style["background-color"] = "#900223";
      para.innerHTML = request.message;
    }

    //replacing images for FUN
    let imgs = document.getElementsByTagName("img");
    for (img of imgs) {
      img.src = chrome.extension.getURL("assets/logo512.png");
    }
  }
});
