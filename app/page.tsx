import HeroSection from "@/components/sections/HeroSection";
import LiveSignalSection from "@/components/sections/LiveSignalSection";
import HistorySection from "@/components/sections/HistorySection";
import PnLSection from "@/components/sections/PnLSection";
import TickerBar from "@/components/ui/TickerBar";
import { fetchHistory } from "@/lib/api";

export default async function HomePage() {
  const history = await fetchHistory(30).catch(() => []);

  return (
    <main className="min-h-screen">
      <div className="pt-14">
        <TickerBar />
        <HeroSection />
        <LiveSignalSection />
        <HistorySection signals={history} />
        <PnLSection />
      </div>
    </main>
  );
}
