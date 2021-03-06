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
    chai = require('chai'),
    format = require('./format.js');
  
  chai.should();
  
  describe('format', function() {
    
    it('should strip one of the array endings', function() {
      format('tostrip', ['strip', 'to', 'ip']).should.equal('to');
    });
    
    it('should not strip anything', function() {
      format('toFormat').should.equal('to-format');
    });
  });
  
}());