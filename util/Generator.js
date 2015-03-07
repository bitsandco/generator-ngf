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
  
    pattern = /(.*?)<!--\s+ngf:js\s+-->[\s\S]*?<!--\s+ngf\s+-->/;
    
  module.exports = generators.Base.extend({
    constructor: function () {
      generators.Base.apply(this, arguments);
      this.option('dir', { type: String });
    },
    
    _appendScript: function (scriptPath) {
      var
        $,
        content,
        indent,
        index,
        indexPath = path.join(this.destinationRoot(), 'app', 'index.html'),
        match,
        replace,
        script;
      
      content = fs.readFileSync(indexPath, 'utf-8');
      
      match = pattern.exec(content);
      
      if (match !== null &&
          match.constructor === Array &&
          typeof match[0] === 'string') {
        $ = cheerio.load(match[0]);
        indent = (new Array(match[1].length + 1)).join(' ');
        
        script = '\n' + indent + '<script src="' + scriptPath + '"></script>';
        
        if ($.root().children().length === 0) {
          replace = indent + '<!-- ngf:js -->' + script +
            '\n' + indent + '<!-- ngf -->';
        } else {
          index = -1;
          $.root().children().each(function(i) {
            if ($(this).attr('src') === scriptPath) {
              index = i;
            }
          });
          
          if (index === -1) {
            $.root().children().last().after(script);
            replace = $.html();
          }
        }
        
        if (replace !== undefined) {
          content = content.replace(match[0], replace);
          fs.writeFileSync(indexPath, content);
        }
      }
    }
  });
}());