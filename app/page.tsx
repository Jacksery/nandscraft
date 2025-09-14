import { HeroSection } from "@/components/hero";
import { ServerStats } from "@/components/server-stats";
export default function Home() {
  return (
    <div className="font-sans min-h-screen">
      <HeroSection />
      {/* Server Stats Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Live Server Stats
            </h2>
            <p className="text-lg text-muted-foreground">
              Real-time information about our server performance and community
            </p>
          </div>
          <ServerStats />
        </div>
      </section>
    </div>
  );
}
