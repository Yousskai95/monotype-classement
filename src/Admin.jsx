import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

const TOTAL_BADGES = 18;

export default function Admin() {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayer = async () => {
      const ref = doc(db, 'players', id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setPlayer({ id: snap.id, ...snap.data() });
      }
      setLoading(false);
    };

    fetchPlayer();
  }, [id]);

  const updatePlayer = async () => {
    if (!player) return;
    const ref = doc(db, 'players', player.id);
    await updateDoc(ref, {
      badges: player.badges,
      team: player.team
    });
    alert('Données mises à jour ✅');
  };

  const updateBadge = (amount) => {
    setPlayer((prev) => ({
      ...prev,
      badges: Math.min(TOTAL_BADGES, Math.max(0, prev.badges + amount)),
    }));
  };

  const updateTeamMember = (index, value) => {
    const newTeam = [...player.team];
    newTeam[index] = parseInt(value) || 0;
    setPlayer((prev) => ({ ...prev, team: newTeam }));
  };

  if (loading) return <div className="p-10 text-lg">Chargement...</div>;
  if (!player) return <div className="p-10 text-lg">Joueur introuvable ❌</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">🎮 Édition : {player.name}</h2>

        <div className="mb-6">
          <label className="block mb-1 font-semibold">Badges</label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateBadge(-1)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              -1
            </button>
            <span className="text-xl">{player.badges} / {TOTAL_BADGES}</span>
            <button
              onClick={() => updateBadge(1)}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              +1
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-semibold">Équipe Pokémon (ID Pokédex)</label>
          <div className="grid grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="number"
                  value={player.team?.[i] || ''}
                  onChange={(e) => updateTeamMember(i, e.target.value)}
                  className="border p-2 rounded w-full"
                  placeholder={`Pokémon ${i + 1}`}
                />
                <div className="w-10 h-10 bg-gray-100 border rounded flex items-center justify-center">
                  {player.team?.[i] ? (
                    <img
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${player.team[i]}.png`}
                      alt={`Pokémon ${player.team[i]}`}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={updatePlayer}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          💾 Enregistrer
        </button>
      </div>
    </div>
  );
}
