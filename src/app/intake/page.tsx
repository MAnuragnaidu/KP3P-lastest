import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getIntakeAppUrl } from '@/lib/intake-app-url';

export const dynamic = 'force-dynamic';

export default function IntakeRedirectPage() {
  const intakeAppUrl = getIntakeAppUrl();
  if (intakeAppUrl) {
    redirect(intakeAppUrl);
  }

  return (
    <main
      className="container flex flex-col items-center justify-center min-h-[100dvh] py-6"
      style={{ padding: '1.5rem' }}
    >
      <div className="glass-panel w-full mx-auto" style={{ maxWidth: '420px', padding: '1.5rem' }}>
        <h1 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem', color: '#111827' }}>
          Patient intake is not configured
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.6, marginBottom: '1rem' }}>
          Set <code style={{ fontSize: '0.8rem' }}>INTAKE_APP_URL</code> on Vercel to your deployed
          patient intake app URL (for example{' '}
          <code style={{ fontSize: '0.8rem' }}>https://your-intake.vercel.app</code>).
        </p>
        <Link href="/" className="btn btn-secondary w-full" style={{ textAlign: 'center' }}>
          Back to login
        </Link>
      </div>
    </main>
  );
}
