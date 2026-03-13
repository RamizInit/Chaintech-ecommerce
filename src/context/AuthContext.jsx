import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const AuthContext = createContext(null);
const SESSION_DURATION = 5 * 60 * 1000; 

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [sessionExpiry, setSessionExpiry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("ct_session");
      if (raw) {
        const session = JSON.parse(raw);
        console.log("printing session :: ",session)
        if (session.expiresAt > Date.now()) {
          setUser(session.user);
          setSessionExpiry(session.expiresAt);
        } else {
          localStorage.removeItem("ct_session");
        }
      }
    } catch {
      localStorage.removeItem("ct_session");
    }
    setLoading(false);
  }, []);

  const register = useCallback((name, email, password) => {
    try {
      const users = JSON.parse(localStorage.getItem("ct_users") || "[]");
      if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
        return {
          success: false,
          error: "An account with this email already exists.",
        };
      }
      const newUser = {
        id: `user_${Date.now()}`,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password,
        createdAt: new Date().toISOString(),
      };
      users.push(newUser);
      localStorage.setItem("ct_users", JSON.stringify(users));
      return { success: true };
    } catch {
      return {
        success: false,
        error: "Registration failed. Please try again.",
      };
    }
  }, []);

  const login = useCallback((email, password) => {
    try {
      const users = JSON.parse(localStorage.getItem("ct_users") || "[]");
      const found = users.find(
        (u) =>
          u.email.toLowerCase() === email.toLowerCase() &&
          u.password === password,
      );
      if (!found)
        return { success: false, error: "Invalid email or password." };

      const expiresAt = Date.now() + SESSION_DURATION;
      const sessionData = { user: found, expiresAt };
      localStorage.setItem("ct_session", JSON.stringify(sessionData));
      setUser(found);
      setSessionExpiry(expiresAt);
      return { success: true };
    } catch {
      return {
        success: false,
        error: "Something went wrong. Please try again.",
      };
    }
  }, []);

  

  const logout = useCallback(() => {
    localStorage.removeItem("ct_session");
    setUser(null);
    setSessionExpiry(null);
  }, []);

  const updateUser = useCallback(
    (updatedFields) => {
      try {
        const users = JSON.parse(localStorage.getItem("ct_users") || "[]");
        const idx = users.findIndex((u) => u.id === user.id);
        if (idx === -1) return { success: false, error: "User not found." };

        if (updatedFields.newPassword) {
          if (users[idx].password !== updatedFields.currentPassword) {
            return { success: false, error: "Current password is incorrect." };
          }
          updatedFields.password = updatedFields.newPassword;
          delete updatedFields.currentPassword;
          delete updatedFields.newPassword;
        }

        if (updatedFields.email && updatedFields.email !== user.email) {
          const emailTaken = users.find(
            (u) =>
              u.email.toLowerCase() === updatedFields.email.toLowerCase() &&
              u.id !== user.id,
          );
          if (emailTaken)
            return { success: false, error: "Email is already in use." };
        }

        users[idx] = { ...users[idx], ...updatedFields };
        localStorage.setItem("ct_users", JSON.stringify(users));

        const session = JSON.parse(localStorage.getItem("ct_session"));
        session.user = users[idx];
        localStorage.setItem("ct_session", JSON.stringify(session));
        setUser(users[idx]);
        return { success: true };
      } catch {
        return { success: false, error: "Update failed. Please try again." };
      }
    },
    [user],
  );
  return (
    <AuthContext.Provider
      value={{
        user,
        sessionExpiry,
        loading,
        login,
        register,
        logout,
        updateUser,
    
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
