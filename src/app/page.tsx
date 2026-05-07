"use client";

import { useState, useEffect } from "react";
import {
  categories,
  stores,
  products,
  type Product,
  type StorePrice,
} from "@/lib/mock-data";

interface CompareResult {
  product: string;
  prices: { storeA: StorePrice; storeB: StorePrice };
  analysis: string;
  demoMode: boolean;
}

export default function Home() {
  const [category, setCategory] = useState("");
  const [productId, setProductId] = useState("");
  const [storeA, setStoreA] = useState("");
  const [storeB, setStoreB] = useState("");
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CompareResult | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (category && products[category]) {
      setAvailableProducts(products[category]);
      setProductId("");
    } else {
      setAvailableProducts([]);
      setProductId("");
    }
  }, [category]);

  const handleCompare = async () => {
    if (!category || !productId || !storeA || !storeB) {
      setError("Please fill in all fields");
      return;
    }
    if (storeA === storeB) {
      setError("Please select two different stores");
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, productId, storeA, storeB }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to compare prices");
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);

  const cheaperStore = result
    ? result.prices.storeA.price <= result.prices.storeB.price
      ? "A"
      : "B"
    : null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
        <div className="relative max-w-4xl mx-auto px-4 pt-16 pb-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
            </span>
            AI-Powered Comparison
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent mb-4">
            PricePulse
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Compare electronics prices across global stores. Let AI find the
            best deal for you.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 pb-12">
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 md:p-8 shadow-2xl shadow-blue-500/5">
          <div className="space-y-5">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all duration-200 ${
                      category === cat.id
                        ? "bg-blue-500/20 border-blue-500/50 text-blue-300 shadow-lg shadow-blue-500/10"
                        : "bg-gray-800/50 border-gray-700/50 text-gray-400 hover:border-gray-600 hover:text-gray-300"
                    }`}
                  >
                    <span className="text-2xl">{cat.icon}</span>
                    <span className="text-xs">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Product */}
            {availableProducts.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Product
                </label>
                <select
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="w-full bg-gray-800/80 border border-gray-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                >
                  <option value="">Select a product...</option>
                  {availableProducts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.image} {p.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Stores */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Store A
                </label>
                <select
                  value={storeA}
                  onChange={(e) => setStoreA(e.target.value)}
                  className="w-full bg-gray-800/80 border border-gray-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                >
                  <option value="">Select store...</option>
                  {stores.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.icon} {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Store B
                </label>
                <select
                  value={storeB}
                  onChange={(e) => setStoreB(e.target.value)}
                  className="w-full bg-gray-800/80 border border-gray-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                >
                  <option value="">Select store...</option>
                  {stores.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.icon} {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleCompare}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:from-gray-700 disabled:to-gray-700 disabled:text-gray-500 text-white font-semibold py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 disabled:shadow-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>⚡ Compare Prices</>
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Price Cards */}
            <div className="grid grid-cols-2 gap-4">
              {(["storeA", "storeB"] as const).map((key) => {
                const price = result.prices[key];
                const isCheaper = cheaperStore === (key === "storeA" ? "A" : "B");
                return (
                  <div
                    key={key}
                    className={`relative bg-gray-800/50 backdrop-blur-xl border rounded-2xl p-5 transition-all duration-300 ${
                      isCheaper
                        ? "border-green-500/50 shadow-lg shadow-green-500/10"
                        : "border-gray-700/50"
                    }`}
                  >
                    {isCheaper && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-green-500 text-white text-xs font-bold rounded-full">
                        BEST DEAL
                      </div>
                    )}
                    <div className="text-center">
                      <p className="text-gray-400 text-sm mb-1">
                        {key === "storeA" ? "Store A" : "Store B"}
                      </p>
                      <p className="text-lg font-semibold text-white mb-3">
                        {price.store}
                      </p>
                      <p
                        className={`text-3xl font-bold mb-3 ${
                          isCheaper ? "text-green-400" : "text-white"
                        }`}
                      >
                        {formatPrice(price.price)}
                      </p>
                      <div className="space-y-2 text-sm text-gray-400">
                        <div className="flex items-center justify-center gap-2">
                          <span
                            className={
                              price.inStock ? "text-green-400" : "text-red-400"
                            }
                          >
                            {price.inStock ? "✓ In Stock" : "✗ Out of Stock"}
                          </span>
                        </div>
                        <div>⭐ {price.rating}/5</div>
                        <div>🚚 {price.shipping}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Savings Banner */}
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-4 text-center">
              <p className="text-green-400 font-semibold">
                💰 You save{" "}
                {formatPrice(
                  Math.abs(
                    result.prices.storeA.price - result.prices.storeB.price
                  )
                )}{" "}
                by buying from{" "}
                {cheaperStore === "A"
                  ? result.prices.storeA.store
                  : result.prices.storeB.store}
              </p>
            </div>

            {/* AI Analysis */}
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  🧠
                </div>
                <div>
                  <h3 className="font-semibold text-white">AI Analysis</h3>
                  <p className="text-xs text-gray-500">
                    Powered by MiMo
                    {result.demoMode && " • Demo Mode"}
                  </p>
                </div>
              </div>
              <div className="prose prose-invert prose-sm max-w-none text-gray-300 leading-relaxed whitespace-pre-wrap">
                {result.analysis}
              </div>
            </div>

            {/* Disclaimer */}
            <p className="text-center text-xs text-gray-600">
              Prices shown are for demonstration purposes. Always verify current
              prices on the store website before purchasing.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-6 text-center text-gray-600 text-sm">
        <p>
          Built with Next.js + MiMo AI •{" "}
          <a
            href="https://100t.xiaomimimo.com"
            target="_blank"
            className="text-blue-500 hover:text-blue-400 transition-colors"
          >
            MiMo Orbit
          </a>
        </p>
      </footer>
    </main>
  );
}
