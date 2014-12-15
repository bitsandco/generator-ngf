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
  
  module.exports = generators.NamedBase.extend({
    constructor: function () {
      var name;
      
      generators.NamedBase.apply(this, arguments);
      
      name = this._.slugify(this._.humanize(this.name));
      if (this._.endsWith(name, '-module')) {
        name = name.slice(0, -7);
      }
      this.name = name;
    },
          
    writing: function () {
      this.fs.copyTpl(
        this.templatePath('module.js'),
        this.destinationPath(path.join(
          this.name,
          this.name + '.module.js'
        )), {
          name: this.name
        }
      );
    }
  });
}());