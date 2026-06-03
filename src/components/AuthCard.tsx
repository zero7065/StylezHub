import React, { useState } from "react";
import { Sparkles, ShieldCheck, Mail, Lock, Gift, Key } from "lucide-react";
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
  
  // Restricted bypass: click the partner badge 5 times to unlock Google bypass option!
  const [bypassClicks, setBypassClicks] = useState(0);
  const [showBypass, setShowBypass] = useState(false);

  const handlePartnerClick = () => {
    const nextClicks = bypassClicks + 1;
    setBypassClicks(nextClicks);
    if (nextClicks >= 5) {
      setShowBypass(true);
      setErrorText("🛠️ Dev Bypass unlocked: Google Quick-Login is now available!");
    }
  };

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
    <div id="auth-card-container" className="w-full max-w-[440px] bg-[#121620] border border-zinc-800 p-6 sm:p-8 rounded-2xl shadow-xl relative transition-all">
      <div className="absolute top-0 right-0 p-3">
        <ShieldCheck className="w-5 h-5 text-emerald-400 animate-pulse opacity-50" />
      </div>

      <div className="text-center mb-6">
        <span className="text-[9px] font-mono font-black tracking-widest text-emerald-400 bg-emerald-950/30 px-3 py-1 rounded-md border border-emerald-500/25 inline-block">
          StyleHub Authentication Gateway
        </span>
        <h2 className="text-xl font-extrabold text-zinc-100 mt-3 flex items-center justify-center gap-1.5 tracking-tight">
          {isRegisterMode ? "Create Access Account" : "Platform Credentials Entry"}
        </h2>
        <p className="text-[11px] text-zinc-400 mt-1.5 max-w-xs mx-auto leading-normal">
          {isRegisterMode 
            ? "Activate with zero setup delay & secure an automatic 50 PLS points registration bonus."
            : "Review real-time financial simulators, escrow trades, and premium asset brokers."}
        </p>
      </div>

      {errorText && (
        <div className="bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 text-[11px] rounded-lg p-3 text-center font-mono font-medium">
          {errorText}
        </div>
      )}

      <form onSubmit={handleAuthSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-[#E2E8F0] uppercase tracking-wider block flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-emerald-500" /> Email Address
          </label>
          <input
            id="auth-email-input"
            type="email"
            required
            placeholder="eg. user@stylehub.com"
            value={authEmail}
            onChange={(e) => setAuthEmail(e.target.value)}
            className="w-full bg-[#0d0e12] border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-all font-mono"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-[#E2E8F0] uppercase tracking-wider block flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-500" /> Security Password
          </label>
          <input
            id="auth-password-input"
            type="password"
            required
            placeholder="🔑 Enter account password"
            value={authPassword}
            onChange={(e) => setAuthPassword(e.target.value)}
            className="w-full bg-[#0d0e12] border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-all font-mono"
          />
        </div>

        {isRegisterMode && (
          <div className="space-y-1.5 animate-fadeIn">
            <label className="text-[10px] font-bold text-[#E2E8F0] uppercase tracking-wider block flex items-center gap-1.5">
              <Gift className="w-3.5 h-3.5 text-emerald-500" /> Referral Code (Optional)
            </label>
            <input
              id="auth-referral-input"
              type="text"
              placeholder="e.g. USERSTYLE"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              className="w-full bg-[#0d0e12] border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-all font-mono"
            />
          </div>
        )}

        <button
          id="auth-submit-btn"
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-zinc-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? "Synchronizing Credentials Ledger..." : isRegisterMode ? "Deploy New Profile & Unlock (+50 pts)" : "Authorize Live Session"}
        </button>
      </form>

      {/* Interactive Credentials Helper desk */}
      <div className="mt-5 p-3.5 bg-[#0d0e12]/80 border border-zinc-800/80 rounded-xl space-y-2">
        <span className="text-[10px] text-zinc-400 font-mono tracking-wide flex items-center gap-1">
          <Key className="w-3.5 h-3.5 text-emerald-400" /> Instant Helper Accounts (Click to Autofill):
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            id="fill-admin-btn"
            type="button"
            onClick={() => handleFillDemo(defaultAdminEmail, defaultAdminPass)}
            className="px-2 py-1.5 bg-zinc-800 hover:bg-zinc-700 hover:text-white rounded text-[10px] text-zinc-300 font-mono transition-colors text-center cursor-pointer select-none"
          >
            👑 Main Admin
          </button>
          <button
            id="fill-user-btn"
            type="button"
            onClick={() => handleFillDemo(defaultUserEmail, defaultUserPass)}
            className="px-2 py-1.5 bg-zinc-800 hover:bg-zinc-700 hover:text-white rounded text-[10px] text-zinc-300 font-mono transition-colors text-center cursor-pointer select-none"
          >
            👤 Demo Vendor
          </button>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-zinc-800/50 text-center space-y-4">
        {/* Dynamic Gated Google sign-in bypass */}
        {showBypass && (
          <div className="space-y-2 animate-fadeIn">
            <button
              id="google-bypass-btn"
              onClick={handleGoogleBypass}
              disabled={isLoading}
              className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-xl text-xs text-gray-300 hover:text-white flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
            >
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.7 12.3c0-.8-.1-1.7-.2-2.5H12v4.8h6.6c-.3 1.5-1.1 2.8-2.4 3.7v3.1h3.8c2.2-2 3.7-5 3.7-9.1z"/>
                <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.8-3.1c-1.1.7-2.5 1.2-4.2 1.2-3.2 0-5.9-2.2-6.9-5.2H1.3v3.3C3.3 21.3 7.3 24 12 24z"/>
                <path fill="#FBBC05" d="M5.1 14c-.3-.9-.4-1.8-.4-2.8s.1-1.9.4-2.8V5.1H1.3C.5 6.8 0 8.8 0 11s.5 4.2 1.3 5.9l3.8-2.9z"/>
                <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4C17.9 1.2 15.2.5 12 .5c-4.7 0-8.7 2.7-10.7 6.6l3.8 2.9c1-3 3.7-5.2 6.9-5.2z"/>
              </svg>
              Google Fast-Login (Dev Mode)
            </button>
          </div>
        )}

        {/* Beautiful Google Partner Emblem Credentials badge with Easter Egg triggers */}
        <div 
          onClick={handlePartnerClick}
          className="flex items-center justify-center gap-2 py-2.5 px-3 bg-[#0d0e12]/60 border border-zinc-800 rounded-xl text-[10px] text-zinc-400 font-mono select-none cursor-pointer hover:bg-zinc-900 transition-colors"
          title="Click 5 times for Developer Bypass mode"
        >
          <span className="flex items-center gap-1.5 text-zinc-300">
            <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.7 12.3c0-.8-.1-1.7-.2-2.5H12v4.8h6.6c-.3 1.5-1.1 2.8-2.4 3.7v3.1h3.8c2.2-2 3.7-5 3.7-9.1z"/>
              <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.8-3.1c-1.1.7-2.5 1.2-4.2 1.2-3.2 0-5.9-2.2-6.9-5.2H1.3v3.3C3.3 21.3 7.3 24 12 24z"/>
              <path fill="#FBBC05" d="M5.1 14c-.3-.9-.4-1.8-.4-2.8s.1-1.9.4-2.8V5.1H1.3C.5 6.8 0 8.8 0 11s.5 4.2 1.3 5.9l3.8-2.9z"/>
              <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4C17.9 1.2 15.2.5 12 .5c-4.7 0-8.7 2.7-10.7 6.6l3.8 2.9c1-3 3.7-5.2 6.9-5.2z"/>
            </svg>
            Google OAuth 2.0
          </span>
          <span className="text-zinc-700">|</span>
          <span className="text-[9px] text-[#10B981] font-black tracking-widest uppercase">Verified Integration Services</span>
        </div>

        <div className="text-center text-[11px] pt-1 pt-1">
          <button
            id="toggle-auth-mode-btn"
            type="button"
            onClick={() => setIsRegisterMode(!isRegisterMode)}
            className="text-zinc-400 hover:text-[#10B981] hover:underline transition-all outline-none cursor-pointer"
          >
            {isRegisterMode ? "Already registered? Return back to email Login" : "New vendor or designer? Register account free"}
          </button>
        </div>
      </div>
    </div>
  );
}
