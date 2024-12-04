const express = require('express');
const cors = require('cors');

const app = express();
const portHttp = 80;  // Porta para HTTP

// Middleware para interpretar JSON
app.use(express.json());

// Configuração do CORS para permitir requisições de outras origens
app.use(cors());

// Variáveis para armazenar a mensagem e o log
let mensagemArmazenada = "";
let logMensagem = {};

// Função para capturar informações do cliente
const capturarLog = (req, metodo) => {
    const dataAtual = new Date();
    const dataFormatada = dataAtual.toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo', // Ajuste para o fuso horário de São Paulo
    });
    return {
        ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        metodo: metodo,
        timestamp: dataFormatada
    };
};


// Endpoint alternativo para armazenar a mensagem via GET
app.get('/api/armazenar_mensagem', (req, res) => {
    const mensagem = req.query.mensagem; // Recupera o parâmetro "mensagem" da query string
    if (mensagem) {
        mensagemArmazenada = mensagem;
        logMensagem = capturarLog(req, 'GET');
        res.json({ status: "Mensagem armazenada com sucesso (via GET)" });
    } else {
        res.status(400).json({ status: "Erro: Mensagem não fornecida!" });
    }
});

// Endpoint para recuperar a mensagem (GET)
app.get('/api/obter_mensagem', (req, res) => {
    res.json({ conteudo: mensagemArmazenada });
});

// Novo endpoint para retornar a mensagem e o log
app.get('/api/log', (req, res) => {
    res.json({ conteudo: mensagemArmazenada, log: logMensagem });
});

// Inicia o servidor HTTP
app.listen(portHttp, () => {
    console.log(`Servidor HTTP rodando na porta ${portHttp}`);
});
