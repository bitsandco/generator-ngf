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
    blackhole = require('blackhole'),
    chai = require('chai'),
    format = require('../../util/format.js'),
    path = require('path'),
    yeoman = require('yeoman-generator'),
    
    assert = yeoman.assert,
    expect = chai.expect,
    helpers = yeoman.test;
  
  chai.should();
  
  describe('ngf:section', function() {
    
    it('should use the section name provided as argument' +
      ', stripping \'section\' at the end', function(done) {
      checkNaming('myApp', 'Section', true, done);
    });
    
    it('should use the section name provided as argument' +
      ', stripping \'sec\' at the end', function(done) {
      checkNaming('my-app_', 'sec', true, done);
    });
  
    it('should use the section name provided as argument', function(done) {
      checkNaming('myApp', '', true, done);
    });
    
    it('should use the section name provided as argument' +
      ', not stripping \'section\' at the end', function(done) {
      checkNaming('myAppSection', '', false, done);
    });
    
    it('should generate a style file', function(done) {
      var
        context = runContext(),
        controllerFile,
        moduleFile,
        name;
      
      context
        .withArguments(['myApp'])
        .on('ready', function (generator) {
          name = generator.name;
          moduleFile = name + '.module.js';
          controllerFile = name + '.controller.js';
        })
        .on('end', function () {
          assert.file([
            path.join(__dirname, '../../test/tmp/context', name, moduleFile),
            path.join(__dirname, '../../test/tmp/context', name, controllerFile)
          ]);
          done();
        });
    });
    
    it('should accept a directory option', function(done) {
      var
        context = runContext(),
        controllerFile,
        moduleFile,
        name;
    
      context
        .withArguments(['myApp'])
        .withOptions({ dir: 'toto' })
        .on('ready', function (generator) {
          name = generator.name;
          moduleFile = generator.name + '.module.js';
          controllerFile = generator.name + '.controller.js';
        })
        .on('end', function () {
          assert.file([
            path.join(
              __dirname, 
              '../../test/tmp/context/toto', 
              name, 
              moduleFile
            ),
            path.join(
              __dirname, 
              '../../test/tmp/context/toto', 
              name, 
              controllerFile
            )
          ]);
          done();
        });
    });
  
    ////////////
    
    function runContext(dir, setup) {
      dir = dir || 'context';
      setup = setup || blackhole;
      
      return helpers
        .run(__dirname)
        .inDir(path.join(__dirname, '../../test/tmp', dir), setup);
    }
    
    function checkNaming(name, suffix, strip, done) {
      var context = runContext('ng_section' + name + suffix);
    
      context
        .withArguments([name + suffix])
        .withOptions({ 'no-strip': !strip })
        .on('ready', function (generator) {
          expect(generator.name).to.equal(format(name));
          expect(generator.module.name).to.equal('');
          done();
        });
    }
  });
  
}());