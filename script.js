//////////////////////////////////////////////////////
// Fazer a importação do script:
//////////////////////////////////////////////////////
// import { 
//     buscarLeaderBoard, 
//     salvarPontuacao, 
// } from './script_db.js';


//////////////////////////////////////////////////////
// Consts
//////////////////////////////////////////////////////
const btnIniciar = document.getElementById('btn-iniciar')
const btnReniciar = document.getElementById('btn-reniciar')
let hudNome = document.getElementById("hud-nome")
const gridCartas = document.getElementById('grid-cartas')
const toast = document.getElementById('toast')
let bloqueado = false
const cardAcertados = []

let carta1 = null
let carta2 = null

let totalPares = 10

let paresEncontrados = 0

function mostrarToast(tipo, mensagem) {
    if (tipo === "sucess") {
        toast.style.backgroundColor = 'var(--green-600)'
    } 
    
    if (tipo === "error") {
        toast.style.backgroundColor = 'var(--rose-100)'
    }
    
    if (tipo === "info") {
        toast.style.backgroundColor = 'var(--yellow)'
    }

    toast.textContent = mensagem;
    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

// Quando alguem clicar no botão ele vai para a funcao iniciarJogo()
btnIniciar.addEventListener('click', iniciarJogo)
btnReniciar.addEventListener('click', reiniciarJogo)


async function iniciarJogo() {
    let nome = document.getElementById("input-nome").value
    hudNome.innerHTML = "👤" + nome
    const pokemons = await buscarPokemondAleatorios(totalPares)
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
        carta.className = 'card'
        carta.dataset.pokemonId = pokemon.id
        carta.dataset.index = index

        const cardInner = document.createElement('div')
        cardInner.className = 'card-inner'

        const cardFront = document.createElement('div')
        cardFront.className = 'card-front'
        cardFront.innerHTML = `
            <img src="${pokemon.imagem}" alt="${pokemon.nome}" loading="lazy" />
            <span class="pokemon-nome">${pokemon.nome}</span>
        `

        const cardBack = document.createElement('div')
        cardBack.className = 'card-back'
        cardBack.textContent = '?'

        cardInner.append(cardFront, cardBack)
        carta.append(cardInner)
        
        carta.addEventListener('click', () => verificarCard(carta))
        gridCartas.append(carta)
    })
}

async function verificarCard(carta) {
    if (bloqueado || carta.classList.contains('card-acertada') || carta.classList.contains('card-virada')) {
        return;
    }

    carta.classList.add('card-virada');

    if (!carta1) {
        carta1 = carta;
        return;
    }

    carta2 = carta;
    bloqueado = true;

    if (carta1.dataset.pokemonId === carta2.dataset.pokemonId) {
        carta1.classList.add('card-acertada');
        carta2.classList.add('card-acertada');
        paresEncontrados++;
        
        document.getElementById('hud-pares').textContent = `${paresEncontrados} / ${totalPares} Pares`;
        
        carta1 = null;
        carta2 = null;
        bloqueado = false;
        
        verificarVitoria();
    } else {
        setTimeout(() => {
            carta1.classList.remove('card-virada');
            carta2.classList.remove('card-virada');
            carta1 = null;
            carta2 = null;
            bloqueado = false;
        }, 1000);
    }
}

async function reiniciarJogo() {
    carta1 = null;
    carta2 = null;
    bloqueado = false;
    paresEncontrados = 0;


    gridCartas.innerHTML = '';

    document.getElementById('hud-timer').textContent = '00:00';
    document.getElementById('hud-pares').textContent = '0 / 10 Pares';
    
    const inputNome = document.getElementById('input-nome');
    if (inputNome) {
        inputNome.value = '';
    }
}

async function encerrarJogo(nome, pontuacao, tempo) {
    await salvarPontuacao (nome, pontuacao, tempo)
    mostrarToast("sucess", "Pontuação salva com sucesso! Vc fez " + pontuacao + " pontos!")

    try {
        const leaderboard = await buscarLeaderBoard()
        console.log("Leaderboard: ", leaderboard)
    } catch (e) {
        mostrarToast("error", "Erro, aguarde um pouco...")
    }
}

async function puxarRanking() {
    const ranking = await buscarLeaderBoard()

    const medalhas = ['🥇', '🥈', '🥉'];
    ranking.forEach ((r, i) => {
         const destaque = r.nome_jogador === nome_jogador ? 'class="linha-destaque"' : '';
         tbody.innerHTML += `
         <tr ${destaque}>
           <td>${medalhas [i] ?? i + 1}</td>
           <td>${r.nome_jogador}</td>
           <td>${r.pontuacao.toLocaleString('pt-BR')} pts</td>
           <td>${formatarTempo (r.tempo_segundos)}</td>
         </td>`;
    });
}


function verificarVitoria() {

    if (paresEncontrados === totalPares) {
        const nomeJogador = document.getElementById("input-nome").value || "Anônimo";
        
        const tempoSegundos = 0; 

        const pontuacaoFinal = paresEncontrados * 100;

        document.getElementById('pontuacao-final').textContent = `${pontuacaoFinal} PTS`;
        document.getElementById('tempo-formatado').textContent = `Tempo: ${document.getElementById('hud-timer').textContent}`;

        encerrarJogo(nomeJogador, pontuacaoFinal, tempoSegundos);
        puxarRanking();

        mostrarToast("sucess", "Parabéns! Você encontrou todos os Pokémon!");
    }
}
