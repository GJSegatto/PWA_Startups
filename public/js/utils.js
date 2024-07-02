document.querySelectorAll('.redirect').forEach(botao => {
    botao.addEventListener('click', () => {
        const url = botao.getAttribute('data-url');
        window.location.href = url;
    });
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
 } else {
    console.log("Service Worker não é suportado.");
 }

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
 };

async function cadastrar_entusiasta() {
    try {
        const nome = document.getElementById('nome_pessoa').value.trim();
        const email = document.getElementById('email').value.trim();
        const checked_list = checked_boxes();
        var end = '';

        await navigator.serviceWorker.ready.then(registration => {
            Notification.requestPermission()
            .then(permission => {
                if(permission === "granted") {
                    registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: urlBase64ToUint8Array('BA3DvIDKg-C2UhFpO2AzKBh-WPuT4Af9sgQwXoDcr0NlOVycISkNd4WpzHNZfLB3FWvpT_tRVt37kSSX8cVSMtE')
                    })
                    .then(subscription => {
                        console.log("Inscrito com sucesso!", subscription);
                        end = subscription.endpoint;
                    })
                }
            })
        })

        const response = await fetch("/numero_clientes", {
            method: "GET",
            headers: {
                'Content-Type' : 'application/json'
            }
        });
    
        const nro = await response.json();
        console.log(nro);
        const new_user = {
            _id: nro.quantidade+1,
            nome: nome,
            email: email,
            interesses : checked_list,
            endpoint: end
        };
        try {
            const res = await fetch("/cadastrar_entusiasta", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(new_user),
            });
            return await res.json();
        } catch (err) {
            console.error("Erro ao cadastrar usuario:", err);
            throw err;
        }
    } catch(err) {
        console.log(err);
    }
};

async function cadastrar_startup() {
    try{
        const nome_prop = document.getElementById('nome_pessoa').value.trim();
        const nome_empresa = document.getElementById('nome_startup').value.trim();
        const url = document.getElementById('url').value.trim();
        const email = document.getElementById('email').value.trim();
        const desc = document.getElementById('descricao').value.trim();
        const checked_list = checked_boxes();

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
        .then(res => res.json())
        .then(data => {
            const {_id, ...rest} = data;
            return rest;
        })
        .catch((err) => {
            console.error("Erro ao cadastrar startup:", err);
            throw err;
        });
    } catch(err) {
        console.log(err);
    }
};

async function envia_notificacao() {
    if (Notification.permission !== "granted")
        Notification.requestPermission();
    else {
        var notification = new Notification('Nova empresa em sua área de interesse!', {
            icon: 'http://cdn.sstatic.net/stackexchange/img/logos/so/so-icon.png',
            body: "Confira!",
        });
    webpush.sendNotification(
        pushSubscription,
        JSON.stringify({
            title: 'Mensagem',
            message: 'valor'
        })
    );
}
}

//push.send(IDDASPESSOA,DADO);
//.then((results) => {"notificacao enviada"})
//.catch((err) => {"deu erro na notificacao"})

