/**
 * Created by hyj on 2016/8/9.
 */
/**
 * Created by hyj on 2016/7/25.
 */
var gulp=require('gulp');

//var jshint = require('gulp-jshint');
//var sass = require('gulp-sass');
//var minifycss = require("gulp-minify-css");
var concat = require('gulp-concat');
//var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var clean = require('gulp-clean');
var htmlmin = require('gulp-htmlmin');
var option = {

    buildPath: "../www/fuehrer"
}
var option_html = {
    collapseWhitespace:true,
    collapseBooleanAttributes:true,
    removeComments:true,
    removeEmptyAttributes:true,
    removeStyleLinkTypeAttributes:true,
    minifyJS:true,
    minifyCSS:true
};

/*
gulp.task('lint', function() {
    gulp.src('./js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});*/
gulp.task('clean',function(){
    return gulp.src(option.buildPath,{
        read:false
    }).pipe(clean({force:true}));
})
/*
gulp.task('sass', function() {
    gulp.src('./scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./css'));
});*/
gulp.task("resourcecopy",function(){
    gulp.src("./build/bundle.js")
        .pipe(gulp.dest(option.buildPath+"/build/"));
    gulp.src("./*.php")
        .pipe(gulp.dest(option.buildPath+"/"));


    gulp.src("./build/fonts/*")
        .pipe(gulp.dest(option.buildPath+"/fonts/"));
    gulp.src("./resource/css/img/*")
        .pipe(gulp.dest(option.buildPath+"/img/"));
    gulp.src("./resource/css/image/*")
        .pipe(gulp.dest(option.buildPath+"/image/"));
    gulp.src("./svg/**/*")
        .pipe(gulp.dest(option.buildPath+"/svg/"));
    gulp.src("./resource/**/*")
        .pipe(gulp.dest(option.buildPath+"/resource/"));
    /*
    gulp.src("./*.html")
       .pipe(gulp.dest(option.buildPath+"/"));*/
    gulp.src("./fakedata/**/*")
        .pipe(gulp.dest(option.buildPath+"/fakedata/"));
})


gulp.task('scripts', function() {
    gulp.src('./index.html')
        .pipe(htmlmin(option_html))
        .pipe(gulp.dest(option.buildPath+'/'));
});

gulp.task('default',['clean'], function(){
    gulp.run( 'scripts','resourcecopy');
});