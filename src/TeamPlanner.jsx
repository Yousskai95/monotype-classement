import React, { useEffect, useState } from 'react';

const POKEMON_LIMIT = 1010;

export default function TeamPlanner({ team, setTeam }) {
  const [allPokemon, setAllPokemon] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${POKEMON_LIMIT}`);
      const data = await res.json();
      setAllPokemon(
        data.results.map((p, index) => ({
          id: index + 1,
          name: p.name,
        }))
      );
    };
    fetchData();
  }, []);

  const handleSelect = (pokeId) => {
    const newTeam = [...team];
    newTeam[selectedSlot] = pokeId;
    setTeam(newTeam);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Équipe actuelle */}
      <div>
        <h3 className="font-bold text-lg mb-2">🎯 Ton Équipe</h3>
        <div className="flex gap-4">
          {[...Array(6)].map((_, i) => {
            const pokeId = team?.[i] || 0;
            return (
              <div
                key={i}
                onClick={() => setSelectedSlot(i)}
                className={`cursor-pointer w-16 h-16 border-2 rounded-lg flex items-center justify-center ${
                  selectedSlot === i ? 'border-blue-500' : 'border-gray-300'
                }`}
              >
                {pokeId ? (
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokeId}.png`}
                    alt={`Pokémon ${pokeId}`}
                    className="w-12 h-12 object-contain"
                  />
                ) : (
                  <span className="text-sm text-gray-400">Slot {i + 1}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recherche */}
      <div className="mb-3">
        <input
          type="text"
          placeholder="🔍 Rechercher un Pokémon..."
          className="w-full p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
        />
      </div>

      {/* Liste des Pokémon */}
      <div>
        <h3 className="font-bold text-lg mb-2">📜 Tous les Pokémon</h3>
        <div className="grid grid-cols-8 gap-2 max-h-[300px] overflow-y-scroll border p-2 rounded bg-white shadow">
          {allPokemon
            .filter((p) => p.name.includes(searchTerm))
            .map((poke) => (
              <div
                key={poke.id}
                onClick={() => handleSelect(poke.id)}
                title={poke.name}
                className="cursor-pointer hover:scale-110 transition"
              >
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${poke.id}.png`}
                  alt={poke.name}
                  className="w-10 h-10 mx-auto"
                />
                <p className="text-xs text-center capitalize">{poke.name}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
