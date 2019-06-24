/* global process __dirname:true */
var gulp = require("gulp");

var paths = {
    js: [
        "gulpfile.js",
        "index.js",
        "app/*.js",
        "client/*/main.js",
        "client/*/viewmodels/*.js"
    ],
    app: [
        "client/index.html",
        "client/*/main.js",
        "client/*/viewmodels/*.js",
        "client/*/views/*.html"
    ]
};

var eslint = require("gulp-eslint");
gulp.task("eslint", function() {
    gulp.src(paths.js)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

var browserSync = require("browser-sync").create();
gulp.task("browser-sync", function() {
    browserSync.init(null, {
        baseDir: "./client",
        proxy: {
            target: "http://localhost:3000"
        },
        open: false,
        port: 7000
    });

    gulp.watch(paths.app).on("change", browserSync.reload);
});

var nodemon = require("gulp-nodemon");
gulp.task("nodemon", function(cb) {
    var started = false;

    nodemon({
        script: "index.js"
    }).on("start", function() {
        if (!started) {
            cb();
            started = true;
        }
    });
});

gulp.task("default", ["nodemon","browser-sync"]);
