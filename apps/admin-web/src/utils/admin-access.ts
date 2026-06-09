export type AdminPermission =
  | 'dashboard'
  | 'users'
  | 'pitches'
  | 'verification'
  | 'academy'
  | 'messages'
  | 'audit'
  | 'settings';

export const ADMIN_PERMISSIONS: Array<{
  id: AdminPermission;
  label: string;
  description: string;
}> = [
  {
    id: 'dashboard',
    label: 'Overview',
    description: 'View platform metrics and recent activity.',
  },
  {
    id: 'users',
    label: 'Users',
    description: 'Manage user accounts, roles, and status.',
  },
  {
    id: 'pitches',
    label: 'Pitches',
    description: 'Review, approve, and reject pitch submissions.',
  },
  {
    id: 'verification',
    label: 'Verification',
    description: 'Review KYC and account verification requests.',
  },
  {
    id: 'academy',
    label: 'Academy',
    description: 'Manage programs, enrollments, and submissions.',
  },
  {
    id: 'messages',
    label: 'Messages',
    description: 'Review reported and safety-flagged conversations.',
  },
  {
    id: 'audit',
    label: 'Audit Log',
    description: 'View admin activity and system events.',
  },
  {
    id: 'settings',
    label: 'Settings',
    description: 'Manage admin team access and security settings.',
  },
];

export const getStoredAdminPermissions = (): AdminPermission[] => {
  try {
    const raw = localStorage.getItem('adminPermissions');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((permission): permission is AdminPermission =>
      ADMIN_PERMISSIONS.some((item) => item.id === permission),
    );
  } catch {
    return [];
  }
};

export const storeAdminPermissions = (permissions?: unknown) => {
  if (!Array.isArray(permissions)) {
    localStorage.removeItem('adminPermissions');
    return;
  }

  localStorage.setItem('adminPermissions', JSON.stringify(permissions));
};

export const hasAdminPermission = (permission: AdminPermission) => {
  const permissions = getStoredAdminPermissions();

  if (permissions.length === 0) {
    return true;
  }

  return permissions.includes(permission);
};
