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
      
      this._formatName(['-module', '-mod']);
    },
          
    writing: function () {
      this.fs.copyTpl(
        this.templatePath('module.js'),
        path.join(this.module.path, this.name, this.name + '.module.js'), {
          name: this._getModuleName(this.name)
        }
      );
    },
    
    install: function () {
      var
        appPath = this._indexRoot(),
        fullPath = path.join(this.module.path,
          this.name,
          this.name + '.module.js');
      
      if (typeof appPath === 'string') {
        this._appendScript(path.relative(appPath, fullPath));
      }
    },
    
    _getModuleName: function (module) {
      module = module || this.name;
  
      if (this.module.name !== '') {
        module = this.module.name + '.' + module;
      }
      
      return module;
    }
  });
}());