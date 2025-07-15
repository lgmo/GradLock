import app from '../src/app';
import request from 'supertest';

describe('Smoke Test - API Health Check', () => {
  it('deve iniciar a aplicação com sucesso', async () => {
    const response = await request(app)
      .get('/api/rooms');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success');
  });

  it('deve retornar 404 para rotas inexistentes', async () => {
    const response = await request(app)
      .get('/api/nonexistent');
    
    expect(response.status).toBe(404);
  });

  it('deve ter configuração básica de CORS e middlewares', async () => {
    const response = await request(app)
      .get('/api/rooms')
      .set('Origin', 'http://localhost:3000');
    
    expect(response.status).toBe(200);
    expect(response.headers).toHaveProperty('content-type');
    expect(response.headers['content-type']).toContain('application/json');
  });
});
