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
    path = require('path'),
    yeoman = require('yeoman-generator'),
    
    assert = yeoman.assert,
    helpers = yeoman.test;
  
  chai.should();
  
  describe('ng:app', function() {
    
    it('should generate a module app', function(done) {
      var context = runContext();
      
      context
        .on('end', function () {
          assert.file([path.join(
            __dirname,
            '../../test/tmp/context/app',
            'app/app.module.js'
          )]);
          done();
        });
    });
      
    it('should generate a module my-mod', function(done) {
      var context = runContext();
      
      context
        .withArguments(['myModModule'])
        .on('end', function () {
          assert.file([path.join(
            __dirname,
            '../../test/tmp/context/app',
            'my-mod/my-mod.module.js'
          )]);
          done();
        });
    });
    
    function runContext(dir, setup) {
      dir = dir || 'context';
      setup = setup || blackhole;
      
      return helpers
        .run(__dirname)
        .inDir(path.join(__dirname, '../../test/tmp', dir), setup)
        .withOptions({ 'skip-install': true });
    }
  });
}());