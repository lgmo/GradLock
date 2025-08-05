// cypress/support/e2e.ts
import './commands';

// Configurações globais para os testes E2E
Cypress.config('defaultCommandTimeout', 10000);
Cypress.config('viewportWidth', 1280);
Cypress.config('viewportHeight', 720);

// Interceptar requisições de API durante os testes
beforeEach(() => {
  // Interceptar chamadas para a API do backend de salas
  cy.intercept('GET', '/api/rooms').as('getRooms');
  cy.intercept('POST', '/api/rooms').as('createRoom');
  cy.intercept('PUT', '/api/rooms/*').as('updateRoom');
  cy.intercept('DELETE', '/api/rooms/*').as('deleteRoom');
  
  // Interceptar chamadas para APIs de teste
  cy.intercept('POST', '/api/test/clear-data').as('clearTestData');
  cy.intercept('POST', '/api/test/setup-data').as('setupTestData');
});
