import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

// Step definitions para Leitura de salas - E2E

Given('existem as seguintes salas cadastradas:', (dataTable: any) => {
  const salas = dataTable.hashes();
  
  salas.forEach((sala: any) => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/api/rooms',
      headers: {
        'Authorization': `Bearer test-token-admin`
      },
      body: {
        name: sala.nome,
        description: sala.descrição,
        capacity: parseInt(sala.capacidade),
        hasComputers: sala.computadores === 'true',
        hasProjector: sala.projetores === 'true'
      },
      failOnStatusCode: false
    });
  });
});

Given('não existem salas cadastradas', () => {
  // Limpar todas as salas via API
  cy.request({
    method: 'DELETE',
    url: 'http://localhost:3000/api/test/clear-rooms',
    headers: {
      'Authorization': `Bearer test-token-admin`
    },
    failOnStatusCode: false
  });
});

Then('ele deve ver a lista com as salas cadastradas', () => {
  cy.get('[data-testid="rooms-list"]').should('be.visible');
  cy.wait('@getRooms');
});

Then('a sala {string} deve aparecer na lista', (nomeSala: string) => {
  cy.get('[data-testid="rooms-list"]')
    .should('contain.text', nomeSala);
});

Then('a mensagem {string} é exibida', (mensagem: string) => {
  cy.get('[data-testid="message"]', { timeout: 10000 })
    .should('be.visible')
    .and('contain.text', mensagem);
});
