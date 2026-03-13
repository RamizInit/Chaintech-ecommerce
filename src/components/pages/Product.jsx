import { useState, useEffect, useRef, useCallback } from "react";
import ProductCard from "../layout/ProductCard";
import {
  Search,
  X,
  Filter,
  ChevronDown,
  AlertCircle,
  Loader2,
  Package,
  SlidersHorizontal,
  ArrowUpDown,
  CheckCircle,
} from "lucide-react";

const PAGE_SIZE = 12;
const CATEGORIES_URL = "https://dummyjson.com/products/categories";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const loaderRef = useRef(null);
  const debounceTimer = useRef(null);

  useEffect(() => {
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(debounceTimer.current);
  }, [search]);

  useEffect(() => {
    fetch(CATEGORIES_URL)
      .then((r) => r.json())
      .then((data) => {
        const cats = Array.isArray(data)
          ? data.map((c) => (typeof c === "string" ? c : c.slug || c.name || c))
          : [];
        setCategories(cats.slice(0, 20));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setProducts([]);
    setSkip(0);
    setTotal(0);
  }, [debouncedSearch, category, sortBy]);

  const fetchProducts = useCallback(
    async (currentSkip) => {
      setLoading(true);
      setError("");
      try {
        let url;
        if (debouncedSearch) {
          url = `https://dummyjson.com/products/search?q=${encodeURIComponent(debouncedSearch)}&limit=${PAGE_SIZE}&skip=${currentSkip}`;
        } else if (category) {
          url = `https://dummyjson.com/products/category/${encodeURIComponent(category)}?limit=${PAGE_SIZE}&skip=${currentSkip}`;
        } else {
          url = `https://dummyjson.com/products?limit=${PAGE_SIZE}&skip=${currentSkip}`;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();

        let prods = data.products || [];
        //TODO: Here price comes into US dollar so i want to multiply item price * 10 so it looks like indian currency
        prods = prods.map((p) => ({
          ...p,
          price: typeof p.price === "number" ? p.price * 10 : p.price,
        }));
        console.log("PRODUCTS :: ", prods);

        if (sortBy === "price-asc")
          prods = [...prods].sort((a, b) => a.price - b.price);
        else if (sortBy === "price-desc")
          prods = [...prods].sort((a, b) => b.price - a.price);
        else if (sortBy === "rating")
          prods = [...prods].sort((a, b) => b.rating - a.rating);
        else if (sortBy === "name")
          prods = [...prods].sort((a, b) => a.title.localeCompare(b.title));

        setProducts((prev) =>
          currentSkip === 0 ? prods : [...prev, ...prods],
        );
        setTotal(data.total || 0);
      } catch (e) {
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    },
    [debouncedSearch, category, sortBy],
  );

  useEffect(() => {
    setInitialLoad(true);
    fetchProducts(0);
  }, [fetchProducts]);

  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loading && products.length < total) {
          const next = products.length;
          setSkip(next);
          fetchProducts(next);
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loading, products.length, total, fetchProducts]);

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setSortBy("");
  };

  const hasFilters = search || category || sortBy;

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Products
          </h1>
          {!initialLoad && (
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 flex items-center gap-1">
              <Package className="w-3.5 h-3.5" />
              {total > 0
                ? `Showing ${products.length} of ${total} products`
                : "No products found"}
            </p>
          )}
        </div>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-sm font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50 rounded-xl transition-all duration-200 border border-red-200 dark:border-red-800 flex items-center gap-2 self-start sm:self-auto"
          >
            <X className="w-4 h-4" />
            Clear filters
          </button>
        )}
      </div>

      
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 shadow-xl">
        
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full h-11 pl-9 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 outline-none transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        
        <div className="relative sm:w-48">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full h-11 pl-9 pr-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white appearance-none cursor-pointer focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 outline-none transition-all"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1).replace(/-/g, " ")}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>

        
        <div className="relative sm:w-48">
          <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full h-11 pl-9 pr-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white appearance-none cursor-pointer focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 outline-none transition-all"
          >
            <option value="">Sort: Default</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="rating">Top Rated</option>
            <option value="name">Name: A–Z</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      
      {error && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 border border-red-200 dark:border-red-800 rounded-2xl p-4 text-red-700 dark:text-red-400 flex items-center gap-3 shadow-lg">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium flex-1">{error}</span>
          <button
            onClick={() => fetchProducts(0)}
            className="px-4 py-2 text-sm font-semibold bg-white dark:bg-slate-800 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors border border-red-200 dark:border-red-800"
          >
            Retry
          </button>
        </div>
      )}

      
      {initialLoad && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden animate-pulse shadow-xl"
            >
              <div className="aspect-square bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700" />
              <div className="p-4 space-y-3">
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-full w-16" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full w-full" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full w-3/4" />
                <div className="h-10 bg-gradient-to-r from-indigo-200 to-purple-200 dark:from-indigo-900 dark:to-purple-900 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      )}

      
      {!initialLoad && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      
      {!initialLoad && !loading && products.length === 0 && !error && (
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center shadow-xl">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-950/50 dark:to-purple-950/50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-200 dark:border-indigo-900">
            <Search className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <p className="font-display text-lg font-semibold text-slate-900 dark:text-white mb-2">
            No products found
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
            Try adjusting your search or filter criteria.
          </p>
          <button
            onClick={clearFilters}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-indigo-500/25 flex items-center gap-2 mx-auto"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Clear all filters
          </button>
        </div>
      )}

      
      <div ref={loaderRef} className="flex justify-center py-6">
        {loading && !initialLoad && (
          <div className="flex items-center gap-3 px-4 py-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg">
            <Loader2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 animate-spin" />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Loading more products…
            </span>
          </div>
        )}
        {!loading && products.length > 0 && products.length >= total && (
          <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-4 py-2 rounded-xl border border-emerald-200 dark:border-emerald-800">
            <CheckCircle className="w-4 h-4" />
            All products loaded ✓
          </div>
        )}
      </div>
    </div>
  );
}
