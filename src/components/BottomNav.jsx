import { NavLink } from "react-router-dom";
import { MdReceiptLong, MdBarChart, MdAccountBalanceWallet, MdMenu, MdCurrencyExchange } from "react-icons/md";

const tabs = [
  { to: "/transactions", icon: <MdReceiptLong size={22} />, label: "Transactions" },
  { to: "/analytics",    icon: <MdBarChart size={22} />,    label: "Analytics" },
  { to: "/budget",       icon: <MdAccountBalanceWallet size={22} />, label: "Budget" },
  { to: "/currency",     icon: <MdCurrencyExchange size={22} />, label: "Currency" },
  { to: "/dashboard",    icon: <MdMenu size={22} />,        label: "Dashboard" },
];

export default function BottomNav() {
  return (
    <nav className="app-nav">
      <span className="nav-logo">💰 MoneyManager</span>
      {tabs.map(({ to, icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
        >
          {icon}
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
