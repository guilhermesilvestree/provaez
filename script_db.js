const DATABASE_URL = "postgresql://neondb_owner:npg_IHt29UYsPOjR@ep-holy-cake-aitamqs9-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

const host = new URL(DATABASE_URL).host;
const neonHttpEndpoint = `https://${host}/sql`;

async function executarQueryNeon(querySQL, parametros = []) {
    try {
        const resposta = await fetch(neonHttpEndpoint, {
            method: 'POST',
            headers: {
                'Neon-Connection-String': DATABASE_URL,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: querySQL,
                params: parametros
            })
        });

        if (!resposta.ok) {
            const erroTexto = await resposta.text();
            throw new Error(`Erro HTTP ${resposta.status}: ${erroTexto}`);
        }

        const dados = await resposta.json();
        return dados.rows;

    } catch (erro) {
        console.error("Falha ao comunicar com o banco de dados:", erro);
        return null;
    }
}


export async function buscarLeaderBoard() {
    console.log("Buscando top 10...");
    const query = 'SELECT * FROM ranking ORDER BY pontuacao DESC LIMIT 10';

    const linhas = await executarQueryNeon(query);
    return linhas || [];
}

export async function salvarPontuacao(nome_jogador, pontuacao, tempo_segundos) {
    console.log("Salvando Pontuacao: ", { nome_jogador, pontuacao, tempo_segundos });
    const query = 'INSERT INTO ranking (nome_jogador, pontuacao, tempo_segundos) VALUES ($1, $2, $3) RETURNING *';
    const params = [nome_jogador, pontuacao, tempo_segundos];

    const linhas = await executarQueryNeon(query, params);
    return linhas !== null;
}

export async function sqlAtualizarUsuario(id, nome, email, status) {
    console.log("Atualizando usuário no banco. ID:", id);
    const query = 'UPDATE usuarios SET nome = $1, email = $2, status = $3 WHERE id = $4 RETURNING *';
    const params = [nome, email, status, id];

    const linhas = await executarQueryNeon(query, params);
    return linhas !== null;
}

export async function sqlDeletarUsuario(id) {
    console.log("Deletando usuário do banco. ID:", id);
    const query = 'DELETE FROM usuarios WHERE id = $1 RETURNING *';
    const params = [id];

    const linhas = await executarQueryNeon(query, params);
    return linhas !== null;
}

buscarLeaderBoard();
