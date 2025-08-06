Feature: Cadastro de novas salas

Scenario: Cadastro de sala bem sucedido
Given o administrador "Pedro Dias" com cpf "34567890123" está na página de cadastro de salas
When ele preenche o campo "Nome da Sala" com "GRAD 6", "Descrição" com "Laboratório de tamanho médio", "Capacidade" com "40", seleciona o campo "Tem computadores?", seleciona o campo "Tem projetores?"
And seleciona "Cadastrar"
Then uma mensagem de sucesso "Cadastro realizado com sucesso!" é exibida

Scenario: Cadastro de sala mal sucedido por falta de informações
Given o administrador "Pedro Dias" com cpf "34567890123" está na página de cadastro de salas
When ele preencher o campo "Descrição" do formulario com ""
And seleciona "Cadastrar"
Then uma mensagem de erro "Cadastro não realizado. Todos os campos devem ser preenchidos!" é exibida.

Scenario: Cadastro de sala mal sucedido por capacidade negativa
Given o administrador "Pedro Dias" com cpf "34567890123" está na página de cadastro de salas
When ele preenche o campo "Nome da Sala" com "GRAD 7", "Descrição" com "Laboratório de tamanho médio", "Capacidade" com "-40", seleciona o campo "Tem computadores?", seleciona o campo "Tem projetores?"
And seleciona "Cadastrar"
Then uma mensagem de erro "Capacidade deve ser um número positivo" é exibida.

Scenario: Cadastro de sala mal sucedido por ela já estar cadastrada
Given o administrador "Pedro Dias" com cpf "34567890123" está na página de cadastro de salas
When ele preenche o campo "Nome da Sala" com "E112"
And ele preenche os outros campos do formulário
And seleciona "Cadastrar"
Then uma mensagem de erro "Cadastro não realizado. Sala já existente!" é exibida
