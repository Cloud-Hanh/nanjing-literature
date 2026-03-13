import { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { landmarks, eraColors, typeIcons } from '../data/landmarks';
import SectionHeader from '../components/SectionHeader';

// 自定义圆形 DivIcon
function createIcon(color) {
  return L.divIcon({
    className: '',
    html: `<div style="
      width:28px;height:28px;border-radius:50%;
      background:${color};border:3px solid #fff;
      box-shadow:0 2px 8px rgba(0,0,0,0.3);
      display:flex;align-items:center;justify-content:center;
      font-size:12px;cursor:pointer;
    "></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  });
}

// 地图飞行控制
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
    <button
      onClick={onClick}
      style={{
        padding: '5px 14px',
        borderRadius: 20,
        border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
        background: active ? 'var(--accent)' : 'transparent',
        color: active ? '#fff' : 'var(--text-secondary)',
        fontSize: 12,
        cursor: 'pointer',
        transition: 'all 0.2s',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </button>
  );
}

function LandmarkCard({ lm, expanded, onToggle, onFly }) {
  return (
    <div
      className="card"
      style={{ marginBottom: 10, overflow: 'hidden', cursor: 'pointer' }}
    >
      <div
        onClick={() => { onToggle(); onFly(lm); }}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 10, height: 10, borderRadius: '50%',
            background: eraColors[lm.era] || '#888',
            flexShrink: 0,
          }} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
              {typeIcons[lm.type]} {lm.name}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
              {lm.era} · {lm.type}
            </div>
          </div>
        </div>
        {expanded ? <ChevronUp size={14} color="var(--text-secondary)" /> : <ChevronDown size={14} color="var(--text-secondary)" />}
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="detail"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              padding: '0 16px 14px',
              borderTop: '1px solid var(--border)',
              paddingTop: 12,
            }}>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, margin: '0 0 8px' }}>
                {lm.desc}
              </p>
              {lm.works && (
                <div style={{ fontSize: 12, color: 'var(--text-primary)' }}>
                  <span style={{ color: 'var(--accent)' }}>代表作品：</span>{lm.works}
                </div>
              )}
              {lm.writers && (
                <div style={{ fontSize: 12, color: 'var(--text-primary)', marginTop: 4 }}>
                  <span style={{ color: 'var(--accent)' }}>相关作家：</span>{lm.writers}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function LiteraryMap() {
  const [selectedEra, setSelectedEra] = useState('全部');
  const [selectedType, setSelectedType] = useState('全部');
  const [flyTarget, setFlyTarget] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const filtered = landmarks.filter(lm =>
    (selectedEra === '全部' || lm.era === selectedEra) &&
    (selectedType === '全部' || lm.type === selectedType)
  );

  return (
    <div style={{ padding: '48px 48px 80px', maxWidth: 1100, margin: '0 auto' }}>
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

      {/* 地图 */}
      <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)', marginBottom: 28 }}>
        <MapContainer
          center={[32.06, 118.78]}
          zoom={13}
          style={{ height: '55vh', width: '100%' }}
          zoomControl={true}
        >
          <TileLayer
            url="https://wprd01.is.autonavi.com/appmaptile?style=7&x={x}&y={y}&z={z}"
            attribution='&copy; 高德地图'
            maxZoom={18}
          />
          <FlyToMarker target={flyTarget} />
          {filtered.map(lm => (
            <Marker
              key={lm.id}
              position={[lm.lat, lm.lng]}
              icon={createIcon(eraColors[lm.era] || '#888')}
              eventHandlers={{
                click: () => {
                  setExpandedId(lm.id);
                  setFlyTarget(lm);
                },
              }}
            >
              <Popup>
                <div style={{ padding: '12px 4px', minWidth: 200 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6, fontFamily: "'Noto Serif SC', serif" }}>
                    {lm.name}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 8 }}>
                    {lm.era} · {lm.type}
                  </div>
                  <p style={{ fontSize: 12, lineHeight: 1.7, margin: '0 0 8px', color: 'var(--text-secondary)' }}>
                    {lm.desc}
                  </p>
                  {lm.works && <div style={{ fontSize: 11 }}><b>作品：</b>{lm.works}</div>}
                  {lm.writers && <div style={{ fontSize: 11, marginTop: 3 }}><b>作家：</b>{lm.writers}</div>}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* 图例 */}
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 24 }}>
        {Object.entries(eraColors).map(([era, color]) => (
          <div key={era} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{era}</span>
          </div>
        ))}
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginLeft: 'auto' }}>
          共 {filtered.length} 处地标
        </div>
      </div>

      {/* 地标列表 */}
      <div>
        {filtered.map(lm => (
          <LandmarkCard
            key={lm.id}
            lm={lm}
            expanded={expandedId === lm.id}
            onToggle={() => setExpandedId(expandedId === lm.id ? null : lm.id)}
            onFly={setFlyTarget}
          />
        ))}
      </div>
    </div>
  );
}
