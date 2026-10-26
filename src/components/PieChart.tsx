import React, { useState } from 'react';
import { PieChartSlice } from '../types/project';

interface PieChartProps {
  data: PieChartSlice[];
  title: string;
  subtitle?: string;
  isCurrency?: boolean;
  donut?: boolean;
  size?: number;
}

export const PieChart: React.FC<PieChartProps> = ({
  data,
  title,
  subtitle,
  isCurrency = true,
  donut = true,
  size = 280,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const totalValue = data.reduce((acc, curr) => acc + curr.value, 0);

  // SVG coordinate helpers
  const center = size / 2;
  const radius = (size / 2) * 0.82;
  const innerRadius = donut ? radius * 0.58 : 0;

  // Format currency in Thai Baht
  const formatValue = (val: number) => {
    if (isCurrency) {
      if (val >= 1000000) {
        return `${(val / 1000000).toLocaleString('th-TH', { maximumFractionDigits: 2 })} ล้านบาท`;
      }
      return `${val.toLocaleString('th-TH')} บาท`;
    }
    return `${val.toLocaleString('th-TH')} รายการ`;
  };

  // Build SVG arc paths
  let accumulatedAngle = 0;

  const slices = data.map((slice, index) => {
    const fraction = totalValue > 0 ? slice.value / totalValue : 0;
    const startAngle = accumulatedAngle;
    const angleDelta = fraction * 360;
    const endAngle = startAngle + angleDelta;
    accumulatedAngle = endAngle;

    // Convert polar coordinates to cartesian
    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = ((endAngle - 90) * Math.PI) / 180;

    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);

    const x3 = center + innerRadius * Math.cos(endRad);
    const y3 = center + innerRadius * Math.sin(endRad);
    const x4 = center + innerRadius * Math.cos(startRad);
    const y4 = center + innerRadius * Math.sin(startRad);

    const largeArcFlag = angleDelta > 180 ? 1 : 0;

    // SVG path string
    let pathData = '';
    if (donut) {
      pathData = `
        M ${x1} ${y1}
        A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
        L ${x3} ${y3}
        A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}
        Z
      `;
    } else {
      pathData = `
        M ${center} ${center}
        L ${x1} ${y1}
        A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
        Z
      `;
    }

    const isHovered = hoveredIndex === index;
    const percent = totalValue > 0 ? (slice.value / totalValue) * 100 : 0;

    return {
      ...slice,
      pathData,
      isHovered,
      percent,
      index,
    };
  });

  const activeSlice = hoveredIndex !== null ? data[hoveredIndex] : null;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
      <div>
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-slate-900 text-lg">{title}</h3>
          <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
            {data.length} กลุ่ม
          </span>
        </div>
        {subtitle && <p className="text-xs text-slate-500 mb-4">{subtitle}</p>}
      </div>

      {totalValue === 0 ? (
        <div className="py-12 text-center text-slate-400 text-sm">
          ไม่มีข้อมูลสำหรับแสดงผล
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center py-2">
          {/* SVG Pie Chart Canvas */}
          <div className="md:col-span-6 flex justify-center relative">
            <svg
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
              className="transform hover:scale-[1.02] transition-transform duration-200"
            >
              <defs>
                <filter id="sliceShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.15" />
                </filter>
              </defs>
              <g>
                {slices.map((slice) => (
                  <path
                    key={slice.index}
                    d={slice.pathData}
                    fill={slice.color}
                    className="cursor-pointer transition-all duration-200 ease-out"
                    style={{
                      transformOrigin: `${center}px ${center}px`,
                      transform: slice.isHovered ? 'scale(1.05)' : 'scale(1)',
                      filter: slice.isHovered ? 'url(#sliceShadow)' : 'none',
                      opacity: hoveredIndex === null || slice.isHovered ? 1 : 0.65,
                    }}
                    onMouseEnter={() => setHoveredIndex(slice.index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />
                ))}
              </g>

              {/* Donut Center Display */}
              {donut && (
                <g className="pointer-events-none">
                  <circle cx={center} cy={center} r={innerRadius - 4} fill="#ffffff" />
                  <text
                    x={center}
                    y={center - 8}
                    textAnchor="middle"
                    className="text-[11px] font-medium fill-slate-400"
                  >
                    {activeSlice ? 'สัดส่วนรายการ' : 'ยอดรวมทั้งสิ้น'}
                  </text>
                  <text
                    x={center}
                    y={center + 14}
                    textAnchor="middle"
                    className="text-[13px] font-bold fill-slate-800"
                  >
                    {activeSlice
                      ? `${activeSlice.percent.toFixed(1)}%`
                      : isCurrency
                      ? `${(totalValue / 1000000).toFixed(1)}M`
                      : `${totalValue} โครงการ`}
                  </text>
                </g>
              )}
            </svg>
          </div>

          {/* Interactive Legend and Data Table */}
          <div className="md:col-span-6 space-y-2">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              รายการและสัดส่วน
            </div>
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {slices.map((slice) => {
                const isHovered = hoveredIndex === slice.index;
                return (
                  <div
                    key={slice.index}
                    className={`flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer transition-all ${
                      isHovered
                        ? 'bg-slate-100 font-semibold ring-1 ring-slate-300'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                    onMouseEnter={() => setHoveredIndex(slice.index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <div className="flex items-center space-x-2 truncate pr-2">
                      <span
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: slice.color }}
                      />
                      <span className="truncate text-slate-800 font-medium" title={slice.label}>
                        {slice.label}
                      </span>
                    </div>
                    <div className="text-right flex-shrink-0 flex items-center space-x-2">
                      <span className="text-slate-500 font-mono">
                        {formatValue(slice.value)}
                      </span>
                      <span
                        className="px-1.5 py-0.5 rounded text-[10px] font-bold font-mono"
                        style={{
                          backgroundColor: `${slice.color}20`,
                          color: slice.color,
                        }}
                      >
                        {slice.percent.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
