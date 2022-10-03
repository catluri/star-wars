/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import './App.css';

function App() {
  let page = 'https://swapi.dev/api/planets/';

  const [planets, setPlanets] = useState([]);
  const [planetResidents, setPlanetResidents] = useState([]);
  const [planetSelected, setPlanetSelected] = useState(null);
  const [searchTerm, setSearchterm] = useState('');
  const [searchPlanets, setSearchPlanets] = useState([]);

  const getPlanets = async() => {
    while(page != null) {
      const response = await fetch(page).then((response) => response.json());

      setPlanets(
        planets => [...planets, ...response.results].filter((value, index, self) =>
          index === self.findIndex((t) => (
            t.name === value.name
          ))
        ) 
      );

      page = response.next;
    }
  }

  const getPeopleFromPlanet = async(planet) => {
    setPlanetSelected(planet.name);
    setPlanetResidents([]);
    
    for (let i = 0; i < planet.residents.length; ++i) {
      const response = await fetch(planet.residents[i]).then((response) => response.json());

      setPlanetResidents(planetResidents => [...planetResidents, response]);
    }
  }

  useEffect(() => {
    getPlanets();
  }, []);

  const handleChange = event => {
    setSearchterm(event.target.value);
  };

  useEffect(() => {
    setSearchPlanets(planets);

    const results = planets.filter(planet => {
      return planet.name.toLowerCase().includes(searchTerm)
    });

    setSearchPlanets(results);
  }, [searchTerm])

  return (
    <>
        <div className='searchInputDiv'>
          <input
            type="text"
            placeholder='Search Planets'
            value={searchTerm}
            onChange={handleChange}
          />
        </div>

        <h2>PLANETS</h2>
        
        {searchPlanets ? (
          <>
            {searchPlanets.map(planet => <button className='planet-button' key={planet.name} onClick={() => getPeopleFromPlanet(planet)}>{planet.name}</button>)}
          </>
        ) : (
          <>
            {planets.map(planet => <button key={planet.name} onClick={() => getPeopleFromPlanet(planet)}>{planet.name}</button>)}
          </>
        )}
        {planetSelected && 
          <>
            <h2>PLANET SELECTED IS {planetSelected}</h2>
            {planetResidents.map(planetResident =>{
              return <div className='planet-resident' key={planetResident.url}>{planetResident.name}</div>
            })}
          </>
        }
    </>
  )
}

export default App;
