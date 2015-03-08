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
    program = require('ast-query');
  
  exports.findModulesInFile = findModulesInFile;
  
  ////////////
  
  function findModulesInFile(filename) {
    var
      argumentList,
      expression,
      expressions,
      i,
      l,
      modules = [],
      tree;

    if (fs.existsSync(filename)) {
      tree = program(fs.readFileSync(filename));
      expressions = tree.callExpression('angular.module');
  
      for (i = 0, l = expressions.length; i < l; i += 1) {
        expression = expressions.nodes[i];
        argumentList = expression.arguments;
      
        if (argumentList.length > 1 && argumentList[0].type === 'Literal') {
          modules.push({ name: argumentList[0].value });
        }
      }
    
      return modules;
    } else {
      return null;
    }
  }
  
}());