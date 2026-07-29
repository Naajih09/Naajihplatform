UPDATE "User"
SET "adminPermissions" = ARRAY[
  'dashboard',
  'users',
  'pitches',
  'verification',
  'academy',
  'messages',
  'audit',
  'settings'
]::TEXT[]
WHERE "role" = 'ADMIN'
  AND cardinality("adminPermissions") = 0;
