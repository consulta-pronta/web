# Arquitetura

## Visão geral

ConsultaPronta é uma aplicação web de página única (SPA) construída com Vue 3 e TypeScript. O Vite fornece o servidor de desenvolvimento e o build. A aplicação usa Vue Router para navegação, Pinia para estado compartilhado e Firebase Authentication e Cloud Firestore para autenticação e persistência de dados.

## Estrutura do código

- `src/main.ts` inicializa o Vue, registra Pinia e o router, acompanha mudanças no estado de autenticação do Firebase e monta a aplicação.
- `src/App.vue` é o componente raiz que contém todo o conteúdo da pagina.
- `src/router/index.ts` declara as rotas e os respectivos controles de acesso.
- `src/pages/` contém todas as páginas, incluindo telas de autenticação, dashboard, exames, histórico e relatórios.
- `src/components/` contém componentes reutilizáveis, organizados por função em subpastas como `bases/`, `cards/` e `forms/`.
- `src/stores/` contém stores do Pinia para autenticação, navegação e cadastro/login.
- `src/database/` contém os modelos dos documentos do banco de dados e inicializa o Firebase. `BaseDocument` reúne operações comuns do Firestore; os modelos específicos definem os dados e comportamentos das entidades.
- `src/assets/` e `public/` contém outros recursos usados na aplicação, como o css antes da build e arquivos estáticos.

## Navegação e autenticação

As rotas são definidas em `src/router/index.ts`. As páginas utilizam o metadado `roles` para definir quem pode acessar. Se for uma lista vazia, ela é destinada a usuários não autenticados, rotas que definem quem pode acessar exigem autenticação, se não houver esse meta-dado, então todos podema acessar.

Além disso, `src/main.ts` observa alterações subsequentes de autenticação e atualiza os dados do usuário atual automáticamente. Por enquanto, ela não muda a rota do usuário caso o novo estado da autenticação viole as regras definidas em `roles`

## Dados

Os modelos em `src/database/` encapsulam operações sobre documentos e coleções do Firestore, reutilizando as operações de `BaseDocument` quando aplicável. As instâncias do Firebase Authentication e Cloud Firestore são inicializadas em `src/database/firebase.ts`. Os stores e componentes utilizam esses modelos para ler e alterar os dados apresentados nas páginas.

## Desenvolvimento e testes

- `npm run dev`: inicia o servidor local do Vite.
- `npm run type-check`: valida os tipos.
- `npm run build`: executa a verificação de tipos e gera o build de produção.
- `npm run format`: formata o código seguindo algumas das convenções da equipe.
