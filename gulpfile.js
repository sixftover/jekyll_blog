"use strict"

// Dependencies
// ----------------------------------------------------------------------------
var autoprefixer = require("gulp-autoprefixer"), // CSS Vendor Prefixing
	cleanCSS = require("gulp-clean-css"), // Cleans up CSS
	connect = require("gulp-connect"), // Live Reload Server
	del = require("del"), // Deletes Files
	gulp = require("gulp"), // GULP
	gulps = require("gulp-series"), // Groups & Orders exicutible actions
	path = require("path"), // Directory variables
	plumber = require("gulp-plumber"), // Continues watching files after an error
	PrettyError = require("pretty-error"), // Tidies errors in the console
	rename = require("gulp-rename"), // Renames Files
	sass = require("gulp-sass"), // Compiles SASS to CSS
	util = require("gulp-util"), // General tools, colours & error logging
	child = require("child_process"), //
	gulp = require("gulp") // General
var pe = new PrettyError()
pe.start()
function magicUpperCaseConvert() {}

// Path Directories
// ----------------------------------------------------------------------------
var paths = {
	// Directories
	sass: "./sass/**/*.scss",
	dev: "./",
	build: "./_site/",

	// Jekyll
	jekyll_includes: "./_includes/",
	jekyll_css: "./**/*.css",

	// Sass Files
	sass_source_inline: "./sass/inline.scss",
	sass_source_build: "./sass/style.scss",
	sass_source_dev: "./sass/style-dev.scss",

	// Build
	build_css: "./_site/*.css",
	build_html: "./_site/*.html"
}

// Tasks (Gulp Series)
// ----------------------------------------------------------------------------
gulps.registerTasks({


	// [ BUILD ] sass
	convert_build_sass_inline: function(done) {
		setTimeout(function() {
			gulp
				.src(paths.sass_source_inline)
				.pipe(plumber())
				
				// Vendor prefixes
				.pipe(sass({ outputStyle: "expanded" }).on("error", sass.logError))
				.pipe(
					autoprefixer({
						browsers: ["last 2 versions"],
						cascade: true
					})
			)
				
				// Export
				.pipe(gulp.dest(paths.jekyll_includes))

				// Reload
				.pipe(connect.reload(
					console.log(util.colors.green.bold("INLINE SASS UPDATED!"))
				))

			done()
		}, 2500)
	},
	convert_build_sass: function(done) {
		setTimeout(function() {
			gulp
				.src(paths.sass_source_build)
				.pipe(plumber())
				
				// Vendor prefixes
				.pipe(sass({ outputStyle: "expanded" }).on("error", sass.logError))
				.pipe(
					autoprefixer({
						browsers: ["last 2 versions"],
						cascade: true
					})
				)
				// Export
				.pipe(gulp.dest(paths.dev))
			
			done()
		}, 2500)
	},
	// [ BUILD ] watch
	watch: function(done) {
		setTimeout(function() {
			gulp.watch(paths.sass, ["convert_build_sass", "convert_build_sass_inline"])
			//gulp.watch(paths.build_html, ["updated"])
			//gulp.watch(paths.build_css, ["updated"])

			done(console.log(util.colors.yellow.bold("[BUILD] Watching...")))
		}, 2500)
	},
	// [ BUILD ] update
	updated: function() {
		setTimeout(function() {
			
			gulp.src(paths.build_serve)
				
			.pipe(connect.reload(
				console.log(util.colors.green.bold("[BUILD] UPDATED!"))
			))
				
		}, 2500)
	},

	////
	//// Server
	////
	connect: function(done) {
		setTimeout(function() {
			connect.server({
				root: paths.build,
				livereload: "true"
			})

			done(console.log(util.colors.green.bold("\nConnected...\n")))
		}, 200)
	},

	////
	//// Clean
	////
	clean_css: function(done) {
		setTimeout(function() {
			const del = require("del")
			del(["./style.css", "style-dev.css", "./_includes/inline.css", "./inline.css"], { force: true }).then(paths => {
				console.log(
					util.colors.red("\nAll [CSS] files in "),
					util.colors.bold.red("Jekyll"),
					util.colors.red("deleted!\n"),
					util.colors.magenta(paths.join("\n"))
				)
			})
			done()
		}, 500)
	},

	////
	//// Serve CSS
	////
	compress_css: function(done) {
		setTimeout(function() {
			gulp
				.src(paths.build_css)
				.pipe(plumber())
				.pipe(
					autoprefixer({
						browsers: ["last 2 versions"],
						cascade: true
					})
				)
				.pipe(cleanCSS({ compatibility: "ie8" })) // Running the plugin
				.pipe(
					cleanCSS({ debug: true }, function(details) {
						console.log(util.colors.yellow.bold("\nMinifying CSS...\n"))
						console.log(
							util.colors.white(details.name) +
								util.colors.white.bold(" Original = ") +
								util.colors.yellow(details.stats.originalSize)
						)
						console.log(
							util.colors.white(details.name) +
								util.colors.white.bold(" Minified = ") +
								util.colors.green.bold(details.stats.minifiedSize)
						)
						console.log(util.colors.bold("\n"))
					})
				)
				// Export
				.pipe(gulp.dest(paths.build_css))

			console.log(util.colors.yellow.bold("\nCSS Prefixed & Compressed\n"))

			done()
		}, 1000)
	}
}),
// Execute Tasks
// ----------------------------------------------------------------------------
gulp.task("default", function() {
	console.log(
		util.colors.green.bold("OllieJT Quickstart: ") +
			util.colors.red.bold("Learn more here ") +
			util.colors.blue("https://github.com/OllieJT/quickstart")
	)
})

gulps.registerSeries("serve",[
		// CSS
		"clean_css",
		"convert_build_sass",
		"convert_build_sass_inline",

		// Localhost
		"connect",
		"watch"
	],
	function() {
		console.log(util.colors.green.bold("DEV MODE: ") + util.colors.white.bold("ENABLED") + util.colors.red.bold(" Watching..."))
	}
)

gulps.registerSeries("build",[
		// CSS
		"clean_css",
		"convert_build_sass",
		"convert_build_sass_inline",

		// Compress CSS
		"compress_css"
	],
	function() {
		console.log(util.colors.green.bold("PUBLISH: ") + util.colors.white.bold("COMPLETED") + util.colors.red.bold("Site Built"))
	}
)

// Pretty Error
// ----------------------------------------------------------------------------
pe.appendStyle({
	// this is a simple selector to the element that says 'Error'
	"pretty-error > header > title > kind": {
		// which we can hide:
		display: "none"
	},

	// the 'colon' after 'Error':
	"pretty-error > header > colon": {
		// we hide that too:
		display: "none"
	},

	// our error message
	"pretty-error > header > message": {
		// let's change its color:
		color: "bright-white",

		// we can use black, red, green, yellow, blue, magenta, cyan, white,
		// grey, bright-red, bright-green, bright-yellow, bright-blue,
		// bright-magenta, bright-cyan, and bright-white

		// we can also change the background color:
		background: "cyan",

		// it understands paddings too!
		padding: "0 1" // top/bottom left/right
	},

	// each trace item ...
	"pretty-error > trace > item": {
		// ... can have a margin ...
		marginLeft: 2,

		// ... and a bullet character!
		bullet: '"<grey>o</grey>"'

		// Notes on bullets:
		//
		// The string inside the quotation mark gets used as the character
		// to show for the bullet point.
		//
		// You can set its color/background color using tags.
		//
		// This example sets the background color to white, and the text color
		// to cyan, the character will be a hyphen with a space character
		// on each side:
		// example: '"<bg-white><cyan> - </cyan></bg-white>"'
		//
		// Note that we should use a margin of 3, since the bullet will be
		// 3 characters long.
	},

	"pretty-error > trace > item > header > pointer > file": { color: "bright-cyan" },
	"pretty-error > trace > item > header > pointer > colon": { color: "cyan" },
	"pretty-error > trace > item > header > pointer > line": { color: "bright-cyan" },
	"pretty-error > trace > item > header > what": { color: "bright-white" },
	"pretty-error > trace > item > footer > addr": { display: "none" }
})

// Test Console Error
// ----------------------------------------------------------------------------
gulp.task("console", function() {
	console.log(util.colors.blue("This") + " is " + util.colors.red("now") + util.colors.green(" working"))
})
