# Gerenciador de Produtos do Supermercado

Aplicação web desenvolvida em React com backend em Express e banco de dados local em JSON para gerenciar produtos e categorias de um supermercado.

## Funcionalidades

- Cadastro, edição e exclusão de produtos
- Gestão de categorias com criação, atualização e remoção
- Controle de estoque com quantidade disponível e status de disponibilidade
- Campo de código de barras com validação para impedir duplicidade
- Navegação em sidebar com layout organizado para uso acadêmico
- Persistência local usando lowdb no arquivo JSON do backend

## Tecnologias utilizadas

- React
- Vite
- JavaScript
- Express
- Node.js
- lowdb
- CORS

## Estrutura de pastas

```text
gerenciador_supermercado/
├── backend/
│   ├── data/
│   │   └── products.json
│   └── src/
│       ├── db.js
│       └── server.js
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
├── package.json
└── README.md
```

## Como executar

### 1. Instalar dependências

```bash
npm install
```

### 2. Iniciar o projeto

```bash
npm run dev
```

Isso sobe:

- Frontend em http://localhost:5173
- Backend em http://localhost:3001

### 3. Verificar a build de produção

```bash
npm run build
```

## Como usar

1. Abra o navegador em http://localhost:5173
2. Cadastre produtos com nome, preço, categoria, código de barras e estoque
3. Use a página de categorias para criar ou editar categorias
4. Edite ou remova produtos diretamente na tabela principal
5. Observe que códigos de barras duplicados são bloqueados automaticamente

## Observações

- O banco de dados local fica em `backend/data/products.json`
- O projeto foi desenvolvido para apresentação acadêmica e pode ser expandido com autenticação, filtros ou integração com API externa
- A pasta `dist/` é gerada pela build de produção e pode ser ignorada no controle de versão

## Autor

Luis Eduardo Borges de Sousa (https://github.com/luiskkjk)
