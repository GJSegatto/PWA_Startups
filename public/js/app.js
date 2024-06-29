const app = Vue.createApp({
    el: '#app',
    data() {
        return {
            mostraCadastro: true,          
            empresasRelacionadas: []
            
        }
    },
    mounted() {
        // Executar a função cadastrar_entusiasta ao montar o componente Vue
    },
    methods: {
        async cadastrarEntusiasta() {
            try {
                const data = await cadastrar_entusiasta(); // Chama a função e espera pelos dados
                console.log('aqui é o data ',data);
                // Atualiza o estado do componente com os dados recebidos
                this.empresasRelacionadas = data.empresasRelacionadas;
                console.log(this.empresasRelacionadas);
                this.mostraCadastro = false;
            } catch (err) {
                console.error("Erro ao cadastrar entusiasta:", err);
                // Trate o erro de forma apropriada, se necessário
            }
        }
    },
    template: `
        <div v-if="mostraCadastro">
            <div id="cadastro">
                <label for="nome_pessoa">Nome completo:</label>
                <input type="text" id="nome_pessoa" name="nome_pessoa">

                <label for="email">Email:</label>
                <input type="text" id="email" name="email">

                <h2>Escolha as áreas de interesse que deseja receber notificações:</h2>
                <ul>
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
                <button @click="cadastrarEntusiasta" id="botao">Cadastrar</button>
            </div>
        </div>
        <div v-else>
            <ul v-for="empresa in empresasRelacionadas" >
                <li> {{empresa}} </li>
            </ul>
        </div>
    `
}).mount('#app');