import path from 'path';
import babel from 'rollup-plugin-babel';

export default {
  entry: 'index.js',
  format: 'cjs',
  dest: path.resolve(__dirname, 'dist/ng-drop-image.js'),
  plugins: [ 
      babel()
  ],
  sourceMap: true
};
