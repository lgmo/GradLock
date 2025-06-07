feature: Verificação de reservas (confirmação ou negação)

Scenario: Um administrador busca as solicitações pendentes.
  Given um "administrador" está logado no sistema
  And a página "início" está aberta
  When o usuário seleciona a página "solicitações"
  Then uma lista com todas as solicitações pendentes é exibida

Scenario: Um administrador confirma uma reserva
  Given um "administrador" está logado no sistema
  And a página "solicitações" está aberta
  When o usuário seleciona a solicitação para a sala "a-102"
  Then uma descrição sobre a solicitação é exibida
  And as opções "confirmar" e "negar" são exibidas
  When o usuário seleciona "confirmar"
  Then a sala "a-102" é reservada
  And a solicitação para a sala "a-102" é marcada como confirmada

Scenario: Um administrador nega uma reserva
  Given um "administrador" está logado no sistema
  And a página "solicitações" está aberta
  When o usuário seleciona a solicitação para a sala "b-205"
  Then uma descrição sobre a solicitação é exibida
  And as opções "confirmar" e "negar" são exibidas
  When o usuário seleciona "negar"
  Then a solicitação para a sala "b-205" é rejeitada
  And a sala "b-205" permanece disponível para o horário solicitado

Scenario: Notificação de confirmação para o solicitante
  Given uma solicitação de reserva para a sala "d-410" foi confirmada por um administrador
  When o status da reserva é atualizado para "confirmada"
  Then o usuário que solicitou a reserva recebe uma notificação informando a confirmação

Scenario: Notificação de negação para o solicitante
  Given uma solicitação de reserva para a sala "e-115" foi negada por um administrador
  When o status da reserva é atualizado para "negada"
  Then o usuário que solicitou a reserva recebe uma notificação informando a negação

Scenario: Lista de solicitações pendentes vazia
  Given um "administrador" está logado no sistema
  And não há solicitações de reserva pendentes
  When o usuário seleciona a página "solicitações"
  Then uma mensagem indicando "Nenhuma solicitação pendente" é exibida