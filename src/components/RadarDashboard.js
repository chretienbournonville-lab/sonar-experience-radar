import React, { useState } from "react";
import OrganicRadar from "./OrganicRadar";
import MiniRadar from "./MiniRadar";

// Familles avec leurs métriques
export const FAMILIES = [
  {
    name: "Environnement",
    metrics: ["calme", "nature", "social", "lumiere", "ocean", "vue", "forêt", "montagne", "désert", "campagne_vivante"],
  },
  {
    name: "Style de vie & Confort",
    metrics: ["budget", "luxe", "piscine", "gastronomie", "retraite", "spirituel", "romantique", "solitude", "nomade", "eco_responsable", "traditionnel", "atypique", "digital_detox", "slow_travel", "animaux_bienvenus", "télétravail", "accessibilité"],
  },
  {
    name: "Socialisation",
    metrics: ["accueil_humain", "communauté", "enfant", "seul", "groupe_0_2", "groupe_2_4", "groupe_4_6", "groupe_6_8", "groupe_8_plus"],
  },
  {
    name: "Besoins psychologiques",
    metrics: ["structure", "liberté", "stimulation_intellectuelle", "activité_physique", "besoin_d_isolement", "besoin_de_contact", "besoin_d_encadrement", "accompagnement_emotionnel"],
  },
  {
    name: "Besoins sensoriels",
    metrics: ["bruits_forts", "odeurs", "touchers", "densité_sensorielle"],
  },
  {
    name: "Technologie",
    metrics: ["connexion_wifi", "équipement_technologique", "réalité_numérique"],
  },
  {
    name: "Saisonnalité",
    metrics: ["ouvert_hiver", "climat_chaud", "saisonnier"],
  },
];

export default function RadarDashboard() {
  const [values, setValues] = useState({});
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // calcul de la moyenne d’une famille
  const familyAverage = (family) => {
    const scores = family.metrics.map((m) => values[m] ?? 50);
    return scores.reduce((a, b) => a + b, 0) / scores.length;
  };

  // Envoi des réponses au backend
  const handleSubmit = async () => {
    if (!nom || !email) {
      setMessage("Merci de remplir nom et email.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom,
          email,
          reponses: values, // toutes les réponses aux sliders
        }),
      });

      const result = await response.json();
      if (result.success) {
        setMessage("Réponses envoyées !");
        setNom("");
        setEmail("");
        // Optionnel : réinitialiser sliders
        // setValues({});
      } else {
        setMessage("Erreur : " + result.error);
      }
    } catch (err) {
      console.error(err);
      setMessage("Erreur serveur");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-white p-6">
      {/* Partie radars */}
      <div className="grid grid-cols-3 gap-6 flex-grow">
        {/* Radars à gauche */}
        <div className="flex flex-col items-center justify-center space-y-8">
          {FAMILIES.slice(0, 3).map((f, i) => (
            <div
              key={i}
              className={`flex flex-col items-center cursor-pointer ${
                selectedFamily?.name === f.name ? "scale-105" : ""
              }`}
              onClick={() => setSelectedFamily(f)}
            >
              <MiniRadar
                values={f.metrics.map((m) => values[m] ?? 50)}
                size={150}
              />
              <span className="text-sm mt-2">{f.name}</span>
            </div>
          ))}
        </div>

        {/* Radar central vibrant */}
        <div className="flex items-center justify-center">
          <OrganicRadar
            averages={FAMILIES.map((f) => familyAverage(f))}
            size={500}
          />
        </div>

        {/* Radars à droite */}
        <div className="flex flex-col items-center justify-center space-y-8">
          {FAMILIES.slice(3).map((f, i) => (
            <div
              key={i}
              className={`flex flex-col items-center cursor-pointer ${
                selectedFamily?.name === f.name ? "scale-105" : ""
              }`}
              onClick={() => setSelectedFamily(f)}
            >
              <MiniRadar
                values={f.metrics.map((m) => values[m] ?? 50)}
                size={150}
              />
              <span className="text-sm mt-2">{f.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Formulaire Nom + Email */}
      <div className="mt-6 mb-6 bg-gray-900 p-4 rounded-lg shadow-lg max-w-md mx-auto">
        <h2 className="text-lg font-bold mb-2 text-blue-400">Vos informations</h2>
        <div className="flex flex-col space-y-3">
          <input
            type="text"
            placeholder="Nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className="p-2 rounded bg-gray-800 text-white border border-gray-700"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 rounded bg-gray-800 text-white border border-gray-700"
            required
          />
          <button
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Envoyer
          </button>
          {message && <p className="mt-2 text-sm">{message}</p>}
        </div>
      </div>

      {/* Partie sliders */}
      {selectedFamily && (
        <div className="mt-8 bg-gray-900 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-blue-400">
            {selectedFamily.name}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {selectedFamily.metrics.map((metric) => (
              <div key={metric} className="flex flex-col">
                <label className="text-sm mb-1">{metric}</label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  value={values[metric] ?? 0}
                  onChange={(e) =>
                    setValues({ ...values, [metric]: +e.target.value })
                  }
                  className="w-full"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
