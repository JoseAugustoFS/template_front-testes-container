import { IMensagemAPI } from "./mensagem-api";

// contrato de API de serviços genéricos
export interface IApi<T> {
    get(url: string, id: string): Promise<T | IMensagemAPI>;
    getAll(url: string): Promise<T[] | IMensagemAPI>;
    post(url: string, data: any): Promise<T | IMensagemAPI>;
    put(url: string, id: string, data: any): Promise<T | IMensagemAPI>;
    delete(url: string, id: string): Promise<boolean | IMensagemAPI>;
}
