'use strict';

module.exports = {
	app: {
		title: 'Grada.me',
    description: 'Real-life bug tracker',
		keywords: ''
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.css',
				'public/lib/font-awesome/css/font-awesome.css',
			],
			js: [
        'public/lib/lodash/dist/lodash.js',
        'public/lib/q/q.js',
        'public/lib/jquery/dist/jquery.js',
				'public/lib/angular/angular.js',
				'public/lib/angular-resource/angular-resource.js',
				'public/lib/angular-animate/angular-animate.js',
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
        'public/lib/angular-google-maps/dist/angular-google-maps.js',
        'public/lib/angular-file/angular-file.js',
        'public/lib/ngstorage/ngStorage.js'
			]
		},
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
      "public/js/app.js",
      "public/js/services/token.js",
      "public/js/services/auth.js",
      "public/js/services/signal.js",
      "public/js/services/maps.js",
      "public/js/controllers/signals.js",
      "public/js/controllers/signals.new.js",
      "public/js/controllers/signals.view.js",
      "public/js/controllers/nav.js",
      "public/js/controllers/auth.js",
      "public/js/directives/lastSignals.js",

			'public/config.js',
			'public/application.js',

			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};
