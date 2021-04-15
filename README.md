# TBank

Este projeto foi realizado para um desafio.

Quando eu tiver tempo irei disponibilizar no meu dominio.
Demo-site: [http://tbank.thiagotms.tech](http://tbank.thiagotms.tech) !    
Demo-api: [http://tbank-api.thiagotms.tech](http://tbank-api.thiagotms.tech) !   

## Esse projeto usa :sparkles: 
:heavy_check_mark: Javascript(ES6+)    
:heavy_check_mark: TypeScript   
:heavy_check_mark: React(Next.js) com SSR  
:heavy_check_mark: ExpressJs
:heavy_check_mark: ObjectionJS e Knex  
:heavy_check_mark: Postgres
:heavy_check_mark: Docker   
:heavy_check_mark: Jest(Banck-end apenas)  

## Coisas que podem ser feitas no projeto :clipboard::construction::construction_worker:  
- CI/CD  
- Documentação da API(Swagger)  

## Outras informações

- Toda aplicação ta em português.
- No backend tem um teste de integração feito com jest
- A interface visual foi feita apenas com css puro, sem ajuda de frameworks como bootstrap/tailwind.
- As bibliotecas usada no Front-End foi axios, react-icons e react-toastify. Esse último foi para mostrar a mensagem de erro do servidor, tanto validação como falha no acesso a api.

## Executando o projeto para desenvolvimento(docker)

Primeiro clone o projeto em uma pasta de sua escolha.  
Após essa etapa, na raiz do projeto você deverá encontrar o .env.example logo após você deverá criar um .env a partir dele
Depois de preparar o .env na raiz do projeto, execute o docker-compose para fazer build das imagens e executar os containers a partir da configuração do .env:  
```
docker-compose up
```
dettached mode:  
```
docker-compose up -d
```
Build novamente e executar o container:  
```
docker-compose up --build
```

Para acessar as aplicações separadamente(Caso não tenha mudado no .env):  
Front-end: [http://localhost:3002](http://localhost:3002)  
Back-end: [http://localhost:3001](http://localhost:3001)

O build do Dockerfile é feito com abordagem de multi-stage, caso queira mudar de target basta mudar o NODE_ENV entre(production e development).  

### Parando os containers

Caso deseje parar os containers, basta entrar na raiz do projeto e usar os seguintes comando:  

```
docker-compose stop
```

### Como iniciar o teste de integração com Jest(Backend apenas)

Primeiramente você deve encontrar o container do backend usando o seguinte comando:  
```
docker ps 
```
Após identificar o container, você deve abrir o terminal do container e executar o comando de teste nele: 
Você irá trocar o target dessa linha por 'backend-development':  

```
docker exec -it {container_id} sh
npm run test
```

O teste deverá ser executado normalmente, mostrando o resultado do teste no terminal.

