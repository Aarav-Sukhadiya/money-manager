import { LineChart as RechartsLine, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid } from "recharts";
import { format, startOfMonth } from "date-fns";
import { useFinance } from "../../context/FinanceContext";

export default function LineChart({ transactions }) {
  const { fmt } = useFinance();
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    return startOfMonth(d);
  });

  const data = months.map((monthStart) => {
    const monthStr = format(monthStart, "yyyy-MM");
    const total = transactions
      .filter((t) => t.type === "expense" && t.date.startsWith(monthStr))
      .reduce((s, t) => s + t.amount, 0);
    return { month: format(monthStart, "MMM"), Spending: total };
  });

  return (
    <ResponsiveContainer width="100%" height={200}>
      <RechartsLine data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
        <XAxis dataKey="month" tick={{ fill: "#666", fontSize: 12 }}
          axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "#666", fontSize: 11 }} axisLine={false} tickLine={false}
          tickFormatter={(v) => fmt(v)} />
        <Tooltip
          formatter={(value) => fmt(value)}
          contentStyle={{ background: "#242424", border: "1px solid #333",
            borderRadius: 8, color: "#fff" }}
        />
        <Line type="monotone" dataKey="Spending" stroke="#e85d5d"
          strokeWidth={2.5} dot={{ fill: "#e85d5d", r: 4 }}
          activeDot={{ r: 6 }} />
      </RechartsLine>
    </ResponsiveContainer>
  );
}