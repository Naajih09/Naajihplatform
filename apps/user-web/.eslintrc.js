module.exports = {
  root: true,
  extends: ['../../.eslintrc.js'], // if you have a shared config; otherwise drop this line
  parserOptions: {
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
};
