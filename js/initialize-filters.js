'use strict';

window.initializeFilters = (function (el, cb) {

  var onSet = function (evt) {
    if (evt.target.checked) {
      cb(evt.target.value);
    }
  };

  var onClickElem = function () {
    window.util.debounce(function () {
      window.util.onClick(el, onSet);
    }, window.util.DEBOUNCE_INTERVAL);
  };

  var offClickElem = function () {
    window.util.offClick(el, onSet);
  };

  return {
    onClickElem: onClickElem,
    offClickElem: offClickElem
  };

});
