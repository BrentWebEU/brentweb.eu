/**
 * Tailwind v4 is the only plugin needed.
 *
 * `autoprefixer` was removed because @tailwindcss/postcss runs Lightning CSS
 * over its output, which handles vendor prefixing from the browserslist key in
 * package.json plus nesting and modern-syntax lowering. Running both is
 * redundant work and the two can fight over the same declarations.
 *
 * `postcss-custom-media` was removed because styles/breakpoints.css had zero
 * consumers — its 640/768/1024px values map exactly onto Tailwind's sm/md/lg.
 */
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
