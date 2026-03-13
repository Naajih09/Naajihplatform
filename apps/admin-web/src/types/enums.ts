export const UserRole = {
  ENTREPRENEUR: 'ENTREPRENEUR',
  INVESTOR: 'INVESTOR',
  ASPIRING_BUSINESS_OWNER: 'ASPIRING_BUSINESS_OWNER',
  ADMIN: 'ADMIN',
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];