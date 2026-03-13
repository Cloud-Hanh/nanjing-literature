import { motion } from 'framer-motion';
import { Radio, MapPin, Users, Coffee } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import AnimatedCounter from '../components/AnimatedCounter';
import SectionHeader from '../components/SectionHeader';

const strategies = [
  {
    id: 1,
    icon: Radio,
    color: '#8B4513',
    title: '破圈传播',
    sub: '让称号真正走进公众视野',
    basis: '数据依据：64.81% 认为宣传力度不足；社交媒体是首要信息渠道（65.28%）',
    points: [
      { label: '影视·综艺联动', desc: '借助热门取景地联动宣传，以流量带动文学认知', pct: 27.78 },
      { label: '高校阵地激活', desc: '文学课程进校园、校际文学活动、学生社团合作', pct: 28.24 },
      { label: 'KOL 内容矩阵', desc: '打造博主探访文学地标的系列新媒体内容', pct: 19.44 },
    ],
    quote: '34.72% 的受访者在填写本问卷前从未听说"世界文学之都"这一称号。',
  },
  {
    id: 2,
    icon: MapPin,
    color: '#d4a574',
    title: '路线串联',
    sub: '从零散打卡到沉浸漫步',
    basis: '数据依据：54.17% 指出地标缺乏串联；城市漫步路线以 33.8% 高居体验偏好第一',
    points: [
      { label: '主题漫步路线', desc: '串联乌衣巷、浦口车站、先锋书店等，配套音频导览', pct: 75.46 },
      { label: '美食文创融合', desc: '沿线嵌入文学主题餐饮、打卡集章、文创体验', pct: 68.06 },
      { label: '数字地图平台', desc: '可自定义路线，支持分享，串联线上线下体验', pct: 24.54 },
    ],
    quote: '75.46% 的受访者期待在文学旅游路线中实地探访经典文学地标。',
  },
  {
    id: 3,
    icon: Users,
    color: '#52b788',
    title: '青年激活',
    sub: '把意愿转化为真实参与',
    basis: '数据依据：50% 受访者从未参与任何文学活动；66.67% 却表示愿意参与共建',
    points: [
      { label: '降低参与门槛', desc: '城市文学行走、线上打卡等轻量活动是参与起点', pct: 30.56 },
      { label: '共创而非观看', desc: '青年写作坊、诗歌征集，让青年成为内容生产者', pct: 66.67 },
      { label: '校园生态建设', desc: '将高校资源纳入文学之都建设体系，形成持续动力', pct: 28.24 },
    ],
    quote: '66.67% 愿意参与共建，但 50% 从未参与过——渠道缺位，不是热情缺位。',
  },
  {
    id: 4,
    icon: Coffee,
    color: '#2d6a4f',
    title: '生活融合',
    sub: '把文学嵌入日常消费场景',
    basis: '数据依据：49.54% 认为文学与日常生活融合不深；文学+市井融合体验偏好排名第二（25%）',
    points: [
      { label: '文学主题空间', desc: '文学咖啡馆、文创菜场，让文学成为日常消费的一部分', pct: 25.00 },
      { label: '官方空间激活', desc: '世界文学客厅体验率仅 20.37%，需要降低发现门槛', pct: 20.37 },
      { label: '市井文学场景', desc: '在老门东等街区嵌入文学元素，实现无感知文化浸润', pct: 49.54 },
    ],
    quote: '世界文学客厅的体验率（20.37%）远低于传统地标（74.54%）——空间建了，但还未连接到人。',
  },
];

export default function Strategies() {
  return (
    <div style={{ padding: '48px 48px 80px', maxWidth: 1000, margin: '0 auto' }}>
      <SectionHeader
        icon="💡"
        title="破局建议"
        subtitle="基于 216 份真实问卷数据，提出四条面向南京文学之都建设的创新策略"
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {strategies.map((s, i) => {
          const Icon = s.icon;
          return (
            <ScrollReveal key={s.id} direction="up" delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -3, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
                transition={{ duration: 0.2 }}
                className="card"
                style={{
                  padding: 32,
                  borderLeft: `5px solid ${s.color}`,
                }}
              >
                {/* 标题行 */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 16 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                    background: `${s.color}18`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={20} color={s.color} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                      <h3 className="font-serif" style={{ margin: 0, fontSize: 20, fontWeight: 700, color: s.color }}>
                        策略 {s.id}：{s.title}
                      </h3>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>{s.sub}</div>
                  </div>
                </div>

                {/* 数据依据 */}
                <div style={{
                  fontSize: 12, color: 'var(--text-secondary)',
                  background: 'var(--bg-secondary)',
                  borderRadius: 8, padding: '8px 12px',
                  marginBottom: 20,
                }}>
                  {s.basis}
                </div>

                {/* 三条举措 */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                  {s.points.map((p, j) => (
                    <div key={p.label} style={{
                      background: 'var(--bg-secondary)',
                      borderRadius: 10,
                      padding: '16px 18px',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                          {p.label}
                        </span>
                        <span className="font-display" style={{ fontSize: 18, fontWeight: 700, color: s.color, lineHeight: 1, flexShrink: 0, marginLeft: 8 }}>
                          <AnimatedCounter numericPart={p.pct} suffix="%" duration={1800} />
                        </span>
                      </div>
                      <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                        {p.desc}
                      </p>
                    </div>
                  ))}
                </div>

                {/* 引言 */}
                <div style={{
                  marginTop: 20,
                  padding: '10px 16px',
                  borderLeft: `3px solid ${s.color}66`,
                  fontSize: 12,
                  color: 'var(--text-secondary)',
                  fontStyle: 'italic',
                  fontFamily: "'Noto Serif SC', serif",
                  lineHeight: 1.7,
                }}>
                  {s.quote}
                </div>
              </motion.div>
            </ScrollReveal>
          );
        })}
      </div>

      {/* 总结框 */}
      <ScrollReveal delay={0.4}>
        <div style={{
          marginTop: 48,
          padding: '32px 36px',
          background: 'linear-gradient(135deg, var(--accent-dark) 0%, var(--accent) 100%)',
          borderRadius: 16,
          color: '#f0ebe3',
          textAlign: 'center',
        }}>
          <h3 className="font-serif" style={{ fontSize: 18, margin: '0 0 12px', color: '#e8c9a0' }}>
            核心洞察
          </h3>
          <p style={{ fontSize: 14, lineHeight: 1.9, margin: '0 0 16px', opacity: 0.9, maxWidth: 680, marginInline: 'auto' }}>
            南京"世界文学之都"建设面临的核心矛盾并非文化资源匮乏，而是<strong style={{ color: '#e8c9a0' }}>连接失效</strong>——
            城市有丰厚的文学积淀，公众有真实的参与意愿（66.67%），但两者之间缺乏有效的渠道与场景桥梁。
            破局的关键，在于将文学从"殿堂"带回"日常"。
          </p>
          <div style={{ display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              ['64.81%', '认为宣传不足'],
              ['50%', '从未参与活动'],
              ['66.67%', '愿意参与共建'],
              ['33.8%', '期待城市漫步'],
            ].map(([num, label]) => (
              <div key={label}>
                <div className="font-display" style={{ fontSize: 28, fontWeight: 700, color: '#e8c9a0' }}>{num}</div>
                <div style={{ fontSize: 11, opacity: 0.75, marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
