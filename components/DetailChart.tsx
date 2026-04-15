import { MonitorState, MonitorTarget } from '@/types/config'
import { useTranslation } from 'react-i18next'

export default function DetailChart({
  monitor,
  state,
}: {
  monitor: MonitorTarget
  state: MonitorState
}) {
  const { t } = useTranslation('common')

  // 生成24个柱状条（最近24小时，每小时一个）
  const getStatusBars = () => {
    const bars = []
    const now = Date.now() / 1000

    for (let i = 0; i < 24; i++) {
      const slotStart = now - (24 - i) * 3600
      const slotEnd = slotStart + 3600

      // 检查该时间段内是否有宕机事件
      const hasIncident = state.incident[monitor.id].some((incident) => {
        const incidentStart = incident.start[0]
        const incidentEnd = incident.end ?? now
        return incidentStart < slotEnd && incidentEnd > slotStart
      })

      bars.push(
        <div
          key={i}
          className={`status-indicator-bar ${hasIncident ? 'offline' : 'online'}`}
        />
      )
    }
    return bars
  }

  return (
    <div className="latency-chart-container">
      <div className="status-bars-row">{getStatusBars()}</div>
      <div className="time-labels-row">
        <span className="time-label">{t('1h ago')}</span>
        <span className="time-label">{t('now')}</span>
      </div>
    </div>
  )
}
