Feature: Deleção de salas - E2E

Scenario: Deleção de sala com sucesso
Given existe a sala "GRAD 06" com descrição "Laboratório 6"
And o administrador está na página de administração de salas
When ele seleciona a opção "Deletar" para a sala "GRAD 06"
And confirma a deleção
Then a mensagem "Sala deletada com sucesso" é exibida
And a sala "GRAD 06" não aparece mais na lista

Scenario: Erro na deleção por ID inválido
Given o administrador está na página de administração de salas
When ele tenta deletar uma sala com ID inválido
Then a mensagem "ID de sala inválido" é exibida

Scenario: Erro na deleção por sala inexistente
Given o administrador está na página de administração de salas
When ele tenta deletar uma sala que não existe
Then a mensagem "Sala não encontrada" é exibida

Scenario: Erro na deleção por reservas ativas
Given existe a sala "GRAD 07" com descrição "Laboratório 7"
And a sala "GRAD 07" possui reservas ativas
And o administrador está na página de administração de salas
When ele seleciona a opção "Deletar" para a sala "GRAD 07"
And confirma a deleção
Then a mensagem "Não é possível deletar uma sala com reservas ativas" é exibida
