import React, { useState, useEffect } from "react";
import { 
  ChevronLeft, ArrowRight, ShieldCheck, Eye, EyeOff, Check, X,
  Info, Loader2, Sparkles, Smartphone, UserCheck, AlertCircle, Share2,
  Copy, RotateCcw, HelpCircle, QrCode, Bell, ArrowUpRight
} from "lucide-react";

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(val);
};

interface AppSimulatorProps {
  bank: string;
  senderName: string;
  receiverName: string;
  receiverBank: string;
  amount: number;
  dateTime: string;
  transactionId: string;
  reference: string;
  balance: number;
  customField: string;
  onFinishSimulation: (data: any) => void;
  onClose: () => void;
}

// Complete list of mock profiles from real screenshots
const MOCK_RECENTS = [
  { name: "BLESSING ENE OGBONYIRO", phone: "642 363 7449", isMerchant: true, initial: "B" },
  { name: "EMMANUEL MARSHALL BITRUS", phone: "907 466 8151", isMerchant: false, initial: "E" },
  { name: "PAUL JATDUL NIMMYEL", phone: "902 165 9920", isMerchant: false, initial: "P" },
];

const SEARCH_SUGGESTIONS = [
  { name: "NANBAM LILY LUKE", phone: "808 169 4422", isMerchant: false, initial: "N" },
  { name: "MAREN MANDONG MANGAI", phone: "806 969 0468", isMerchant: false, initial: "M" },
];

// Replicates the OPay logo SVG perfectly
const OPayLogo = ({ className = "w-16 h-16", color = "#00C5A3" }: { className?: string; color?: string }) => (
  <div className={`relative ${className} flex items-center justify-center rounded-full bg-white shadow-md`}>
    <svg viewBox="0 0 100 100" className="w-4/5 h-4/5">
      <circle cx="50" cy="50" r="32" fill="none" stroke={color} strokeWidth="11" />
      <rect x="8" y="42" width="22" height="16" fill="white" />
      <rect x="12" y="44" width="20" height="12" fill="#1A2D54" rx="1.5" />
    </svg>
  </div>
);

// High-fidelity phone status bar
const DeviceStatusBar = ({ dark = false }: { dark?: boolean }) => {
  return (
    <div className={`flex justify-between items-center px-5 py-2 text-[10px] font-bold select-none z-50 ${dark ? 'text-white' : 'text-gray-900 bg-white'}`}>
      <div className="flex items-center gap-1.5 font-sans">
        <span className="text-[10px]">04:20</span>
        {/* Phone indicator icons */}
        <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current opacity-85">
          <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z" />
        </svg>
        <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current opacity-85">
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
        </svg>
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current text-green-500 animate-pulse">
          <circle cx="12" cy="12" r="8" />
          <path d="M9 12l2 2 4-4" fill="none" stroke="white" strokeWidth="2.5" />
        </svg>
      </div>

      <div className="flex items-center gap-1.5 font-sans">
        <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current opacity-85Rotate">
          <path d="M17.71 7.71L12 2h-1v7.59L6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 11 14.41V22h1l5.71-5.71-4.3-4.29 4.3-4.29zM13 5.83l1.88 1.88L13 9.59V5.83zm0 12.34v-3.76l1.88 1.88L13 18.17z" />
        </svg>
        <span className="text-[8px] tracking-tighter">1.82 K/S</span>
        <span className="text-[7.5px] font-extrabold border border-current px-0.5 py-px rounded leading-none scale-90">VoLTE</span>
        <span className="text-[8.5px] font-black">4G</span>
        
        {/* Battery with percentage inside */}
        <div className="flex items-center">
          <div className="border border-current px-0.5 py-px rounded flex items-center relative h-3.5 w-6.5">
            <div className="h-full bg-current rounded-sm w-[46%]" />
            <span className="absolute inset-0 text-[7px] text-center font-black leading-none pt-px mix-blend-difference">46</span>
          </div>
          <div className="w-0.5 h-1 bg-current rounded-r-sm" />
        </div>
      </div>
    </div>
  );
};

// Reusable custom numeric keypad overlay
const VirtualKeypad = ({ onKey, onBackspace, onConfirm }: {
  onKey: (key: string) => void;
  onBackspace: () => void;
  onConfirm: () => void;
}) => {
  const keys = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    [",", "0", "."],
  ];
  return (
    <div className="bg-[#1A1C1E] text-white p-3.5 space-y-1.5 border-t border-gray-800 animate-slideUp z-[50]">
      {keys.map((row, rIdx) => (
        <div key={rIdx} className="grid grid-cols-4 gap-1.5">
          {row.map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => onKey(val)}
              className="py-3 bg-[#2D3033] hover:bg-gray-700 text-lg font-black rounded-xl active:scale-95 transition-all text-center flex items-center justify-center cursor-pointer"
            >
              {val}
            </button>
          ))}
          {rIdx === 0 && (
            <button
              onClick={onBackspace}
              type="button"
              className="row-span-2 py-3 bg-[#2D3033] hover:bg-gray-700 rounded-xl flex items-center justify-center font-bold text-center col-start-4 cursor-pointer"
              style={{ gridRow: "span 2", height: "100%" }}
            >
              <X className="w-5 h-5 text-gray-300" />
            </button>
          )}
          {rIdx === 2 && (
            <button
              onClick={onConfirm}
              type="button"
              className="row-span-2 bg-[#00C5A3] hover:bg-emerald-600 rounded-xl flex items-center justify-center text-white col-start-4 cursor-pointer"
              style={{ gridRow: "span 2", height: "100%" }}
            >
              <Check className="w-6 h-6 font-bold" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default function AppSimulator({
  bank,
  senderName,
  receiverName,
  receiverBank,
  amount,
  dateTime,
  transactionId,
  reference,
  balance,
  customField,
  onFinishSimulation,
  onClose,
}: AppSimulatorProps) {
  // Steps: 'splash' -> 'home' -> 'transfer' -> 'confirm' -> 'loading' -> 'done'
  const [step, setStep] = useState<"splash" | "home" | "transfer" | "confirm" | "loading" | "done">("splash");
  const [maskBalance, setMaskBalance] = useState(true);
  const [typedAccount, setTypedAccount] = useState("");
  const [typedAmount, setTypedAmount] = useState(amount.toString());
  const [typedRemark, setTypedRemark] = useState(reference);
  const [searchQuery, setSearchQuery] = useState("");
  const [showVoucher, setShowVoucher] = useState(true);
  const [showReminder, setShowReminder] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"wallet" | "owealth">("owealth");
  
  // Custom contact selection state
  const [selectedContact, setSelectedContact] = useState<typeof MOCK_RECENTS[0] | typeof SEARCH_SUGGESTIONS[0] | null>(null);
  const [editingInputType, setEditingInputType] = useState<"account" | "amount" | "remark" | null>(null);

  const bankName = bank.toLowerCase();

  // Custom formatted reference matching OPay serial signature
  const generatedId = transactionId || "260602" + Math.floor(Math.random() * 900000) + "789" + Math.floor(Math.random() * 900000);

  // Auto-progress splash step after 2.5 seconds
  useEffect(() => {
    if (step === "splash") {
      const timer = setTimeout(() => {
        setStep("home");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleSplashSkip = () => setStep("home");

  const handleToTransfer = () => {
    setEditingInputType("account");
    setStep("transfer");
  };

  const handleToConfirm = () => {
    if (!typedAmount || parseFloat(typedAmount) <= 0) {
      alert("Please enter a valid transfer amount.");
      return;
    }
    setStep("confirm");
  };

  const handleExecuteTransfer = () => {
    setStep("loading");
    setTimeout(() => {
      setStep("done");
      onFinishSimulation({
        bank,
        senderName,
        receiverName: selectedContact ? selectedContact.name : receiverName,
        receiverBank,
        amount: parseFloat(typedAmount) || amount,
        dateTime,
        transactionId: generatedId,
        reference: typedRemark || reference,
        balance: balance - (parseFloat(typedAmount) || amount),
        customField,
        unlocked: false
      });
    }, 2500);
  };

  // ----------------------------------------------------------------------------------
  // RENDER SPLASH SCREEN
  // ----------------------------------------------------------------------------------
  const renderSplashScreen = () => {
    if (bankName === "opay") {
      return (
        <div 
          onClick={handleSplashSkip}
          className="bg-[#00C5A3] h-full flex flex-col justify-between p-6 text-white animate-fadeIn cursor-pointer"
        >
          <DeviceStatusBar dark={true} />
          <div className="flex-1 flex flex-col justify-center items-center">
            <OPayLogo className="w-20 h-20 mb-3 animate-pulse" />
            <h1 className="text-2xl font-black py-2 text-[#1A2D54] tracking-tight">We are Beyond Banking</h1>
          </div>
          <div className="text-center space-y-4 pb-4">
            <div className="flex items-center justify-center gap-1.5 text-[9px] text-[#1A2D54] font-bold select-none leading-relaxed">
              <span className="text-xs">🔰</span>
              <span>
                Licensed by the <span className="font-extrabold uppercase">CBN</span> and insured by the <span className="font-bold underline">NDIC</span>
              </span>
            </div>
            <p className="text-[10px] text-emerald-100 opacity-60">Tap anywhere to enter dashboard</p>
          </div>
        </div>
      );
    }

    // Default Splash for other banks
    return (
      <div 
        onClick={handleSplashSkip}
        className="bg-slate-950 h-full flex flex-col justify-between p-6 text-white animate-fadeIn cursor-pointer"
      >
        <DeviceStatusBar dark={true} />
        <div className="flex-1 flex flex-col justify-center items-center text-center">
          <div className="w-14 h-14 bg-cyan-500/10 border border-cyan-400/35 rounded-2xl flex items-center justify-center mb-3">
            <Smartphone className="text-cyan-400 w-6 h-6 animate-pulse" />
          </div>
          <h1 className="text-xl font-black tracking-tight uppercase text-cyan-400">{bank} Simulated Core</h1>
          <p className="text-[10.5px] text-gray-400 tracking-wider mt-1.5">NIP instant settlement system activation</p>
        </div>
        <div className="text-center pb-6">
          <button className="px-6 py-2 bg-slate-900 border border-slate-800 rounded-full text-[10px] font-bold font-mono tracking-wider">
            Go to dashboard &rarr;
          </button>
        </div>
      </div>
    );
  };

  // ----------------------------------------------------------------------------------
  // RENDER HOME DASHBOARD
  // ----------------------------------------------------------------------------------
  const renderHomeDashboard = () => {
    if (bankName === "opay") {
      return (
        <div className="bg-[#F5F6FA] h-full flex flex-col text-gray-800 font-sans relative overflow-y-auto select-none">
          <DeviceStatusBar dark={false} />
          
          {/* Header Bar */}
          <div className="bg-white px-4 py-3 flex justify-between items-center border-b border-gray-100 shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center font-black text-sm text-emerald-700 uppercase">
                  {senderName.charAt(0)}
                </div>
                <span className="absolute -bottom-1 -right-0.5 bg-sky-500 text-[8px] font-black text-white w-4 h-4 rounded-full flex items-center justify-center border border-white">
                  2
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 block uppercase">Interactive sandbox</span>
                <h2 className="text-xs font-black tracking-tight text-gray-900 flex items-center gap-1.5">
                  Hi, {senderName} <span className="text-xs">✝️💫💰</span>
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Help */}
              <div className="relative flex flex-col items-center">
                <span className="absolute -top-2.5 bg-red-500 text-white text-[7px] font-bold px-1 rounded-full animate-bounce">
                  HELP
                </span>
                <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center">
                  <HelpCircle className="w-4 h-4 text-gray-600" />
                </div>
              </div>
              {/* QR */}
              <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center">
                <QrCode className="w-4 h-4 text-gray-600" />
              </div>
              {/* Bell */}
              <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center relative">
                <Bell className="w-4 h-4 text-gray-600" />
                <span className="absolute top-0 right-0 bg-red-500 text-[7.5px] font-black text-white w-4 h-4 rounded-full flex items-center justify-center">
                  44
                </span>
              </div>
            </div>
          </div>

          {/* Balance card container */}
          <div className="p-4 bg-white">
            <div className="bg-gradient-to-br from-[#005D4B] to-[#01856C] text-white p-5 rounded-3xl shadow-xl shadow-emerald-950/10 space-y-3.5 relative overflow-hidden">
              <div className="flex justify-between items-center text-[10px]">
                <div className="flex items-center gap-1.5 font-bold text-emerald-100 uppercase opacity-95">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Available Balance</span>
                  <button onClick={() => setMaskBalance(!maskBalance)} className="p-0.5 active:scale-95 transition-all">
                    {maskBalance ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <span className="text-emerald-100 font-semibold cursor-pointer select-none">
                  Transaction History &gt;
                </span>
              </div>

              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-black font-mono tracking-tight text-white flex items-center gap-1">
                  {maskBalance ? "₦ * * * * *" : formatCurrency(425000)}
                </h1>
                <button
                  onClick={handleToTransfer}
                  className="px-4 py-2 bg-white text-[#005D4B] font-extrabold text-xs rounded-full shadow hover:brightness-105 active:scale-95 transition-all flex items-center gap-1"
                >
                  <span>+ Add Money</span>
                </button>
              </div>
            </div>

            {/* Sales ticker banner */}
            <div className="mt-3.5 bg-gray-50 border border-gray-100/80 rounded-2xl p-2.5 px-4 flex justify-between items-center text-xs text-gray-600 font-semibold">
              <span className="flex items-center gap-1 text-emerald-600">
                🏪 <span className="font-semibold text-gray-700">Business Service - Today's Sales:</span>
              </span>
              <span className="text-emerald-600 font-bold">₦0.00 &gt;</span>
            </div>
          </div>

          {/* Quick Action Rows */}
          <div className="px-4 gap-4 grid grid-cols-3 text-center py-4 bg-white">
            <button 
              onClick={handleToTransfer}
              className="flex flex-col items-center gap-1.5 focus:outline-none"
            >
              <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center text-[#00C5A3] shadow-inner shadow-green-200/20 active:scale-95 transition-transform">
                <Smartphone className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-gray-700">To OPay</span>
            </button>
            <button 
              onClick={handleToTransfer}
              className="flex flex-col items-center gap-1.5 focus:outline-none"
            >
              <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center text-[#00C5A3] shadow-inner shadow-green-200/20 active:scale-95 transition-transform">
                <ArrowRight className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-gray-700">To Bank</span>
            </button>
            <button 
              onClick={handleToTransfer}
              className="flex flex-col items-center gap-1.5 focus:outline-none"
            >
              <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center text-[#00C5A3] shadow-inner shadow-green-200/20 active:scale-95 transition-transform">
                <ArrowUpRight className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-gray-700">Withdraw</span>
            </button>
          </div>

          {/* Menu layout matrix */}
          <div className="grid grid-cols-4 gap-4 p-4 text-center bg-white border-t border-gray-100">
            {[
              { label: "Airtime", icon: "📱", badge: null },
              { label: "Data", icon: "🌐", badge: null },
              { label: "Betting", icon: "⚽", badge: null },
              { label: "TV", icon: "📺", badge: null },
              { label: "SafeBox", icon: "🔒", badge: null },
              { label: "Loan", icon: "💵", badge: "HOT" },
              { label: "Invitation", icon: "✉️", badge: null },
              { label: "More", icon: "⚙️", badge: null },
            ].map((menu, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1 cursor-pointer hover:bg-gray-50 p-1.5 rounded-xl relative">
                {menu.badge && (
                  <span className="absolute -top-1 right-2 bg-red-500 text-white text-[7px] font-black px-1.5 py-0.5 rounded-full z-10 scale-90">
                    {menu.badge}
                  </span>
                )}
                <span className="text-xl">{menu.icon}</span>
                <span className="text-[9.5px] font-bold text-gray-600 lowercase tracking-wide first-letter:uppercase">{menu.label}</span>
              </div>
            ))}
          </div>

          {/* Saving Challenge Widget */}
          <div className="p-4 bg-white mt-2 border-t border-gray-100">
            <div className="flex justify-between items-center text-xs font-bold text-gray-400 mb-2.5">
              <span>Saving Challenge 2026</span>
              <span>🎁</span>
            </div>
            <div className="bg-emerald-50/50 border border-emerald-100/60 p-4 rounded-2xl flex justify-between items-center">
              <div>
                <h4 className="text-[11.5px] font-black text-emerald-900">🎯 Special Target — Start small</h4>
                <p className="text-[10px] text-emerald-700 mt-0.5">Start daily, finish big in our 2026 challenge</p>
              </div>
              <button className="px-4 py-1.5 bg-[#00C5A3] hover:bg-emerald-600 text-white text-[11px] font-bold rounded-full cursor-pointer">
                Go
              </button>
            </div>
          </div>

          {/* Carousel sliding mockup banner */}
          <div className="px-4 py-3 bg-white border-t border-gray-100">
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-3.5 rounded-2xl text-white flex justify-between items-center">
              <div className="space-y-0.5">
                <h4 className="text-[11px] font-black uppercase tracking-wider text-amber-100">Up to ₦70 Off? Yes, Please! 🏆</h4>
                <p className="text-[9px] text-amber-50">Deposit ₦300 - ₦1,000 and claim ₦70 cash rewards</p>
              </div>
              <span className="text-2xl">⚽</span>
            </div>
            <div className="flex justify-center gap-1 mt-2.5">
              <span className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
              <span className="w-3 h-1.5 bg-emerald-500 rounded-full" />
              <span className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
            </div>
          </div>

          {/* Voucher Popup dialog */}
          {showVoucher && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
              <div className="bg-white rounded-[2rem] p-6 max-w-[290px] text-center space-y-4 shadow-2xl relative animate-fadeIn">
                <div className="flex justify-center">
                  <div className="relative">
                    <span className="text-4xl animate-bounce block">🎟️</span>
                    <span className="absolute -top-1 -right-1.5 bg-green-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full scale-95">
                      ACTIVE
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-gray-900 font-extrabold text-base">Claim 15 Discounts with</h3>
                  <h1 className="text-3xl font-black text-[#00C5A3] tracking-tight">₦99 on any Bill</h1>
                </div>
                <p className="text-[10px] text-gray-500 leading-relaxed font-semibold">
                  Get voucher coordinates linked to your transfer profile now. Triple benefits active in 2026.
                </p>
                <button
                  type="button"
                  onClick={() => setShowVoucher(false)}
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-[#00C5A3] text-white font-black text-xs uppercase tracking-wide rounded-full shadow-lg shadow-emerald-500/20"
                >
                  Claim 15 Discounts
                </button>
                <button
                  type="button"
                  onClick={() => setShowVoucher(false)}
                  className="absolute -bottom-14 left-1/2 -translate-x-1/2 w-10 h-10 bg-black/80 hover:bg-black border border-white/20 text-white rounded-full flex items-center justify-center shadow-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Bottom Nav */}
          <div className="mt-auto bg-white border-t border-gray-150 p-3.5 flex justify-around text-center text-gray-400 text-[10px] font-bold">
            <div className="text-[#00C5A3] flex flex-col items-center gap-0.5">
              <span className="text-xs">🏠</span>
              <span>Home</span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-xs">🎁</span>
              <span>Rewards</span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-xs">📈</span>
              <span>Finance</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 hover:text-emerald-500 cursor-pointer" onClick={onClose}>
              <span className="text-xs text-rose-500">🚪</span>
              <span className="text-rose-500">Exit App</span>
            </div>
          </div>
        </div>
      );
    }

    // Default Bank Dashboard
    return (
      <div className="bg-[#0F172A] text-white h-full flex flex-col justify-between">
        <DeviceStatusBar dark={true} />
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-900 pb-3">
            <h1 className="text-xs font-black uppercase tracking-widest text-[#00E5FF]">{bank} Sandbox</h1>
            <span className="text-[9px] text-emerald-400 font-mono font-bold uppercase tracking-wider block">Logged in ✓</span>
          </div>

          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
            <span className="text-[9px] text-gray-400 uppercase tracking-widest block font-bold">Dynamic Balance</span>
            <h2 className="text-2xl font-black font-mono text-cyan-400">{formatCurrency(balance)}</h2>
            <p className="text-xs text-gray-500">Tester Sender: {senderName}</p>
          </div>

          <button
            onClick={handleToTransfer}
            className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-gray-950 font-black text-xs uppercase rounded-xl tracking-wider hover:brightness-105"
          >
            Go to Transfer Screen &rarr;
          </button>
        </div>
        <div className="p-4 bg-slate-950 text-center text-[10px] text-gray-600 font-mono border-t border-slate-905">
          SIMULATION ACTIVE • CLICK SENDER TO BACK OUT
        </div>
      </div>
    );
  };

  // ----------------------------------------------------------------------------------
  // RENDER TRANSFER recipient & SEARCH
  // ----------------------------------------------------------------------------------
  const renderTransferPage = () => {
    if (bankName === "opay") {
      const activeList = searchQuery.trim() !== "" 
        ? SEARCH_SUGGESTIONS.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.phone.includes(searchQuery))
        : MOCK_RECENTS;

      return (
        <div className="bg-[#F8F9FB] h-full flex flex-col text-gray-800 font-sans relative overflow-y-auto animate-fadeIn select-none">
          <DeviceStatusBar dark={false} />

          {/* OPay Transfer Header */}
          <div className="bg-white px-4 py-3 border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <button onClick={() => setStep("home")} className="p-1 text-gray-800 active:scale-95 transition-transform">
                <ChevronLeft className="w-5 h-5 text-gray-900" />
              </button>
              <h1 className="text-sm font-black text-gray-900">Transfer to OPay Account</h1>
            </div>
            <span className="text-xs font-black text-[#00C5A3] cursor-pointer">History</span>
          </div>

          {/* Quick Predict Promo ad Banner */}
          <div className="p-4 pt-2.5">
            <div className="bg-gradient-to-r from-emerald-800 to-indigo-900 text-white rounded-xl p-3 flex justify-between items-center relative overflow-hidden h-[65px] border border-emerald-700/20">
              <div className="space-y-0.5 z-10 w-2/3">
                <span className="text-[10px] bg-red-500 text-white leading-none font-bold px-1.5 rounded uppercase">iLOTBET x OPay</span>
                <h4 className="text-xs font-black tracking-tight pt-1 leading-normal">QUICK PREDICT NOW</h4>
                <p className="text-[8px] text-emerald-100 opacity-90 font-medium">Predict scores and claim up to ₦150k payouts weekly</p>
              </div>
              <span className="text-4xl translate-x-2 translate-y-1 rotate-12 filter grayscale opacity-90">⚽</span>
            </div>
          </div>

          {/* Info notification Alert */}
          <div className="px-4">
            <div className="bg-[#E6F9F5] text-emerald-800 p-2 px-4 rounded-xl flex items-center gap-2 text-[10px] font-bold">
              <span>⚡</span>
              <span>Instant, Zero Issues, Free</span>
            </div>
          </div>

          {/* Recipient Account Input Section */}
          <div className="p-4 space-y-3">
            <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm space-y-2">
              <label className="text-[10.5px] text-gray-400 font-extrabold uppercase">Recipient Account</label>
              <div className="relative">
                <input
                  type="text"
                  id="opay-recipient-box"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setEditingInputType("account")}
                  placeholder="Phone No./OPay Account No./Name"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-4 pr-10 py-3.5 text-xs text-gray-800 font-semibold focus:outline-none focus:border-[#00C5A3] focus:bg-white"
                />
                <span className="absolute right-3.5 top-3.5 text-gray-400 cursor-pointer">
                  <QrCode className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>

          {/* Tabs Filter Bar */}
          <div className="bg-white border-b border-gray-100 flex text-center">
            <div className="flex-1 py-2.5 border-b-2 border-[#00C5A3] font-bold text-xs text-[#00C5A3] cursor-pointer">
              Recents
            </div>
            <div className="flex-1 py-2.5 font-bold text-xs text-gray-400 cursor-pointer">
              Favourites
            </div>
          </div>

          {/* Contacts Directory List rendering */}
          <div className="p-4 flex-1 space-y-3.5 overflow-y-auto">
            {activeList.map((contact, idx) => (
              <div 
                key={idx}
                onClick={() => {
                  setSelectedContact(contact);
                  setTypedAccount(contact.phone.replace(/ /g, ""));
                  setEditingInputType("amount");
                }}
                className="bg-white border border-gray-100 p-3 rounded-2xl flex justify-between items-center hover:border-emerald-200 cursor-pointer shadow-sm transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#E5F9F6] text-[#00C5A3] font-black text-sm flex items-center justify-center uppercase">
                    {contact.initial || contact.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-gray-900 tracking-tight flex items-center gap-1">
                      {contact.name}
                      {contact.isMerchant && (
                        <span className="bg-blue-50 text-[7px] text-blue-600 font-black px-1.5 rounded-full uppercase scale-90 border border-blue-200/50">
                          Merchant
                        </span>
                      )}
                    </h4>
                    <p className="text-[10px] text-gray-400 font-mono font-bold mt-0.5">{contact.phone}</p>
                  </div>
                </div>
                <span className="text-gray-300 text-xs font-bold">&gt;</span>
              </div>
            ))}

            {activeList.length === 0 && (
              <div className="text-center p-6 text-xs text-gray-400 bg-white rounded-2xl">
                No matched contacts. Use Virtual Pad!
              </div>
            )}
          </div>

          {/* Keyboard input routing */}
          {editingInputType === "account" && (
            <VirtualKeypad 
              onKey={(key) => {
                const numeric = key.replace(/[^0-9]/g, "");
                setSearchQuery(prev => prev + numeric);
              }}
              onBackspace={() => setSearchQuery(prev => prev.slice(0, -1))}
              onConfirm={() => {
                // If query matched search results
                const match = SEARCH_SUGGESTIONS.find(t => t.phone.replace(/ /g, "").includes(searchQuery) || t.name.toLowerCase().includes(searchQuery.toLowerCase()));
                if (match) {
                  setSelectedContact(match);
                  setTypedAccount(match.phone.replace(/ /g, ""));
                } else {
                  setSelectedContact({ name: receiverName, phone: searchQuery || "8081694422", isMerchant: false, initial: "R" });
                  setTypedAccount(searchQuery || "8081694422");
                }
                setEditingInputType("amount");
              }}
            />
          )}

          {/* Amount input routing if contact selected */}
          {editingInputType === "amount" && (
            <div className="fixed inset-0 bg-[#F8F9FB] z-50 flex flex-col justify-between">
              <DeviceStatusBar dark={false} />
              
              <div className="bg-white px-4 py-3.5 border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <button onClick={() => setEditingInputType("account")} className="p-1 text-gray-800">
                    <ChevronLeft className="w-5 h-5 text-gray-900" />
                  </button>
                  <h1 className="text-sm font-black text-gray-900">Transfer to OPay Account</h1>
                </div>
                <span className="text-xs font-black text-[#00C5A3] cursor-pointer">Records</span>
              </div>

              <div className="p-4 flex-1 space-y-4 overflow-y-auto">
                {/* Chosen Profile Title Tag block */}
                <div className="bg-white p-3 border border-gray-100 rounded-2xl flex items-center gap-3 shadow-sm">
                  <div className="w-9 h-9 rounded-full bg-[#E5F9F6] text-[#00C5A3] font-bold text-sm flex items-center justify-center uppercase">
                    {selectedContact ? selectedContact.initial : "R"}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-gray-900">{selectedContact ? selectedContact.name : receiverName}</h4>
                    <span className="text-[9.5px] text-gray-400 font-mono font-bold block mt-0.5">{selectedContact ? selectedContact.phone : typedAccount}</span>
                  </div>
                </div>

                {/* Main dynamic amount widget (Image 6 look) */}
                <div className="bg-white p-4.5 border border-gray-100 rounded-3xl shadow-sm space-y-3 relative overflow-hidden">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-gray-400 font-extrabold uppercase">Amount</span>
                    <span className="bg-emerald-50 text-[7.5px] text-emerald-600 font-black px-1.5 py-0.5 rounded uppercase font-mono tracking-wider">
                      No Transaction Fees
                    </span>
                  </div>

                  <div className="relative pt-0.5 border-b border-gray-100 pb-2.5">
                    {/* Thousands indicator bubble flags */}
                    {parseInt(typedAmount) >= 1000 && (
                      <div className="absolute top-[-25px] left-[55px] bg-gray-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded leading-none flex items-center gap-1 select-none animate-slideUp">
                        <span>Thousands</span>
                        <span className="inline-block border-4 border-transparent border-t-gray-500 absolute bottom-[-7px] left-1/2 -translate-x-1/2" />
                      </div>
                    )}

                    <div className="flex items-baseline gap-1 bg-white font-mono">
                      <span className="text-xl font-black text-[#00C5A3]">₦</span>
                      <input
                        type="text"
                        readOnly
                        value={typedAmount ? parseFloat(typedAmount).toLocaleString() : ""}
                        placeholder="10.00 - 5,000,000.00"
                        className="w-full text-xl font-black text-gray-900 focus:outline-none placeholder-gray-300"
                      />
                    </div>
                  </div>

                  {/* Matrix Chips selection */}
                  <div className="grid grid-cols-3 gap-2 pt-1 pb-1">
                    {["500", "1000", "2000", "5000", "9999", "10000"].map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => setTypedAmount(chip)}
                        className={`py-2 px-1 text-[11px] font-extrabold border rounded-xl select-none text-center cursor-pointer ${
                          typedAmount === chip
                            ? "bg-[#E5F9F6] border-[#00C5A3] text-[#00C5A3]"
                            : "bg-[#F8F9FA] border-gray-100 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        ₦{parseInt(chip).toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Remark sector */}
                <div className="bg-white p-4.5 border border-gray-100 rounded-3xl shadow-sm space-y-2">
                  <label className="text-[10px] text-gray-400 font-bold uppercase">Remark</label>
                  <input
                    type="text"
                    id="opay-typed-remark"
                    value={typedRemark}
                    onChange={(e) => setTypedRemark(e.target.value)}
                    placeholder="What's this for? (Optional)"
                    className="w-full text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl px-4.5 py-3 text-gray-800 focus:outline-none focus:border-[#00C5A3]"
                  />

                  {/* Dual category markers */}
                  <div className="grid grid-cols-2 gap-3.5 pt-2">
                    <button className="py-2.5 bg-gray-50 text-gray-500 font-bold text-xs rounded-xl hover:bg-gray-100 border border-transparent hover:border-gray-200 cursor-pointer">
                      Purchase
                    </button>
                    <button className="py-2.5 bg-[#E5F9F6] text-[#00C5A3] border border-[#00C5A3]/30 font-bold text-xs rounded-xl cursor-pointer">
                      Personal
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom CTA action footer */}
              <div className="p-4 bg-white border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleToConfirm}
                  disabled={!typedAmount || isNaN(parseFloat(typedAmount))}
                  className="w-full py-3 rounded-full text-sm font-black uppercase text-white shadow-lg tracking-wide transition-all select-none cursor-pointer"
                  style={{
                    backgroundColor: (!typedAmount || isNaN(parseFloat(typedAmount))) ? "#BFF1E5" : "#00C5A3"
                  }}
                >
                  Confirm
                </button>
              </div>

              <VirtualKeypad 
                onKey={(key) => {
                  if (key === "." || key === ",") {
                    if (!typedAmount.includes(".")) setTypedAmount(p => p + ".");
                    return;
                  }
                  setTypedAmount(p => p + key);
                }}
                onBackspace={() => setTypedAmount(p => p.slice(0, -1))}
                onConfirm={handleToConfirm}
              />
            </div>
          )}
        </div>
      );
    }

    // Default universal bank input page
    return (
      <div className="bg-slate-900 text-slate-100 h-full flex flex-col justify-between">
        <DeviceStatusBar dark={true} />
        <div className="p-4 bg-slate-950 flex justify-between items-center border-b border-zinc-800">
          <button onClick={() => setStep("home")} className="text-gray-400">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-extrabold uppercase text-gray-300">Sync details</span>
          <span className="w-5" />
        </div>

        <div className="p-6 flex-1 space-y-4">
          <div className="p-4.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
            <label className="text-[9px] text-[#00E5FF] font-mono tracking-widest uppercase font-bold block">Receiver Name</label>
            <p className="text-sm font-black text-white">{receiverName}</p>
            <div className="text-[9px] text-gray-500 pt-3 border-t border-slate-850">
              {receiverBank} | Ledger validation
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-zinc-400 font-semibold uppercase">Amount to Transfer (₦)</label>
            <input
              type="number"
              value={typedAmount}
              onChange={(e) => setTypedAmount(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-base text-cyan-400 font-mono focus:outline-none"
            />
          </div>
        </div>

        <div className="p-4 bg-slate-950 border-t border-slate-900">
          <button
            onClick={handleToConfirm}
            className="w-full py-3.5 bg-gradient-to-r from-cyan-400 to-blue-500 text-gray-950 font-black text-xs uppercase rounded-xl"
          >
            Go to confirmation screen &rarr;
          </button>
        </div>
      </div>
    );
  };

  // ----------------------------------------------------------------------------------
  // RENDER CONFIRMATION SCREEN (BOTTOM SHEETS OR SCREENS)
  // ----------------------------------------------------------------------------------
  const renderConfirmationPage = () => {
    const totalCost = parseFloat(typedAmount) || amount;
    
    if (bankName === "opay") {
      return (
        <div className="bg-[#1C1F22]/50 h-full flex flex-col justify-end text-gray-800 font-sans relative select-none animate-fadeIn">
          {/* Virtual background close trigger */}
          <div className="flex-1" onClick={() => setStep("transfer")} />

          {/* Bottom Sheet dialog container */}
          <div className="bg-white rounded-t-[2.5rem] p-6 shadow-2xl space-y-5 animate-slideUp relative z-50">
            <div className="flex justify-between items-center pb-2.5 border-b border-gray-100">
              <span className="w-3" />
              <div className="absolute left-1/2 -translate-x-1/2 top-3 w-12 h-1 bg-gray-300 rounded-full" />
              <button onClick={() => setStep("transfer")} className="p-1 text-gray-400 hover:text-gray-900">
                <X className="w-5 h-5" />
              </button>
              <span className="text-xs font-black text-[#00C5A3] cursor-pointer">Use Payment PIN</span>
            </div>

            {/* Mass central amount */}
            <div className="text-center space-y-1">
              <h1 className="text-3xl font-black text-gray-900 font-sans tracking-tight">
                ₦{totalCost.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
              </h1>
            </div>

            {/* Structured rows lists */}
            <div className="space-y-3 font-semibold text-xs text-gray-500 divide-y divide-gray-100/75">
              <div className="flex justify-between items-center text-gray-400 font-bold uppercase text-[9.5px]">
                <span>Details fields</span>
                <span className="text-[#00C5A3]">NIP Secured</span>
              </div>
              <div className="flex justify-between pt-2.5">
                <span>Account Number</span>
                <span className="text-gray-900 font-mono font-bold">{typedAccount || "808 169 4422"}</span>
              </div>
              <div className="flex justify-between pt-2.5 items-center">
                <span>Name</span>
                <span className="text-gray-950 font-black flex items-center gap-1.5">
                  <span className="w-4.5 h-4.5 rounded-full bg-emerald-50 text-[10px] text-emerald-600 font-black flex items-center justify-center">✓</span>
                  {selectedContact ? selectedContact.name : receiverName}
                </span>
              </div>
              <div className="flex justify-between pt-2.5 relative">
                <span>Amount</span>
                <span className="text-gray-950 font-black font-mono">
                  ₦{totalCost.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                  {totalCost >= 1000 && (
                    <span className="absolute top-[-22px] right-2 bg-emerald-500 text-white text-[7.5px] font-bold px-1 py-0.5 rounded leading-none select-none">
                      Thousands
                    </span>
                  )}
                </span>
              </div>
              <div className="flex justify-between pt-2.5">
                <span>Payment Method</span>
                <span className="text-gray-950 font-black">All &gt;</span>
              </div>
            </div>

            {/* Available Balance metrics card inner */}
            <div className="bg-[#F8F9FB] p-4 rounded-2xl border border-gray-100 space-y-2.5 text-xs text-gray-700">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1 font-semibold text-gray-500">
                  Available Balance <span className="text-gray-300">ⓘ</span>
                </span>
                <span className="font-bold flex items-center gap-1">
                  (₦305.70)
                </span>
              </div>

              {/* Insufficient balance simulated red banner indicator flag */}
              {totalCost > 305 && (
                <div className="text-[10px] text-red-500 font-black animate-pulse flex items-center gap-1">
                  <span>●</span>
                  <span>Insufficient balance</span>
                </div>
              )}

              <div className="border-t border-dashed border-gray-200/80 pt-2 flex justify-between text-[11px] text-gray-500">
                <span>Wallet (₦0.00)</span>
                <div className="flex gap-2.5">
                  <span>OWealth (₦305.70)</span>
                  <span className="text-emerald-500 font-bold">+ Add Money &gt;</span>
                </div>
              </div>
            </div>

            {/* Pay execution Button trigger (discards balance check restriction to bypass sandbox limits) */}
            <button
              onClick={() => setShowReminder(true)}
              className="w-full py-4 bg-[#00C5A3] hover:brightness-105 rounded-full font-black text-xs uppercase text-white shadow-xl shadow-emerald-500/20 text-center select-none block cursor-pointer tracking-wider"
            >
              Pay
            </button>
          </div>

          {/* Simulated reminder popup (Image 7 look) */}
          {showReminder && (
            <div className="absolute inset-0 bg-black/75 z-[100] flex justify-center items-end">
              <div className="bg-white rounded-t-[2.5rem] w-full p-6 animate-slideUp space-y-5 text-gray-800">
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <h3 className="text-md font-black text-gray-900 tracking-tight text-center flex-1">Reminder</h3>
                  <button onClick={() => setShowReminder(false)} className="p-1 hover:text-black">
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <p className="text-xs text-gray-500 font-bold leading-relaxed text-left">
                  Double check the transfer details before you proceed. Please note that successful transfers cannot be reversed.
                </p>

                <div className="space-y-3 text-xs bg-gray-50 p-4 rounded-3xl border border-gray-100 font-semibold">
                  <h4 className="text-[10.5px] font-black uppercase text-gray-400 tracking-wider">Transaction Details</h4>
                  
                  <div className="flex justify-between border-b border-gray-100 pb-2 pt-1">
                    <span className="text-gray-400">Name</span>
                    <span className="text-gray-950 font-black">{selectedContact ? selectedContact.name : receiverName}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-400">Account No.</span>
                    <span className="text-gray-950 font-mono font-bold">{typedAccount || "8081694422"}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-400">Bank</span>
                    <span className="text-gray-950 font-black">OPay</span>
                  </div>
                  <div className="flex justify-between pt-1 relative items-center">
                    <span className="text-gray-400">Amount</span>
                    <div className="flex items-center gap-1.5">
                      {totalCost >= 1000 && (
                        <span className="bg-gray-400 text-[7px] text-white font-bold p-1 py-0.5 rounded uppercase font-mono tracking-widest scale-90">Thousands</span>
                      )}
                      <span className="text-gray-950 font-black font-mono text-xs">
                        ₦{totalCost.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setShowReminder(false)} 
                    className="py-3 bg-emerald-50 text-[#00C5A3] font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer hover:bg-emerald-100/50"
                  >
                    Recheck
                  </button>
                  <button 
                    id="execute-opay-done"
                    onClick={handleExecuteTransfer} 
                    className="py-3 bg-[#00C5A3] text-white font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer hover:brightness-105 shadow-md shadow-emerald-400/10"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    // Default Bank Confirm
    return (
      <div className="bg-slate-900 text-slate-100 h-full flex flex-col justify-between">
        <DeviceStatusBar dark={true} />
        <div className="p-4 bg-slate-950 flex justify-between items-center border-b border-zinc-800">
          <button onClick={() => setStep("transfer")} className="text-gray-400">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-black uppercase text-gray-450 text-center flex-1">Authorize coordinates</span>
        </div>

        <div className="p-6 flex-1 space-y-4">
          <div className="p-5 bg-slate-950 border border-slate-800/80 rounded-2xl text-center space-y-1">
            <span className="text-[8.5px] tracking-widest text-[#00E5FF] font-black uppercase block">Signing Transaction Coordinates</span>
            <h1 className="text-2xl font-black font-mono text-cyan-400">{formatCurrency(totalCost)}</h1>
          </div>

          <div className="bg-slate-950/50 border border-slate-900 rounded-2xl p-4.5 text-xs font-semibold space-y-2.5">
            <div className="flex justify-between">
              <span className="text-gray-400">Destination</span>
              <span>{receiverName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Bank Gate</span>
              <span>{receiverBank}</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-950 border-t border-slate-900">
          <button
            onClick={handleExecuteTransfer}
            className="w-full py-3.5 bg-gradient-to-r from-cyan-400 to-blue-500 text-gray-950 font-black text-xs uppercase rounded-xl shadow-lg"
          >
            Sign & Settle Transfer Order
          </button>
        </div>
      </div>
    );
  };

  // ----------------------------------------------------------------------------------
  // RENDER LOADING SCREEN
  // ----------------------------------------------------------------------------------
  const renderLoadingScreen = () => {
    if (bankName === "opay") {
      return (
        <div className="bg-white h-full flex flex-col items-center">
          <DeviceStatusBar dark={false} />
          
          <div className="px-4 py-3.5 border-b border-gray-100 flex items-center justify-center w-full bg-white select-none">
            <h1 className="text-xs font-black text-gray-600">Transaction Details</h1>
          </div>

          <div className="flex-1 flex flex-col justify-center items-center text-center p-6 space-y-4">
            {/* Spinning OPay circle logo loop indicator */}
            <div className="relative mb-4 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border-4 border-emerald-100 border-t-[#00C5A3] animate-spin" />
              <div className="absolute font-sans font-black text-[#00C5A3] text-xl">O</div>
            </div>
            
            <h3 className="text-xs font-extrabold uppercase text-gray-400 tracking-widest">Processing Transaction</h3>
            <p className="text-[10.5px] text-gray-500 max-w-[210px] leading-relaxed">
              We are securely routing your funds to <span className="font-bold text-gray-900">{selectedContact ? selectedContact.name : receiverName}</span>. Please wait...
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-slate-950 h-full flex flex-col justify-center items-center text-center p-6 text-slate-100">
        <Loader2 className="w-10 h-10 text-cyan-400 animate-spin mb-4" />
        <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest">NIP Node Verification</h3>
        <p className="text-[10px] text-slate-400 mt-1 max-w-[200px]">
          Transmitting settlement package to traditional system bank gate...
        </p>
      </div>
    );
  };

  // ----------------------------------------------------------------------------------
  // CORE RETAILER VIEWPORTS WRAPPER
  // ----------------------------------------------------------------------------------
  return (
    <div className="fixed inset-0 z-[9999] bg-[#0A0D14]/98 backdrop-blur-md flex flex-col md:flex-row items-center justify-center p-0 md:p-6 select-none overflow-hidden animate-fadeIn">
      {/* Absolute Header link utility outside mobile frame for quick closures */}
      <button 
        type="button"
        id="dismiss-interactive-sim"
        onClick={onClose}
        className="absolute top-4 right-4 md:top-6 md:right-6 bg-slate-900/80 hover:bg-slate-800 text-white hover:text-white rounded-full p-2.5 border border-slate-800/80 shadow-2xl flex items-center gap-1.5 transition-all cursor-pointer z-50 text-xs font-mono select-none"
      >
        <X className="w-4.5 h-4.5" />
        <span className="hidden md:inline">Exit Simulation</span>
      </button>

      {/* Hardware simulator Frame Bezel wrapper on Desktop, Full Bleed on Mobile */}
      <div className="w-full h-full md:w-[380px] md:h-[780px] md:border-[12px] md:border-slate-900 md:rounded-[3rem] bg-[#F5F6FA] md:shadow-2xl relative overflow-hidden flex flex-col select-none border-b border-transparent">
        
        {/* Physical Camera Notch Bezel on desktop only */}
        <div className="hidden md:flex absolute top-0 inset-x-0 h-6 bg-black z-50 justify-center items-center gap-1.5 rounded-b-2xl">
          <span className="w-2 h-2 rounded-full bg-slate-800" />
          <span className="w-12 h-1.5 bg-slate-800 rounded-full" />
        </div>

        {/* Content Viewports scroll core */}
        <div className="flex-1 md:pt-4 overflow-hidden relative bg-[#F5F6FA] h-full">
          {step === "splash" && renderSplashScreen()}
          {step === "home" && renderHomeDashboard()}
          {step === "transfer" && renderTransferPage()}
          {step === "confirm" && renderConfirmationPage()}
          {step === "loading" && renderLoadingScreen()}
          {step === "done" && (
            <div className="h-full flex flex-col justify-between bg-white text-gray-800 font-sans animate-fadeIn relative">
              <DeviceStatusBar dark={false} />

              <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-white">
                <button onClick={() => setStep("home")} className="p-1">
                  <ChevronLeft className="w-5 h-5 text-gray-900" />
                </button>
                <h1 className="text-xs font-black text-gray-900 uppercase">Transaction Details</h1>
                <span className="w-5 flex items-center justify-center text-xs text-emerald-500">👤</span>
              </div>

              {/* Complete Pixel-perfect Successful Receipt View in the phone (Image 10) */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {/* Success sign checked */}
                <div className="flex flex-col items-center text-center space-y-2 pt-2 animate-fadeIn">
                  <div className="w-12 h-12 bg-emerald-50 border border-emerald-500 text-[#00C5A3] rounded-full flex items-center justify-center animate-bounce shadow">
                    <Check className="w-6 h-6 stroke-[3px]" />
                  </div>
                  <h3 className="text-cyan-905 bg-[#E6F9F5] text-[#00C5A3] px-3.5 py-1 text-[11px] font-black uppercase tracking-wider rounded-full scale-95 border border-emerald-500/10">
                    Successful
                  </h3>
                  <h1 className="text-2xl font-black text-gray-900 font-sans tracking-tight">
                    ₦{(parseFloat(typedAmount) || amount).toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                  </h1>
                </div>

                {/* Details list card */}
                <div className="bg-white p-4.5 rounded-3xl border border-gray-100 shadow-sm space-y-3 font-semibold text-xs text-gray-500 leading-normal">
                  <h4 className="text-[10.5px] font-black uppercase text-gray-400 tracking-wider">Transaction Details</h4>
                  
                  <div className="flex items-start justify-between border-b border-gray-100/75 pb-2.5 pt-1.5">
                    <span>Recipient Details</span>
                    <span className="text-gray-950 font-black text-right max-w-[190px] leading-relaxed truncate">
                      {selectedContact ? selectedContact.name : receiverName} <br />
                      <span className="text-[10px] text-gray-400 font-mono font-bold">OPay | {typedAccount || "8081694422"}</span>
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-gray-100/75 pb-2.5 items-center">
                    <span>Transaction No.</span>
                    <span className="text-gray-950 font-mono font-bold flex items-center gap-1">
                      {generatedId}
                      <span className="text-emerald-500 text-[10px]"><Copy className="w-3.5 h-3.5 inline" /></span>
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-gray-100/75 pb-2.5">
                    <span>Payment Method</span>
                    <span className="text-gray-950 font-black flex items-center gap-1">
                      OWealth <span className="text-emerald-500 font-normal">&gt;</span>
                    </span>
                  </div>

                  <div className="flex justify-between pt-1">
                    <span>Transaction Date</span>
                    <span className="text-gray-950 font-mono font-bold">Jun 2nd, 2026 19:45:22</span>
                  </div>
                </div>

                {/* More Actions card panel */}
                <div className="bg-[#F8F9FB] rounded-2xl p-4 border border-gray-100/60 flex justify-around text-center text-xs font-bold text-gray-700">
                  <div className="flex items-center gap-2 text-emerald-600 bg-white border border-gray-100/80 px-4 py-2 rounded-xl shadow-sm cursor-pointer hover:bg-gray-50">
                    <span className="text-sm">🔁</span>
                    <span>Transfer Again</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 bg-white border border-gray-100/80 px-4 py-2 rounded-xl shadow-sm cursor-pointer hover:bg-gray-50">
                    <span className="text-sm">📋</span>
                    <span>View Records</span>
                  </div>
                </div>
              </div>

              {/* Core footer action report/share buttons inside device */}
              <div className="p-4 bg-white border-t border-gray-100 flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep("home")}
                  className="flex-1 py-3 bg-[#EAF8F5] text-[#00C5A3] font-black text-xs uppercase tracking-wide rounded-full text-center hover:bg-[#DFF5EF] transition-all cursor-pointer"
                >
                  Report Issue
                </button>
                <button
                  type="button"
                  onClick={() => {
                    // Trigger finish simulation event callback
                    onFinishSimulation({
                      bank,
                      senderName,
                      receiverName: selectedContact ? selectedContact.name : receiverName,
                      receiverBank,
                      amount: parseFloat(typedAmount) || amount,
                      dateTime,
                      transactionId: generatedId,
                      reference: typedRemark || reference,
                      balance: balance - (parseFloat(typedAmount) || amount),
                      customField,
                      unlocked: false
                    });
                  }}
                  className="flex-1 py-3 bg-[#00C5A3] hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-wide rounded-full text-center shadow-lg shadow-emerald-400/10 transition-all cursor-pointer"
                >
                  Share Receipt
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Physical Home Indicator bar pill on bottom of desktop bezel */}
        <div className="hidden md:flex bg-black h-5 justify-center items-center rounded-t-lg">
          <span className="w-24 h-1 bg-slate-800 rounded-full" />
        </div>
      </div>
    </div>
  );
}
