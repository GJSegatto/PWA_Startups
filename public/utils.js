async function cadastrar () {
    const opcoes = {
        it: document.getElementById('it').checked,
        saude: document.getElementById('saude').checked,
        fintech: document.getElementById('fintech').checked,
        mobilidade: document.getElementById('mobilidade').checked,
        agricultura: document.getElementById('agricultura').checked,
        educacao: document.getElementById('educacao').checked,
        alimentacao: document.getElementById('alimentacao').checked
    }
    
    const options_json = JSON.stringify(opcoes);
    var checked_list = [];
    for (const [key, value] of Object.entries(opcoes)) {
        if (value) {
            checked_list.push(key);
        }
    }    

    const checked_options = {interesses : checked_list};

    console.log(checked_options)

    await fetch("/cadastrar", {
        method: "POST",
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(checked_options),
    })
    .then(function(res) { 
        return res.json(); 
    })
    .then(function() {
        // Handle response
    });
}
