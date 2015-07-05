/**
 * <%= name %> Controller
 * @namespace Controllers
 * @memberOf Modules.<%= module %>
 */
(function () {
  'use strict';
  
  angular
    .module('<%= module %>')
    .controller('<%= name %>', <%= name %>);
  
  <%= name %>.$inject = [];
  
  ////////////
  
  /**
   * @namespace <%= name %>
   * @desc
   * @memberOf Controllers
   */
  function <%= name %>() {
    var vm = this;
  }
  
}());
