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
    fs = require('fs'),
    Generator = require('./Generator.js'),
    path = require('path'),
    util = {
      format: require('./format.js'),
      module: require('./module.js')
    };
    
  module.exports = Generator.extend({
    constructor: NamedGenerator,
    _formatName: formatName
  });
  
  ////////////
  
  function NamedGenerator() {
    var generator = this;
  
    Generator.apply(generator, arguments);
  
    generator.argument('name', { type: String, required: true });
  
    generator.argument('moduleName', { type: String, required: false });
    if (typeof generator.moduleName === 'string') {
      parseModule();
    } else {
      generator.module = {
        name: '',
        path: generator.options.dir || generator.destinationRoot()
      };
    }
  
    generator.option('no-strip', { type: Boolean });
  
    ////////////
  
    function parseModule() {
      var
        filename = getModuleFilename(generator.moduleName),
        i,
        l,
        module,
        moduleName,
        modules;
      
      if (!fs.existsSync(filename)) {
        filename = findModulePath(generator.moduleName);
      
        module = {
          name: generator.moduleName,
          path: generator.options.dir || path.dirname(filename)
        };
      } else {
        moduleName = path.basename(generator.moduleName);
      
        modules = util.module.findModulesInFile(filename);
    
        for (i = 0, l = modules.length;
          i < l && module === undefined;
          i += 1) {
          if (generator._.endsWith(modules[i].name, moduleName)) {
            module = {
              name: modules[i].name,
              path: generator.options.dir || path.dirname(filename)
            };
          }
        }
      }
    
      generator.module = module;
    
      ////////////
    
      function getModuleFilename(moduleRoot) {
        return path.join(
          generator.destinationRoot(),
          moduleRoot,
          path.basename(moduleRoot) + '.module.js'
        );
      }
    
      function findModulePath(moduleName) {
        var
          file,
          files = [generator.destinationRoot()],
          i,
          l,
          modulePathName,
          modules,
          stats;
      
        while (files.length > 0) {
          file = files.shift();
        
          stats = fs.statSync(file);
          if (stats.isDirectory()) {
            files = files.concat(fs.readdirSync(file).map(fullPath(file)));
          } else if (generator._.endsWith(
            path.basename(file),
            '.module.js'
          )) {
            modules = util.module.findModulesInFile(file);
          
            for (i = 0, l = modules.length; i < l; i += 1) {
              if (modules[i].name === moduleName) {
                return file;
              }
            }
          }
        }
      
        modulePathName = moduleName.replace(/\./g, path.sep);
        moduleName = moduleName.split('.');
        moduleName = moduleName[moduleName.length - 1];
      
        return path.join(
          generator.destinationRoot(),
          modulePathName,
          moduleName +  '.module.js'
        );
      
        ////////////
      
        function fullPath(file) {
          return function (f) {
            return path.join(file, f);
          };
        }
      }
    }
  }
  
  function formatName(suffix) {
    /* jshint validthis: true */
    
    var generator = this;
    
    generator.name = util.format(generator.name, suffix);
  }
  
}());