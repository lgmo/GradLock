# Script PowerShell para executar os testes E2E do GradLock
# Este script assume que o backend está rodando na porta 3000 e o frontend na porta 3001

Write-Host "🚀 Iniciando testes E2E do GradLock..." -ForegroundColor Green

# Verificar se os serviços estão rodando
Write-Host "📋 Verificando se os serviços estão rodando..." -ForegroundColor Yellow

# Verificar backend (porta 3000)
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/health" -Method GET -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✅ Backend está rodando na porta 3000" -ForegroundColor Green
}
catch {
    Write-Host "❌ Backend não está rodando na porta 3000" -ForegroundColor Red
    Write-Host "   Por favor, inicie o backend com: cd gradlock-back && npm run dev" -ForegroundColor Yellow
    exit 1
}

# Verificar frontend (porta 3001)
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001" -Method GET -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✅ Frontend está rodando na porta 3001" -ForegroundColor Green
}
catch {
    Write-Host "❌ Frontend não está rodando na porta 3001" -ForegroundColor Red
    Write-Host "   Por favor, inicie o frontend com: cd gradlock-front && npm run dev" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "🧪 Executando testes E2E..." -ForegroundColor Green

# Executar testes por categoria
Write-Host ""
Write-Host "📝 Testando Cadastro de Salas..." -ForegroundColor Cyan
& npx cypress run --spec "cypress/e2e/cadastro_salas.feature" --quiet

Write-Host ""
Write-Host "✏️  Testando Edição de Salas..." -ForegroundColor Cyan
& npx cypress run --spec "cypress/e2e/edicao_salas.feature" --quiet

Write-Host ""
Write-Host "🗑️  Testando Deleção de Salas..." -ForegroundColor Cyan
& npx cypress run --spec "cypress/e2e/delecao_salas.feature" --quiet

Write-Host ""
Write-Host "📖 Testando Leitura de Salas..." -ForegroundColor Cyan
& npx cypress run --spec "cypress/e2e/leitura_salas.feature" --quiet

Write-Host ""
Write-Host "✨ Testes E2E concluídos!" -ForegroundColor Green
Write-Host "📊 Verifique os relatórios em cypress/reports/ (se configurado)" -ForegroundColor Yellow
