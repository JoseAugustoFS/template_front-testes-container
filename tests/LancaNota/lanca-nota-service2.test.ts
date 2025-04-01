import { IApi } from "@/contracts/api";
import { NotaAluno } from "@/domain/entities/nota-aluno";
import { LancaNotaService } from "@/data/services/lanca-nota-service";
import { IMensagemAPI } from "@/contracts/mensagem-api";

class MockApi implements IApi<NotaAluno> {
    get(url: string, id: string): Promise<NotaAluno | IMensagemAPI> {
        throw new Error("Method not implemented.");
    }
    put(url: string, id: string, data: any): Promise<NotaAluno | IMensagemAPI> {
        throw new Error("Method not implemented.");
    }
    delete(url: string, id: string): Promise<boolean | IMensagemAPI> {
        throw new Error("Method not implemented.");
    }
    private data: NotaAluno[] = [
        { id: "1", matricula: "2024001", nota: 8.5 },
        { id: "2", matricula: "2024002", nota: 7.0 }
    ];

    async getAll(): Promise<NotaAluno[] | IMensagemAPI> {
        return this.data;
    }

    async post(url: string, data: NotaAluno): Promise<NotaAluno | IMensagemAPI> {
        if (!data.matricula || !data.nota || data.nota < 0 || data.nota > 10) {
            return { mensagem: "Erro", status: 400 };
        }
        return data;
    }
}

class MockApiErro implements IApi<NotaAluno> {
    get(url: string, id: string): Promise<NotaAluno | IMensagemAPI> {
        throw new Error("Method not implemented.");
    }
    put(url: string, id: string, data: any): Promise<NotaAluno | IMensagemAPI> {
        throw new Error("Method not implemented.");
    }
    delete(url: string, id: string): Promise<boolean | IMensagemAPI> {
        throw new Error("Method not implemented.");
    }
    async getAll(): Promise<NotaAluno[] | IMensagemAPI> {
        throw new Error("Erro simulado");
    }
    async post(): Promise<NotaAluno | IMensagemAPI> {
        throw new Error("Erro simulado");
    }
}

describe("LancaNotaService", () => {
    test("obterTodas - sucesso", async () => {
        const service = new LancaNotaService(new MockApi());
        const result = await service.obterTodas();
        expect(Array.isArray(result)).toBe(true);
    });

    test("obterTodas - erro", async () => {
        const service = new LancaNotaService(new MockApiErro());
        const result = await service.obterTodas();
        expect(result).toBe(false);
    });

    test("salvaNotaAluno - sucesso", async () => {
        const service = new LancaNotaService(new MockApi());
        const result = await service.salvaNotaAluno({ matricula: "2024003", nota: 9.5 });
        expect(result).toBe(true);
    });

    test("salvaNotaAluno - erro", async () => {
        const service = new LancaNotaService(new MockApi());
        const result = await service.salvaNotaAluno({ matricula: "", nota: 11 });
        expect(result).toBe(false);
    });

    test("salvaNotaAluno - erro API", async () => {
        const service = new LancaNotaService(new MockApiErro());
        const result = await service.salvaNotaAluno({ matricula: "2024003", nota: 9.5 });
        expect(result).toBe(false);
    });
});
