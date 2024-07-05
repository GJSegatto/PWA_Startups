document.addEventListener('DOMContentLoaded', () => {
    if(document.querySelector('#app_entusiasta')) {
        const app_entusiasta = Vue.createApp({
            el: '#app_entusiasta',
            data() {
                return {
                    mostraCadastro: true,
                    usuarioCadastrado: false,          
                    empresasRelacionadas: []
                }
            },
            mounted() {
                if(localStorage.getItem('cadastrado')){
                    this.mostraCadastro = false;
                }

                if(localStorage.length != 0){
                    this.atualiza_startups();
                    this.empresasRelacionadas = JSON.parse(localStorage.getItem('empresas'));
                }
            },
            methods: {
                async cadastrarEntusiasta() {
                    try {
                        const data = await cadastrar_entusiasta();
                        console.log('aqui é o data de entusiasta',data);

                        this.empresasRelacionadas = data.empresasRelacionadas;
                        console.log(this.empresasRelacionadas);
                        this.mostraCadastro = false;
                        this.usuarioCadastrado = true;
                        this.guarda_infos(data);
                    } catch (err) {
                        console.error("Erro ao cadastrar entusiasta:", err);
                    }
                },
                guarda_infos(data) {
                    if(data){
                        localStorage.setItem('nome', data.usuario.nome);
                        localStorage.setItem('email', data.usuario.email);
                        localStorage.setItem('empresas', JSON.stringify(data.empresasRelacionadas));
                        localStorage.setItem('interesses', JSON.stringify(data.usuario.interesses));
                        localStorage.setItem('cadastrado', true);
                    }    
                },
                async atualiza_startups() {
                    try{
                        const list_interesses = JSON.parse(localStorage.getItem('interesses'));
                        const paramsObj = list_interesses.reduce((acc, interesse, index) => {
                            acc[`interesse${index}`] = interesse;
                            return acc;
                        }, {});
                        const query = new URLSearchParams(paramsObj).toString();
                        const resp = await fetch(`/startups_relacionadas?${query}`);
                        const data = await resp.json();
                        
                        this.empresasRelacionadas = data.empresasRelacionadas;
                    } catch(err) {
                        console.log(err);
                    }
                },
                limparLocalStorage() {
                    localStorage.clear();
                    window.location.reload();
                }
            },
            template: `
                <div v-if="mostraCadastro" class="flex justify-evenly items-center flex-col text-justify overflow-auto min-h-screen text-lg">
                    <h1 class="text-6xl font-bold text-center">CADASTRO DE USUÁRIO</h1>
                    <div id="cadastro" class="flex flex-col w-2/3 gap-8 p-8 justify-center items-center bg-slate-200 shadow-slate-700 shadow-lg rounded-xl text-xl">
                        <div class="flex w-full h-12 relative rounded-xl">
                            <input required="" class="form_input peer" id="nome_pessoa" type="text"/>
                            <label class="form_label" for="nome_pessoa">Nome</label>
                        </div>
                        <div class="w-full h-12 relative flex rounded-xl">
                            <input required="" class="form_input peer" id="email" type="text"/>
                            <label class="form_label" for="email">Email</label>
                        </div>

                        <h2 class="">Escolha as áreas que você tem interesse:</h2>

                        <ul class="list-none">
                            <li>
                                <input type="checkbox" id="it" name="it" value="checkbox">
                                <label for="it">IT</label>
                            </li>
                            <li>
                                <input type="checkbox" id="saude" name="saude" value="checkbox">
                                <label for="saude">Saúde</label>
                            </li>
                            <li>
                                <input type="checkbox" id="fintech" name="fintech" value="checkbox">
                                <label for="fintech">FinTech</label>
                            </li>
                            <li>
                                <input type="checkbox" id="mobilidade" name="mobilidade" value="checkbox">
                                <label for="mobilidade">Mobilidade</label>
                            </li>
                            <li>
                                <input type="checkbox" id="agricultura" name="agricultura" value="checkbox">
                                <label for="agricultura">Agricultura</label>
                            </li>
                            <li>
                                <input type="checkbox" id="educacao" name="educacao" value="checkbox">
                                <label for="educacao">Educação</label>
                            </li>
                            <li>
                                <input type="checkbox" id="alimentacao" name="alimentacao" value="checkbox">
                                <label for="alimentacao">Alimentação</label>
                            </li>
                        </ul>
                        <button class="btn_cadastro" @click="cadastrarEntusiasta" id="botao">Cadastrar</button>

                    </div>
                </div>
                <div v-else>
                    <ul v-for="empresa in empresasRelacionadas" >
                        <li> {{empresa}} </li>
                    </ul>
                    <button @click="limparLocalStorage">Limpa memória</button>
                </div>
            `
        }).mount('#app_entusiasta');
    }
    
    if(document.querySelector('#app_startup')) {
        const app_startup = Vue.createApp({
            el: '#app_startup',
            data() {
                return {
                    mostraCadastro: true,
                    cadastrado: true,
                    infos: []
                }
            },
            mounted() {
                if(localStorage.getItem('cadastrado')){
                    this.mostraCadastro = false;
                }

                if(localStorage.length != 0){
                    this.infos = JSON.parse(localStorage.getItem('infos'));
                }
            },
            methods: {
                async cadastrarStartup() {
                    try {
                        const data = await cadastrar_startup();
                        console.log('aqui é o data de startup', data);
        
                        this.infos = data.infos;
                        this.guarda_infos(data.infos);
                        this.mostraCadastro = false;
                    } catch (err) {
                        console.error("Erro ao cadastrar startup:", err);
                    }
                },
                guarda_infos(data) {
                    if(data){
                        localStorage.setItem('infos', JSON.stringify(data));
                        localStorage.setItem('cadastrado', true);
                    }    
                },
                limparLocalStorage() {
                    localStorage.clear();
                    window.location.reload();
                },
            },
            template: `
                <div v-if="mostraCadastro" class="flex justify-evenly items-center flex-col text-justify overflow-auto min-h-screen text-lg">
                    <h1 class="text-6xl font-bold text-center">CADASTRO DE STARTUP</h1>
                    <div id="cadastro" class="flex flex-col w-2/3 gap-8 p-8 justify-center items-center bg-slate-200 shadow-slate-700 shadow-lg rounded-xl text-xl">        
                        <div class="flex w-full h-12 relative rounded-xl">
                                <input required="" class="form_input peer" id="nome_startup" type="text"/>
                                <label class="form_label" for="nome_startup">Nome da Startup</label>
                        </div>
                        <div class="flex w-full h-12 relative rounded-xl">
                                <input required="" class="form_input peer" id="nome_pessoa" type="text"/>
                                <label class="form_label" for="nome_pessoa">Empreendedor</label>
                        </div>
                        <div class="flex w-full h-12 relative rounded-xl">
                                <input required="" class="form_input peer" id="email" type="text"/>
                                <label class="form_label" for="email">Email</label>
                        </div>
                        <div class="flex w-full h-12 relative rounded-xl">
                            <input required="" class="form_input peer" id="url" type="text"/>
                            <label class="form_label" for="url">Link do Pitch</label>
                        </div>
                        <div class="flex w-full h-12 relative rounded-xl">
                                <input required="" class="form_input peer" id="descricao" type="text"/>
                                <label class="form_label" for="descricao">Descrição</label>
                        </div>
                        <h2>Escolha as áreas que a sua startup atua:</h2>
                        <ul class="list-none">
                            <li>
                                <input type="checkbox" id="it" name="it" value="checkbox">
                                <label for="it">IT</label>
                            </li>
                            <li>
                                <input type="checkbox" id="saude" name="saude" value="checkbox">
                                <label for="saude">Saúde</label>
                            </li>
                            <li>
                                <input type="checkbox" id="fintech" name="fintech" value="checkbox">
                                <label for="fintech">FinTech</label>
                            </li>
                            <li>
                                <input type="checkbox" id="mobilidade" name="mobilidade" value="checkbox">
                                <label for="mobilidade">Mobilidade</label>
                            </li>
                            <li>
                                <input type="checkbox" id="agricultura" name="agricultura" value="checkbox">
                                <label for="agricultura">Agricultura</label>
                            </li>
                            <li>
                                <input type="checkbox" id="educacao" name="educacao" value="checkbox">
                                <label for="educacao">Educação</label>
                            </li>
                            <li>
                                <input type="checkbox" id="alimentacao" name="alimentacao" value="checkbox">
                                <label for="alimentacao">Alimentação</label>
                            </li>
                        </ul>
                        <button @click="cadastrarStartup" class="btn_cadastro" id="botao">Cadastrar</button>
                    </div>
                </div>
                <div v-else class="flex justify-center items-center">
                    <div class="flex flex-col w-full h-auto gap-8 p-8 m-8 justify-center items-center bg-slate-200 shadow-slate-700 shadow-lg rounded-xl text-xl">
                        <h1 class="text-3xl">{{infos.nome_empresa}}</h1>
                        <p>Proprietário: {{infos.nome_proprietario}}</p>
                        <p>Meio de contato: {{infos.email}}</p>
                        <p>Link do Pitch: {{infos.url}}</p>
                        <p>Áreas de atuação:</p>
                        <ul v-for="area in infos.areas" >
                            <li> <h1>{{area}}</h1> </li>
                        </ul>
                        <button @click="limparLocalStorage">Limpa memória</button>  
                    </div>
                </div>
            `
        }).mount('#app_startup');
    }
});