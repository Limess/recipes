window.recipes.dom = (function(document, $) {

  'use strict';

  var cache = {};

  function get(selector, clearCache) {
    var elements;
    if (clearCache && cache[selector]) {
      delete cache[selector];
    }
    elements = cache[selector] || parse(selector);
    cache[selector] = elements;
    return elements;
  }

  function parse(element) {
    return $(element);
  }

  function delegate(selector, eventName, handler) {
    parse('body').delegate(selector, eventName, handler);
    return this;
  }

  return {
    get: get,
    parse: parse,
    delegate: delegate
  };

}(document, jQuery));
