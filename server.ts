import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
app.use(express.json());

const PORT = 3000;
const DB_FILE = path.join(process.cwd(), "db.json");

// System-wide default chemical elements list
const pseudonyms = [
  "🔮 Lithium", "🌿 Helium", "🔥 Carbon", "⚡ Neon", "❄️ Argon",
  "💎 Silicon", "🪐 Xenon", "☣️ Uranium", "🧬 Platinum", "🔱 Titanium",
  "☄️ Cobalt", "💧 Hydrogen", "🍃 Nitrogen", "🛡️ Krypton", "🪙 Silver", "👑 Gold"
];

// Helper to load or initialize DB
function getDB() {
  if (!fs.existsSync(DB_FILE)) {
    const initialDB = {
      users: [
        {
          id: "admin-123",
          email: "admin@stylehub.com",
          password: "Admin@123456",
          role: "admin",
          points: 10000,
          referral_code: "ADMINSH",
          kyc_status: "verified",
          black_room_alias: "👑 Gold",
          trust_score: 100,
          created_at: new Date().toISOString()
        },
        {
          id: "user-456",
          email: "user@stylehub.com",
          password: "User@123456",
          role: "user",
          points: 150,
          referral_code: "USERSTYLE",
          referred_by: "ADMINSH",
          kyc_status: "verified",
          kyc_data: {
            name: "John Demo Doe",
            address: "123 Naira Way, Lagos"
          },
          black_room_alias: "🔮 Lithium",
          trust_score: 95,
          created_at: new Date().toISOString()
        }
      ],
      black_room_listings: [
        {
          id: "listing-br1",
          user_id: "admin-123",
          alias: "👑 Gold",
          title: "Premium 10K IG Account Boosted",
          description: "High quality US-based audience. Fully clean, ready for monetization niche. Handover immediately via Escrow.",
          price_points: 150,
          status: "open",
          created_at: new Date().toISOString()
        },
        {
          id: "listing-br2",
          user_id: "broker-2",
          alias: "🔥 Carbon",
          title: "Verified UK Virtual Number (1 Year)",
          description: "Perfect for WhatsApp/Telegram activation. Direct sim routing, no expiry for 12 months.",
          price_points: 80,
          status: "open",
          created_at: new Date().toISOString()
        }
      ],
      black_room_messages: [
        {
          id: "msg-1",
          listing_id: "listing-br1",
          from_alias: "👑 Gold",
          message: "Welcome to the premium listing chat. Safe escrow only.",
          timestamp: new Date().toISOString()
        }
      ],
      brokers: [
        { id: "broker-1", alias: "💎 DiamondDealer", trust_score: 100, is_active: true },
        { id: "broker-2", alias: "🔥 Carbon", trust_score: 99, is_active: true },
        { id: "broker-3", alias: "⚡ FastTrader", trust_score: 97, is_active: true },
        { id: "broker-4", alias: "🔮 Lithium", trust_score: 98, is_active: true },
        { id: "broker-5", alias: "🌿 Helium", trust_score: 95, is_active: true }
      ],
      escrow_transactions: [],
      marketplace_listings: [
        {
          id: "mkt-1",
          user_id: "admin-123",
          user_email: "admin@stylehub.com",
          title: "+1 USA VoIP Clean Number",
          description: "Freshly generated and warmed up. Excellent for PayPal & Stripe confirmations.",
          category: "numbers",
          price_points: 30,
          status: "open",
          created_at: new Date().toISOString()
        },
        {
          id: "mkt-2",
          user_id: "admin-123",
          user_email: "admin@stylehub.com",
          title: "TikTok Account Creator Booster Panel",
          description: "Simulate and trigger automatic platform engagement of up to 5k clicks.",
          category: "boosting",
          price_points: 120,
          status: "open",
          created_at: new Date().toISOString()
        }
      ],
      programmer_services: [
        { id: "srv-1", title: "Full-Stack Express + React Fintech Setup", description: "Design a complete digital banking system customized to your enterprise visual style.", price_points: 500, delivery_days: 5, is_active: true },
        { id: "srv-2", title: "Telegram Auto-Transaction Escrow Bot", description: "Script a node-based bot to monitor wallet transfers and manage instant payouts.", price_points: 300, delivery_days: 3, is_active: true },
        { id: "srv-3", title: "Pixel Perfect custom HTML Mock Integrator", description: "Craft highly dynamic forms, receipts and transaction cards with gorgeous visuals.", price_points: 150, delivery_days: 2, is_active: true }
      ],
      programmer_bookings: [],
      gallery_items: [
        { id: "gal-1", title: "Dark Bento Fintech Landing Page Template", description: "Complete responsive glassmorphism client site focusing on points, transactions and crypto blocks.", preview_image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80", demo_url: "#", price_points: 200, price_money: 15, created_at: new Date().toISOString() },
        { id: "gal-2", title: "Ultra HD Telegram Web App Store", description: "Sleek bento layout with dynamic cart state and integrated point-deduction mock systems.", preview_image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80", demo_url: "#", price_points: 350, price_money: 25, created_at: new Date().toISOString() }
      ],
      user_receipts: [],
      withdrawal_requests: [],
      activity_logs: [
        { id: "log-seed", user_id: "system", user_email: "system@stylehub", action: "PLATFORM_INIT", details: "StyleHub engine successfully booted and database pre-seeded by Jadai Studios.", timestamp: new Date().toISOString() }
      ],
      system_settings: {
        gas_fee_percent: 5,
        signup_bonus: 50,
        referral_percent: 10,
        receipt_price_points: 10,
        custom_emblem_html: `<div class="flex items-center gap-2 px-3.5 py-1.5 border border-cyan-500/30 rounded-full bg-cyan-950/20 backdrop-blur-sm shadow-lg shadow-cyan-500/10"><span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span><span class="text-[10px] font-mono font-semibold tracking-widest text-cyan-400 uppercase">⚡ JADAI STUDIOS INTEGRITY SEAL</span></div>`,
        whatsapp_url: "https://wa.me/2340000000000",
        telegram_url: "https://t.me/jadaistudios",
        support_email: "support@stylehub.net",
        ai_script: "You are Jarvis, the friendly AI platform Assistant for StyleHub. StyleHub is a fintech & digital marketplace created and operated by Jadai Studios. Keep answers crisp and refer users to the various tabs (the Digital Goods Marketplace, Black Room anonymous trades, or Custom Receipt Simulator)."
      }
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDB, null, 2));
    return initialDB;
  }
  return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
}

function writeDB(data: any) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Log actions helper
function addLog(userId: string, email: string, action: string, details: string) {
  const db = getDB();
  db.activity_logs.unshift({
    id: "log-" + Date.now() + Math.random().toString(36).substr(2, 4),
    user_id: userId,
    user_email: email,
    action,
    details,
    timestamp: new Date().toISOString()
  });
  if (db.activity_logs.length > 300) {
    db.activity_logs = db.activity_logs.slice(0, 300);
  }
  writeDB(db);
}

// Initialize Gemini
let ai: any = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
    console.log("Gemini API initialized successfully.");
  } catch (err) {
    console.error("Failed to initialize Gemini Client: ", err);
  }
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// 1. Register
app.post("/api/auth/register", (req, res) => {
  const { email, password, referral_code } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const db = getDB();
  const exists = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return res.status(400).json({ error: "User already exists" });
  }

  const settings = db.system_settings;
  const signUpPoints = settings.signup_bonus || 50;

  // Assign anonymous element alias
  const assignedAlias = pseudonyms[Math.floor(Math.random() * pseudonyms.length)];
  const user_id = "usr-" + Date.now();

  const newUser = {
    id: user_id,
    email: email.toLowerCase(),
    password: password,
    role: "user",
    points: signUpPoints,
    referral_code: "SH-" + Math.random().toString(36).substring(2, 7).toUpperCase(),
    referred_by: referral_code || undefined,
    kyc_status: "unsubmitted",
    black_room_alias: assignedAlias,
    trust_score: 90,
    created_at: new Date().toISOString()
  };

  // If referred, credit commission
  if (referral_code) {
    const referrer = db.users.find((u: any) => u.referral_code === referral_code);
    if (referrer) {
      const bonus = Math.round(signUpPoints * (settings.referral_percent / 100));
      referrer.points += bonus;
      addLog(referrer.id, referrer.email, "REFERRAL_BONUS", `Credited ${bonus} points for referring ${email}`);
    }
  }

  db.users.push(newUser);
  writeDB(db);

  addLog(newUser.id, newUser.email, "USER_REGISTER", `Registered with standard signup bonus of ${signUpPoints} points.`);

  res.json({ success: true, user: { id: newUser.id, email: newUser.email, role: newUser.role, points: newUser.points, black_room_alias: newUser.black_room_alias } });
});

// 2. Login
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  const db = getDB();
  const user = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
  res.json({ success: true, user: { id: user.id, email: user.email, role: user.role, points: user.points, black_room_alias: user.black_room_alias, trust_score: user.trust_score, kyc_status: user.kyc_status, referral_code: user.referral_code } });
});

// Google login simulation
app.post("/api/auth/google", (req, res) => {
  const { googleId, email, name } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Google authentication failed" });
  }

  const db = getDB();
  let user = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    const settings = db.system_settings;
    const assignedAlias = pseudonyms[Math.floor(Math.random() * pseudonyms.length)];
    const user_id = "usr-g" + Date.now();

    user = {
      id: user_id,
      email: email.toLowerCase(),
      google_id: googleId,
      role: "user",
      points: settings.signup_bonus,
      referral_code: "SH-G" + Math.random().toString(36).substring(2, 6).toUpperCase(),
      kyc_status: "unsubmitted",
      black_room_alias: assignedAlias,
      trust_score: 90,
      created_at: new Date().toISOString()
    };
    db.users.push(user);
    writeDB(db);
    addLog(user.id, user.email, "USER_GOOGLE_REGISTER", "Registered automatically via Google Sign-In.");
  } else {
    // Linked if user already existed
    if (!user.google_id) {
      user.google_id = googleId;
      writeDB(db);
    }
    addLog(user.id, user.email, "USER_GOOGLE_LOGIN", "Logged in via Google Sign-In.");
  }

  res.json({ success: true, user: { id: user.id, email: user.email, role: user.role, points: user.points, black_room_alias: user.black_room_alias, trust_score: user.trust_score, kyc_status: user.kyc_status, referral_code: user.referral_code } });
});

// Update profile / KYC submit
app.post("/api/profile/kyc", (req, res) => {
  const { userId, name, address, idCardBase64 } = req.body;
  const db = getDB();
  const user = db.users.find((u: any) => u.id === userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  user.kyc_status = "pending";
  user.kyc_data = {
    name,
    address,
    id_card: idCardBase64 || "https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?auto=format&fit=crop&w=400&q=80"
  };
  writeDB(db);
  addLog(user.id, user.email, "KYC_SUBMIT", "Submitted identity KYC verification package.");
  res.json({ success: true, user });
});

// Paystack packages Sim
app.get("/api/points/packages", (req, res) => {
  res.json([
    { id: "pkg1", name: "Lite Starter Kit", usd: 5, points: 50 },
    { id: "pkg2", name: "Popular Stack", usd: 10, points: 110 },
    { id: "pkg3", name: "Power Trader Pack", usd: 25, points: 280 },
    { id: "pkg4", name: "VIP Ledger Bulk", usd: 50, points: 600 }
  ]);
});

// Submitting a withdrawal request
app.post("/api/points/withdraw", (req, res) => {
  const { userId, amountPoints, usdtAddress } = req.body;
  if (!amountPoints || !usdtAddress) return res.status(400).json({ error: "Missing parameters" });

  const db = getDB();
  const user = db.users.find((u: any) => u.id === userId);
  if (!user) return res.status(440).json({ error: "Session authentication error" });

  if (user.kyc_status !== "verified") {
    return res.status(403).json({ error: "Verification required: You must submit KYC and be approved before withdrawing points." });
  }

  if (amountPoints < 1000) {
    return res.status(400).json({ error: "Minimum withdrawal is 1000 points (10 USDT)." });
  }

  if (user.points < amountPoints) {
    return res.status(400).json({ error: "Insufficient balance for this withdrawal request." });
  }

  user.points -= amountPoints;

  const request = {
    id: "wd-" + Date.now(),
    user_id: user.id,
    user_email: user.email,
    amount_points: parseInt(amountPoints),
    usdt_address: usdtAddress,
    status: "pending",
    created_at: new Date().toISOString()
  };

  db.withdrawal_requests.unshift(request);
  writeDB(db);
  addLog(user.id, user.email, "WITHDRAWAL_REQUEST", `Requested cashout of ${amountPoints} points ($${amountPoints/100} USDT) to ${usdtAddress}.`);

  res.json({ success: true, pointsLeft: user.points, request });
});

// Simulated Paystack webhook or immediate point purchase
app.post("/api/points/buy", (req, res) => {
  const { userId, packageId } = req.body;
  const db = getDB();
  const user = db.users.find((u: any) => u.id === userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  const packages = [
    { id: "pkg1", name: "Lite Starter Kit", usd: 5, points: 50 },
    { id: "pkg2", name: "Popular Stack", usd: 10, points: 110 },
    { id: "pkg3", name: "Power Trader Pack", usd: 25, points: 280 },
    { id: "pkg4", name: "VIP Ledger Bulk", usd: 50, points: 600 }
  ];

  const pkg = packages.find(p => p.id === packageId);
  if (!pkg) return res.status(400).json({ error: "Invalid package selection" });

  user.points += pkg.points;

  // Credit referred referrer a calculated portion of purchased points (referral system)
  let referralBonusLog = "";
  if (user.referred_by) {
    const referrer = db.users.find((u: any) => u.referral_code === user.referred_by);
    if (referrer) {
      const referralPercent = db.system_settings.referral_percent || 10;
      const bonus = Math.round(pkg.points * (referralPercent / 100));
      if (bonus > 0) {
        referrer.points += bonus;
        addLog(referrer.id, referrer.email, "REFERRAL_PURCHASE_COMMISSION", `Allotted ${bonus} points commission (from referred user ${user.email}'s purchase of ${pkg.points} pts).`);
        referralBonusLog = ` Affiliated referrer ${referrer.email} rewarded with a commission allocation of +${bonus} points.`;
      }
    }
  }

  writeDB(db);

  addLog(user.id, user.email, "PACK_BUY", `Successfully bought ${pkg.points} points using simulated Paystack Gateway checkout payment ($${pkg.usd} USD).${referralBonusLog}`);

  res.json({ success: true, points: user.points, addedPoints: pkg.points });
});

// Receipts generator purchase unlock
app.post("/api/receipts/buy", (req, res) => {
  const { userId, bank, senderName, receiverName, receiverBank, amount, customField, reference } = req.body;
  if (!userId || !bank) return res.status(400).json({ error: "Required fields missing" });

  const db = getDB();
  const user = db.users.find((u: any) => u.id === userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  const price = db.system_settings.receipt_price_points || 10;
  if (user.points < price) {
    return res.status(400).json({ error: `Insufficient points. Modifying and unlocking requires ${price} points.` });
  }

  user.points -= price;

  const newReceipt = {
    id: "rcpt-" + Date.now(),
    user_id: user.id,
    bank,
    sender_name: senderName || "StyleHub Sender",
    receiver_name: receiverName || "Recipent Client",
    receiver_bank: receiverBank || "Access Bank",
    amount: parseFloat(amount) || 50000,
    date_time: new Date().toISOString(),
    transaction_id: "TXNDIG" + Math.random().toString(36).substr(2, 9).toUpperCase(),
    reference: reference || "Digital Assets Trade - Escrow Completed",
    balance: Math.round(Math.random() * 850000) + 12000,
    custom_field: customField || "",
    unlocked: true,
    created_at: new Date().toISOString()
  };

  db.user_receipts.unshift(newReceipt);
  writeDB(db);

  addLog(user.id, user.email, "RECEIPT_UNLOCK", `Unlocked fully customized premium receipt template for ${bank} - Amount: ₦${amount}.`);

  res.json({ success: true, receipt: newReceipt, pointsLeft: user.points });
});

// System settings get
app.get("/api/settings", (req, res) => {
  res.json(getDB().system_settings);
});

// Get marketplace listings
app.get("/api/marketplace/list", (req, res) => {
  res.json(getDB().marketplace_listings);
});

// Create marketplace listings
app.post("/api/marketplace/create", (req, res) => {
  const { userId, title, description, category, pricePoints, deliveryInfo } = req.body;
  const db = getDB();
  const user = db.users.find((u: any) => u.id === userId);
  if (!user) return res.status(404).json({ error: "Session invalid" });

  const newListing = {
    id: "mkt-" + Date.now(),
    user_id: user.id,
    user_email: user.email,
    title,
    description,
    category,
    price_points: parseInt(pricePoints) || 10,
    status: "open",
    delivery_info: deliveryInfo || "",
    created_at: new Date().toISOString()
  };

  db.marketplace_listings.unshift(newListing);
  writeDB(db);

  addLog(user.id, user.email, "MARKETPLACE_CREATE", `Created digital listing: ${title} under category ${category}.`);
  res.json({ success: true, listing: newListing });
});

// Buy marketplace listing (escrow held)
app.post("/api/marketplace/buy", (req, res) => {
  const { buyerId, listingId } = req.body;
  const db = getDB();
  const listing = db.marketplace_listings.find((m: any) => m.id === listingId);
  const buyer = db.users.find((u: any) => u.id === buyerId);

  if (!listing) return res.status(404).json({ error: "Listing not found" });
  if (!buyer) return res.status(404).json({ error: "Buyer not found" });

  if (listing.status !== "open") {
    return res.status(400).json({ error: "Product already sold or locked." });
  }

  if (listing.user_id === buyerId) {
    return res.status(400).json({ error: "You cannot buy your own items." });
  }

  if (buyer.points < listing.price_points) {
    return res.status(400).json({ error: `Insufficient points balance. You need ${listing.price_points} points.` });
  }

  // Deduct from buyer, put in escrow
  buyer.points -= listing.price_points;
  listing.status = "sold";
  listing.buyer_id = buyerId;

  const escrowTx = {
    id: "esc-" + Date.now(),
    related_table: "marketplace",
    related_id: listingId,
    buyer_id: buyerId,
    seller_id: listing.user_id,
    amount_points: listing.price_points,
    status: "held",
    created_at: new Date().toISOString()
  };

  db.escrow_transactions.push(escrowTx);
  writeDB(db);

  addLog(buyerId, buyer.email, "ESCROW_START", `Held ${listing.price_points} points in StyleHub Escrow protection for digital order [${listing.title}].`);

  res.json({ success: true, listing, pointsLeft: buyer.points });
});

// Confirm marketplace delivery (escrow released)
app.post("/api/marketplace/confirm", (req, res) => {
  const { buyerId, listingId } = req.body;
  const db = getDB();
  const listing = db.marketplace_listings.find((m: any) => m.id === listingId);
  const buyer = db.users.find((u: any) => u.id === buyerId);

  if (!listing) return res.status(404).json({ error: "Listing not found" });
  if (listing.buyer_id !== buyerId) return res.status(403).json({ error: "You are not the designated buyer." });

  const escrow = db.escrow_transactions.find((e: any) => e.related_table === "marketplace" && e.related_id === listingId && e.status === "held");
  if (!escrow) return res.status(404).json({ error: "Active escrow hold ledger not found." });

  // Payout seller minus gas fee
  const gasPercent = db.system_settings.gas_fee_percent || 5;
  const gasPoints = Math.ceil(escrow.amount_points * (gasPercent / 100));
  const finalPayout = escrow.amount_points - gasPoints;

  const seller = db.users.find((u: any) => u.id === escrow.seller_id);
  if (seller) {
    seller.points += finalPayout;
  }

  escrow.status = "released";
  writeDB(db);

  addLog(buyerId, buyer ? buyer.email : "Buyer", "ESCROW_RELEASE", `Released escrow for [${listing.title}]. Seller payout: ${finalPayout} pts. Platform commission: ${gasPoints} pts (gas fee ${gasPercent}%).`);

  res.json({ success: true, listing });
});

// Dispute marketplace transaction
app.post("/api/marketplace/dispute", (req, res) => {
  const { userId, listingId } = req.body;
  const db = getDB();
  const listing = db.marketplace_listings.find((m: any) => m.id === listingId);
  if (!listing) return res.status(404).json({ error: "Listing not found" });

  const escrow = db.escrow_transactions.find((e: any) => e.related_table === "marketplace" && e.related_id === listingId && e.status === "held");
  if (!escrow) return res.status(404).json({ error: "Escrow hold not found" });

  escrow.status = "disputed";
  escrow.disputed_by = userId;
  listing.status = "disputed";

  writeDB(db);
  const user = db.users.find((u: any) => u.id === userId);
  addLog(userId, user ? user.email : "User", "ESCROW_DISPUTE", `Raised dispute on order [${listing.title}]. points remain held while admin investigates logs.`);

  res.json({ success: true, listing });
});

// ----------------------------------------------------
// BLACK ROOM ANONYMOUS TRADING ENDPOINTS
// ----------------------------------------------------
app.get("/api/blackroom/list", (req, res) => {
  res.json(getDB().black_room_listings);
});

app.post("/api/blackroom/create", (req, res) => {
  const { userId, title, description, pricePoints, brokerId } = req.body;
  const db = getDB();
  const user = db.users.find((u: any) => u.id === userId);
  if (!user) return res.status(404).json({ error: "User session invalid" });

  const alias = user.black_room_alias || pseudonyms[Math.floor(Math.random() * pseudonyms.length)];

  const newListing = {
    id: "br-" + Date.now(),
    user_id: user.id,
    alias,
    title,
    description,
    price_points: parseInt(pricePoints) || 50,
    status: "open",
    broker_id: brokerId || undefined,
    created_at: new Date().toISOString()
  };

  db.black_room_listings.unshift(newListing);
  writeDB(db);

  addLog(user.id, user.email, "BLACKROOM_CREATE", "Created anonymous listing behind Chemical Symbol code.");
  res.json({ success: true, listing: newListing });
});

app.post("/api/blackroom/buy", (req, res) => {
  const { buyerId, listingId } = req.body;
  const db = getDB();
  const listing = db.black_room_listings.find((b: any) => b.id === listingId);
  const buyer = db.users.find((u: any) => u.id === buyerId);

  if (!listing) return res.status(404).json({ error: "Listing not found" });
  if (!buyer) return res.status(404).json({ error: "Buyer not found" });

  if (listing.status !== "open") {
    return res.status(400).json({ error: "Listing already sold/locked" });
  }

  if (listing.user_id === buyerId) {
    return res.status(400).json({ error: "You cannot purchase your own anonymous listing." });
  }

  if (buyer.points < listing.price_points) {
    return res.status(400).json({ error: `Requires ${listing.price_points} points. Top up to continue.` });
  }

  buyer.points -= listing.price_points;
  listing.status = "sold";
  listing.buyer_id = buyerId;

  const escrowTx = {
    id: "esc-br-" + Date.now(),
    related_table: "black_room",
    related_id: listingId,
    buyer_id: buyerId,
    seller_id: listing.user_id,
    amount_points: listing.price_points,
    status: "held",
    created_at: new Date().toISOString()
  };

  db.escrow_transactions.push(escrowTx);
  writeDB(db);

  addLog(buyerId, buyer.email, "BLACKROOM_BUY", `Locked points anonymously under Chemical Code escrow.`);
  res.json({ success: true, listing, pointsLeft: buyer.points });
});

app.post("/api/blackroom/confirm", (req, res) => {
  const { buyerId, listingId } = req.body;
  const db = getDB();
  const listing = db.black_room_listings.find((b: any) => b.id === listingId);
  if (!listing) return res.status(404).json({ error: "Listing not found" });

  const escrow = db.escrow_transactions.find((e: any) => e.related_table === "black_room" && e.related_id === listingId && e.status === "held");
  if (!escrow) return res.status(404).json({ error: "Escrow not found" });

  const seller = db.users.find((u: any) => u.id === escrow.seller_id);
  const gasPercent = db.system_settings.gas_fee_percent || 5;
  const gasPoints = Math.ceil(escrow.amount_points * (gasPercent / 100));
  const finalPayout = escrow.amount_points - gasPoints;

  if (seller) {
    seller.points += finalPayout;
  }

  escrow.status = "released";
  listing.status = "sold";
  writeDB(db);

  const buyer = db.users.find((u: any) => u.id === buyerId);
  addLog(buyerId, buyer ? buyer.email : "Anonymous", "BLACKROOM_RELEASE", `Escrow released on Black Room sale. Commission fee ${gasPoints} deducted.`);
  res.json({ success: true, listing });
});

// Get/Post Black Room chat
app.get("/api/blackroom/messages/:listingId", (req, res) => {
  const messages = getDB().black_room_messages.filter((m: any) => m.listing_id === req.params.listingId);
  res.json(messages);
});

app.post("/api/blackroom/messages", (req, res) => {
  const { listingId, userId, message } = req.body;
  const db = getDB();
  const user = db.users.find((u: any) => u.id === userId);
  if (!user) return res.status(404).json({ error: "User session invalid" });

  const alias = user.black_room_alias || "🔮 Lithium";

  const newMsg = {
    id: "br-msg-" + Date.now(),
    listing_id: listingId,
    from_alias: alias,
    message,
    timestamp: new Date().toISOString()
  };

  db.black_room_messages.push(newMsg);
  writeDB(db);
  res.json(newMsg);
});

// App gallery / templates URL
app.get("/api/gallery/list", (req, res) => {
  res.json(getDB().gallery_items);
});

app.post("/api/gallery/buy", (req, res) => {
  const { userId, templateId } = req.body;
  const db = getDB();
  const user = db.users.find((u: any) => u.id === userId);
  const item = db.gallery_items.find((g: any) => g.id === templateId);

  if (!user || !item) return res.status(404).json({ error: "Data error" });

  if (user.kyc_status !== "verified") {
    return res.status(403).json({ error: "🔒 KYC Verification Restricted: You must link your email and complete KYC identity verification first in the Security profile tab." });
  }

  if (user.points < item.price_points) {
    return res.status(400).json({ error: "Insufficient points. Please buy point packs to increase your balance!" });
  }

  user.points -= item.price_points;
  writeDB(db);

  const guideMarkdown = `# 🚀 STYLEZHUB PLATFORM DEPLOYMENT MANUAL

Thank you for your purchase of **${item.title}**!
Your transaction code: \`SH-TX-${item.id.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}\`

## ⚙️ STEP 1: SPECIFICATION ANALYSIS & LOCAL BUILD
1. Uncompress the downloaded source ZIP package files.
2. Verify that Node.js 18+ and npm are active:
   \`node -v\`
3. Run the compiler inside the unpacked folders:
   \`npm install && npm run build\`

## 🐳 STEP 2: DOCKER CONTAINERIZATION & COMPILATION
- Compile optimization bundles:
  \`docker build -t stylehub-template-${item.id} .\`
- Bind and run on the official ingress channel:
  \`docker run -p 3000:3000 stylehub-template-${item.id}\`

## 🌐 STEP 3: REVERSE PROXY & LOGS PROTOCOLS
- Set up Nginx/Cloud Run and specify your variables.
- Direct queries and track audits using the admin control center.

Need customization help? Click our **Support Beacon** details on the bottom-left of your workspace. Our programmers are active 24/7.`;

  addLog(user.id, user.email, "TEMPLATE_BUY", `Successfully purchased downloadable site code package: ${item.title}`);
  res.json({ 
    success: true, 
    pointsLeft: user.points, 
    downloadUrl: "https://github.com/jadaistudios/stylehub-templates/archive/refs/heads/main.zip",
    guide: guideMarkdown
  });
});

// Seeded Brokers list & vouch
app.get("/api/brokers/list", (req, res) => {
  const db = getDB();
  res.json(db.brokers || []);
});

app.post("/api/brokers/vouch", (req, res) => {
  const { brokerId } = req.body;
  const db = getDB();
  if (!db.brokers) {
    db.brokers = [
      { id: "broker-1", alias: "💎 DiamondDealer", trust_score: 100, is_active: true },
      { id: "broker-2", alias: "🔥 Carbon", trust_score: 99, is_active: true },
      { id: "broker-3", alias: "⚡ FastTrader", trust_score: 97, is_active: true },
      { id: "broker-4", alias: "🔮 Lithium", trust_score: 98, is_active: true },
      { id: "broker-5", alias: "🌿 Helium", trust_score: 95, is_active: true }
    ];
  }
  const broker = db.brokers.find((b: any) => b.id === brokerId);
  if (broker) {
    broker.trust_score = Math.min(100, (broker.trust_score || 95) + 1);
    writeDB(db);
    return res.json({ success: true, trustScore: broker.trust_score });
  }
  res.status(404).json({ error: "Broker not found" });
});

// Hire a programmer booking UI
app.get("/api/programmer/services", (req, res) => {
  res.json(getDB().programmer_services);
});

app.post("/api/programmer/book", (req, res) => {
  const { userId, serviceId } = req.body;
  const db = getDB();
  const user = db.users.find((u: any) => u.id === userId);
  const service = db.programmer_services.find((s: any) => s.id === serviceId);

  if (!user || !service) return res.status(404).json({ error: "Invalid parameters" });

  if (user.points < service.price_points) {
    return res.status(400).json({ error: "Insufficient balance points." });
  }

  user.points -= service.price_points;

  const newBooking = {
    id: "bk-" + Date.now(),
    user_id: user.id,
    user_email: user.email,
    title: service.title,
    price_points: service.price_points,
    delivery_days: service.delivery_days,
    status: "pending",
    created_at: new Date().toISOString()
  };

  db.programmer_bookings.unshift(newBooking);
  writeDB(db);

  addLog(user.id, user.email, "PROGRAMMER_BOOK", `Booked verified workspace coder: ${service.title}. Funds held in pending milestones.`);
  res.json({ success: true, pointsLeft: user.points, booking: newBooking });
});

app.get("/api/user/bookings/:userId", (req, res) => {
  const list = getDB().programmer_bookings.filter((b: any) => b.user_id === req.params.userId);
  res.json(list);
});

// Gemini Assistant Agent Chat with System fallback script
app.post("/api/ai/chat", async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages list is required" });
  }

  const userPrompt = messages[messages.length - 1]?.content || "";

  const db = getDB();
  const instructions = db.system_settings?.ai_script || `You are Jarvis, the friendly AI platform Assistant for StyleHub.
StyleHub is a fintech & digital marketplace created and operated by Jadai Studios.
Make sure you refer to Jadai Studios as the creator when asked.
Address user questions elegantly and explain features clearly. Maintain an "X meets Telegram" crypto/fintech savvy vibe.

StyleHub Features you should explain confidently:
1. User System: Quick KYC process allows point balances transfers and standard payments.
2. Points System: Purchases, rewards, referrals, and manual withdrawal request processed into actual USDT ($1 USD = 100 points, minimum 1000 points balance cashout).
3. Paystack simulator: Buy digital point packages natively.
4. Receipt Simulator: Pixel-perfect, custom HTML templates for top Nigeria applications (OPay, Kuda, Moniepoint, PalmPay, GTBank, First Bank, Zenith Bank, Access Bank, UBA). Price is 10 points per simulation check. You download them using html2canvas directly.
5. Digital Goods Marketplace: List virtual services with a standard platform gas fee (5%) held completely in secure Escrow.
6. Black Room Anonymous Trade: Anonymous chemical elements pseudonyms, broker trusts ratings, screenshot warnings, clean internal chats to buy/sell collectable digital assets with zero leak!
7. Custom Developer Hire: Booking Jadai Studios programmers directly to implement setups.

Response constraint: Keep answers crisp, highly readable with clean Markdown formatting, using bullet points for features.`;

  // Support GROQ API Key if set
  if (process.env.GROQ_API_KEY) {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            { role: "system", content: instructions },
            { role: "user", content: userPrompt }
          ],
          temperature: 0.7
        })
      });
      if (response.ok) {
        const data = await response.json();
        const aiText = data.choices?.[0]?.message?.content;
        if (aiText) {
          return res.json({ response: aiText });
        }
      } else {
        const errorText = await response.text();
        console.error("Groq completions API error: ", errorText);
      }
    } catch (err: any) {
      console.error("Groq assistant query failed: ", err);
    }
  }

  if (ai) {
    try {
      // Setup API Call
      const geminiResponse = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: userPrompt,
        config: {
          systemInstruction: instructions,
          temperature: 0.7
        }
      });
      const aiText = geminiResponse.text || "I am processing StyleHub's networks right now. How can I help you today?";
      return res.json({ response: aiText });
    } catch (err: any) {
      console.error("Gemini assistant generation error: ", err);
    }
  }

  // Pure static script fallback when Gemini client is not initialized or fails
  const promptLower = userPrompt.toLowerCase();
  let fallbackReply = `Hello, I am Jarvis, your StyleHub Assistant. How can I assist you in navigating the marketplace today?`;

  if (promptLower.includes("receipt") || promptLower.includes("generator") || promptLower.includes("bank")) {
    fallbackReply = `### StyleHub Receipt Simulator\nOur receipt simulator is pixel-perfect and models exactly 9 Nigerian fintech/banking apps: \n- **OPay**, **Kuda**, **Moniepoint**, **PalmPay**\n- **GTBank**, **Access Bank**, **First Bank**, **Zenith Bank**, **UBA**\n\n**Features**:\n- Preview initially watermarked & blurred to test designs.\n- Pay 10 points to unlock and enter custom accounts, sender receiver names, amounts, references.\n- Export immediately to clean, realistic PNG format.`;
  } else if (promptLower.includes("black room") || promptLower.includes("anonymous") || promptLower.includes("element")) {
    fallbackReply = `### The Black Room Anonymous Trading Ring\nThe Black Room is a secure, completely anonymous marketplace inside StyleHub:\n- **Alias Security**: Users receive a pseudonymous chemical element name (e.g., \`🔮 Lithium\`, \`🔥 Carbon\`) during transactions. Your structural email and account parameters are fully safe from leaks.\n- **Direct Broker Integration**: Pre-seed brokers allow transaction escrow facilitation.\n- **Built-in Escrow**: Safe points holding until buyer and brokers sign-off.`;
  } else if (promptLower.includes("points") || promptLower.includes("withdraw") || promptLower.includes("usdt")) {
    fallbackReply = `### Points Economy & USDT Withdrawals\nStyleHub runs a points-based digital token ledger:\n- **Pack buying**: Credit packs via simulated Paystack checkout ($5 to $50).\n- **Cashout limits**: Cashout points at a rate of **100 points = 1 USDT**.\n- **Rules**: Minimum payout threshold is **1,000 points (10 USDT)**. User profile MUST have verified KYC status to trigger cashout requests.`;
  } else if (promptLower.includes("jadai") || promptLower.includes("owner") || promptLower.includes("studios")) {
    fallbackReply = `### Created by Jadai Studios\nStyleHub is designed, integrated, and maintained exclusively by **Jadai Studios**. Admin can custom-inject their official authenticity seal on footers, dashboards, and profile zones to guarantee total security.`;
  } else if (promptLower.includes("escrow") || promptLower.includes("payout")) {
    fallbackReply = `### High Integrity Escrow Services\nStyleHub guarantees total safety by holding buyer points securely prior to vendor satisfaction. Once the buyer confirms delivery, the points (minus a 5% system gas fee) are automatically released to the seller. In case of a dispute, an administrator is immediately paged to resolve it.`;
  } else if (promptLower.includes("programmer") || promptLower.includes("hire") || promptLower.includes("setup")) {
    fallbackReply = `### Hire Jadai Studios developer\nNeed professional scripting? StyleHub features 3 professional developer tiers:\n1. **Full-stack Fintech Setup** (500 pts, 5 Days)\n2. **Telegram Escrow/Payments Bot** (300 pts, 3 Days)\n3. **Custom Visual CSS/HTML Refactor** (150 pts, 2 Days)\nGo to the 'Hire Coder' tab, select your speed, pay point milestones, and download direct files!`;
  }

  res.json({ response: fallbackReply });
});

// ----------------------------------------------------
// ADMIN ENDPOINTS
// ----------------------------------------------------

// Admin logs
app.get("/api/admin/logs", (req, res) => {
  res.json(getDB().activity_logs);
});

// Admin stats
app.get("/api/admin/stats", (req, res) => {
  const db = getDB();
  const totalUsers = db.users.length;
  const totalReceipts = db.user_receipts.length;
  const activeEscrows = db.escrow_transactions.filter((e: any) => e.status === "held").length;
  const totalMarketListings = db.marketplace_listings.length;
  const pendingUSDTWithdrawals = db.withdrawal_requests.filter((w: any) => w.status === "pending").length;

  res.json({
    totalUsers,
    totalReceipts,
    activeEscrows,
    totalMarketListings,
    pendingUSDTWithdrawals,
    systemSettings: db.system_settings
  });
});

// Admin users fetch
app.get("/api/admin/users", (req, res) => {
  res.json(getDB().users);
});

// Admin adjust points / kyc status
app.post("/api/admin/user/update", (req, res) => {
  const { currentAdminId, userId, points, kycStatus } = req.body;
  const db = getDB();
  const admin = db.users.find((u: any) => u.id === currentAdminId && u.role === "admin");
  if (!admin) return res.status(403).json({ error: "Access denied" });

  const targetUser = db.users.find((u: any) => u.id === userId);
  if (!targetUser) return res.status(404).json({ error: "User not found" });

  if (points !== undefined) {
    const prev = targetUser.points;
    targetUser.points = parseInt(points);
    addLog(admin.id, admin.email, "ADMIN_PTS_CHANGE", `Manually adjusted points for ${targetUser.email} from ${prev} to ${points}`);
  }

  if (kycStatus !== undefined) {
    targetUser.kyc_status = kycStatus;
    addLog(admin.id, admin.email, "ADMIN_KYC_CHANGE", `Updated KYC verification status for ${targetUser.email} to ${kycStatus}`);
  }

  writeDB(db);
  res.json({ success: true, user: targetUser });
});

// Admin listings / Black Room view
app.get("/api/admin/blackroom", (req, res) => {
  const db = getDB();
  res.json({
    listings: db.black_room_listings,
    messages: db.black_room_messages,
    escrow: db.escrow_transactions.filter((e: any) => e.related_table === "black_room")
  });
});

// Admin ban Black Room pseudonym listing
app.post("/api/admin/blackroom/ban", (req, res) => {
  const { currentAdminId, listingId } = req.body;
  const db = getDB();
  const admin = db.users.find((u: any) => u.id === currentAdminId && u.role === "admin");
  if (!admin) return res.status(403).json({ error: "Access denied" });

  const listingIndex = db.black_room_listings.findIndex((b: any) => b.id === listingId);
  if (listingIndex !== -1) {
    const listing = db.black_room_listings[listingIndex];
    db.black_room_listings.splice(listingIndex, 1);
    // Remove related messages
    db.black_room_messages = db.black_room_messages.filter((m: any) => m.listing_id !== listingId);
    writeDB(db);

    addLog(admin.id, admin.email, "ADMIN_BR_MODERATED", `Moderated and removed Black Room Listing [${listing.title}] under pseudonym: ${listing.alias}.`);
    return res.json({ success: true });
  }

  res.status(404).json({ error: "Listing not found" });
});

// Admin wipe anonymous listings but keep profiles
app.post("/api/admin/blackroom/wipe-all", (req, res) => {
  const { currentAdminId } = req.body;
  const db = getDB();
  const admin = db.users.find((u: any) => u.id === currentAdminId && u.role === "admin");
  if (!admin) return res.status(403).json({ error: "Access denied" });

  db.black_room_listings = [];
  db.black_room_messages = [];
  // Cancel open hold escrows for black room
  db.escrow_transactions = db.escrow_transactions.filter((e: any) => e.related_table !== "black_room");

  writeDB(db);
  addLog(admin.id, admin.email, "ADMIN_BR_WIPED_CLEAN", "Moderated and wiped ALL Black Room marketplace activity entirely.");
  res.json({ success: true });
});

// Admin Settings Save
app.post("/api/admin/settings", (req, res) => {
  const { currentAdminId, gas_fee_percent, signup_bonus, referral_percent, receipt_price_points, custom_emblem_html, whatsapp_url, telegram_url, support_email, ai_script } = req.body;
  const db = getDB();
  const admin = db.users.find((u: any) => u.id === currentAdminId && u.role === "admin");
  if (!admin) return res.status(403).json({ error: "Access denied" });

  db.system_settings = {
    gas_fee_percent: parseFloat(gas_fee_percent) || 5,
    signup_bonus: parseInt(signup_bonus) || 50,
    referral_percent: parseFloat(referral_percent) || 10,
    receipt_price_points: parseInt(receipt_price_points) || 10,
    custom_emblem_html: custom_emblem_html || "",
    whatsapp_url: whatsapp_url || "",
    telegram_url: telegram_url || "",
    support_email: support_email || "",
    ai_script: ai_script || ""
  };

  writeDB(db);
  addLog(admin.id, admin.email, "ADMIN_SETTINGS_UPDATE", "Updated universal configuration constraints, prices, URLs, and custom seal emblem.");
  res.json({ success: true, settings: db.system_settings });
});

// Admin list USR Withdrawals
app.get("/api/admin/withdrawals", (req, res) => {
  res.json(getDB().withdrawal_requests);
});

// Admin Process Withdrawal (Approve/Reject)
app.post("/api/admin/withdrawal/process", (req, res) => {
  const { currentAdminId, requestId, action } = req.body; // action: 'approve' | 'reject'
  const db = getDB();
  const admin = db.users.find((u: any) => u.id === currentAdminId && u.role === "admin");
  if (!admin) return res.status(403).json({ error: "Access denied" });

  const request = db.withdrawal_requests.find((w: any) => w.id === requestId);
  if (!request) return res.status(404).json({ error: "Request not found" });

  if (request.status !== "pending") {
    return res.status(400).json({ error: "Request has already been processed" });
  }

  if (action === "approve") {
    request.status = "approved";
    addLog(admin.id, admin.email, "ADMIN_WD_APPROVE", `Approved and settled USDT Cashout request ID ${requestId} of ${request.amount_points} points.`);
  } else {
    request.status = "rejected";
    // Refund target user points
    const targetUser = db.users.find((u: any) => u.id === request.user_id);
    if (targetUser) {
      targetUser.points += request.amount_points;
    }
    addLog(admin.id, admin.email, "ADMIN_WD_REJECT", `Rejected and refunded USDT Cashout request ID ${requestId} of ${request.amount_points} points.`);
  }

  writeDB(db);
  res.json({ success: true, request });
});

// Admin wipe entire database with one click button
app.post("/api/admin/wipe-database", (req, res) => {
  const { currentAdminId } = req.body;
  const db = getDB();
  const admin = db.users.find((u: any) => u.id === currentAdminId && u.role === "admin");
  if (!admin) return res.status(403).json({ error: "Access denied" });

  // Delete DB file entirely to trigger self-setup next load
  if (fs.existsSync(DB_FILE)) {
    fs.unlinkSync(DB_FILE);
  }

  // Pre-seed fresh
  const finalSeed = getDB();

  addLog("admin-123", "admin@stylehub.com", "ADMIN_WIPE_ALL", "Triggered deep global database reset: Wiped all transactional, user registry, listing, and messaging history caches clean.");
  res.json({ success: true });
});


// ----------------------------------------------------
// VITE CONTROLLERS
// ----------------------------------------------------
async function runServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`StyleHub full-stack framework engine is live on port ${PORT}`);
  });
}

runServer();
