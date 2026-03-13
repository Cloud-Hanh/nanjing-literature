import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown, ChevronUp, Clock, Ticket, Train, Lightbulb,
  Send, MessageSquare, X, Route, Sparkles, RefreshCw, Navigation,
} from 'lucide-react';
import { landmarks, eraColors, typeIcons } from '../data/landmarks';
import SectionHeader from '../components/SectionHeader';

// ─── 图标 ────────────────────────────────────────────────
function createIcon(color, active = false) {
  return L.divIcon({
    className: '',
    html: `<div style="
      width:${active ? 34 : 28}px;height:${active ? 34 : 28}px;border-radius:50%;
      background:${color};border:${active ? 4 : 3}px solid #fff;
      box-shadow:0 2px 10px rgba(0,0,0,${active ? 0.45 : 0.28});
      transition:all 0.2s;
    "></div>`,
    iconSize: [active ? 34 : 28, active ? 34 : 28],
    iconAnchor: [active ? 17 : 14, active ? 17 : 14],
    popupAnchor: [0, -18],
  });
}

function createRouteIcon(number, color) {
  return L.divIcon({
    className: '',
    html: `<div style="
      width:30px;height:30px;border-radius:50%;
      background:${color};border:3px solid #fff;
      box-shadow:0 2px 10px rgba(0,0,0,0.4);
      display:flex;align-items:center;justify-content:center;
      color:#fff;font-size:11px;font-weight:700;font-family:sans-serif;
    ">${number}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -18],
  });
}

function FlyToMarker({ target }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo([target.lat, target.lng], 15, { duration: 1.2 });
  }, [target, map]);
  return null;
}

function FitRouteBounds({ stops }) {
  const map = useMap();
  useEffect(() => {
    if (!stops?.length) return;
    const bounds = stops.map(s => [s.lat, s.lng]);
    if (bounds.length >= 2) map.fitBounds(bounds, { padding: [40, 40], duration: 1 });
  }, [stops, map]);
  return null;
}

// ─── 路线规划辅助函数 ─────────────────────────────────────
function distKm(a, b) {
  const R = 6371;
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLng = (b.lng - a.lng) * Math.PI / 180;
  const aa = Math.sin(dLat / 2) ** 2 +
    Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1 - aa));
}

function nearestNeighbor(pool, count) {
  if (pool.length <= count) return [...pool];
  // 从地理中心出发
  const cLat = pool.reduce((s, l) => s + l.lat, 0) / pool.length;
  const cLng = pool.reduce((s, l) => s + l.lng, 0) / pool.length;
  let remaining = [...pool];
  const result = [];
  let cur = { lat: cLat, lng: cLng };
  while (result.length < count && remaining.length > 0) {
    const nearest = remaining.reduce((a, b) => distKm(cur, a) < distKm(cur, b) ? a : b);
    result.push(nearest);
    cur = nearest;
    remaining = remaining.filter(l => l.id !== nearest.id);
  }
  return result;
}

function buildItinerary(stops, duration, pace) {
  const baseMin = pace === 'relaxed' ? 90 : pace === 'intensive' ? 45 : 65;
  const travelMin = 15;
  let mins = 9 * 60;
  const items = [];
  const fmt = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
  const totalHours = (stops.length * (baseMin + travelMin) / 60).toFixed(1);
  items.push({ type: 'header', count: stops.length, hours: totalHours });

  stops.forEach((stop, i) => {
    items.push({ type: 'stop', idx: i + 1, time: fmt(mins), stop, minutes: baseMin });
    mins += baseMin + travelMin;

    if (i < stops.length - 1 && mins >= 720 && mins < 790) {
      items.push({ type: 'lunch' });
      mins = 13 * 60 + 30;
    }
    if (duration === '2days' && i === Math.floor(stops.length / 2) - 1 && i < stops.length - 1) {
      items.push({ type: 'daybreak' });
      mins = 9 * 60;
    }
  });
  return items;
}

// ─── 路线规划面板 ──────────────────────────────────────────
const DURATION_OPTS = [
  { value: 'halfday', label: '半天', count: 4 },
  { value: '1day', label: '1 天', count: 7 },
  { value: '2days', label: '2 天', count: 13 },
];
const INTEREST_OPTS = [
  { value: 'all', label: '综合游览', icon: '🗺', filter: null },
  { value: 'history', label: '历史文化', icon: '🏯', filter: l => ['六朝', '明清'].includes(l.era) },
  { value: 'literature', label: '文学朝圣', icon: '📚', filter: l => ['文学地标', '文学空间'].includes(l.type) },
  { value: 'modern', label: '现代人文', icon: '🎨', filter: l => ['现当代', '当代'].includes(l.era) },
  { value: 'leisure', label: '休闲体验', icon: '☕', filter: l => ['文化街区', '文化地标'].includes(l.type) },
];
const PACE_OPTS = [
  { value: 'relaxed', label: '悠闲', mult: 0.75 },
  { value: 'normal', label: '适中', mult: 1 },
  { value: 'intensive', label: '紧凑', mult: 1.4 },
];

function RoutePlanner({ onRoute, onClear }) {
  const [open, setOpen] = useState(false);
  const [duration, setDuration] = useState('1day');
  const [interest, setInterest] = useState('all');
  const [pace, setPace] = useState('normal');
  const [result, setResult] = useState(null);

  const generate = () => {
    const interestOpt = INTEREST_OPTS.find(o => o.value === interest);
    let pool = interestOpt.filter ? landmarks.filter(interestOpt.filter) : [...landmarks];
    if (pool.length < 3) pool = [...landmarks];

    const durOpt = DURATION_OPTS.find(o => o.value === duration);
    const paceOpt = PACE_OPTS.find(o => o.value === pace);
    const count = Math.min(Math.round(durOpt.count * paceOpt.mult), pool.length);
    const stops = nearestNeighbor(pool, count);
    const itinerary = buildItinerary(stops, duration, pace);
    const newResult = { stops, itinerary };
    setResult(newResult);
    onRoute(newResult);
  };

  const clear = () => {
    setResult(null);
    onClear();
  };

  const pill = (selected, value, label, onClick) => (
    <button key={value} onClick={() => onClick(value)} style={{
      padding: '6px 14px', borderRadius: 20,
      border: `1px solid ${selected === value ? 'var(--accent)' : 'var(--border)'}`,
      background: selected === value ? 'var(--accent)' : 'transparent',
      color: selected === value ? '#fff' : 'var(--text-secondary)',
      fontSize: 12, cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap',
    }}>{label}</button>
  );

  return (
    <div style={{ marginBottom: 20 }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '9px 20px', borderRadius: 24,
          background: open ? 'var(--accent)' : 'var(--bg-card)',
          border: `2px solid var(--accent)`,
          color: open ? '#fff' : 'var(--accent)',
          fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
        }}
      >
        <Route size={14} />
        {open ? '收起规划' : '✨ 智能路线规划'}
        {result && !open && (
          <span style={{ fontSize: 10, background: '#52b788', color: '#fff', borderRadius: 10, padding: '1px 8px' }}>
            {result.stops.length} 处
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              marginTop: 12,
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 16, padding: '20px 24px',
            }}>
              {/* Controls */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>停留时间</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {DURATION_OPTS.map(o => pill(duration, o.value, o.label, setDuration))}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>游览节奏</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {PACE_OPTS.map(o => pill(pace, o.value, o.label, setPace))}
                  </div>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>兴趣方向</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {INTEREST_OPTS.map(o => pill(interest, o.value, `${o.icon} ${o.label}`, setInterest))}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <button onClick={generate} style={{
                  padding: '10px 24px', borderRadius: 24,
                  background: 'linear-gradient(135deg, var(--accent), #d4a574)',
                  border: 'none', color: '#fff', fontSize: 13, fontWeight: 700,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <Sparkles size={14} /> 生成专属路线
                </button>
                {result && (
                  <button onClick={clear} style={{
                    padding: '10px 16px', borderRadius: 24,
                    background: 'transparent', border: '1px solid var(--border)',
                    color: 'var(--text-secondary)', fontSize: 12, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                    <RefreshCw size={12} /> 清除路线
                  </button>
                )}
              </div>

              {/* Itinerary */}
              <AnimatePresence>
                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--border)' }}
                  >
                    {result.itinerary.map((item, i) => {
                      if (item.type === 'header') return (
                        <div key={i} style={{
                          display: 'flex', alignItems: 'center', gap: 8,
                          marginBottom: 16, padding: '10px 14px',
                          background: 'var(--bg-secondary)', borderRadius: 10,
                          fontSize: 13, fontWeight: 700, color: 'var(--accent)',
                        }}>
                          <Navigation size={14} />
                          共 {item.count} 处地标 · 预计游览约 {item.hours} 小时
                        </div>
                      );
                      if (item.type === 'stop') return (
                        <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                            <div style={{
                              width: 24, height: 24, borderRadius: '50%',
                              background: item.stop.color, color: '#fff',
                              fontSize: 10, fontWeight: 700,
                              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                            }}>{item.idx}</div>
                            {i < result.itinerary.filter(x => x.type === 'stop').length && (
                              <div style={{ width: 1, flex: 1, background: 'var(--border)', minHeight: 16 }} />
                            )}
                          </div>
                          <div style={{ flex: 1, paddingBottom: 4 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3, flexWrap: 'wrap' }}>
                              <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'monospace', letterSpacing: 0.5 }}>{item.time}</span>
                              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{item.stop.name}</span>
                              <span style={{ fontSize: 10, color: '#fff', background: item.stop.color, borderRadius: 4, padding: '1px 6px' }}>{item.stop.era}</span>
                            </div>
                            <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 2 }}>
                              {item.stop.desc.length > 60 ? item.stop.desc.slice(0, 60) + '…' : item.stop.desc}
                            </div>
                            <div style={{ fontSize: 10, color: 'var(--text-secondary)', opacity: 0.8 }}>
                              ⏱ 建议停留 {item.minutes} 分钟
                            </div>
                          </div>
                        </div>
                      );
                      if (item.type === 'lunch') return (
                        <div key={i} style={{
                          textAlign: 'center', padding: '8px 12px', margin: '4px 0 12px',
                          background: 'var(--bg-secondary)', borderRadius: 8,
                          fontSize: 12, color: 'var(--text-secondary)',
                        }}>
                          🍜 午餐时间 — 就近品尝南京特色美食
                        </div>
                      );
                      if (item.type === 'daybreak') return (
                        <div key={i} style={{
                          textAlign: 'center', padding: '10px 0', margin: '8px 0 12px',
                          borderTop: '2px dashed var(--border)',
                          fontSize: 12, fontWeight: 700, color: 'var(--accent)',
                        }}>
                          ☀️ 第二天行程继续
                        </div>
                      );
                      return null;
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── 其它 UI 组件 ──────────────────────────────────────────
const ALL_ERAS = ['全部', '六朝', '明清', '现当代', '当代'];
const ALL_TYPES = ['全部', '文化地标', '文学地标', '文学空间', '文化街区'];

function PillButton({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: '5px 14px', borderRadius: 20,
      border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
      background: active ? 'var(--accent)' : 'transparent',
      color: active ? '#fff' : 'var(--text-secondary)',
      fontSize: 12, cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap',
    }}>
      {label}
    </button>
  );
}

function SuggestionBox({ landmarkId, landmarkName }) {
  const key = `suggestions_${landmarkId}`;
  const [suggestions, setSuggestions] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
  });
  const [text, setText] = useState('');
  const [nickname, setNickname] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!text.trim()) return;
    const newSug = {
      id: Date.now(),
      nickname: nickname.trim() || '匿名游客',
      text: text.trim(),
      time: new Date().toLocaleDateString('zh-CN'),
    };
    const updated = [newSug, ...suggestions].slice(0, 10);
    setSuggestions(updated);
    localStorage.setItem(key, JSON.stringify(updated));
    setText(''); setNickname(''); setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div style={{ marginTop: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
        <MessageSquare size={14} color="var(--accent)" />
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>游客建议</span>
        <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>（本地存储）</span>
      </div>
      {suggestions.length > 0 && (
        <div style={{ marginBottom: 14, maxHeight: 180, overflowY: 'auto' }}>
          {suggestions.map(s => (
            <div key={s.id} style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: '8px 12px', marginBottom: 6, fontSize: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontWeight: 600, color: 'var(--accent)' }}>{s.nickname}</span>
                <span style={{ color: 'var(--text-secondary)' }}>{s.time}</span>
              </div>
              <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{s.text}</p>
            </div>
          ))}
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <input value={nickname} onChange={e => setNickname(e.target.value)} placeholder="昵称（可选）" maxLength={20}
          style={{ padding: '7px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 12, outline: 'none' }} />
        <textarea value={text} onChange={e => setText(e.target.value)}
          placeholder={`分享你对「${landmarkName}」的游览体验或建议…`} rows={3} maxLength={200}
          style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 12, resize: 'vertical', outline: 'none', fontFamily: 'inherit', lineHeight: 1.6 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{text.length}/200</span>
          <button onClick={handleSubmit} disabled={!text.trim()} style={{
            padding: '7px 18px', borderRadius: 20,
            background: text.trim() ? 'var(--accent)' : 'var(--border)',
            border: 'none', color: '#fff', fontSize: 12,
            cursor: text.trim() ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', gap: 6, transition: 'background 0.2s',
          }}>
            <Send size={12} />
            {submitted ? '已提交！' : '提交建议'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── 图片加载（MediaWiki API + origin=* + referrerPolicy）───
const imgCache = {};

function LandmarkImage({ lm }) {
  const [imgUrl, setImgUrl] = useState(imgCache[lm.id] || null);
  const [status, setStatus] = useState(imgCache[lm.id] ? 'loaded' : lm.wikiTitle ? 'loading' : 'none');

  useEffect(() => {
    if (!lm.wikiTitle || imgCache[lm.id]) return;
    setStatus('loading');
    // 使用 MediaWiki API，origin=* 确保 CORS 正常
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(lm.wikiTitle)}&prop=pageimages&format=json&pithumbsize=640&origin=*`;
    fetch(url)
      .then(r => r.json())
      .then(data => {
        const pages = data.query?.pages;
        if (!pages) { setStatus('none'); return; }
        const page = pages[Object.keys(pages)[0]];
        const src = page?.thumbnail?.source;
        if (src) {
          imgCache[lm.id] = src;
          setImgUrl(src);
          setStatus('loaded');
        } else {
          setStatus('none');
        }
      })
      .catch(() => setStatus('none'));
  }, [lm.id, lm.wikiTitle]);

  if (status === 'none') {
    return (
      <div style={{
        height: 150,
        background: `linear-gradient(135deg, ${lm.color}22, ${lm.color}66)`,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', color: lm.color,
      }}>
        <div style={{ fontSize: 34 }}>{typeIcons[lm.type]}</div>
        <div className="font-serif" style={{ fontSize: 13, fontWeight: 700, marginTop: 8 }}>{lm.name}</div>
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <div style={{
        height: 150,
        background: `linear-gradient(135deg, ${lm.color}11, ${lm.color}33)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>加载实景图…</div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', height: 180, overflow: 'hidden' }}>
      <img
        src={imgUrl}
        alt={lm.name}
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
        onError={() => setStatus('none')}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '28px 14px 8px',
        background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
      }}>
        <div className="font-serif" style={{ color: '#fff', fontSize: 15, fontWeight: 700, textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>
          {lm.name}
        </div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.75)', marginTop: 2 }}>图片来源：Wikipedia</div>
      </div>
    </div>
  );
}

// ─── 详情面板 ─────────────────────────────────────────────
function DetailPanel({ lm, onClose }) {
  if (!lm) return null;
  const d = lm.detail;
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{
        position: 'sticky', top: 20,
        width: 340, flexShrink: 0,
        maxHeight: '80vh', overflowY: 'auto',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderLeft: `5px solid ${lm.color}`,
        borderRadius: 12,
        boxShadow: 'var(--shadow-md)',
      }}
    >
      <div style={{
        padding: '20px 20px 16px', borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, background: 'var(--bg-card)', zIndex: 1,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <span style={{ fontSize: 18 }}>{typeIcons[lm.type]}</span>
              <h3 className="font-serif" style={{ margin: 0, fontSize: 17, color: lm.color }}>{lm.name}</h3>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{lm.era} · {lm.type}</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: 4, display: 'flex' }}>
            <X size={16} />
          </button>
        </div>
      </div>

      <LandmarkImage lm={lm} />

      <div style={{ padding: '0 20px 20px' }}>
        <div style={{ paddingTop: 16, marginBottom: 16 }}>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8, margin: 0 }}>{lm.desc}</p>
        </div>
        {(lm.works || lm.writers) && (
          <div style={{ background: `${lm.color}10`, borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 12 }}>
            {lm.works && <div><span style={{ color: lm.color, fontWeight: 600 }}>代表作品：</span>{lm.works}</div>}
            {lm.writers && <div style={{ marginTop: lm.works ? 4 : 0 }}><span style={{ color: lm.color, fontWeight: 600 }}>相关作家：</span>{lm.writers}</div>}
          </div>
        )}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>历史沿革</div>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.8, margin: 0 }}>{d.history}</p>
        </div>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>游览亮点</div>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.8, margin: 0 }}>{d.highlight}</p>
        </div>
        <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: '12px 14px', marginBottom: 16 }}>
          {[
            { icon: Clock, label: '开放时间', val: d.openHours },
            { icon: Ticket, label: '门票', val: d.ticket },
            { icon: Train, label: '交通', val: d.transport },
          ].map(({ icon: Icon, label, val }) => (
            <div key={label} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <Icon size={12} color="var(--accent)" style={{ marginTop: 3, flexShrink: 0 }} />
              <div>
                <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600 }}>{label}：</span>
                <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{val}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginBottom: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <Lightbulb size={13} color="var(--accent)" />
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>游览贴士</span>
          </div>
          {d.tips.map((tip, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 7 }}>
              <div style={{
                width: 16, height: 16, borderRadius: '50%',
                background: lm.color, color: '#fff',
                fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, marginTop: 1, fontWeight: 700,
              }}>{i + 1}</div>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.7 }}>{tip}</p>
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 4 }}>
          <SuggestionBox landmarkId={lm.id} landmarkName={lm.name} />
        </div>
      </div>
    </motion.div>
  );
}

// ─── 地标列表项 ────────────────────────────────────────────
function LandmarkListItem({ lm, active, routeIdx, onClick }) {
  return (
    <motion.div
      whileHover={{ x: 2 }}
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 14px', borderRadius: 8, cursor: 'pointer',
        background: active ? `${lm.color}15` : 'transparent',
        border: `1px solid ${active ? lm.color + '44' : 'transparent'}`,
        marginBottom: 4, transition: 'all 0.15s',
      }}
    >
      {routeIdx !== undefined ? (
        <div style={{
          width: 18, height: 18, borderRadius: '50%',
          background: lm.color, color: '#fff',
          fontSize: 9, fontWeight: 700, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{routeIdx}</div>
      ) : (
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: lm.color, flexShrink: 0 }} />
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: active ? 600 : 400, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {typeIcons[lm.type]} {lm.name}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 1 }}>{lm.era} · {lm.type}</div>
      </div>
      {active && <div style={{ width: 6, height: 6, borderRadius: '50%', background: lm.color, flexShrink: 0 }} />}
    </motion.div>
  );
}

// ─── 主页面 ───────────────────────────────────────────────
export default function LiteraryMap() {
  const [selectedEra, setSelectedEra] = useState('全部');
  const [selectedType, setSelectedType] = useState('全部');
  const [flyTarget, setFlyTarget] = useState(null);
  const [activeLm, setActiveLm] = useState(null);
  const [routeResult, setRouteResult] = useState(null);

  const filtered = routeResult
    ? routeResult.stops
    : landmarks.filter(lm =>
        (selectedEra === '全部' || lm.era === selectedEra) &&
        (selectedType === '全部' || lm.type === selectedType)
      );

  const handleSelect = (lm) => {
    setActiveLm(lm);
    setFlyTarget(lm);
  };

  const handleRoute = (result) => {
    setRouteResult(result);
    setActiveLm(null);
  };

  const handleClearRoute = () => {
    setRouteResult(null);
  };

  const routePositions = routeResult?.stops.map(s => [s.lat, s.lng]) || [];

  return (
    <div style={{ padding: '48px 48px 80px', maxWidth: 1200, margin: '0 auto' }}>
      <SectionHeader
        icon="🗺"
        title="南京文学地图"
        subtitle="探访千年文脉留下的空间印记，感受文学与城市的共生"
      />

      {/* 路线规划面板 */}
      <RoutePlanner onRoute={handleRoute} onClear={handleClearRoute} />

      {/* 筛选器（路线模式下隐藏） */}
      {!routeResult && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: '28px', marginRight: 4 }}>时期：</span>
            {ALL_ERAS.map(e => <PillButton key={e} label={e} active={selectedEra === e} onClick={() => setSelectedEra(e)} />)}
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: '28px', marginRight: 4 }}>类型：</span>
            {ALL_TYPES.map(t => <PillButton key={t} label={t} active={selectedType === t} onClick={() => setSelectedType(t)} />)}
          </div>
        </div>
      )}

      {/* 路线模式提示条 */}
      {routeResult && (
        <div style={{
          marginBottom: 16, padding: '10px 16px',
          background: 'var(--accent)18', border: '1px solid var(--accent)44',
          borderRadius: 10, fontSize: 12, color: 'var(--accent)', fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <Route size={13} />
          路线规划模式 · {routeResult.stops.length} 处地标已标记，点击编号查看详情
        </div>
      )}

      {/* 主体：地图 + 侧边详情 */}
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        {/* 左栏：地图 + 列表 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)', marginBottom: 20 }}>
            <MapContainer center={[32.06, 118.78]} zoom={13} style={{ height: '50vh', width: '100%' }}>
              <TileLayer
                url="https://wprd01.is.autonavi.com/appmaptile?style=7&x={x}&y={y}&z={z}"
                attribution="&copy; 高德地图"
                maxZoom={18}
              />
              <FlyToMarker target={flyTarget} />
              {routeResult && <FitRouteBounds stops={routeResult.stops} />}

              {/* 路线连线 */}
              {routePositions.length >= 2 && (
                <Polyline
                  positions={routePositions}
                  pathOptions={{
                    color: '#8B4513',
                    weight: 3,
                    opacity: 0.75,
                    dashArray: '8 5',
                  }}
                />
              )}

              {/* 地标 Marker */}
              {routeResult
                ? routeResult.stops.map((lm, idx) => (
                    <Marker
                      key={lm.id}
                      position={[lm.lat, lm.lng]}
                      icon={createRouteIcon(idx + 1, lm.color)}
                      eventHandlers={{ click: () => handleSelect(lm) }}
                    >
                      <Popup>
                        <div style={{ padding: '8px 4px', minWidth: 140 }}>
                          <div style={{ fontWeight: 700, fontSize: 13, fontFamily: "'Noto Serif SC', serif", marginBottom: 4 }}>
                            {idx + 1}. {lm.name}
                          </div>
                          <div style={{ fontSize: 11, color: '#666', marginBottom: 6 }}>{lm.era} · {lm.type}</div>
                          <button onClick={() => handleSelect(lm)} style={{
                            padding: '4px 12px', borderRadius: 12,
                            background: lm.color, border: 'none',
                            color: '#fff', fontSize: 11, cursor: 'pointer',
                          }}>查看详情</button>
                        </div>
                      </Popup>
                    </Marker>
                  ))
                : filtered.map(lm => (
                    <Marker
                      key={lm.id}
                      position={[lm.lat, lm.lng]}
                      icon={createIcon(eraColors[lm.era] || '#888', activeLm?.id === lm.id)}
                      eventHandlers={{ click: () => handleSelect(lm) }}
                    >
                      <Popup>
                        <div style={{ padding: '10px 4px', minWidth: 160 }}>
                          <div style={{ fontWeight: 700, fontSize: 13, fontFamily: "'Noto Serif SC', serif", marginBottom: 4 }}>{lm.name}</div>
                          <div style={{ fontSize: 11, color: '#666', marginBottom: 6 }}>{lm.era} · {lm.type}</div>
                          <p style={{ fontSize: 11, color: '#666', margin: '0 0 8px', lineHeight: 1.6 }}>{lm.desc}</p>
                          <button onClick={() => handleSelect(lm)} style={{
                            padding: '4px 12px', borderRadius: 12,
                            background: lm.color, border: 'none',
                            color: '#fff', fontSize: 11, cursor: 'pointer',
                          }}>查看详情</button>
                        </div>
                      </Popup>
                    </Marker>
                  ))
              }
            </MapContainer>
          </div>

          {/* 图例 */}
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 16 }}>
            {Object.entries(eraColors).map(([era, color]) => (
              <div key={era} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 9, height: 9, borderRadius: '50%', background: color }} />
                <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{era}</span>
              </div>
            ))}
            <span style={{ fontSize: 11, color: 'var(--text-secondary)', marginLeft: 'auto' }}>
              {routeResult ? `路线 ${routeResult.stops.length} 处` : `显示 ${filtered.length} / ${landmarks.length} 处`}
            </span>
          </div>

          {/* 地标列表 */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 12px' }}>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 10, padding: '0 4px' }}>
              {routeResult ? '路线站点（按顺序）' : '点击地标查看详细介绍与游览攻略'}
            </div>
            {(routeResult ? routeResult.stops : filtered).map((lm, idx) => (
              <LandmarkListItem
                key={lm.id}
                lm={lm}
                active={activeLm?.id === lm.id}
                routeIdx={routeResult ? idx + 1 : undefined}
                onClick={() => handleSelect(lm)}
              />
            ))}
          </div>
        </div>

        {/* 右侧详情面板 */}
        <AnimatePresence mode="wait">
          {activeLm && (
            <DetailPanel
              key={activeLm.id}
              lm={activeLm}
              onClose={() => setActiveLm(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
