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
    constructor: StyleGenerator,
    writing: copyTemplates,
    install: appendScript
  });
  
  ////////////
  
  function StyleGenerator() {
    var
      generator = this,
      suffix;
    
    NamedGenerator.apply(generator, arguments);
    
    if (generator.options['no-strip'] !== true) {
      suffix = '-style';
    }
    generator._formatName(suffix);
  }
  
  function copyTemplates() {
    /* jshint validthis: true */
    
    var
      fullPath,
      generator = this;
    
    fullPath = path.join(generator.module.path,
      '_' + generator.name + '.scss');
    
    generator.fs.copyTpl(
      generator.templatePath('style.scss'),
      fullPath, {
        cssClassName: getCssClassName(generator.name, generator)
      }
    );
    
    ////////////
    
    function getCssClassName(styleName, generator) {
      if (typeof styleName !== 'string' && generator === undefined) {
        generator = styleName;
        styleName = undefined;
      }
    
      styleName = styleName || generator.name;
    
      styleName = generator.module.name + '.' + styleName;
      styleName = styleName.replace(/\./g, '-');
    
      return format(styleName);
    }
  }
  
  function appendScript() {
    /* jshint validthis: true */
    
    var
      fullPath,
      generator = this,
      stylesPath = generator._stylesRoot();
    
    fullPath = path.join(generator.module.path, '_' + generator.name);
    
    if (typeof stylesPath === 'string') {
      generator._appendStyle(path.relative(stylesPath, fullPath));
    }
  }
  
}());