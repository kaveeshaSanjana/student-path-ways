export type UserRole = 'SystemAdmin' | 'InstituteAdmin' | 'Teacher' | 'Student' | 'AttendanceMarker';

export const AccessControl = {
  hasPermission: (userRole: UserRole, permission: Permission): boolean => {
    const rolePermissions = permissions[userRole];
    return rolePermissions ? rolePermissions.includes(permission) : false;
  }
};

// Add exam permissions to the Permission type and permissions object
type Permission = 
  | 'view-dashboard'
  | 'view-users'
  | 'create-user'
  | 'edit-user'
  | 'delete-user'
  | 'view-students'
  | 'create-student'
  | 'edit-student'
  | 'delete-student'
  | 'view-teachers'
  | 'create-teacher'
  | 'edit-teacher'
  | 'delete-teacher'
  | 'view-grades'
  | 'create-grade'
  | 'edit-grade'
  | 'delete-grade'
  | 'view-classes'
  | 'create-class'
  | 'edit-class'
  | 'delete-class'
  | 'view-subjects'
  | 'create-subject'
  | 'edit-subject'
  | 'delete-subject'
  | 'view-institutes'
  | 'create-institute'
  | 'edit-institute'
  | 'delete-institute'
  | 'view-attendance'
  | 'mark-attendance'
  | 'manage-attendance-markers'
  | 'view-grading'
  | 'view-lectures'
  | 'view-exams'
  | 'create-exam'
  | 'edit-exam'
  | 'delete-exam'
  | 'view-results'
  | 'view-profile'
  | 'view-institute-details';

const permissions: Record<UserRole, Permission[]> = {
  SystemAdmin: [
    'view-dashboard',
    'view-users', 'create-user', 'edit-user', 'delete-user',
    'view-students', 'create-student', 'edit-student', 'delete-student',
    'view-teachers', 'create-teacher', 'edit-teacher', 'delete-teacher',
    'view-grades', 'create-grade', 'edit-grade', 'delete-grade',
    'view-classes', 'create-class', 'edit-class', 'delete-class',
    'view-subjects', 'create-subject', 'edit-subject', 'delete-subject',
    'view-institutes', 'create-institute', 'edit-institute', 'delete-institute',
    'view-attendance', 'mark-attendance', 'manage-attendance-markers',
    'view-grading',
    'view-lectures',
    'view-exams', 'create-exam', 'edit-exam', 'delete-exam',
    'view-results',
    'view-profile',
    'view-institute-details'
  ],
  InstituteAdmin: [
    'view-dashboard',
    'view-users', 'create-user', 'edit-user', 'delete-user',
    'view-students', 'create-student', 'edit-student', 'delete-student',
    'view-teachers', 'create-teacher', 'edit-teacher', 'delete-teacher',
    'view-grades', 'create-grade', 'edit-grade', 'delete-grade',
    'view-classes', 'create-class', 'edit-class', 'delete-class',
    'view-subjects', 'create-subject', 'edit-subject', 'delete-subject',
    'view-attendance', 'mark-attendance', 'manage-attendance-markers',
    'view-grading',
    'view-lectures',
    'view-exams', 'create-exam', 'edit-exam', 'delete-exam',
    'view-results',
    'view-profile',
    'view-institute-details'
  ],
  Teacher: [
    'view-dashboard',
    'view-students',
    'view-classes',
    'view-subjects',
    'view-attendance', 'mark-attendance',
    'view-grading',
    'view-lectures',
    'view-exams', 'create-exam', 'edit-exam',
    'view-results',
    'view-profile'
  ],
  Student: [
    'view-dashboard',
    'view-attendance',
    'view-lectures',
    'view-exams',
    'view-results',
    'view-profile'
  ],
  AttendanceMarker: [
    'view-dashboard',
    'mark-attendance',
    'view-profile'
  ]
};
