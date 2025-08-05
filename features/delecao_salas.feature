Feature: Deleção de salas
 
Scenario: Deleção de sala com sucesso
Given o administrador "Pedro Dias"
And existe uma sala com ID "1" sem reservas no sistema
When ele solicita a deleção da sala com ID "1"
Then a mensagem "Sala deletada com sucesso" é exibida

Scenario: Erro na deleção por ID inválido
Given o administrador "Pedro Dias"
When ele solicita a deleção da sala com ID "abc"
Then a mensagem "ID da sala deve ser um número válido" é exibida

Scenario: Erro na deleção por sala inexistente
Given o administrador "Pedro Dias"
When ele solicita a deleção da sala com ID "999"
Then a mensagem "Sala não encontrada" é exibida

Scenario: Erro na deleção por reservas ativas
Given o administrador "Pedro Dias"
And existe uma sala com ID "1" com reservas no sistema
When ele solicita a deleção da sala com ID "1"
Then a mensagem "Não é possível deletar a sala. Existem reservas ativas ou futuras para esta sala" é exibida
