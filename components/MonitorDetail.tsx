import { Text, Tooltip } from '@mantine/core'
import { MonitorState, MonitorTarget } from '@/types/config'
import { IconAlertCircle, IconAlertTriangle, IconCircleCheck } from '@tabler/icons-react'
import DetailChart from './DetailChart'
import DetailBar from './DetailBar'
import { getColor } from '@/util/color'
import { maintenances } from '@/uptime.config'
import { useTranslation } from 'react-i18next'

// 状态柱状条组件
function StatusBars({ statusClass }: { statusClass: string }) {
  // 生成24个柱状条
  const bars = Array.from({ length: 24 }, (_, i) => (
    <div key={i} className={`status-bar ${statusClass}`} />
  ))

  return <div className="status-bars-container">{bars}</div>
}

export default function MonitorDetail({
  monitor,
  state,
}: {
  monitor: MonitorTarget
  state: MonitorState
}) {
  const { t } = useTranslation('common')

  if (!state.latency[monitor.id])
    return (
      <div className="monitor-item">
        <div className="monitor-info">
          <div className="monitor-header">
            <StatusBars statusClass="offline" />
            <span className="monitor-name">{monitor.name}</span>
          </div>
          <Text mt="sm" fw={700}>
            {t('No data available')}
          </Text>
        </div>
      </div>
    )

  let statusClass = 'online'
  let statusDotClass = 'status-dot online'
  let IconComponent = IconCircleCheck

  const isDown = state.incident[monitor.id].slice(-1)[0].end === undefined

  // Hide real status icon if monitor is in maintenance
  const now = new Date()
  const hasMaintenance = maintenances
    .filter((m) => now >= new Date(m.start) && (!m.end || now <= new Date(m.end)))
    .find((maintenance) => maintenance.monitors?.includes(monitor.id))

  if (hasMaintenance) {
    statusClass = 'maintenance'
    statusDotClass = 'status-dot maintenance'
    IconComponent = IconAlertTriangle
  } else if (isDown) {
    statusClass = 'offline'
    statusDotClass = 'status-dot offline'
    IconComponent = IconAlertCircle
  } else {
    statusClass = 'online'
    statusDotClass = 'status-dot online'
    IconComponent = IconCircleCheck
  }

  let totalTime = Date.now() / 1000 - state.incident[monitor.id][0].start[0]
  let downTime = 0
  for (let incident of state.incident[monitor.id]) {
    downTime += (incident.end ?? Date.now() / 1000) - incident.start[0]
  }

  const uptimePercent = (((totalTime - downTime) / totalTime) * 100).toPrecision(4)
  const uptimeColor = getColor(uptimePercent, true)

  // Conditionally render monitor name with or without hyperlink based on monitor.url presence
  const monitorNameElement = (
    <span className="monitor-name">
      {monitor.statusPageLink ? (
        <a href={monitor.statusPageLink} target="_blank" rel="noopener noreferrer">
          {monitor.name}
        </a>
      ) : (
        monitor.name
      )}
    </span>
  )

  return (
    <div className="monitor-item">
      <div className="monitor-info">
        <div className="monitor-header">
          <StatusBars statusClass={statusClass} />
          {monitor.tooltip ? (
            <Tooltip label={monitor.tooltip}>{monitorNameElement}</Tooltip>
          ) : (
            monitorNameElement
          )}
        </div>
        <div className="monitor-tags">
          <span className={`tag tag-${uptimeColor === '#059669' ? 'green' : uptimeColor === '#ef4444' ? 'red' : 'yellow'}`}>
            {t('uptime', { percent: uptimePercent })}
          </span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        <DetailBar monitor={monitor} state={state} />
      </div>
      {!monitor.hideLatencyChart && (
        <div className="latency-chart">
          <DetailChart monitor={monitor} state={state} />
        </div>
      )}
    </div>
  )
}
