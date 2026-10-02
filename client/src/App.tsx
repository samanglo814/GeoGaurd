import { FormEvent, ReactNode, useEffect, useState } from "react";

type Page =
  | "dashboard"
  | "transactions"
  | "alerts"
  | "details"
  | "geographic";

type IconName =
  | "grid"
  | "card"
  | "alert"
  | "map"
  | "shield"
  | "search"
  | "bell"
  | "chevron"
  | "arrow"
  | "clock"
  | "pin"
  | "route"
  | "logout"
  | "check"
  | "filter"
  | "download"
  | "close"
  | "user";

const iconPaths: Record<IconName, ReactNode> = {
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </>
  ),
  card: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
      <path d="M2.5 10h19M7 15h3" />
    </>
  ),
  alert: (
    <>
      <path d="M10.2 4.1 2.5 17.4a2 2 0 0 0 1.7 3h15.6a2 2 0 0 0 1.7-3L13.8 4.1a2.1 2.1 0 0 0-3.6 0Z" />
      <path d="M12 9v4.2M12 17h.01" />
    </>
  ),
  map: (
    <>
      <path d="m3 6 5-3 8 3 5-3v15l-5 3-8-3-5 3V6Z" />
      <path d="M8 3v15M16 6v15" />
    </>
  ),
  shield: <path d="M12 2.5 20 6v5.7c0 4.9-3.4 8.2-8 9.8-4.6-1.6-8-4.9-8-9.8V6l8-3.5Z" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m16.5 16.5 4 4" />
    </>
  ),
  bell: (
    <>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </>
  ),
  chevron: <path d="m9 18 6-6-6-6" />,
  arrow: (
    <>
      <path d="M5 12h14" />
      <path d="m14 7 5 5-5 5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  pin: (
    <>
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  route: (
    <>
      <circle cx="6" cy="18" r="2" />
      <circle cx="18" cy="6" r="2" />
      <path d="M7.5 16.5c4-4-1-5 3-8s5 1 6-1" />
    </>
  ),
  logout: (
    <>
      <path d="M10 4H5v16h5M14 8l4 4-4 4M18 12H9" />
    </>
  ),
  check: <path d="m5 12 4.2 4.2L19 6.5" />,
  filter: (
    <>
      <path d="M4 6h16M7 12h10M10 18h4" />
    </>
  ),
  download: (
    <>
      <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 20h16" />
    </>
  ),
  close: <path d="M6 6l12 12M18 6 6 18" />,
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </>
  ),
};

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {iconPaths[name]}
    </svg>
  );
}
type Transaction = {
  transactionId: string;
  amountSpent: number;
  transactionType: string;
  transactionTimestamp: string;
  scenarioType: string;
  simulatedFraudLabel: boolean;

  merchantInfo: {
    merchantName: string;
    merchantCity: string;
    merchantCountry: string;
    merchantLatitude: number;
    merchantLongitude: number;
  };

  deviceInfo: {
    deviceCity: string;
    deviceCountry: string;
    deviceLatitude: number;
    deviceLongitude: number;
    accuracyMeters: number;
    deviceTimestamp: string;
  };
};

const transactions = [
  {
    id: "TXN-845291",
    merchant: "Apple Store",
    initials: "AP",
    amount: "$2,499.00",
    type: "Online purchase",
    time: "Today, 10:42 AM",
    location: "London, UK",
    risk: "High",
    reason: "Impossible travel",
  },
  {
    id: "TXN-845290",
    merchant: "Whole Foods Market",
    initials: "WF",
    amount: "$128.42",
    type: "Card payment",
    time: "Today, 9:18 AM",
    location: "New York, US",
    risk: "Safe",
    reason: "Normal activity",
  },
  {
    id: "TXN-845289",
    merchant: "Lufthansa",
    initials: "LH",
    amount: "$1,840.00",
    type: "Online purchase",
    time: "Today, 8:57 AM",
    location: "Berlin, DE",
    risk: "Medium",
    reason: "Travel time review",
  },
  {
    id: "TXN-845288",
    merchant: "Amazon",
    initials: "AM",
    amount: "$74.90",
    type: "Online purchase",
    time: "Yesterday, 6:24 PM",
    location: "Boston, US",
    risk: "Safe",
    reason: "Normal activity",
  },
  {
    id: "TXN-845287",
    merchant: "CryptoHub Exchange",
    initials: "CH",
    amount: "$5,200.00",
    type: "Wire transfer",
    time: "Yesterday, 3:08 PM",
    location: "Lagos, NG",
    risk: "High",
    reason: "Impossible travel",
  },
  {
    id: "TXN-845286",
    merchant: "Shell",
    initials: "SH",
    amount: "$62.17",
    type: "Card payment",
    time: "Yesterday, 12:41 PM",
    location: "Brooklyn, US",
    risk: "Safe",
    reason: "Normal activity",
  },
];

function RiskBadge({ risk }: { risk: string }) {
  return (
    <span className={`risk-badge risk-${risk.toLowerCase()}`}>
      <span className="risk-dot" />
      {risk === "Safe" ? "Low risk" : `${risk} risk`}
    </span>
  );
}

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="logo-mark">
        <Icon name="shield" size={22} />
        <span />
      </div>
      <div>
        <div className="text-[19px] font-extrabold tracking-[-.03em] text-white">
          Geo<span className="text-blue-400">Guard</span>
        </div>
        <div className="text-[9px] font-bold uppercase tracking-[.22em] text-slate-500">
          Fraud Intelligence
        </div>
      </div>
    </div>
  );
}

function Login({ onLogin }: { onLogin: () => void }) {
  const submit = (event: FormEvent) => {
    event.preventDefault();
    onLogin();
  };

  return (
    <main className="login-shell">
      <div className="login-glow login-glow-one" />
      <div className="login-glow login-glow-two" />
      <section className="login-panel">
        <Logo />
        <div className="mt-16 max-w-xl">
          <span className="eyebrow">Intelligence at every coordinate</span>
          <h1 className="mt-6 text-5xl font-extrabold leading-[1.08] tracking-[-.045em] text-white md:text-[64px]">
            Stop fraud
            <br />
            before it <span className="text-gradient">travels.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-400">
            Real-time geographic intelligence that protects every transaction,
            everywhere your customers go.
          </p>
        </div>
        <div className="mt-auto grid grid-cols-3 gap-8 border-t border-white/10 pt-8">
          {[
            ["Real time", "Timestamp analysis"],
            ["Global", "Location comparison"],
            ["180+", "Countries covered"],
          ].map(([value, label]) => (
            <div key={label}>
              <div className="text-xl font-bold text-white">{value}</div>
              <div className="mt-1 text-xs text-slate-500">{label}</div>
            </div>
          ))}
        </div>
      </section>
      <section className="login-form-wrap">
        <form className="login-card" onSubmit={submit}>
          <div className="mb-9 block lg:hidden">
            <Logo />
          </div>
          <div className="mb-9">
            <h2 className="text-3xl font-bold tracking-[-.03em] text-slate-950">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Sign in to your security command center
            </p>
          </div>
          <label className="field-label" htmlFor="email">
            Work email
          </label>
          <div className="input-wrap">
            <Icon name="user" size={17} />
            <input
              id="email"
              type="email"
              defaultValue="alex@geoguard.io"
              aria-label="Work email"
            />
          </div>
          <div className="mt-5 flex items-center justify-between">
            <label className="field-label" htmlFor="password">
              Password
            </label>
            <button type="button" className="text-xs font-bold text-blue-600">
              Forgot password?
            </button>
          </div>
          <div className="input-wrap">
            <Icon name="shield" size={17} />
            <input
              id="password"
              type="password"
              defaultValue="geoguarddemo"
              aria-label="Password"
            />
          </div>
          <button className="primary-btn mt-7 w-full justify-center" type="submit">
            Sign in securely <Icon name="arrow" />
          </button>
          <p className="mt-7 text-center text-xs text-slate-400">
            Protected by enterprise-grade encryption
          </p>
        </form>
      </section>
    </main>
  );
}

const navItems: { page: Page; label: string; icon: IconName }[] = [
  { page: "dashboard", label: "Overview", icon: "grid" },
  { page: "transactions", label: "Transactions", icon: "card" },
  { page: "alerts", label: "Fraud Alerts", icon: "alert" },
  { page: "geographic", label: "Geographic Analysis", icon: "map" },
];

function Sidebar({
  page,
  setPage,
  onLogout,
}: {
  page: Page;
  setPage: (page: Page) => void;
  onLogout: () => void;
}) {
  return (
    <aside className="sidebar">
      <div className="px-5 py-7">
        <Logo />
      </div>
      <nav className="mt-5 flex-1 px-3">
        <p className="nav-label">Workspace</p>
        {navItems.map((item) => (
          <button
            key={item.page}
            onClick={() => setPage(item.page)}
            className={`nav-item ${
              page === item.page ||
              (page === "details" && item.page === "transactions")
                ? "active"
                : ""
            }`}
          >
            <Icon name={item.icon} />
            <span>{item.label}</span>
            {item.page === "alerts" && <b>3</b>}
          </button>
        ))}
      </nav>
      <div className="mx-4 mb-5 rounded-xl border border-blue-400/15 bg-blue-500/8 p-4">
        <div className="mb-3 flex items-center gap-2 text-xs font-bold text-blue-300">
          <span className="status-pulse" />
          All systems operational
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-[92%] rounded-full bg-blue-400" />
        </div>
        <p className="mt-2 text-[10px] text-slate-500">Network health · 99.99%</p>
      </div>
      <button className="profile-block" onClick={onLogout}>
        <div className="avatar">AM</div>
        <div className="min-w-0 flex-1 text-left">
          <div className="truncate text-xs font-bold text-white">Alex Morgan</div>
          <div className="truncate text-[10px] text-slate-500">Security Admin</div>
        </div>
        <Icon name="logout" size={16} />
      </button>
    </aside>
  );
}

function Header({ page }: { page: Page }) {
  const titles: Record<Page, [string, string]> = {
    dashboard: ["Security Overview", "Monitor transaction health and fraud activity"],
    transactions: ["Transactions", "Review and investigate all financial activity"],
    alerts: ["Fraud Alerts", "Prioritized threats requiring your attention"],
    details: ["Transaction Details", "Full transaction and risk intelligence"],
    geographic: ["Geographic Analysis", "Analyze location velocity and travel feasibility"],
  };
  return (
    <header className="topbar">
      <div>
        <h1 className="text-xl font-extrabold tracking-[-.025em] text-slate-950">
          {titles[page][0]}
        </h1>
        <p className="mt-0.5 text-xs text-slate-500">{titles[page][1]}</p>
      </div>
      <div className="flex items-center gap-3">
        <label className="search-box">
          <Icon name="search" size={16} />
          <input placeholder="Search transaction ID..." />
          <span>⌘ K</span>
        </label>
        <button className="icon-btn relative" aria-label="Notifications">
          <Icon name="bell" />
          <span className="notification-dot" />
        </button>
        <div className="header-avatar">AM</div>
      </div>
    </header>
  );
}

function StatCard({
  label,
  value,
  change,
  icon,
  tone,
  foot,
}: {
  label: string;
  value: string;
  change: string;
  icon: IconName;
  tone: string;
  foot: string;
}) {
  return (
    <div className="card stat-card">
      <div className="flex items-start justify-between">
        <div className={`stat-icon ${tone}`}>
          <Icon name={icon} size={20} />
        </div>
        <span className={change.startsWith("+") ? "change-up" : "change-down"}>
          {change}
        </span>
      </div>
      <p className="mt-5 text-xs font-semibold text-slate-500">{label}</p>
      <div className="mt-1 text-[28px] font-extrabold tracking-[-.04em] text-slate-950">
        {value}
      </div>
      <p className="mt-2 text-[11px] text-slate-400">{foot}</p>
    </div>
  );
}

function ActivityChart() {
  return (
    <div className="card chart-card">
      <div className="card-heading">
        <div>
          <h2>Transaction activity</h2>
          <p>Volume and fraud detections over 7 days</p>
        </div>
        <button className="select-btn">Last 7 days <span>⌄</span></button>
      </div>
      <div className="mt-5 flex items-center gap-5 text-[11px] text-slate-500">
        <span className="legend"><i className="bg-blue-500" /> Transactions</span>
        <span className="legend"><i className="bg-red-500" /> Flagged</span>
      </div>
      <div className="chart-wrap">
        <div className="y-labels">
          <span>4k</span><span>3k</span><span>2k</span><span>1k</span><span>0</span>
        </div>
        <svg viewBox="0 0 700 210" preserveAspectRatio="none" aria-label="Transaction activity chart">
          <defs>
            <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#2869f0" stopOpacity=".22" />
              <stop offset="1" stopColor="#2869f0" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[10, 55, 100, 145, 190].map((y) => (
            <line key={y} x1="0" y1={y} x2="700" y2={y} stroke="#e8edf5" strokeDasharray="4 5" />
          ))}
          <path d="M0 161 C45 150 55 110 105 122 S175 150 220 116 S285 52 335 79 S410 144 460 105 S530 41 580 54 S650 89 700 30 L700 200 L0 200Z" fill="url(#area)" />
          <path d="M0 161 C45 150 55 110 105 122 S175 150 220 116 S285 52 335 79 S410 144 460 105 S530 41 580 54 S650 89 700 30" fill="none" stroke="#2869f0" strokeWidth="3" />
          <path d="M0 189 C80 184 115 190 180 179 S260 191 335 177 S420 182 480 169 S600 188 700 163" fill="none" stroke="#ef4654" strokeWidth="2" strokeDasharray="5 5" />
          <circle cx="580" cy="54" r="5" fill="white" stroke="#2869f0" strokeWidth="3" />
        </svg>
        <div className="x-labels"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div>
      </div>
    </div>
  );
}

function RiskDonut() {
  return (
    <div className="card chart-card">
      <div className="card-heading">
        <div>
          <h2>Risk distribution</h2>
          <p>Current transaction risk profile</p>
        </div>
        <button className="icon-btn !h-8 !w-8">•••</button>
      </div>
      <div className="flex min-h-[245px] items-center justify-center gap-8">
        <div className="donut">
          <div><b>12,847</b><span>Total</span></div>
        </div>
        <div className="space-y-4">
          {[
            ["Safe", "11,928", "92.8%", "bg-emerald-500"],
            ["Medium", "740", "5.8%", "bg-amber-400"],
            ["High risk", "179", "1.4%", "bg-red-500"],
          ].map(([label, value, percent, color]) => (
            <div key={label} className="grid grid-cols-[10px_68px_45px] items-center gap-2 text-[11px]">
              <i className={`h-2 w-2 rounded-full ${color}`} />
              <span className="text-slate-500">{label}</span>
              <div><b className="block text-slate-800">{value}</b><span className="text-[9px] text-slate-400">{percent}</span></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RecentTable({
  title = "Recent transactions",
  full = false,
  onOpen,
  apiTransactions,
}: {
  title?: string;
  full?: boolean;
  onOpen: () => void;
  apiTransactions: Transaction[];
}) {
  const rows = full ? apiTransactions : apiTransactions.slice(0, 4);  
  return (
    <div className="card overflow-hidden">
      <div className="card-heading border-b border-slate-100 px-5 py-4">
        <div>
          <h2>{title}</h2>
          <p>{full ? "12,847 transactions found" : "Latest activity across all accounts"}</p>
        </div>
        {!full && <button className="link-btn" onClick={onOpen}>View all <Icon name="arrow" size={14} /></button>}
      </div>
      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th>Merchant</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Timestamp</th>
              <th>Location</th>
              <th>Risk level</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((transaction) => (
              <tr key={transaction.transactionId}>                
                <td>
                  <div className="flex items-center gap-3">
                <span className="merchant-icon">
                  {transaction.merchantInfo.merchantName
                    .split(" ")
                    .slice(0, 2)
                    .map((word) => word[0])
                    .join("")
                    .toUpperCase()}
                </span>                  
                    <div>
                    <b>{transaction.merchantInfo.merchantName}</b>
                    <small>{transaction.transactionId}</small>
                  </div>                  
                </div>
                </td>
                <td className="font-bold text-slate-800">
                  ${transaction.amountSpent.toFixed(2)}
                </td>                
                <td>{transaction.transactionType}</td>                
                <td>
                  {new Date(transaction.transactionTimestamp).toLocaleString()}
                </td>                
                <td>
                  <span className="inline-flex items-center gap-1.5">
                    <Icon name="pin" size={13} />
                    {transaction.merchantInfo.merchantCity}, {transaction.merchantInfo.merchantCountry}
                  </span>
                </td>                
            <td>
              <RiskBadge risk={transaction.simulatedFraudLabel ? "High" : "Safe"} />
            </td>                
            <td><button className="row-arrow" aria-label={`View ${transaction.transactionId}`}><Icon name="chevron" size={15} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
function Dashboard({setPage, apiTransactions,
}: {
  setPage: (page: Page) => void;
  apiTransactions: Transaction[];
}) {
  return (
    <>
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="live-dot" />
          Live monitoring
          <span className="text-slate-300">·</span>
          Updated just now
        </div>
        <button className="outline-btn"><Icon name="download" size={15} /> Export report</button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total transactions" value="12,847" change="+12.5%" icon="card" tone="blue" foot="1,428 today" />
        <StatCard label="Safe transactions" value="11,928" change="+8.2%" icon="check" tone="green" foot="92.8% approval rate" />
        <StatCard label="Flagged transactions" value="919" change="-4.8%" icon="alert" tone="yellow" foot="7.2% of total volume" />
        <StatCard label="High-risk alerts" value="179" change="+2.4%" icon="shield" tone="red" foot="3 require immediate action" />
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <ActivityChart />
        <RiskDonut />
      </div>
      <div className="mt-4">
      <RecentTable
      onOpen={() => setPage("transactions")}
      apiTransactions={apiTransactions}
    />      
    </div>
    </>
  );
}

function Transactions({
  setPage,
  apiTransactions,
}: {
  setPage: (page: Page) => void;
  apiTransactions: Transaction[];
}) {  
  return (
    <>
      <div className="toolbar">
        <div className="flex gap-2">
          <button className="tab active">All transactions <span>12,847</span></button>
          <button className="tab">Flagged <span>919</span></button>
          <button className="tab">High risk <span>179</span></button>
        </div>
        <div className="flex gap-2">
          <button className="outline-btn"><Icon name="filter" size={15} /> Filters</button>
          <button className="outline-btn"><Icon name="download" size={15} /> Export</button>
        </div>
      </div>
      <div className="mt-4">
      <RecentTable
        title="All transactions"
        full
        onOpen={() => setPage("details")}
        apiTransactions={apiTransactions}
      />
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
        <span>Showing 1–6 of 12,847 transactions</span>
        <div className="flex gap-1">
          <button className="page-btn">‹</button>
          <button className="page-btn active">1</button>
          <button className="page-btn">2</button>
          <button className="page-btn">3</button>
          <button className="page-btn">›</button>
        </div>
      </div>
    </>
  );
}

function Alerts({ setPage }: { setPage: (page: Page) => void }) {
  const alerts = [
    { title: "Impossible Travel Detected", merchant: "Apple Store · $2,499.00", where: "New York → London", when: "8 minutes ago", severity: "Critical", reason: "5,570 km apart · 1h 24m available", icon: "route" as IconName },
    { title: "Impossible Travel Detected", merchant: "CryptoHub Exchange · $5,200.00", where: "Boston → Lagos", when: "2 hours ago", severity: "High", reason: "8,450 km apart · 2h 11m available", icon: "route" as IconName },
    { title: "Travel Time Review", merchant: "Lufthansa · $1,840.00", where: "Paris → Berlin", when: "4 hours ago", severity: "Medium", reason: "878 km apart · timestamp comparison pending", icon: "clock" as IconName },
  ];
  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="alert-summary critical"><span><Icon name="alert" /></span><div><b>1</b><small>Critical alert</small></div></div>
        <div className="alert-summary high"><span><Icon name="shield" /></span><div><b>1</b><small>High priority</small></div></div>
        <div className="alert-summary medium"><span><Icon name="clock" /></span><div><b>1</b><small>Needs review</small></div></div>
      </div>
      <div className="mt-5 card overflow-hidden">
        <div className="card-heading border-b border-slate-100 px-5 py-4">
          <div><h2>Active alerts</h2><p>Sorted by severity and detection time</p></div>
          <button className="outline-btn"><Icon name="filter" size={14} /> Filter</button>
        </div>
        <div className="divide-y divide-slate-100">
          {alerts.map((alert, index) => (
            <button key={alert.title} onClick={() => setPage(index === 0 ? "details" : "transactions")} className="alert-row">
              <div className={`alert-icon ${alert.severity.toLowerCase()}`}><Icon name={alert.icon} /></div>
              <div className="min-w-0 flex-1 text-left">
                <div className="flex flex-wrap items-center gap-2">
                  <h3>{alert.title}</h3>
                  <span className={`severity ${alert.severity.toLowerCase()}`}>{alert.severity}</span>
                </div>
                <p>{alert.merchant} <span>·</span> {alert.where}</p>
                <small>{alert.reason}</small>
              </div>
              <div className="text-right"><span className="block text-[11px] text-slate-400">{alert.when}</span><span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-blue-600">Investigate <Icon name="chevron" size={14} /></span></div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

function MiniMap({ large = false }: { large?: boolean }) {
  return (
    <div className={`map-canvas ${large ? "large" : ""}`}>
      <div className="map-grid" />
      <div className="land land-one" />
      <div className="land land-two" />
      <div className="land land-three" />
      <svg viewBox="0 0 800 340" preserveAspectRatio="none">
        <path d="M195 213 C350 90 500 100 654 160" fill="none" stroke="#e84453" strokeWidth="3" strokeDasharray="7 7" />
        <circle cx="195" cy="213" r="8" fill="#2869f0" stroke="white" strokeWidth="5" />
        <circle cx="654" cy="160" r="9" fill="#e84453" stroke="white" strokeWidth="5" />
      </svg>
      <div className="map-label from"><b>Previous</b><span>New York, US</span></div>
      <div className="map-label to"><b>Current</b><span>London, UK</span></div>
      <div className="distance-pill"><Icon name="route" size={14} /> 5,570 km</div>
      {large && <div className="map-controls"><button>+</button><button>−</button></div>}
    </div>
  );
}

function DetailItem({ label, children }: { label: string; children: ReactNode }) {
  return <div className="detail-item"><span>{label}</span><b>{children}</b></div>;
}

function TransactionDetails({ setPage }: { setPage: (page: Page) => void }) {
  return (
    <>
      <button className="back-btn" onClick={() => setPage("transactions")}>‹ Back to transactions</button>
      <div className="mt-3 threat-banner">
        <div className="flex items-center gap-4">
          <span><Icon name="alert" size={24} /></span>
          <div><h2>Impossible Travel Detected</h2><p>These transactions occurred too far apart to be physically possible.</p></div>
        </div>
        <div className="text-right"><small>Travel possible</small><b>No</b></div>
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-[1.25fr_.75fr]">
        <div className="space-y-4">
          <div className="card p-5">
            <div className="card-heading">
              <div><h2>Transaction information</h2><p>Payment and merchant details</p></div>
              <RiskBadge risk="High" />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-x-8 gap-y-5">
              <DetailItem label="Merchant">Apple Store</DetailItem>
              <DetailItem label="Amount"><span className="text-xl">$2,499.00</span></DetailItem>
              <DetailItem label="Transaction ID">TXN-845291</DetailItem>
              <DetailItem label="Transaction type">Online purchase</DetailItem>
              <DetailItem label="Timestamp">May 28, 2025 · 10:42 AM</DetailItem>
              <DetailItem label="Location">London, United Kingdom</DetailItem>
              <DetailItem label="Payment method">Visa ending in 4821</DetailItem>
              <DetailItem label="Device">Chrome · macOS</DetailItem>
            </div>
          </div>
          <div className="card p-5">
            <div className="card-heading">
              <div><h2>Geographic journey</h2><p>Location change since previous transaction</p></div>
              <button className="link-btn" onClick={() => setPage("geographic")}>Full analysis <Icon name="arrow" size={14} /></button>
            </div>
            <div className="mt-4"><MiniMap /></div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="card p-5">
            <div className="card-heading"><div><h2>Impossible-travel check</h2><p>Timestamp and geographic location comparison</p></div></div>
            <div className="feasibility-grid mt-5">
              <div><span>Previous location</span><b>New York, US</b><small>9:18 AM</small></div>
              <div><span>Current location</span><b>London, UK</b><small>10:42 AM</small></div>
              <div><span>Geographic distance</span><b>5,570 km</b><small>3,461 miles</small></div>
              <div><span>Available travel time</span><b className="text-red-600">1h 24m</b><small>Timestamp difference</small></div>
              <div><span>Required travel time</span><b>7h 15m</b><small>Minimum route time</small></div>
              <div><span>Travel Possible</span><b className="text-red-600">No</b><small>Required time exceeds available time</small></div>
            </div>
          </div>
          <div className="card p-5">
            <h2 className="text-sm font-extrabold text-slate-900">Take action</h2>
            <p className="mt-1 text-xs text-slate-400">Choose how to resolve this alert</p>
            <button className="danger-btn mt-5 w-full"><Icon name="close" /> Block transaction</button>
            <button className="safe-btn mt-2 w-full"><Icon name="check" /> Mark as safe</button>
            <button className="outline-btn mt-2 w-full justify-center">Contact account holder</button>
          </div>
        </div>
      </div>
    </>
  );
}

function Geographic() {
  return (
    <>
      <div className="threat-banner">
        <div className="flex items-center gap-4">
          <span><Icon name="route" size={24} /></span>
          <div><h2>Impossible Travel Detected</h2><p>New York to London in 1 hour 24 minutes is not physically possible.</p></div>
        </div>
        <span className="severity critical">Critical risk</span>
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-[1.5fr_.75fr]">
        <div className="card overflow-hidden">
          <div className="card-heading px-5 py-4">
            <div><h2>Transaction location path</h2><p>Previous and current transaction coordinates</p></div>
            <button className="select-btn">Satellite view <span>⌄</span></button>
          </div>
          <MiniMap large />
        </div>
        <div className="space-y-4">
          <div className="card p-5">
            <h2 className="text-sm font-extrabold">Travel feasibility</h2>
            <div className="feasibility-grid mt-5">
              <div><span>Previous location</span><b>New York, US</b><small>9:18 AM</small></div>
              <div><span>Current location</span><b>London, UK</b><small>10:42 AM</small></div>
              <div><span>Geographic distance</span><b>5,570 km</b><small>3,461 miles</small></div>
              <div><span>Available travel time</span><b className="text-red-600">1h 24m</b><small>Timestamp difference</small></div>
              <div><span>Required travel time</span><b>7h 15m</b><small>Minimum route time</small></div>
              <div><span>Travel Possible</span><b className="text-red-600">No</b><small>Required time exceeds available time</small></div>
            </div>
          </div>
          <div className="card p-5">
            <h2 className="text-sm font-extrabold">Location timeline</h2>
            <div className="timeline mt-5">
              <div className="timeline-item safe"><i /><div><b>New York, United States</b><span>Whole Foods · $128.42</span><small>9:18 AM · Verified location</small></div></div>
              <div className="timeline-travel"><span>1h 24m elapsed</span><b>5,570 km</b></div>
              <div className="timeline-item danger"><i /><div><b>London, United Kingdom</b><span>Apple Store · $2,499.00</span><small>10:42 AM · Suspicious location</small></div></div>
            </div>
          </div>
          <div className="insight-box"><Icon name="shield" /><div><b>Detection basis</b><span>The required route time is longer than the time available between the two transaction timestamps.</span></div></div>
        </div>
      </div>
    </>
  );
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(true);
  const [page, setPage] = useState<Page>("dashboard");

const [apiTransactions, setApiTransactions] = useState<Transaction[]>([]);

useEffect(() => {
fetch("http://127.0.0.1:3000/api/transactions")
    .then((response) => response.json())
    .then((data) => {
      setApiTransactions(data);
      console.log("API Transactions:", data);
    })
    .catch((error) => {
      console.error("Error fetching transactions:", error);
    });
}, []);

  if (!loggedIn) {
    //console.log("Number of API transactions:", apiTransactions.length);
    return <Login onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <div className="app-shell">
      <Sidebar page={page} setPage={setPage} onLogout={() => setLoggedIn(false)} />
      <div className="main-column">
        <Header page={page} />
        <main className="content">
          {page === "dashboard" && (<Dashboard setPage={setPage} apiTransactions={apiTransactions} />)}          
          {page === "transactions" && (
            <Transactions
              setPage={setPage}
              apiTransactions={apiTransactions}
            />
          )}          
          {page === "alerts" && <Alerts setPage={setPage} />}
          {page === "details" && <TransactionDetails setPage={setPage} />}
          {page === "geographic" && <Geographic />}
        </main>
      </div>
    </div>
  );
}

