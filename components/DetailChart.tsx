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

  const latencyData = state.latency[monitor.id].map((point) => ({
    x: point.time * 1000,
    y: point.ping,
  }))

  let data = {
    datasets: [
      {
        data: latencyData,
        backgroundColor: latencyData.map((point) => (point.y > 1000 ? '#ef4444' : '#22c55e')),
        borderRadius: 3,
        barThickness: 8,
      },
    ],
  }

  let options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        callbacks: {
          title: (items: any) => {
            if (items[0]) {
              const date = new Date(items[0].parsed.x)
              return date.toLocaleString()
            }
            return ''
          },
          label: (item: any) => {
            return `${item.parsed.y} ms`
          },
        },
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
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
          callback: (value: any) => `${value}ms`,
        },
        border: {
          display: false,
        },
        beginAtZero: true,
      },
    },
    onClick: (_event: any, elements: any) => {
      if (elements.length > 0) {
      }
    },
  }

  return (
    <div
      style={{
        height: '150px',
        background: 'linear-gradient(180deg, #4a90d9 0%, #2c5f9e 100%)',
        borderRadius: '8px',
        padding: '12px',
      }}
    >
      <Bar options={options} data={data} />
    </div>
  )
}
