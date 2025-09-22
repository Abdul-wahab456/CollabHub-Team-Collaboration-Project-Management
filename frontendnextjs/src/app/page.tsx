import { Header } from "../components/header"
import { HeroSection } from "../components/hero-section"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
      </main>
    </div>
  )
}
