let currentPokemonID = null;

document.addEventListener('DOMContentLoaded', () => {
    const maxPokemons = 151;
    const pokemonID = new URLSearchParams(window.location.search).get('id');
    const id = parseInt(pokemonID, 10);

    if (id < 1 || id > maxPokemons) {
        return (window.location.href = './index.html');

    }
    currentPokemonID = id;
    loadPokemon(id);

});

async function loadPokemon(id) {
    try {
        const [pokemon, pokemonsSpecies] = await Promise.all([
            fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
                .then((res) => res.json()),
            fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
                .then((res) => res.json()),
        ]);

        const abilitiesWrapper = document.querySelector(
            '.pokemon-detail-wrap .pokemon-detail.move'
        )
        abilitiesWrapper.innerHTML = '';

        if (currentPokemonID === id) {
            displayPokemonDetail(pokemon);
            const flavorrText = getEnglishFlavorText(pokemonsSpecies);
            
            document.querySelector(
                '.body3-fonts.pokemon-description'
                ).textContent = flavorrText;


                const[leftArrow,rightArrow] = ['#leftArrow','#rightArrow'].map((sel)=> document.querySelector(sel));
               
                leftArrow.removeEventListener('click',navigatePokemon);
                rightArrow.removeEventListener('click',navigatePokemon);
                
                if (id !== 1){
                    leftArrow.addEventListener('click',() => {
                        navigatePokemon(id - 1);
                    });
                }

                if (id !== 151){
                    rightArrow.addEventListener('click',() => {
                        navigatePokemon(id + 1);
                    });
                }

                window.history.pushState({},'',`./detail.html?id=${id}`);
        }

        return true;

    } catch (error) {
        console.error('An error occured while fetching pokemon data:', error)
    }
}

async function navigatePokemon(id) {
    currentPokemonID = id;
    await loadPokemon(id);
}

function getEnglishFlavorText(pokemonsSpecies) {
    
    for(let entry of pokemonsSpecies.flavor_text_entries) {
        if(entry.language.name ==='en') {
            let flavor = entry.flavor_text.replace(/\f/g, ' ');
            return flavor;
        }
    }
    return'';
}

function capitalizeFirtLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();

}
function createAndaAppendElement(parent, tag, options = {}) {
    const element = document.createElement(tag);
    Object.keys(options).forEach((key) => {
        element[key] = options[key];
    });
    parent.appendChild(element);

    return element;
}

const typeColors = {
    normal: "#A8A878",
    fire: "#F08030",
    water: "#6890F0",
    electric: "#F8D030",
    grass: "#78C850",
    ice: "#98D8D8",
    fighting: "#C03028",
    poison: "#A040A0",
    ground: "#E0C068",
    flying: "#A890F0",
    psychic: "#F85888",
    bug: "#A8B820",
    rock: "#B8A038",
    ghost: "#705898",
    dragon: "#7038F8",
    dark: "#705848",
    steel: "#B8B8D0",
    dark: "#EE99AC",
  };

  function setElelmentStyles(elements,csspropperty,value) {
    elements.forEach((element) => {
        element.style[csspropperty] = value
    });
  };
  function rgbaFronHex(hexColor) {
    return [
        parseInt(hexColor.slice(1,3),16),
        parseInt(hexColor.slice(3,5),16),
        parseInt(hexColor.slice(5,7),16),
    ].join(', ');
  }

function setTypeBackgroundColor(pokemon){
    const mainType = pokemon.types[0].type.name;
    const color = typeColors[mainType];

    if(!color){
        console.warn(`color not defined for type: ${mainType}`)
        return;
    }

    const detailMainElement = document.querySelector('.detail-main');


    setElelmentStyles([detailMainElement], 'backgroundColor', color);
   
    setElelmentStyles([detailMainElement], 'borderColor', color);
   
    setElelmentStyles(document.querySelectorAll('.power-wrapper > p'),
    'bacgroundColor', color);

    setElelmentStyles(document.querySelectorAll('.stats-wrap p.stats'),
    'color', color);

    setElelmentStyles(document.querySelectorAll('.stats-wrap .progress-bar'),
    'color', color);

        const rgbaColor = rgbaFronHex(color);

        const styleTag = document.createElement('style');
       styleTag.innerHTML = `
            .stats-wrap .progress-bar::-webkit-progress-bar {
                background-color: rgba(${rgbaColor}, 0.5);
            }

            .stats-wrap .progress-bar::-webkit-progress-value {
                background-color: rgba${color};
            }

       `;
       
       document.head.appendChild(styleTag);


    

}




function displayPokemonDetail(pokemon) {
    const { name, id, types, weight, height, abilities, stats } = pokemon;
    const capitalizePokemonName = capitalizeFirtLetter(name);

    document.querySelector('title').textContent = capitalizePokemonName;

    const detailMainElement = document.querySelector('.detail-main');
    detailMainElement.classList.add(name.toLowerCase());

    document.querySelector('.name-wrap .name');
    document.querySelector('.name-wrap .name').textContent = capitalizePokemonName;

    document.querySelector('.pokemon-id-wrap .body2-fonts').textContent = `#${String(id).padStart(3, '0')}`;
    const imageElement = document.querySelector('.detail-img-wrapper img');
    imageElement.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`;
    imageElement.all = name;

    const typeWrapper = document.querySelector('.power-wrapper');
    typeWrapper.innerHTML = '';

    types.forEach(({ type }) => {
        createAndaAppendElement(typeWrapper, 'p', {
            className: `body3-fonts type ${type.name}`,
            textContent: type.name,
        })
    });

    document.querySelector('.pokemon-detail-wrap .pokemon-detail p.body3-fonts.weight'
    ).textContent = `${weight / 10}kg`;

    document.querySelector('.pokemon-detail-wrap .pokemon-detail p.body3-fonts.height'
    ).textContent = `${height / 10}m`;
    const abilitiesWrapper = document.querySelector(
        '.pokemon-detail-wrap .pokemon-detail.move')

    abilities.forEach(({ ability }) => {
        createAndaAppendElement(abilitiesWrapper, 'p', {
            className: 'body3-fonts',
            textContent: ability.name,
        });
    });

    const statsWrapper = document.querySelector('.stats-wrapper');
    statsWrapper.innerHTML = '';

    const statNameMapping = {
        hp: 'HP',
        attack: 'ATK',
        defense: 'DEF',
        'special-attack': 'SATK',
        'special-defense': 'SDEF',
        speed: 'SPD',
    }

    stats.forEach(({ stat, base_stat }) => {
        const statDiv = document.createElement('div')
        statDiv.className = 'stats-wrap';
        statsWrapper.appendChild(statDiv);

        createAndaAppendElement(statDiv, 'p', {
            className: 'body3-font stats',
            textContent: statNameMapping[stat.name],
        });

        createAndaAppendElement(statDiv, 'p', {
            className: 'body3-fonts',
            textContent: String(base_stat).padStart(3,'0'),
        });
        createAndaAppendElement(statDiv, 'progress', {
            className: 'progress-bar',
            value: base_stat,
            max:100,
        });
    });

    setTypeBackgroundColor(pokemon);
}