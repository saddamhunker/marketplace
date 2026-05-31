import { WorkerRadar } from "@/components/radar/worker-radar";
import { SectionHeader } from "@/components/ui";

export const metadata = { title: "Live Worker Radar" };

export default function RadarPage() {
  return (
    <section className="section-pad">
      <div className="container-wide">
        <SectionHeader
          eyebrow="Instant Booking"
          title="Live Nearby Worker Radar"
          description="Find online electricians, plumbers, mechanics, AC repair technicians, carpenters, delivery riders, and labour workers near you."
        />
        <WorkerRadar />
      </div>
    </section>
  );
}
