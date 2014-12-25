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
    fs = require('fs'),
    Generator = require('./Generator.js'),
    path = require('path'),
    util = require('./');
    
  module.exports = Generator.extend({
    constructor: function () {
      var generator = this;
      
      Generator.apply(this, arguments);
      
      this.argument('name', { type: String, required: true });
      
      this.argument('moduleName', { type: String, required: false });
      if (typeof this.moduleName === 'string') {
        parseModule();
      } else {
        this.module = {
          name: '',
          path: this.options.dir || this.destinationRoot()
        };
      }
      
      ////////////
      
      function parseModule() {
        var
          filename = getModuleFilename(generator.moduleName),
          i,
          l,
          module,
          moduleName = path.basename(generator.moduleName),
          modules;
        
        if (!fs.existsSync(filename)) {
          filename = generator.moduleName.replace(/\./g, path.sep);
          filename = getModuleFilename(filename);
          moduleName = generator.moduleName;
          
          if (!fs.existsSync(filename)) {
            throw new Error('Could not find module ' + generator.moduleName);
          }
        }
        
        modules = util.module.findModules(filename);
        
        for (i = 0, l = modules.length; i < l; i += 1) {
          if (modules[i].name === moduleName) {
            module = {
              name: modules[i].name,
              path: generator.options.dir || path.dirname(filename)
            };
          }
        }
        
        if (module === undefined) {
          throw new Error('Could not find module ' + generator.module);
        } else {
          generator.module = module;
        }
        
        ////////////
        
        function getModuleFilename (moduleRoot) {
          return path.join(
            generator.destinationRoot(),
            moduleRoot,
            path.basename(moduleRoot) + '.module.js'
          );
        }
      }
    },
    
    _formatName: function (suffix) {
      this.name = util.format(this.name, suffix);
    }
  });
}());