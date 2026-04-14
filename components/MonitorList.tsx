import { MonitorState, MonitorTarget } from '@/types/config'
import { Card, Center, Text, Accordion } from '@mantine/core'
import MonitorDetail from './MonitorDetail'
import { pageConfig } from '@/uptime.config'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IconChevronDown } from '@tabler/icons-react'

function countDownCount(state: MonitorState, ids: string[]) {
  let downCount = 0
  for (let id of ids) {
    if (state.incident[id] === undefined || state.incident[id].length === 0) {
      continue
    }

    if (state.incident[id].slice(-1)[0].end === undefined) {
      downCount++
    }
  }
  return downCount
}

function getStatusTextColor(state: MonitorState, ids: string[]) {
  let downCount = countDownCount(state, ids)
  if (downCount === 0) {
    return '#059669'
  } else if (downCount === ids.length) {
    return '#ef4444'
  } else {
    return '#f59e0b'
  }
}

export default function MonitorList({
  monitors,
  state,
}: {
  monitors: MonitorTarget[]
  state: MonitorState
}) {
  const { t } = useTranslation('common')
  const group = pageConfig.group
  const groupedMonitor = group && Object.keys(group).length > 0

  // Load expanded groups from localStorage
  const savedExpandedGroups = localStorage.getItem('expandedGroups')
  const expandedInitial = savedExpandedGroups
    ? JSON.parse(savedExpandedGroups)
    : Object.keys(group || {})
  const [expandedGroups, setExpandedGroups] = useState<string[]>(expandedInitial)
  useEffect(() => {
    localStorage.setItem('expandedGroups', JSON.stringify(expandedGroups))
  }, [expandedGroups])

  const renderMonitors = (monitorIds: string[]) => {
    return monitors
      .filter((monitor) => monitorIds.includes(monitor.id))
      .sort((a, b) => monitorIds.indexOf(a.id) - monitorIds.indexOf(b.id))
      .map((monitor) => (
        <MonitorDetail key={monitor.id} monitor={monitor} state={state} />
      ))
  }

  let content

  if (groupedMonitor) {
    // Grouped monitors
    content = (
      <div className="accordion-group">
        <Accordion
          multiple
          defaultValue={Object.keys(group)}
          variant="contained"
          value={expandedGroups}
          onChange={(values) => setExpandedGroups(values)}
          chevron={<IconChevronDown size={20} />}
        >
          {Object.keys(group).map((groupName) => (
            <Accordion.Item key={groupName} value={groupName} className="accordion-item">
              <Accordion.Control className="accordion-control">
                <div className="group-section" style={{ margin: 0, padding: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 className="group-title" style={{ margin: 0 }}>{groupName}</h2>
                    <Text
                      fw={500}
                      style={{
                        display: 'inline',
                        color: getStatusTextColor(state, group[groupName]),
                      }}
                    >
                      {group[groupName].length - countDownCount(state, group[groupName])}/
                      {group[groupName].length} {t('Operational')}
                    </Text>
                  </div>
                </div>
              </Accordion.Control>
              <Accordion.Panel className="accordion-panel">
                <div className="monitor-card">
                  {renderMonitors(group[groupName])}
                </div>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </div>
    )
  } else {
    // Ungrouped monitors
    content = (
      <div className="monitor-card" style={{ maxWidth: '1024px', margin: '0 auto' }}>
        {monitors.map((monitor) => (
          <MonitorDetail key={monitor.id} monitor={monitor} state={state} />
        ))}
      </div>
    )
  }

  return (
    <Center>
      <div style={{ width: '100%', maxWidth: '1024px', padding: '0 1rem' }}>
        {content}
      </div>
    </Center>
  )
}
