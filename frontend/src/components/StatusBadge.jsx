// StatusBadge — reusable VALID / REVIEW / INVALID / SYNTHETIC / DRAFT badge
export default function StatusBadge({ status, dot = false }) {
  const map = {
    VALID:       'badge-valid',
    REVIEW:      'badge-review',
    INVALID:     'badge-invalid',
    DRAFT:       'badge-draft',
    SYNTHETIC:   'badge-synthetic',
    DERIVED:     'badge-draft',
    DERIVED_HIGH:'badge-valid',
    INFERRED:    'badge-review',
    AUTHORITATIVE: 'badge-valid',
  };
  const cls = map[status] ?? 'badge-draft';
  return (
    <span className={`badge ${cls} ${dot ? 'badge-dot' : ''}`}>
      {status?.replace(/_/g, ' ')}
    </span>
  );
}
