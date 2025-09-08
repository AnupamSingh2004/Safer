/**
 * Smart Tourist Safety System - Authentication Layout
 * Layout for authentication pages (login, register)
 */

import { AuthLayout } from '@/components/auth/auth-layout';

export default function AuthRoutesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthLayout>{children}</AuthLayout>;
}
