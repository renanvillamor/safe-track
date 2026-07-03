import type {
  ActivityReport,
  Administrator,
  AdminSummaryMetrics,
  Child,
  Guardian,
  LocationLog,
  SosAlert,
} from "../types/safetrack";

export const mockGuardian: Guardian = {
  id: "mock-guardian-1",
  userId: "mock-user-guardian",
  fullName: "Renan Villamor",
  email: "villamor.renan@gmail.com",
  phone: "+63 900 000 0000",
  createdAt: "2026-05-01T08:00:00.000Z",
};

export const mockAdministrator: Administrator = {
  id: "mock-admin-1",
  userId: "mock-user-admin",
  fullName: "System Administrator",
  email: "admin@safetrack.app",
  createdAt: "2026-05-01T08:00:00.000Z",
};

export const mockChildren: Child[] = [
  {
    id: "mock-child-1",
    guardianId: "mock-guardian-1",
    fullName: "Mia Villamor",
    dateOfBirth: "2015-03-12",
    smartwatchDeviceId: "mock-device-1",
    locationSharingEnabled: true,
    createdAt: "2026-05-01T08:00:00.000Z",
  },
];

export const mockChildSelf: Child = mockChildren[0];

export const mockLocationLogs: LocationLog[] = [
  {
    id: "mock-loc-1",
    childId: "mock-child-1",
    childName: "Mia Villamor",
    guardianId: "mock-guardian-1",
    latitude: 14.5995,
    longitude: 120.9842,
    accuracyMeters: 12,
    source: "smartwatch",
    recordedAt: "2026-07-03T13:45:00.000Z",
  },
  {
    id: "mock-loc-2",
    childId: "mock-child-1",
    childName: "Mia Villamor",
    guardianId: "mock-guardian-1",
    latitude: 14.6010,
    longitude: 120.9822,
    accuracyMeters: 18,
    source: "phone",
    recordedAt: "2026-07-03T10:15:00.000Z",
  },
];

export const mockSosAlerts: SosAlert[] = [
  {
    id: "mock-sos-1",
    childId: "mock-child-1",
    childName: "Mia Villamor",
    guardianId: "mock-guardian-1",
    status: "resolved",
    activationMethod: "app_test",
    isTestAlert: true,
    locationLogId: "mock-loc-1",
    triggeredAt: "2026-07-01T09:30:00.000Z",
    acknowledgedAt: "2026-07-01T09:31:00.000Z",
    resolvedAt: "2026-07-01T09:40:00.000Z",
  },
];

export const mockActivityReports: ActivityReport[] = [
  {
    id: "mock-report-1",
    childId: "mock-child-1",
    childName: "Mia Villamor",
    guardianId: "mock-guardian-1",
    title: "Weekly Safety Summary",
    type: "weekly_summary",
    status: "ready",
    exportFormat: "pdf",
    rangeStart: "2026-06-27T00:00:00.000Z",
    rangeEnd: "2026-07-03T23:59:59.000Z",
    generatedAt: "2026-07-03T06:00:00.000Z",
  },
  {
    id: "mock-report-2",
    childId: "mock-child-1",
    childName: "Mia Villamor",
    guardianId: "mock-guardian-1",
    title: "Location History — June",
    type: "location_history",
    status: "ready",
    exportFormat: "excel",
    rangeStart: "2026-06-01T00:00:00.000Z",
    rangeEnd: "2026-06-30T23:59:59.000Z",
    generatedAt: "2026-07-01T06:00:00.000Z",
  },
];

export const mockAdminSummary: AdminSummaryMetrics = {
  guardianAccounts: 128,
  locationRecords: 18420,
  activeSosAlerts: 2,
  generatedReports: 356,
};
