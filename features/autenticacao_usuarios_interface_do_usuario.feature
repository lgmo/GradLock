Feature: Autenticação de Usuários - Interface do Usuário

  Scenario: Login bem-sucedido com CPF e senha válidos
    Given que a usuária "Maria Fernanda" está na tela de login
    And ela possui cadastro com CPF "345.678.901-23" e senha "041102"
    When ela preenche o campo "CPF" com "345.678.901-23"
    And preenche o campo "Senha" com "041102"
    And clica no botão "Entrar"
    Then ela deve ser redirecionada para a tela principal da aplicação
    And deve visualizar a mensagem "Login bem-sucedido!"
    And deve ser exibido um token de autenticação armazenado no localStorage ou sessionStorage

  Scenario: Login mal-sucedido por CPF inexistente
    Given que a usuária "Joana Bezerra" está na tela de login
    When ela preenche o campo "CPF" com "456.789.012-34"
    And preenche o campo "Senha" com "051203"
    And clica no botão "Entrar"
    Then ela deve visualizar a mensagem de erro "Usuário com cpf 45678901234 não encontrado."
    And deve permanecer na tela de login

  Scenario: Login mal-sucedido por senha incorreta
    Given que a usuária "Eduarda Maria" está na tela de login
    And possui cadastro com CPF "567.890.123-45" e senha correta
    When ela preenche o campo "CPF" com "567.890.123-45"
    And preenche o campo "Senha" com "060104"
    And clica no botão "Entrar"
    Then ela deve visualizar a mensagem de erro "Password inválido."
    And deve permanecer na tela de login

  Scenario: Login mal-sucedido por ausência de campos obrigatórios
    Given que a usuária "Paula Silva" está na tela de login
    When ela tenta realizar o login sem preencher todos os campos obrigatórios
    And clica no botão "Entrar"
    Then deve ser exibida a mensagem "Preencha todos os campos antes de efetuar o login."
    And o botão "Entrar" deve continuar habilitado
