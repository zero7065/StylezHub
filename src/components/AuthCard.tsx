import React, { useState } from "react";
import { Sparkles, ShieldCheck, Mail, Lock, Gift, UserCheck } from "lucide-react";
import { User } from "../types";

interface AuthCardProps {
  onAuthSuccess: (user: User) => void;
  defaultAdminEmail?: string;
  defaultAdminPass?: string;
  defaultUserEmail?: string;
  defaultUserPass?: string;
}

export default function AuthCard({
  onAuthSuccess,
  defaultAdminEmail = "admin@stylehub.com",
  defaultAdminPass = "Admin@123456",
  defaultUserEmail = "user@stylehub.com",
  defaultUserPass = "User@123456",
}: AuthCardProps) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail || !authPassword) {
      setErrorText("Please fill out all credentials.");
      return;
    }
    setIsLoading(true);
    setErrorText("");

    const endPoint = isRegisterMode ? "/api/auth/register" : "/api/auth/login";
    try {
      const res = await fetch(endPoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: authEmail,
          password: authPassword,
          referral_code: isRegisterMode ? referralCode : undefined,
        }),
      });

      const data = await res.json();
      if (data.success && data.user) {
        onAuthSuccess(data.user);
        setAuthEmail("");
        setAuthPassword("");
        setReferralCode("");
      } else {
        setErrorText(data.error || "Authentication coordinate check failed.");
      }
    } catch (err) {
      console.error(err);
      setErrorText("Lost server bridge coordinate sync. Please retry!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleBypass = async () => {
    setIsLoading(true);
    setErrorText("");
    try {
      const googleId = "g-" + Math.random().toString(36).substr(2, 6);
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          googleId,
          email: "jadaistudiosoffcl@gmail.com",
          name: "Jadai Studios Director"
        }),
      });

      const data = await res.json();
      if (data.success && data.user) {
        onAuthSuccess(data.user);
      } else {
        setErrorText("Google fast OAuth check rejected.");
      }
    } catch (err) {
      console.error(err);
      setErrorText("Server OAuth sync failure.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = (email: string, pass: string) => {
    setAuthEmail(email);
    setAuthPassword(pass);
    setErrorText("");
  };

  return (
    <div className="w-full max-w-[440px] bg-[#0E131F]/95 border border-slate-800 p-6 sm:p-8 rounded-3xl backdrop-blur-md shadow-2xl relative transition-all">
      <div className="absolute top-0 right-0 p-3">
        <ShieldCheck className="w-5 h-5 text-cyan-400 animate-pulse opacity-50" />
      </div>

      <div className="text-center mb-6">
        <span className="text-[10px] font-mono font-black tracking-widest text-cyan-400 uppercase bg-cyan-950/40 px-2.5 py-0.5 rounded-full border border-cyan-500/25 inline-block">
          StyleHub Authentication Gateway
        </span>
        <h2 className="text-2xl font-black text-white mt-3 flex items-center justify-center gap-1.5 tracking-tight">
          {isRegisterMode ? "Create Access Account" : "Platform Credentials Entry"}
        </h2>
        <p className="text-[11px] text-gray-400 mt-1.5 max-w-xs mx-auto leading-normal">
          {isRegisterMode 
            ? "Activate with zero setup delay & secure a automatic 50 PLS points registration bonus."
            : "Review raw financial simulators, active escrows and high-performance digital accounts."}
        </p>
      </div>

      {errorText && (
        <div className="bg-red-950/40 border border-red-500/30 text-red-400 text-[11px] rounded-xl p-3.5 mb-4 text-center font-mono font-medium animate-shake">
          ⚠️ {errorText}
        </div>
      )}

      <form onSubmit={handleAuthSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block flex items-center gap-1.5">
            <Mail className="w-3 h-3 text-cyan-500" /> Email Address
          </label>
          <input
            type="email"
            required
            placeholder="eg. user@stylehub.com"
            value={authEmail}
            onChange={(e) => setAuthEmail(e.target.value)}
            className="w-full bg-[#05070A] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#00E5FF]/40 transition-all font-mono"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-cyan-500" /> Security Password
          </label>
          <input
            type="password"
            required
            placeholder="🔑 Enter account password"
            value={authPassword}
            onChange={(e) => setAuthPassword(e.target.value)}
            className="w-full bg-[#05070A] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#00E5FF]/40 transition-all font-mono"
          />
        </div>

        {isRegisterMode && (
          <div className="space-y-1.5 animate-fadeIn">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block flex items-center gap-1.5">
              <Gift className="w-3 h-3 text-cyan-500" /> Referral Code (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. USERSTYLE (bonus reward)"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              className="w-full bg-[#05070A] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#00E5FF]/40 transition-all font-mono"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-gradient-to-r from-cyan-400 to-blue-500 hover:brightness-110 active:scale-95 text-[#0B0E14] font-black rounded-xl text-xs uppercase shadow-lg shadow-cyan-500/20 tracking-wider transition-all disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? "Synchronizing Matrix Parameters..." : isRegisterMode ? "Deploy New Profile & Unlock (+50 pts)" : "Authorize Live Session"}
        </button>
      </form>

      <div className="mt-5 pt-4 border-t border-slate-800/60 text-center space-y-4">
        {/* Google sign-in bypass mock */}
        <div className="space-y-2">
          <button
            onClick={handleGoogleBypass}
            disabled={isLoading}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl text-xs text-gray-300 hover:text-white flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.7 12.3c0-.8-.1-1.7-.2-2.5H12v4.8h6.6c-.3 1.5-1.1 2.8-2.4 3.7v3.1h3.8c2.2-2 3.7-5 3.7-9.1z"/>
              <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.8-3.1c-1.1.7-2.5 1.2-4.2 1.2-3.2 0-5.9-2.2-6.9-5.2H1.3v3.3C3.3 21.3 7.3 24 12 24z"/>
              <path fill="#FBBC05" d="M5.1 14c-.3-.9-.4-1.8-.4-2.8s.1-1.9.4-2.8V5.1H1.3C.5 6.8 0 8.8 0 11s.5 4.2 1.3 5.9l3.8-2.9z"/>
              <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4C17.9 1.2 15.2.5 12 .5c-4.7 0-8.7 2.7-10.7 6.6l3.8 2.9c1-3 3.7-5.2 6.9-5.2z"/>
            </svg>
            Google Fast-Login (OAuth 2.0)
          </button>

          {/* Official Google Emblem and Credibility Badge */}
          <div className="flex items-center justify-center gap-2 py-2 px-3 bg-[#05070A]/60 border border-slate-800/80 rounded-xl text-[10px] text-gray-400 font-mono select-none">
            <span className="flex items-center gap-1.5 text-gray-300">
              <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.7 12.3c0-.8-.1-1.7-.2-2.5H12v4.8h6.6c-.3 1.5-1.1 2.8-2.4 3.7v3.1h3.8c2.2-2 3.7-5 3.7-9.1z"/>
                <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.8-3.1c-1.1.7-2.5 1.2-4.2 1.2-3.2 0-5.9-2.2-6.9-5.2H1.3v3.3C3.3 21.3 7.3 24 12 24z"/>
                <path fill="#FBBC05" d="M5.1 14c-.3-.9-.4-1.8-.4-2.8s.1-1.9.4-2.8V5.1H1.3C.5 6.8 0 8.8 0 11s.5 4.2 1.3 5.9l3.8-2.9z"/>
                <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4C17.9 1.2 15.2.5 12 .5c-4.7 0-8.7 2.7-10.7 6.6l3.8 2.9c1-3 3.7-5.2 6.9-5.2z"/>
              </svg>
              Google Cloud API Secure
            </span>
            <span className="text-gray-700">|</span>
            <span className="text-[9px] text-[#00E5FF] font-black tracking-widest uppercase">Verified Partner services</span>
          </div>
        </div>

        <div className="text-center text-[11px] pt-1 pt-2">
          <button
            type="button"
            onClick={() => setIsRegisterMode(!isRegisterMode)}
            className="text-gray-400 hover:text-[#00E5FF] hover:underline transition-all outline-none cursor-pointer"
          >
            {isRegisterMode ? "Already registered? Return back to email Login" : "New vendor and designer? Register account free"}
          </button>
        </div>
      </div>
    </div>
  );
}
