import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) fetchProfile(session.user.id);
        else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(userId) {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }

  const rawRole = (profile?.role || "").toLowerCase();
  const value = {
    user,
    profile,
    loading,
    signIn,
    signOut,
    // Role checks based on real data format: "rona", "cda (bisnis)", "heg", "mbd (ilustrator)", etc.
    isRona: rawRole === "rona",
    isAksara: rawRole.startsWith("cda") || rawRole.startsWith("mbd") || rawRole === "heg" || rawRole === "korvoks",
    isBph: rawRole === "bph",
    isAdmin: rawRole === "admin",
    isCDA: rawRole.startsWith("cda"),
    isMBD: rawRole.startsWith("mbd"),
    isHEG: rawRole === "heg",
    isKorvoks: rawRole === "korvoks",
    divisi: profile?.divisi,
    cluster: profile?.cluster,
    lokasi: profile?.lokasi,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
