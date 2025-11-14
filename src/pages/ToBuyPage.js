import React, { useEffect, useState } from "react";
import apiService from "../api/api";
import Header from "../components/Header";
import AddItemForm from "../components/AddItemForm";
import ToBuyItem from "../components/ToBuyItem";
import { FaPlus } from "react-icons/fa";
import { ImCross } from "react-icons/im";

export default function ToBuyPage() {
  const [toBuy, setToBuy] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchToBuy = async () => {
    const data = await apiService({ url: "/tobuy" });
    setToBuy(data);
  };

  useEffect(() => {
    fetchToBuy();
  }, []);

  const handleAdd = async (item) => {
    await apiService({ url: "/tobuy", method: "POST", data: item });
    fetchToBuy();
    setShowAddForm(false); // close popup on add
  };

  const handleToggle = async (id) => {
    await apiService({ url: `/tobuy/${id}`, method: "PATCH", data: {} });
    fetchToBuy();
  };

  const handleDelete = async (id) => {
    await apiService({ url: `/tobuy/${id}`, method: "DELETE", data: {} });
    fetchToBuy();
  };

  return (
    <div style={styles.container}>
      <Header title="🛒 To Buy List" />

      {/* Removed old AddItemForm from the top */}

      {toBuy.length === 0 ? (
        <p style={styles.noData}>No items added.</p>
      ) : (
        <div style={styles.listWrapper}>
          {toBuy.map((item) => (
            <ToBuyItem
              key={item.id}
              item={item}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Floating Add Button */}
      <button
        style={{
          ...styles.fab,
          bottom: showAddForm ? 320 : 80, // same as inventory
        }}
        onClick={() => setShowAddForm((prev) => !prev)}
      >
        {showAddForm ? <ImCross size={22} />
          : <FaPlus size={22} />
        }
      </button>

      {/* Popup Add Form */}
      {showAddForm && (
        <div style={styles.addFormContainer}>
          <h4 style={{ textAlign: "center", marginBottom: 5 }}>🛒 Add Item</h4>
          <AddItemForm onAdd={handleAdd} placeholder="Enter item name..." />
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#f9fafb",
    minHeight: "100vh",
    paddingBottom: "60px",
    overflowX: "hidden",
  },

  listWrapper: {
    padding: "0 4%",
    marginTop: 10,
  },

  noData: {
    textAlign: "center",
    marginTop: 20,
    color: "#888",
  },

  fab: {
    position: "fixed",
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
    zIndex: 20,
    textAlign: "center",
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
