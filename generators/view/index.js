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
    constructor: ViewGenerator,
    writing: copyTemplates
  });
  
  ////////////
  
  function ViewGenerator() {
    var
      generator = this,
      suffix;
    
    NamedGenerator.apply(generator, arguments);
    
    generator.option('no-style', { type: Boolean });
    
    if (generator.options['no-strip'] !== true) {
      suffix = '-view';
    }
    generator._formatName(suffix);
    
    if (generator.options['no-style'] !== true) {
      generator.composeWith('style', {
        args: generator.arguments, options: generator.options
      }, {
        local: path.join(__dirname, '../style')
      });
    }
  }
  
  function copyTemplates() {
    /* jshint validthis: true */
    
    var
      fullPath,
      generator = this;
    
    fullPath = path.join(generator.module.path, generator.name + '.html');
    
    generator.fs.copyTpl(
      generator.templatePath('view.html'),
      fullPath, {
        cssClassName: getCssClassName(generator.name, generator)
      }
    );
    
    ////////////
    
    function getCssClassName(viewName, generator) {
      if (typeof viewName !== 'string' && generator === undefined) {
        generator = viewName;
        viewName = undefined;
      }
    
      viewName = viewName || generator.name;
    
      viewName = generator.module.name + '.' + viewName;
      viewName = viewName.replace(/\./g, '-');
    
      return format(viewName);
    }
  }
  
}());