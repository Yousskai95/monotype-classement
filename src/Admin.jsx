import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import TeamPlanner from './TeamPlanner';

export default function Admin() {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, 'players', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPlayer(docSnap.data());
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const handleSave = async () => {
    if (!player) return;
    setSaving(true);
    await updateDoc(doc(db, 'players', id), {
      name: player.name,
      type: player.type,
      badges: player.badges,
      team: player.team,
    });
    setSaving(false);
    alert('✅ Données enregistrées !');
  };

  if (loading) return <div className="p-8">Chargement...</div>;
  if (!player) return <div className="p-8 text-red-600">Joueur introuvable.</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">🛠️ Admin : {id}</h1>

      <div className="max-w-xl space-y-6">
        <div>
          <label className="block mb-1 font-semibold">Nom du joueur</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={player.name}
            onChange={(e) => setPlayer({ ...player, name: e.target.value })}
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Type</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={player.type}
            onChange={(e) => setPlayer({ ...player, type: e.target.value })}
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Nombre de badges</label>
          <input
            type="number"
            min={0}
            max={18}
            className="w-full p-2 border rounded"
            value={player.badges}
            onChange={(e) => setPlayer({ ...player, badges: Number(e.target.value) })}
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">Équipe Pokémon</label>
          <TeamPlanner
            team={player.team || []}
            setTeam={(newTeam) =>
              setPlayer((prev) => ({
                ...prev,
                team: newTeam,
              }))
            }
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Enregistrement...' : '💾 Enregistrer'}
        </button>
      </div>
    </div>
  );
}
