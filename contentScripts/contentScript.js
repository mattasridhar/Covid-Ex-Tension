// This is for more creative interaction between the extension and independent pages. Not used as part of this project.

// perform action only when the extension is clicked and the desired message is obtained from backgroundScript
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request !== null && request.message === "CREATIVE") {
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
