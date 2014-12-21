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
    format = require('../../util/format.js'),
    NamedGenerator = require('../../util/NamedGenerator.js'),
    path = require('path');
  
  module.exports = NamedGenerator.extend({
    constructor: function () {
      NamedGenerator.apply(this, arguments);
      
      this._formatName('-view');
    },
          
    writing: function () {
      this.fs.copyTpl(
        this.templatePath('view.html'),
        path.join(this.module.path, this.name + '.html'), {
          cssClassName: this._getCssClassName(this.name)
        }
      );
    },
    
    _getCssClassName: function (view) {
      view = view || this.name;
  
      view = this.module.name + '.' + view;
      view = view.replace(/\./g, '-');
      
      return format(view);
    }
  });
}());