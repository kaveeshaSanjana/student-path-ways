
export type UserRole = 'SystemAdmin' | 'InstituteAdmin' | 'Teacher' | 'Student';

export type Permission = 
  // Dashboard
  | 'view-dashboard'
  // Users
  | 'view-users' | 'create-user' | 'edit-user' | 'delete-user'
  // Students
  | 'view-students' | 'create-student' | 'edit-student' | 'delete-student'
  // Teachers
  | 'view-teachers' | 'create-teacher' | 'edit-teacher' | 'delete-teacher'
  // Grades
  | 'view-grades' | 'create-grade' | 'edit-grade' | 'delete-grade' | 'view-grade-details'
  // Classes
  | 'view-classes' | 'create-class' | 'edit-class' | 'delete-class' | 'view-class-details'
  // Subjects
  | 'view-subjects' | 'create-subject' | 'edit-subject' | 'delete-subject'
  // Institutes
  | 'view-institutes' | 'create-institute' | 'edit-institute' | 'delete-institute'
  // Attendance
  | 'view-attendance' | 'mark-attendance' | 'edit-attendance' | 'delete-attendance' | 'manage-attendance-markers' | 'create-attendance-marker' | 'edit-attendance-marker' | 'delete-attendance-marker' | 'view-attendance-marker-details'
  // Grading & Assessment
  | 'view-grading' | 'grade-assignments' | 'manage-grades'
  // Lectures
  | 'view-lectures' | 'create-lecture' | 'edit-lecture' | 'delete-lecture'
  // Results
  | 'view-results' | 'generate-results'
  // Profile & Settings
  | 'view-profile' | 'edit-profile' | 'view-institute-details';

const rolePermissions: Record<UserRole, Permission[]> = {
  SystemAdmin: [
    // All permissions for system admin
    'view-dashboard',
    'view-users', 'create-user', 'edit-user', 'delete-user',
    'view-students', 'create-student', 'edit-student', 'delete-student',
    'view-teachers', 'create-teacher', 'edit-teacher', 'delete-teacher',
    'view-grades', 'create-grade', 'edit-grade', 'delete-grade', 'view-grade-details',
    'view-classes', 'create-class', 'edit-class', 'delete-class', 'view-class-details',
    'view-subjects', 'create-subject', 'edit-subject', 'delete-subject',
    'view-institutes', 'create-institute', 'edit-institute', 'delete-institute',
    'view-attendance', 'mark-attendance', 'edit-attendance', 'delete-attendance', 'manage-attendance-markers', 'create-attendance-marker', 'edit-attendance-marker', 'delete-attendance-marker', 'view-attendance-marker-details',
    'view-grading', 'grade-assignments', 'manage-grades',
    'view-lectures', 'create-lecture', 'edit-lecture', 'delete-lecture',
    'view-results', 'generate-results',
    'view-profile', 'edit-profile', 'view-institute-details'
  ],
  InstituteAdmin: [
    'view-dashboard',
    'view-users', 'create-user', 'edit-user', 'delete-user',
    'view-students', 'create-student', 'edit-student', 'delete-student',
    'view-teachers', 'create-teacher', 'edit-teacher', 'delete-teacher',
    'view-grades', 'create-grade', 'edit-grade', 'delete-grade', 'view-grade-details',
    'view-classes', 'create-class', 'edit-class', 'delete-class', 'view-class-details',
    'view-subjects', 'create-subject', 'edit-subject', 'delete-subject',
    'view-institutes',
    'view-attendance', 'mark-attendance', 'edit-attendance', 'delete-attendance', 'manage-attendance-markers', 'create-attendance-marker', 'edit-attendance-marker', 'delete-attendance-marker', 'view-attendance-marker-details',
    'view-grading', 'grade-assignments', 'manage-grades',
    'view-lectures', 'create-lecture', 'edit-lecture', 'delete-lecture',
    'view-results', 'generate-results',
    'view-profile', 'edit-profile', 'view-institute-details'
  ],
  Teacher: [
    'view-dashboard',
    'view-students', 'view-teachers',
    'view-grades', 'view-grade-details',
    'view-classes', 'view-class-details',
    'view-subjects',
    'view-attendance', 'mark-attendance', 'edit-attendance', 'view-attendance-marker-details',
    'view-grading', 'grade-assignments',
    'view-lectures', 'create-lecture', 'edit-lecture',
    'view-results',
    'view-profile', 'edit-profile', 'view-institute-details'
  ],
  Student: [
    'view-dashboard',
    'view-attendance',
    'view-lectures',
    'view-results',
    'view-profile', 'edit-profile'
  ]
};

export class AccessControl {
  static hasPermission(userRole: UserRole, permission: Permission): boolean {
    return rolePermissions[userRole]?.includes(permission) || false;
  }

  static getUserPermissions(userRole: UserRole): Permission[] {
    return rolePermissions[userRole] || [];
  }

  static canAccessResource(userRole: UserRole, resourcePermissions: Permission[]): boolean {
    const userPermissions = this.getUserPermissions(userRole);
    return resourcePermissions.some(permission => userPermissions.includes(permission));
  }
}
