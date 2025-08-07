Feature: Leitura de salas - E2E

Scenario: Listar todas as salas com sucesso
Given existem as seguintes salas cadastradas:
  | nome    | descrição      | capacidade | computadores | projetores |
  | GRAD 08 | Laboratório 8  | 30         | true         | false      |
  | GRAD 09 | Laboratório 9  | 25         | false        | true       |
And o administrador está na página de administração de salas
Then ele deve ver a lista com as salas cadastradas
And a sala "GRAD 08" deve aparecer na lista
And a sala "GRAD 09" deve aparecer na lista

Scenario: Listar salas quando não há salas cadastradas
Given não existem salas cadastradas
And o administrador está na página de administração de salas
Then a mensagem "Nenhuma sala encontrada" é exibida
