export default function SectionHeader({ icon, title, subtitle }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h2
        className="font-serif"
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: 'var(--accent-dark)',
          borderBottom: '2px solid var(--accent-light)',
          paddingBottom: 10,
          marginBottom: subtitle ? 8 : 0,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        {icon && <span style={{ fontSize: 20 }}>{icon}</span>}
        {title}
      </h2>
      {subtitle && (
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, marginTop: 6 }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
