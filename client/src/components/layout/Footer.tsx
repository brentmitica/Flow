// FLOW Footer — "Made by Brent"
// Design: "Precision Instrument" — minimal, subtle, respectful of space

export function Footer() {
  return (
    <div style={{
      padding: '16px 24px',
      borderTop: '1px solid var(--border-subtle)',
      background: 'var(--bg-base)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 12, color: 'var(--text-tertiary)',
      fontFamily: 'var(--font-body)',
    }}>
      Made by Brent
    </div>
  );
}
