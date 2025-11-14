import React from "react";
import "./../styles/main.css";

export default function Header({ title }) {
  return (
    <header className="header">
      <h3>{title}</h3>
    </header>
  );
}
