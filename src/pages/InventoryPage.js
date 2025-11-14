import React, { useEffect, useState } from "react";
import { FaRedo } from "react-icons/fa";
import apiService from "../api/api";
import Header from "../components/Header";
import AddItemForm from "../components/AddItemForm";

export default function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const data = await apiService({ url: "/inventory" });
      setInventory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (item) => {
    try {
      await apiService({ url: "/tobuy", method: "POST", data: item });
      alert(`🛒 Added "${item.name}" to Buy List`);
      setShowAddForm(false);
    } catch (err) {
      console.error("Error adding item:", err);
    }
  };

  const handleRestock = async (item) => {
    const expected = prompt(`How many days should "${item.name}" last? (e.g. 7)`);
    if (!expected || isNaN(expected) || expected <= 0) {
      alert("Please enter a valid number of days.");
      return;
    }
    try {
      await apiService({
        url: `/inventory/restock/${item.id}`,
        method: "PUT",
        data: {
          expected_duration_days: Number(expected),
          purchase_date: new Date().toISOString().split("T")[0],
        },
      });
      alert(`✔ Restocked "${item.name}" for ${expected} days`);
      fetchInventory();
    } catch (err) {
      console.error("Restock error:", err);
      alert("Failed to restock item.");
    }
  };

  const getStockStatus = (item) => {
    const daysSincePurchase = Math.floor(
      (Date.now() - new Date(item.purchase_date)) / (1000 * 60 * 60 * 24)
    );
    const expected = item.expected_duration_days;
    if (expected && expected > 0) {
      if (daysSincePurchase >= expected + 2) return "no";
      if (daysSincePurchase >= expected) return "low";
      return "ok";
    }
    if (daysSincePurchase >= 7) return "no";
    if (daysSincePurchase >= 5) return "low";
    return "ok";
  };

  const withStatus = inventory.map((item) => ({
    ...item,
    status: getStockStatus(item),
  }));

  const filtered = withStatus
    .filter((i) => (filter === "all" ? true : i.status === filter))
    .filter((i) => (i.name || "").toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const order = { no: 0, low: 1, ok: 2 };
      return order[a.status] - order[b.status];
    });

  const count = {
    total: inventory.length,
    no: withStatus.filter((i) => i.status === "no").length,
    low: withStatus.filter((i) => i.status === "low").length,
    ok: withStatus.filter((i) => i.status === "ok").length,
  };

  return (
    <div style={styles.container}>
      <Header title="📦 HomeStock" />

      {/* Stats summary */}
      <div style={styles.statsContainer}>
        <div style={{ ...styles.statCard, borderColor: "#ff3b30" }}>
          ❌ {count.no} No Stock
        </div>
        <div style={{ ...styles.statCard, borderColor: "#ffcc00" }}>
          ⚠️ {count.low} Low Stock
        </div>
        <div style={{ ...styles.statCard, borderColor: "#34c759" }}>
          ✅ {count.ok} Healthy
        </div>
      </div>

      {/* Filters */}
      <div style={styles.filterBar}>
        {["all", "no", "low", "ok"].map((f) => {
          const colors = {
            all: "#007AFF",
            no: "#ff3b30",
            low: "#ffcc00",
            ok: "#34c759",
          };
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                ...styles.filterButton,
                backgroundColor: filter === f ? colors[f] : "#eee",
                color: filter === f ? "white" : "#333",
              }}
            >
              {f === "all"
                ? "All"
                : f === "no"
                ? "No Stock"
                : f === "low"
                ? "Low Stock"
                : "Healthy"}
            </button>
          );
        })}
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="🔍 Search item..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.searchInput}
      />

      {/* Item List */}
      {loading ? (
        <p style={styles.loading}>Loading...</p>
      ) : filtered.length === 0 ? (
        <p style={styles.noData}>No matching items found.</p>
      ) : (
        <div style={styles.list}>
          {filtered.map((item) => (
            <div key={item.id} style={styles.card}>
              <div style={styles.cardContent}>
                <div style={styles.left}>
                  <span style={styles.itemName}>{item.name}</span>
                  <span style={styles.itemMeta}>Qty: {item.quantity}</span>
                  <span style={styles.itemMeta}>
                    🗓 {new Date(item.purchase_date).toLocaleDateString()}
                  </span>
                  <span style={styles.itemMeta}>⏳ {item.expected_duration_days}d</span>
                </div>
                <div style={styles.right}>
                  <button
                    style={styles.restockButton}
                    onClick={() => handleRestock(item)}
                  >
                    <FaRedo /> Restock
                  </button>
                  <span
                    style={{
                      ...styles.badge,
                      backgroundColor:
                        item.status === "no"
                          ? "#ff3b30"
                          : item.status === "low"
                          ? "#ffcc00ff"
                          : "#34c759",
                    }}
                  >
                    {item.status === "no"
                      ? "No"
                      : item.status === "low"
                      ? "Low"
                      : "OK"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floating Add Button */}
      <button style={styles.fab} onClick={() => setShowAddForm((prev) => !prev)}>
        {showAddForm ? "✖" : "＋"}
      </button>

      {showAddForm && (
        <div style={styles.addFormContainer}>
          <h4 style={{ textAlign: "center", marginBottom: 5 }}>🛒 Add to Buy</h4>
          <AddItemForm onAdd={handleAdd} placeholder="Enter item name..." />
        </div>
      )}
    </div>
  );
}

// Styles
const styles = {
  container: {
    backgroundColor: "#f9fafb",
    minHeight: "100vh",
    paddingBottom: 100,
    fontFamily: "Arial, sans-serif",
    fontSize: 16, // Global base bump
  },

  statsContainer: {
    display: "flex",
    justifyContent: "space-around",
    margin: "12px 10px 18px 10px",
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    fontWeight: "600",
    border: "2px solid",
    fontSize: 15,
  },

  filterBar: {
    display: "flex",
    justifyContent: "space-around",
    padding: "8px 10px",
    gap: 8,
    flexWrap: "wrap",
  },
  filterButton: {
    flex: 1,
    border: "none",
    borderRadius: 20,
    padding: "8px 10px",
    fontSize: 14,
    fontWeight: "600",
    cursor: "pointer",
  },

  searchInput: {
    width: "90%",
    margin: "10px 5%",
    padding: "10px",
    borderRadius: 8,
    border: "1px solid #ccc",
    fontSize: 15,
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    padding: "0 10px",
  },

  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 10,
    boxShadow: "0 1px 6px rgba(0,0,0,0.1)",
  },

  cardContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
  },

  left: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    alignItems: "center",
    fontSize: 14,
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },

  itemName: { fontWeight: "700", fontSize: 16, color: "#222" },
  itemMeta: { fontSize: 13.5, color: "#444" },

  restockButton: {
    padding: "6px 8px",
    backgroundColor: "#007AFF",
    border: "none",
    borderRadius: 6,
    color: "white",
    fontSize: 12.5,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 5,
  },

  badge: {
    fontSize: 12.5,
    fontWeight: "600",
    color: "white",
    padding: "3px 8px",
    borderRadius: 6,
  },

  loading: { textAlign: "center", marginTop: 20, color: "#666", fontSize: 15 },
  noData: { textAlign: "center", marginTop: 20, color: "#999", fontSize: 15 },

  fab: {
    position: "fixed",
    bottom: 80,
    right: 20,
    width: 55,
    height: 55,
    borderRadius: "50%",
    backgroundColor: "#007AFF",
    color: "white",
    fontSize: 30,
    border: "none",
    boxShadow: "0 2px 10px rgba(0,0,0,0.7)",
    cursor: "pointer",
  },

  addFormContainer: {
    position: "fixed",
    bottom: 80,
    left: "5%",
    width: "90%",
    backgroundColor: "white",
    borderRadius: 12,
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    padding: 12,
    zIndex: 10,
  },
};

