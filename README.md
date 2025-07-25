# EduSystem API

Este projeto é uma API para um sistema educacional, desenvolvida em **Node.js** utilizando **Express** e **PostgreSQL** como banco de dados relacional. O objetivo é fornecer uma base robusta e extensível para o gerenciamento de usuários, alunos, professores, secretarias, turmas, matérias, notas, faltas, recados, tarefas e outros recursos escolares.

## Tecnologias Utilizadas

- **Node.js**: Plataforma para execução do JavaScript no backend.
- **Express**: Framework web minimalista para criação de APIs REST.
- **PostgreSQL**: Banco de dados relacional robusto e open source.
- **pg**: Cliente PostgreSQL para Node.js.
- **bcrypt**: Utilizado para hash de senhas de usuários.
- **dotenv**: Gerenciamento de variáveis de ambiente.
- **date-fns**: Manipulação e formatação de datas.
- **JSDoc**: Documentação automática de funções e classes via comentários.

## Padrões de Projeto e Arquitetura

O projeto segue uma arquitetura baseada em **Domain-Driven Design (DDD)**, separando claramente as responsabilidades em:

- **Entities (Entidades)**: Representam os modelos de domínio do sistema, como `Usuario`, `Aluno`, `Professor`, etc. Cada entidade possui métodos estáticos para conversão de dados vindos do banco de dados (`fromRow`) e de objetos (`fromObj`).
- **Services (Serviços)**: Responsáveis pela lógica de negócio e acesso ao banco de dados. Os serviços utilizam **raw SQL queries** para maior controle e performance, evitando ORMs pesados. Exemplo: `UsuarioService`, `AlunoService`.
- **Controllers**: Camada responsável por receber as requisições HTTP, chamar os serviços e retornar as respostas apropriadas. Utilizam o Express Router para organização das rotas.
- **Migrations**: Scripts SQL versionados para criação e atualização do schema do banco de dados.

## Uso de JSDoc

O código utiliza **JSDoc** extensivamente para documentar funções, métodos, parâmetros e retornos. Isso facilita o entendimento do código, a geração de documentação automática e a integração com editores modernos, que conseguem fornecer autocomplete e validação de tipos a partir dos comentários.

Exemplo:
```js
/**
 * Cria um novo usuário no banco de dados
 * @param {NovoUsuario} novoUsuario - O usuário a ser criado
 * @returns {Promise<Usuario>} retorna o usuário criado
 */
async create(novoUsuario) { ... }
```

## Consultas SQL Diretas

Ao invés de utilizar um ORM, o projeto faz uso de **consultas SQL diretas** (raw queries) através do pacote `pg`. Isso garante maior transparência, controle sobre as operações e facilidade para otimizações específicas do PostgreSQL.

## Separação de Entidades, Serviços e Controladores

- **Entidades**: Não possuem dependências externas e representam apenas os dados e regras do domínio.
- **Serviços**: Realizam toda a lógica de negócio, validações e interações com o banco de dados.
- **Controladores**: Recebem e tratam as requisições HTTP, delegando a lógica para os serviços e retornando respostas padronizadas.

Essa separação facilita a manutenção, testes e evolução do sistema.

## Como rodar o projeto

1. Instale as dependências:
   ```
   npm install
   ```
2. Configure as variáveis de ambiente no arquivo `.env` (veja o exemplo em `.env.example`).
3. Execute as migrações do banco de dados:
   ```
   MIGRATE_DB=true node src/index.js
   ```
4. Inicie o servidor:
   ```
   npm run dev
   ```

## Testes

Os testes utilizam a API do Node.js (`node:test`) e cobrem os principais fluxos das entidades e serviços.
