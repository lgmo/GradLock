Feature: Edição de salas
 
Scenario: Edição de sala com sucesso
Given o administrador "Pedro Dias" com cpf "34567890123"
And ele está na página de edição de salas da sala "GRAD 04"
When ele edita o campo "Descrição" para "Laboratório renovado"
And seleciona "Editar"
Then a mensagem "Sala atualizada com sucesso" é exibida.

Scenario: Edição de sala mal sucedida por falta de dados
Given o administrador "Pedro Dias" com cpf "34567890123"
And ele está na página de edição de salas da sala "GRAD 04"
When ele seleciona "Editar"
Then a mensagem "Nenhum dado fornecido para atualização" é exibida.

Scenario: Erro na edição de sala por nome indisponível
Given o administrador "Pedro Dias" com cpf "34567890123"
And ele está na página de edição de salas da sala "GRAD 04"
And existe uma sala com o nome "GRAD 05" cadastrada
When ele edita o campo "Nome da sala" para "GRAD 05"
And seleciona "Editar"
Then a mensagem "Falha na edição. Esse nome está indisponível" é exibida.

Scenario: Erro na edição de sala por capacidade negativa
Given o administrador "Pedro Dias" com cpf "34567890123" 
And ele está na página de edição de salas da sala "GRAD 04"
When ele edita o campo "Capacidade" para "-15"
And seleciona "Editar"
Then a mensagem "Falha na edição. A capacidade deve ser um número positivo!" é exibida.
