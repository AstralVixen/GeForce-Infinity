import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2024,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        // Node.js globals
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        global: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        alert: 'readonly',
        // Web APIs
        Response: 'readonly',
        URL: 'readonly',
        fetch: 'readonly',
        // TypeScript/React globals
        React: 'readonly',
        JSX: 'readonly',
        // DOM types
        HTMLElement: 'readonly',
        HTMLDivElement: 'readonly',
        HTMLSelectElement: 'readonly',
        HTMLButtonElement: 'readonly',
        SVGElement: 'readonly',
        Event: 'readonly',
        MouseEvent: 'readonly',
        KeyboardEvent: 'readonly',
        Node: 'readonly',
        // Electron
        Electron: 'readonly',
        // Build tools
        Bun: 'readonly'
      }
    },
    plugins: {
      '@typescript-eslint': typescript
    },
    rules: {
      'no-console': 'off',
      'no-undef': 'off', // TypeScript handles this
      'no-unused-vars': 'off', // Use TypeScript rule instead
      '@typescript-eslint/no-unused-vars': ['warn', { 
        'argsIgnorePattern': '^_|^args|^event|^callback|^config|^options|^activity|^listener|^props|^err$|^updates|^element',
        'varsIgnorePattern': '^_|^User|^createContext|^JSX|^Element|^IntrinsicElements|^ElementClass|^ElementAttributesProperty|^ElementChildrenAttribute|^IntrinsicAttributes|^IntrinsicClassAttributes|^Window|^shell|^gameTitle|^useEffect|^useState|^useContext',
        'ignoreRestSiblings': true
      }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/triple-slash-reference': 'off',
      '@typescript-eslint/no-empty-object-type': 'off'
    }
  },
  {
    files: ['**/*.d.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/triple-slash-reference': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      'no-unused-vars': 'off'
    }
  },
  {
    ignores: ['node_modules/**', 'dist/**', 'builds/**']
  }
];