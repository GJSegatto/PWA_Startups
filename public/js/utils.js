if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register("/serviceworker.js")
    .then(function(registration){
    }).catch(function(err){
        console.log(err);
    });
 } else {
    console.log("Service Worker não é suportado.")
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
 }
 
async function cadastrar_entusiasta() {
    const nome = document.getElementById('nome_pessoa').value.trim();
    const email = document.getElementById('email').value.trim();
    const checked_list = checked_boxes() 

    const new_user = {
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
}
