var express = require('express');
const { MongoClient } = require('mongodb');
const webpush = require('web-push');
var app = express();
var db;

app.use(express.static(__dirname + '/public'));
app.use(express.json());

async function conecta() {
    var client = new MongoClient('mongodb://localhost:27017');
    await client.connect();
    db = client.db('Startups');
};

async function startups_relacionadas(interesses){
    try {
        let empresasRelacionadas = [];
            const empresas = db.collection("Empresas");
            empresasRelacionadas = await empresas.find(
                {areas: {$in: interesses}},
                {projection: {_id: 0}}
            ).toArray();
    
            return empresasRelacionadas;

    } catch(err) {
        console.log(err);
    }
}

async function subscriptions_alvos(areas) {
    let ids_unicos = new Set();

    try {
        const docs_areas = await db.collection("Interesses").find(
            {area: {$in: areas}}
        ).toArray();
        docs_areas.forEach(doc => {
            doc.interessados.forEach(id => {
                ids_unicos.add(id);
            });
        });
        const array_users = Array.from(ids_unicos);
        const users = await db.collection('Entusiastas').find(
            {_id: {$in: array_users}}
        ).toArray();
        const subscriptions_infos = users.map(user => user.subscription);
        return subscriptions_infos;
    } catch(err) {
        console.log(err);
        return [];
    }
}

app.post('/cadastrar_entusiasta', async function(req, res) {
    const new_user = req.body; 
    try {
        const collection = db.collection("Entusiastas");
        await collection.insertOne(new_user);

        if(new_user.interesses != null) {
            const interesses = db.collection("Interesses");
            for(let i = 0; i < new_user.interesses.length; i++) {
                const int = new_user.interesses[i];
                await interesses.updateOne(
                    {area: int},
                    {$addToSet: {interessados: new_user._id}}
                );
            }
        }

        const list = await startups_relacionadas(new_user.interesses);

        res.json({
            message: 'USUÁRIO CADASTRADO',
            usuario: new_user,
            empresasRelacionadas: list
        })
        
    } catch(err) {
        res.status(500).json({message: "Erro ao cadastrar entusiasta."});
    }
});

app.post('/cadastrar_startup', async function(req, res){
    const new_startup = req.body;
    try {   
        const collection = db.collection("Empresas");
        await collection.insertOne(new_startup);

        res.json({
            message:"STARTUP CADASTRADA", 
            infos: new_startup,
        });
    } catch(err){
        res.status(500).json({message: "Erro ao cadastrar startup."});
    }
});

app.get('/subscriptions', async function (req, res) {
    try {
        const areas = req.query.areas ? req.query.areas.split(',') : [];
        const subscriptions = await subscriptions_alvos(areas);
        
        const payload = JSON.stringify({
            notification: {
                title: 'Nova empresa em sua área de interesse!',
                body: 'Uma nova startup está em busca de investidores ou parceiros de negócios!',
                icon: 'http://cdn.sstatic.net/stackexchange/img/logos/so/so-icon.png',
                vibrate: [100, 50, 100],
                data: {
                    dateOfArrival: Date.now(),
                    primaryKey: 1
                },
                actions: [
                    {action: 'explore', title: 'Explorar esta nova oportunidade'},
                    {action: 'close', title: 'Fechar'}
                ]
            }
        });

        const temp = subscriptions.map(subscriptions => JSON.parse(subscriptions));
        try {
            for (const destino of temp) {
                webpush.setVapidDetails(
                    'mailto:nicolasgiaboeski@gmail.com',
                    'BA3DvIDKg-C2UhFpO2AzKBh-WPuT4Af9sgQwXoDcr0NlOVycISkNd4WpzHNZfLB3FWvpT_tRVt37kSSX8cVSMtE',
                    'kqswYs7KEIyqCT6vL5_nX0apG3LBxkQDzRooO2oIS9Q'
                );
                await webpush.sendNotification(destino, payload);
            }

            res.json({
                message: "NOTIFICAÇÕES ENVIADAS COM SUCESSO!"
            })
        } catch (err) {
            console.error('Erro ao enviar notificação:', err);
            res.json({
                message: "ERRO NO ENVIO DAS NOTIFICAÇÕES!"
            })
        }
    } catch(err) {
        console.log(err);
    }
});

app.get('/startups_relacionadas', async function (req, res) {
    const interesses = Object.values(req.query);
    const list = await startups_relacionadas(interesses);
    res.json({
        empresasRelacionadas: list
    });
});

app.get('/numero_clientes', async function(req, res) {
    try {
        const entusiastas = db.collection('Entusiastas');
        const count = await entusiastas.countDocuments();
        res.json({quantidade: count})
    } catch(err) {
        console.error(err);
        res.status(500).json({message: "Erro ao obter o número de clientes."});
    }
});

app.use((req, res) => {
    res.status(404).send('Rota não encontrada.');
});

app.listen(4000, async () => {
    console.log("Servidor rodando na porta 4000");
    await conecta();
});