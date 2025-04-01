import { AxiosApi } from "@/infra/axios-api";
import { IApi } from "@/contracts/api";

class MockAxios {
    async get<T>(url: string): Promise<{ status: number; data: T; statusText: string }> {
        if (url.includes("error")) throw new Error("Erro na requisição GET");
        return { status: 200, data: {} as T, statusText: "OK" };
    }

    async post<T>(url: string, data: T): Promise<{ status: number; data: T; statusText: string }> {
        if (!data) throw new Error("Erro na requisição POST");
        return { status: 201, data, statusText: "Created" };
    }

    async put<T>(url: string, id: string, data: T): Promise<{ status: number; data: T; statusText: string }> {
        if (!id) throw new Error("Erro na requisição PUT");
        return { status: 200, data, statusText: "OK" };
    }

    async delete(url: string): Promise<{ status: number; statusText: string }> {
        if (url.includes("not-found")) return { status: 404, statusText: "Not Found" };
        return { status: 200, statusText: "OK" };
    }
}

describe("AxiosApi", () => {
    let api: IApi<any>;
    let mockAxios: MockAxios;

    beforeEach(() => {
        mockAxios = new MockAxios();
        api = new AxiosApi(mockAxios as any);
    });

    test("deve realizar um GET com sucesso", async () => {
        const response = await api.get("/endpoint", "1");
        expect(response).toEqual({});
    });

    test("deve tratar erro no GET", async () => {
        await expect(api.get("/error", "1")).rejects.toThrow("Erro na requisição GET");
    });

    test("deve realizar um POST com sucesso", async () => {
        const data = { id: "1", nome: "Teste" };
        const response = await api.post("/endpoint", data);
        expect(response).toEqual(data);
    });

    test("deve tratar erro no POST", async () => {
        await expect(api.post("/endpoint", null as any)).rejects.toThrow("Erro na requisição POST");
    });

    test.skip("deve realizar um PUT com sucesso", async () => {
        const data = { nome: "Atualizado" };
        const response = await api.put("/endpoint", "1", data);
        expect(response).toEqual(data);
    });

    test.skip("deve tratar erro no PUT", async () => {
        await expect(api.put("/endpoint", "", { nome: "Erro" })).rejects.toThrow("Erro na requisição PUT");
    });

    test("deve realizar um DELETE com sucesso", async () => {
        const response = await api.delete("/endpoint", "1");
        expect(response).toBe(true);
    });

    test("deve tratar erro no DELETE quando não encontrado", async () => {
        const response = await api.delete("/not-found", "1");
        expect(response).toEqual({ status: 404, mensagem: "Not Found" });
    });
});