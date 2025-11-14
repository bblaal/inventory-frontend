import React from "react";
import "./../styles/main.css";
import { FaCalendarAlt } from "react-icons/fa";
import { ImCross } from "react-icons/im";

export default function InventoryItem({ item, onDelete }) {
  const { name, quantity, purchase_date } = item;

  return (
    <div className="item-card">
      <div className="item-info">
        <h3>{name}</h3>
        <p>
          <strong>{quantity}</strong> qty
        </p>
        <small><FaCalendarAlt />
          {purchase_date}</small>
      </div>
      <button className="delete-btn" onClick={() => onDelete(item.id)}>
        <ImCross />
      </button>
    </div>
  );
}
