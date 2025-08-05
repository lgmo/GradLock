# Testes E2E com Cypress + Cucumber

Este projeto implementa testes End-to-End (E2E) utilizando Cypress com suporte ao Cucumber para as funcionalidades de gerenciamento de salas do sistema GradLock.

## Estrutura dos Testes

```
cypress/
├── e2e/
│   ├── cadastro_salas.feature          # Cenários de cadastro de salas
│   ├── edicao_salas.feature            # Cenários de edição de salas
│   ├── delecao_salas.feature           # Cenários de deleção de salas
│   ├── leitura_salas.feature           # Cenários de leitura de salas
│   └── step_definitions/
│       ├── cadastro_salas.ts           # Step definitions para cadastro
│       ├── edicao_salas.ts             # Step definitions para edição
│       ├── delecao_salas.ts            # Step definitions para deleção
│       └── leitura_salas.ts            # Step definitions para leitura
└── support/
    ├── commands.ts                     # Comandos customizados do Cypress
    └── e2e.ts                          # Configurações globais
```

## Funcionalidades Testadas

### 1. Cadastro de Salas
- ✅ Cadastro bem-sucedido com todos os campos preenchidos
- ✅ Erro por falta de informações obrigatórias
- ✅ Erro por capacidade negativa
- ✅ Erro por sala já existente

### 2. Edição de Salas
- ✅ Edição bem-sucedida
- ✅ Erro por falta de dados para atualização
- ✅ Erro por nome indisponível
- ✅ Erro por capacidade negativa

### 3. Deleção de Salas
- ✅ Deleção bem-sucedida
- ✅ Erro por ID inválido
- ✅ Erro por sala inexistente
- ✅ Erro por reservas ativas

### 4. Leitura de Salas
- ✅ Listagem de salas com sucesso
- ✅ Listagem quando não há salas cadastradas

## Pré-requisitos

1. **Backend**: O servidor backend deve estar rodando na porta 3000
2. **Frontend**: O servidor frontend deve estar rodando na porta 3001
3. **APIs de teste**: O backend deve implementar endpoints de teste para setup/cleanup de dados

## Como Executar os Testes

### 1. Executar todos os testes em modo headless
```bash
npm run e2e
```

### 2. Executar todos os testes em modo headed (com interface gráfica)
```bash
npm run e2e:headed
```

### 3. Abrir o Cypress Test Runner
```bash
npm run cypress:open
```

### 4. Executar testes específicos
```bash
# Apenas testes de cadastro
npx cypress run --spec "cypress/e2e/cadastro_salas.feature"

# Apenas testes de edição
npx cypress run --spec "cypress/e2e/edicao_salas.feature"

# Apenas testes de deleção
npx cypress run --spec "cypress/e2e/delecao_salas.feature"

# Apenas testes de leitura
npx cypress run --spec "cypress/e2e/leitura_salas.feature"
```

## Comandos Customizados

### `cy.clearTestData()`
Limpa todos os dados de teste do banco de dados.

### `cy.setupTestData()`
Configura dados iniciais necessários para os testes e configura autenticação mock para E2E.

## Seletores de Teste (data-testid)

Os testes utilizam seletores `data-testid` para maior estabilidade. Certifique-se de que os seguintes seletores estejam implementados no frontend:

### Formulários
- `room-name-input`: Campo nome da sala
- `room-description-input`: Campo descrição da sala
- `room-capacity-input`: Campo capacidade da sala
- `has-computers-checkbox`: Checkbox "Tem computadores"
- `has-projector-checkbox`: Checkbox "Tem projetores"
- `submit-button`: Botão de submit (Cadastrar/Editar)

### Listas e Navegação
- `rooms-list`: Container da lista de salas
- `room-item`: Item individual da sala
- `delete-button`: Botão de deletar sala
- `confirm-delete-button`: Botão de confirmação de deleção

### Mensagens
- `message`: Container de mensagens de sucesso/erro

## Configuração de API

Os testes fazem interceptação das seguintes APIs:
- `GET /api/rooms` - Listagem de salas
- `POST /api/rooms` - Criação de sala
- `PUT /api/rooms/*` - Edição de sala
- `DELETE /api/rooms/*` - Deleção de sala
- `POST /api/test/clear-data` - Limpeza de dados de teste
- `POST /api/test/setup-data` - Configuração de dados de teste

## Resolução de Problemas

### Erro de timeout
Se os testes estão falhando por timeout, verifique se:
1. O backend está rodando e respondendo
2. O frontend está rodando e carregando corretamente
3. Os seletores `data-testid` estão implementados

### Erro de autenticação/autorização
Se os testes falham por problemas de autenticação, verifique se:
1. O comando `cy.setupTestData()` está configurando corretamente o token mock
2. O backend aceita o token "test-token-admin" para operações de teste
3. As APIs de teste estão implementadas e funcionando

### Dados não limpos entre testes
Se os testes estão interferindo uns com os outros:
1. Implemente os endpoints de teste (`/api/test/clear-data`, `/api/test/setup-data`)
2. Verifique se `cy.clearTestData()` está sendo chamado corretamente

## Relatórios

Os testes geram relatórios automáticos em HTML que podem ser encontrados em:
- `cypress/reports/` (se configurado)

Para gerar relatórios customizados, você pode usar plugins adicionais como `cypress-mochawesome-reporter`.
