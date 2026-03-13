import AnimatedCounter from './AnimatedCounter';
import ScrollReveal from './ScrollReveal';

export default function MetricCard({ numericPart, suffix, label, sublabel, delay = 0 }) {
  return (
    <ScrollReveal direction="up" delay={delay}>
      <div
        className="card"
        style={{
          borderLeft: '4px solid var(--accent)',
          padding: '20px 24px',
          textAlign: 'center',
        }}
      >
        <div
          className="font-display"
          style={{ fontSize: 38, fontWeight: 700, color: 'var(--accent)', lineHeight: 1 }}
        >
          <AnimatedCounter numericPart={numericPart} suffix={suffix} duration={2000} />
        </div>
        <div
          className="font-serif"
          style={{ fontSize: 14, color: 'var(--text-primary)', marginTop: 8, fontWeight: 600 }}
        >
          {label}
        </div>
        {sublabel && (
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>
            {sublabel}
          </div>
        )}
      </div>
    </ScrollReveal>
  );
}
