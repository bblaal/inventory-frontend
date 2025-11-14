import React from "react";
import "./../styles/main.css";

export default function AlertBanner({ message, type = "info" }) {
  if (!message) return null;

  return (
    <div className={`alert-banner ${type}`}>
      <span>{message}</span>
    </div>
  );
}
