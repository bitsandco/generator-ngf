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
    NamedGenerator = require('../../util/NamedGenerator.js'),
    path = require('path');
  
  module.exports = NamedGenerator.extend({
    constructor: function () {
      NamedGenerator.apply(this, arguments);
      
      this.option('no-view', { type: Boolean });
      
      this._formatName(['-controller', '-ctrl']);
      
      if (this.options['no-view'] !== true) {
        this.composeWith('view', {
          args: this.arguments, options: this.options
        }, {
          local: path.join(__dirname, '../view')
        });
      }
    },
          
    writing: function () {
      this.fs.copyTpl(
        this.templatePath('controller.js'),
        path.join(this.module.path, this.name + '.controller.js'), {
          module: this.module.name,
          name: this._.classify(this.name)
        }
      );
    }
  });
}());