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

    if (!lista || !totalElemento) return;

    const carrinho = lerCarrinho();

    if (carrinho.length === 0) {
        lista.innerHTML = `
            <div class="empty-state">
                <div>
                    <h3>Seu carrinho está vazio</h3>
                    <p>Adicione alguns itens das categorias para visualizar o resumo aqui.</p>
                </div>
            </div>
        `;
        totalElemento.textContent = "Total: R$ 0,00";
        return;
    }

    let total = 0;

    lista.innerHTML = carrinho.map((item, index) => {
        total += item.preco;
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
    }).join("");

    totalElemento.textContent = `Total: ${formatarPreco(total)}`;
}

function lerFavoritos() {
    try {
        return JSON.parse(localStorage.getItem("favoritos")) || [];
    } catch (e) {
        return [];
    }
}

function salvarFavoritos(favoritos) {
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
}

function adicionarFavoritos(nome, imagem) {
    const favoritos = lerFavoritos();

    const existe = favoritos.some(item => item.nome === nome);

    if (existe) {
        alert("Este item já está nos favoritos.");
        return;
    }

    favoritos.push({
        nome,
        imagem: new URL(imagem, window.location.href).href
    });

    salvarFavoritos(favoritos);
    alert("Item adicionado aos favoritos!");
}

function removerFavorito(index) {
    const favoritos = lerFavoritos();
    favoritos.splice(index, 1);
    salvarFavoritos(favoritos);
    carregarFavoritos();
}

function carregarFavoritos() {
    const lista = document.querySelector(".lista-favoritos");
    const total = document.getElementById("total-itens");

    if (!lista) return;

    const favoritos = lerFavoritos();

    if (favoritos.length === 0) {
        lista.innerHTML = `
            <div class="empty-state">
                <div>
                    <h3>Nenhum favorito por aqui...</h3>
                    <p>Adicione itens para vê-los listados aqui.</p>
                </div>
            </div>
        `;

        if (total) total.textContent = "Total de itens: 0";
        return;
    }

    lista.innerHTML = favoritos.map((item, index) => {
        return `
            <div class="item-favorito">
                <img src="${item.imagem}" alt="${item.nome}">
                <div class="info">
                    <h3>${item.nome}</h3>
                </div>
                <button class="remover" onclick="removerFavorito(${index})">Remover</button>
            </div>
        `;
    }).join("");

    if (total) total.textContent = `Total de itens: ${favoritos.length}`;
}

function normalizarTexto(valor) {
    return (valor || "")
        .toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}

function configurarFiltrosCatalogo() {
    document.querySelectorAll(".catalogo").forEach((catalogo) => {
        const filtros = catalogo.querySelector(".catalogo-filtros");
        const cards = Array.from(catalogo.querySelectorAll(".produto-card"));
        const vazio = catalogo.querySelector(".catalogo-vazio");

        if (!filtros || cards.length === 0) return;

        const atualizar = () => {
            const termo = normalizarTexto(filtros.querySelector('[data-filter="search"]')?.value);
            const condicao = filtros.querySelector('[data-filter="condition"]')?.value || "";
            const autenticidade = filtros.querySelector('[data-filter="authenticity"]')?.value || "";
            const disponibilidade = filtros.querySelector('[data-filter="availability"]')?.value || "";
            let visiveis = 0;

            cards.forEach((card) => {
                const textoCard = normalizarTexto(card.dataset.search);
                const correspondeTermo = !termo || textoCard.includes(termo);
                const correspondeCondicao = !condicao || card.dataset.condition === condicao;
                const correspondeAutenticidade = !autenticidade || card.dataset.authenticity === autenticidade;
                const correspondeDisponibilidade = !disponibilidade || card.dataset.availability === disponibilidade;

                const mostrar =
                    correspondeTermo &&
                    correspondeCondicao &&
                    correspondeAutenticidade &&
                    correspondeDisponibilidade;

                card.classList.toggle("is-hidden", !mostrar);

                if (mostrar) visiveis++;
            });

            if (vazio) vazio.classList.toggle("is-visible", visiveis === 0);
        };

        filtros.addEventListener("input", atualizar);
        filtros.addEventListener("change", atualizar);
        atualizar();
    });
}

function criarTelaCarregamento() {
    if (document.querySelector(".page-loading")) return;

    const overlay = document.createElement("div");
    overlay.className = "page-loading is-visible";
    overlay.innerHTML = `
        <div class="page-loading__brand">RELIC</div>
        <div class="page-loading__dots">
            <span></span><span></span><span></span>
        </div>
        <div class="page-loading__text">Carregando página</div>
    `;

    document.body.appendChild(overlay);

    const esconder = () => {
        setTimeout(() => overlay.classList.remove("is-visible"), 260);
    };

    if (document.readyState === "complete") {
        requestAnimationFrame(esconder);
        return;
    }

    window.addEventListener("load", esconder, { once: true });
}

function configurarTransicaoEntrePaginas() {
    criarTelaCarregamento();

    document.addEventListener("click", (event) => {
        const link = event.target.closest("a[href]");
        if (!link) return;

        const href = link.getAttribute("href");

        if (
            !href ||
            href.startsWith("#") ||
            href.startsWith("mailto:") ||
            href.startsWith("tel:") ||
            link.target === "_blank" ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey
        ) {
            return;
        }

        const destino = new URL(link.href);

        if (destino.origin !== window.location.origin) return;

        event.preventDefault();
        document.body.classList.add("is-entering");

        setTimeout(() => {
            window.location.href = destino.href;
        }, 430);
    });
}

function carregarResumoPedido() {
    const listaResumo = document.querySelector("#lista-resumo");
    const subtotalElemento = document.querySelector("#subtotal");
    const freteElemento = document.querySelector("#frete");
    const totalElemento = document.querySelector("#total");

    if (!listaResumo || !subtotalElemento || !freteElemento || !totalElemento) return;

    const carrinho = lerCarrinho();
    const frete = carrinho.length > 0 ? 25 : 0;

    if (carrinho.length === 0) {
        listaResumo.innerHTML = "<p>Seu carrinho está vazio.</p>";
        subtotalElemento.textContent = "R$ 0,00";
        freteElemento.textContent = formatarPreco(frete);
        totalElemento.textContent = "R$ 0,00";
        return;
    }

    let subtotal = 0;

    listaResumo.innerHTML = carrinho.map((item) => {
        subtotal += item.preco;
        return `
            <div class="item-resumo">
                <img src="${item.imagem}" alt="${item.nome}">
                <div>
                    <p>${item.nome}</p>
                    <span>${formatarPreco(item.preco)}</span>
                </div>
            </div>
        `;
    }).join("");

    const total = subtotal + frete;

    subtotalElemento.textContent = formatarPreco(subtotal);
    freteElemento.textContent = formatarPreco(frete);
    totalElemento.textContent = formatarPreco(total);
}

function formatarPreco(preco) {
    return Number(preco).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

document.addEventListener("DOMContentLoaded", () => {
    configurarTransicaoEntrePaginas();
    configurarFiltrosCatalogo();
    carregarCarrinho();
    carregarFavoritos();
    carregarResumoPedido();
});