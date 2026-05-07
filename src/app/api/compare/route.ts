import { NextRequest, NextResponse } from "next/server";
import { getMockPrices, products } from "@/lib/mock-data";

const MIMO_API_URL = "https://api.xiaomimimo.com/v1/chat/completions";

interface CompareRequest {
  category: string;
  productId: string;
  storeA: string;
  storeB: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: CompareRequest = await req.json();
    const { category, productId, storeA, storeB } = body;

    if (!category || !productId || !storeA || !storeB) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (storeA === storeB) {
      return NextResponse.json(
        { error: "Please select two different stores" },
        { status: 400 }
      );
    }

    // Get mock prices
    const prices = getMockPrices(productId, storeA, storeB);
    const productList = products[category] || [];
    const product = productList.find((p) => p.id === productId);
    const productName = product?.name || productId;

    // Call MiMo AI for analysis
    const apiKey = process.env.MIMO_API_KEY;
    let aiAnalysis = "";

    if (apiKey) {
      try {
        const prompt = `You are a smart shopping advisor. Analyze these two price options for "${productName}":

Store A (${prices.storeA.store}):
- Price: $${prices.storeA.price} ${prices.storeA.currency}
- In Stock: ${prices.storeA.inStock ? "Yes" : "No"}
- Rating: ${prices.storeA.rating}/5
- Shipping: ${prices.storeA.shipping}

Store B (${prices.storeB.store}):
- Price: $${prices.storeB.price} ${prices.storeB.currency}
- In Stock: ${prices.storeB.inStock ? "Yes" : "No"}
- Rating: ${prices.storeB.rating}/5
- Shipping: ${prices.storeB.shipping}

Provide a concise analysis (max 200 words):
1. Which store offers better value and why
2. Key factors (price difference, shipping, stock, rating)
3. Final recommendation

Be direct and practical.`;

        const response = await fetch(MIMO_API_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "mimo-v2.5",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_tokens: 500,
          }),
          signal: AbortSignal.timeout(15000),
        });

        if (response.ok) {
          const data = await response.json();
          aiAnalysis =
            data.choices?.[0]?.message?.content || "Analysis unavailable.";
        }
      } catch {
        aiAnalysis = "";
      }
    }

    // Fallback analysis if MiMo unavailable
    if (!aiAnalysis) {
      const diff = Math.abs(prices.storeA.price - prices.storeB.price);
      const cheaper =
        prices.storeA.price < prices.storeB.price
          ? prices.storeA.store
          : prices.storeB.store;
      const cheaperPrice = Math.min(
        prices.storeA.price,
        prices.storeB.price
      );
      const expensive = cheaper === prices.storeA.store ? prices.storeB.store : prices.storeA.store;

      aiAnalysis = `## Price Analysis: ${productName}

**Best Deal: ${cheaper} at $${cheaperPrice}**

You save **$${diff}** compared to ${expensive}.

### Key Findings:
- **Price Gap:** $${diff} difference (${((diff / Math.max(prices.storeA.price, prices.storeB.price)) * 100).toFixed(1)}% savings)
- **Stock Status:** Both stores have ${prices.storeA.inStock && prices.storeB.inStock ? "items in stock" : "limited availability — check before ordering"}
- **Shipping:** ${prices.storeA.store} offers ${prices.storeA.shipping}, while ${prices.storeB.store} offers ${prices.storeB.shipping}
- **Store Rating:** ${prices.storeA.store} (${prices.storeA.rating}★) vs ${prices.storeB.store} (${prices.storeB.rating}★)

### Recommendation:
Buy from **${cheaper}** — best combination of price, shipping, and reliability. ${diff > 50 ? "The savings are significant enough to justify choosing this store." : "The price difference is small, so consider shipping speed and return policy."}`;
    }

    return NextResponse.json({
      product: productName,
      prices,
      analysis: aiAnalysis,
      demoMode: !apiKey,
    });
  } catch (err) {
    console.error("Compare API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
