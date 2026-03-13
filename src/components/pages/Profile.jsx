import { useState } from "react";

import toast from "react-hot-toast";
import {
  User,
  Mail,
  Lock,
  Calendar,
  Key,
  Edit3,
  Save,
  X,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  CreditCard,
  Shield,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Profile() {
  const { user, updateUser } = useAuth();

  const [editing, setEditing] = useState(false);
  const [tab, setTab] = useState("info");

  const [infoForm, setInfoForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [infoErrors, setInfoErrors] = useState({});

  const [pwForm, setPwForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [pwErrors, setPwErrors] = useState({});
  const [showPw, setShowPw] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [saving, setSaving] = useState(false);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const handleInfoChange = (e) => {
    setInfoForm({ ...infoForm, [e.target.name]: e.target.value });
    setInfoErrors({ ...infoErrors, [e.target.name]: "" });
  };

  const handlePwChange = (e) => {
    setPwForm({ ...pwForm, [e.target.name]: e.target.value });
    setPwErrors({ ...pwErrors, [e.target.name]: "" });
  };

  const validateInfo = () => {
    const errs = {};
    if (!infoForm.name.trim()) errs.name = "Name is required.";
    else if (infoForm.name.trim().length < 2)
      errs.name = "Name must be at least 2 characters.";
    if (!infoForm.email) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(infoForm.email))
      errs.email = "Enter a valid email.";
    return errs;
  };

  const validatePw = () => {
    const errs = {};
    if (!pwForm.currentPassword)
      errs.currentPassword = "Current password is required.";
    if (!pwForm.newPassword) errs.newPassword = "New password is required.";
    else if (pwForm.newPassword.length < 6)
      errs.newPassword = "Password must be at least 6 characters.";
    if (!pwForm.confirmPassword)
      errs.confirmPassword = "Please confirm your new password.";
    else if (pwForm.newPassword !== pwForm.confirmPassword)
      errs.confirmPassword = "Passwords do not match.";
    return errs;
  };

  const saveInfo = async () => {
    const errs = validateInfo();
    if (Object.keys(errs).length > 0) {
      setInfoErrors(errs);
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    const result = updateUser({
      name: infoForm.name.trim(),
      email: infoForm.email.trim(),
    });
    setSaving(false);
    if (result.success) {
      toast.success("Profile updated successfully!", {
        icon: <CheckCircle className="w-4 h-4" />,
        style: {
          background: "linear-gradient(to right, #10b981, #059669)",
          color: "#fff",
        },
      });
      setEditing(false);
    } else {
      setInfoErrors({ email: result.error });
    }
  };

  const savePw = async () => {
    const errs = validatePw();
    if (Object.keys(errs).length > 0) {
      setPwErrors(errs);
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    const result = updateUser({
      currentPassword: pwForm.currentPassword,
      newPassword: pwForm.newPassword,
    });
    setSaving(false);
    if (result.success) {
      toast.success("Password changed successfully!", {
        icon: <Shield className="w-4 h-4" />,
        style: {
          background: "linear-gradient(to right, #4f46e5, #9333ea)",
          color: "#fff",
        },
      });
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setEditing(false);
    } else {
      setPwErrors({ currentPassword: result.error });
    }
  };

  const cancelEdit = () => {
    setEditing(false);
    setInfoForm({ name: user?.name || "", email: user?.email || "" });
    setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setInfoErrors({});
    setPwErrors({});
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-2xl sm:text-3xl font-display font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        My Profile
      </h1>

      
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-5 shadow-xl">
        <div className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white text-3xl font-display font-bold shadow-lg shadow-indigo-500/30 flex-shrink-0">
          {initials}
        </div>
        <div className="text-center sm:text-left flex-1 min-w-0">
          <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            {user?.name}
            <User className="w-4 h-4 text-indigo-500" />
          </h2>
          <p className="text-slate-600 dark:text-slate-400 flex items-center gap-1 mt-1">
            <Mail className="w-3.5 h-3.5" />
            {user?.email}
          </p>
          {user?.createdAt && (
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-2 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Member since{" "}
              {new Date(user.createdAt).toLocaleDateString("en", {
                month: "long",
                year: "numeric",
              })}
            </p>
          )}
        </div>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-indigo-500/25 flex items-center gap-2 flex-shrink-0"
          >
            <Edit3 className="w-4 h-4" />
            Edit Profile
          </button>
        )}
      </div>

      
      {!editing ? (
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
          <h3 className="font-display text-base font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-indigo-600" />
            Account Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                label: "Full Name",
                value: user?.name,
                icon: <User className="w-3.5 h-3.5" />,
              },
              {
                label: "Email Address",
                value: user?.email,
                icon: <Mail className="w-3.5 h-3.5" />,
              },
              {
                label: "Password",
                value: "••••••••",
                icon: <Lock className="w-3.5 h-3.5" />,
              },
              {
                label: "Account ID",
                value: user?.id?.toString().slice(0, 8) + "…",
                icon: <Key className="w-3.5 h-3.5" />,
              },
            ].map((field) => (
              <div
                key={field.label}
                className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3"
              >
                <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                  {field.icon}
                  {field.label}
                </p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {field.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
          
          <div className="flex gap-1 p-1 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900">
            {[
              {
                key: "info",
                label: "Personal Info",
                icon: <User className="w-4 h-4" />,
              },
              {
                key: "password",
                label: "Change Password",
                icon: <Lock className="w-4 h-4" />,
              },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                  tab === t.key
                    ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-md border border-indigo-200 dark:border-indigo-800"
                    : "text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                }`}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>

          {tab === "info" && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block mb-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <User className="w-4 h-4" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={infoForm.name}
                  onChange={handleInfoChange}
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                />
                {infoErrors.name && (
                  <p className="mt-1.5 text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {infoErrors.name}
                  </p>
                )}
              </div>
              <div>
                <label className="block mb-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={infoForm.email}
                  onChange={handleInfoChange}
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                />
                {infoErrors.email && (
                  <p className="mt-1.5 text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {infoErrors.email}
                  </p>
                )}
              </div>
            </div>
          )}

          {tab === "password" && (
            <div className="space-y-4 animate-fade-in">
              {[
                {
                  key: "currentPassword",
                  label: "Current Password",
                  name: "current",
                  icon: <Lock className="w-4 h-4" />,
                },
                {
                  key: "newPassword",
                  label: "New Password",
                  name: "new",
                  icon: <Key className="w-4 h-4" />,
                },
                {
                  key: "confirmPassword",
                  label: "Confirm New Password",
                  name: "confirm",
                  icon: <Shield className="w-4 h-4" />,
                },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block mb-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    {field.icon}
                    {field.label}
                  </label>
                  <div className="relative">
                    <input
                      type={showPw[field.name] ? "text" : "password"}
                      name={field.key}
                      value={pwForm[field.key]}
                      onChange={handlePwChange}
                      placeholder="••••••••"
                      className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all pr-11"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPw((v) => ({
                          ...v,
                          [field.name]: !v[field.name],
                        }))
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                      {showPw[field.name] ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {pwErrors[field.key] && (
                    <p className="mt-1.5 text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {pwErrors[field.key]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={tab === "info" ? saveInfo : savePw}
              disabled={saving}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-indigo-500/25 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
            <button
              onClick={cancelEdit}
              className="px-5 py-2.5 bg-white dark:bg-slate-800 hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 dark:hover:from-red-950/30 dark:hover:to-orange-950/30 text-red-600 dark:text-red-400 font-semibold rounded-xl transition-all duration-200 border border-red-200 dark:border-red-800 flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
