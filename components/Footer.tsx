import { Divider } from '@mantine/core'
import { pageConfig } from '@/uptime.config'

export default function Footer() {
  const defaultFooter = `
    <div class="footer">
      <p>Open-source monitoring and status page powered by <a href="https://github.com/lyc8503/UptimeFlare" target="_blank" style="color: #10b981; text-decoration: none;">Uptimeflare</a></p>
    </div>
  `

  return (
    <>
      <Divider mt="lg" mb="md" />
      <div dangerouslySetInnerHTML={{ __html: pageConfig.customFooter ?? defaultFooter }} />
    </>
  )
}
