const keys = require('../../keys.json');

document.getElementById('botao_entusiasta').addEventListener('click', () => {
    window.location.href = '/cadastro_entusiasta.html';
});

document.getElementById('botao_startup').addEventListener('click', () => {
    window.location.href = '/cadastro_startup.html';
});

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

//Testa se o navegador suporta o serviceworker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register("/serviceworker.js")
    .then(function(registration){
        var settings = {
            public: keys.publicKey,
            PushSubscription: ''
        }
        console.log("Registrou o serviceworker!");
        notification_permisson(registration, settings);
    }).catch(function(err){
        console.log(err);
    });
 } else {
    console.log("Service Worker não é suportado.")
 }

 function notification_permisson(registration, settings) {
    return registration.pushManager.getSubscription()
    .then(function(subscription) {
        if(subscription) {
            console.log('Já possui pushSubscription', JSON.stringify(subscription));
            settings.PushSubscription = subscription;
            return;
        }
        return registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(keys.publicKey)
        })
        .then(function(subscription) {
            console.log('pushSubscription', JSON.stringify(subscription));
            settings.PushSubscription = subscription;
            if(Notification.permission === 'denied') {
                console.log('Notificações bloqueadas.');
                return;
            } else console.log('Notificações habilitadas.')
        });
    });
 };

 function checked_boxes() {
    const opcoes = {
        it: document.getElementById('it').checked,
        saude: document.getElementById('saude').checked,
        fintech: document.getElementById('fintech').checked,
        mobilidade: document.getElementById('mobilidade').checked,
        agricultura: document.getElementById('agricultura').checked,
        educacao: document.getElementById('educacao').checked,
        alimentacao: document.getElementById('alimentacao').checked
    };

    var checked_list = [];
    for (const [key, value] of Object.entries(opcoes)) {
        if (value) {
            checked_list.push(key);
        }
    }

    return checked_list;
 }

async function cadastrar_entusiasta() {
    try {
        const nome = document.getElementById('nome_pessoa').value.trim();
        const email = document.getElementById('email').value.trim();
        const checked_list = checked_boxes()
        const response = await fetch("/numero_clientes", {
            method: "GET",
            headers: {
                'Content-Type' : 'application/json'
            }
        });
    
        const nro = await response.json();
        const new_user = {
            _id: nro.quantidade+1,
            nome: nome,
            email: email,
            interesses : checked_list
        };

        await fetch("/cadastrar_entusiasta", {
            method: "POST",
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(new_user),
        })
        .then(function(res) { 
            return res.json(); 
        })
        .then(data => {
            console.log("Sucesso:", data);
        })
        .catch((err) => {
            console.erros("Erro ao cadastrar startup:", err);
        });

    } catch(err) {
        console.log(err);
    } 
};

async function cadastrar_startup() {
    const nome_prop = document.getElementById('nome_pessoa').value.trim();
    const nome_empresa = document.getElementById('nome_startup').value.trim();
    const url = document.getElementById('url').value.trim();
    const email = document.getElementById('email').value.trim()
    const desc = document.getElementById('descricao').value.trim();
    const checked_list = checked_boxes() 

    const new_startup = {
        nome_empresa: nome_empresa,
        nome_proprietario: nome_prop,
        url: url,
        email: email,
        descricao: desc,
        areas : checked_list
    };

    await fetch("/cadastrar_startup", {
        method: "POST",
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(new_startup),
    })
    .then(function(res) { 
        return res.json(); 
    })
    .then(data => {
        console.log("Sucesso:", data);
    })
    .catch((err) => {
        console.erros("Erro ao cadastrar startup:", err);
    });
    //push.send(IDDASPESSOA,DADO);
    //.then((results) => {"notificacao enviada"})
    //.catch((err) => {"deu erro na notificacao"})
}

