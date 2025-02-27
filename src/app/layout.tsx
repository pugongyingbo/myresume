// 从正确的相对路径导入 StyledComponentsRegistry
import StyledComponentsRegistry from '../lib/registry'
// 需要先安装 next 依赖包
// npm install next@latest
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  )
}