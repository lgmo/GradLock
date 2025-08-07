Feature: Cadastro de Usuários - Serviço

  Scenario: Cadastro válido de estudante
    Given um usuário não cadastrado com CPF "12345678901"
    When é enviada uma requisição POST para "/api/users" com payload:
      """
      {
        "name": "João Pedro da Silva",
        "userType": "STUDENT",
        "course": "Ciência da Computação",
        "enrollment": "2021234567",
        "cpf": "12345678901",
        "password": "020301"
      }
      """
    Then o sistema deve retornar status 201
    And a resposta deve conter um ID de usuário gerado
    And a resposta deve ter o seguinte payload no formato JSON:
      """
      {
        "id": "<user_id>",
        "name": "João Pedro da Silva",
        "userType": "STUDENT",
        "course": "Ciência da Computação",
        "enrollment": "2021234567",
        "cpf": "12345678901"
      }
      """
    And <user> deve não ser null
    And o banco de dados deve conter o usuário como "STUDENT"

  Scenario: Cadastro válido de professor
    Given um usuário não cadastrado com CPF "23456789012"
    When é enviada uma requisição POST para "/api/users" com payload:
      """
      {
        "name": "Breno Miranda",
        "userType": "TEACHER",
        "cpf": "23456789012",
        "password": "310590"
      }
      """
    Then o sistema deve retornar status 201
    And a resposta deve ter o seguinte payload no formato JSON:
      """
      {
        "id": "<user_id>",
        "name": "Breno Miranda",
        "userType": "TEACHER",
        "cpf": "23456789012"
      }
      """
    And o campo "id" da resposta deve estar presenter
    And o campo "id" da resposta não pode ser nulo

  Scenario: Tentativa de cadastro com campos obrigatórios faltantes
    Given um CPF não cadastrado "34567890123"
    When é enviada uma requisição POST para "/api/users" com payload:
      """
      {
        "name": "João Felipe",
        "userType": "STUDENT",
        "cpf": "34567890123"
      }
      """
    Then o sistema deve retornar status 400
    And o campo "status" da resposta deve ser "fail"
    And o campo "success" da resposta deve ser false
    And o campo "message" da resposta deve conter "password é obrigatório"
    And o campo "message" da resposta deve conter "course é obrigatório"
    And o campo "message" da resposta deve conter "enrollment é obrigatório"

  Scenario: Tentativa de cadastro com usuário já existente
    Given um usuário já cadastrado com CPF "45678901234"
    When é enviada uma requisição POST para "/api/users" com payload:
      """
      {
        "name": "Paulo Borba",
        "userType": "TEACHER",
        "cpf": "45678901234",
        "password": "password123"
      }
      """
    Then o sistema deve retornar status 409
    And a resposta deve ter o seguinte payload no formato JSON:
      """
      {
        "status": "fail",
        "message": "User with cpf 12345678901 already exists",
        "success": false
      }
      """

  Scenario: Tentativa de cadastro com CPF inválido
    When é enviada uma requisição POST para "/api/users" com payload:
      """
      {
        "name": "Maria Silva",
        "userType": "STUDENT",
        "cpf": "123",
        "password": "mariapassword"
      }
      """
    Then o sistema deve retornar status 400
    And o campo "status" da resposta deve ser "fail"
    And o campo "success" da resposta deve ser false
    And o campo "message" da resposta deve conter "cpf: CPF deve conter exatamente 11 dígitos"