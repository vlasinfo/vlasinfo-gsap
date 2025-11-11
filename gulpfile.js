// gulpfile.js (ESM version)
import gulp from 'gulp';
import gulpSass from 'gulp-sass';
import sassCompiler from 'sass';
const sass = gulpSass(sassCompiler);
import cleanCSS from 'gulp-clean-css';
import rename from 'gulp-rename';
import sourcemaps from 'gulp-sourcemaps';
import browserSync from 'browser-sync';
import gulpIf from 'gulp-if';
import fileInclude from 'gulp-file-include';
import replace from 'gulp-replace';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import uglify from 'gulp-uglify';
import webpack from 'webpack-stream';
import { deleteAsync } from 'del';

const server = browserSync.create();

// Config
const paths = {
  html: {
    src: 'src/html/**/*.html',
    pages: ['src/html/*.html', '!src/html/parts/**/*.html'],
    dest: 'dist/'
  },
  styles: {
    src: 'src/scss/**/*.scss',
    dest: 'dist/assets/css/'
  },
  scripts: {
    src: 'src/js/**/*.js',
    entry: 'src/js/main.js',
    dest: 'dist/assets/js/'
  },
  images: {
    src: 'src/images/**/*.{jpg,jpeg,png,svg,gif,webp}',
    dest: 'dist/assets/images/'
  },
  fonts: {
    src: 'src/fonts/**/*',
    dest: 'dist/assets/fonts/'
  }
};

const isProd = process.env.NODE_ENV === 'production';
const cacheBust = Date.now();

// Tasks
export function clean() {
  return deleteAsync(['dist']);
}

export function html() {
  return gulp.src(paths.html.pages)
    .pipe(fileInclude({
      prefix: '@@',
      basepath: '@file',
      context: {
        siteName: 'My Project',
        cacheBust: cacheBust
      }
    }))
    .pipe(gulpIf(isProd, replace(
      /(href="[^"]*\.css"|src="[^"]*\.js")/g,
      (match) => {
        if (match.includes('.css')) {
          return match.replace('.css"', `.css?v=${cacheBust}"`);
        }
        if (match.includes('.js')) {
          return match.replace('.js"', `.js?v=${cacheBust}"`);
        }
        return match;
      }
    )))
    .pipe(gulp.dest(paths.html.dest))
    .pipe(server.stream());
}

export function styles() {
  return gulp.src(paths.styles.src)
    .pipe(gulpIf(!isProd, sourcemaps.init()))
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(gulpIf(isProd, cleanCSS({ level: 2 })))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulpIf(!isProd, sourcemaps.write('.')))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(server.stream());
}

// Додайте цю задачу для обробки CSS з node_modules
function stylesVendor() {
    return gulp.src([
        'node_modules/swiper/swiper-bundle.css'
    ])
    .pipe(gulp.dest('dist/css/vendor'))
    .pipe(browserSync.stream());
}

// Оновіть задачу scripts для додавання CSS-loader
function scripts() {
    return gulp.src(paths.scripts.entry)
    .pipe(webpack({
        mode: isProd ? 'production' : 'development',
        output: {
            filename: 'main.min.js'
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }
                },
                {
                    test: /\.css$/i,
                    use: ['style-loader', 'css-loader'],
                }
            ]
        },
        resolve: {
            extensions: ['.js', '.css']
        },
        devtool: !isProd ? 'source-map' : false
    }))
    .pipe(gulpIf(isProd, uglify()))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(browserSync.stream());
}

export function images() {
  return gulp.src(paths.images.src)
    .pipe(gulp.dest(paths.images.dest))
    .pipe(server.stream());
}

export function fonts() {
  return gulp.src(paths.fonts.src)
    .pipe(gulp.dest(paths.fonts.dest))
    .pipe(server.stream());
}

export function serve() {
  server.init({
    server: { baseDir: 'dist/' },
    notify: false,
    open: true,
    port: 3000
  });
}

export function watch() {
  gulp.watch(paths.html.src, html);
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.images.src, images);
  gulp.watch(paths.fonts.src, fonts);
}

// Build commands
const build = gulp.series(
  clean,
  gulp.parallel(html, styles, scripts, images, fonts)
);

const dev = gulp.series(build, gulp.parallel(serve, watch));

export { build, dev };
export default dev;