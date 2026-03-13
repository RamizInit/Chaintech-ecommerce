import { useState, useEffect, useCallback } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/authContext";
import toast from "react-hot-toast";
import {
  ShoppingCart,
  LayoutDashboard,
  Package,
  User,
  LogOut,
  Menu,
  Sun,
  Moon,
  X,
  Home,
  ChevronRight,
  Timer,
  AlertCircle,
} from "lucide-react";

const NAV_ITEMS = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    path: "/products",
    label: "Products",
    icon: <Package className="w-5 h-5" />,
  },
  {
    path: "/cart",
    label: "Cart",
    icon: <ShoppingCart className="w-5 h-5" />,
  },
  {
    path: "/profile",
    label: "Profile",
    icon: <User className="w-5 h-5" />,
  },
];

function SessionTimer({ sessionExpiry, onExpire }) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!sessionExpiry) return;
    const tick = () => {
      const remaining = Math.max(
        0,
        Math.floor((sessionExpiry - Date.now()) / 1000),
      );
      setTimeLeft(remaining);
      if (remaining === 0) onExpire();
      else if (remaining === 60)
        toast.success("⏱ Session expiring in 1 minute!", {
          icon: <Timer className="w-4 h-4" />,
          style: {
            background: "#f97316",
            color: "#fff",
          },
        });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [sessionExpiry, onExpire]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const pct = (timeLeft / 300) * 100;
  const isLow = timeLeft <= 60;

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
        isLow
          ? "bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/50 animate-pulse"
          : "bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
      }`}
    >
      <Timer
        className={`w-3.5 h-3.5 ${isLow ? "text-red-500" : "text-indigo-500"}`}
      />
      <span className="font-mono">
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </span>
      <div className="w-12 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            isLow
              ? "bg-gradient-to-r from-red-500 to-orange-500"
              : "bg-gradient-to-r from-indigo-500 to-purple-500"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, sessionExpiry, logout } = useAuth();
  const { cartCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = useCallback(() => {
    logout();
    toast.success("You have been signed out. See you soon! 👋", {
      icon: "👋",
      style: {
        background: "#10b981",
        color: "#fff",
      },
    });
    navigate("/login");
  }, [logout, navigate]);

  const handleSessionExpire = useCallback(() => {
    logout();
    toast.error("Your session has expired. Please sign in again.", {
      icon: <AlertCircle className="w-5 h-5" />,
      style: {
        background: "#ef4444",
        color: "#fff",
      },
    });
    navigate("/login");
  }, [logout, navigate]);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800 z-50 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:z-auto`}
      >
      
        <div className="flex items-center justify-between px-6 py-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              CHAINTECH
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center"
          >
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

      
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group relative ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25"
                    : "text-slate-600 dark:text-slate-400 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-950/50 dark:hover:to-purple-950/50 hover:text-indigo-600 dark:hover:text-indigo-400"
                }`
              }
            >
              {item.icon}
              {item.label}
              {item.label === "Cart" && cartCount > 0 && (
                <span className="ml-auto bg-white/20 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full backdrop-blur-sm">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
              {!location.pathname.includes(item.path) && (
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity absolute right-4" />
              )}
            </NavLink>
          ))}
        </nav>

      
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-100 dark:border-indigo-900/50 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-indigo-500/30">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                {user?.name}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                {user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 dark:hover:from-red-950/30 dark:hover:to-orange-950/30 transition-all duration-200 group"
          >
            <LogOut className="w-5 h-5" />
            Sign out
            <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </aside>

      
      <div className="flex-1 flex flex-col min-w-0">
      
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 h-16 flex items-center px-4 sm:px-6 gap-4">
      
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-950/50 dark:hover:to-purple-950/50 transition-all duration-200"
          >
            <Menu className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>

      
          <div className="flex-1 hidden sm:block">
            <div className="flex items-center gap-2">
              <Home className="w-4 h-4 text-slate-400" />
              <ChevronRight className="w-3 h-3 text-slate-400" />
              <p className="text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {NAV_ITEMS.find((n) => n.path === location.pathname)?.label ||
                  "Dashboard"}
              </p>
            </div>
          </div>

      
          <div className="flex items-center gap-3 ml-auto">
      
            <SessionTimer
              sessionExpiry={sessionExpiry}
              onExpire={handleSessionExpire}
            />

            <button
              onClick={toggleTheme}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-950/50 dark:hover:to-purple-950/50 transition-all duration-200 border border-slate-200 dark:border-slate-700 shadow-sm"
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                  <Moon className="w-5 h-5 text-indigo-600" />
              )}
            </button>

            
            <NavLink
              to="/cart"
              className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-950/50 dark:hover:to-purple-950/50 transition-all duration-200 border border-slate-200 dark:border-slate-700 shadow-sm"
            >
              <ShoppingCart className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </NavLink>

            
            <NavLink
            to="/profile"
            className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-indigo-500/30">
              {initials}
            </NavLink>
          </div>
        </header>

        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
