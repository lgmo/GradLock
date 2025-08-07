Feature: Listagem de salas

Scenario: Listar as reservas sendo ADMIN.
  Given o ADMIN está logado com CPF "12345678900" e senha "admin123"
  And existem as seguintes reservas cadastradas no sistema:
    | id_room | data_reserva | horario_reserva |
    |    "1"  | "2025-07-18" | "10:00" |
    |    "1"  | "2025-07-18" | "14:00" |
    |    "1"  | "2025-07-20" | "09:00" |
    |    "2"  | "2025-07-18" | "10:00" |

  When o ADMIN solicita a lista de todas as reservas da sala de id "1" e do dia "2025-07-18"
  Then o sistema deve exibir uma lista com as seguintes reservas:
    | Data da Reserva | Horário da Reserva |
    | "2025-07-18"    | "10:00"            |
    | "2025-07-18"    | "14:00"            |
  And o sistema deve exibir "Reservas recuperadas com sucesso"

Scenario: Visualizar as suas reservas de usuario
  Given Breno Miranda está logado com CPF "23456789012" e senha "310590"
  And existem as seguintes reservas cadastradas no sistema:
    | id_user | data_reserva | horario_reserva |
    |     "1" | "2025-07-18" |     "10:00"     |
    |     "2" | "2025-07-20" |     "19:00"     |    
  When Breno solicita a lista de suas reservas
  Then o sistema retorna sua reserva de data "2025-07-18"
  And o sistema deve exibir "Reservas recuperadas com sucesso"

