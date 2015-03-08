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
    cheerio = require('cheerio'),
    fs = require('fs'),
    generators = require('yeoman-generator'),
    path = require('path'),
  
    scriptPattern = /(.*?)<!--\s+ngf:js\s+-->[\s\S]*?<!--\s+endngf\s+-->/,
    stylePattern = /(.*?)\/\/\s+ngf:scss([\s\S]*?)\/\/\s+endngf/;
    
  module.exports = generators.Base.extend({
    constructor: Generator,
    _appendScript: appendScript,
    _appendStyle: appendStyle,
    _indexRoot: indexRoot,
    _stylesRoot: stylesRoot
  });
  
  ////////////
  
  function Generator() {
    var generator = this;
    
    generators.Base.apply(generator, arguments);
    generator.option('dir', { type: String });
  }
  
  function appendScript(scriptPath) {
    /* jshint validthis: true */
    
    var
      $,
      content,
      generator = this,
      indent,
      indexPath = path.join(generator._indexRoot(), 'index.html'),
      match,
      replace,
      script,
      scriptFound = false;
      
    content = fs.readFileSync(indexPath, 'utf-8');
  
    match = scriptPattern.exec(content);
  
    if (match !== null &&
        match.constructor === Array &&
        typeof match[0] === 'string') {
      $ = cheerio.load(match[0]);
      indent = (new Array(match[1].length + 1)).join(' ');
    
      script = '\n' + indent + '<script src="' + scriptPath + '"></script>';
    
      $.root().children().each(function () {
        if ($(this).attr('src') === scriptPath) {
          scriptFound = true;
        }
      });
    
      if (!scriptFound) {
        if ($.root().children().last().after(script).html() === null) {
          replace = indent + '<!-- ngf:js -->' + script + '\n' + indent +
            '<!-- endngf -->';
        } else {
          replace = $.html();
        }
        
        content = content.replace(match[0], replace);
        fs.writeFileSync(indexPath, content);
      }
    }
  }
  
  function appendStyle(stylePath) {
    /* jshint validthis: true */
    
    var
      content,
      generator = this,
      importString,
      indent,
      mainStylePath = path.join(generator._stylesRoot(), 'main.scss'),
      match,
      replace,
      style;
    
    content = fs.readFileSync(mainStylePath, 'utf-8');
  
    match = stylePattern.exec(content);
  
    if (match !== null &&
        match.constructor === Array &&
        typeof match[0] === 'string') {
      indent = (new Array(match[1].length + 1)).join(' ');
    
      importString = '"' + stylePath + '"';
      
      if (match[0].indexOf(importString) === -1) {
        style = indent + '@import ' + importString + ';';
        replace = indent + '// ngf:scss' + match[2] + style + '\n' + indent +
          '// endngf';
        
        content = content.replace(match[0], replace);
        fs.writeFileSync(mainStylePath, content);
      }
    }
  }
  
  function indexRoot() {
    /* jshint validthis: true */
    var
      appDir,
      generator = this;
    
    appDir = generator.config.get('appDir');
    
    if (typeof appDir === 'string') {
      appDir = path.join(generator.destinationRoot(), appDir);
    }
    
    return appDir;
  }
  
  function stylesRoot() {
    /* jshint validthis: true */
    var
      appDir,
      generator = this,
      stylesDir;
    
    appDir = generator._indexRoot();

    if (typeof appDir === 'string') {
      stylesDir = path.join(appDir,
        'assets',
        'styles');
    }
    
    return stylesDir;
  }
  
}());