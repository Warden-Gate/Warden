import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { WalletProvider } from "@/contexts/wallet-context"
import { ReputationProvider } from "@/contexts/reputation-context"
import { ServiceRequestProvider } from "@/contexts/service-request-context"
import { AgentProvider } from "@/contexts/agent-context"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Warden - Frontier of Payments for AI",
  description:
    "Internet native payments designed for AI. Autonomous agents execute trustless transactions with cryptographic verification on Solana.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <WalletProvider>
          <ReputationProvider>
            <ServiceRequestProvider>
              <AgentProvider>
                {children}
                <Analytics />
              </AgentProvider>
            </ServiceRequestProvider>
          </ReputationProvider>
        </WalletProvider>
      </body>
    </html>
  )
}
