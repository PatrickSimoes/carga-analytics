import PlanilhaGoogle from './database/PlanilhaGoogle';

async function geraRelatorio() {
    try {
        const planilha: string[][] = await PlanilhaGoogle();
        
        if (planilha && planilha.length > 1) {
            
            const totaisPorMesAno: Record<string, number> = {};
            const totaisPorModalidade: Record<string, number> = {};
            const totaisPorUnidade: Record<string, number> = {};
            const totaisPorVeiculo: Record<string, number> = {};
            
            let totalGeral = 0;
            let linhasNaoAnalisadas: { id: number, motivo: string, linha: string[] }[] = [];

            planilha.forEach((linha: string[], index: number) => {
                if (index === 0) return; // Ignora o cabeçalho
            
                // Garante que há pelo menos 5 colunas (para a coluna "N .TR")
                if (linha.length < 5) {
                    linhasNaoAnalisadas.push({
                        id: index + 1,
                        motivo: 'Linha incompleta (menos de 5 colunas)',
                        linha: linha // Armazena a linha completa da planilha
                    });
                    return;
                }
            
                const nTr = linha[4]; // Acessa a coluna 'N .TR' (índice 4)
            
                if (nTr && nTr.trim() !== '') {
                    totalGeral++; // Incrementa total geral
            
                    const data = linha[0];
                    const modalidade = linha[2];
                    const unidade = linha[3];
                    const veiculo = linha[5] || ''; // Veículo pode estar vazio, então usa fallback para string vazia se não existir
            
                    // Verificação para garantir que a data está no formato correto DD/MM/YYYY
                    const regexData = /^\d{2}\/\d{2}\/\d{4}$/;
                    if (!regexData.test(data)) {
                        linhasNaoAnalisadas.push({
                            id: index + 1,
                            motivo: 'Formato de Data Inválido',
                            linha: linha // Armazena a linha completa da planilha
                        });
                        return;
                    }
            
                    const partesData = data.split('/');
                    const dia = partesData[0];
                    const mes = partesData[1];
                    const ano = partesData[2];
            
                    if (ano.length !== 4 || parseInt(ano) < 1000 || parseInt(ano) > 9999) {
                        linhasNaoAnalisadas.push({
                            id: index + 1,
                            motivo: 'Ano Incompleto ou Inválido',
                            linha: linha
                        });
                        return;
                    }
            
                    const dataReformatada = `${ano}-${mes}-${dia}`;
                    const dataObj = new Date(dataReformatada);
            
                    if (!isNaN(dataObj.getTime())) {
                        const mesAno = dataObj.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
                        totaisPorMesAno[mesAno] = (totaisPorMesAno[mesAno] || 0) + 1;
                    } else {
                        linhasNaoAnalisadas.push({
                            id: index + 1,
                            motivo: 'Data Inválida',
                            linha: linha
                        });
                        return;
                    }
            
                    // Processa total por Modalidade
                    totaisPorModalidade[modalidade] = (totaisPorModalidade[modalidade] || 0) + 1;
            
                    // Processa total por Unidade Organizacional (U.O)
                    totaisPorUnidade[unidade] = (totaisPorUnidade[unidade] || 0) + 1;
            
                    // Processa total por Veículo, só contando se veículo não estiver vazio
                    if (veiculo && veiculo.trim() !== '') {
                        totaisPorVeiculo[veiculo] = (totaisPorVeiculo[veiculo] || 0) + 1;
                    }
                } else {
                    linhasNaoAnalisadas.push({
                        id: index + 1,
                        motivo: 'N .TR inválido ou ausente',
                        linha: linha
                    });
                }
            });                                                                     

            // Função auxiliar para ordenar pelos totais (número de cargas), em ordem decrescente
            const ordenarPorTotal = (a: [string, number], b: [string, number]) => {
                return b[1] - a[1]; // Ordena pelo total de cargas
            };

            // Ordena os resultados corretamente
            const resultado = {
                totalPorMesAno: Object.entries(totaisPorMesAno).sort(ordenarPorTotal),
                totalPorModalidade: Object.entries(totaisPorModalidade).sort((a, b) => b[1] - a[1]), // Ordenado pelo total de modalidade
                totalPorUnidade: Object.entries(totaisPorUnidade).sort((a, b) => b[1] - a[1]), // Ordenado pelo total de unidade
                totalPorVeiculo: Object.entries(totaisPorVeiculo).sort((a, b) => b[1] - a[1]), // Ordenado pelo total de veículo
                totalGeral: totalGeral,
                linhasNaoAnalisadas: {
                    quantidade: linhasNaoAnalisadas.length,
                    detalhes: linhasNaoAnalisadas.map((item, idx) => `${idx + 1}: ${JSON.stringify(item)}`),
                    todasLinhas: linhasNaoAnalisadas
                }
            };

            console.log(resultado);
        } else {
            console.log('Nenhum registro encontrado ou planilha vazia.');
        }
    } catch (error) {
        console.error('Erro ao processar os dados:', error);
    }
}

geraRelatorio();