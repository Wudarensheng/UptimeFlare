import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  TimeScale,
} from 'chart.js'
import 'chartjs-adapter-moment'
import { MonitorState, MonitorTarget } from '@/types/config'
import { useTranslation } from 'react-i18next'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend, TimeScale)

export default function DetailChart({
  monitor,
  state,
}: {
  monitor: MonitorTarget
  state: MonitorState
}) {
  const { t } = useTranslation('common')

  const currentTime = Math.round(Date.now() / 1000)
  const incidents = state.incident[monitor.id]
  const isCurrentlyDown = incidents.slice(-1)[0].end === undefined

  const last90Minutes = []
  for (let i = 89; i >= 0; i--) {
    const timePoint = currentTime - i * 60
    let isDown = false

    for (const incident of incidents) {
      const incidentStart = incident.start[0]
      const incidentEnd = incident.end ?? currentTime
      if (timePoint >= incidentStart && timePoint < incidentEnd) {
        isDown = true
        break
      }
    }

    last90Minutes.push({
      x: timePoint * 1000,
      y: isDown ? 0 : 1,
      isDown,
    })
  }

  let data = {
    datasets: [
      {
        data: last90Minutes,
        backgroundColor: last90Minutes.map((point) => (point.isDown ? '#ef4444' : '#22c55e')),
        borderRadius: 2,
        barThickness: 6,
      },
    ],
  }

  let options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        enabled: false,
      },
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: t('Response times'),
        color: '#ffffff',
        align: 'start' as const,
        font: {
          size: 12,
        },
      },
    },
    scales: {
      x: {
        type: 'time' as const,
        grid: {
          display: false,
        },
        ticks: {
          source: 'auto' as const,
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 6,
          color: 'rgba(255, 255, 255, 0.6)',
        },
        border: {
          display: false,
        },
      },
      y: {
        display: false,
        grid: {
          display: false,
        },
        ticks: {
          display: false,
        },
        border: {
          display: false,
        },
        min: 0,
        max: 1,
      },
    },
  }

  return (
    <div
      style={{
        height: '80px',
        background: 'linear-gradient(180deg, #4a90d9 0%, #2c5f9e 100%)',
        borderRadius: '8px',
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Bar options={options} data={data} />
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '4px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            color: '#ffffff',
            fontSize: '11px',
          }}
        >
          <div
            style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#22c55e' }}
          />
          {t('Operational')}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            color: '#ffffff',
            fontSize: '11px',
          }}
        >
          <div
            style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#ef4444' }}
          />
          {t('Downtime')}
        </div>
      </div>
    </div>
  )
}
