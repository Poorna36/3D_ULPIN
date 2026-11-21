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
    '100%_LOD4_DIGITAL_TWIN': 'badge-sim',
  };
  const cls = map[status] ?? 'badge-draft';
  return (
    <span className={`badge ${cls} ${dot ? 'badge-dot' : ''}`}>
      {status?.replace(/_/g, ' ')}
    </span>
  );
}
