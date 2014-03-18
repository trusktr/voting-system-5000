
console.log('Setting up configuration for all environments.');

//var codein = require('node-codein'); // for visual debugging in a browser.

var express = require('express'),
    poweredBy = require('connect-powered-by'),
    util = require('util'),
    TEMPLATE_ENGINE = "dust",
    kleiDust = require('klei-dust'),
    dust = require('dustjs-linkedin'), // Dust.js template engine (the LinkedIn fork)
    consolidate = require('consolidate'), // template engine compatibility layer to make engines that don't work with expressjs work with expressjs.

//PASSPORT
    passport = require('passport');



module.exports = function() {
  console.log(' --- Executing settings for all environments.');
  // Warn of version mismatch between global "lcm" binary and local installation
  // of Locomotive.
      if (this.version !== require('locomotive').version) {
        console.warn(util.format('version mismatch between local (%s) and global (%s) Locomotive module', require('locomotive').version, this.version));
      }

  // Configure application settings.  Consult the Express API Reference for a
  // list of the available [settings](http://expressjs.com/api.html#app-settings).
      this.set('views', __dirname + '/../../app/views');
      this.set('view engine', 'dust');
      //this.set('template_engine', 'dustjs-linkedin');

      // Register the template engine.
          this.engine('dust', kleiDust.dust); // Dust.js
          //this.engine('dust', consolidate.dust); // Dust.js
          //this.engine('dust', dust.compileFromPath); // Dust.js
          //this.engine('ejs', require('ejs').__express); // Embedded JavaScript

      // Override default template extension.  By default, Locomotive finds
      // templates using the `name.format.engine` convention, for example
      // `index.html.ejs`  For some template engines, such as Jade, that find
      // layouts using a `layout.engine` notation, this results in mixed conventions
      // that can cuase confusion.  If this occurs, you can map an explicit
      // extension to a format.
          //this.format('html', { extension: '.jade' })
          //this.format('html', { extension: '.dust' })

      // Register formats for content negotiation.  Using content negotiation,
      // different formats can be served as needed by different clients.  For
      // example, a browser is sent an HTML response, while an API client is sent a
      // JSON or XML response.
          /* this.format('xml', { engine: 'xmlb' }); */
          /* this.format('json', { engine: 'ejs' }); */

      // Use middleware.  Standard [Connect](http://www.senchalabs.org/connect/)
      // middleware is built-in, with additional [third-party](https://github.com/senchalabs/connect/wiki)
      // middleware available as separate modules.
          this.use(poweredBy('Locomotive'));
          this.use(express.logger());
          this.use(express.favicon());
          this.use(express.static(__dirname + '/../../public'));
          this.use(express.bodyParser());

          this.use(express.cookieParser()); // required for sessions.
          this.use(express.session({ secret: 'Skate to live, live to skate.' }));
        //PASSPORT
          this.use(passport.initialize());
          this.use(passport.session());

          this.use(this.router);

      // The database engine.
          this.datastore(require('locomotive-mongoose'));

  console.log(' --- Done executing primary settings.');
}

console.log('Done setting up configuration for all environments.');









