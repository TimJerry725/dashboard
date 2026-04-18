import React, { useState, useMemo } from 'react';
import dayjs from 'dayjs';
import { 
  Card, 
  Row, 
  Col, 
  DatePicker, 
  Button, 
  Select, 
  TreeSelect, 
  Space,
  Typography
} from 'antd';
import { 
  SearchOutlined, 
  ReloadOutlined, 
  FullscreenOutlined, 
  MoreOutlined
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';

// Connector SVGs
import type2Svg from '../../assets/type_2.svg';
import ccs2Svg from '../../assets/ccs2.svg';
import chademoSvg from '../../assets/chademo.svg';

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

// ───── Types ─────
type TimePeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';
type Perspective = 'cpid' | 'station' | 'time';
type Breakdown = 'connector' | 'transaction' | 'vehicle' | 'charger_make';
type ChartMetric = 'energy' | 'sessions' | 'revenue';

// ───── Constants ─────
const TIME_LABELS: Record<TimePeriod, string[]> = {
  daily:   Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`),
  weekly:  ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
  monthly: Array.from({ length: 12 }, (_, i) => `Month ${i + 1}`),
  yearly:  Array.from({ length: 5 }, (_, i) => `Year ${i + 1}`),
};

const CPID_WEIGHTS: Record<string, number> = {
  'cpid-23213': 1.0, 'cpid-23214': 0.85, 'cpid-23215': 0.7,
  'cpid-23216': 0.6, 'cpid-23217': 0.75, 'cpid-23220': 0.4,
};

const STATION_CPIDS: Record<string, string[]> = {
  'steam-a':        ['cpid-23213', 'cpid-23214'],
  'psg':            ['cpid-23215'],
  'kct':            ['cpid-23216'],
  'hotel-radisson': ['cpid-23217'],
  'east':           ['cpid-23220'],
  'tamil-nadu':     ['cpid-23213', 'cpid-23214', 'cpid-23215', 'cpid-23216', 'cpid-23217'],
  'kerala':         [],
  'karnataka':      [],
  'south':          ['cpid-23213', 'cpid-23214', 'cpid-23215', 'cpid-23216', 'cpid-23217'],
  'north':          [],
  'india':          ['cpid-23213', 'cpid-23214', 'cpid-23215', 'cpid-23216', 'cpid-23217', 'cpid-23220'],
};

const ALL_CPIDS = Object.keys(CPID_WEIGHTS);

const locationTreeData = [
  {
    title: 'India', value: 'india', key: 'india', children: [
      { title: 'North', value: 'north', key: 'north' },
      {
        title: 'South', value: 'south', key: 'south', children: [
          { title: 'Kerala', value: 'kerala', key: 'kerala' },
          { title: 'Karnataka', value: 'karnataka', key: 'karnataka' },
          {
            title: 'Tamil Nadu', value: 'tamil-nadu', key: 'tamil-nadu', children: [
              {
                title: 'Steam-a', value: 'steam-a', key: 'steam-a', children: [
                  { title: 'CPID 23213', value: 'cpid-23213', key: 'cpid-23213' },
                  { title: 'CPID 23214', value: 'cpid-23214', key: 'cpid-23214' },
                ]
              },
              {
                title: 'PSG Institute of Technology', value: 'psg', key: 'psg', children: [
                  { title: 'CPID 23215', value: 'cpid-23215', key: 'cpid-23215' },
                ]
              },
              {
                title: 'KCT', value: 'kct', key: 'kct', children: [
                  { title: 'CPID 23216', value: 'cpid-23216', key: 'cpid-23216' },
                ]
              },
              {
                title: 'Hotel Radisson Blu', value: 'hotel-radisson', key: 'hotel-radisson', children: [
                  { title: 'CPID 23217', value: 'cpid-23217', key: 'cpid-23217' },
                ]
              },
            ]
          }
        ]
      },
      { title: 'East', value: 'east', key: 'east', children: [
        { title: 'CPID 23220', value: 'cpid-23220', key: 'cpid-23220' }
      ]},
    ]
  }
];

// ───── Helpers ─────
function resolveSelectedCPIDs(selected: string[]): string[] {
  if (selected.length === 0) return ALL_CPIDS;
  const cpids = new Set<string>();
  selected.forEach(val => {
    if (CPID_WEIGHTS[val]) { cpids.add(val); }
    else if (STATION_CPIDS[val]) { STATION_CPIDS[val].forEach(c => cpids.add(c)); }
  });
  return cpids.size > 0 ? Array.from(cpids) : ALL_CPIDS;
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

function generateData(labels: string[], scale: number, seed: number): number[] {
  return labels.map((_, i) => {
    const base = 25 + Math.sin(i * 0.7 + seed) * 18;
    const noise = seededRandom(i * 100 + seed * 37) * 20;
    return Math.max(2, Math.round((base + noise) * scale));
  });
}

function buildChartOption(
  metric: ChartMetric,
  timePeriod: TimePeriod,
  perspective: Perspective,
  breakdown: Breakdown,
  selectedLocations: string[],
  activeConnectors: string[],
  dateRange: any
): any {
  let labels = TIME_LABELS[timePeriod];

  if (timePeriod === 'daily') {
    if (dateRange && dateRange[0] && dateRange[1]) {
      const start = dateRange[0];
      const end = dateRange[1];
      const diff = end.diff(start, 'day');
      labels = [];
      for (let i = 0; i <= diff; i++) {
        labels.push(start.add(i, 'day').format('DD MMM'));
      }
    } else {
      // Past 7 days default
      labels = [];
      for (let i = 6; i >= 0; i--) {
        labels.push(dayjs().subtract(i, 'day').format('DD MMM'));
      }
    }
  }

  const activeCPIDs = resolveSelectedCPIDs(selectedLocations);
  const locationScale = activeCPIDs.reduce((sum, k) => sum + (CPID_WEIGHTS[k] || 0.3), 0) / ALL_CPIDS.length;
  const connectorScale = activeConnectors.length / 3;
  const totalScale = Math.max(0.15, locationScale * connectorScale);

  let unit = 'kWh';
  let multiplier = 1;
  if (metric === 'sessions') { unit = 'Sessions'; multiplier = 0.3; }
  if (metric === 'revenue') { unit = '₹'; multiplier = 8; }

  let series: any[] = [];

  if (breakdown === 'transaction') {
    const items = [
      { name: 'Mobile', color: '#91caff', seed: 1 },
      { name: 'CMS', color: '#95de64', seed: 2 },
      { name: 'RFID', color: '#ffd666', seed: 3 },
      { name: 'Autocharge', color: '#5cdbd3', seed: 4 },
    ];
    series = items.map((item, idx) => ({
      name: item.name,
      type: 'bar', stack: 'total',
      data: generateData(labels, totalScale * multiplier * (1 - idx * 0.12), item.seed),
      itemStyle: { color: item.color, borderRadius: idx === items.length - 1 ? [3, 3, 0, 0] : 0 },
      emphasis: { focus: 'series' },
      barMaxWidth: 28,
    }));
  } else if (breakdown === 'vehicle') {
    const items = [
      { name: 'Tata Nexon EV', color: '#69c0ff', seed: 7 },
      { name: 'MG ZS EV', color: '#b7eb8f', seed: 8 },
      { name: 'Tata Tiago EV', color: '#ffd666', seed: 9 },
      { name: 'Hyundai Ioniq 5', color: '#b37feb', seed: 10 },
    ];
    series = items.map((item, idx) => ({
      name: item.name,
      type: 'bar', stack: 'total',
      data: generateData(labels, totalScale * multiplier * (1 - idx * 0.2), item.seed),
      itemStyle: { color: item.color, borderRadius: idx === items.length - 1 ? [3, 3, 0, 0] : 0 },
      emphasis: { focus: 'series' },
      barMaxWidth: 28,
    }));
  } else if (breakdown === 'charger_make') {
    const items = [
      { name: 'ABB', color: '#91caff', seed: 11 },
      { name: 'Delta', color: '#95de64', seed: 12 },
      { name: 'Tritium', color: '#ffd666', seed: 13 },
      { name: 'Schneider', color: '#5cdbd3', seed: 14 },
    ];
    series = items.map((item, idx) => ({
      name: item.name,
      type: 'bar', stack: 'total',
      data: generateData(labels, totalScale * multiplier * (1 - idx * 0.18), item.seed),
      itemStyle: { color: item.color, borderRadius: idx === items.length - 1 ? [3, 3, 0, 0] : 0 },
      emphasis: { focus: 'series' },
      barMaxWidth: 28,
    }));
  } else {
    const connectorMeta: Record<string, { name: string; color: string; seed: number }> = {
      type2: { name: 'Type 2', color: '#91caff', seed: 10 },
      ccs2: { name: 'CCS2', color: '#95de64', seed: 20 },
      chademo: { name: 'CHAdeMO', color: '#ffd666', seed: 30 },
    };
    const items = activeConnectors.map(c => connectorMeta[c]).filter(Boolean);
    series = items.map((item, idx) => ({
      name: item.name,
      type: 'bar', stack: 'total',
      data: generateData(labels, totalScale * multiplier * (1 - idx * 0.15), item.seed),
      itemStyle: { color: item.color, borderRadius: idx === items.length - 1 ? [3, 3, 0, 0] : 0 },
      emphasis: { focus: 'series' },
      barMaxWidth: 28,
    }));
  }

  const isTimePerspective = perspective === 'time';
  let chartXData = labels;

  // Breakdown definition map for reuse
  const breakdownMeta: Record<Breakdown, { name: string; color: string; seed: number }[]> = {
    transaction: [
      { name: 'Mobile', color: '#91caff', seed: 1 },
      { name: 'CMS', color: '#95de64', seed: 2 },
      { name: 'RFID', color: '#ffd666', seed: 3 },
      { name: 'Autocharge', color: '#5cdbd3', seed: 4 },
    ],
    vehicle: [
      { name: 'Tata Nexon EV', color: '#69c0ff', seed: 7 },
      { name: 'MG ZS EV', color: '#b7eb8f', seed: 8 },
      { name: 'Tata Tiago EV', color: '#ffd666', seed: 9 },
      { name: 'Hyundai Ioniq 5', color: '#b37feb', seed: 10 },
    ],
    charger_make: [
      { name: 'ABB', color: '#91caff', seed: 11 },
      { name: 'Delta', color: '#95de64', seed: 12 },
      { name: 'Tritium', color: '#ffd666', seed: 13 },
      { name: 'Schneider', color: '#5cdbd3', seed: 14 },
    ],
    connector: [
      { name: 'Type 2', color: '#91caff', seed: 10 },
      { name: 'CCS2', color: '#95de64', seed: 20 },
      { name: 'CHAdeMo', color: '#ffd666', seed: 30 },
    ]
  };

  const currentBreakdownItems = breakdownMeta[breakdown].filter(item => 
    breakdown !== 'connector' || activeConnectors.includes(item.name.toLowerCase().replace(' ', '')) || activeConnectors.includes(item.name.toLowerCase())
  );

  if (perspective === 'cpid') {
    const cpids = activeCPIDs.slice(0, 12);
    chartXData = cpids.map(c => c.toUpperCase().replace('-', ' '));
    series = currentBreakdownItems.map((bItem, bIdx) => ({
      name: bItem.name,
      type: 'bar',
      stack: 'total',
      data: cpids.map((cpid, cIdx) => {
        const d = generateData(labels, multiplier * (CPID_WEIGHTS[cpid] || 0.5) * (1 - bIdx * 0.15), bItem.seed + cIdx);
        return d.reduce((a, b) => a + b, 0);
      }),
      itemStyle: { color: bItem.color, borderRadius: bIdx === currentBreakdownItems.length - 1 ? [4, 4, 0, 0] : 0 },
      barMaxWidth: 60,
    }));
  } else if (perspective === 'station') {
    const stationKeys = Object.keys(STATION_CPIDS).filter(k => 
      selectedLocations.length === 0 || 
      selectedLocations.includes(k) || 
      selectedLocations.includes('india') ||
      selectedLocations.includes('south') ||
      selectedLocations.includes('tamil-nadu')
    ).filter(k => k !== 'india' && k !== 'south' && k !== 'tamil-nadu' && k !== 'kerala' && k !== 'karnataka' && k !== 'north' && k !== 'east');

    chartXData = stationKeys.map(k => k.charAt(0).toUpperCase() + k.slice(1).replace('-', ' '));
    series = currentBreakdownItems.map((bItem, bIdx) => ({
      name: bItem.name,
      type: 'bar',
      stack: 'total',
      data: stationKeys.map((_, sIdx) => {
        const d = generateData(labels, multiplier * 1.5 * (1 - bIdx * 0.15), bItem.seed + sIdx);
        return d.reduce((a, b) => a + b, 0);
      }),
      itemStyle: { color: bItem.color, borderRadius: bIdx === currentBreakdownItems.length - 1 ? [4, 4, 0, 0] : 0 },
      barMaxWidth: 80,
    }));
  }

  const avgValue = Math.round(totalScale * multiplier * 45);
  const legendData = series.map(s => s.name);

  return {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { 
      show: true,
      data: legendData,
      top: 0, 
      right: 0, 
      icon: 'circle' 
    },
    grid: {
      left: '3%',
      right: '5%',
      bottom: '10%',
      top: '16%',
      containLabel: true
    },
    xAxis: {
      type: 'category', data: chartXData, axisTick: { show: false },
      axisLine: { lineStyle: { color: '#e5e5e5' } },
      axisLabel: { color: '#999', fontSize: 11, rotate: isTimePerspective ? 0 : 30 },
      name: isTimePerspective ? (timePeriod === 'daily' ? 'Days' : timePeriod === 'weekly' ? 'Weeks' : timePeriod === 'monthly' ? 'Months' : 'Years') : (perspective === 'cpid' ? 'CPIDs' : 'Stations'),
      nameLocation: 'middle', nameGap: isTimePerspective ? 28 : 55, nameTextStyle: { color: '#D83A41', fontWeight: 'bold', fontSize: 12 },
    },
    yAxis: {
      type: 'value', name: unit,
      nameTextStyle: { color: '#D83A41', fontSize: 12, fontWeight: 'bold', padding: [0, 40, 0, 0] },
      splitLine: { lineStyle: { color: '#f0f0f0', type: 'dashed' } },
      axisLabel: { color: '#999', fontSize: 11 },
    },
    series: [
      ...series,
      ...(isTimePerspective ? [{
        name: '__avg__', type: 'line', data: [],
        markLine: {
          silent: true, symbol: 'none',
          lineStyle: { type: 'dashed', color: '#ff4d4f', width: 1.5 },
          label: {
            formatter: `Lifetime Average: ${avgValue.toFixed(0)} ${unit}`,
            position: 'middle',
            color: '#D83A41',
            fontSize: 12,
            fontWeight: '600',
            backgroundColor: '#FFF1F0',
            borderColor: '#D83A41',
            borderWidth: 1,
            borderRadius: 16,
            padding: [4, 12],
             distance: [0, 0]
          },
          data: [{ yAxis: avgValue }],
        },
      }] : []),
    ],
    animationDuration: 600,
  };
}

// ───── Component ─────
const Dashboard: React.FC = () => {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('daily');
  const [perspective, setPerspective] = useState<Perspective>('time');
  const [breakdown, setBreakdown] = useState<Breakdown>('transaction');
  const [metric, setMetric] = useState<ChartMetric>('energy');
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [tempSelectedLocations, setTempSelectedLocations] = useState<string[]>([]);
  const [activeConnectors, setActiveConnectors] = useState<string[]>(['type2', 'ccs2', 'chademo']);
  const [dateRange, setDateRange] = useState<any>(null);

  const toggleConnector = (key: string) => {
    setActiveConnectors(prev =>
      prev.includes(key) ? (prev.length > 1 ? prev.filter(c => c !== key) : prev) : [...prev, key]
    );
  };

  const chartOption = useMemo(
    () => buildChartOption(metric, timePeriod, perspective, breakdown, selectedLocations, activeConnectors, dateRange),
    [metric, timePeriod, perspective, breakdown, selectedLocations, activeConnectors, dateRange]
  );

  return (
    <div className="dashboard-page-container">
      <div className="content-row-wrapper" style={{ padding: '8px 24px 24px' }}>
        <Card 
          bordered={false} 
          style={{ borderRadius: '12px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', overflow: 'hidden' }} 
          bodyStyle={{ padding: 0 }} 
          styles={{ body: { padding: 0 } }}
        >
          
          {/* Sticky Toolbar */}
          <div style={{ 
            padding: '4px 24px', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            borderBottom: '1px solid #f0f0f0', 
            flexWrap: 'wrap', 
            gap: '16px',
            position: 'sticky',
            top: 64,
            zIndex: 10,
            background: '#fff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
              <Text strong style={{ fontSize: '14px', color: '#666' }}>Search by date range</Text>
              <RangePicker 
                value={dateRange}
                onChange={(val) => setDateRange(val)}
                style={{ borderRadius: '6px', width: '420px', border: '1px solid #e8e8e8' }} 
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Select
                value={metric}
                onChange={(val) => setMetric(val as ChartMetric)}
                style={{ width: 110 }}
                size="small"
                className="metric-select"
                options={[
                  { value: 'energy', label: 'Energy' },
                  { value: 'sessions', label: 'Sessions' },
                  { value: 'revenue', label: 'Revenue' },
                ]}
              />
              <Space size="small">
                {(['daily', 'weekly', 'monthly', 'yearly'] as TimePeriod[]).map(tp => (
                  <Button key={tp} size="small" className={`rounded-btn${timePeriod === tp ? ' active-filter' : ''}`} onClick={() => setTimePeriod(tp)}>
                    {tp.charAt(0).toUpperCase() + tp.slice(1)}
                  </Button>
                ))}
              </Space>
            </div>
          </div>

          <Row style={{ minHeight: '600px' }}>
            {/* ── Filter Panel ── */}
            <Col xs={24} lg={5} style={{ borderRight: '1px solid #f0f0f0', padding: '24px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                  <SearchOutlined style={{ color: '#D83A41' }} />
                  <Text strong>Filter</Text>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <Text strong style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: '#1a1a1a' }}>Select Connector</Text>
                  <TreeSelect
                    treeData={locationTreeData}
                    value={tempSelectedLocations}
                    onChange={(vals) => setTempSelectedLocations(vals)}
                    treeCheckable
                    showCheckedStrategy={TreeSelect.SHOW_PARENT}
                    placeholder="Select by Location, Station, CPID"
                    style={{ width: '100%' }}
                    maxTagCount="responsive"
                    treeDefaultExpandAll
                    allowClear
                    dropdownRender={(menu) => (
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                          {menu}
                        </div>
                        <div style={{ padding: '8px', borderTop: '1px solid #f0f0f0', textAlign: 'right', background: '#fff' }}>
                          <Button 
                            type="primary" 
                            size="small" 
                            onClick={() => setSelectedLocations(tempSelectedLocations)}
                            style={{ borderRadius: '4px' }}
                          >
                            Apply
                          </Button>
                        </div>
                      </div>
                    )}
                  />
                </div>
              </div>

              {/* Connectors at bottom horizontally */}
              <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
                <Text type="secondary" style={{ display: 'block', marginBottom: '12px', fontSize: '12px', fontWeight: 600 }}>Connectors</Text>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                  {( [
                    { key: 'type2', icon: type2Svg, label: 'Type 2' },
                    { key: 'ccs2', icon: ccs2Svg, label: 'CCS2' },
                    { key: 'chademo', icon: chademoSvg, label: 'CHAdeMO' },
                  ] as const).map(c => (
                    <div 
                      key={c.key} 
                      className={`connector-item-square${activeConnectors.includes(c.key) ? ' active' : ''}`} 
                      onClick={() => toggleConnector(c.key)}
                      style={{ 
                        flex: 1, 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        padding: '8px 8px',
                        border: '1px solid #f0f0f0',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        background: activeConnectors.includes(c.key) ? '#fff1f0' : 'transparent',
                        borderColor: activeConnectors.includes(c.key) ? '#D83A41' : '#f0f0f0'
                      }}
                    >
                      <img src={c.icon} alt={c.label} style={{ width: '100%', height: 'auto', maxHeight: '40px', objectFit: 'contain' }} />
                    </div>
                  ))}
                </div>
              </div>
            </Col>

            {/* ── Chart Panel ── */}
            <Col xs={24} lg={19} style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <Title level={5} style={{ margin: 0, fontWeight: 700, color: '#D83A41' }}>Chart</Title>
                <Space size="middle">

                  <ReloadOutlined style={{ color: '#8c8c8c', cursor: 'pointer' }} />
                  <FullscreenOutlined style={{ color: '#8c8c8c', cursor: 'pointer' }} />
                  <MoreOutlined style={{ color: '#8c8c8c', cursor: 'pointer' }} />
                </Space>
              </div>

              <ReactECharts
                option={chartOption}
                style={{ height: '420px', width: '100%' }}
                notMerge={true}
              />

              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f5f5f5', paddingTop: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Text type="secondary" style={{ fontSize: '12px', fontWeight: 600 }}>Perspective</Text>
                  <Space size={8}>
                    { (['cpid', 'station', 'time'] as Perspective[]).map(p => (
                      <Button key={p} size="small" className={`rounded-btn${perspective === p ? ' active-filter' : ''}`} onClick={() => setPerspective(p)}>
                        {p === 'cpid' ? 'CPID' : p === 'station' ? 'Charging Station' : 'Time'}
                      </Button>
                    ))}
                  </Space>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Text type="secondary" style={{ fontSize: '12px', fontWeight: 600 }}>Breakdown by</Text>
                  <Space size={8}>
                    <Button size="small" className={`rounded-btn${breakdown === 'connector' ? ' active-filter' : ''}`} onClick={() => setBreakdown('connector')}>Connector Type</Button>
                    <Button size="small" className={`rounded-btn${breakdown === 'transaction' ? ' active-filter' : ''}`} onClick={() => setBreakdown('transaction')}>Transaction Mode</Button>
                    <Button size="small" className={`rounded-btn${breakdown === 'vehicle' ? ' active-filter' : ''}`} onClick={() => setBreakdown('vehicle')}>Vehicle</Button>
                    <Button size="small" className={`rounded-btn${breakdown === 'charger_make' ? ' active-filter' : ''}`} onClick={() => setBreakdown('charger_make')}>Charger Make</Button>
                  </Space>
                </div>
              </div>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
