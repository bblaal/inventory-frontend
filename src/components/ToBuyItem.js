import React from "react";
import "./../styles/main.css";

export default function ToBuyItem({ item, onToggle, onDelete }) {
  return (
    <div className="item-card">
      <div className="item-info">
        <h3 className={item.bought ? "bought" : ""}>{item.name}</h3>
        {item.quantity && <p>{item.quantity}</p>}
      </div>
      <div className="actions">
        <button
          className={`toggle-btn ${item.bought ? "done" : ""}`}
          onClick={() => onToggle(item.id)}
        >
          {item.bought ? "✔" : "🛒"}
        </button>
        <button className="delete-btn" onClick={() => onDelete(item.id)}>
          ✕
        </button>
      </div>
    </div>
  );
}
