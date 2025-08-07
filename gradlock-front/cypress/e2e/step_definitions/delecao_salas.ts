import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

// Step definitions para Deleção de salas - E2E

Given('existe a sala {string} com descrição {string}', (nomeSala: string, descricao: string) => {
  cy.request({
    method: 'POST',
    url: 'http://localhost:3000/api/rooms',
    headers: {
      'Authorization': `Bearer test-token-admin`
    },
    body: {
      name: nomeSala,
      description: descricao,
      capacity: 30,
      hasComputers: true,
      hasProjector: false
    },
    failOnStatusCode: false
  }).as('createdRoom');
});

Given('a sala {string} possui reservas ativas', (nomeSala: string) => {
  // Simular reservas ativas via API
  cy.get('@createdRoom').then((response: any) => {
    const roomId = response.body.data.id;
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/api/reservations',
      headers: {
        'Authorization': `Bearer test-token-admin`
      },
      body: {
        roomId: roomId,
        startTime: new Date(Date.now() + 3600000).toISOString(), // 1 hora no futuro
        endTime: new Date(Date.now() + 7200000).toISOString(), // 2 horas no futuro
        purpose: 'Teste de reserva'
      }
    });
  });
});

Given('o administrador está na página de administração de salas', () => {
  cy.setupTestData();
  cy.visit('/admin/salas');
  cy.url().should('include', '/admin/salas');
});

When('ele seleciona a opção {string} para a sala {string}', (acao: string, nomeSala: string) => {
  cy.contains('[data-testid="room-item"]', nomeSala)
    .find(`[data-testid="${acao.toLowerCase()}-button"]`)
    .click();
});

When('confirma a deleção', () => {
  cy.get('[data-testid="confirm-delete-button"]').click();
  cy.wait('@deleteRoom');
});

When('ele tenta deletar uma sala com ID inválido', () => {
  cy.request({
    method: 'DELETE',
    url: 'http://localhost:3000/api/rooms/invalid-id',
    headers: {
      'Authorization': `Bearer test-token-admin`
    },
    failOnStatusCode: false
  });
});

When('ele tenta deletar uma sala que não existe', () => {
  cy.request({
    method: 'DELETE',
    url: 'http://localhost:3000/api/rooms/999999',
    headers: {
      'Authorization': `Bearer test-token-admin`
    },
    failOnStatusCode: false
  });
});

Then('a sala {string} não aparece mais na lista', (nomeSala: string) => {
  cy.get('[data-testid="rooms-list"]').should('not.contain.text', nomeSala);
});
