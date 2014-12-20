// Copyright (c) 2014 Bits & Co. and other generator-ng contributors.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

(function () {
  'use strict';

  var
    generators = require('yeoman-generator'),
    path = require('path');
    
  module.exports = generators.Base.extend({
    constructor: function () {
      generators.Base.apply(this, arguments);
      
      this.argument('name', { type: String, required: false });
      if (typeof this.name !== 'string') {
        this.arguments.unshift('app');
      }
      
      this.composeWith('module', { args: this.arguments }, {
        local: path.join(__dirname, '../module')
      });
    },
    
    writing: function () {
    }
  });
}());