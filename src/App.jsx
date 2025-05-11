import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

const TOTAL_BADGES = 18;

export default function App() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      const snapshot = await getDocs(collection(db, 'players'));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const sorted = data.sort((a, b) => b.badges - a.badges);
      setPlayers(sorted);
    };

    fetchPlayers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
        🏆 Classement Pokémon Monotype
      </h1>

      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="text-left p-4">Joueur</th>
              <th className="text-left p-4">Type</th>
              <th className="text-left p-4">Équipe</th>
              <th className="text-left p-4">Badges</th>
              <th className="text-left p-4">Progression</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <tr key={player.id} className="border-t">
                <td className="p-4 font-medium">{player.name}</td>
                <td className="p-4 flex items-center gap-2">
                  <img
                    src={`/types/${player.type}.png`}
                    alt={player.type}
                    className="w-6 h-6"
                  />
                  {player.type}
                </td>
                <td className="p-4">
                  <div className="flex gap-1">
                    {[...Array(6)].map((_, i) => {
                      const pokeId = player.team?.[i] || 0;
                      return (
                        <div
                          key={i}
                          className="w-8 h-8 bg-gray-100 border border-gray-300 rounded flex items-center justify-center"
                        >
                          {pokeId ? (
                            <img
                              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokeId}.png`}
                              alt={`Pokémon ${pokeId}`}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </td>
                <td className="p-4">{player.badges} / {TOTAL_BADGES}</td>
                <td className="p-4">
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-blue-500 h-4 rounded-full"
                      style={{ width: `${(player.badges / TOTAL_BADGES) * 100}%` }}
                    />
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {Math.round((player.badges / TOTAL_BADGES) * 100)}%
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
