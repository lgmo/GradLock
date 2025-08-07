Feature: Cadastro de Usuários - Interface Web

  Scenario: Cadastro válido de estudante pela interface
    Given estou na tela de cadastro de estudante
    And preencho o campo "Nome" com "João Pedro da Silva"
    And preencho o campo "Curso" com "Ciência da Computação"
    And preencho o campo "Matrícula" com "2021234567"
    And preencho o campo "CPF" com "123.456.789-01"
    And preencho o campo "Senha" com "020301"
    When clico no botão "Cadastrar"
    Then devo ver uma mensagem de sucesso
    And devo ser redirecionado para a tela de login ou dashboard
    And os campos devem ser limpos após o envio

  Scenario: Cadastro válido de professor pela interface
    Given estou na tela de cadastro de professor
    And preencho o campo "Nome" com "Breno Miranda"
    And preencho o campo "CPF" com "234.567.890-12"
    And preencho o campo "Senha" com "310590"
    When clico no botão "Cadastrar"
    Then devo ver uma mensagem de sucesso
    And devo ser redirecionado para a tela de login ou dashboard
    And os campos devem ser limpos após o envio

  Scenario: Tentativa de cadastro de estudante com campos obrigatórios faltando
    Given estou na tela de cadastro de estudante
    And preencho apenas o campo "Nome" com "João Felipe"
    And preencho o campo "CPF" com "345.678.901-23"
    When clico no botão "Cadastrar"
    Then devo ver uma mensagem de erro informando que o campo "Curso" é obrigatório
    And devo ver uma mensagem de erro informando que o campo "Matrícula" é obrigatório
    And devo ver uma mensagem de erro informando que o campo "Senha" é obrigatório

  Scenario: Tentativa de cadastro com CPF já cadastrado
    Given estou na tela de cadastro de professor
    And preencho o campo "Nome" com "Paulo Borba"
    And preencho o campo "CPF" com "456.789.012=34"
    And preencho o campo "Senha" com "password123"
    And o CPF "45678901234" já está cadastrado no sistema
    When clico no botão "Cadastrar"
    Then devo ver uma mensagem de erro "Usuário com esse CPF já existe"

  Scenario: Tentativa de cadastro com CPF inválido
    Given estou na tela de cadastro de estudante
    And preencho o campo "Nome" com "Maria Silva"
    And preencho o campo "CPF" com "123"
    And preencho o campo "Senha" com "mariapassword"
    When clico no botão "Cadastrar"
    Then devo ver uma mensagem de erro "cpf deve conter exatamente 11 dígitos"
