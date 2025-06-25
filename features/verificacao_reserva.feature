feature: Verificação de reservas (confirmação ou negação)

Scenario: Um administrador busca as solicitações pendentes.
  Given o "administrador" "Breno" está logado no sistema
  And a página "início" está aberta
  And a solicitação para a sala "A101", por "João", para "05/08/2025" às "14:30" está com o status "pendente"
  And a solicitação para a sala "B202", por "Gabriel", para "10/08/2025" às "10:30" está com o status "pendente"
  And a solicitação para a sala "C303", por "Julia", para "03/08/2025" às "08:30" está com o status "confirmada"
  When o usuário seleciona a página "solicitações"
  Then a solicitação para a sala "A101" aparece na lista
  And a solicitação para a sala "B202" aparece na lista

Scenario: Um administrador confirma uma reserva
  Given o "administrador" "Breno" está logado no sistema
  And a solicitação para a sala "A102", por "Julia", para "10/08/2025" às "10:30" está com o status "pendente"
  And a página "solicitações" está aberta
  When o usuário confirma a solicitação para a sala "A102"
  Then a sala "A102" é reservada
  And o status para a solicitação da sala "A102" é alterado para "confirmada"

Scenario: Um administrador nega uma reserva
  Given o "administrador" "Breno" está logado no sistema
  And a página "solicitações" está aberta
  And a solicitação para a sala "A102", por "Julia", para "10/08/2025" às "10:30" está com o status "pendente"
  When o usuário nega a solicitação para a sala "A102"
  Then a sala "A102" não é reservada
  And o status para a solicitação da sala "A102" é alterado para "negada"