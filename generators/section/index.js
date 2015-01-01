// Copyright (c) 2014 - 2015 Bits & Co. and other generator-ngf contributors.
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
    NamedGenerator = require('../../util/NamedGenerator.js'),
    path = require('path');
    
  module.exports = NamedGenerator.extend({
    constructor: function () {
      NamedGenerator.apply(this, arguments);
      
      this._formatName(['-section', '-sec']);
      
      this.composeWith('module', {
        args: this.arguments, options: this.options
      }, {
        local: path.join(__dirname, '../module')
      });
      
      if (typeof this.options.dir === 'string') {
        this.options.dir = path.join(this.options.dir, this.name);
      } else {
        this.options.dir = path.join(this.module.path, this.name);
      }
      if (typeof this.moduleName === 'string' && this.moduleName !== '') {
          this.moduleName = this.module.name + '.';
      } else {
        this.moduleName = '';
      }
      this.moduleName += this.name;
      
      this.composeWith('controller', {
        args: this.arguments, options: this.options
      }, {
        local: path.join(__dirname, '../controller')
      });
    },
    
    writing: function () {
    }
  });
}());