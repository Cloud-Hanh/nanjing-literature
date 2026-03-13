import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { timelineData } from '../data/timeline';
import SectionHeader from '../components/SectionHeader';

function TimelineCard({ item, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const isLeft = index % 2 === 0;

  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        justifyContent: isLeft ? 'flex-start' : 'flex-end',
        position: 'relative',
        paddingBottom: 56,
      }}
    >
      {/* 中线节点 */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.1 }}
        style={{
          position: 'absolute',
          left: '50%',
          top: 20,
          transform: 'translate(-50%, 0)',
          width: item.highlight ? 22 : 16,
          height: item.highlight ? 22 : 16,
          borderRadius: '50%',
          background: item.color,
          border: `3px solid var(--bg-primary)`,
          boxShadow: `0 0 0 3px ${item.color}44`,
          zIndex: 2,
          animation: item.highlight ? 'timeline-pulse 2.5s infinite' : 'none',
        }}
      />

      {/* 卡片 */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
        style={{
          width: 'calc(50% - 36px)',
          background: 'var(--bg-card)',
          border: `1px solid var(--border)`,
          borderLeft: `4px solid ${item.color}`,
          borderRadius: 12,
          padding: 24,
          boxShadow: item.highlight
            ? `0 4px 24px ${item.color}33`
            : 'var(--shadow)',
        }}
      >
        {/* 时代标题 */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
            <span
              className="font-serif"
              style={{
                fontSize: item.highlight ? 22 : 18,
                fontWeight: 700,
                color: item.color,
              }}
            >
              {item.era}
              {item.highlight && ' 🏆'}
            </span>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'serif' }}>
              {item.period}
            </span>
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
            {item.title}
          </div>
        </div>

        {/* 事件列表 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {item.events.map((ev) => (
            <div
              key={ev.title}
              style={{
                background: ev.highlight ? `${item.color}11` : 'var(--bg-secondary)',
                borderRadius: 8,
                padding: '10px 14px',
                border: ev.highlight ? `1px solid ${item.color}44` : '1px solid transparent',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                <span
                  className="font-serif"
                  style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}
                >
                  {ev.title}
                </span>
                <span style={{ fontSize: 11, color: item.color, flexShrink: 0 }}>
                  {ev.year}
                </span>
              </div>
              <p style={{
                fontSize: 12,
                color: 'var(--text-secondary)',
                margin: '4px 0 0',
                lineHeight: 1.7,
              }}>
                {ev.desc}
              </p>
            </div>
          ))}
        </div>

        {/* 诗句引言 */}
        {item.quote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6, duration: 0.5 }}
            style={{
              marginTop: 16,
              paddingTop: 14,
              borderTop: `1px dashed ${item.color}44`,
            }}
          >
            <p style={{
              fontSize: 12,
              color: item.color,
              fontStyle: 'italic',
              fontFamily: "'Noto Serif SC', serif",
              margin: 0,
              lineHeight: 1.8,
            }}>
              &ldquo;{item.quote.text}&rdquo;
            </p>
            <p style={{ fontSize: 11, color: 'var(--text-secondary)', margin: '4px 0 0' }}>
              — {item.quote.author}
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default function Timeline() {
  return (
    <div style={{ padding: '48px 48px 80px', maxWidth: 1000, margin: '0 auto' }}>
      <SectionHeader
        icon="📜"
        title="千年文脉 · 南京文学编年"
        subtitle="从六朝建康到当代文学之都，南京与文学的千年对话"
      />

      {/* 说明行 */}
      <div style={{
        display: 'flex',
        gap: 24,
        marginBottom: 48,
        flexWrap: 'wrap',
      }}>
        {[
          { color: '#8B4513', label: '六朝' },
          { color: '#c9845c', label: '唐宋' },
          { color: '#d4a574', label: '明清' },
          { color: '#52b788', label: '现当代' },
          { color: '#2d6a4f', label: '里程碑' },
          { color: '#95d5b2', label: '当代建设' },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* 时间轴主体 */}
      <div style={{ position: 'relative' }}>
        {/* 中央竖线 */}
        <div style={{
          position: 'absolute',
          left: '50%',
          top: 0,
          bottom: 0,
          width: 2,
          background: 'linear-gradient(180deg, var(--accent-light) 0%, var(--green-light) 100%)',
          opacity: 0.3,
          transform: 'translateX(-50%)',
        }} />

        {timelineData.map((item, index) => (
          <TimelineCard key={item.id} item={item} index={index} />
        ))}
      </div>

      {/* 底部收尾 */}
      <div style={{ textAlign: 'center', paddingTop: 16 }}>
        <div style={{
          display: 'inline-block',
          padding: '12px 28px',
          border: '1px solid var(--accent-light)',
          borderRadius: 24,
          fontSize: 13,
          color: 'var(--accent)',
          fontFamily: "'Noto Serif SC', serif",
        }}>
          文脉绵延，未完待续
        </div>
      </div>
    </div>
  );
}
