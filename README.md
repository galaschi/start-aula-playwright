# Aula de Playwright - Hat Store

> [!NOTE]
> Este treinamento foi pensado para evoluir de forma gradual, saindo da base da automação de testes e avançando para práticas mais robustas de projeto.
> Nestas aulas abordaremos gerenciamento de massa de dados, diversidade de asserções, regressão visual, paralelismo, fixtures, scripts, configurações e execuções por linha de comando.
> Também avançaremos em testes de API, incluindo funcionamento básico de testes automatizados, padrão de arquitetura e testes de contrato.

## Como acessar as aulas
- Este README permanece completo na `main` e tambem em todas as branches das aulas.
- Cada aula terá seu conteúdo em uma branch específica (`aula-1`, `aula-2`, etc.).
- Para acessar uma aula, faça checkout da branch correspondente.


## Aula 1: Estratégia de Automação de Testes

### Acessar o código
- `git switch aula-1`
ou
- `git switch aula-1-dever`

### Conteúdo
- Instalação do projeto Playwright.
- Implementação dos testes:
   - `Buscar por um produto`
   - `Filtrar por categoria (Dever de casa)`
   - `Filtrar por preco (Dever de casa)`

### Material
- https://cwisw-my.sharepoint.com/:p:/r/personal/gabriel_cartelli_cwi_com_br/Documents/Crescer%20QA%20-%20Aula%2001%20-%20Automa%C3%A7%C3%A3o.pptx?d=w6eb3dc41e90b40138a2fe35aa849a4e4&csf=1&web=1&e=F0L2ar

### Documentação oficial do Playwright
- https://playwright.dev/docs/intro

### Como iniciar um projeto em Playwright
1. Instale o Node.js (versão LTS): https://nodejs.org/
2. Crie uma pasta para o projeto e acesse a pasta:
   - `mkdir meu-projeto-playwright`
   - `cd meu-projeto-playwright`
3. Inicialize o Playwright:
   - `npm init playwright@latest`
4. Responda as perguntas do assistente exatamente assim:
   - `√ Do you want to use TypeScript or JavaScript? · JavaScript`
   - `√ Where to put your end-to-end tests? · tests`
   - `√ Add a GitHub Actions workflow? (Y/n) · false`
   - `√ Install Playwright browsers (can be done manually via 'npx playwright install')? (Y/n) · true`


## Aula 2: Padrões de Projetos e Boas Práticas

### Acessar o código
- `git switch aula-2`
ou
- `git switch aula-2-dever`

### Conteúdo
- Refatoração dos testes para uma estrutura mais organizada.
- Aplicação de `Page Object`.
- Organização dos testes em estilo `BDD` (Feature e Cenários).
- Criação da camada de `steps` para centralizar ações e validações.
- Implementação dos testes:
   - `Cadastrar um usuario (Dever de casa)`
   - `Realizar login (Dever de casa)`

### Material
- https://cwisw-my.sharepoint.com/:p:/r/personal/gabriel_cartelli_cwi_com_br/Documents/Crescer%20QA%20-%20Aula%2002%20-%20Automa%C3%A7%C3%A3o.pptx?d=wd6685b2bb2244333a71c2c7ffc498061&csf=1&web=1&e=FdZXjT


## Aula 3: Automação frontend com Playwright

### Acessar o código
- `git switch aula-3`

### Conteúdo
- Separação dos testes por contexto de negócio (home, filtros, login e visual).
- Cenários combinados de componentes usando categoria + faixa de preço + busca.
- Cobertura de login e cadastro com cenários positivos e negativos.
- Estratégia de massa de dados com dados centralizados e factory para usuário dinâmico.
- Regressão visual da home com baseline versionado.
- Scripts de CLI para executar suíte completa, parcial e visual.
- Organização para manutenção futura

### Estrutura principal da Aula 3
- `pages/home.page.js`
- `pages/auth.page.js`
- `tests/data/home.data.js`
- `tests/data/login.data.js`
- `tests/autenticado/carrinho.spec.js`
- `tests/home/home.spec.js`
- `tests/login/cadastro.spec.js`
- `tests/login/login.spec.js`

### Comandos de execução (CLI)
- `npm run test`
- `npm run test:headed`
- `npm run test:smoke`
- `npm run test:filters`
- `npm run test:home`
- `npm run test:cadastro`
- `npm run test:login`
- `npm run test:login:todos`
- `npm run test:autenticado`
- `npm run test:visual`
- `npm run test:visual:update`
- `npm run report`

### Material
- Nesta aula, o conteúdo está 100% na própria branch (`aula-3`).