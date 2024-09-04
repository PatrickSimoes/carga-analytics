# Aviso! #

Antes de executar o projeto, é **muito importante** baixar as dependências. Após baixar as dependências, será necessário criar o arquivo `.env` com as variáveis de ambiente necessárias,  já deixei pronto um `.env exemple`.

---

## Comando para baixar as dependências

Foi utilizado o Node.js na versão **22.7**.

Você pode usar os seguintes comandos para instalar as dependências do projeto:

```bash
npm install
```
ou, se estiver usando o Yarn:

```bash
yarn install
```
## Arquivo `.env`

### Criando a chave de acesso:

Caso você não tenha uma chave de acesso, será necessário criá-la no **Google Cloud Console**.

Siga os passos abaixo:

1. Crie um novo projeto no Google Cloud, se ainda não o fez.
2. Navegue até **APIs e Serviços > Credenciais**.
3. Crie uma nova chave de API para acessar o Google Sheets API.
4. O link direto para a página de credenciais é:  
  <a href="https://console.cloud.google.com/apis/credentials" target="_blank">Google Cloud Console - APIs e Serviços / Credenciais</a>

## Comando para rodar o projeto
Após configurar o arquivo .env e com o console aberto na raiz do projeto, execute o seguinte comando para rodar o projeto:

```bash
npx ts-node src/index.ts
```

