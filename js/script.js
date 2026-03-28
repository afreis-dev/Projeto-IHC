function lerCarrinho() {
    try {
        return JSON.parse(localStorage.getItem("carrinho")) || [];
    } catch (erro) {
        return [];
    }
}

function salvarCarrinho(carrinho) {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function formatarPreco(preco) {
    return Number(preco).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function adicionarCarrinho(nome, preco, imagem) {
    const carrinho = lerCarrinho();

    carrinho.push({
        nome,
        preco: Number(preco),
        imagem: new URL(imagem, window.location.href).href
    });

    salvarCarrinho(carrinho);
    alert("Produto adicionado ao carrinho.");
}

function removerItem(index) {
    const carrinho = lerCarrinho();
    carrinho.splice(index, 1);
    salvarCarrinho(carrinho);
    carregarCarrinho();
}

function carregarCarrinho() {
    const lista = document.querySelector(".lista-carrinho");
    const totalElemento = document.querySelector(".total h2");

    if (!lista || !totalElemento) {
        return;
    }

    const carrinho = lerCarrinho();

    if (carrinho.length === 0) {
        lista.innerHTML = `
            <div class="empty-state">
                <div>
                    <h3>Seu carrinho esta vazio</h3>
                    <p>Adicione alguns itens das categorias para visualizar o resumo aqui.</p>
                </div>
            </div>
        `;
        totalElemento.textContent = "Total: R$ 0,00";
        return;
    }

    let total = 0;
    lista.innerHTML = carrinho
        .map((item, index) => {
            total += Number(item.preco);
            return `
                <div class="item-carrinho">
                    <img src="${item.imagem}" alt="${item.nome}">
                    <div class="info">
                        <h3>${item.nome}</h3>
                        <p>Item reservado para colecionadores.</p>
                        <span>${formatarPreco(item.preco)}</span>
                    </div>
                    <button class="remover" type="button" onclick="removerItem(${index})">Remover</button>
                </div>
            `;
        })
        .join("");

    totalElemento.textContent = `Total: ${formatarPreco(total)}`;
}

document.addEventListener("DOMContentLoaded", carregarCarrinho);
