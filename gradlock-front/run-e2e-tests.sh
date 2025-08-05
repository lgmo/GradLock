#!/bin/bash

# Script para executar os testes E2E do GradLock
# Este script assume que o backend está rodando na porta 3000 e o frontend na porta 3001

echo "🚀 Iniciando testes E2E do GradLock..."

# Verificar se os serviços estão rodando
echo "📋 Verificando se os serviços estão rodando..."

# Verificar backend (porta 3000)
if curl -f -s http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "✅ Backend está rodando na porta 3000"
else
    echo "❌ Backend não está rodando na porta 3000"
    echo "   Por favor, inicie o backend com: cd gradlock-back && npm run dev"
    exit 1
fi

# Verificar frontend (porta 3001)
if curl -f -s http://localhost:3001 > /dev/null 2>&1; then
    echo "✅ Frontend está rodando na porta 3001"
else
    echo "❌ Frontend não está rodando na porta 3001"
    echo "   Por favor, inicie o frontend com: cd gradlock-front && npm run dev"
    exit 1
fi

echo ""
echo "🧪 Executando testes E2E..."

# Executar testes por categoria
echo ""
echo "📝 Testando Cadastro de Salas..."
npx cypress run --spec "cypress/e2e/cadastro_salas.feature" --quiet

echo ""
echo "✏️  Testando Edição de Salas..."
npx cypress run --spec "cypress/e2e/edicao_salas.feature" --quiet

echo ""
echo "🗑️  Testando Deleção de Salas..."
npx cypress run --spec "cypress/e2e/delecao_salas.feature" --quiet

echo ""
echo "📖 Testando Leitura de Salas..."
npx cypress run --spec "cypress/e2e/leitura_salas.feature" --quiet

echo ""
echo "✨ Testes E2E concluídos!"
echo "📊 Verifique os relatórios em cypress/reports/ (se configurado)"
