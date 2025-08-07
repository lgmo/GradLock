// cypress/support/commands.ts

// cypress/support/commands.ts

declare namespace Cypress {
  interface Chainable {
    clearTestData(): Chainable;
    setupTestData(): Chainable;
  }
}

// Comando personalizado para limpar dados de teste
Cypress.Commands.add('clearTestData', () => {
  cy.request({
    method: 'POST',
    url: 'http://localhost:3000/api/test/clear-data',
    failOnStatusCode: false
  });
});

// Comando personalizado para configurar dados de teste (incluindo autenticação mock se necessário)
Cypress.Commands.add('setupTestData', () => {
  // Configurar dados iniciais de teste
  cy.request({
    method: 'POST',
    url: 'http://localhost:3000/api/test/setup-data',
    failOnStatusCode: false
  });
  
  // Configurar autenticação mock ou token de teste se necessário
  cy.window().then((win) => {
    // Simular um token de autenticação para testes E2E
    win.localStorage.setItem('authToken', 'test-token-admin');
    win.localStorage.setItem('userRole', 'admin');
  });
});
