import z from 'zod';

export const PASSWORD_PATTERN_SPECS = [
  {
    message: 'Password must be at least 8 characters long',
    pattern: /^.{8,}$/,
  },
  {
    message: 'Password must contain at least 1 uppercase letter',
    pattern: /[A-Z]/,
  },
  {
    message: 'Password must contain at least 1 lowercase letter',
    pattern: /[a-z]/,
  },
];

// export const PASSWORD_PATTERN_REGEX =/^(?=)

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type TLoginSchema = z.infer<typeof loginSchema>;
