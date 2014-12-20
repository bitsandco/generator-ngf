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
    blackhole = require('blackhole'),
    chai = require('chai'),
    fs = require('fs-extra'),
    path = require('path'),
    yeoman = require('yeoman-generator'),
    
    assert = yeoman.assert,
    expect = chai.expect,
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
          expect(generator.parent).to.not.exist();
          done();
        });
    });
    
    it('should use the module name provided as argument', function(done) {
      var context = runContext();
    
      context
        .withArguments(['mySuperMod'])
        .on('ready', function (generator) {
          generator.name.should.equal(_.slugify(_.humanize('mySuperMod')));
          expect(generator.parent).to.not.exist();
          done();
        });
    });
    
    it('should accept an optional argument ' +
    'for the parent module', function(done) {
      var context = runContext('template');
    
      context
        .withArguments(['mySuperModule'])
        .on('end', function () {
          var subContext = runContext(undefined, function (dir) {
            fs.copySync(path.join(dir, '../template'), dir);
          });
          
          subContext
            .withArguments(['mySuperSubModule', 'my-super'])
            .on('ready', function (generator) {
              generator.name.should.exist();
              generator.parent.should.equal('my-super');
              done();
            });
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
          assert.file([path.join(__dirname, '../../test/tmp/context', file)]);
          done();
        });
    });
    
    it('should generate a module in a specified directory', function(done) {
      var
        context = runContext(),
        file;
      
      context
        .withArguments(['mySuperModule'])
        .withOptions({ dir: 'somedir' }) 
        .on('ready', function (generator) {
          file = path.join(
            generator.name, 
            generator.name + '.module.js'
          );
        })
        .on('end', function () {
          assert.file([path.join(
            __dirname,
            '../../test/tmp/context/somedir',
            file
          )]);
          done();
        });
    });
    
    it('should generate a submodule in a specified directory', function(done) {
      var
        context = runContext('template'),
        file;
  
      context
      .withArguments(['mySuperModule'])
      .on('end', function () {
        var subContext = runContext(undefined, function (dir) {
          fs.copySync(path.join(dir, '../template'), dir);
        });
        
        subContext
        .withArguments(['mySuperSubModule', 'my-super'])
        .withOptions({ dir: 'somedir' })
        .on('ready', function (generator) {
          file = path.join(
            generator.name, 
            generator.name + '.module.js'
          );
        })
        .on('end', function () {
          assert.file([path.join(
            __dirname,
            '../../test/tmp/context/somedir',
            file
          )]);
          done();
        });
      });
    });
  
    function runContext(dir, setup) {
      dir = dir || 'context';
      setup = setup || blackhole;
      
      return helpers
        .run(__dirname)
        .inDir(path.join(__dirname, '../../test/tmp', dir), setup);
    }
  });
}());