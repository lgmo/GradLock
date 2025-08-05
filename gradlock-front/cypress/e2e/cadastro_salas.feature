Feature: Cadastro de novas salas - E2E
 
Scenario: Cadastro de sala bem sucedido
Given o administrador está na página de cadastro de salas
When ele preenche o campo "Nome da sala" com "GRAD 01"
And ele preenche o campo "Descrição" com "Laboratório de Graduação 01"
And ele preenche o campo "Capacidade" com "40"
And ele marca a opção "Tem computadores"
And ele marca a opção "Tem projetores"
And ele seleciona "Cadastrar"
Then a mensagem "Sala cadastrada com sucesso" é exibida

Scenario: Cadastro de sala mal sucedido por falta de informações
Given o administrador está na página de cadastro de salas
When ele seleciona "Cadastrar"
Then a mensagem "Nome da sala é obrigatório" é exibida

Scenario: Cadastro de sala mal sucedido por capacidade negativa
Given o administrador está na página de cadastro de salas
When ele preenche o campo "Nome da sala" com "GRAD 02"
And ele preenche o campo "Descrição" com "Laboratório de Graduação 02"
And ele preenche o campo "Capacidade" com "-10"
And ele seleciona "Cadastrar"
Then a mensagem "A capacidade deve ser um número positivo" é exibida

Scenario: Cadastro de sala mal sucedido por ela já estar cadastrada
Given já existe uma sala com nome "GRAD 03"
And o administrador está na página de cadastro de salas
When ele preenche o campo "Nome da sala" com "GRAD 03"
And ele preenche o campo "Descrição" com "Laboratório de Graduação 03"
And ele preenche o campo "Capacidade" com "30"
And ele seleciona "Cadastrar"
Then a mensagem "Já existe uma sala com esse nome" é exibida
