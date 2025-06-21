
export type Permission = 
  // Dashboard permissions
  | 'view-dashboard'
  | 'view-analytics'
  
  // Institute permissions
  | 'view-institutes'
  | 'create-institute'
  | 'edit-institute'
  | 'delete-institute'
  | 'manage-institute-users'
  
  // Class permissions
  | 'view-classes'
  | 'create-class'
  | 'edit-class'
  | 'delete-class'
  | 'assign-class-teacher'
  
  // Subject permissions
  | 'view-subjects'
  | 'create-subject'
  | 'edit-subject'
  | 'delete-subject'
  | 'assign-subject-teacher'
  
  // Attendance permissions
  | 'view-attendance'
  | 'view-online-attendance'
  | 'view-physical-attendance'
  | 'mark-attendance'
  | 'mark-attendance-qr'
  | 'mark-attendance-manual'
  | 'mark-attendance-tick'
  | 'edit-attendance'
  | 'delete-attendance'
  
  // Lecture permissions
  | 'view-lectures'
  | 'create-lecture'
  | 'edit-lecture'
  | 'delete-lecture'
  | 'view-online-lectures'
  | 'view-physical-lectures'
  
  // Results permissions
  | 'view-results'
  | 'create-result'
  | 'edit-result'
  | 'delete-result'
  | 'publish-result'
  
  // Payment permissions
  | 'view-payments'
  | 'create-payment'
  | 'edit-payment'
  | 'delete-payment'
  | 'process-payment'
  
  // User permissions
  | 'view-users'
  | 'create-user'
  | 'edit-user'
  | 'delete-user'
  | 'view-profile'
  | 'edit-profile';

export const rolePermissions: Record<string, Permission[]> = {
  SystemAdmin: [
    'view-dashboard',
    'view-analytics',
    'view-institutes',
    'create-institute',
    'edit-institute',
    'delete-institute',
    'manage-institute-users',
    'view-classes',
    'create-class',
    'edit-class',
    'delete-class',
    'assign-class-teacher',
    'view-subjects',
    'create-subject',
    'edit-subject',
    'delete-subject',
    'assign-subject-teacher',
    'view-attendance',
    'view-online-attendance',
    'view-physical-attendance',
    'mark-attendance',
    'mark-attendance-qr',
    'mark-attendance-manual',
    'mark-attendance-tick',
    'edit-attendance',
    'delete-attendance',
    'view-lectures',
    'create-lecture',
    'edit-lecture',
    'delete-lecture',
    'view-online-lectures',
    'view-physical-lectures',
    'view-results',
    'create-result',
    'edit-result',
    'delete-result',
    'publish-result',
    'view-payments',
    'create-payment',
    'edit-payment',
    'delete-payment',
    'process-payment',
    'view-users',
    'create-user',
    'edit-user',
    'delete-user',
    'view-profile',
    'edit-profile'
  ],
  
  InstituteAdmin: [
    'view-dashboard',
    'view-analytics',
    'view-institutes',
    'edit-institute',
    'manage-institute-users',
    'view-classes',
    'create-class',
    'edit-class',
    'delete-class',
    'assign-class-teacher',
    'view-subjects',
    'create-subject',
    'edit-subject',
    'delete-subject',
    'assign-subject-teacher',
    'view-attendance',
    'view-online-attendance',
    'view-physical-attendance',
    'mark-attendance',
    'mark-attendance-qr',
    'mark-attendance-manual',
    'mark-attendance-tick',
    'edit-attendance',
    'view-lectures',
    'create-lecture',
    'edit-lecture',
    'delete-lecture',
    'view-online-lectures',
    'view-physical-lectures',
    'view-results',
    'create-result',
    'edit-result',
    'delete-result',
    'publish-result',
    'view-payments',
    'create-payment',
    'edit-payment',
    'process-payment',
    'view-users',
    'create-user',
    'edit-user',
    'view-profile',
    'edit-profile'
  ],
  
  Teacher: [
    'view-dashboard',
    'view-institutes',
    'view-classes',
    'edit-class',
    'view-subjects',
    'edit-subject',
    'view-attendance',
    'view-online-attendance',
    'view-physical-attendance',
    'mark-attendance',
    'mark-attendance-qr',
    'mark-attendance-manual',
    'mark-attendance-tick',
    'edit-attendance',
    'view-lectures',
    'create-lecture',
    'edit-lecture',
    'view-online-lectures',
    'view-physical-lectures',
    'view-results',
    'create-result',
    'edit-result',
    'publish-result',
    'view-payments',
    'view-profile',
    'edit-profile'
  ],
  
  AttendanceMarker: [
    'view-dashboard',
    'view-institutes',
    'view-classes',
    'view-subjects',
    'view-attendance',
    'view-online-attendance',
    'view-physical-attendance',
    'mark-attendance',
    'mark-attendance-qr',
    'mark-attendance-manual',
    'mark-attendance-tick',
    'view-payments',
    'view-profile',
    'edit-profile'
  ],
  
  Student: [
    'view-dashboard',
    'view-institutes',
    'view-classes',
    'view-subjects',
    'view-attendance',
    'view-online-attendance',
    'view-physical-attendance',
    'view-lectures',
    'view-online-lectures',
    'view-physical-lectures',
    'view-results',
    'view-payments',
    'view-profile',
    'edit-profile'
  ]
};

export class AccessControl {
  static hasPermission(userRole: string, permission: Permission): boolean {
    const permissions = rolePermissions[userRole] || [];
    return permissions.includes(permission);
  }
  
  static hasAnyPermission(userRole: string, permissions: Permission[]): boolean {
    return permissions.some(permission => this.hasPermission(userRole, permission));
  }
  
  static hasAllPermissions(userRole: string, permissions: Permission[]): boolean {
    return permissions.every(permission => this.hasPermission(userRole, permission));
  }
  
  static getPermissions(userRole: string): Permission[] {
    return rolePermissions[userRole] || [];
  }
}
