
import { UserRole } from '@/contexts/AuthContext';

export class AccessControl {
  private static rolePermissions: Record<UserRole, string[]> = {
    SystemAdmin: [
      // All permissions
      'view-institutes', 'create-institute', 'edit-institute', 'delete-institute',
      'view-classes', 'create-class', 'edit-class', 'delete-class',
      'view-subjects', 'create-subject', 'edit-subject', 'delete-subject',
      'view-students', 'create-student', 'edit-student', 'delete-student', 'view-student-details',
      'view-teachers', 'create-teacher', 'edit-teacher', 'delete-teacher', 'view-teacher-details',
      'view-attendance-markers', 'create-attendance-marker', 'edit-attendance-marker', 'delete-attendance-marker', 'view-attendance-marker-details',
      'view-users', 'create-user', 'edit-user', 'delete-user',
      'view-lectures', 'create-lecture', 'edit-lecture', 'delete-lecture',
      'view-results', 'create-result', 'edit-result', 'delete-result',
      'view-attendance', 'mark-attendance', 'edit-attendance', 'export-attendance',
      'view-payments', 'create-payment', 'edit-payment', 'delete-payment'
    ],
    InstituteAdmin: [
      'view-classes', 'create-class', 'edit-class', 'delete-class',
      'view-subjects', 'create-subject', 'edit-subject', 'delete-subject',
      'view-students', 'create-student', 'edit-student', 'delete-student', 'view-student-details',
      'view-teachers', 'create-teacher', 'edit-teacher', 'delete-teacher', 'view-teacher-details',
      'view-attendance-markers', 'create-attendance-marker', 'edit-attendance-marker', 'delete-attendance-marker', 'view-attendance-marker-details',
      'view-users', 'create-user', 'edit-user', 'delete-user',
      'view-lectures', 'create-lecture', 'edit-lecture', 'delete-lecture',
      'view-results', 'create-result', 'edit-result', 'delete-result',
      'view-attendance', 'mark-attendance', 'edit-attendance', 'export-attendance',
      'view-payments', 'create-payment', 'edit-payment',
      'edit-institute'
    ],
    AttendanceMarker: [
      'view-classes', 'view-subjects', 'view-students', 'view-student-details',
      'mark-attendance', 'view-attendance',
      'view-payments'
    ],
    Teacher: [
      'view-classes', 'view-subjects', 'view-students', 'view-student-details',
      'view-lectures', 'create-lecture', 'edit-lecture',
      'view-results', 'create-result', 'edit-result',
      'view-attendance', 'mark-attendance', 'export-attendance',
      'view-payments'
    ],
    Student: [
      'view-classes', 'view-subjects',
      'view-lectures', 'view-results', 'view-attendance',
      'view-payments'
    ]
  };

  static hasPermission(role: UserRole, permission: string): boolean {
    return this.rolePermissions[role]?.includes(permission) || false;
  }

  static getRolePermissions(role: UserRole): string[] {
    return this.rolePermissions[role] || [];
  }

  static canAccessPage(role: UserRole, page: string): boolean {
    const pagePermissions: Record<string, string> = {
      'dashboard': 'view-dashboard',
      'institutes': 'view-institutes',
      'classes': 'view-classes',
      'subjects': 'view-subjects',
      'students': 'view-students',
      'teachers': 'view-teachers',
      'attendance-markers': 'view-attendance-markers',
      'users': 'view-users',
      'lectures': 'view-lectures',
      'results': 'view-results',
      'attendance': 'view-attendance',
      'attendance-marking': 'mark-attendance',
      'payments': 'view-payments',
      'profile': 'view-profile'
    };

    const requiredPermission = pagePermissions[page];
    if (!requiredPermission) return true; // Allow access to undefined pages

    return this.hasPermission(role, requiredPermission);
  }
}
