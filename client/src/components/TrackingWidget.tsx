import { useState } from "react";
import { lacakResi } from "@/lib/api";

const KURIR = [
  { value: "jne", label: "JNE" },
  { value: "sicepat", label: "SiCepat" },
  { value: "jnt", label: "J&T" },
];

interface Props {
  defaultResi?: string;
  defaultKurir?: string;
}

export default function TrackingWidget({
  defaultResi = "",
  defaultKurir = "jne",
}: Props) {
  const [resi, setResi] = useState(defaultResi);
  const [kurir, setKurir] = useState(defaultKurir);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLacak() {
    if (!resi.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await lacakResi(resi, kurir);
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Input */}
      <div className="flex gap-2">
        <select
          value={kurir}
          onChange={(e) => setKurir(e.target.value)}
          className="border border-cream-300 rounded-sm px-3 py-2 text-sm font-body bg-white"
        >
          {KURIR.map((k) => (
            <option key={k.value} value={k.value}>
              {k.label}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Masukkan nomor resi..."
          value={resi}
          onChange={(e) => setResi(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLacak()}
          className="flex-1 border border-cream-300 rounded-sm px-3 py-2 text-sm font-body"
        />
        <button
          onClick={handleLacak}
          disabled={loading}
          className="bg-forest-800 text-cream-100 px-4 py-2 rounded-sm text-sm font-body font-semibold disabled:opacity-50 hover:bg-forest-700 transition-colors"
        >
          {loading ? "Melacak..." : "Lacak"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="text-red-600 text-sm bg-red-50 px-4 py-2 rounded-sm font-body">
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="border border-cream-300 rounded-sm p-4 space-y-4 bg-white">
          {/* Header */}
          <div className="flex justify-between items-center">
            <span
              className={`text-xs font-body font-semibold px-3 py-1 rounded-sm ${
                result.status === "DELIVERED"
                  ? "bg-green-100 text-green-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {result.status}
            </span>
            {result.estimasi && (
              <span className="text-xs text-cream-600 font-body">
                Estimasi: {result.estimasi}
              </span>
            )}
          </div>

          {/* Pengirim & Penerima */}
          <div className="grid grid-cols-2 gap-4 text-sm border-t border-cream-300 pt-3">
            <div>
              <p className="text-cream-500 text-xs font-body mb-1">Pengirim</p>
              <p className="font-body font-semibold text-bark-900">
                {result.pengirim}
              </p>
            </div>
            <div>
              <p className="text-cream-500 text-xs font-body mb-1">Penerima</p>
              <p className="font-body font-semibold text-bark-900">
                {result.penerima}
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className="border-t border-cream-300 pt-3 space-y-3">
            {result.history.map((h: any, i: number) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${
                      i === 0 ? "bg-forest-800" : "bg-cream-300"
                    }`}
                  />
                  {i < result.history.length - 1 && (
                    <div className="w-px flex-1 bg-cream-300 mt-1" />
                  )}
                </div>
                <div className="pb-3">
                  <p className="text-sm font-body font-medium text-bark-900">
                    {h.keterangan}
                  </p>
                  <p className="text-xs text-cream-500 font-body mt-0.5">
                    {h.tanggal} · {h.kota}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
