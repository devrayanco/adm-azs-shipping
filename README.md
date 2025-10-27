# 🚢 Projeto de Gestão de Fretes - AZShip Full Stack

Este é um projeto Full Stack completo desenvolvido para o desafio técnico da **AZShip**. O sistema implementa uma solução de gestão de fretes (CRUD) de forma dinâmica aonde o cálculo do valor do frete é baseado em "Formas de Medida" (regras de cálculo) que são cadastradas pelo próprio usuário.

## ✨ Funcionalidades Principais

* **Autenticação JWT:** Sistema completo de Registro e Login de usuários com tokens JSON Web Tokens (JWT).
* **CRUD de Formas de Medida:** O usuário pode criar suas próprias regras de cálculo (ex: "Peso" (R$/kg), "Distância" (R$/km), "Volume" (R$/m³)).
* **CRUD de Fretes:** O usuário pode criar, listar, editar e remover fretes.
* **Cálculo Automático:** Ao criar ou editar um frete, o sistema calcula o **valor total** automaticamente, multiplicando os valores informados (ex: 30 kg) pelo valor base da "Forma de Medida" correspondente (ex: R$ 2,50/kg).
* **Lógica de Volume:** O frontend possui uma lógica especial: se o usuário seleciona a medida "Volume", ele insere Altura, Largura e Comprimento, e o frontend calcula o `m³` (valor informado) antes de enviar ao backend.
* **Busca e Paginação:** A lista de fretes é paginada e possui um campo de busca genérico que filtra por múltiplas propriedades (descrição, nome da medida, etc.), usando `JpaSpecificationExecutor` no backend.

## 🛠️ Tecnologias Utilizadas

Este projeto é dividido em duas partes principais: `backend` e `frontend`.

### Backend (Java / Spring Boot)

* **Linguagem:** Java 21
* **Framework:** Spring Boot 3
* **Segurança:** Spring Security 6 (com autenticação JWT)
* **Banco de Dados:** Spring Data JPA (Hibernate)
* **Conexão:** SQL Server
* **Validação:** Spring Validation
* **Build:** Maven
* **Outros:** Lombok

### Frontend (React.js)

* **Framework:** React.js 18
* **Build Tool:** Vite.js
* **Roteamento:** `react-router-dom`
* **Requisições HTTP:** `axios`
* **Gerenciamento de Estado:** React Context API

---

## 🚀 Como Executar o Projeto

Para rodar este projeto, você precisará ter o **Backend** e o **Frontend** rodando simultaneamente.

### Pré-requisitos

* **Java JDK 12** (ou superior)
* **Maven** 3.8 (ou superior)
* **Node.js** 18 (ou superior)
* **SQL Server** (qualquer edição, ex: Express, Developer)

---

### 1. Configuração do Backend (Spring Boot)

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/devrayanco/adm-azs-shipping.git

    cd adm-azs-shipping
    ```

2.  **Configuração do Banco de Dados (SQL Server):**
    * Inicie seu SQL Server.
    * Crie um novo banco de dados chamado `azship_db`.
    * Crie um novo usuário de "Logon" (ex: `azship_user` com senha `azship_user`).
    * Dê a este usuário a permissão de `db_owner` no banco `azship_db`.

3.  **Configure o `application.properties`:**
    * Abra o projeto backend (a pasta `adm-azs-shipping`) na sua IDE (VSCode, IntelliJ, etc.).
    * Navegue até `src/main/resources/application.properties`.
    * Atualize as seguintes linhas com suas credenciais do SQL Server:
        ```properties
        # Atualize a URL, usuário e senha
        spring.datasource.url=jdbc:sqlserver://DESKTOP-JER2EAM;databaseName=azship_db;encrypt=false;trustServerCertificate=true;
        spring.datasource.username=azship_user
        spring.datasource.password=azship_user
        
        # Gere sua própria chave secreta para o JWT
        jwt.secret.key=YyNraSpTKFU0blJpNGMldkclKk5eNzUhVjZrNzRuUXU=
        ```

4.  **Execute o Backend:**
    * Pela sua IDE, execute a classe `AdmAzsShippingApplication.java`.
    * O servidor backend estará rodando em `http://localhost:8081`.

---

### 2. Configuração do Frontend (React)

1.  **Abra um novo terminal.**
2.  Navegue até a pasta do frontend (ex: `adm-azs-shipping-frontend`):
    ```bash
    cd adm-azs-shipping-frontend
    ```

3.  **Instale as dependências:**
    ```bash
    npm install
    ```

4.  **Configuração da API:**
    * O frontend está configurado para se conectar à API em `http://localhost:8081`.
    * Se o seu backend estiver rodando em uma porta diferente, ajuste o `baseURL` no arquivo `src/services/api.js`.

5.  **Execute o Frontend:**
    ```bash
    npm run dev
    ```
    * O servidor de desenvolvimento do Vite iniciará.
    * Abra seu navegador e acesse `http://localhost:5173`.

---

## 🏛️ Estrutura da API (Endpoints)

O backend expõe os seguintes endpoints principais (todos protegidos por JWT, exceto `/auth/**`):

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Registra um novo usuário. |
| `POST` | `/api/v1/auth/login` | Autentica um usuário e retorna um token JWT. |
| | | |
| `GET` | `/api/v1/medidas` | Lista todas as Formas de Medida do usuário. |
| `POST` | `/api/v1/medidas` | Cria uma nova Forma de Medida. |
| `PUT` | `/api/v1/medidas/{id}` | Atualiza uma Forma de Medida. |
| `DELETE`| `/api/v1/medidas/{id}` | Exclui uma Forma de Medida. |
| | | |
| `GET` | `/api/v1/fretes` | Lista os fretes (com paginação e busca `?q=...`). |
| `POST` | `/api/v1/fretes` | Cria um novo Frete (com cálculo automático). |
| `GET` | `/api/v1/fretes/{id}` | Busca um Frete específico. |
| `PUT` | `/api/v1/fretes/{id}` | Atualiza um Frete (recalculando o total). |
| `DELETE`| `/api/v1/fretes/{id}` | Exclui um Frete. |