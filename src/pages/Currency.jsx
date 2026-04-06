import { useState } from "react";
import { motion } from "framer-motion";
import { MdCheck, MdSearch } from "react-icons/md";
import { useFinance } from "../context/FinanceContext";
import { toast } from "react-toastify";

const CURRENCIES = [
  { code: "AED", name: "UAE Dirham" },
  { code: "ARS", name: "Argentine Peso" },
  { code: "AUD", name: "Australian Dollar" },
  { code: "BDT", name: "Bangladeshi Taka" },
  { code: "BRL", name: "Brazilian Real" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "CHF", name: "Swiss Franc" },
  { code: "CLP", name: "Chilean Peso" },
  { code: "CNY", name: "Chinese Yuan" },
  { code: "COP", name: "Colombian Peso" },
  { code: "CZK", name: "Czech Koruna" },
  { code: "DKK", name: "Danish Krone" },
  { code: "EGP", name: "Egyptian Pound" },
  { code: "ETB", name: "Ethiopian Birr" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "British Pound" },
  { code: "GHS", name: "Ghanaian Cedi" },
  { code: "HKD", name: "Hong Kong Dollar" },
  { code: "HUF", name: "Hungarian Forint" },
  { code: "IDR", name: "Indonesian Rupiah" },
  { code: "ILS", name: "Israeli Shekel" },
  { code: "INR", name: "Indian Rupee" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "KES", name: "Kenyan Shilling" },
  { code: "KRW", name: "South Korean Won" },
  { code: "KWD", name: "Kuwaiti Dinar" },
  { code: "MAD", name: "Moroccan Dirham" },
  { code: "MXN", name: "Mexican Peso" },
  { code: "MYR", name: "Malaysian Ringgit" },
  { code: "NGN", name: "Nigerian Naira" },
  { code: "NOK", name: "Norwegian Krone" },
  { code: "NZD", name: "New Zealand Dollar" },
  { code: "PHP", name: "Philippine Peso" },
  { code: "PKR", name: "Pakistani Rupee" },
  { code: "PLN", name: "Polish Zloty" },
  { code: "QAR", name: "Qatari Riyal" },
  { code: "RON", name: "Romanian Leu" },
  { code: "RUB", name: "Russian Ruble" },
  { code: "SAR", name: "Saudi Riyal" },
  { code: "SEK", name: "Swedish Krona" },
  { code: "SGD", name: "Singapore Dollar" },
  { code: "THB", name: "Thai Baht" },
  { code: "TRY", name: "Turkish Lira" },
  { code: "TWD", name: "Taiwan Dollar" },
  { code: "TZS", name: "Tanzanian Shilling" },
  { code: "UAH", name: "Ukrainian Hryvnia" },
  { code: "UGX", name: "Ugandan Shilling" },
  { code: "USD", name: "US Dollar" },
  { code: "VND", name: "Vietnamese Dong" },
  { code: "ZAR", name: "South African Rand" },
];

function getSymbol(code) {
  try {
    const parts = new Intl.NumberFormat("en", {
      style: "currency",
      currency: code,
      maximumFractionDigits: 0,
    }).formatToParts(0);
    return parts.find((p) => p.type === "currency")?.value ?? code;
  } catch {
    return code;
  }
}

export default function Currency() {
  const { currency, setCurrency } = useFinance();
  const [search, setSearch] = useState("");

  const filtered = CURRENCIES.filter(
    (c) =>
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase())
  );

  function handleSelect(code) {
    if (code === currency) return;
    setCurrency(code);
    toast.success(`Currency changed to ${code}`);
  }

  return (
    <motion.div
      className="page"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25 }}
    >
      {/* Header */}
      <div style={{ padding: "20px 0 16px" }}>
        <p style={{ fontSize: 12, color: "#666" }}>Preferences</p>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Currency</h1>
      </div>

      {/* Current currency pill */}
      <div
        className="card"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 16,
          padding: "14px 16px",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: "#e85d5d22",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            fontWeight: 700,
            color: "#e85d5d",
          }}
        >
          {getSymbol(currency)}
        </div>
        <div>
          <p style={{ fontSize: 11, color: "#666" }}>Selected</p>
          <p style={{ fontSize: 15, fontWeight: 700 }}>
            {currency} &mdash;{" "}
            {CURRENCIES.find((c) => c.code === currency)?.name ?? currency}
          </p>
        </div>
      </div>

      {/* Search */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "#2e2e2e",
          borderRadius: 10,
          padding: "10px 14px",
          marginBottom: 14,
          border: "1px solid #333",
        }}
      >
        <MdSearch size={18} color="#666" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search currency..."
          style={{
            background: "none",
            border: "none",
            outline: "none",
            color: "#fff",
            fontSize: 15,
            flex: 1,
          }}
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            style={{
              background: "none",
              border: "none",
              color: "#666",
              cursor: "pointer",
              fontSize: 13,
              padding: 0,
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Count */}
      <p style={{ fontSize: 12, color: "#555", marginBottom: 10 }}>
        {filtered.length} {filtered.length === 1 ? "currency" : "currencies"}
      </p>

      {/* List */}
      <div className="card" style={{ padding: "0 14px" }}>
        {filtered.length === 0 ? (
          <p style={{ textAlign: "center", color: "#555", padding: "32px 0", fontSize: 14 }}>
            No currencies found
          </p>
        ) : (
          filtered.map((c, i) => {
            const isSelected = c.code === currency;
            return (
              <button
                key={c.code}
                onClick={() => handleSelect(c.code)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  width: "100%",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "13px 0",
                  borderBottom:
                    i < filtered.length - 1 ? "1px solid #2a2a2a" : "none",
                  textAlign: "left",
                }}
              >
                {/* Symbol badge */}
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: isSelected ? "#e85d5d22" : "#2e2e2e",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    fontWeight: 700,
                    color: isSelected ? "#e85d5d" : "#888",
                    flexShrink: 0,
                    transition: "all 0.15s",
                  }}
                >
                  {getSymbol(c.code)}
                </div>

                {/* Name */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: isSelected ? 700 : 500,
                      color: isSelected ? "#fff" : "#ccc",
                    }}
                  >
                    {c.name}
                  </p>
                  <p style={{ fontSize: 12, color: "#555", marginTop: 2 }}>
                    {c.code}
                  </p>
                </div>

                {/* Check */}
                {isSelected && <MdCheck size={20} color="#e85d5d" />}
              </button>
            );
          })
        )}
      </div>
    </motion.div>
  );
}
