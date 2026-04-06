import { createContext, useContext, useReducer, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { getCurrencyRates } from "../services/api";
import { formatCurrency } from "../utils/currencyFormatter";

const FinanceContext = createContext();

const STORAGE_KEYS = {
  TRANSACTIONS: "mm_transactions",
  BUDGET: "mm_budget",
  CURRENCY: "mm_currency",
};

const RATES_CACHE_KEY = "mm_currency_rates";
const RATES_CACHE_TTL = 24 * 60 * 60 * 1000;

function loadFromStorage(key, fallback) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

const initialState = {
  transactions: loadFromStorage(STORAGE_KEYS.TRANSACTIONS, []),
  budget: loadFromStorage(STORAGE_KEYS.BUDGET, { monthlyBudget: 0 }),
  currency: loadFromStorage(STORAGE_KEYS.CURRENCY, "INR"),
};

function financeReducer(state, action) {
  switch (action.type) {
    case "ADD_TRANSACTION":
      return { ...state, transactions: [action.payload, ...state.transactions] };

    case "DELETE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      };

    case "UPDATE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      };

    case "SET_BUDGET":
      return { ...state, budget: action.payload };

    case "SET_CURRENCY":
      return { ...state, currency: action.payload };

    default:
      return state;
  }
}

export function FinanceProvider({ children }) {
  const [state, dispatch] = useReducer(financeReducer, initialState);
  // rates are always relative to INR (1 INR = X foreign)
  const [rates, setRates] = useState({});

  useEffect(() => {
    async function fetchRates() {
      try {
        const cached = JSON.parse(localStorage.getItem(RATES_CACHE_KEY) || "null");
        if (cached && Date.now() - cached.timestamp < RATES_CACHE_TTL) {
          setRates(cached.rates);
          return;
        }
        const data = await getCurrencyRates("INR");
        const payload = { rates: data.rates, timestamp: Date.now() };
        localStorage.setItem(RATES_CACHE_KEY, JSON.stringify(payload));
        setRates(data.rates);
      } catch {
        // fall back to raw amounts if rates unavailable
      }
    }
    fetchRates();
  }, []);

  // Sync to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(state.transactions));
  }, [state.transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BUDGET, JSON.stringify(state.budget));
  }, [state.budget]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENCY, JSON.stringify(state.currency));
  }, [state.currency]);

  // Convert an INR-stored amount to the selected display currency and format it
  function fmt(amount) {
    const cur = state.currency;
    if (cur === "INR" || !rates[cur]) return formatCurrency(amount, "INR");
    return formatCurrency(amount * rates[cur], cur);
  }

  // Convert an amount entered in the selected currency back to INR for storage
  function toBase(amount) {
    const cur = state.currency;
    if (cur === "INR" || !rates[cur]) return amount;
    return amount / rates[cur];
  }

  function addTransaction(data) {
    const transaction = {
      ...data,
      id: uuidv4(),
      date: data.date || new Date().toISOString(),
      recurring: data.recurring || false,
    };
    dispatch({ type: "ADD_TRANSACTION", payload: transaction });
    return transaction;
  }

  function deleteTransaction(id) {
    dispatch({ type: "DELETE_TRANSACTION", payload: id });
  }

  function updateTransaction(data) {
    dispatch({ type: "UPDATE_TRANSACTION", payload: data });
  }

  function setBudget(monthlyBudget) {
    dispatch({ type: "SET_BUDGET", payload: { monthlyBudget } });
  }

  function setCurrency(code) {
    dispatch({ type: "SET_CURRENCY", payload: code });
  }

  return (
    <FinanceContext.Provider
      value={{
        transactions: state.transactions,
        budget: state.budget,
        currency: state.currency,
        fmt,
        toBase,
        addTransaction,
        deleteTransaction,
        updateTransaction,
        setBudget,
        setCurrency,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error("useFinance must be used inside FinanceProvider");
  return ctx;
}
