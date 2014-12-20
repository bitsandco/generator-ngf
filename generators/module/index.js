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
    generators = require('yeoman-generator'),
    path = require('path'),
    program = require('ast-query');
  
  module.exports = generators.NamedBase.extend({
    constructor: function () {
      var generator = this;
      
      generators.NamedBase.apply(this, arguments);
      
      parseName();
      
      this.argument('parent', { type: String, required: false });
      if (typeof this.parent === 'string') {
        this.dir = this.parent;
        parseParent();
      }
      
      function parseName() {
        var name;
        
        name = generator._.slugify(generator._.humanize(generator.name));
        if (generator._.endsWith(name, '-module')) {
          name = name.slice(0, -7);
        }
        generator.name = name;
      }
      
      function parseParent() {
        var
          argumentList,
          expression,
          expressions,
          i,
          l,
          parent,
          tree;
        
        parent = path.join(
          generator.destinationRoot(),
          generator.parent,
          generator._getModuleFileName(path.basename(generator.parent))
        );
        
        if (fs.existsSync(parent)) {
          tree = program(fs.readFileSync(parent));
          expressions = tree.callExpression('angular.module');
          
          for (i = 0, l = expressions.length; i < l; i += 1) {
            expression = expressions.nodes[i];
            argumentList = expression.arguments;
            if (argumentList.length > 1 &&
              argumentList[0].type === 'Literal' &&
              generator._.endsWith(
                argumentList[0].value,
                path.basename(generator.parent)
              )) {
                generator.parent = argumentList[0].value;
                break;
              }
          }
        } else {
          throw new Error('Could not find the parent module (' +
            parent +')');
        }
      }
    },
          
    writing: function () {
      this.fs.copyTpl(
        this.templatePath('module.js'),
        this.destinationPath(path.join(
          this._getModuleDirectory(),
          this._getModuleFileName()
        )), {
          name: this._getModuleName()
        }
      );
    },
    
    _getModuleFileName: function (module) {
      module = module || this.name;
      return module + '.module.js';
    },
    
    _getModuleDirectory: function (module) {
      var directory = this.dir || '';
      
      module = module || this.name;
      
      return path.join(directory, module);
    },
    
    _getModuleName: function (module) {
      module = module || this.name;
      
      if (typeof this.parent === 'string') {
        module = this.parent + '.' + module;
      }
      
      return module;
    }
  });
}());