// ==UserScript==
// @name         Set Custom Ban Time 1 Day
// @namespace    Violentmonkey Scripts
// @version      0.1
// @description  Set initial value for custom ban time to 1 day
// @match        https://www.twitch.tv/moderator/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  function setInputValue() {
    let inputElement = document.querySelector(
      'input[placeholder="カスタムの発言禁止時間を設定"]'
    );
    if (
      inputElement &&
      inputElement.offsetParent !== null &&
      !inputElement.value
    ) {
      inputElement.value = "86400";
    }
  }

  document.addEventListener("click", function () {
    setTimeout(setInputValue, 100);
  });

  window.addEventListener("load", setInputValue);
})();
