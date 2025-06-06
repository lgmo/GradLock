feature: Verificação de reservas (confirmação ou negação)

Scenario: Um administrador busca as solicitações pendentes.
Given um "administrador" está logado no sistema
And  a página "início" está aberta
When o usuário seleciona a página "solicitações"
Then uma lista com todas as solicitações pendentes é exibida

Scenario: Um administrador confirma uma reserva
Given um "administrador" está logado no sistema
And  a página "solicitações" está aberta
When o usuário seleciona a solicitação para a sala "a-102"
Then uma descrição sobre a solicitação é exibida
And  as opções "confirmar" e "negar" são exibidas
When o usuário seleciona "confirmar"
Then  a sala "a-102" é reservada
