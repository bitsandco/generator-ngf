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
    constructor: ModuleGenerator,
    writing: copyTemplates,
    install: appendScript
  });
  
  ////////////
  
  function ModuleGenerator() {
    var
      generator = this,
      suffix;
    
    NamedGenerator.apply(generator, arguments);
    
    if (generator.options['no-strip'] !== true) {
      suffix = ['-module', '-mod'];
    }
    generator._formatName(suffix);
  }
  
  function copyTemplates() {
    /* jshint validthis: true */
    
    var
      fullPath,
      generator = this;
    
    fullPath = path.join(generator.module.path,
      generator.name,
      generator.name + '.module.js');
    
    generator.fs.copyTpl(
      generator.templatePath('module.js'),
      fullPath, {
        name: getModuleName(generator.name, generator)
      }
    );
    
    ////////////
    
    function getModuleName(moduleName, generator) {
      if (typeof moduleName !== 'string' && generator === undefined) {
        generator = moduleName;
        moduleName = undefined;
      }
    
      moduleName = moduleName || generator.name;

      if (generator.module.name !== '') {
        moduleName = generator.module.name + '.' + moduleName;
      }
    
      return moduleName;
    }
  }
  
  function appendScript() {
    /* jshint validthis: true */
    
    var
      appPath,
      fullPath,
      generator = this;
      
    appPath = generator._indexRoot();
    fullPath = path.join(generator.module.path,
      generator.name,
      generator.name + '.module.js');
    
    if (typeof appPath === 'string') {
      generator._appendScript(path.relative(appPath, fullPath));
    }
  }
  
}());