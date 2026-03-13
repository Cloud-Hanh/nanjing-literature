import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Clock, Ticket, Train, Lightbulb, Send, MessageSquare, X } from 'lucide-react';
import { landmarks, eraColors, typeIcons } from '../data/landmarks';
import SectionHeader from '../components/SectionHeader';

// 自定义圆形 DivIcon
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

function FlyToMarker({ target }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo([target.lat, target.lng], 15, { duration: 1.2 });
  }, [target, map]);
  return null;
}

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

// 用户建议提交组件（存储到 localStorage）
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
    const updated = [newSug, ...suggestions].slice(0, 10); // 最多保留10条
    setSuggestions(updated);
    localStorage.setItem(key, JSON.stringify(updated));
    setText('');
    setNickname('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div style={{ marginTop: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
        <MessageSquare size={14} color="var(--accent)" />
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
          游客建议
        </span>
        <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>（本地存储，仅供参考）</span>
      </div>

      {/* 已有建议 */}
      {suggestions.length > 0 && (
        <div style={{ marginBottom: 14, maxHeight: 180, overflowY: 'auto' }}>
          {suggestions.map(s => (
            <div key={s.id} style={{
              background: 'var(--bg-secondary)',
              borderRadius: 8, padding: '8px 12px',
              marginBottom: 6, fontSize: 12,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontWeight: 600, color: 'var(--accent)' }}>{s.nickname}</span>
                <span style={{ color: 'var(--text-secondary)' }}>{s.time}</span>
              </div>
              <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{s.text}</p>
            </div>
          ))}
        </div>
      )}

      {/* 提交表单 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <input
          value={nickname}
          onChange={e => setNickname(e.target.value)}
          placeholder="昵称（可选）"
          maxLength={20}
          style={{
            padding: '7px 12px', borderRadius: 8,
            border: '1px solid var(--border)',
            background: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            fontSize: 12, outline: 'none',
          }}
        />
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder={`分享你对「${landmarkName}」的游览体验或建议…`}
          rows={3}
          maxLength={200}
          style={{
            padding: '8px 12px', borderRadius: 8,
            border: '1px solid var(--border)',
            background: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            fontSize: 12, resize: 'vertical', outline: 'none',
            fontFamily: 'inherit', lineHeight: 1.6,
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{text.length}/200</span>
          <button
            onClick={handleSubmit}
            disabled={!text.trim()}
            style={{
              padding: '7px 18px', borderRadius: 20,
              background: text.trim() ? 'var(--accent)' : 'var(--border)',
              border: 'none', color: '#fff', fontSize: 12,
              cursor: text.trim() ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', gap: 6,
              transition: 'background 0.2s',
            }}
          >
            <Send size={12} />
            {submitted ? '已提交！' : '提交建议'}
          </button>
        </div>
      </div>
    </div>
  );
}

// 实景图组件（带 onerror 占位）
function LandmarkImage({ lm }) {
  const [failed, setFailed] = useState(false);

  if (!lm.image || failed) {
    return (
      <div style={{
        height: 160,
        background: `linear-gradient(135deg, ${lm.color}33, ${lm.color}88)`,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        color: lm.color,
      }}>
        <div style={{ fontSize: 36 }}>{typeIcons[lm.type]}</div>
        <div className="font-serif" style={{ fontSize: 14, fontWeight: 700, marginTop: 8 }}>{lm.name}</div>
        <div style={{ fontSize: 11, opacity: 0.7, marginTop: 4 }}>实景图待补充</div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', height: 180, overflow: 'hidden' }}>
      <img
        src={lm.image}
        alt={lm.name}
        onError={() => setFailed(true)}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '24px 14px 8px',
        background: 'linear-gradient(transparent, rgba(0,0,0,0.55))',
      }}>
        <div className="font-serif" style={{ color: '#fff', fontSize: 15, fontWeight: 700, textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
          {lm.name}
        </div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>
          图片来源：Wikimedia Commons
        </div>
      </div>
    </div>
  );
}

// 详情面板
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
        position: 'sticky',
        top: 20,
        width: 340,
        flexShrink: 0,
        maxHeight: '80vh',
        overflowY: 'auto',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderLeft: `5px solid ${lm.color}`,
        borderRadius: 12,
        boxShadow: 'var(--shadow-md)',
      }}
    >
      {/* 头部 */}
      <div style={{
        padding: '20px 20px 16px',
        borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0,
        background: 'var(--bg-card)', zIndex: 1,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <span style={{ fontSize: 18 }}>{typeIcons[lm.type]}</span>
              <h3 className="font-serif" style={{ margin: 0, fontSize: 17, color: lm.color }}>{lm.name}</h3>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{lm.era} · {lm.type}</div>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-secondary)', padding: 4, display: 'flex',
          }}>
            <X size={16} />
          </button>
        </div>
      </div>

      {/* 实景图 */}
      <LandmarkImage lm={lm} />

      <div style={{ padding: '0 20px 20px' }}>
        {/* 简介 */}
        <div style={{ paddingTop: 16, marginBottom: 16 }}>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8, margin: 0 }}>
            {lm.desc}
          </p>
        </div>

        {/* 相关作品 */}
        {(lm.works || lm.writers) && (
          <div style={{
            background: `${lm.color}10`,
            borderRadius: 8, padding: '10px 14px',
            marginBottom: 16, fontSize: 12,
          }}>
            {lm.works && <div><span style={{ color: lm.color, fontWeight: 600 }}>代表作品：</span>{lm.works}</div>}
            {lm.writers && <div style={{ marginTop: lm.works ? 4 : 0 }}><span style={{ color: lm.color, fontWeight: 600 }}>相关作家：</span>{lm.writers}</div>}
          </div>
        )}

        {/* 历史介绍 */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>历史沿革</div>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.8, margin: 0 }}>
            {d.history}
          </p>
        </div>

        {/* 游览亮点 */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>游览亮点</div>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.8, margin: 0 }}>
            {d.highlight}
          </p>
        </div>

        {/* 实用信息 */}
        <div style={{
          background: 'var(--bg-secondary)', borderRadius: 10,
          padding: '12px 14px', marginBottom: 16,
        }}>
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

        {/* 游览贴士 */}
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
              }}>
                {i + 1}
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.7 }}>{tip}</p>
            </div>
          ))}
        </div>

        {/* 用户建议 */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 4 }}>
          <SuggestionBox landmarkId={lm.id} landmarkName={lm.name} />
        </div>
      </div>
    </motion.div>
  );
}

// 地标列表项
function LandmarkListItem({ lm, active, onClick }) {
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
      <div style={{
        width: 10, height: 10, borderRadius: '50%',
        background: lm.color, flexShrink: 0,
      }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: active ? 600 : 400, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {typeIcons[lm.type]} {lm.name}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 1 }}>
          {lm.era} · {lm.type}
        </div>
      </div>
      {active && (
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: lm.color, flexShrink: 0 }} />
      )}
    </motion.div>
  );
}

export default function LiteraryMap() {
  const [selectedEra, setSelectedEra] = useState('全部');
  const [selectedType, setSelectedType] = useState('全部');
  const [flyTarget, setFlyTarget] = useState(null);
  const [activeLm, setActiveLm] = useState(null);

  const filtered = landmarks.filter(lm =>
    (selectedEra === '全部' || lm.era === selectedEra) &&
    (selectedType === '全部' || lm.type === selectedType)
  );

  const handleSelect = (lm) => {
    setActiveLm(lm);
    setFlyTarget(lm);
  };

  return (
    <div style={{ padding: '48px 48px 80px', maxWidth: 1200, margin: '0 auto' }}>
      <SectionHeader
        icon="🗺"
        title="南京文学地图"
        subtitle="探访千年文脉留下的空间印记，感受文学与城市的共生"
      />

      {/* 筛选器 */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: '28px', marginRight: 4 }}>时期：</span>
          {ALL_ERAS.map(e => (
            <PillButton key={e} label={e} active={selectedEra === e} onClick={() => setSelectedEra(e)} />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: '28px', marginRight: 4 }}>类型：</span>
          {ALL_TYPES.map(t => (
            <PillButton key={t} label={t} active={selectedType === t} onClick={() => setSelectedType(t)} />
          ))}
        </div>
      </div>

      {/* 主体：地图 + 侧边详情 */}
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        {/* 左栏：地图 + 列表 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* 地图 */}
          <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)', marginBottom: 20 }}>
            <MapContainer center={[32.06, 118.78]} zoom={13} style={{ height: '50vh', width: '100%' }}>
              <TileLayer
                url="https://wprd01.is.autonavi.com/appmaptile?style=7&x={x}&y={y}&z={z}"
                attribution="&copy; 高德地图"
                maxZoom={18}
              />
              <FlyToMarker target={flyTarget} />
              {filtered.map(lm => (
                <Marker
                  key={lm.id}
                  position={[lm.lat, lm.lng]}
                  icon={createIcon(eraColors[lm.era] || '#888', activeLm?.id === lm.id)}
                  eventHandlers={{ click: () => handleSelect(lm) }}
                >
                  <Popup>
                    <div style={{ padding: '10px 4px', minWidth: 160 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, fontFamily: "'Noto Serif SC', serif", marginBottom: 4 }}>
                        {lm.name}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 6 }}>
                        {lm.era} · {lm.type}
                      </div>
                      <p style={{ fontSize: 11, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                        {lm.desc}
                      </p>
                      <button
                        onClick={() => handleSelect(lm)}
                        style={{
                          marginTop: 8, padding: '4px 12px', borderRadius: 12,
                          background: lm.color, border: 'none',
                          color: '#fff', fontSize: 11, cursor: 'pointer',
                        }}
                      >
                        查看详情
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
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
              显示 {filtered.length} / {landmarks.length} 处
            </span>
          </div>

          {/* 地标列表 */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: '14px 12px',
          }}>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 10, padding: '0 4px' }}>
              点击地标查看详细介绍与游览攻略
            </div>
            {filtered.map(lm => (
              <LandmarkListItem
                key={lm.id}
                lm={lm}
                active={activeLm?.id === lm.id}
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
