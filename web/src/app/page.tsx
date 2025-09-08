/**
 * Smart Tourist Safety System - Home Page
 * Root page that redirects to dashboard
 */

import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/dashboard/overview');
}
