// Variáveis
const listaDespesas = document.getElementById("lista-despesas");
const totalGastoEl = document.getElementById("total-gasto");
const salarioInput = document.getElementById("salario");
const valeInput = document.getElementById("vale");
const btnExcluirSelecionadas = document.getElementById("excluir-selecionadas");
const selecionarTodosCheckbox = document.getElementById("selecionar-todos");

let despesas = JSON.parse(localStorage.getItem("despesas")) || [];
let ganhos = JSON.parse(localStorage.getItem("ganhos")) || { salario: 0, vale: 0 };
let selecionadas = new Set(); // Set para rastrear as despesas selecionadas

// Atualiza interface
function atualizarUI() {
    // Atualiza lista de despesas
    listaDespesas.innerHTML = "";
    despesas.forEach((despesa, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
        <div class="container"> 
            <div id="div-info-check"> 
                <input type="checkbox" class="check-tabela" onchange="toggleSelecionada(${index})" ${selecionadas.has(index) ? 'checked' : ''}> 
                ${despesa.descricao}: R$ ${despesa.valor.toFixed(2)} 
                </div> 
            <div class="botao-check-container"> 
                <button onclick="removerDespesa(${index})" class="botao-check">Excluir</button> 
            </div>
        </div>`;
        li.classList.toggle("selecionado", selecionadas.has(index));
        listaDespesas.appendChild(li);
    });

    // Calcula totais
    const totalGasto = despesas.reduce((acc, cur) => acc + cur.valor, 0);
    const saldoAtual = ganhos.salario + ganhos.vale - totalGasto;
    const metaEconomia = saldoAtual - 500;

    // Atualiza elementos
    totalGastoEl.textContent = `R$ ${totalGasto.toFixed(2)}`;

    // Mostra ou oculta o botão de excluir selecionadas
    btnExcluirSelecionadas.style.display = selecionadas.size > 0 ? "block" : "none";
}

// Valida entradas
function isValorValido(valor) {
    return !isNaN(valor) && valor >= 0;
}

// Adicionar despesa
document.getElementById("adicionar-despesa").addEventListener("click", () => {
    const descricao = document.getElementById("descricao").value.trim();
    const valor = parseFloat(document.getElementById("valor").value);

    if (descricao && isValorValido(valor)) {
        despesas.push({ descricao, valor });
        localStorage.setItem("despesas", JSON.stringify(despesas));
        atualizarUI();
    } else {
        alert("Por favor, insira uma descrição válida e um valor positivo.");
    }
});

// Remover despesa
function removerDespesa(index) {
    despesas.splice(index, 1);
    selecionadas.delete(index); // Remover do conjunto de selecionadas, se presente
    localStorage.setItem("despesas", JSON.stringify(despesas));
    atualizarUI();
}

// Salvar ganhos
document.getElementById("salvar-ganhos").addEventListener("click", () => {
    const salario = parseFloat(salarioInput.value);
    const vale = parseFloat(valeInput.value);f

    if (isValorValido(salario)) ganhos.salario = salario || 0;
    if (isValorValido(vale)) ganhos.vale = vale || 0;

    localStorage.setItem("ganhos", JSON.stringify(ganhos));
    calcularTotalGanhos();
    atualizarUI();
});

// Exportar planilha com soma total
document.getElementById("exportar-planilha").addEventListener("click", () => {
    const linhas = despesas.map(d => [d.descricao, d.valor]);
    const somaTotal = despesas.reduce((acc, cur) => acc + cur.valor, 0);
    const csvContent = "data:text/csv;charset=utf-8," +
        ["Descrição,Valor"].concat(linhas.map(l => l.join(","))).join("\n") +
        `\nTotal,Soma:${somaTotal.toFixed(2)}`;

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "despesas.csv");
    link.click();
});

// Alternar seleção de despesa
function toggleSelecionada(index) {
    if (selecionadas.has(index)) {
        selecionadas.delete(index);
    } else {
        selecionadas.add(index);
    }
    atualizarUI();
}

// Selecionar ou desmarcar todas as despesas
selecionarTodosCheckbox.addEventListener("change", () => {
    if (selecionarTodosCheckbox.checked) {
        despesas.forEach((_, index) => selecionadas.add(index));
    } else {
        selecionadas.clear();
    }
    atualizarUI();
});

// Excluir despesas selecionadas com confirmação
btnExcluirSelecionadas.addEventListener("click", () => {
    if (selecionadas.size > 0) {
        const confirmacao = confirm("Tem certeza de que deseja excluir as despesas selecionadas?");
        if (confirmacao) {
            despesas = despesas.filter((_, index) => !selecionadas.has(index));
            selecionadas.clear(); // Limpa as despesas selecionadas
            localStorage.setItem("despesas", JSON.stringify(despesas));
            atualizarUI();
        }
    }
});

const totalGanhosEl = document.getElementById("total-ganhos");

// Função para calcular e exibir o total de ganhos
function calcularTotalGanhos() {
    const salario = parseFloat(salarioInput.value) || 0;
    const vale = parseFloat(valeInput.value) || 0;
    const total = salario + vale;
    totalGanhosEl.textContent = `R$ ${total.toFixed(2)}`;
}

function atualizarGanhosTotal() {
    const total = ganhos.salario + ganhos.vale;
    totalGanhosEl.textContent = `R$ ${total.toFixed(2)}`;
}

atualizarGanhosTotal();
// Inicialização
atualizarUI();