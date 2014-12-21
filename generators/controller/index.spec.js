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
    blackhole = require('blackhole'),
    chai = require('chai'),
    format = require('../../util/format.js'),
    path = require('path'),
    yeoman = require('yeoman-generator'),
    
    expect = chai.expect,
    helpers = yeoman.test;
  
  chai.should();
  
  describe('ng:controller', function() {
    
    it('should use the controller name provided as argument' +
      ', stripping \'controller\' at the end', function(done) {
      checkNaming('myApp', 'Controller', done);
    });
    
    it('should use the controller name provided as argument' +
      ', stripping \'ctrl\' at the end', function(done) {
      checkNaming('my-app_', 'ctrl', done);
    });
  
    it('should use the controller name provided as argument', function(done) {
      checkNaming('myApp', '', done);
    });
  
    ////////////
    
    function runContext(dir, setup) {
      dir = dir || 'context';
      setup = setup || blackhole;
      
      return helpers
        .run(__dirname)
        .inDir(path.join(__dirname, '../../test/tmp', dir), setup);
    }
    
    function checkNaming(name, suffix, done) {
      var context = runContext();
    
      context
        .withArguments([name + suffix])
        .on('ready', function (generator) {
          expect(generator.name).to.equal(format(name));
          done();
        });
    }
  });
}());