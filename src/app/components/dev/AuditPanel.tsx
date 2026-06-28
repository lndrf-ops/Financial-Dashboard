import { useState } from 'react';
import { runBusinessLogicAudit, AuditInput, AuditIssue } from '../../utils/businessLogicAudit';

const SEVERITY_STYLES: Record<AuditIssue['severity'], { bg: string; border: string; label: string; labelColor: string; dot: string }> = {
  error: { bg: '#FEF2F2', border: '#FECACA', label: 'FEHLER',   labelColor: '#991B1B', dot: '#EF4444' },
  warn:  { bg: '#FFFBEB', border: '#FDE68A', label: 'WARNUNG',  labelColor: '#92400E', dot: '#F59E0B' },
  info:  { bg: '#F0F9FF', border: '#BAE6FD', label: 'HINWEIS',  labelColor: '#0369A1', dot: '#38BDF8' },
};

export function AuditPanel(props: AuditInput) {
  const [open, setOpen] = useState(false);

  // Only renders in development builds
  if (!import.meta.env.DEV) return null;

  const issues = runBusinessLogicAudit(props);
  if (issues.length === 0) return null;

  const errors = issues.filter(i => i.severity === 'error').length;
  const badgeColor = errors > 0 ? '#DC2626' : '#D97706';

  return (
    <>
      {/* Floating trigger badge */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed', bottom: 88, right: 14, zIndex: 9000,
          background: badgeColor, color: '#fff',
          border: 'none', borderRadius: 20,
          padding: '5px 12px 5px 10px',
          fontSize: 12, fontWeight: 700, fontFamily: 'system-ui, sans-serif',
          cursor: 'pointer',
          boxShadow: '0 2px 14px rgba(0,0,0,0.25)',
          display: 'flex', alignItems: 'center', gap: 5,
          letterSpacing: '0.01em',
        }}
        title="Business Logic Audit"
      >
        <span style={{ fontSize: 13 }}>🔍</span>
        {issues.length} {issues.length === 1 ? 'Issue' : 'Issues'}
      </button>

      {/* Panel */}
      {open && (
        <div
          style={{
            position: 'fixed', bottom: 130, right: 14, zIndex: 9000,
            width: 340, maxHeight: '65vh',
            background: '#FFFFFF', borderRadius: 16,
            border: '1px solid #E4E3DE',
            boxShadow: '0 8px 48px rgba(0,0,0,0.18)',
            display: 'flex', flexDirection: 'column',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 14px 10px',
            borderBottom: '1px solid #F0EFEB',
          }}>
            <div>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#111' }}>Business Logic Audit</span>
              <span style={{
                marginLeft: 8, fontSize: 10, fontWeight: 700,
                background: '#F4F4F1', color: '#6E6E68',
                padding: '2px 7px', borderRadius: 10,
                letterSpacing: '0.06em', textTransform: 'uppercase',
              }}>DEV ONLY</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#A8A8A0', fontSize: 16, lineHeight: 1 }}
            >✕</button>
          </div>

          {/* Issues list */}
          <div style={{ overflowY: 'auto', padding: '10px 10px 12px' }}>
            {issues.map(issue => {
              const s = SEVERITY_STYLES[issue.severity];
              return (
                <div key={issue.id} style={{
                  marginBottom: 8, padding: '9px 11px',
                  borderRadius: 10, background: s.bg,
                  border: `1px solid ${s.border}`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: s.dot, display: 'inline-block', flexShrink: 0 }} />
                    <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: '0.08em', color: s.labelColor, textTransform: 'uppercase' }}>
                      {s.label}
                    </span>
                    <span style={{ fontSize: 9.5, color: '#A8A8A0', fontFamily: 'ui-monospace, monospace' }}>
                      · {issue.id}
                    </span>
                  </div>
                  <p style={{ fontSize: 12.5, fontWeight: 700, color: '#111', margin: '0 0 4px', lineHeight: 1.3 }}>
                    {issue.title}
                  </p>
                  <p style={{ fontSize: 11.5, color: '#5E5E58', margin: '0 0 6px', lineHeight: 1.5 }}>
                    {issue.detail}
                  </p>
                  <div style={{
                    fontSize: 10.5, fontFamily: 'ui-monospace, monospace',
                    background: 'rgba(0,0,0,0.055)', borderRadius: 6,
                    padding: '4px 8px', color: '#333', lineHeight: 1.5,
                  }}>
                    💡 {issue.fix}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
