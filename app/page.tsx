"use client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, Zap, Lock, Cpu, ChevronRight, Code2, Shield, Gauge } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Navigation */}
      <nav className="border-b border-border/30 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-primary flex items-center justify-center">
              <Cpu className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="text-xl font-bold">Warden</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-foreground hover:text-accent">
                Dashboard
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full">
                Connect Wallet
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Split Layout */}
      <section className="min-h-screen flex items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 grid md:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 w-fit">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-sm text-amber-600 font-medium">Alpha (Testnet)</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-6xl md:text-7xl font-bold leading-tight text-balance space-y-2">
              <div>Internet native</div>
              <div>payments</div>
              <div className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-primary to-accent">
                designed for AI
              </div>
            </h1>

            {/* Subheading */}
            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              Autonomous agents execute trustless transactions with cryptographic verification. Built on Solana for
              speed, security, and complete auditability.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full w-full sm:w-auto font-semibold"
                >
                  REGISTER
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-accent/50 text-foreground hover:bg-accent/10 rounded-full w-full sm:w-auto font-semibold bg-transparent"
              >
                RESOURCES
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Right Visual - Glowing Orbs */}
          <div className="hidden md:flex items-center justify-center relative h-96">
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Large center orb */}
              <div
                className="absolute w-40 h-40 rounded-full glow-orb"
                style={{
                  background: "radial-gradient(circle at 30% 30%, rgba(0, 255, 200, 0.4), rgba(200, 0, 255, 0.2))",
                  boxShadow: "0 0 60px rgba(0, 255, 200, 0.5), inset -20px -20px 60px rgba(200, 0, 255, 0.3)",
                }}
              />

              {/* Top right orb */}
              <div
                className="absolute w-32 h-32 rounded-full glow-orb-slow top-0 right-12"
                style={{
                  background: "radial-gradient(circle at 30% 30%, rgba(200, 0, 255, 0.4), rgba(0, 255, 200, 0.2))",
                  boxShadow: "0 0 50px rgba(200, 0, 255, 0.5), inset -15px -15px 40px rgba(0, 255, 200, 0.3)",
                }}
              />

              {/* Bottom left orb */}
              <div
                className="absolute w-28 h-28 rounded-full glow-orb bottom-8 left-8"
                style={{
                  background: "radial-gradient(circle at 30% 30%, rgba(0, 255, 200, 0.3), rgba(200, 0, 255, 0.3))",
                  boxShadow: "0 0 40px rgba(0, 255, 200, 0.4), inset -10px -10px 30px rgba(200, 0, 255, 0.2)",
                }}
              />

              {/* Small top left orb */}
              <div
                className="absolute w-20 h-20 rounded-full glow-orb-slow top-12 left-0"
                style={{
                  background: "radial-gradient(circle at 30% 30%, rgba(200, 0, 255, 0.3), rgba(0, 255, 200, 0.2))",
                  boxShadow: "0 0 30px rgba(200, 0, 255, 0.4), inset -8px -8px 20px rgba(0, 255, 200, 0.2)",
                }}
              />

              {/* Small bottom right orb */}
              <div
                className="absolute w-24 h-24 rounded-full glow-orb bottom-0 right-0"
                style={{
                  background: "radial-gradient(circle at 30% 30%, rgba(0, 255, 200, 0.35), rgba(200, 0, 255, 0.25))",
                  boxShadow: "0 0 35px rgba(0, 255, 200, 0.45), inset -12px -12px 25px rgba(200, 0, 255, 0.25)",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid - Below Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-border/30">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Zap,
              title: "Instant Execution",
              description: "AI agents execute payments in milliseconds with Solana's high-speed infrastructure",
            },
            {
              icon: Lock,
              title: "Cryptographically Verified",
              description: "Every transaction is signed and logged on-chain for complete transparency",
            },
            {
              icon: Gauge,
              title: "Reputation-Gated",
              description: "Only agents with sufficient on-chain reputation can execute payments",
            },
          ].map((feature, idx) => (
            <Card
              key={idx}
              className="bg-card/50 border-border/50 backdrop-blur p-6 hover:border-accent/50 transition-colors group"
            >
              <feature.icon className="w-6 h-6 text-accent mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-border/30">
        <div className="space-y-12">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">How Warden Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Three simple steps to deploy autonomous payment agents on the frontier of internet-native finance.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Connect & Deploy",
                description: "Link your Solana wallet and deploy your AI agent with custom payment parameters",
              },
              {
                step: "02",
                title: "Build Reputation",
                description: "Execute transactions and build on-chain reputation through successful payments",
              },
              {
                step: "03",
                title: "Scale Autonomously",
                description: "Your agent executes payments autonomously with full cryptographic verification",
              },
            ].map((item) => (
              <div key={item.step} className="space-y-4">
                <div className="text-5xl font-bold text-accent/30">{item.step}</div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-border/30">
        <div className="space-y-12">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">Built for the Frontier</h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Everything you need to deploy trustless payment infrastructure for autonomous AI agents.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: Code2,
                title: "Developer-First API",
                description: "Simple, powerful APIs designed for developers building AI payment systems",
              },
              {
                icon: Shield,
                title: "Trustless Architecture",
                description: "No intermediaries. All transactions verified cryptographically on-chain",
              },
              {
                icon: Cpu,
                title: "AI-Native Design",
                description: "Optimized for autonomous agents to execute complex payment workflows",
              },
              {
                icon: Zap,
                title: "Real-time Settlement",
                description: "Instant payment execution and settlement on Solana blockchain",
              },
            ].map((feature, idx) => (
              <Card
                key={idx}
                className="bg-card/50 border-border/50 backdrop-blur p-8 hover:border-accent/50 transition-colors"
              >
                <feature.icon className="w-8 h-8 text-accent mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-border/30">
        <div className="grid md:grid-cols-4 gap-8">
          {[
            { label: "Transactions Executed", value: "1.2M+" },
            { label: "Active Agents", value: "8.5K" },
            { label: "Total Volume", value: "$450M+" },
            { label: "Uptime", value: "99.99%" },
          ].map((stat, idx) => (
            <div key={idx} className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-accent">{stat.value}</div>
              <p className="text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-border/30">
        <Card className="bg-gradient-to-r from-primary/20 to-accent/20 border-border/50 backdrop-blur p-12 md:p-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to Deploy?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join the frontier of internet-native payments. Deploy your first AI agent in minutes.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full">
              Get Started Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 mt-20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                <Cpu className="w-4 h-4 text-accent-foreground" />
              </div>
              <span className="font-semibold">Warden</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Frontier of Payments • Internet Native • Designed for AI • Cryptographically Verified
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
