import React from "react";
import { useContext } from "react";
import { LoadingContext } from "../context/LoadingContext";

export default function GlobalLoader() {
  const { loading } = useContext(LoadingContext);

  if (!loading) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.spinner}></div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.25)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  spinner: {
    width: 60,
    height: 60,
    border: "7px solid #ddd",
    borderTop: "7px solid #007AFF",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};
