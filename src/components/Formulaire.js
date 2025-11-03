import React, { useState } from 'react';

function Formulaire() {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [reponse, setReponse] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nom || !email || !reponse) {
      setMessage('Tous les champs sont requis');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom, email, reponse }),
      });

      const result = await response.json();
      if (result.success) {
        setMessage('Réponse envoyée !');
        setNom('');
        setEmail('');
        setReponse('');
      } else {
        setMessage('Erreur : ' + result.error);
      }
    } catch (err) {
      console.error(err);
      setMessage('Erreur serveur');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      <h2>Formulaire de questionnaire</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nom :</label>
          <input value={nom} onChange={(e) => setNom(e.target.value)} required />
        </div>
        <div>
          <label>Email :</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Réponse :</label>
          <textarea value={reponse} onChange={(e) => setReponse(e.target.value)} required />
        </div>
        <button type="submit">Envoyer</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Formulaire;
