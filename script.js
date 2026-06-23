//////////////////////////////////////////////////////
// Fazer a importação do script:
//////////////////////////////////////////////////////
import { 
    consultarDiretoComFetch, 
    insertUsuario, 
    sqlDeletarUsuario, 
    sqlAtualizarUsuario 
} from './script_db.js';

//////////////////////////////////////////////////////
// Consts
//////////////////////////////////////////////////////
const btnIniciar = document.getElementById('btn-iniciar')
let hudNome = document.getElementById("hud-nome")
const gridCartas = document.getElementById('grid-cartas')
const cardAcertados = []

// Quando alguem clicar no botão ele vai para a funcao iniciarJogo()
btnIniciar.addEventListener('click', iniciarJogo)


async function iniciarJogo() {
    let nome = document.getElementById("input-nome").value
    hudNome.innerHTML = nome
    const pokemons = await buscarPokemondAleatorios(10)
    renderizarCartas(pokemons)
}


async function buscarPokemondAleatorios(quantidade) {
    
    const ids = new Set();
    while (ids.size < quantidade) {
        ids.add(Math.floor(Math.random() * 151) + 1);
    }
    const pokemons = [];
    for (const id of ids) {
        const resp = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const dados = await resp.json();
        pokemons.push({
            id: dados.id,
            nome: dados.name,
            imagem: dados.sprites.other['official-artwork'].front_default,
            tipo: dados.types[0].type.name
        });
    }
    
    console.log("Lista dos pokemons: ", pokemons);
    return pokemons;
}

function renderizarCartas(pokemons) {
    gridCartas.innerHTML = ''
    const cartas = [...pokemons, ...pokemons]


    cartas.forEach((pokemon, index) => {
        const carta = document.createElement('div')
        carta.className = 'card flipped'
        carta.dataset.pokemonId = pokemon.id
        carta.dataset.index = index

        const cardInner = document.createElement('div')
        cardInner.className = 'card-inner'

        const cardFront = document.createElement('div')
        cardFront.className = 'card-face card-front'


        cardFront.innerHTML = `            <img src="${pokemon.imagem}" alt="${pokemon.nome}" />
            <span class="pokemon-nome">${pokemon.nome}</span>
        `

        const cardBack = document.createElement('div')
        cardBack.className = 'card-face card-back'

        cardInner.append(cardFront, cardBack)
        carta.append(cardInner)
        
        // carta.addEventListener('click', () => carta.classList.toggle('flipped'))
        carta.addEventListener('click', () => verificarCard(carta))
        gridCartas.append(carta)
    })
}

async function verificarCard(carta) {
    console.log("Carta clicada: ", carta.dataset.pokemonId)
    const idPokemon = carta.dataset.pokemonId



}

async function reiniciarJogo() {
    
}

async function encerrarJogo() {
    await salvarPontuacao (nome, pontuacao, tempo)
}

let carta1 = null