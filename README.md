# RELIC (Rare Editions & Legendary Items Collection)

Protótipo de marketplace para itens colecionáveis, raros e vintage, desenvolvido para a disciplina de **Interação Humano-Computador (IHC)**.

O projeto foi pensado para melhorar a experiência de compra e navegação de usuários interessados em **vinis, cartas, livros e jogos clássicos**, com foco em **usabilidade, acessibilidade, feedback visual, prevenção de erros e clareza nas ações**.

> **Unidade 2 — Aprimoramento e Validação da Interface:** nesta etapa o protótipo foi reescrito de HTML/CSS/JS puro para **React + TypeScript + Motion (Framer Motion)**, incorporando melhorias de **acessibilidade digital (WCAG 2.1 AA)**, correções baseadas em **avaliação heurística (Nielsen)** e ajustes a partir de **validação com usuários**. A versão original (Unidade 1, em HTML/CSS/JS) permanece preservada no histórico do Git como referência do "antes".

## Visão geral

O **RELIC** resolve um problema comum em marketplaces genéricos: a dificuldade de encontrar itens colecionáveis com informações claras sobre **estado**, **autenticidade**, **disponibilidade** e **segurança no processo de compra**. A interface oferece uma navegação mais intuitiva, acessível e visualmente consistente para o nicho de colecionadores.

## Tecnologias

- **React 18** + **TypeScript**
- **Vite** (build e dev server)
- **Motion** (Framer Motion) para animações com respeito a `prefers-reduced-motion`
- **React Router** (HashRouter) para as rotas
- **localStorage** para carrinho, favoritos, sessão e pedidos
- Deploy automático no **GitHub Pages** via GitHub Actions

## Como executar

```bash
npm install      # instala as dependências
npm run dev      # ambiente de desenvolvimento (http://localhost:5173)
npm run build    # build de produção em dist/
npm run preview  # serve o build de produção localmente
```

## Estrutura do projeto

```text
Projeto-IHC/
|-- index.html                  # entrada do Vite
|-- vite.config.ts
|-- public/assets/              # imagens dos produtos
|-- src/
|   |-- main.tsx                # bootstrap (router + providers + estilos)
|   |-- App.tsx                 # definição das rotas
|   |-- data/products.ts        # catálogo tipado + helpers
|   |-- lib/                    # storage, máscaras e ViaCEP, variantes Motion
|   |-- context/                # Theme, Toast, Auth, Cart, Favorites, Orders
|   |-- components/             # Header, Footer, SearchBox, ProductCard, etc.
|   |-- routes/                 # Home, Categoria, Produto, Carrinho, Checkout...
|   |-- hooks/                  # useDocumentTitle, useRequireAuth
|   |-- styles/                 # global.css + a11y.css
```

## Funcionalidades

- página inicial com destaques e navegação entre categorias
- páginas de categorias (`vinil`, `cartas`, `livros`, `jogos`) com filtros por estado, autenticidade e disponibilidade, ordenação por preço, busca na categoria e chips de navegação
- página individual de produto com itens relacionados
- busca com sugestões automáticas (combobox acessível, navegável por teclado)
- login e cadastro com tratamento de erros acessível
- carrinho com controle de quantidade e opção de **desfazer remoção**
- finalização de compra com máscaras, busca de CEP (ViaCEP) e formas de pagamento
- favoritos, perfil e histórico de pedidos
- estados de **carregamento** (skeleton), **erro** e **sucesso** com feedback claro
- modo claro e escuro

## Melhorias de acessibilidade (Unidade 2)

- navegação por teclado com **foco sempre visível** e **skip link** para o conteúdo
- **landmarks** semânticos, `aria-current`, regiões `aria-live` para feedback
- busca como **combobox** ARIA (`aria-expanded`, `aria-controls`, `aria-activedescendant`)
- **erros de formulário acessíveis** (`aria-invalid`, `aria-describedby`, foco no 1º erro)
- contraste de texto ajustado para **WCAG AA** e respeito a `prefers-reduced-motion`
- alvos de toque com no mínimo 44×44px e títulos de página por rota
- layout responsivo com **reflow** (WCAG 1.4.10): imagens de produtos e cards de relacionados se ajustam à moldura sem rolagem horizontal nem transbordamento, mesmo com zoom ou fontes ampliadas

## Conceitos de IHC aplicados

usabilidade, affordances, eficiência, eficácia, feedback do sistema, prevenção e recuperação de erros, consistência visual e acessibilidade digital.

## Equipe

- Arthur de Almeida Oliveira
- Arthur Filipe Silva dos Reis
- Gabriel Gondim Malta
- Luísa Fischer Veras Mascena
- Maria Luísa Dijck Muniz
- Matheus Assis de Souza Jácome
- Sofia Villela Vieira

## Referências

- NIELSEN, Jakob. *Usability Engineering*.
- NIELSEN, Jakob. *10 Usability Heuristics for User Interface Design*.
- NORMAN, Don. *The Design of Everyday Things*.
- W3C. *Web Content Accessibility Guidelines (WCAG) 2.1*.
- Material disponibilizado pela professora Renatta Nigro.
