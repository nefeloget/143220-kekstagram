'use strict';

window.initializeFilters = (function (el, cb) {

  var onSet = function (evt) {
    if (evt.target.checked) {
      cb(evt.target.value);
    }
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
