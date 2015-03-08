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
    constructor: ControllerGenerator,
    writing: copyTemplates,
    install: appendScript
  });
  
  ////////////
  
  function ControllerGenerator() {
    var generator = this;
    
    NamedGenerator.apply(generator, arguments);
    
    generator.option('no-view', { type: Boolean });
    
    generator._formatName(['-controller', '-ctrl']);
    
    if (generator.options['no-view'] !== true) {
      generator.composeWith('view', {
        args: generator.arguments, options: generator.options
      }, {
        local: path.join(__dirname, '../view')
      });
    }
  }
  
  function copyTemplates() {
    /* jshint validthis: true */
    
    var
      fullPath,
      generator = this;
    
    fullPath = path.join(generator.module.path,
      generator.name + '.controller.js');
    
    generator.fs.copyTpl(
      generator.templatePath('controller.js'),
      fullPath, {
        module: generator.module.name,
        name: generator._.classify(generator.name)
      }
    );
  }
  
  function appendScript() {
    /* jshint validthis: true */
    
    var
      appPath,
      fullPath,
      generator = this;
      
    appPath = generator._indexRoot();
    fullPath = path.join(generator.module.path,
      generator.name + '.controller.js');
      
    if (typeof appPath === 'string') {
      generator._appendScript(path.relative(appPath, fullPath));
    }
  }
  
}());