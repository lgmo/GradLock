Feature: Listar reservas no banco de dados

Scenario: Exibir todas as reservas de sala
  Given que existem reservas de sala registradas no sistema
  And  está na página "Salas"
  When o usuário solicita a lista de todas as reservas
  Then o sistema exibe todas as reservas cadastradas

Scenario: Exibir reservas de uma sala sem reservas cadastradas
  Given que não existem reservas para a sala "E120"
  And  está na página "Salas"
  When o usuário solicita as reservas da sala "E120"
  Then o sistema responde com sucesso
  And informa que não há reservas para a sala

Scenario: Exibir reservas de uma sala específica
  Given que existem reservas para a sala "D003"
  And  está na página "Salas"
  When o usuário solicita as reservas da sala "D003"
  Then o sistema responde com sucesso
  And exibe todas as reservas da sala "D003"

Scenario: filtrar lista de salas 
  Given que o usuário esteja procurando uma sala para reservar
  And  está na página "Salas"
  When o usuário seleciona a capacidade "até 40 pessoas"
  And Escolhe os equipamentos "computador" e "projetor" 
  And o usuário solicita a lista de salas
  Then o sistema retorna com sucesso a lista de salas com os critérios selecionados