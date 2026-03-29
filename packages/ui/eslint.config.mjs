import { config } from "@repo/eslint-config/react-internal";

export default [
  {
    ignores: [
      'postcss.config.mjs',
      'next.config.mjs',
      'tailwind.config.ts',
      'tsup.config.ts',
      'strip-use-client.mjs',
    ],
  },
  ...config,
];
