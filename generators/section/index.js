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
    blackhole = require('blackhole'),
    NamedGenerator = require('../../util/NamedGenerator.js'),
    path = require('path');
    
  module.exports = NamedGenerator.extend({
    constructor: SectionGenerator,
    writing: blackhole
  });
  
  ////////////
  
  function SectionGenerator() {
    var
      dir, 
      generator = this,
      moduleName = '';
    
    NamedGenerator.apply(generator, arguments);
  
    generator._formatName(['-section', '-sec']);
  
    generator.composeWith('module', {
      args: generator.arguments, options: generator.options
    }, {
      local: path.join(__dirname, '../module')
    });
  
    if (typeof generator.options.dir === 'string') {
      dir = generator.options.dir;
    } else {
      dir = generator.module.path;
    }
    generator.options.dir = path.join(dir, generator.name);
    
    if (typeof generator.moduleName === 'string' &&
      generator.moduleName !== '') {
        moduleName = generator.module.name + '.';
    }
    generator.moduleName = moduleName + generator.name;
  
    generator.composeWith('controller', {
      args: generator.arguments, options: generator.options
    }, {
      local: path.join(__dirname, '../controller')
    });
  }
}());