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
    format = require('../../util/format.js'),
    NamedGenerator = require('../../util/NamedGenerator.js'),
    path = require('path');
  
  module.exports = NamedGenerator.extend({
    constructor: function () {
      NamedGenerator.apply(this, arguments);
      
      this._formatName('-style');
    },
          
    writing: function () {
      this.fs.copyTpl(
        this.templatePath('style.scss'),
        path.join(this.module.path, '_' + this.name + '.scss'), {
          cssClassName: this._getCssClassName(this.name)
        }
      );
    },
    
    _getCssClassName: function (style) {
      style = style || this.name;
      
      style = this.module.name + '.' + style;
      style = style.replace(/\./g, '-');
      
      return format(style);
    }
  });
}());