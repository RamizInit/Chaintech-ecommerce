import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useTheme } from "../../context/ThemeContext";
import toast from "react-hot-toast";
import { Check, CircleAlert, Eye, EyeOffIcon, Moon, ShoppingCart, Sun } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useAuth();

  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handle = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required.";
    else if (form.name.trim().length < 2)
      errs.name = "Name must be at least 2 characters.";

    if (!form.email) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Enter a valid email.";

    if (!form.password) errs.password = "Password is required.";
    else if (form.password.length < 6)
      errs.password = "Password must be at least 6 characters.";

    return errs;
  };

  const submit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const result = register(form.name.trim(), form.email.trim(), form.password);
    setLoading(false);

    if (result.success) {
      toast.success("Account created! Please sign in.");
      navigate("/login");
    } else {
      setErrors({ email: result.error });
      toast.error("Error comes during to created an account", result.error);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 dark:from-indigo-700 dark:via-indigo-800 dark:to-purple-900 relative overflow-hidden flex-col items-center justify-center p-12">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-80 h-80 rounded-full bg-white/30 blur-3xl" />
          <div className="absolute bottom-20 right-10 w-60 h-60 rounded-full bg-orange-300/30 blur-3xl" />
        </div>
        <div className="relative z-10 text-white text-center">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm border border-white/30 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <ShoppingCart size={50} className="text-white" />
          </div>
          <h1 className="font-display text-4xl font-bold mb-4 text-white">
            Join CHAINTECH
          </h1>
          <p className="text-white/80 text-lg max-w-xs">
            Create your account and start managing your e-commerce empire today.
          </p>
          <div className="mt-10 space-y-4 text-left">
            {[
              "Protected dashboard with session management",
              "Real-time product catalog from DummyJSON",
              "Cart management with persistent storage",
              "Dark & light mode support",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-white/80">
                <div className="w-5 h-5 bg-white/20 border border-white/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check size={15} />
                </div>
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative">
        <button
          onClick={toggleTheme}
          className="absolute top-6 right-6 w-10 h-10 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center border border-slate-200 dark:border-slate-700"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5 text-indigo-600" />
          )}
        </button>

        <div className="w-full max-w-md">
          
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <ShoppingCart size={24} className="text-white" />
            </div>
            <span className="font-display text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              CHAINTECH
            </span>
          </div>

          <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Create account
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Fill in your details to get started
          </p>

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Full name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handle}
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 outline-none transition-all duration-200 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
              {errors.name && (
                <p className="mt-1.5 text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
                  <CircleAlert size={12} />
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handle}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 outline-none transition-all duration-200 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
                  <CircleAlert size={12} />
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handle}
                  placeholder="Min. 6 characters"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 outline-none transition-all duration-200 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOffIcon size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
                  <CircleAlert size={12} />

                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-indigo-500/25 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating account…</span>
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}