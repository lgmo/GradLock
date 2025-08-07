Feature: Autenticação de Usuários - Serviço

  Scenario: Login bem-sucedido com CPF e senha válidos
    Given que existe uma usuária cadastrada com o CPF "34567890123" e a senha "041102"
    When for realizada uma requisição POST para "/api/auth/login" com o CPF "34567890123" e a senha "041102"
    Then a autenticação deve ser realizada com sucesso
    And o sistema deve retornar o status 200
    And a resposta deve ter o seguinte payload no formato JSON:
      """
      {
        "accessToken": "<jwt_access_token>",
        "refreshToken": "<jwt_refresh_token>",
        "expiresIn": "<jwt_expires_in>",
        "success": true
      }
      """

  Scenario: Login mal-sucedido por CPF inexistente
    Given que não existe nenhuma usuária cadastrada com o CPF "45678901234"
    When for realizada uma requisição POST para "/api/auth/login" com o CPF "45678901234" e a senha "051203"
    Then a autenticação deve ser rejeitada
    And o sistema deve retornar o status 404
    And a resposta deve ter o seguinte payload no formato JSON:
      """
      {
        "status": "fail",
        "message": "Usuário com cpf 46578901234 não encontrado.",
        "success": false
      }
      """

  Scenario: Login mal-sucedido por senha incorreta
    Given que existe uma usuária cadastrada com o CPF "56789012345" e a senha "senha_correta"
    When for realizada uma requisição POST para "/api/auth/login" com o CPF "56789012345" e a senha "060104"
    Then a autenticação deve ser rejeitada
    And o sistema deve retornar o status 401
    And a resposta deve ter o seguinte payload no formato JSON:
      """
      {
        "status": "fail",
        "message": "password inválido.",
        "success": false
      }
      """

  Scenario: Login mal-sucedido por CPF ausente
    When for realizada uma requisição POST para "/api/auth/login" com senha "abc123" e sem preencher o "cpf"
    Then o sistema deve rejeitar a requisição
    And o sistema deve retornar o status 400
    And a resposta deve ter o seguinte payload no formato JSON:
      """
      {
        "status": "fail",
        "message": "cpf: cpf deve conter exatamente 11 dígitos",
        "success": false
      }
      """

  Scenario: Login mal-sucedido por senha ausente
    When for realizada uma requisição POST para "/api/auth/login" com o CPF "56789012345" e sem preencher a "senha"
    Then o sistema deve rejeitar a requisição
    And o sistema deve retornar o status 400
    And a resposta deve ter o seguinte payload no formato JSON:
      """
      {
        "status": "fail",
        "message": "password: password deve ter pelo menos 6 caracteres",
        "success": false
      }
      """