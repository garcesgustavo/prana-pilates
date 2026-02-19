import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import ChatWidget from '../components/ChatWidget'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Antigravity | Zero-G Interface',
    description: 'The frictionless interface for your Pilates studio.',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Providers>
                    {children}
                    <ChatWidget />
                </Providers>
            </body>
        </html>
    )
}
