import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

// Step definitions para Edição de salas - E2E

Given('o administrador está na página de edição de salas da sala {string}', (nomeSala: string) => {
  cy.setupTestData();
  
  // Primeiro criar a sala via API
  cy.request({
    method: 'POST',
    url: 'http://localhost:3000/api/rooms',
    headers: {
      'Authorization': `Bearer test-token-admin`
    },
    body: {
      name: nomeSala,
      description: 'Laboratório antigo',
      capacity: 30,
      hasComputers: true,
      hasProjector: false
    },
    failOnStatusCode: false
  }).then((response) => {
    const roomId = response.body.data.id;
    cy.visit(`/admin/salas/editar/${roomId}`);
    cy.url().should('include', `/admin/salas/editar/${roomId}`);
  });
});

When('ele edita o campo {string} para {string}', (campo: string, valor: string) => {
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

When('seleciona {string}', (botao: string) => {
  switch (botao) {
    case 'Editar':
      cy.get('[data-testid="submit-button"]').click();
      cy.wait('@updateRoom');
      break;
  }
});
