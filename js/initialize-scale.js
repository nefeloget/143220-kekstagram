'use strict';

window.initializeScale = (function () {

  return function (setting, cb) {
    var onElPlus = function (evt) {
      evt.preventDefault();
      var currentValue = parseInt(setting.elValue.value, 10);
      if (currentValue !== setting.max) {
        currentValue += setting.step;
      }
      cb(currentValue);
    };

    var onElMinus = function (evt) {
      evt.preventDefault();
      var currentValue = parseInt(setting.elValue.value, 10);
      if (currentValue !== setting.min) {
        currentValue -= setting.step;
      }
      cb(currentValue);
    };

    var onClickElem = function () {
      window.util.onClick(setting.elPlus, onElPlus);
      window.util.onClick(setting.elMin, onElMinus);
    };

    var offClickElem = function () {
      window.util.offClick(setting.elPlus, onElPlus);
      window.util.offClick(setting.elMin, onElMinus);
    };

    return {
      onClickElem: onClickElem,
      offClickElem: offClickElem
    };

  };
})();
