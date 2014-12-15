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
    _ = require('underscore.string'),
    chai = require('chai'),
    path = require('path'),
    yeoman = require('yeoman-generator'),
    
    assert = yeoman.assert,
    helpers = yeoman.test;
  
  chai.should();
  
  describe('ng:module', function() {
    
    it('should use the module name provided as argument' +
      ', stripping \'module\' at the end', function(done) {
      var context = runContext();
      
      context
        .withArguments(['mySuperModule'])
        .on('ready', function (generator) {
          generator.name.should.equal(_.slugify(_.humanize('mySuper')));
          done();
        });
    });
    
    it('should use the module name provided as argument', function(done) {
      var context = runContext();
    
      context
        .withArguments(['mySuperMod'])
        .on('ready', function (generator) {
          generator.name.should.equal(_.slugify(_.humanize('mySuperMod')));
          done();
        });
    });
      
    it('should generate a module file', function(done) {
      var
        context = runContext(),
        file;
      
      context
        .withArguments(['mySuperModule'])
        .on('ready', function (generator) {
          file = path.join(
            generator.name, 
            generator.name + '.module.js'
          );
        })
        .on('end', function () {
          assert.file([path.join(__dirname, '../../test/tmp', file)]);
          done();
        });
    });
      
    function runContext() {
      return helpers
        .run(__dirname)
        .inDir(path.join(__dirname, '../../test/tmp'));
    }
  });
}());