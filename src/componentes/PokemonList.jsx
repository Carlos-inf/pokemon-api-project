import React, { useState, useEffect } from "react";
import './PokemonList.css';

const PokemonList = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const ruta_url = 'https://pokeapi.co/api/v2/pokemon?limit=10';

  // Funcion para obtener los detalles
  const fetchPokemonDetails = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      const nombre = data.name.charAt(0).toUpperCase() + data.name.slice(1);
      const imagen = data.sprites.front_default;
      const tipo = data.types[0].type.name;

      return { nombre, imagen, tipo, id: data.id }; 

    } catch (e) {
      console.error("Error fetching detail for:", url, e);
      return null;
    } 
  };
-
  useEffect(() => {
    const fetchInitialList = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const listResponse = await fetch(ruta_url); 
        
        if (!listResponse.ok) {
            throw new Error(`HTTP error! status: ${listResponse.status}`);
        }
        const listData = await listResponse.json();
        
        const detailsPromises = listData.results.map(pokemon => 
          fetchPokemonDetails(pokemon.url)
        );
        
        const allPokemonDetails = await Promise.all(detailsPromises);
        
        setPokemonList(allPokemonDetails.filter(p => p !== null));
        
      } catch (err) {
        console.error("Error fetching initial list:", err);
        setError("Falló la carga de los Pokémon. Intenta de nuevo.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialList();
  }, []); 
  
  if (isLoading) {
    return <div className="loading">Cargando Pokémon... ⏳</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="pokemon-container">
      <h1>Lista de 10 Pokémon Iniciales (PokeAPI)</h1>
      <div className="pokemon-list">
        {pokemonList.map((pokemon) => (
          <div 
            key={pokemon.id} 
            className={`pokemon-card type-${pokemon.tipo}`}
          >
            <img src={pokemon.imagen} alt={pokemon.nombre} className="pokemon-image" />
            <div className="pokemon-info">
              <h2>{pokemon.nombre}</h2>
              <p>Tipo Principal: <strong>{pokemon.tipo.toUpperCase()}</strong></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PokemonList;