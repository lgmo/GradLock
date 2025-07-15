#!/usr/bin/env node

const { spawn } = require('child_process');

function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit', // Permite que o output seja mostrado em tempo real
      shell: true
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

async function runTests() {
  console.log('🚨 Executando Smoke Tests...');
  
  try {
    // Executar smoke test
    await runCommand('npm', ['run', 'test:smoke']);
    console.log('✅ Smoke Tests PASSARAM! Executando demais testes...');
    
    try {
      // Executar todos os outros testes
      await runCommand('npm', ['run', 'test:all']);
      console.log('🎉 Todos os testes PASSARAM!');
      process.exit(0);
    } catch (allTestsError) {
      console.log('❌ Alguns testes falharam.');
      process.exit(1);
    }
    
  } catch (smokeError) {
    console.log('❌ Smoke Test FALHOU! Interrompendo execução dos demais testes.');
    console.log('🔧 Corrija os problemas básicos antes de executar os testes completos.');
    process.exit(1);
  }
}

runTests();
