/**
 * Testes para o módulo de debug do sistema
 * 
 * Objetivo: Demonstrar como testar funções que interagem com console.log
 * Princípios SOLID aplicados:
 * - Single Responsibility: O módulo tem apenas uma responsabilidade - logging
 * - Open/Closed: Podemos estender o comportamento sem modificar o código (ex: adicionar novos tipos de log)
 */

import { DEB, TipoDebug } from '@/infra/sis_debug';

describe('Sistema de Debug', () => {
    // Setup - Antes de cada teste
    let consoleSpy: jest.SpyInstance;
    
    beforeEach(() => {
        // Mock do console.log para capturar as chamadas
        consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    });
    
    afterEach(() => {
        // Restaura o console.log original
        consoleSpy.mockRestore();
    });
    
    /**
     * Teste: Verifica se a função DEB formata corretamente a mensagem com timestamp
     * Estratégia: Mock do Date.toISOString para retornar um valor fixo
     */
    test('deve formatar mensagem com timestamp', () => {
        // Arrange
        const mockDate = '2024-02-28T10:00:00.000Z';
        const dateSpy = jest.spyOn(Date.prototype, 'toISOString')
            .mockReturnValue(mockDate);
            
        // Act
        DEB('TestModule', 'INFO', 'Mensagem de teste');
        
        // Assert
        expect(consoleSpy).toHaveBeenCalledWith(
            `[${mockDate}][TestModule][INFO]`,
            'Mensagem de teste'
        );
        
        // Cleanup
        dateSpy.mockRestore();
    });
    
    /**
     * Teste: Verifica se a função DEB aceita parâmetros adicionais
     * Demonstra o uso de múltiplos parâmetros
     */
    test('deve aceitar parâmetros adicionais', () => {
        // Arrange
        const params = { id: 1, nome: 'teste' };
        
        // Act
        DEB('TestModule', 'INFO', 'Mensagem', params);
        
        // Assert
        expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringContaining('[TestModule][INFO]'),
            'Mensagem',
            params
        );
    });
    
    /**
     * Teste: Verifica se a função DEB aceita diferentes tipos de debug
     * Demonstra o uso de tipos enumerados
     */
    test('deve aceitar diferentes tipos de debug', () => {
        // Arrange
        const tipos: TipoDebug[] = ['INFO', 'ERRO', 'AVISO'];
        
        // Act & Assert
        tipos.forEach(tipo => {
            DEB('TestModule', tipo, 'Mensagem');
            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining(`[TestModule][${tipo}]`),
                'Mensagem'
            );
        });
    });
    
    /**
     * Teste: Verifica se a função DEB lida corretamente com objetos complexos
     * Demonstra o uso de diferentes tipos de dados
     */
    test('deve lidar com objetos complexos', () => {
        // Arrange
        const objetoComplexo = {
            id: 1,
            dados: {
                nome: 'teste',
                array: [1, 2, 3]
            }
        };
        
        // Act
        DEB('TestModule', 'INFO', 'Objeto complexo:', objetoComplexo);
        
        // Assert
        expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringContaining('[TestModule][INFO]'),
            'Objeto complexo:',
            objetoComplexo
        );
    });
});
