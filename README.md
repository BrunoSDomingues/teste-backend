# Teste Backend - WeFit

Teste Backend para o processo seletivo da WeFit

## Configurando o ambiente

Primeiro é necessário iniciar o banco de dados. Para tal, é necessário ter o `docker` instalado em sua máquina, e executar o comando:

`docker compose up -d`

Será criado um container de MySQL, o qual pode ser acessado via `localhost:3306` e a senha do usuário `root` é `senha_root_123`.

Em seguida, é necessário instalar os pacotes utilizado pelo Node através do comando `npm install`. Com o ambiente configurado, basta rodar o comando `npm start` para iniciar o servidor.

## Documentação

Com o servidor rodando, é possível acessar a página abaixo para acessar a documentação da API via Swagger:

`http://localhost:4568/api-docs/`
