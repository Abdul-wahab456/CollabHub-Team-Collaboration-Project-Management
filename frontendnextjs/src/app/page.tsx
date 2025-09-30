import { Header } from "../components/header"
import { LandingPage } from "../components/homepage/landing-page";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <LandingPage />
      </main>
    </div>
  )
}
