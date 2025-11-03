import React from "react";
import RadarDashboard from "./components/RadarDashboard";
import "./index.css"; // Assure-toi que ce fichier contient bien les directives Tailwind

function App() {
  return (
    <main className="min-h-screen bg-background text-white font-sans">
      <RadarDashboard />
    </main>
  );
}

export default App;
