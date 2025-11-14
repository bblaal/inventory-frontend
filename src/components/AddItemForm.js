import React, { useState } from "react";
import "./../styles/main.css";

export default function AddItemForm({ onAdd, placeholder = "Item name..." }) {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !quantity) return;
    onAdd({ name, quantity: parseFloat(quantity) });
    setName("");
    setQuantity("");
  };

  return (
    <form className="add-form add-form-vertical" onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        placeholder={placeholder}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="number"
        step="0.01"
        value={quantity}
        placeholder="Qty"
        onChange={(e) => setQuantity(e.target.value)}
      />

      <button type="submit">＋ Add</button>
    </form>
  );
}
