import typescript from 'rollup-plugin-typescript2';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
  'crypto',
  'fs',
];

export default {
  input: 'src/index.ts',
  external,
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
    {
      file: pkg.module,
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    typescript({
      typescript: require('typescript'),
      tsconfig: './tsconfig.json',
      clean: true,
    }),
  ],
};