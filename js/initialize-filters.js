'use strict';

(function () {
  window.initializeFilters = (function (el, cb) {

    var debounce = window.util.debounce();

    var onSet = function (evt) {
      debounce(function () {
        if (evt.target.checked) {
          cb(evt.target.value);
        }
      }, window.util.DEBOUNCE_INTERVAL);
    };

    var onClickElem = function () {
      window.util.onClick(el, onSet);
    };

    var offClickElem = function () {
      window.util.offClick(el, onSet);
    };

    return {
      onClickElem: onClickElem,
      offClickElem: offClickElem
    };

  });
})();
