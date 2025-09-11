// File: web/src/app/(auth)/login/page.tsx

import { Suspense } from 'react';
import { Metadata } from 'next';
import { LoginForm, LoginFormSkeleton } from '@/components/auth/login-form';

export const metadata: Metadata = {
  title: 'Login | Smart Tourist Safety',
  description: 'Secure login to Smart Tourist Safety dashboard for tourism departments and emergency services.',
};

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFormSkeleton />}>
      <LoginForm 
        showRoleSelection={true}
        showRememberMe={true}
      />
    </Suspense>
  );
}