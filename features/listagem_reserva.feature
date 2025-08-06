Feature: Listagem de salas

Scenario: Listar as reservas do usuario com sucesso.
  Given existem as seguintes reservas cadastradas no sistema:
    | nome_sala | data_reserva | horario_reserva |
    | "GRAD 6"  | "2025-07-18" | "10:00"         |
    | "GRAD 6"  | "2025-07-19" | "14:00"         |
    | "AUD 1"   | "2025-07-20" | "09:00"         |
  When o usuário solicita a lista de todas as suas reservas
  Then o sistema deve exibir uma lista com as seguintes reservas:
    | Data da Reserva | Horário da Reserva |
    | "2025-07-18"    | "10:00"            |
    | "2025-07-19"    | "14:00"            |

Scenario: Visualizar as reservas do dia 18
  Given existem as seguintes reservas cadastradas no sistema:
    | nome_sala | data_reserva | horario_reserva |
    | "GRAD 6"  | "2025-07-18" | "10:00"         |
    | "GRAD 6"  | "2025-07-23" | "17:00"         |
    | "AUD 1"   | "2025-07-20" | "19:00"         |    
  When o admin solicita a lista de reservas para "2025-07-18"
  Then o sistema retorna todas as reservas ordenadas por data
    | Data da Reserva | Horário da Reserva |
    | "2025-07-18"    | "10:00"            |
