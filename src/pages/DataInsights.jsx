import { useMemo } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  RadialBarChart, RadialBar,
} from 'recharts';
import WordCloud from 'react-wordcloud';
import ScrollReveal from '../components/ScrollReveal';
import SectionHeader from '../components/SectionHeader';
import {
  q3Awareness, q4Symbols, q7Spaces, q8Activities,
  q9Channels, q10Problems, q11Experience, q12RouteElements,
  q13YouthEngagement, q14Willingness,
} from '../data/survey';

// ─── 色板 ───────────────────────────────────────────────
const PALETTE = ['#8B4513','#d4a574','#52b788','#95d5b2','#c9845c','#2d6a4f'];
const ACCENT = '#8B4513';

// ─── 工具 ───────────────────────────────────────────────
function ChartTitle({ children, sub }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <h3 className="font-serif" style={{ fontSize: 15, fontWeight: 700, color: 'var(--accent-dark)', margin: 0 }}>
        {children}
      </h3>
      {sub && <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '4px 0 0' }}>{sub}</p>}
    </div>
  );
}

function InsightBox({ children, color = 'var(--accent)' }) {
  return (
    <div style={{
      marginTop: 16,
      padding: '10px 14px',
      background: `${color}11`,
      borderLeft: `3px solid ${color}`,
      borderRadius: '0 8px 8px 0',
      fontSize: 12,
      color: 'var(--text-primary)',
      lineHeight: 1.7,
    }}>
      {children}
    </div>
  );
}

function ChartCard({ children, span = 1 }) {
  return (
    <ScrollReveal>
      <div className="card" style={{ padding: 28, gridColumn: `span ${span}` }}>
        {children}
      </div>
    </ScrollReveal>
  );
}

// ─── 图表组件 ─────────────────────────────────────────

// 环形图（Q3、Q14）
function DonutChart({ data, colors }) {
  const RADIAN = Math.PI / 180;
  const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, pct }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return pct > 6 ? (
      <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
        {pct.toFixed(1)}%
      </text>
    ) : null;
  };
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="label"
          cx="50%"
          cy="50%"
          innerRadius="40%"
          outerRadius="68%"
          labelLine={false}
          label={renderLabel}
          animationBegin={0}
          animationDuration={900}
        >
          {data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
        </Pie>
        <Tooltip
          formatter={(v, name) => [`${v}人`, name]}
          contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
        />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, color: 'var(--text-secondary)' }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

// 词云（Q4、Q9）
function WordCloudChart({ words }) {
  const options = useMemo(() => ({
    rotations: 2,
    rotationAngles: [0, -30],
    fontSizes: [14, 48],
    fontFamily: "'Noto Serif SC', serif",
    padding: 6,
    deterministic: true,
    colors: ['#8B4513', '#d4a574', '#52b788', '#c9845c', '#2d6a4f', '#95d5b2'],
  }), []);
  return (
    <div style={{ height: 200 }}>
      <WordCloud words={words} options={options} />
    </div>
  );
}

// 雷达图（Q10、Q12）
function RadarChartComp({ data, color = ACCENT }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <RadarChart data={data} cx="50%" cy="50%" outerRadius="68%">
        <PolarGrid stroke="var(--border)" />
        <PolarAngleAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: 'var(--text-secondary)', fontFamily: "'Noto Sans SC', sans-serif" }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 100]}
          tick={{ fontSize: 9, fill: 'var(--text-secondary)' }}
          tickCount={4}
        />
        <Radar
          dataKey="pct"
          stroke={color}
          fill={color}
          fillOpacity={0.25}
          animationBegin={0}
          animationDuration={900}
        />
        <Tooltip
          formatter={(v) => [`${v.toFixed(1)}%`]}
          contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}

// 南丁格尔玫瑰图（Q11、Q13）—— 用 RadialBarChart 实现
function RoseChart({ data, colors }) {
  const sorted = [...data].sort((a, b) => b.pct - a.pct);
  return (
    <ResponsiveContainer width="100%" height={240}>
      <RadialBarChart
        cx="50%" cy="50%"
        innerRadius="15%"
        outerRadius="85%"
        barSize={18}
        data={sorted}
        startAngle={90}
        endAngle={-270}
      >
        <RadialBar
          minAngle={4}
          dataKey="pct"
          cornerRadius={4}
          background={{ fill: 'var(--bg-secondary)' }}
          animationBegin={0}
          animationDuration={900}
        >
          {sorted.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
        </RadialBar>
        <Legend
          iconType="circle"
          iconSize={8}
          layout="vertical"
          align="right"
          verticalAlign="middle"
          formatter={(value) => {
            const item = sorted.find(d => d.label === value);
            return (
              <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                {value} <b style={{ color: 'var(--text-primary)' }}>{item?.pct.toFixed(1)}%</b>
              </span>
            );
          }}
        />
        <Tooltip
          formatter={(v, name) => [`${v.toFixed(1)}%`, name]}
          contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
        />
      </RadialBarChart>
    </ResponsiveContainer>
  );
}

// 气泡图（Q7 空间体验）—— 手写SVG气泡
function BubbleChart({ data }) {
  const max = Math.max(...data.map(d => d.pct));
  const colors = ['#8B4513','#d4a574','#52b788','#95d5b2','#c9845c'];

  // 预设气泡位置，避免重叠
  const positions = [
    { cx: 50, cy: 38 },
    { cx: 23, cy: 60 },
    { cx: 75, cy: 62 },
    { cx: 45, cy: 78 },
    { cx: 78, cy: 30 },
  ];

  return (
    <svg viewBox="0 0 100 100" style={{ width: '100%', height: 240 }}>
      {data.map((d, i) => {
        const r = 6 + (d.pct / max) * 18;
        const pos = positions[i] || { cx: 50, cy: 50 };
        return (
          <g key={d.label}>
            <circle
              cx={pos.cx} cy={pos.cy} r={r}
              fill={colors[i]}
              fillOpacity={0.75}
              stroke={colors[i]}
              strokeWidth={0.5}
            />
            <text
              x={pos.cx} y={pos.cy - 0.5}
              textAnchor="middle" dominantBaseline="middle"
              fontSize={r > 14 ? 4.5 : 3.5}
              fill="#fff"
              fontFamily="'Noto Sans SC', sans-serif"
              fontWeight={600}
            >
              {d.label.length > 8 ? d.label.slice(0, 7) + '…' : d.label}
            </text>
            <text
              x={pos.cx} y={pos.cy + r * 0.45}
              textAnchor="middle" dominantBaseline="middle"
              fontSize={3.5}
              fill="#fff"
              fontFamily="sans-serif"
            >
              {d.pct.toFixed(1)}%
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── 主页面 ──────────────────────────────────────────────
export default function DataInsights() {
  // 词云数据
  const q4Words = q4Symbols.slice(0, 4).map(d => ({ text: d.label, value: d.value }));
  const q9Words = q9Channels.map(d => ({ text: d.label, value: d.value }));

  return (
    <div style={{ padding: '48px 48px 80px', maxWidth: 1100, margin: '0 auto' }}>
      <SectionHeader
        icon="📊"
        title="数据洞察"
        subtitle="基于 216 份真实问卷，量化呈现南京文学之都建设的现状与期待"
      />

      {/* ── 板块一：溯源 ── */}
      <ScrollReveal>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '0 0 24px' }}>
          <div style={{ width: 4, height: 20, background: '#8B4513', borderRadius: 2 }} />
          <h2 className="font-serif" style={{ margin: 0, fontSize: 18, color: '#8B4513' }}>溯源 · 认知篇</h2>
        </div>
      </ScrollReveal>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 40 }}>
        {/* Q3 知晓度 */}
        <ChartCard>
          <ChartTitle sub="Q3 · n=216">对"世界文学之都"称号的知晓度</ChartTitle>
          <DonutChart data={q3Awareness} colors={['#2d6a4f','#d4a574','#c9845c']} />
          <InsightBox>
            仅 <b>19.91%</b> 真正了解这一称号；<b>34.72%</b> 从未听说——品牌认知严重滞后于城市文化积淀。
          </InsightBox>
        </ChartCard>

        {/* Q4 文化符号词云 */}
        <ChartCard>
          <ChartTitle sub="Q4 · 多选 · n=216">南京文学文化符号认知（词云）</ChartTitle>
          <WordCloudChart words={q4Words} />
          <InsightBox color="#52b788">
            经典文学作品认知度最高（<b>68.98%</b>），六朝文学理论认知相对偏低（57.87%）——大众对"文学作品"的记忆深于"文学理论"。
          </InsightBox>
        </ChartCard>
      </div>

      {/* ── 板块二：造境 ── */}
      <ScrollReveal>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '0 0 24px' }}>
          <div style={{ width: 4, height: 20, background: '#52b788', borderRadius: 2 }} />
          <h2 className="font-serif" style={{ margin: 0, fontSize: 18, color: '#2d6a4f' }}>造境 · 体验篇</h2>
        </div>
      </ScrollReveal>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 40 }}>
        {/* Q7 空间体验气泡图 */}
        <ChartCard>
          <ChartTitle sub="Q7 · 多选 · n=216">文学空间体验率（气泡大小代表比例）</ChartTitle>
          <BubbleChart data={q7Spaces} />
          <InsightBox color="#52b788">
            传统地标（乌衣巷等）体验率高达 <b>74.54%</b>，而官方核心文学空间"世界文学客厅"仅 <b>20.37%</b>——新建空间尚未真正触达公众。
          </InsightBox>
        </ChartCard>

        {/* Q8 活动参与 — 大数字 */}
        <ChartCard>
          <ChartTitle sub="Q8 · 多选 · n=216">文学活动参与情况</ChartTitle>
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div className="font-display" style={{ fontSize: 72, fontWeight: 700, color: '#c9845c', lineHeight: 1 }}>
              50%
            </div>
            <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 8 }}>
              受访者 <b style={{ color: 'var(--text-primary)' }}>从未参与过</b> 任何南京文学活动
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            {q8Activities.slice(0, 4).map((d, i) => (
              <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', width: 140, flexShrink: 0 }}>{d.label}</div>
                <div style={{ flex: 1, height: 6, background: 'var(--bg-secondary)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{
                    width: `${d.pct}%`,
                    height: '100%',
                    background: PALETTE[i],
                    borderRadius: 3,
                  }} />
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', width: 40, textAlign: 'right' }}>
                  {d.pct.toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
          <InsightBox color="#c9845c">
            城市文学行走/打卡是参与率最高的活动（<b>30.56%</b>），说明"走动式"体验最能吸引公众。
          </InsightBox>
        </ChartCard>

        {/* Q9 信息渠道词云 */}
        <ChartCard>
          <ChartTitle sub="Q9 · 多选 · n=216">文学资讯获取渠道（词云）</ChartTitle>
          <WordCloudChart words={q9Words} />
          <InsightBox color="#52b788">
            社交媒体（<b>65.28%</b>）与公众号（60.65%）是双主渠道；朋友推荐（49.54%）与实地偶遇（40.28%）说明口碑和线下触达仍不可忽视。
          </InsightBox>
        </ChartCard>
      </div>

      {/* ── 板块三：破局 ── */}
      <ScrollReveal>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '0 0 24px' }}>
          <div style={{ width: 4, height: 20, background: '#d4a574', borderRadius: 2 }} />
          <h2 className="font-serif" style={{ margin: 0, fontSize: 18, color: 'var(--accent)' }}>破局 · 策略篇</h2>
        </div>
      </ScrollReveal>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 40 }}>
        {/* Q10 问题雷达图 */}
        <ChartCard>
          <ChartTitle sub="Q10 · 多选 · n=216">建设痛点六维雷达图</ChartTitle>
          <RadarChartComp data={q10Problems} color="#8B4513" />
          <InsightBox>
            宣传不足（<b>64.81%</b>）是第一大痛点；地标缺乏串联（54.17%）与青年参与感不足（50.93%）紧随其后——三者构成破局核心。
          </InsightBox>
        </ChartCard>

        {/* Q11 体验偏好玫瑰图 */}
        <ChartCard>
          <ChartTitle sub="Q11 · 单选 · n=216">最受欢迎的体验形式（玫瑰图）</ChartTitle>
          <RoseChart data={q11Experience} colors={['#8B4513','#d4a574','#52b788','#95d5b2','#c9845c']} />
          <InsightBox color="#d4a574">
            <b>城市漫步路线以 33.8% 遥遥领先</b>，文学+市井融合（25%）位居第二——公众偏好"走进日常"而非"走进剧场"。
          </InsightBox>
        </ChartCard>

        {/* Q12 路线期待雷达图 */}
        <ChartCard>
          <ChartTitle sub="Q12 · 多选 · n=216">理想文学旅游路线期待雷达图</ChartTitle>
          <RadarChartComp data={q12RouteElements} color="#52b788" />
          <InsightBox color="#52b788">
            经典地标探访（<b>75.46%</b>）与美食文创（<b>68.06%</b>）是双核期待，深度参观（49.07%）与互动（42.59%）形成补充。
          </InsightBox>
        </ChartCard>

        {/* Q13 青年触达玫瑰图 */}
        <ChartCard>
          <ChartTitle sub="Q13 · 单选 · n=216">提升青年关注的最有效方式（玫瑰图）</ChartTitle>
          <RoseChart data={q13YouthEngagement} colors={['#2d6a4f','#52b788','#95d5b2','#d4a574','#c9845c']} />
          <InsightBox color="#2d6a4f">
            高校联动（<b>28.24%</b>）与影视综艺联动（<b>27.78%</b>）几乎并列第一，说明"校园阵地"与"流量入口"是触达青年的两条平行路径。
          </InsightBox>
        </ChartCard>

        {/* Q14 参与意愿 */}
        <ChartCard>
          <ChartTitle sub="Q14 · 单选 · n=216">参与"文学之都"共建活动的意愿</ChartTitle>
          <DonutChart
            data={q14Willingness}
            colors={['#52b788','#2d6a4f','#d4a574','#c9845c']}
          />
          <InsightBox color="#52b788">
            <b>66.67%</b> 受访者表示愿意参与共建（非常+比较愿意）；仅 6.94% 兴趣不大——意愿基础充足，需要有效组织渠道将其激活。
          </InsightBox>
        </ChartCard>
      </div>
    </div>
  );
}
