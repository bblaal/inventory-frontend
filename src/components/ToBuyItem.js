import React from "react";
import "./../styles/main.css";
import { FaShoppingCart } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { FaCheck } from "react-icons/fa";

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
          {item.bought ? <FaCheck size={20} />
            : <FaShoppingCart size={20} />}
        </button>
        <button className="delete-btn" onClick={() => onDelete(item.id)}>
          <ImCross size={20} />

        </button>
      </div>
    </div>
  );
}
