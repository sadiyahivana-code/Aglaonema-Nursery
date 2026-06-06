import TrackingWidget from "@/components/TrackingWidget";

export default function TrackingPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl text-forest-800 mb-6">
        Lacak Pesanan
      </h1>
      <TrackingWidget />
    </div>
  );
}
