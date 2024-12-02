const express = require('express');
const fs = require('fs');
const https = require('https');
const http = require('http');
const cors = require('cors');

const app = express();
const portHttp = 80;  // Porta para HTTP
const portHttps = 443; // Porta para HTTPS

// Middleware para interpretar JSON
app.use(express.json());

// Configuração do CORS para permitir requisições de outras origens
app.use(cors());

// Variável para armazenar a mensagem
let mensagemArmazenada = "";

// Endpoint para armazenar a mensagem (POST)
app.post('/api/armazenar_mensagem', (req, res) => {
    mensagemArmazenada = req.body.conteudo;
    res.json({ status: "Mensagem armazenada com sucesso" });
});

// Endpoint alternativo para armazenar a mensagem via GET
app.get('/api/armazenar_mensagem_get', (req, res) => {
    const mensagem = req.query.mensagem; // Recupera o parâmetro "mensagem" da query string
    if (mensagem) {
        mensagemArmazenada = mensagem;
        res.json({ status: "Mensagem armazenada com sucesso (via GET)" });
    } else {
        res.status(400).json({ status: "Erro: Mensagem não fornecida!" });
    }
});

// Endpoint para recuperar a mensagem (GET)
app.get('/api/obter_mensagem', (req, res) => {
    res.json({ conteudo: mensagemArmazenada });
});

// Carregar os certificados SSL
const sslOptions = {
    key: fs.readFileSync('/etc/ssl/private/myserver.key'),  // Caminho para a chave privada
    cert: fs.readFileSync('/etc/ssl/certs/myserver.crt')   // Caminho para o certificado
};

// Inicia o servidor HTTP
http.createServer(app).listen(portHttp, () => {
    console.log(`Servidor HTTP rodando na porta ${portHttp}`);
});

// Inicia o servidor HTTPS
https.createServer(sslOptions, app).listen(portHttps, () => {
    console.log(`Servidor HTTPS rodando na porta ${portHttps}`);
});
