import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

// Step definitions comuns para todos os testes E2E de salas

// Step comum para mensagens
Then('a mensagem {string} é exibida', (mensagem: string) => {
  cy.get('[data-testid="message"]', { timeout: 10000 })
    .should('be.visible')
    .and('contain.text', mensagem);
});

// Steps comuns de setup para testes E2E
Given('o sistema está preparado para testes', () => {
  // Limpar dados de teste antes de cada cenário
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.window().then((win) => {
    win.sessionStorage.clear();
  });

  // Setup inicial - pode incluir autenticação mock ou token de teste
  cy.setupTestData();
});

// Steps comuns para formulários
When('ele preenche o campo {string} com {string}', (campo: string, valor: string) => {
  const seletores: { [key: string]: string } = {
    'Nome da sala': '[data-testid="room-name-input"]',
    'Descrição': '[data-testid="room-description-input"]',
    'Capacidade': '[data-testid="room-capacity-input"]'
  };

  const seletor = seletores[campo];
  if (seletor) {
    cy.get(seletor).clear().type(valor);
  } else {
    throw new Error(`Campo não reconhecido: ${campo}`);
  }
});

When('ele marca a opção {string}', (opcao: string) => {
  const seletores: { [key: string]: string } = {
    'Tem computadores': '[data-testid="has-computers-checkbox"]',
    'Tem projetores': '[data-testid="has-projector-checkbox"]'
  };

  const seletor = seletores[opcao];
  if (seletor) {
    cy.get(seletor).check();
  } else {
    throw new Error(`Opção não reconhecida: ${opcao}`);
  }
});

When('ele seleciona {string}', (botao: string) => {
  const seletores: { [key: string]: string } = {
    'Cadastrar': '[data-testid="submit-button"]',
    'Editar': '[data-testid="submit-button"]',
    'Salvar': '[data-testid="submit-button"]'
  };

  const seletor = seletores[botao];
  if (seletor) {
    cy.get(seletor).click();
    
    // Aguardar a requisição apropriada dependendo do contexto
    cy.url().then((url) => {
      if (url.includes('cadastro')) {
        cy.wait('@createRoom', { timeout: 10000 });
      } else if (url.includes('editar')) {
        cy.wait('@updateRoom', { timeout: 10000 });
      }
    });
  } else {
    throw new Error(`Botão não reconhecido: ${botao}`);
  }
});
