import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

// Step definitions para Cadastro de salas - E2E

Given('o sistema está preparado para cadastro de salas', () => {
  cy.clearTestData();
  cy.setupTestData();
});

Given('o administrador está na página de cadastro de salas', () => {
  cy.setupTestData();
  cy.visit('/admin/salas/cadastro');
  cy.url().should('include', '/admin/salas/cadastro');
});

Given('já existe uma sala com nome {string}', (nomeSala: string) => {
  // Criar uma sala via API para os testes
  cy.request({
    method: 'POST',
    url: 'http://localhost:3000/api/rooms',
    headers: {
      'Authorization': `Bearer test-token-admin`
    },
    body: {
      name: nomeSala,
      description: 'Sala para teste',
      capacity: 30,
      hasComputers: true,
      hasProjector: false
    },
    failOnStatusCode: false
  });
});

When('ele está na página de cadastro de salas', () => {
  cy.visit('/admin/salas/cadastro');
  cy.url().should('include', '/admin/salas/cadastro');
});

When('ele preenche o campo {string} com {string}', (campo: string, valor: string) => {
  switch (campo) {
    case 'Nome da sala':
      cy.get('[data-testid="room-name-input"]').clear().type(valor);
      break;
    case 'Descrição':
      cy.get('[data-testid="room-description-input"]').clear().type(valor);
      break;
    case 'Capacidade':
      cy.get('[data-testid="room-capacity-input"]').clear().type(valor);
      break;
  }
});

When('ele marca a opção {string}', (opcao: string) => {
  switch (opcao) {
    case 'Tem computadores':
      cy.get('[data-testid="has-computers-checkbox"]').check();
      break;
    case 'Tem projetores':
      cy.get('[data-testid="has-projector-checkbox"]').check();
      break;
  }
});

When('ele seleciona {string}', (botao: string) => {
  switch (botao) {
    case 'Cadastrar':
      cy.get('[data-testid="submit-button"]').click();
      cy.wait('@createRoom');
      break;
  }
});

Then('a mensagem {string} é exibida', (mensagem: string) => {
  cy.get('[data-testid="message"]', { timeout: 10000 })
    .should('be.visible')
    .and('contain.text', mensagem);
});
