import { Link } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { useCart } from "../../context/CartContext";
import {
  ShoppingCart,
  Package,
  User,
  Calendar,
  CreditCard,
  ArrowRight,
  TrendingUp,
  Clock,
  Gift,
  Star,
  ChevronRight,
  Wallet,
} from "lucide-react";

const QUICK_ACTIONS = [
  {
    label: "Browse Products",
    path: "/products",
    gradient: "from-indigo-600 to-purple-600",
    icon: <Package className="w-6 h-6" />,
  },
  {
    label: "View Cart",
    path: "/cart",
    gradient: "from-purple-600 to-pink-600",
    icon: <ShoppingCart className="w-6 h-6" />,
  },
  {
    label: "Edit Profile",
    path: "/profile",
    gradient: "from-emerald-600 to-teal-600",
    icon: <User className="w-6 h-6" />,
  },
];

function StatCard({ label, value, sub, icon, gradient }) {
  return (
    <div className="group bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 hover:scale-[1.02] animate-slide-up">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}
        >
          <div className="text-white">{icon}</div>
        </div>
        <TrendingUp className="w-4 h-4 text-emerald-500" />
      </div>
      <p className="font-display text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        {value}
      </p>
      <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">
        {label}
      </p>
      {sub && (
        <p className="text-xs text-slate-500 dark:text-slate-500 mt-1 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {sub}
        </p>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { items, cartTotal, cartCount } = useCart();

  const stats = [
    {
      label: "Cart Items",
      value: cartCount,
      sub: `${items.length} unique product${items.length !== 1 ? "s" : ""}`,
      gradient: "from-indigo-600 to-purple-600",
      icon: <ShoppingCart className="w-5 h-5" />,
    },
    {
      label: "Cart Total",
      value: `₹${cartTotal.toFixed(2)}`,
      sub: cartCount > 0 ? "Ready for checkout" : "Nothing in cart yet",
      gradient: "from-emerald-600 to-teal-600",
      icon: <Wallet className="w-5 h-5" />,
    },
    {
      label: "Member Since",
      value: user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en", {
            month: "short",
            year: "numeric",
          })
        : "Today",
      sub: "Account active",
      gradient: "from-purple-600 to-pink-600",
      icon: <Calendar className="w-5 h-5" />,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-10 -right-10 w-60 h-60 rounded-full bg-white/30 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full bg-orange-300/30 blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl flex items-center justify-center text-white text-xl font-bold font-display shadow-xl">
            {user?.name
              ? user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)
              : "?"}
          </div>
          <div>
            <span className="text-md font-display sm:text-lg font-bold text-white">
              Hello,
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
              {user?.name}
            </h1>
            <p className="text-white/70 text-sm mt-1 flex items-center gap-1">
              <Gift className="w-3 h-3" />
              Here's what's happening with your store today.
            </p>
          </div>
        </div>
      </div>

      
      <div>
        <h2 className="font-display text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-indigo-600" />
          Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>
      </div>

      
      <div>
        <h2 className="font-display text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4 flex items-center gap-2">
          <Package className="w-4 h-4 text-indigo-600" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.path}
              to={action.path}
              className="group bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center gap-4 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 hover:scale-[1.02]"
            >
              <div
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:rotate-3 flex-shrink-0`}
              >
                {action.icon}
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {action.label}
                </p>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1 flex items-center gap-1 group-hover:gap-2 transition-all">
                  Go now
                  <ChevronRight className="w-3 h-3" />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      
      {items.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-indigo-600" />
              Cart Preview
            </h2>
            <Link
              to="/cart"
              className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors flex items-center gap-1 group"
            >
              View all
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-2xl divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden shadow-xl">
            {items.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-950/30 dark:hover:to-purple-950/30 transition-colors"
              >
                <img
                  src={item.thumbnail || item.images?.[0]}
                  alt={item.title}
                  className="w-14 h-14 object-cover rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                    {item.title}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 flex items-center gap-1 mt-1">
                    <Package className="w-3 h-3" />
                    Qty: {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
            {items.length > 3 && (
              <p className="text-center py-4 text-sm text-indigo-600 dark:text-indigo-400 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 flex items-center justify-center gap-1">
                <Gift className="w-3 h-3" />+{items.length - 3} more items in
                your cart
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
