export interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
}

export interface StorePrice {
  store: string;
  price: number;
  currency: string;
  url: string;
  inStock: boolean;
  rating: number;
  shipping: string;
}

export const categories = [
  { id: "phones", name: "Smartphones", icon: "📱" },
  { id: "laptops", name: "Laptops", icon: "💻" },
  { id: "tablets", name: "Tablets", icon: "📋" },
  { id: "headphones", name: "Headphones", icon: "🎧" },
  { id: "cameras", name: "Cameras", icon: "📷" },
];

export const stores = [
  { id: "amazon", name: "Amazon", icon: "🅰️" },
  { id: "ebay", name: "eBay", icon: "🏪" },
  { id: "bestbuy", name: "Best Buy", icon: "🟡" },
  { id: "newegg", name: "Newegg", icon: "🥚" },
];

export const products: Record<string, Product[]> = {
  phones: [
    { id: "iphone16", name: "iPhone 16 Pro Max", category: "phones", image: "📱" },
    { id: "s25ultra", name: "Samsung Galaxy S25 Ultra", category: "phones", image: "📱" },
    { id: "pixel9", name: "Google Pixel 9 Pro", category: "phones", image: "📱" },
    { id: "oneplus13", name: "OnePlus 13", category: "phones", image: "📱" },
  ],
  laptops: [
    { id: "macbookpro", name: 'MacBook Pro 16" M4', category: "laptops", image: "💻" },
    { id: "xps15", name: "Dell XPS 15", category: "laptops", image: "💻" },
    { id: "thinkpadx1", name: "Lenovo ThinkPad X1 Carbon", category: "laptops", image: "💻" },
    { id: "spectre", name: "HP Spectre x360", category: "laptops", image: "💻" },
  ],
  tablets: [
    { id: "ipadpro", name: "iPad Pro M4", category: "tablets", image: "📋" },
    { id: "tabs10", name: "Samsung Galaxy Tab S10", category: "tablets", image: "📋" },
    { id: "pixeltablet", name: "Google Pixel Tablet", category: "tablets", image: "📋" },
  ],
  headphones: [
    { id: "airpodsmax", name: "AirPods Max", category: "headphones", image: "🎧" },
    { id: "wh1000xm5", name: "Sony WH-1000XM5", category: "headphones", image: "🎧" },
    { id: "qc ultra", name: "Bose QuietComfort Ultra", category: "headphones", image: "🎧" },
  ],
  cameras: [
    { id: "a7rv", name: "Sony A7R V", category: "cameras", image: "📷" },
    { id: "r5ii", name: "Canon EOS R5 II", category: "cameras", image: "📷" },
    { id: "z8", name: "Nikon Z8", category: "cameras", image: "📷" },
  ],
};

// Mock price data - randomized slightly for realism
const basePrices: Record<string, Record<string, number>> = {
  iphone16: { amazon: 1199, ebay: 1149, bestbuy: 1199, newegg: 1219 },
  s25ultra: { amazon: 1299, ebay: 1249, bestbuy: 1299, newegg: 1279 },
  pixel9: { amazon: 999, ebay: 959, bestbuy: 999, newegg: 989 },
  oneplus13: { amazon: 899, ebay: 869, bestbuy: 899, newegg: 879 },
  macbookpro: { amazon: 2499, ebay: 2399, bestbuy: 2499, newegg: 2479 },
  xps15: { amazon: 1799, ebay: 1699, bestbuy: 1749, newegg: 1729 },
  thinkpadx1: { amazon: 1649, ebay: 1579, bestbuy: 1649, newegg: 1619 },
  spectre: { amazon: 1399, ebay: 1329, bestbuy: 1349, newegg: 1369 },
  ipadpro: { amazon: 1099, ebay: 1049, bestbuy: 1099, newegg: 1089 },
  tabs10: { amazon: 849, ebay: 799, bestbuy: 849, newegg: 829 },
  pixeltablet: { amazon: 499, ebay: 469, bestbuy: 499, newegg: 489 },
  airpodsmax: { amazon: 549, ebay: 499, bestbuy: 549, newegg: 539 },
  wh1000xm5: { amazon: 349, ebay: 319, bestbuy: 348, newegg: 339 },
  "qc ultra": { amazon: 429, ebay: 399, bestbuy: 429, newegg: 419 },
  a7rv: { amazon: 3899, ebay: 3699, bestbuy: 3899, newegg: 3849 },
  r5ii: { amazon: 4299, ebay: 4099, bestbuy: 4299, newegg: 4249 },
  z8: { amazon: 3699, ebay: 3499, bestbuy: 3699, newegg: 3649 },
};

const shippingOptions: Record<string, string> = {
  amazon: "Free (Prime)",
  ebay: "$5.99 Standard",
  bestbuy: "Free Shipping",
  newegg: "Free Shipping",
};

const storeRatings: Record<string, number> = {
  amazon: 4.5,
  ebay: 4.2,
  bestbuy: 4.6,
  newegg: 4.3,
};

export function getMockPrices(
  productId: string,
  storeA: string,
  storeB: string
): { storeA: StorePrice; storeB: StorePrice } {
  const prices = basePrices[productId] || {};
  const priceA = prices[storeA] || 999;
  const priceB = prices[storeB] || 999;

  return {
    storeA: {
      store: stores.find((s) => s.id === storeA)?.name || storeA,
      price: priceA,
      currency: "USD",
      url: `https://${storeA}.com`,
      inStock: Math.random() > 0.1,
      rating: storeRatings[storeA] || 4.0,
      shipping: shippingOptions[storeA] || "Varies",
    },
    storeB: {
      store: stores.find((s) => s.id === storeB)?.name || storeB,
      price: priceB,
      currency: "USD",
      url: `https://${storeB}.com`,
      inStock: Math.random() > 0.1,
      rating: storeRatings[storeB] || 4.0,
      shipping: shippingOptions[storeB] || "Varies",
    },
  };
}
