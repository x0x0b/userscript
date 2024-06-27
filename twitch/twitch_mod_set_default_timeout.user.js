// ==UserScript==
// @name         Set Custom Ban Time 1 Day
// @namespace    Violentmonkey Scripts
// @version      0.2
// @description  Set initial value for custom ban time to 1 day
// @match        https://www.twitch.tv/moderator/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  function setInputValue(inputElement) {
    if (
      inputElement &&
      inputElement.offsetParent !== null &&
      !inputElement.value
    ) {
      inputElement.value = "86400";
    }
  }

  function observeDOM() {
    const targetNode = document.body;
    const config = { childList: true, subtree: true };

    const callback = function (mutationsList, observer) {
      for (let mutation of mutationsList) {
        if (mutation.type === "childList") {
          let inputElement = document.querySelector(
            'input[placeholder="カスタムの発言禁止時間を設定"]'
          );
          if (inputElement) {
            setInputValue(inputElement);
          }
        }
      }
    };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
  }

  // DOMの読み込みが完了したら監視を開始
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", observeDOM);
  } else {
    observeDOM();
  }
})();
