import { NavLink } from "react-router-dom";
import { MdReceiptLong, MdBarChart, MdAccountBalanceWallet, MdMenu } from "react-icons/md";

const tabs = [
  { to: "/transactions", icon: <MdReceiptLong size={22} />, label: "Trans." },
  { to: "/analytics",    icon: <MdBarChart size={22} />,    label: "Stats" },
  { to: "/budget",       icon: <MdAccountBalanceWallet size={22} />, label: "Budget" },
  { to: "/dashboard",    icon: <MdMenu size={22} />,        label: "More" },
];

export default function BottomNav() {
  return (
    <nav style={{
      position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
      width: "100%", maxWidth: 480,
      background: "#1e1e1e", borderTop: "1px solid #333",
      display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
      height: 64, zIndex: 50,
    }}>
      {tabs.map(({ to, icon, label }) => (
        <NavLink key={to} to={to} style={({ isActive }) => ({
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 2,
          color: isActive ? "#e85d5d" : "#666",
          textDecoration: "none", fontSize: 11,
          transition: "color 0.2s",
        })}>
          {icon}
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}