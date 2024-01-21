const maxPokemon=151
const listWrapper=document.querySelector(".list-wrapper");
const searhInput = document.querySelector("#search-input");
const numberFilter = document.querySelector("#number");
const nameFilter = document.querySelector("#name");
const notFoudMessage = document .querySelector("#not-found-message");

let allPokemons = [];

fetch(`https://pokeapi.co/api/v2/pokemon?limit=${maxPokemon}`)
.then((response)=> response.json())
.then((data) => {
    allPokemons = data.results;
    displayPokemons(allPokemons);
})

 async function fetchPokemonDataBeforeRedirect(ID){
    try {
        const[pokemon,pokemonSpecies] = await Promise.all([
            fetch(`https://pokeapi.co/api/v2/pokemon/${ID}`).then((res)=>res.json()),
            fetch(`https://pokeapi.co/api/v2/pokemon-species/${ID}`).then((res)=>res.json())
        ]);
        return true;

    } catch (error) {
         console.error("failed tofetch pokemon data before redirect")
    }
 }


function displayPokemons(allPokemons){
    listWrapper.innerHTML = "";
    allPokemons.forEach(pokemon => {
        const pokemonID =pokemon.url.split("/")[6];
        const listItem = document.createElement("div");
        listItem.className = "list-item";
        listItem.innerHTML = `
            <div class="number-wrap">
                <p class="caption-fonts">#${pokemonID}</p>
            </div>
            <div class="img-wrap">
                <img src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemonID}.svg" alt="${pokemon.name}">     
            </div>
            <div class="name-wrap">
                <p class="body3-fonts">#${pokemon.name}</p>
            </div>    
        `;

       listItem.addEventListener("click",async () =>{
            const success = await fetchPokemonDataBeforeRedirect(pokemonID)
            if(success){
                window.location.href = `./detail.html?id=${pokemonID}`;
            }
        });



        listWrapper.appendChild(listItem);

    });
}
searhInput.addEventListener("keyup" , handalSearch);

function handalSearch() {
    const searchTerm = searhInput.value.toLowerCase();
    let filterdPokemons;
  
    if (numberFilter.checked) {
      filterdPokemons = allPokemons.filter((pokemon) => {
        
        const pokemonID = pokemon.url.split("/")[6]
        return pokemonID.startsWith(searchTerm);
    
      });  
    }
    else if(nameFilter.checked) {
     filterdPokemons = allPokemons.filter((pokemon) => pokemon.name.toLowerCase().startsWith(searchTerm));
    }
    else {
        filterdPokemons = allPokemons;
    }

    displayPokemons(filterdPokemons);
    
    if(filterdPokemons.length === 0){
        notFoudMessage.style.display = 'block';     
    }
    else {
    notFoudMessage.style.display = 'none'
        
    }
    
}

const closeButon = document.querySelector('.search-close-icon');
closeButon.addEventListener('click',clearSearch);

function clearSearch() {
    searhInput.value = '';displayPokemons(allPokemons);
    notFoudMessage.style.display = 'none';
}