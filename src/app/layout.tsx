import CssBaseline from "@mui/material/CssBaseline"
import { Metadata, Viewport } from "next"
import { ReactNode } from "react"

import theme from "../theme"
import ThemeRegistry from "./ThemeRegistry"

export const metadata: Metadata = {
  title: "YuruGP 2020 Progress",
  description: "Yuru-chara Grand Prix progress tracking",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content={theme.palette.primary.main} />
        <script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon={JSON.stringify({
            token: "b38b408d1b114b8a9c3c1ad3fccf5791",
          })}
        />
      </head>
      <body>
        <ThemeRegistry>
          <CssBaseline />
          {children}
        </ThemeRegistry>
      </body>
    </html>
  )
}
