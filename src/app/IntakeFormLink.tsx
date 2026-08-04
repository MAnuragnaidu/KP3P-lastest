import Link from 'next/link';

/** Always visible — redirects via /intake which reads INTAKE_APP_URL at runtime on Vercel. */
export default function IntakeFormLink() {
  return (
    <>
      <div style={{ marginTop: '1.25rem', marginBottom: '1rem' }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <div style={{ flex: 1, borderTop: '1px solid #e5e7eb' }} />
          <span
            style={{
              padding: '0 0.75rem',
              fontSize: '0.75rem',
              color: '#9ca3af',
              whiteSpace: 'nowrap',
            }}
          >
            OR
          </span>
          <div style={{ flex: 1, borderTop: '1px solid #e5e7eb' }} />
        </div>
      </div>

      <Link href="/intake" className="btn btn-secondary w-full" style={{ textAlign: 'center' }}>
        Patient Intake Form
      </Link>
    </>
  );
}
