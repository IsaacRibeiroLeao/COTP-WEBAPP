# COTP-WEBAPP

Aplicação web desenvolvida em Angular para gerenciamento de usuários, eventos, categorias de ministério e aprovações.

## Funcionalidades

O projeto possui páginas e componentes voltados para a gestão e controle de processos, incluindo:
* **Autenticação:** Sistema de login e controle de acesso via guards e interceptors.
* **Painel (Dashboard):** Visão geral da aplicação.
* **Gerenciamento de Usuários:** Administração de usuários do sistema.
* **Registro de Eventos:** Cadastro e controle de eventos.
* **Categorias de Ministério:** Organização e gerenciamento de categorias ministeriais.
* **Aprovações:** Fluxo de aprovações.
* **Layout Responsivo:** Estrutura baseada em componentes de layout como cabeçalho (*header*) e barra lateral (*sidebar*).

## Tecnologias

Este projeto foi construído utilizando as seguintes tecnologias e bibliotecas:

* **[Angular](https://angular.io/)** (^19.2.0) - Framework principal
* **[Angular Material](https://material.angular.io/)** (^19.2.15) & **CDK** - Biblioteca de componentes de interface
* **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS para estilização
* **[RxJS](https://rxjs.dev/)** - Programação reativa
* **[Auth0 Angular JWT](https://github.com/auth0/angular-jwt)** - Gerenciamento de tokens JWT
* **TypeScript** - Linguagem de programação
* **Jasmine / Karma** - Ferramentas de testes

## Instalação

Pré-requisitos: Node.js e um gerenciador de pacotes (como npm ou yarn) instalados.

1. Clone o repositório para a sua máquina:
   ```bash
   git clone <url-do-repositorio>
   cd cotp-webapp
   ```

2. Instale as dependências do projeto:
   ```bash
   npm install
   # ou utilizando o yarn
   yarn install
   ```

## Uso

### Executando em modo de desenvolvimento
Para iniciar o servidor de desenvolvimento, execute:
```bash
npm start
# ou
yarn start
```
Acesse `http://localhost:4200/` no seu navegador. A aplicação será recarregada automaticamente caso você altere qualquer arquivo fonte.

### Construção (Build)
Para gerar os arquivos de distribuição para produção na pasta `dist/`:
```bash
npm run build
# ou
yarn build
```

### Executando Testes
Para executar os testes unitários via Karma/Jasmine:
```bash
npm test
# ou
yarn test
```

## Licença

Este repositório não possui uma licença identificada especificada.
