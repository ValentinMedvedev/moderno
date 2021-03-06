// watch следить за определенными файлами
// parallel чтобы следить из за browsersync и за watching
const {src, dest, watch, parallel, series} = require('gulp');
const scss = require('gulp-sass');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer')
const del = require('del');
const imagemin = require('gulp-imagemin');

let path ={
    build: {
        html: 'dist/',
        js: 'dist/assets/js',
        css: 'dist/assets/css',
        images: 'dist/assets/img'
    },
    src: {
        html: 'app/*.html',
        js: 'app/js/main.js',
        css: 'app/scss/*.css',
        images: 'app/images/**/*.{jpg, png, svg, gif, ico}'
    },
    watch: {
        html: "src/**/*.html",
        js: "src/assets/js/**/*.js",
        css: "src/assets/sass/**/*.scss",
        images: "src/assets/img/**/*.{jpg, png, svg, gif, ico}"
    },
    clean: "dist/**/*"
}

function browsersync(){
    browserSync.init({
        server: {
            baseDir: 'app/'
        }
    });
}

function scripts() {
    return src([
        'node_modules/jquery/dist/jquery.js',
        'app/js/main.js'
    ])
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(dest('app/js'))
        .pipe(browserSync.stream())
}

function styles(){
    return src('app/scss/style.scss')
        .pipe(scss({outputStyle: 'compressed'}))
        .pipe(concat('style.min.css'))
        .pipe(autoprefixer({
            // Отслеживание на 10 последних версий браузеров
            overrideBrowserslist: ['last 10 version', 'IE 9'],
            // Для IE11 grid
            grid: true
        }))
        .pipe(dest('app/css'))
        .pipe(browserSync.stream())
}

function images() {
    return src('app/images/**/*')
        .pipe(imagemin(
            [
                imagemin.gifsicle({interlaced: true}),
                imagemin.mozjpeg({quality: 75, progressive: true}),
                imagemin.optipng({optimizationLevel: 5}),
                imagemin.svgo({
                    plugins: [
                        {removeViewBox: true},
                        {cleanupIDs: false}
                    ]
                })
            ]
        ))
        .pipe(dest('dist/assets/images'))
}

function buildhtml() {
    return src([
        // Собрали
        'app/*.html'
    ],// Выгружаем с базовой директорией (иначе файлы выгрузятся без своих каталогов)
        {
            base: 'app'
        }
    )
    // Выгружаем
    .pipe(dest('dist'))
}

function build() {
    return src([
        // Собрали
        'app/css/style.min.css',
        'app/fonts/**/*',
        'app/js/main.min.js'
    ],// Выгружаем с базовой директорией (иначе файлы выгрузятся без своих каталогов)
        {
            base: 'app'
        }
    )
    // Выгружаем
    .pipe(dest('dist/assets'))
}

//Очистка папки
function clean(){
    return del(path.clean);
}

// watch следить за определенными файлами
function watching() {
    // за scss
    watch(['app/scss/**/*.scss'], styles);
    // за одним файлом html
    watch(['app/*.html']).on('change', browserSync.reload);
    // за *.js кроме app/js/main.min.js
    watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts);
}

exports.styles = styles;
exports.watching = watching;
// Смотри внимательно sync с маленькой буквы это название функции
exports.browsersync = browsersync;
exports.scripts = scripts;
exports.images = images;
exports.build = series(clean, images, buildhtml, build);
exports.buildhtml = buildhtml;
exports.clean = clean;
// Запускаем парралельно с помощью parallel и browsersync и watching
exports.default = parallel(styles, scripts, browsersync, watching);