(function () {
  'use strict';
  
  angular
    .module('<%= module %>')
    .controller('<%= name %>', <%= name %>);
  
  <%= name %>.$inject = [];
  
  function <%= name %>() {
    var vm = this;
  }
}());
