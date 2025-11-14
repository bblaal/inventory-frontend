import React, { useEffect, useState } from "react";
import apiService from "../api/api";
import Header from "../components/Header";
import AddItemForm from "../components/AddItemForm";
import ToBuyItem from "../components/ToBuyItem";

export default function ToBuyPage() {
  const [toBuy, setToBuy] = useState([]);

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
      <div style={styles.addFormWrapper}>
        <AddItemForm onAdd={handleAdd} placeholder="Add item to buy..." />
      </div>

      {toBuy.length === 0 ? (
        <p style={styles.noData}>No items added.</p>
      ) : (
        <div style={styles.list}>
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
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#f9fafb",
    minHeight: "100vh",
    paddingBottom: 50,
    fontFamily: "Arial, sans-serif",
  },
  addFormWrapper: {
    margin: "10px 5%",
  },
  list: {
    padding: "0 5%",
    marginTop: 10,
  },
  noData: {
    textAlign: "center",
    marginTop: 20,
    color: "#999",
  },
};
