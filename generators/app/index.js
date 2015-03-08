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

  var format = require('../../util/format.js'),
      Generator = require('../../util/Generator.js'),
      path = require('path');
    
  module.exports = Generator.extend({
    constructor: AppGenerator,
    writing: copyTemplates,
    install: installDependencies
  });
  
  ////////////
  
  function AppGenerator() {
    var generator = this;
    
    Generator.apply(generator, arguments);
    
    generator.argument('name', { type: String, required: false });
    if (typeof generator.name !== 'string') {
      this.name = 'app';
    }
    
    if (typeof generator.options.dir !== 'string') {
      generator.options.dir = 'app';
    }
    
    generator.config.set('appDir', generator.options.dir);
    generator.config.save();
    
    generator.composeWith('section', {
      args: JSON.parse(JSON.stringify(generator.arguments)),
      options: JSON.parse(JSON.stringify(generator.options))
    }, {
      local: path.join(__dirname, '../section')
    });
  }
  
  function copyTemplates() {
    /* jshint validthis: true */
    
    var generator = this;
    
    generator.directory(
      generator.templatePath('app'),
      path.join(generator.destinationRoot(), generator.options.dir)
    );
  
    generator.fs.copy(
      generator.templatePath('_package.json'),
      path.join(generator.destinationRoot(), 'package.json')
    );
  
    generator.fs.copy(
      generator.templatePath('README.md'),
      path.join(generator.destinationRoot(), 'README.md')
    );
  
    generator.fs.copyTpl(
      generator.templatePath('_gulpfile.js'),
      path.join(generator.destinationRoot(), 'gulpfile.js'), {
        appDir: generator.config.get('appDir')
      }
    );
  
    generator.fs.copyTpl(
      generator.templatePath('_bower.json'),
      path.join(generator.destinationRoot(), 'bower.json'), {
        appname: format(generator.name),
        appDir: generator.config.get('appDir')
      }
    );
  
    generator.fs.copyTpl(
      generator.templatePath('_.bowerrc'),
      path.join(generator.destinationRoot(), '.bowerrc'), {
        appDir: generator.config.get('appDir')
      }
    );
  }
  
  function installDependencies() {
    /* jshint validthis: true */
    
    var generator = this;
    
    generator.installDependencies({
      skipInstall: generator.options['skip-install'],
      skipMessage: generator.options['skip-install']
    });
  }
}());