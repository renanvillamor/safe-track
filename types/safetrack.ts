export type UserRole = "guardian" | "child" | "admin";

export type DataSource = "supabase" | "mock";

export interface Guardian {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Child {
  id: string;
  guardianId: string;
  fullName: string;
  avatarUrl?: string;
  dateOfBirth?: string;
  smartwatchDeviceId?: string;
  locationSharingEnabled: boolean;
  createdAt: string;
}

export interface Administrator {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  createdAt: string;
}

export interface SmartwatchDevice {
  id: string;
  childId: string;
  deviceName: string;
  serialNumber: string;
  batteryLevel?: number;
  isOnline: boolean;
  lastSeenAt?: string;
}

export interface LocationLog {
  id: string;
  childId: string;
  childName: string;
  guardianId?: string;
  latitude: number;
  longitude: number;
  accuracyMeters: number;
  source: "smartwatch" | "phone" | "manual";
  recordedAt: string;
}

export interface Geofence {
  id: string;
  childId: string;
  name: string;
  centerLatitude: number;
  centerLongitude: number;
  radiusMeters: number;
  isActive: boolean;
}

export interface GeofenceEvent {
  id: string;
  geofenceId: string;
  childId: string;
  eventType: "enter" | "exit";
  occurredAt: string;
}

export type SosAlertStatus = "active" | "acknowledged" | "resolved";
export type SosActivationMethod = "manual_button" | "smartwatch" | "app_test" | "voice";

export interface SosAlert {
  id: string;
  childId: string;
  childName: string;
  guardianId: string;
  status: SosAlertStatus;
  activationMethod: SosActivationMethod;
  isTestAlert: boolean;
  locationLogId?: string;
  triggeredAt: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
}

export type ActivityReportType = "daily_summary" | "location_history" | "sos_history" | "weekly_summary";
export type ActivityReportStatus = "generating" | "ready" | "failed";
export type ActivityReportExportFormat = "pdf" | "excel";

export interface ActivityReport {
  id: string;
  childId: string;
  childName: string;
  guardianId?: string;
  generatedByAdminId?: string;
  title: string;
  type: ActivityReportType;
  status: ActivityReportStatus;
  exportFormat: ActivityReportExportFormat;
  rangeStart: string;
  rangeEnd: string;
  generatedAt: string;
}

export interface GuardianPushToken {
  id: string;
  guardianId: string;
  expoPushToken: string;
  createdAt: string;
}

export interface SystemAdministrator {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  createdAt: string;
}

export interface AdminSummaryMetrics {
  guardianAccounts: number;
  locationRecords: number;
  activeSosAlerts: number;
  generatedReports: number;
}

export interface WithSource<T> {
  data: T;
  source: DataSource;
}
