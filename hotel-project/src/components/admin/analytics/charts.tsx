import React, { useEffect, useRef, useState } from 'react';

/** Графики раздела «Аналитика»: без библиотек, обычный SVG с подсказкой при наведении. */

const nf = new Intl.NumberFormat('ru-RU');
export const fmt = (n: number) => nf.format(Math.round(n));

const useWidth = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.floor(entry.contentRect.width)));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return [ref, width] as const;
};

/** «Круглый» верх шкалы и 4 деления: 0, 50, 100, 150, 200. */
const niceScale = (max: number) => {
  if (max <= 0) return { top: 4, ticks: [0, 1, 2, 3, 4] };
  const raw = max / 4;
  const pow = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * pow).find((s) => s >= raw) as number;
  return { top: step * 4, ticks: [0, 1, 2, 3, 4].map((i) => i * step) };
};

/** Столбик со скруглённым верхом, основание прямое — привязано к оси. */
const columnPath = (x: number, y: number, w: number, h: number) => {
  const r = Math.min(4, w / 2, h);
  return `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z`;
};

interface TooltipProps { x: number; y: number; width: number; children: React.ReactNode }
const Tooltip: React.FC<TooltipProps> = ({ x, y, width, children }) => (
  <div className='an-tooltip' style={{ left: Math.min(Math.max(x, 70), width - 70), top: y }}>{children}</div>
);

// ---------- визиты по дням ----------

const shortDate = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }).replace('.', '');

export const TrendChart: React.FC<{ data: { date: string; visits: number; users: number }[] }> = ({ data }) => {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const height = 240;
  const pad = { top: 12, right: 12, bottom: 28, left: 44 };
  const plotW = Math.max(width - pad.left - pad.right, 10);
  const plotH = height - pad.top - pad.bottom;
  const { top, ticks } = niceScale(Math.max(...data.map((d) => d.visits), 0));
  const x = (i: number) => pad.left + (data.length > 1 ? (i / (data.length - 1)) * plotW : plotW / 2);
  const y = (v: number) => pad.top + plotH - (v / top) * plotH;

  const line = data.map((d, i) => `${i ? 'L' : 'M'}${x(i)},${y(d.visits)}`).join('');
  const area = data.length ? `${line}L${x(data.length - 1)},${y(0)}L${x(0)},${y(0)}Z` : '';
  const labelEvery = Math.max(1, Math.ceil(data.length / Math.max(2, Math.floor(plotW / 90))));

  const onMove = (e: React.MouseEvent<SVGRectElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - box.left) / box.width;
    setHover(Math.min(data.length - 1, Math.max(0, Math.round(ratio * (data.length - 1)))));
  };
  const point = hover !== null ? data[hover] : null;

  return (
    <div ref={ref} className='an-chart'>
      {width > 0 && (
        <svg width={width} height={height} role='img' aria-label='Визиты по дням'>
          {ticks.map((t) => (
            <g key={t}>
              <line x1={pad.left} x2={width - pad.right} y1={y(t)} y2={y(t)} className='an-gridline' />
              <text x={pad.left - 8} y={y(t)} className='an-axis' textAnchor='end' dominantBaseline='middle'>{fmt(t)}</text>
            </g>
          ))}
          {data.map((d, i) => (i % labelEvery === 0 ? (
            <text key={d.date} x={x(i)} y={height - 8} className='an-axis' textAnchor='middle'>{shortDate(d.date)}</text>
          ) : null))}
          <path d={area} className='an-area' />
          <path d={line} className='an-line' />
          {point && hover !== null && (
            <g>
              <line x1={x(hover)} x2={x(hover)} y1={pad.top} y2={y(0)} className='an-crosshair' />
              <circle cx={x(hover)} cy={y(point.visits)} r={5} className='an-dot' />
            </g>
          )}
          <rect
            x={pad.left} y={pad.top} width={plotW} height={plotH} fill='transparent'
            onMouseMove={onMove} onMouseLeave={() => setHover(null)}
          />
        </svg>
      )}
      {point && hover !== null && (
        <Tooltip x={x(hover)} y={y(point.visits) - 12} width={width}>
          <strong>{new Date(`${point.date}T12:00:00`).toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'long' })}</strong>
          <span>Визиты: {fmt(point.visits)}</span>
          <span>Посетители: {fmt(point.users)}</span>
        </Tooltip>
      )}
    </div>
  );
};

// ---------- визиты по часам ----------

export const HourChart: React.FC<{ data: { hour: number; visits: number }[] }> = ({ data }) => {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const height = 200;
  const pad = { top: 22, right: 4, bottom: 26, left: 4 };
  const plotH = height - pad.top - pad.bottom;
  const slot = Math.max((width - pad.left - pad.right) / 24, 1);
  const gap = 2;
  const max = Math.max(...data.map((d) => d.visits), 1);
  const peak = data.reduce((best, d) => (d.visits > best.visits ? d : best), data[0]);
  const colY = (v: number) => pad.top + plotH - (v / max) * plotH;
  const point = hover !== null ? data[hover] : null;

  return (
    <div ref={ref} className='an-chart'>
      {width > 0 && (
        <svg width={width} height={height} role='img' aria-label='Визиты по часам суток'>
          <line x1={pad.left} x2={width - pad.right} y1={colY(0)} y2={colY(0)} className='an-baseline' />
          {data.map((d) => {
            const x = pad.left + d.hour * slot + gap / 2;
            const h = Math.max(colY(0) - colY(d.visits), d.visits > 0 ? 2 : 0);
            return (
              <g key={d.hour}>
                <path d={columnPath(x, colY(0) - h, slot - gap, h)} className={hover === d.hour ? 'an-col is-hover' : 'an-col'} />
                {d.hour % 3 === 0 && (
                  <text x={x + (slot - gap) / 2} y={height - 8} className='an-axis' textAnchor='middle'>{String(d.hour).padStart(2, '0')}</text>
                )}
                {peak && d.hour === peak.hour && d.visits > 0 && (
                  <text x={x + (slot - gap) / 2} y={colY(d.visits) - 6} className='an-axis an-strong' textAnchor='middle'>{fmt(d.visits)}</text>
                )}
                <rect
                  x={pad.left + d.hour * slot} y={pad.top} width={slot} height={plotH} fill='transparent'
                  onMouseEnter={() => setHover(d.hour)} onMouseLeave={() => setHover(null)}
                />
              </g>
            );
          })}
        </svg>
      )}
      {point && (
        <Tooltip x={pad.left + point.hour * slot + slot / 2} y={colY(point.visits) - 10} width={width}>
          <strong>{String(point.hour).padStart(2, '0')}:00–{String((point.hour + 1) % 24).padStart(2, '0')}:00</strong>
          <span>Визиты: {fmt(point.visits)}</span>
        </Tooltip>
      )}
    </div>
  );
};

// ---------- полоска величины в таблице ----------

export const BarCell: React.FC<{ value: number; max: number }> = ({ value, max }) => (
  <div className='an-barcell'>
    <span className='an-bar' style={{ width: `${max > 0 ? Math.max((value / max) * 100, 1) : 0}%` }} />
    <span className='an-barvalue'>{fmt(value)}</span>
  </div>
);
