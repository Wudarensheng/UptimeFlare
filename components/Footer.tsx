import { Divider } from '@mantine/core'
import { pageConfig } from '@/uptime.config'

export default function Footer() {
  const defaultFooter = `
    <div class="footer">
      <p>Powered by <a href="https://github.com/lyc8503/UptimeFlare" target="_blank" style="color: var(--primary-color); text-decoration: none; font-weight: 500;">UptimeFlare</a></p>
    </div>
  `

  return (
    <>
      <Divider mt="lg" mb="md" />
      <div dangerouslySetInnerHTML={{ __html: pageConfig.customFooter ?? defaultFooter }} />
    </>
  )
}
