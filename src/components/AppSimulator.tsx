import React, { useState, useEffect } from "react";
import { 
  ChevronLeft, ArrowRight, ShieldCheck, Eye, EyeOff, Check, X,
  Info, Loader2, Sparkles, Smartphone, UserCheck, AlertCircle, Share2
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
}

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
}: AppSimulatorProps) {
  // Simulation Steps: 
  // 'splash' -> 'home' -> 'transfer' -> 'confirm' -> 'loading' -> 'done'
  const [step, setStep] = useState<"splash" | "home" | "transfer" | "confirm" | "loading" | "done">("splash");
  const [maskBalance, setMaskBalance] = useState(true);
  const [typedAccount, setTypedAccount] = useState("");
  const [typedAmount, setTypedAmount] = useState(amount.toString());
  const [typedRemark, setTypedRemark] = useState(reference);
  const [searchQuery, setSearchQuery] = useState("");
  const [showVoucher, setShowVoucher] = useState(true);
  const [showReminder, setShowReminder] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"wallet" | "owealth">("owealth");

  const bankName = bank.toLowerCase();

  // Progress Splash Automatically
  useEffect(() => {
    if (step === "splash") {
      const timer = setTimeout(() => {
        setStep("home");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // Handle splash click bypass
  const handleSplashSkip = () => setStep("home");

  // Format account digits for input validation
  const getAvatarLetter = (name: string) => {
    return name ? name.trim().charAt(0).toUpperCase() : "U";
  };

  // Generate 24 digit OPay style transaction reference
  const generatedId = transactionId || "992" + Math.floor(Math.random() * 900000000) + "000" + Math.floor(Math.random() * 900000000);

  // Transition to next simulated views
  const handleToTransfer = () => {
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
        receiverName,
        receiverBank,
        amount: parseFloat(typedAmount) || amount,
        dateTime,
        transactionId: generatedId,
        reference: typedRemark || reference,
        balance: balance - (parseFloat(typedAmount) || amount),
        customField,
        unlocked: false
      });
    }, 2800);
  };

  // ----------------------------------------------------------------------------------
  // RENDER SPLASH SCREENS
  // ----------------------------------------------------------------------------------
  const renderSplashScreen = () => {
    switch (bankName) {
      case "opay":
        return (
          <div className="bg-[#00C5A3] h-full flex flex-col justify-between p-6 text-white animate-fadeIn">
            <div className="flex-1 flex flex-col justify-center items-center">
              {/* OPay Logo hex */}
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-700/20 mb-4 animate-bounce">
                <span className="text-[#00C5A3] text-4xl font-extrabold tracking-tighter">O</span>
              </div>
              <h1 className="text-3xl font-black tracking-tight text-white mb-1">OPay</h1>
              <p className="text-xs text-emerald-100 uppercase tracking-widest font-semibold">Beyond Boundaries</p>
            </div>
            <div className="text-center space-y-2">
              <p className="text-[10px] text-emerald-100 opacity-60">Licensed by Central Bank of Nigeria (CBN)</p>
              <button 
                id="skip-splash"
                onClick={handleSplashSkip} 
                className="px-4 py-1.5 bg-white/20 hover:bg-white/30 rounded-full text-[10px] font-mono tracking-wider transition-all"
              >
                Skip Intro &rarr;
              </button>
            </div>
          </div>
        );
      case "kuda":
        return (
          <div className="bg-[#401965] h-full flex flex-col justify-between p-6 text-white animate-fadeIn">
            <div className="flex-1 flex flex-col justify-center items-center">
              <h1 className="text-5xl font-black tracking-tighter text-white animate-pulse">kuda.</h1>
              <p className="text-xs text-purple-200 tracking-wider mt-2">The Bank of the Free</p>
            </div>
            <div className="text-center space-y-2">
              <p className="text-[9px] text-purple-300 opacity-60">Federally Insured by NDIC • CBN Member</p>
              <button 
                id="skip-splash"
                onClick={handleSplashSkip} 
                className="px-4 py-1.5 bg-white/10 hover:bg-white/20 rounded-full text-[10px] font-mono transition-all"
              >
                Skip Intro &rarr;
              </button>
            </div>
          </div>
        );
      case "moniepoint":
        return (
          <div className="bg-[#002B49] h-full flex flex-col justify-between p-6 text-white animate-fadeIn">
            <div className="flex-1 flex flex-col justify-center items-center">
              <div className="flex items-center gap-1.5 animate-pulse">
                <span className="w-6 h-6 rounded-lg bg-amber-400 flex items-center justify-center text-[#002B49] font-black text-sm">m</span>
                <span className="text-2xl font-black text-white tracking-tight">moniepoint</span>
              </div>
              <p className="text-[10px] text-amber-400 font-bold uppercase tracking-widest mt-2">Powering Financial Dreams</p>
            </div>
            <div className="text-center space-y-2">
              <p className="text-[9px] text-gray-400 opacity-60">Verified Microfinance Banking License</p>
              <button 
                id="skip-splash"
                onClick={handleSplashSkip} 
                className="px-4 py-1.5 bg-white/10 hover:bg-white/20 rounded-full text-[10px] font-mono transition-all"
              >
                Skip &rarr;
              </button>
            </div>
          </div>
        );
      case "palmpay":
        return (
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 h-full flex flex-col justify-between p-6 text-white animate-fadeIn">
            <div className="flex-1 flex flex-col justify-center items-center text-center">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg mb-3">
                <span className="text-indigo-600 text-2xl font-black italic">P</span>
              </div>
              <h1 className="text-3xl font-black tracking-tighter">PalmPay</h1>
              <p className="text-[10px] text-purple-100 uppercase tracking-widest font-semibold mt-1">Reward Your Every Transfer</p>
            </div>
            <div className="text-center space-y-2">
              <button 
                id="skip-splash"
                onClick={handleSplashSkip} 
                className="px-4 py-1.5 bg-white/20 hover:bg-white/30 rounded-full text-[10px] font-mono transition-all"
              >
                Skip Intro &rarr;
              </button>
            </div>
          </div>
        );
      default:
        // Traditional Banks Splash
        return (
          <div className="bg-[#0F172A] h-full flex flex-col justify-between p-6 text-white animate-fadeIn">
            <div className="flex-1 flex flex-col justify-center items-center text-center">
              <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-400/30 rounded-xl flex items-center justify-center mb-3">
                <Smartphone className="text-cyan-400 w-6 h-6 animate-pulse" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-white uppercase">{bank} Active Mobile</h1>
              <p className="text-[10px] text-gray-400 tracking-wider mt-1">NIP Instant Settlement Systems</p>
            </div>
            <div className="text-center">
              <button 
                id="skip-splash"
                onClick={handleSplashSkip} 
                className="px-4 py-1.5 bg-cyan-950/40 border border-cyan-800/40 text-cyan-400 rounded-full text-[10px] transition-all"
              >
                Skip Dashboard Setup &rarr;
              </button>
            </div>
          </div>
        );
    }
  };

  // ----------------------------------------------------------------------------------
  // RENDER HOME DASHBOARDS
  // ----------------------------------------------------------------------------------
  const renderHomeDashboard = () => {
    switch (bankName) {
      case "opay":
        return (
          <div className="bg-gray-50 h-full flex flex-col text-gray-800 font-sans relative overflow-y-auto select-none">
            {/* Header */}
            <div className="bg-[#00C5A3] text-white p-4 pt-6 pb-8 rounded-b-3xl">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-black text-sm text-white">
                    {getAvatarLetter(senderName)}
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold opacity-85">Hello,</h3>
                    <h2 className="text-sm font-black tracking-tight">{senderName}</h2>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                  <span className="text-[10px] font-mono opacity-80 uppercase">OPay Pay</span>
                </div>
              </div>

              {/* Balance Card */}
              <div className="bg-emerald-900/30 border border-white/10 rounded-2xl p-4 flex justify-between items-center mt-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-100 opacity-90">
                    <span>Wallet Balance</span>
                    <button id="toggle-mask" onClick={() => setMaskBalance(!maskBalance)}>
                      {maskBalance ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <h1 className="text-2xl font-black text-white font-mono">
                    {maskBalance ? "₦ * * * , * * *" : formatCurrency(balance)}
                  </h1>
                  <p className="text-[9px] text-[#00E5FF] font-semibold flex items-center gap-1 font-mono">
                    <span>🌟 OWealth Daily Reward Active</span>
                  </p>
                </div>
                <button
                  id="opay-to-bank-direct"
                  onClick={handleToTransfer}
                  className="px-3.5 py-1.5 bg-white text-[#00C5A3] font-bold text-xs rounded-xl hover:brightness-95 active:scale-95 transition-all shadow"
                >
                  Send Money
                </button>
              </div>
            </div>

            {/* Quick Action Rows */}
            <div className="p-4 grid grid-cols-4 gap-3 bg-white mx-3 -mt-4 rounded-2xl shadow-md border border-gray-100 text-center">
              <button onClick={handleToTransfer} className="flex flex-col items-center gap-1 font-semibold text-gray-700 hover:text-emerald-500">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-[#00C5A3]">
                  <Smartphone className="w-5 h-5" />
                </div>
                <span className="text-[9px]">To OPay</span>
              </button>
              <button onClick={handleToTransfer} className="flex flex-col items-center gap-1 font-semibold text-gray-700 hover:text-emerald-500">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-[#00C5A3]">
                  <ArrowRight className="w-5 h-5" />
                </div>
                <span className="text-[9px]">To Bank</span>
              </button>
              <div className="flex flex-col items-center gap-1 text-gray-400 opacity-50">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                  <Smartphone className="w-5 h-5" />
                </div>
                <span className="text-[9px]">Airtime</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-gray-400 opacity-50">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                  <Smartphone className="w-5 h-5" />
                </div>
                <span className="text-[9px]">Betting</span>
              </div>
            </div>

            {/* Promo Carousel */}
            <div className="px-4 py-3 flex-1 flex flex-col justify-end">
              <div className="bg-[#00C5A3]/10 border border-[#00C5A3]/20 rounded-2xl p-4 text-xs font-medium text-emerald-800 relative shadow-sm">
                <span className="absolute top-2 right-2 text-[8px] bg-[#00C5A3] text-white px-1.5 py-0.5 rounded-full uppercase">NEW</span>
                <h4 className="font-bold flex items-center gap-1 text-[#00C5A3]">
                  <Sparkles className="w-4 h-4" /> Triple Reward Challenge!
                </h4>
                <p className="text-[10px] text-emerald-950 mt-1">Get up to 10% cash bonus on referred app wallets first transactions.</p>
              </div>
            </div>

            {/* Voucher popup */}
            {showVoucher && (
              <div className="absolute inset-x-4 bottom-16 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-2xl p-3 shadow-2xl border border-white/20 flex justify-between items-center animate-slideUp">
                <div className="space-y-0.5">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-emerald-200">OPay Super Voucher Active</h4>
                  <p className="text-xs font-black">₦1,000 Off Transfer Fee Coupon Claimed</p>
                </div>
                <button id="close-voucher" onClick={() => setShowVoucher(false)} className="p-1 bg-white/10 hover:bg-white/20 rounded-full">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Bottom Nav */}
            <div className="bg-white border-t border-gray-100 p-3 flex justify-around text-center text-gray-400 text-[10px] font-bold">
              <div className="text-[#00C5A3]">Home</div>
              <div>Rewards</div>
              <div>Finance</div>
              <div>Me</div>
            </div>
          </div>
        );
      case "kuda":
        return (
          <div className="bg-white h-full flex flex-col text-gray-800 font-sans relative select-none">
            <div className="p-5 pt-8 bg-[#401965] text-white rounded-b-[2rem] shadow-lg flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase text-purple-200">Free banking.</span>
                <h2 className="text-lg font-black mt-0.5">{senderName}</h2>
                <div className="flex items-center gap-2 mt-4">
                  <span className="text-xs text-purple-200">Sim Balance</span>
                  <h1 className="text-xl font-bold font-mono">{formatCurrency(balance)}</h1>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-white/10 rounded-full text-[10px] font-mono border border-white/5">Kuda Web</span>
            </div>

            <div className="p-4 space-y-4 flex-1 flex flex-col justify-between">
              <div className="grid grid-cols-2 gap-4">
                <button
                  id="kuda-send-cash"
                  onClick={handleToTransfer}
                  className="p-4 bg-gray-50 border border-gray-100 rounded-2xl text-left hover:border-purple-300 transition-all flex flex-col gap-2"
                >
                  <ArrowRight className="text-[#401965] w-5 h-5" />
                  <span className="text-xs font-bold text-gray-900 block">Send Out Money</span>
                  <span className="text-[10px] text-gray-500">Free, rapid NIP Transfer</span>
                </button>
                <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl text-left opacity-65 flex flex-col gap-2">
                  <Smartphone className="text-purple-300 w-5 h-5" />
                  <span className="text-xs font-bold text-gray-900">Buy Airtime</span>
                  <span className="text-[10px] text-gray-500">Instant topup reload</span>
                </div>
              </div>

              {/* Minimalist dashboard news alert */}
              <div className="p-4.5 bg-indigo-50/50 border border-indigo-100 rounded-2xl flex items-start gap-3">
                <Info className="text-indigo-600 w-4 h-4 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-indigo-900/90 leading-relaxed font-normal">
                  Kuda free account allows unlimited fee-less wallet settlements inside Nigeria today.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 border-t border-gray-100 p-3.5 flex justify-around text-center text-gray-400 text-[10px] font-bold">
              <span className="text-[#401965]">Home</span>
              <span>Payments</span>
              <span>Cards</span>
              <span>More</span>
            </div>
          </div>
        );
      case "moniepoint":
        return (
          <div className="bg-[#001D33] text-white h-full flex flex-col select-none justify-between">
            <div className="p-5 pt-7">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-black text-amber-400">moniepoint.</span>
                <span className="text-[10px] text-gray-400 tracking-wide">Secure Terminal</span>
              </div>

              <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl space-y-2 mt-4">
                <span className="text-[10px] text-gray-400 font-bold uppercase">Account Balance</span>
                <h1 className="text-2xl font-black font-mono text-white text-emerald-400">
                  {formatCurrency(balance)}
                </h1>
                <div className="flex justify-between text-[11px] text-gray-300 pt-2 border-t border-slate-800/40">
                  <span>Alias: 👥 {senderName}</span>
                </div>
              </div>

              {/* Transfers */}
              <div className="mt-6 space-y-3">
                <button
                  id="moniepoint-transfer"
                  onClick={handleToTransfer}
                  className="w-full p-4 bg-amber-400 text-gray-950 font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-between hover:brightness-110"
                >
                  <span>TRANSFER FUNDS INSTANTLY</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-4 bg-slate-950 text-gray-500 text-center text-[9px] uppercase tracking-widest border-t border-slate-900">
              StyleHub Safeguard Active
            </div>
          </div>
        );
      case "palmpay":
        return (
          <div className="bg-purple-950 text-white h-full flex flex-col select-none justify-between">
            <div className="p-5 pt-8">
              <div className="flex justify-between items-center mb-4">
                <span className="italic font-black text-xl text-indigo-400">PalmPay</span>
                <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[9px] text-indigo-300 uppercase">AML Gold Guard</span>
              </div>

              <div className="bg-gradient-to-r from-indigo-900 to-indigo-950 border border-indigo-700/30 rounded-2xl p-5 space-y-2">
                <span className="text-[10px] text-indigo-300 font-bold">Total Wallet Funds</span>
                <h1 className="text-3xl font-black text-white font-mono">{formatCurrency(balance)}</h1>
                <p className="text-[10px] text-indigo-400 font-medium">Hello, {senderName} 👤</p>
              </div>

              <button
                id="palmpay-start-transfer"
                onClick={handleToTransfer}
                className="mt-6 w-full py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-xs font-black uppercase tracking-wider"
              >
                Send Money
              </button>
            </div>

            <div className="bg-slate-950 p-4 border-t border-slate-900 text-center text-[10px] text-gray-500 font-mono">
              PALMPAY SIMULATED WORKSPACE
            </div>
          </div>
        );
      default:
        // Traditional generic bank dashboard
        return (
          <div className="bg-slate-950 text-slate-100 h-full flex flex-col justify-between select-none">
            <div className="p-5 pt-8 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-900 pb-3">
                <h3 className="font-bold text-xs uppercase tracking-widest text-[#00E5FF]">{bank}</h3>
                <span className="text-[9px] text-emerald-400 font-mono">● LIVE</span>
              </div>

              <div className="p-4.5 bg-slate-900/50 border border-slate-800 rounded-2xl space-y-1.5">
                <span className="text-[9px] text-gray-500 block uppercase">Available Ledger balance</span>
                <h1 className="text-2xl font-black font-mono text-slate-150">{formatCurrency(balance)}</h1>
                <p className="font-semibold text-[10.5px] text-slate-300">Holder: {senderName}</p>
              </div>

              <button
                id="generic-bank-transfer"
                onClick={handleToTransfer}
                className="w-full py-3 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-cyan-400 font-bold text-xs uppercase rounded-xl tracking-wider"
              >
                Simulate Account Transfer &rarr;
              </button>
            </div>

            <div className="p-4 bg-slate-950 text-[10px] text-gray-600 text-center border-t border-slate-900/40">
              StyleHub Bank Engine Core
            </div>
          </div>
        );
    }
  };

  // ----------------------------------------------------------------------------------
  // RENDER TRANSFER PAGES (RECIPIENT & AMOUNT DETAILS)
  // ----------------------------------------------------------------------------------
  const renderTransferPage = () => {
    switch (bankName) {
      case "opay":
        return (
          <div className="bg-white h-full flex flex-col text-gray-800 font-sans relative overflow-y-auto animate-fadeIn">
            <div className="bg-[#00C5A3] text-white p-4 pt-6 flex items-center gap-3">
              <button onClick={() => setStep("home")}>
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <h1 className="text-sm font-black uppercase tracking-wider">Transfer to Bank</h1>
            </div>

            <div className="p-4 space-y-4 flex-1">
              {/* Recipient Account Search Form Input */}
              <div className="bg-gray-50 p-3.5 border border-gray-100 rounded-2xl space-y-2">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide block">Recipient Details</label>
                <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-200 p-2 text-xs font-semibold">
                  <span className="font-mono text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                    {receiverBank}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-gray-400 font-bold uppercase truncate">Designated Account Holder:</p>
                    <p className="text-xs text-gray-950 font-black truncate">{receiverName}</p>
                  </div>
                </div>
              </div>

              {/* Amount Inputs with chip buttons */}
              <div className="bg-gray-50 p-3.5 border border-gray-100 rounded-2xl space-y-2">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide block">Amount to Transfer</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-lg font-black text-emerald-600">₦</span>
                  <input
                    type="number"
                    id="sim-amount-transfer-input"
                    value={typedAmount}
                    onChange={(e) => setTypedAmount(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-base font-black text-gray-950 focus:outline-none focus:border-emerald-500"
                    placeholder="0.00"
                  />
                </div>
                {/* Chip quick helpers */}
                <div className="flex gap-1.5 pt-1 overflow-x-auto">
                  {["5000", "10000", "20000", "50000"].map((chip) => (
                    <button
                      id={`chip-amt-${chip}`}
                      key={chip}
                      type="button"
                      onClick={() => setTypedAmount(chip)}
                      className="px-3 py-1 bg-white border border-gray-100 text-[10px] font-bold text-gray-600 rounded-lg hover:border-emerald-500 hover:text-emerald-600 transition-all cursor-pointer"
                    >
                      ₦{parseInt(chip).toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Remarks */}
              <div className="bg-gray-50 p-3.5 border border-gray-100 rounded-2xl space-y-2">
                <label className="text-[11px] font-bold text-gray-500 uppercase block">Remarks / Notes</label>
                <input
                  type="text"
                  id="sim-remarks-input"
                  value={typedRemark}
                  onChange={(e) => setTypedRemark(e.target.value)}
                  placeholder="e.g. Services payment validation"
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-none"
                />
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <button
                id="opay-to-confirm-btn"
                onClick={handleToConfirm}
                className="w-full py-3 bg-[#00C5A3] hover:brightness-105 active:scale-95 transition-all rounded-xl font-black text-xs text-white uppercase shadow-lg shadow-emerald-500/20"
              >
                Proceed to Authorization &rarr;
              </button>
            </div>
          </div>
        );
      default:
        // Universal bank input page
        return (
          <div className="bg-slate-900 text-slate-100 h-full flex flex-col justify-between animate-fadeIn">
            <div className="p-4 bg-slate-950 flex justify-between items-center border-b border-slate-900">
              <button id="sim-back-home" onClick={() => setStep("home")} className="text-gray-400">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-xs font-black uppercase text-gray-300">Transaction coordinates</span>
              <span className="w-4" />
            </div>

            <div className="p-5 flex-1 space-y-5">
              <div className="bg-slate-950 p-4 border border-slate-800 rounded-2xl space-y-1.5">
                <span className="text-[9px] text-[#00E5FF] font-black uppercase tracking-widest block">Recipient Bank</span>
                <p className="text-xs font-bold text-white">{receiverBank}</p>
                <span className="text-[9px] text-gray-500 block uppercase pt-2">Account Name</span>
                <p className="text-xs font-mono font-medium text-slate-300">{receiverName}</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Transfer Amount (₦)</label>
                <input
                  type="number"
                  id="sim-generic-amount-input"
                  value={typedAmount}
                  onChange={(e) => setTypedAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-base text-cyan-400 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Reference Narration</label>
                <input
                  type="text"
                  id="sim-generic-remark-input"
                  value={typedRemark}
                  onChange={(e) => setTypedRemark(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-950 border-t border-slate-900">
              <button
                id="generic-proceed-confirm"
                onClick={handleToConfirm}
                className="w-full py-3 bg-cyan-505 bg-gradient-to-r from-cyan-400 to-blue-500 text-gray-950 font-black rounded-xl text-xs uppercase"
              >
                Proceed Confirm &rarr;
              </button>
            </div>
          </div>
        );
    }
  };

  // ----------------------------------------------------------------------------------
  // RENDER CONFIRMATION SCREEN (BOTTOM SHEETS OR SCREENS)
  // ----------------------------------------------------------------------------------
  const renderConfirmationPage = () => {
    switch (bankName) {
      case "opay":
        const totalCost = parseFloat(typedAmount) || amount;
        const oWealthSelected = paymentMethod === "owealth";
        return (
          <div className="bg-gray-150 h-full flex flex-col justify-end text-gray-800 font-sans relative animate-fadeIn select-none bg-slate-950/30">
            {/* Background screen shadow block */}
            <div className="flex-1" onClick={() => setStep("transfer")} />

            {/* Bottom Sheet wrapper */}
            <div className="bg-white rounded-t-[2.5rem] select-none p-5 shadow-2xl relative animate-slideUp border-t border-gray-100 mt-auto">
              <div className="flex justify-between items-center pb-3 border-b border-gray-100 mb-4">
                <h2 className="text-xs font-black uppercase text-gray-400">NIP Debit Authorization</h2>
                <button id="cancel-sheet" onClick={() => setStep("transfer")} className="p-1 text-gray-400 hover:text-gray-900">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Confirmation Details Card */}
              <div className="bg-gray-50 border border-gray-100 p-4 rounded-3xl flex flex-col items-center text-center">
                <span className="text-[9.5px] tracking-widest text-[#00C5A3] font-black uppercase mb-1">Transferring Amount</span>
                <h1 className="text-2xl font-black text-[#00C5A3] mt-1 font-mono">
                  {formatCurrency(totalCost)}
                </h1>
                <div className="divide-y divide-gray-100/60 w-full pt-3.5 text-xs text-slate-700 font-semibold space-y-2">
                  <div className="flex justify-between pt-2">
                    <span className="text-gray-400">Sent To</span>
                    <span className="text-gray-900 font-black">{receiverName}</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-gray-400">Destination</span>
                    <span>{receiverBank}</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-gray-400">NIP Fee Charge</span>
                    <span className="text-emerald-600 font-mono">₦0.00 (Coupon Free)</span>
                  </div>
                </div>
              </div>

              {/* Wallet Select Option (Wallet vs OWealth) */}
              <div className="mt-4 space-y-2.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Set Payment Wallet Method</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    id="select-wallet"
                    type="button"
                    onClick={() => setPaymentMethod("wallet")}
                    className={`p-3 text-left border rounded-2xl flex flex-col transition-all cursor-pointer ${
                      paymentMethod === "wallet"
                        ? "border-[#00C5A3] bg-emerald-50/40 text-emerald-800"
                        : "border-gray-150 bg-white text-gray-500"
                    }`}
                  >
                    <span className="text-[10px] font-black uppercase">OPay Balance</span>
                    <span className="text-xs font-bold font-mono mt-0.5">{formatCurrency(balance)}</span>
                  </button>
                  <button
                    id="select-owealth"
                    type="button"
                    onClick={() => setPaymentMethod("owealth")}
                    className={`p-3 text-left border rounded-2xl flex flex-col transition-all cursor-pointer ${
                      paymentMethod === "owealth"
                        ? "border-[#00C5A3] bg-emerald-50/40 text-emerald-800"
                        : "border-gray-150 bg-white text-gray-500"
                    }`}
                  >
                    <span className="text-[10px] font-black uppercase">OWealth Account</span>
                    <span className="text-xs font-bold font-mono text-emerald-600 mt-0.5">{formatCurrency(balance + 5000)}</span>
                  </button>
                </div>
              </div>

              {/* Insufficient warnings check */}
              {totalCost > balance && (
                <div className="mt-4 bg-rose-50 border border-rose-100/50 p-3 rounded-2xl flex items-start gap-2.5 text-xs text-rose-800">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5 animate-pulse" />
                  <p className="text-[10.5px]">
                    <strong>Balance Warning:</strong> The transfer surpasses OPay Wallet funds coordinates, but simulation continues.
                  </p>
                </div>
              )}

              {/* Execute security pin trigger */}
              <button
                id="opay-execute-transfer"
                onClick={() => {
                  if (bankName === "opay") {
                    setShowReminder(true);
                  } else {
                    handleExecuteTransfer();
                  }
                }}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-[#00C5A3] hover:brightness-105 rounded-2xl font-black text-xs text-white uppercase mt-5 shadow-lg tracking-wider"
              >
                Confirm & Pay Safe
              </button>
            </div>

            {/* Simulated Reminder Modal Popup */}
            {showReminder && (
              <div className="absolute inset-x-4 top-1/3 bg-white border border-gray-100 rounded-3xl p-5 shadow-2xl z-50 text-center space-y-3.5 select-none animate-bounce">
                <div className="h-10 w-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mx-auto">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-black uppercase text-gray-800">Transfer Security Acknowledge</h4>
                <p className="text-[10.5px] text-gray-500 leading-relaxed font-normal">
                  Are you entirely certain of this transfer recipient to <span className="font-bold text-gray-900">{receiverName}</span>? Fraudulent setups will permanently lock bank nodes.
                </p>
                <div className="flex gap-2 text-xs pt-1">
                  <button onClick={() => setShowReminder(false)} className="py-2 px-4 bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-500 font-bold flex-1">
                    Cancel
                  </button>
                  <button onClick={handleExecuteTransfer} className="py-2 px-4 bg-[#00C5A3] text-white font-bold rounded-xl flex-1 hover:brightness-105">
                    Yes, Authorize
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      default:
        // Generic bank authorization confirm
        const sendAmountVal = parseFloat(typedAmount) || amount;
        const processFee = 10.00; // standard NIP charge
        return (
          <div className="bg-slate-900 text-slate-100 h-full flex flex-col justify-between animate-fadeIn">
            <div className="p-4 bg-slate-950 flex justify-between items-center border-b border-slate-900">
              <button id="sim-back-transfer" onClick={() => setStep("transfer")} className="text-gray-400">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-xs font-black uppercase text-gray-300">Authorize transfer</span>
              <span className="w-4" />
            </div>

            <div className="p-6 flex-1 space-y-4">
              <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 text-center space-y-1">
                <span className="text-[8.5px] text-gray-500 uppercase tracking-widest font-black block">Total Authorization amount</span>
                <h1 className="text-3xl font-black font-mono text-cyan-400">{formatCurrency(sendAmountVal)}</h1>
                <p className="text-[10px] text-slate-400 mt-1">NIP Settlement Charge: +{formatCurrency(processFee)} included</p>
              </div>

              {/* Data specifications list */}
              <div className="bg-slate-950 p-4.5 rounded-2xl border border-slate-900/60 text-xs space-y-3 font-semibold">
                <div className="flex justify-between text-slate-400">
                  <span>To Account</span>
                  <span className="text-white">{receiverName}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>To Bank</span>
                  <span className="text-white">{receiverBank}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Reference</span>
                  <span className="text-white italic">{typedRemark || reference}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-950 border-t border-slate-900">
              <button
                id="sim-execute-generic-payment"
                onClick={handleExecuteTransfer}
                className="w-full py-3.5 bg-gradient-to-r from-[#00E5FF] to-blue-500 text-gray-950 font-black rounded-xl text-xs uppercase"
              >
                Sign & Execute Transfer
              </button>
            </div>
          </div>
        );
    }
  };

  // ----------------------------------------------------------------------------------
  // RENDER LOADING SCREEN
  // ----------------------------------------------------------------------------------
  const renderLoadingScreen = () => {
    switch (bankName) {
      case "opay":
        return (
          <div className="bg-white h-full flex flex-col justify-center items-center text-center p-6 animate-fadeIn select-none">
            {/* Spinning hexagon logo indicator */}
            <div className="relative mb-5 flex items-center justify-center">
              <div className="w-16 h-16 rounded-3xl border-4 border-emerald-100 border-t-[#00C5A3] animate-spin" />
              <span className="absolute text-2xl font-black text-[#00C5A3] font-sans">O</span>
            </div>
            <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest">Processing Transaction</h3>
            <p className="text-[10.5px] text-gray-500 mt-1.5 max-w-[200px] leading-relaxed">
              We're securely routing your funds to <span className="font-bold text-gray-900">{receiverName}</span> coordinates. Please do NOT exit app...
            </p>
          </div>
        );
      default:
        return (
          <div className="bg-slate-950 h-full flex flex-col justify-center items-center text-center p-6 text-slate-100">
            <Loader2 className="w-10 h-10 text-cyan-400 animate-spin mb-4" />
            <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest">NIP Node Verification</h3>
            <p className="text-[10.5px] text-slate-400 mt-1.5 max-w-[210px] whitespace-normal">
              Syncing payment milestones and ledger accounts security.
            </p>
          </div>
        );
    }
  };

  // Renders core steps panel
  return (
    <div className="w-full max-w-[360px] h-[580px] border border-slate-800 rounded-[2.5rem] bg-[#0A0D14] shadow-2xl relative overflow-hidden flex flex-col mx-auto">
      {/* Visual Header speaker hole bar container (phone frame bezel) */}
      <div className="absolute top-0 inset-x-0 h-5 bg-slate-950/80 backdrop-blur border-b border-slate-900/40 z-50 flex justify-center items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full bg-slate-800" />
        <span className="w-10 h-1 bg-slate-800 rounded-full" />
      </div>

      <div className="pt-5 flex-1 overflow-hidden relative">
        {step === "splash" && renderSplashScreen()}
        {step === "home" && renderHomeDashboard()}
        {step === "transfer" && renderTransferPage()}
        {step === "confirm" && renderConfirmationPage()}
        {step === "loading" && renderLoadingScreen()}
        {step === "done" && (
          <div className="h-full flex flex-col justify-center items-center p-6 text-center text-white bg-slate-950">
            <div className="h-12 w-12 bg-emerald-500/10 border border-emerald-400 text-emerald-400 rounded-full flex items-center justify-center animate-bounce mb-3">
              <Check className="w-6 h-6" />
            </div>
            <h2 className="text-sm font-black uppercase text-white tracking-wider">Simulation Completed!</h2>
            <p className="text-xs text-gray-400 mt-2 max-w-[220px] leading-relaxed">
              Your customized payment receipt is loaded in StyleHub's workspace. Lift watermark to proceed with Ultra-HD file outputs.
            </p>
            <button
              id="exit-done-simulation"
              onClick={() => {
                setStep("home");
              }}
              className="mt-5 py-2.5 px-6 bg-cyan-505 bg-gradient-to-r from-cyan-400 to-blue-500 text-gray-950 font-black rounded-xl text-xs uppercase"
            >
              Review Simulated steps panel &rarr;
            </button>
          </div>
        )}
      </div>

      {/* Phone Navigation footer home pill */}
      <div className="h-5 bg-slate-950 flex justify-center items-center">
        <span className="w-20 h-1 bg-slate-800 rounded-full" />
      </div>
    </div>
  );
}
