// 真实问卷数据，n=216，2024年调研

export const surveyMeta = {
  total: 216,
};

// Q1 年龄分布
export const q1Age = [
  { label: '18岁以下',              value: 4,   pct: 1.85 },
  { label: '18-22岁（本科）',       value: 39,  pct: 18.06 },
  { label: '23-29岁（研究生/初职）', value: 15,  pct: 6.94 },
  { label: '30岁以上',              value: 158, pct: 73.15 },
];

// Q2 与南京的关系
export const q2Relation = [
  { label: '在南京生活/学习/工作', value: 98,  pct: 45.37 },
  { label: '曾在南京生活',        value: 17,  pct: 7.87 },
  { label: '旅游/短暂停留',       value: 92,  pct: 42.59 },
  { label: '从未到过南京',        value: 9,   pct: 4.17 },
];

// Q3 "世界文学之都"称号知晓度（单选）
export const q3Awareness = [
  { label: '知道且了解',      value: 43,  pct: 19.91 },
  { label: '听说过不太了解',  value: 98,  pct: 45.37 },
  { label: '第一次了解到',    value: 75,  pct: 34.72 },
];

// Q4 文学文化符号认知（多选，value为人数，pct为占216的比例）
export const q4Symbols = [
  { label: '经典文学作品',        text: '红楼梦·儒林外史·背影',    value: 149, pct: 68.98 },
  { label: '江南贡院·科举文化',   text: '江南贡院',                value: 144, pct: 66.67 },
  { label: '六朝文学',            text: '文心雕龙·诗品·世说新语',  value: 125, pct: 57.87 },
  { label: '近现代文学名家',      text: '鲁迅·朱自清·张爱玲',      value: 123, pct: 56.94 },
  { label: '了解较少',            text: '以上均不了解',             value: 22,  pct: 10.19 },
];

// Q5 对南京文学历史底蕴自评（单选）
export const q5Understanding = [
  { label: '非常了解',  value: 25,  pct: 11.57 },
  { label: '有一定了解', value: 141, pct: 65.28 },
  { label: '了解较少',  value: 41,  pct: 18.98 },
  { label: '几乎不了解', value: 9,   pct: 4.17 },
];

// Q6 文学氛围感受（单选）
export const q6Atmosphere = [
  { label: '浓厚',    value: 61,  pct: 28.24 },
  { label: '较好',    value: 98,  pct: 45.37 },
  { label: '一般',    value: 38,  pct: 17.59 },
  { label: '较弱',    value: 8,   pct: 3.70 },
  { label: '无法评价', value: 11,  pct: 5.09 },
];

// Q7 体验过的文学空间（多选）
export const q7Spaces = [
  { label: '老门东·乌衣巷·朝天宫',   value: 161, pct: 74.54 },
  { label: '先锋书店·锦创书城',       value: 122, pct: 56.48 },
  { label: '南京图书馆·漂流驿站',     value: 98,  pct: 45.37 },
  { label: '世界文学客厅·杨苡书屋',   value: 44,  pct: 20.37 },
  { label: '以上均未体验',            value: 31,  pct: 14.35 },
];

// Q8 参加过的文学活动（多选）
export const q8Activities = [
  { label: '城市文学行走·地标打卡', value: 66,  pct: 30.56 },
  { label: '线上文学社群·阅读打卡', value: 42,  pct: 19.44 },
  { label: '读书节等大型活动',       value: 41,  pct: 18.98 },
  { label: '名家讲座·文学沙龙',     value: 36,  pct: 16.67 },
  { label: '以上均未参加',          value: 108, pct: 50.00 },
];

// Q9 信息渠道（多选）
export const q9Channels = [
  { label: '社交媒体',         value: 141, pct: 65.28 },
  { label: '微信公众号',       value: 131, pct: 60.65 },
  { label: '朋友推荐',         value: 107, pct: 49.54 },
  { label: '实地偶遇',         value: 87,  pct: 40.28 },
  { label: '几乎不关注',       value: 17,  pct: 7.87 },
];

// Q10 主要问题（多选）
export const q10Problems = [
  { label: '宣传力度不足',         value: 140, pct: 64.81 },
  { label: '缺乏地标串联',         value: 117, pct: 54.17 },
  { label: '青年参与感不足',       value: 110, pct: 50.93 },
  { label: '与日常生活融合不深',   value: 107, pct: 49.54 },
  { label: '活化形式单一',         value: 87,  pct: 40.28 },
  { label: '国际知名度不够',       value: 87,  pct: 40.28 },
];

// Q11 最吸引的体验形式（单选）
export const q11Experience = [
  { label: '城市漫步路线',   value: 73, pct: 33.80 },
  { label: '文学+市井融合',  value: 54, pct: 25.00 },
  { label: '沉浸式体验',     value: 36, pct: 16.67 },
  { label: '线上互动',       value: 29, pct: 13.43 },
  { label: '文学创作参与',   value: 24, pct: 11.11 },
];

// Q12 文学旅游路线期待元素（多选）
export const q12RouteElements = [
  { label: '经典地标实地探访', value: 163, pct: 75.46 },
  { label: '美食·文创体验',   value: 147, pct: 68.06 },
  { label: '名家故居·文学馆', value: 106, pct: 49.07 },
  { label: '互动环节',         value: 92,  pct: 42.59 },
  { label: '音频导览',         value: 87,  pct: 40.28 },
  { label: '数字自定义地图',   value: 53,  pct: 24.54 },
];

// Q13 提升青年关注方式（单选）
export const q13YouthEngagement = [
  { label: '高校联动',       value: 61, pct: 28.24 },
  { label: '影视·综艺联动',  value: 60, pct: 27.78 },
  { label: 'KOL·博主探访',  value: 42, pct: 19.44 },
  { label: '青年文学节',     value: 27, pct: 12.50 },
  { label: '文学文创产品',   value: 26, pct: 12.04 },
];

// Q14 参与意愿（单选）
export const q14Willingness = [
  { label: '比较愿意',   value: 87, pct: 40.28 },
  { label: '非常愿意',   value: 57, pct: 26.39 },
  { label: '看情况',     value: 57, pct: 26.39 },
  { label: '兴趣不大',  value: 15, pct: 6.94 },
];
