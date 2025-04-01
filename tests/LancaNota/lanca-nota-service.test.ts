import { IApi } from "@/contracts/api";
import { NotaAluno } from "@/domain/entities/nota-aluno";
import { LancaNotaService } from "@/data/services/lanca-nota-service";
import { IMensagemAPI } from "@/contracts/mensagem-api";

// Mock manual da API
class MockApi implements IApi<NotaAluno> {
    private mockData: NotaAluno[] = [
        { id: "1", matricula: "2024001", nota: 8.5 },
        { id: "2", matricula: "2024002", nota: 7.0 }
    ];

    async get(url: string, id: string): Promise<NotaAluno | IMensagemAPI> {
        const nota = this.mockData.find(n => n.id === id);
        if (!nota) return { mensagem: "Nota não encontrada", status: 404 };
        return nota;
    }

    async getAll(url: string): Promise<NotaAluno[] | IMensagemAPI> {
        return this.mockData;
    }

    async post(url: string, data: NotaAluno): Promise<NotaAluno | IMensagemAPI> {
        // Validações básicas
        if (!data.matricula || !data.nota) {
            return { mensagem: "Dados inválidos", status: 400 };
        }

        // Validação da nota
        if (data.nota < 0 || data.nota > 10) {
            return { mensagem: "Nota deve estar entre 0 e 10", status: 400 };
        }

        // Validação da matrícula
        if (!/^\d{7}$/.test(data.matricula)) {
            return { mensagem: "Matrícula deve ter 7 dígitos", status: 400 };
        }

        // Simula sucesso
        const novaNota: NotaAluno = {
            id: (this.mockData.length + 1).toString(),
            matricula: data.matricula,
            nota: data.nota
        };
        this.mockData.push(novaNota);
        return novaNota;
    }

    async put(url: string, id: string, data: any): Promise<NotaAluno | IMensagemAPI> {
        throw new Error("Método não implementado para o teste");
    }

    async delete(url: string, id: string): Promise<boolean | IMensagemAPI> {
        throw new Error("Método não implementado para o teste");
    }
}

// Mock da API com erro
class MockApiComErro implements IApi<NotaAluno> {
    async get(url: string, id: string): Promise<NotaAluno | IMensagemAPI> {
        throw new Error("Erro simulado");
    }

    async getAll(url: string): Promise<NotaAluno[] | IMensagemAPI> {
        throw new Error("Erro simulado");
    }

    async post(url: string, data: any): Promise<NotaAluno | IMensagemAPI> {
        throw new Error("Erro simulado");
    }

    async put(url: string, id: string, data: any): Promise<NotaAluno | IMensagemAPI> {
        throw new Error("Erro simulado");
    }

    async delete(url: string, id: string): Promise<boolean | IMensagemAPI> {
        throw new Error("Erro simulado");
    }
}

// Testes para obterTodas
describe('LancaNotaService - Testes do método obterTodas', () => {
    // Teste do caso de sucesso
    test('deve retornar um array de NotaAluno quando a requisição for bem sucedida', async () => {
        // Arrange
        const mockApi = new MockApi();
        const service = new LancaNotaService(mockApi);

        // Act
        const result = await service.obterTodas();

        // Assert
        expect(Array.isArray(result)).toBe(true);
        if (Array.isArray(result)) {  // Type guard para o TypeScript
            expect(result.length).toBe(2);
            expect(result[0].matricula).toBe("2024001");
            expect(result[1].matricula).toBe("2024002");
        }
    });

    // Teste do caso de erro
    test('deve retornar false quando ocorrer um erro na requisição', async () => {
        // Arrange
        const mockApiComErro = new MockApiComErro();
        const service = new LancaNotaService(mockApiComErro);

        // Act
        const result = await service.obterTodas();

        // Assert
        expect(result).toBe(false);
    });
});

// Testes para salvaNotaAluno
describe('LancaNotaService - Testes do método salvaNotaAluno', () => {
    // Teste do caso de sucesso
    test('deve retornar true quando salvar uma nota válida', async () => {
        // Arrange
        const mockApi = new MockApi();
        const service = new LancaNotaService(mockApi);
        const notaValida = {
            matricula: "2024003",
            nota: 9.5
        };

        // Act
        const result = await service.salvaNotaAluno(notaValida);

        // Assert
        expect(result).toBe(true);
    });

    // Teste de nota inválida
    test('deve retornar false quando a nota for inválida', async () => {
        // Arrange
        const mockApi = new MockApi();
        const service = new LancaNotaService(mockApi);
        const notaInvalida = {
            matricula: "2024003",
            nota: 11 // Nota maior que 10
        };

        // Act
        const result = await service.salvaNotaAluno(notaInvalida);

        // Assert
        expect(result).toBe(false);
    });

    // Teste de matrícula inválida
    test('deve retornar false quando a matrícula for inválida', async () => {
        // Arrange
        const mockApi = new MockApi();
        const service = new LancaNotaService(mockApi);
        const notaComMatriculaInvalida = {
            matricula: "123", // Matrícula com menos de 7 dígitos
            nota: 8.5
        };

        // Act
        const result = await service.salvaNotaAluno(notaComMatriculaInvalida);

        // Assert
        expect(result).toBe(false);
    });

    // Teste do caso de erro na API
    test('deve retornar false quando ocorrer um erro na requisição', async () => {
        // Arrange
        const mockApiComErro = new MockApiComErro();
        const service = new LancaNotaService(mockApiComErro);
        const nota = {
            matricula: "2024003",
            nota: 9.5
        };

        // Act
        const result = await service.salvaNotaAluno(nota);

        // Assert
        expect(result).toBe(false);
    });

    // Teste de dados ausentes
    test('deve retornar false quando faltar dados obrigatórios', async () => {
        // Arrange
        const mockApi = new MockApi();
        const service = new LancaNotaService(mockApi);
        const notaIncompleta = {
            matricula: "2024003"
            // nota está faltando
        };

        // Act
        const result = await service.salvaNotaAluno(notaIncompleta);

        // Assert
        expect(result).toBe(false);
    });
});
