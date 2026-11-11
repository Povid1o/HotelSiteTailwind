import React, { useCallback, useEffect, useState } from 'react';
import { AnalyticsPeriod, Dashboard, DashboardResponse, Insight, getAnalyticsDashboard } from '../../http/analyticsAPI';
import { Pills } from '../ui';
import { BarCell, HourChart, TrendChart, fmt } from './charts';
import './analytics.css';

const PERIODS: { key: string; label: string }[] = [
  { key: '7', label: '7 дней' },
  { key: '30', label: '30 дней' },
  { key: '90', label: '90 дней' },
];

const duration = (seconds: number) => {
  const s = Math.round(seconds);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};
const pct = (value: number | null) => (value === null ? '—' : `${value.toLocaleString('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`);
const dateRu = (iso: string) => new Date(`${iso}T12:00:00`).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });

/** Изменение к прошлому периоду. lowerIsBetter — для отказов: их рост это плохо. */
const Delta: React.FC<{ now: number; before: number; lowerIsBetter?: boolean; points?: boolean }> = ({ now, before, lowerIsBetter, points }) => {
  if (!before && !now) return <span className='an-delta'>без изменений</span>;
  const diff = points ? now - before : before ? ((now - before) / before) * 100 : 100;
  if (Math.abs(diff) < 0.5) return <span className='an-delta'>без изменений</span>;
  const good = lowerIsBetter ? diff < 0 : diff > 0;
  const value = `${Math.abs(diff).toLocaleString('ru-RU', { maximumFractionDigits: 1 })}${points ? ' п.п.' : '%'}`;
  return (
    <span className={`an-delta ${good ? 'is-good' : 'is-bad'}`}>
      <span aria-hidden='true'>{diff > 0 ? '▲' : '▼'}</span> {diff > 0 ? '+' : '−'}{value}
    </span>
  );
};

const Kpi: React.FC<{ label: string; value: string; children?: React.ReactNode; hint?: string }> = ({ label, value, children, hint }) => (
  <div className='an-kpi' title={hint}>
    <div className='an-kpi-label'>{label}</div>
    <div className='an-kpi-value'>{value}</div>
    {children}
  </div>
);

const TONE_LABEL: Record<Insight['tone'], string> = { positive: 'Хорошо', warning: 'Обратить внимание', info: 'Наблюдение' };

const Card: React.FC<{ title: string; hint?: string; children: React.ReactNode; className?: string }> = ({ title, hint, children, className }) => (
  <section className={`adm-card an-card ${className || ''}`}>
    <h2 className='adm-h3'>{title}</h2>
    {hint && <p className='adm-hint an-card-hint'>{hint}</p>}
    {children}
  </section>
);

const SetupGuide = () => (
  <div className='adm-card an-setup'>
    <h2 className='adm-h3'>Подключите Яндекс Метрику</h2>
    <div className='adm-empty'>
      <p>Раздел показывает отчёты счётчика сайта. Чтобы он заработал, на сервере нужны две настройки в файле <code>.env</code>:</p>
      <ol>
        <li><code>YM_ID</code> — номер счётчика из metrika.yandex.ru.</li>
        <li>
          <code>YM_TOKEN</code> — OAuth-токен для чтения статистики. Создайте приложение на oauth.yandex.ru с доступом
          «Получение статистики, чтение параметров своих и доверенных счётчиков» и получите для него токен.
        </li>
      </ol>
      <p>После этого перезапустите сайт. Подробная инструкция — в docs/analytics.md в репозитории.</p>
    </div>
  </div>
);

const Report: React.FC<{ d: Dashboard }> = ({ d }) => {
  const booking = d.goals.find((g) => g.identifier === 'booking_open');
  const hasBooking = Boolean(booking);
  const maxSource = Math.max(...d.sources.map((s) => s.visits), 0);
  const maxEntry = Math.max(...d.entryPages.map((s) => s.visits), 0);
  const maxPage = Math.max(...d.pages.map((s) => s.pageviews), 0);
  const maxCity = Math.max(...d.cities.map((s) => s.visits), 0);
  const maxDevice = Math.max(...d.devices.map((s) => s.visits), 0);

  return (
    <>
      <div className='an-kpis'>
        <Kpi label='Визиты' value={fmt(d.totals.visits)}><Delta now={d.totals.visits} before={d.previous.visits} /></Kpi>
        <Kpi label='Посетители' value={fmt(d.totals.users)}><Delta now={d.totals.users} before={d.previous.users} /></Kpi>
        <Kpi label='Просмотры страниц' value={fmt(d.totals.pageviews)}><Delta now={d.totals.pageviews} before={d.previous.pageviews} /></Kpi>
        <Kpi label='Отказы' value={pct(d.totals.bounceRate)} hint='Доля визитов, в которых посетитель провёл на сайте меньше 15 секунд и посмотрел одну страницу'>
          <Delta now={d.totals.bounceRate} before={d.previous.bounceRate} lowerIsBetter points />
        </Kpi>
        <Kpi label='Время на сайте' value={duration(d.totals.avgDuration)}><Delta now={d.totals.avgDuration} before={d.previous.avgDuration} /></Kpi>
        <Kpi label='Глубина просмотра' value={d.totals.pageDepth.toLocaleString('ru-RU')} hint='Сколько страниц в среднем смотрят за визит'>
          <Delta now={d.totals.pageDepth} before={d.previous.pageDepth} />
        </Kpi>
      </div>

      {d.goals.length > 0 && (
        <section className='an-block'>
          <h2 className='adm-h3'>Цели — что делают посетители</h2>
          <p className='adm-hint an-card-hint'>Конверсия — доля визитов, в которых цель была достигнута.</p>
          <div className='an-kpis an-goals'>
            {d.goals.map((g) => (
              <Kpi key={g.id} label={g.name} value={fmt(g.reaches)}>
                <span className='an-kpi-sub'>конверсия {pct(g.conversionRate)}</span>
                <Delta now={g.reaches} before={g.previousReaches} />
              </Kpi>
            ))}
            {d.ecommerce && (
              <Kpi label='Бронирования (TravelLine)' value={fmt(d.ecommerce.purchases)}>
                <span className='an-kpi-sub'>на {fmt(d.ecommerce.revenue)} ₽</span>
              </Kpi>
            )}
          </div>
        </section>
      )}

      {d.insights.length > 0 && (
        <section className='an-block'>
          <h2 className='adm-h3'>Наблюдения и гипотезы</h2>
          <p className='adm-hint an-card-hint'>Подсказки по правилам: на что обратить внимание и что можно проверить. Решение — за вами.</p>
          <div className='an-insights'>
            {d.insights.map((item) => (
              <article key={item.title} className={`an-insight is-${item.tone}`}>
                <div className='an-insight-tone'>{TONE_LABEL[item.tone]}</div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                {item.hypothesis && <p className='an-hypothesis'><strong>Гипотеза:</strong> {item.hypothesis}</p>}
              </article>
            ))}
          </div>
        </section>
      )}

      <Card title='Визиты по дням' className='an-wide'>
        <TrendChart data={d.daily} />
      </Card>

      <div className='an-grid'>
        <Card title='Откуда приходят' hint={hasBooking ? '«Бронь» — доля визитов из источника, в которых открыли бронирование.' : undefined} className='an-wide'>
          <table className='an-table'>
            <thead><tr><th>Источник</th><th className='an-col-bar'>Визиты</th><th>Отказы</th><th>Время</th>{hasBooking && <th>Бронь</th>}</tr></thead>
            <tbody>
              {d.sources.map((s) => (
                <tr key={s.name}>
                  <td>{s.name}</td>
                  <td><BarCell value={s.visits} max={maxSource} /></td>
                  <td>{pct(s.bounceRate)}</td>
                  <td>{duration(s.avgDuration)}</td>
                  {hasBooking && <td>{pct(s.bookingRate)}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card title='С каких страниц начинают' hint='Первая страница визита. Высокие отказы здесь — повод проверить первый экран.' className='an-wide'>
          <table className='an-table'>
            <thead><tr><th>Страница</th><th className='an-col-bar'>Визиты</th><th>Отказы</th><th>Время</th>{hasBooking && <th>Бронь</th>}</tr></thead>
            <tbody>
              {d.entryPages.map((p) => (
                <tr key={p.path}>
                  <td><a href={p.path} target='_blank' rel='noopener noreferrer' className='an-path'>{p.path}</a></td>
                  <td><BarCell value={p.visits} max={maxEntry} /></td>
                  <td>{pct(p.bounceRate)}</td>
                  <td>{duration(p.avgDuration)}</td>
                  {hasBooking && <td>{pct(p.bookingRate)}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card title='Популярные страницы'>
          <table className='an-table'>
            <thead><tr><th>Страница</th><th className='an-col-bar'>Просмотры</th></tr></thead>
            <tbody>
              {d.pages.map((p) => (
                <tr key={p.path}>
                  <td><a href={p.path} target='_blank' rel='noopener noreferrer' className='an-path'>{p.path}</a></td>
                  <td><BarCell value={p.pageviews} max={maxPage} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card title='Устройства'>
          <table className='an-table'>
            <thead><tr><th>Тип</th><th className='an-col-bar'>Визиты</th><th>Отказы</th>{hasBooking && <th>Бронь</th>}</tr></thead>
            <tbody>
              {d.devices.map((x) => (
                <tr key={x.name}>
                  <td>{x.name}</td>
                  <td><BarCell value={x.visits} max={maxDevice} /></td>
                  <td>{pct(x.bounceRate)}</td>
                  {hasBooking && <td>{pct(x.bookingRate)}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card title='Города'>
          <table className='an-table'>
            <thead><tr><th>Город</th><th className='an-col-bar'>Визиты</th></tr></thead>
            <tbody>
              {d.cities.map((c) => (
                <tr key={c.name}><td>{c.name}</td><td><BarCell value={c.visits} max={maxCity} /></td></tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card title='Время суток' hint='Когда заходят на сайт (по Москве). Подписан самый активный час.'>
          <HourChart data={d.hours} />
        </Card>
      </div>
    </>
  );
};

const AnalyticsAdmin: React.FC = () => {
  const [period, setPeriod] = useState<AnalyticsPeriod>(30);
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (days: AnalyticsPeriod, refresh = false) => {
    setLoading(true);
    setError('');
    try {
      setData(await getAnalyticsDashboard(days, refresh));
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Не удалось загрузить данные Метрики. Проверьте соединение и попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(period); }, [load, period]);

  const report = data && data.configured ? data : null;

  return (
    <div className='an-page'>
      <div className='adm-phead'>
        <div>
          <h1 className='adm-h1'>Аналитика</h1>
          <p className='adm-muted'>
            {report
              ? <>Яндекс Метрика, {dateRu(report.period.from)} — {dateRu(report.period.to)}. Сравнение с {dateRu(report.period.previousFrom)} — {dateRu(report.period.previousTo)}.</>
              : 'Поведение посетителей сайта по данным Яндекс Метрики.'}
          </p>
        </div>
        {report && (
          <div className='adm-actions'>
            <button type='button' className='adm-btn adm-btn-ghost adm-btn-sm' disabled={loading} onClick={() => load(period, true)}>
              {loading ? 'Загружаем…' : 'Обновить'}
            </button>
            <a className='adm-btn adm-btn-ghost adm-btn-sm' href={`https://metrika.yandex.ru/dashboard?id=${report.counterId}`} target='_blank' rel='noopener noreferrer'>
              Открыть Метрику ↗
            </a>
          </div>
        )}
      </div>

      {data?.configured !== false && (
        <Pills label='Период' items={PERIODS} value={String(period)} onChange={(key) => setPeriod(Number(key) as AnalyticsPeriod)}>
          {report && <span className='adm-hint an-updated'>Обновлено в {new Date(report.generatedAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</span>}
        </Pills>
      )}

      {error && (
        <div className='adm-notice is-error' role='alert'>
          {error} <button type='button' className='adm-link' onClick={() => load(period)}>Повторить</button>
        </div>
      )}
      {!error && !data && loading && <p className='adm-muted an-loading'>Загружаем данные Метрики…</p>}
      {data && !data.configured && <SetupGuide />}
      {report && <div className={loading ? 'an-report is-loading' : 'an-report'}><Report d={report} /></div>}
    </div>
  );
};

export default AnalyticsAdmin;
