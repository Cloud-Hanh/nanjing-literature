import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, BookOpen, Search, TrendingUp } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import ScrollReveal from '../components/ScrollReveal';
import SectionHeader from '../components/SectionHeader';

// 轻量粒子背景：纯CSS动画，无第三方库
function ParticleBackground() {
  const particles = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 12 + 10,
    delay: Math.random() * 8,
    opacity: Math.random() * 0.4 + 0.15,
  }));

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: 'var(--accent-light)',
            opacity: p.opacity,
            animation: `float-particle ${p.duration}s ${p.delay}s infinite ease-in-out`,
          }}
        />
      ))}
      {/* 连线效果：用几条极细的斜线模拟 */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.06 }}>
        {Array.from({ length: 10 }, (_, i) => (
          <line
            key={i}
            x1={`${i * 11}%`} y1="0%"
            x2={`${(i * 11 + 30) % 100}%`} y2="100%"
            stroke="var(--accent-light)"
            strokeWidth="1"
          />
        ))}
      </svg>
    </div>
  );
}

// 研究进度时间线
const progressSteps = [
  { label: '文献综述', status: 'done' },
  { label: '问卷调研', status: 'done' },
  { label: '田野调查', status: 'done' },
  { label: '数据分析', status: 'active' },
  { label: '成果展示', status: 'pending' },
];

export default function Home() {
  const metricsRef = useRef(null);
  const navigate = useNavigate();

  const scrollToMetrics = () => {
    metricsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh' }}>

      {/* ===== Hero 区域 ===== */}
      <section style={{
        minHeight: '100vh',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at 30% 20%, rgba(212,165,116,0.12) 0%, transparent 65%), var(--bg-primary)',
        overflow: 'hidden',
      }}>
        <ParticleBackground />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 24px', maxWidth: 700 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div style={{
              display: 'inline-block',
              border: '1px solid var(--accent-light)',
              borderRadius: 20,
              padding: '5px 16px',
              fontSize: 12,
              color: 'var(--accent)',
              marginBottom: 24,
              letterSpacing: 2,
            }}>
              东南大学 · SRTP 研究项目
            </div>

            <h1
              className="font-serif text-gradient"
              style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 700, lineHeight: 1.2, margin: '0 0 16px' }}
            >
              南京 · 世界文学之都
            </h1>

            <p style={{
              fontSize: 'clamp(14px, 2vw, 18px)',
              color: 'var(--text-secondary)',
              letterSpacing: 4,
              marginBottom: 40,
              fontFamily: "'Noto Serif SC', serif",
            }}>
              溯千年文脉 &middot; 观当代造境 &middot; 以数据破局
            </p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 8, 0] }}
            transition={{ opacity: { delay: 0.8, duration: 0.5 }, y: { repeat: Infinity, duration: 2.5, ease: 'easeInOut', delay: 1.3 } }}
            onClick={scrollToMetrics}
            style={{
              border: '1px solid var(--accent)',
              borderRadius: 24,
              padding: '10px 28px',
              background: 'transparent',
              color: 'var(--accent)',
              fontSize: 14,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontFamily: "'Noto Sans SC', sans-serif",
            }}
          >
            开始探索
            <ChevronDown size={16} />
          </motion.button>
        </div>

        {/* 右下角装饰文字 */}
        <div style={{
          position: 'absolute',
          bottom: 32, right: 40,
          fontFamily: "'Noto Serif SC', serif",
          fontSize: 11,
          color: 'var(--accent-light)',
          opacity: 0.4,
          writingMode: 'vertical-rl',
          letterSpacing: 3,
        }}>
          文心雕龙 · 世说新语 · 红楼梦 · 背影
        </div>
      </section>

      {/* ===== 指标卡片 ===== */}
      <section ref={metricsRef} style={{ padding: '80px 48px', background: 'var(--bg-secondary)' }}>
        <ScrollReveal>
          <p style={{
            textAlign: 'center',
            fontSize: 12,
            letterSpacing: 4,
            color: 'var(--accent)',
            marginBottom: 40,
            fontFamily: "'Noto Serif SC', serif",
          }}>
            DATA · 数字南京
          </p>
        </ScrollReveal>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 20,
          maxWidth: 900,
          margin: '0 auto',
        }}>
          <MetricCard numericPart={1800}  suffix="+"   label="年文学史脉" sublabel="六朝至当代，绵延不断" delay={0} />
          <MetricCard numericPart={216}   suffix="份"  label="问卷调查样本" sublabel="覆盖多地区多年龄层" delay={0.1} />
          <MetricCard numericPart={80}    suffix="%+"  label="受访者有南京经历" sublabel="常住+旅游群体" delay={0.2} />
          <MetricCard numericPart={66.67} suffix="%"   label="愿意参与文学共建" sublabel="Q14 参与意愿调研" delay={0.3} />
        </div>
      </section>

      {/* ===== 项目简介 + 研究方法 ===== */}
      <section style={{ padding: '80px 48px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>

          <ScrollReveal direction="left">
            <div className="card" style={{ padding: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <BookOpen size={18} color="#fff" />
                </div>
                <h3 className="font-serif" style={{ margin: 0, fontSize: 16, color: 'var(--accent-dark)' }}>
                  项目背景
                </h3>
              </div>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8, margin: 0 }}>
                南京于2019年获联合国教科文组织授予"世界文学之都"称号，成为<strong style={{ color: 'var(--text-primary)' }}>中国唯一、亚洲第三</strong>座获此殊荣的城市。
              </p>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8, margin: '12px 0 0' }}>
                本项目是东南大学本科生 SRTP 课题，围绕三条主线展开研究：溯源千年文脉、调研当代造境实践、基于问卷数据诊断问题并提出创新策略。
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right">
            <div className="card" style={{ padding: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'var(--green-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Search size={18} color="#fff" />
                </div>
                <h3 className="font-serif" style={{ margin: 0, fontSize: 16, color: 'var(--accent-dark)' }}>
                  研究方法
                </h3>
              </div>
              {[
                ['文献综述', '梳理南京文学史料与"文学之都"相关政策文件'],
                ['田野调查', '实地走访夫子庙、先锋书店、世界文学客厅等20余处文学空间'],
                ['问卷调研', '面向公众发放问卷，回收216份有效样本'],
                ['数据分析', '基于真实数据进行量化分析，提炼破局策略'],
              ].map(([title, desc]) => (
                <div key={title} style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
                  <div style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: 'var(--accent)', marginTop: 7, flexShrink: 0,
                  }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{title}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== 研究进度 ===== */}
      <section style={{ padding: '0 48px 80px', maxWidth: 1100, margin: '0 auto' }}>
        <ScrollReveal>
          <SectionHeader icon="📅" title="研究进度" />
          <div style={{ overflowX: 'auto', paddingBottom: 8 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 0,
              minWidth: 500,
              padding: '20px 0',
            }}>
              {progressSteps.map((step, i) => (
                <div key={step.label} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                    <div style={{
                      width: 16, height: 16, borderRadius: '50%',
                      background: step.status === 'pending' ? 'var(--border)' : step.status === 'active' ? 'var(--accent)' : 'var(--green-mid)',
                      border: `3px solid ${step.status === 'active' ? 'var(--accent-light)' : 'transparent'}`,
                      animation: step.status === 'active' ? 'timeline-pulse 2s infinite' : 'none',
                      boxShadow: step.status === 'done' ? '0 0 6px rgba(82,183,136,0.4)' : 'none',
                    }} />
                    <div style={{
                      fontSize: 12, marginTop: 8,
                      color: step.status === 'pending' ? 'var(--text-secondary)' : 'var(--text-primary)',
                      fontWeight: step.status === 'active' ? 700 : 400,
                      whiteSpace: 'nowrap',
                    }}>
                      {step.label}
                    </div>
                    {step.status === 'active' && (
                      <div style={{ fontSize: 10, color: 'var(--accent)', marginTop: 2 }}>进行中</div>
                    )}
                    {step.status === 'done' && (
                      <div style={{ fontSize: 10, color: 'var(--green-mid)', marginTop: 2 }}>已完成</div>
                    )}
                  </div>
                  {i < progressSteps.length - 1 && (
                    <div style={{
                      height: 2, flex: 1,
                      background: step.status === 'done'
                        ? 'linear-gradient(90deg, var(--green-mid), var(--green-light))'
                        : 'var(--border)',
                      marginBottom: 28,
                    }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ===== 三条主线导航 ===== */}
      <section style={{ padding: '0 48px 80px', maxWidth: 1100, margin: '0 auto' }}>
        <ScrollReveal>
          <SectionHeader icon="🗺" title="探索路径" />
        </ScrollReveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
          {[
            { icon: '📜', title: '溯源', sub: '千年文脉', desc: '从六朝到当代，追溯南京文学史脉络', path: '/timeline', color: '#8B4513' },
            { icon: '🗺', title: '造境', sub: '文学地图', desc: '探访当代南京文学地标与文化空间', path: '/map', color: '#52b788' },
            { icon: '📊', title: '破局', sub: '数据洞察', desc: '基于216份问卷，诊断问题提出策略', path: '/data', color: '#d4a574' },
          ].map(({ icon, title, sub, desc, path, color }, i) => (
            <ScrollReveal key={title} direction="up" delay={i * 0.12}>
              <div
                className="card"
                onClick={() => navigate(path)}
                style={{ padding: 28, cursor: 'pointer', borderLeft: `4px solid ${color}` }}
              >
                <div style={{ fontSize: 28, marginBottom: 12 }}>{icon}</div>
                <div className="font-serif" style={{ fontSize: 20, fontWeight: 700, color, marginBottom: 4 }}>
                  {title} · {sub}
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.7 }}>{desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

    </div>
  );
}
