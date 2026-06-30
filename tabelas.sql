CREATE TABLE IF NOT EXISTS ranking (
    id SERIAL PRIMARY KEY,
    nome_jogador VARCHAR(100) NOT NULL,
    pontuacao INT NOT NULL DEFAULT 0,
    tempo_segundos INT NOT NULL DEFAULT 0,
    criado_em TIMESTAMP
);

CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'ativo',
    criado_em TIMESTAMP
);
