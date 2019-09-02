/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.trim = function() {
  return this.replace(/^[\s\xA0]+/, '').replace(/[\s\xA0]+$/, '');
};

String.prototype.startsWith = function(str) {
  return this.match('^' + str) == str;
};

String.prototype.endsWith = function(str) {
  return this.match(str + '$') == str;
};

String.prototype.format = function() {
  var args = arguments;
  return this.replace(/\{\{|\}\}|\{(\d+)\}/g, function(m, n) {
    if (m == '{{') {
      return '{';
    }
    if (m == '}}') {
      return '}';
    }
    return args[n];
  });
};
