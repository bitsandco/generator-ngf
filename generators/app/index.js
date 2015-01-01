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
    Generator = require('../../util/Generator.js'),
    path = require('path');
    
  module.exports = Generator.extend({
    constructor: function () {
      Generator.apply(this, arguments);
      
      this.argument('name', { type: String, required: false });
      if (typeof this.name !== 'string') {
        this.arguments.unshift('app');
      }
      
      if (typeof this.options.dir !== 'string') {
        this.options.dir = 'app';
      }
      
      this.composeWith('section', {
        args: this.arguments, options: this.options
      }, {
        local: path.join(__dirname, '../section')
      });
    },
    
    writing: function () {
      this.directory(
        this.templatePath('app'),
        path.join(this.destinationRoot(), this.options.dir, '..')
      );
      
      this.fs.copy(
        this.templatePath('gulpfile.js'),
        path.join(this.destinationRoot(), 'gulpfile.js')
      );
      
      this.fs.copy(
        this.templatePath('package.json'),
        path.join(this.destinationRoot(), 'package.json')
      );
      
      this.fs.copy(
        this.templatePath('README.md'),
        path.join(this.destinationRoot(), 'README.md')
      );
    },
    
    install: function () {
      this.installDependencies({
        skipInstall: this.options['skip-install'],
        skipMessage: this.options['skip-install']
      });
    }
  });
}());