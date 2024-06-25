var express = require('express');
const { MongoClient } = require('mongodb');
var app = express();
var db;

app.use(express.static(__dirname + '/public'));
app.use(express.json());

async function conecta() {
    var client = new MongoClient('mongodb://localhost:27017');
    await client.connect();
    db = client.db('Startups');
};

app.post('/cadastrar_entusiasta', async function(req, res) {
    const new_user = req.body; 
    try {
    const collection = db.collection("Entusiastas");
    await collection.insertOne(new_user);
    res.json({message: "USUÁRIO CADASTRADO"});
    } catch(err) {
        res.status(500).json({message: "Erro ao cadastrar entusiasta."});
    } 
});

app.post('/cadastrar_startup', async function(req, res){
    const new_startup = req.body;
    try {   
        const collection = db.collection("Empresas");
        console.log(new_startup)
        await collection.insertOne(new_startup);
        res.json({message:"STARTUP CADASTRADA"});
    } catch(err){
        res.status(500).json({message: "Erro ao cadastrar startup."});
    }
});

app.use((req, res) => {
    res.status(404).send('Rota não encontrada.');
});

app.listen(4000, async () => {
    console.log("Servidor rodando na porta 4000");
    await conecta();
});