Feature: Leitura de salas
 
Scenario: Listar todas as salas com sucesso
Given existem as salas "GRAD 1", "GRAD 2" e "GRAD 3" cadastradas no sistema
When o usuário logado com cpf "12345678901" solicita a lista de todas as salas
Then o sistema retorna todas as salas "GRAD 1", "GRAD 2" e "GRAD 3"
And a mensagem "Salas recuperadas com sucesso" é exibida

Scenario: Listar salas quando não há salas cadastradas
Given existe nenhuma sala cadastrada no sistema
When o usuário logado com cpf "12345678901" solicita a lista de todas as salas
Then o sistema retorna uma lista vazia
And a mensagem "Salas recuperadas com sucesso" é exibida