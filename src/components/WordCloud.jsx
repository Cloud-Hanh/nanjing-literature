// 自定义词云组件，无需第三方库，兼容 React 18
import { useMemo } from 'react';

const COLORS = ['#8B4513', '#d4a574', '#52b788', '#2d6a4f', '#c9845c', '#95d5b2'];
const ROTATIONS = [0, 0, 0, -15, 15, -8, 8];

export default function WordCloud({ words, height = 200 }) {
  // 按 value 排序，value 越大字越大
  const sorted = useMemo(() => {
    if (!words?.length) return [];
    const max = Math.max(...words.map(w => w.value));
    const min = Math.min(...words.map(w => w.value));
    const range = max - min || 1;
    return [...words]
      .sort((a, b) => b.value - a.value)
      .map((w, i) => ({
        ...w,
        size: 14 + ((w.value - min) / range) * 28, // 14px ~ 42px
        color: COLORS[i % COLORS.length],
        rotate: ROTATIONS[i % ROTATIONS.length],
        weight: w.value > (max * 0.7) ? 700 : w.value > (max * 0.4) ? 600 : 400,
      }));
  }, [words]);

  return (
    <div style={{
      height,
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px 14px',
      padding: '12px 8px',
      alignContent: 'center',
    }}>
      {sorted.map((w) => (
        <span
          key={w.text}
          title={`${w.text}：${w.value}人`}
          style={{
            fontSize: w.size,
            color: w.color,
            fontWeight: w.weight,
            fontFamily: "'Noto Serif SC', serif",
            transform: `rotate(${w.rotate}deg)`,
            display: 'inline-block',
            lineHeight: 1.2,
            cursor: 'default',
            transition: 'transform 0.2s, opacity 0.2s',
            opacity: 0.85,
          }}
          onMouseEnter={e => { e.target.style.opacity = 1; e.target.style.transform = `rotate(0deg) scale(1.08)`; }}
          onMouseLeave={e => { e.target.style.opacity = 0.85; e.target.style.transform = `rotate(${w.rotate}deg) scale(1)`; }}
        >
          {w.text}
        </span>
      ))}
    </div>
  );
}
