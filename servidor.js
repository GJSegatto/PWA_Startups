var express = require('express');
const { MongoClient } = require('mongodb');
var app = express();
var db;

app.use(express.static(__dirname + '/public'));
app.use(express.json())

async function conecta() {
    var client = new MongoClient('mongodb://localhost:27017');
    await client.connect();
    db = client.db('Startups');
}

app.post('/cadastrar', function (req, res) {
    console.log("CADASTROU SEU PAI")
    console.log(req.body);
    res.json({message: "CADASTRADO"})
})

app.use((req, res) => {
    res.status(404).send('Rota não encontrada.');
});

app.listen(4000, async () => {
    console.log("Servidor rodando na porta 4000");
    await conecta();
})