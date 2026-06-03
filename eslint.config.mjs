import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

const eslintConfig = defineConfig([
  ...tseslint.configs.recommended,
  globalIgnores(['dist/**', '.output/**', '.source/**', 'src/routeTree.gen.ts']),
]);

export default eslintConfig;
