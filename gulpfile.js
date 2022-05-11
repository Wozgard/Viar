
let project_folder = require('path').basename(__dirname);
let source_folder = "#src";

let fs = require('fs');

let path = {
   build: {
      html: "docs/",
      css: "docs/css/",
      js: "docs/js/",
      img: "docs/img/",
      fonts: "docs/fonts/",
      json: "docs/json/",
   },
   src: {
      html: [source_folder + "/*.html", "!" + source_folder + "/_*.html"],
      fav: source_folder + "/*.ico",
      css: source_folder + "/scss/style.scss",
      //swiper_css: source_folder + "/scss/swiper_bundle.min.css",
      js: source_folder + "/js/script.js",
      //swiper_js: source_folder + "/js/swiper_bundle.min.js",
      img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
      fonts: source_folder + "/fonts/*.ttf",
      json: source_folder + "/json/*.json",
   },
   watch: {
      html: source_folder + "**/*.html",
      css: source_folder + "/scss/**/*.scss",
      js: source_folder + "/js/**/*.js",
      img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
      json: source_folder + "/json/*.json",
   },
   clean: "./docs/"
}

let { src, dest } = require('gulp'),
   gulp = require('gulp'),
   browsersync = require('browser-sync').create(),
   fileinclude = require('gulp-file-include'),
   del = require('del'),
   scss = require("gulp-sass")(require('sass')),
   autoprefixer = require('gulp-autoprefixer'),
   group_media = require('gulp-group-css-media-queries'),
   clean_css = require('gulp-clean-css'),
   rename = require('gulp-rename'),
   uglify = require('gulp-uglify-es').default,
   imagemin = require('gulp-imagemin'),
   webp = require('gulp-webp'),
   webphtml = require('gulp-webp-html'),
   webpcss = require('gulp-webpcss'),
   svgSprite = require('gulp-svg-sprite'),
   ttf2woff = require('gulp-ttf2woff'),
   ttf2woff2 = require('gulp-ttf2woff2'),
   fonter = require('gulp-fonter'),
   plumber = require('gulp-plumber');


function browserSync(params) {
   browsersync.init({
      server: {
         baseDir: "./docs/"
      },
      port: 3000,
      notify: false,
   })
}

function json() {
   return src(path.src.json)
      .pipe(plumber())
      .pipe(dest(path.build.json));
}

function html() {
   return src(path.src.html)
      .pipe(plumber())
      .pipe(fileinclude())
      .pipe(webphtml())
      .pipe(dest(path.build.html))
      .pipe(browsersync.stream());
}

function favicon() {
   return src(path.src.fav)
      .pipe(plumber())
      .pipe(dest(path.build.html));
}

function css() {
   return src(path.src.css)
      .pipe(plumber())
      .pipe(
         scss({
            outputStyle: "expanded"
         })
      )
      .pipe(
         group_media()
      )
      .pipe(
         autoprefixer({
            overrideBrowserslist: ['last 5 versions'],
            cascade: true
         })
      )
      .pipe(webpcss())
      .pipe(dest(path.build.css))
      .pipe(clean_css())
      .pipe(
         rename({
            extname: ".min.css"
         })
      )
      .pipe(dest(path.build.css))
      .pipe(browsersync.stream());
}

function js() {
   return src(path.src.js)
      .pipe(plumber())
      .pipe(fileinclude())
      .pipe(dest(path.build.js))
      .pipe(
         uglify()
      )
      .pipe(
         rename({
            extname: ".min.js"
         })
      )
      .pipe(dest(path.build.js))
      .pipe(browsersync.stream());
}


function images() {
   return src(path.src.img)
      .pipe(plumber())
      .pipe(
         webp({
            quality: 70
         })
      )
      .pipe(dest(path.build.img))
      .pipe(src(path.src.img))
      .pipe(
         imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            interlaced: true,
            optimizationLevel: 3 //0 to 7
         })
      )
      .pipe(dest(path.build.img))
      .pipe(browsersync.stream());
}

function fonts(params) {
   src(path.src.fonts)
      .pipe(plumber())
      .pipe(ttf2woff())
      .pipe(dest(path.build.fonts));
   return src(path.src.fonts)
      .pipe(ttf2woff2())
      .pipe(dest(path.build.fonts));
}

gulp.task('otf2ttf', function () {
   return src([source_folder + '/fonts/*.otf'])
      .pipe(fonter({
         formats: ['ttf']
      }))
      .pipe(dest(source_folder + '/fonts/'));
})

gulp.task('svgSprite', function () {
   return gulp.src([source_folder + '/iconsprite/*.svg'])
      .pipe(svgSprite({
         mode: {
            stack: {
               sprite: '../icons/icons.svg',
               //example: true
            }
         },
      }
      ))
      .pipe(dest(path.build.img));
})

function fontsStyle(params) {
   let file_content = fs.readFileSync(source_folder + '/scss/fonts.scss');
   if (file_content == '') {
      fs.writeFile(source_folder + '/scss/fonts.scss', '', cb);
      return fs.readdir(path.build.fonts, function (err, items) {
         if (items) {
            let c_fontname;
            for (var i = 0; i < items.length; i++) {
               let fontname = items[i].split('.');
               fontname = fontname[0];
               if (c_fontname != fontname) {
                  fs.appendFile(source_folder + '/scss/fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
               }
               c_fontname = fontname;
            }
         }
      })
   }
}

function cb() { }

/*
function swiper_js(){
   return src(path.src.swiper_js)
      .pipe(plumber())
      .pipe(fileinclude())
      .pipe(dest(path.build.js));
}
function swiper_css(){
   return src(path.src.swiper_css)
      .pipe(plumber())
      .pipe(fileinclude())
      .pipe(dest(path.build.css));
}*/

function watchFiles(params) {
   gulp.watch([path.watch.html], html);
   gulp.watch([path.watch.css], css);
   gulp.watch([path.watch.js], js);
   gulp.watch([path.watch.img], images);
   gulp.watch([path.watch.json], json);
}

function clean(params) {
   return del(path.clean);
}

let build = gulp.series(clean, gulp.parallel(js, favicon, css, html, json, images, fonts/*, swiper_js, swiper_css*/), fontsStyle);
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.favicon = favicon;
exports.json = json;
//exports.swiper_css = swiper_css;
//exports.swiper_js = swiper_js;
exports.fontsStyle = fontsStyle;
exports.fonts = fonts;
exports.images = images;
exports.js = js
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;