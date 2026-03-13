import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import toast from "react-hot-toast";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Package,
  Tag,
  Shield,
  Truck,
  RefreshCw,
  CreditCard,
  ArrowRight,
  XCircle,
  CheckCircle
} from "lucide-react";

function CartItemRow({ item }) {
  const { removeItem, updateQuantity } = useCart();

  const handleRemove = () => {
    removeItem(item.id);
    toast.success(`"${item.title.slice(0, 24)}…" removed from cart`, {
      icon: <Trash2 className="w-4 h-4" />,
      style: {
        background: "linear-gradient(to right, #ef4444, #f97316)",
        color: "#fff",
      },
    });
  };

  const discountedPrice =
    item.price * (1 - (item.discountPercentage || 0) / 100);

  return (
    <div className="flex items-center gap-4 py-4 animate-fade-in border-b border-slate-100 dark:border-slate-800 last:border-0">
      <img
        src={item.thumbnail}
        alt={item.title}
        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex-shrink-0"
        onError={(e) => {
          e.target.style.display = "none";
        }}
      />

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-slate-900 dark:text-white line-clamp-2">
          {item.title}
        </p>
        <div className="flex items-center gap-1 mt-0.5">
          <Package className="w-3 h-3 text-indigo-500 dark:text-indigo-400" />
          <p className="text-xs text-slate-500 dark:text-slate-500 capitalize">
            {item.category}
          </p>
        </div>
        <p className="text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mt-1">
          ₹{discountedPrice.toFixed(2)} each
        </p>
      </div>

      <div className="flex flex-col items-end gap-2">
        
        <div className="flex items-center gap-1 bg-white dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700 shadow-sm">
          <button
            onClick={() => updateQuantity(item.id, -1)}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-950/50 dark:hover:to-purple-950/50 text-slate-600 dark:text-slate-400 transition-all duration-200"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-8 text-center text-sm font-bold text-slate-900 dark:text-white">
            {item.quantity}
          </span>
          <button
            onClick={() => updateQuantity(item.id, 1)}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-950/50 dark:hover:to-purple-950/50 text-slate-600 dark:text-slate-400 transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        
        <p className="text-sm font-bold text-slate-900 dark:text-white">
          ₹{(discountedPrice * item.quantity).toFixed(2)}
        </p>

        
        <button
          onClick={handleRemove}
          className="text-xs text-red-500 hover:text-red-600 font-medium transition-all duration-200 flex items-center gap-1 hover:gap-1.5 group"
        >
          <Trash2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          Remove
        </button>
      </div>
    </div>
  );
}

export default function Cart() {
  const { items, cartTotal, clearCart } = useCart();

  const handleClear = () => {
    clearCart();
    toast.success("Cart cleared successfully", {
      icon: <Trash2 className="w-4 h-4" />,
      style: {
        background: "linear-gradient(to right, #ef4444, #f97316)",
        color: "#fff",
      },
    });
  };

  const handleCheckout = () => {
    toast.success("Order placed successfully! (Demo mode)", {
      icon: <CheckCircle className="w-4 h-4" />,
      style: {
        background: "linear-gradient(to right, #10b981, #059669)",
        color: "#fff",
      },
    });
    clearCart();
  };

  const savings = items.reduce((sum, i) => {
    const full = i.price * i.quantity;
    const disc = i.price * (1 - (i.discountPercentage || 0) / 100) * i.quantity;
    return sum + (full - disc);
  }, 0);

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto animate-fade-in">
        <h1 className="text-2xl sm:text-3xl font-display font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
          Shopping Cart
        </h1>
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center shadow-xl">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-950/50 dark:to-purple-950/50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-indigo-200 dark:border-indigo-900">
            <ShoppingCart className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
          </div>
          <p className="font-display text-xl font-semibold text-slate-900 dark:text-white mb-2">
            Your cart is empty
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-8">
            Looks like you haven't added any products yet.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-indigo-500/25"
          >
            <Package className="w-4 h-4" />
            Browse Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-display font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Shopping Cart
        </h1>
        <button
          onClick={handleClear}
          className="flex items-center gap-1.5 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-semibold bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50 rounded-xl transition-all duration-200 border border-red-200 dark:border-red-800"
        >
          <Trash2 className="w-4 h-4" />
          Clear cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="px-6 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-b border-indigo-100 dark:border-indigo-900">
            <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              {items.length} item{items.length !== 1 ? "s" : ""} in your cart
            </p>
          </div>
          <div className="px-6 divide-y divide-slate-100 dark:divide-slate-800">
            {items.map((item) => (
              <CartItemRow key={item.id} item={item} />
            ))}
          </div>
        </div>

        
        <div className="space-y-4">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl">
            <h2 className="font-display text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {items.map((item) => {
                const dp =
                  item.price * (1 - (item.discountPercentage || 0) / 100);
                return (
                  <div
                    key={item.id}
                    className="flex justify-between items-center text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 p-2 rounded-lg transition-colors"
                  >
                    <span className="truncate max-w-[160px] flex items-center gap-1">
                      <Package className="w-3 h-3 text-indigo-500 flex-shrink-0" />
                      <span>{item.title.slice(0, 20)}… × {item.quantity}</span>
                    </span>
                    <span className="font-medium text-slate-900 dark:text-white flex-shrink-0 ml-2">
                      ₹{(dp * item.quantity).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700 mt-4 pt-4 space-y-2">
              {savings > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" />
                    You save
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    -₹{savings.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5" />
                  Shipping
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  Free
                </span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-700 pt-3 mt-3">
                <span>Total</span>
                <span className="text-xl font-display bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  ₹{cartTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full mt-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              Checkout (Demo)
              <CheckCircle className="w-4 h-4" />
            </button>

            <Link
              to="/products"
              className="w-full mt-2 py-3 bg-white dark:bg-slate-800 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-950/50 dark:hover:to-purple-950/50 text-indigo-600 dark:text-indigo-400 font-semibold rounded-xl transition-all duration-200 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center gap-2"
            >
              <Package className="w-4 h-4" />
              Continue Shopping
            </Link>
          </div>

          
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="space-y-4">
              {[
                { icon: <Shield className="w-4 h-4" />, label: "Secure checkout", color: "text-indigo-600" },
                { icon: <Truck className="w-4 h-4" />, label: "Free shipping on all orders", color: "text-purple-600" },
                { icon: <RefreshCw className="w-4 h-4" />, label: "30-day easy returns", color: "text-emerald-600" },
              ].map((b) => (
                <div
                  key={b.label}
                  className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400"
                >
                  <span className={b.color}>{b.icon}</span>
                  <span>{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
