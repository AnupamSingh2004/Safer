/**
 * Smart Tourist Safety System - Dashboard Layout
 * Main layout for dashboard pages with sidebar and header
 */

import { DashboardLayout } from '@/components/dashboard/dashboard-layout';

export default function DashboardRoutesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
