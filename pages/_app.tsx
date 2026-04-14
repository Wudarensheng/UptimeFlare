import '@mantine/core/styles.css'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { MantineProvider } from '@mantine/core'
import NoSsr from '@/components/NoSsr'
import '@/util/i18n'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NoSsr>
      <MantineProvider
        defaultColorScheme="auto"
        theme={{
          fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans SC, sans-serif',
          components: {
            Card: {
              defaultProps: {
                radius: 'md',
                shadow: 'sm',
                withBorder: false,
              },
            },
          },
        }}
      >
        <Component {...pageProps} />
      </MantineProvider>
    </NoSsr>
  )
}
