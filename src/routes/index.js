'use strict'

const express = require('express')
const router = new express.Router();

router.get('/', (req, res, next) => {
    res.status(200).send({
        "nome": "Hugo Ramoz e João Rossi"
    });
});

router.get('/private', (req, res) => {
    const token = req.headers['authorization'];

    if (!token || token !== 'tokenDeSeguranca') {
        return res.status(401).send('Token inválido!');	
    }

    // Se o token for válido, continuar com a requisição
    res.send('Autorizada').sendStatus(200);
});

const tokensDatabase = {
    'tokenAdmin': { role: 'admin' },
    'tokenUser': { role: 'user' },
    'tokenGuest': { role: 'guest' },
};

router.get('/admin', (req, res) => {on
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).send('Permissão negada!');
    }

    const user = tokensDatabase[token];
    if (!user) {
        return res.status(401).send('Token inválido!');
    }

    // Verificando se o usuário tem acesso ao recurso administrativo
    if (user.role !== 'admin') {
        return res.status(403).send('Permissão negada!');
    }

    res.send('Área de administração');
});


router.post('/submit', (req, res) => {
    const { username, email } = req.body;

    if (!username || !email) {
        return res.status(400).send('Campos obrigatórios não preenchidos.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).send('Formato de email inválido');
    }

    res.send('Login feito com sucesso!').status(202);
});
const requestCounts = {};
const RATE_LIMIT = 5;
const TIME_WINDOW = 60 * 1000;

router.use((req, res, next) => {
    const ip = req.ip;
    if (!requestCounts[ip]) {
        requestCounts[ip] = { count: 1, firstRequest: Date.now() };
    } else {
        requestCounts[ip].count++;
    }

    const currentTime = Date.now();
    const timePassed = currentTime - requestCounts[ip].firstRequest;

    if (timePassed < TIME_WINDOW && requestCounts[ip].count > RATE_LIMIT) {
        return res.status(429).send('Tente novamente mais tarde.');
    }

    if (timePassed >= TIME_WINDOW) {
        requestCounts[ip].count = 1;
        requestCounts[ip].firstRequest = Date.now();
    }

    next();
});

router.get('/data', (req, res) => {
    res.send('Aqui estão seus dados!');
})


let items = [
    { id: 0, name: 'item1' },
    { id: 1, name: 'item2' },
    { id: 2, name: 'item3' }
];

router.get('/items/:id', (req, res) => {
    const itemId = parseInt(req.params.id, 10);

    if (isNaN(itemId)) {
        return res.status(400).send('Formato do ID inválido!');
    }
    const item = items.find(item => item.id === itemId);

    if (item) {
        res.json(item);
    } else {
        res.status(404).send('Item inexistente');
    }
});

router.put('/items/:id', (req, res) => {
    const itemId = parseInt(req.params.id, 10);
    const newName = req.body.name;

    if (isNaN(itemId)) {
        return res.status(400).send('Formato do ID inválido!');
    }

    const itemIndex = items.findIndex(item => item.id === itemId);

    if (itemIndex !== -1) {
        items[itemIndex].name = newName;
        return res.status(204).send();
    } else {
        return res.status(404).send('Item inexistente');
    }
});

router.delete('/items/:id', (req, res) => {
    const itemId = parseInt(req.params.id, 10);

    if (isNaN(itemId)) {
        return res.status(400).send('Formato do ID inválido!');
    }
    const itemIndex = items.findIndex(item => item.id === itemId);

    if (itemIndex !== -1) {
        items.splice(itemIndex, 1);
        return res.status(204).send();
    } else {
        return res.status(404).send('Item inexistente');
    }
});

let nextId = 3;

router.post('/items', (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).send('Campo "Nome" não preenchido.');
    }

    const newItem = { id: nextId++, name };

    items.push(newItem);

    return res.status(201).json(newItem);
});

const processingQueue = [];

router.post('/whatsapp', (req, res) => {
    const { data } = req.body;

    if (!data) {
        return res.status(400).send('Campos obrigatórios não preenchidos.');
    }

    const requestId = Date.now();
    processingQueue.push({ requestId, data });

    return res.status(202).json({ requestId, message: 'Request em processo...' });
});

router.get('/whatsapp/:requestId', (req, res) => {
    const requestId = parseInt(req.params.requestId, 10);

    if (isNaN(requestId)) {
        return res.status(400).send('Formato do ID inválido!');
    }

    const request = processingQueue.find(req => req.requestId === requestId);

    if (request) {
        return res.status(200).json(request);
    } else {
        return res.status(404).send('Requisição não encontrada.');
    }
});

module.exports = router;