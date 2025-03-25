import { IApi } from "@/contracts/api";
import { IMensagemAPI } from "@/contracts/mensagem-api";
import axios, { AxiosInstance } from "axios";
import { DEB } from "./sis_debug";

// implementa o contrato IApi para ser usado com o axios
// o tipo T deve ser o tipo da entidade que será usada no serviço
export class AxiosApi<T> implements IApi<T> {
    private ains: AxiosInstance;
    
    constructor(ains: AxiosInstance) {
        this.ains = ains;
    }

    async get(url: string, id: string): Promise<T | IMensagemAPI> {
        try {
            DEB('AxiosApi', 'INFO', 'GET request:', `${url}/${id}`);
            const retorno = await this.ains.get<T>(`${url}/${id}`);
            DEB('AxiosApi', 'INFO', 'GET response:', retorno);
            
            if ([200].includes(retorno.status))
                return retorno.data as T;
            return { status: retorno.status, mensagem: retorno.statusText } as IMensagemAPI;
        } catch (error) {
            DEB('AxiosApi', 'ERRO', 'GET error:', error);
            throw error;
        }
    }

    async getAll(url: string): Promise<T[] | IMensagemAPI> {
        try {
            DEB('AxiosApi', 'INFO', 'GET ALL request:', url);
            const retorno = await this.ains.get<T[]>(url);
            DEB('AxiosApi', 'INFO', 'GET ALL response:', retorno);
            
            if ([200].includes(retorno.status))
                return retorno.data as T[];
            return { status: retorno.status, mensagem: retorno.statusText } as IMensagemAPI;
        } catch (error) {
            DEB('AxiosApi', 'ERRO', 'GET ALL error:', error);
            throw error;
        }
    }

    async post(url: string, data: T): Promise<T | IMensagemAPI> {
        try {
            DEB('AxiosApi', 'INFO', 'POST request:', url, data);
            const retorno = await this.ains.post<T>(url, data);
            DEB('AxiosApi', 'INFO', 'POST response:', retorno);
            
            if ([200, 201].includes(retorno.status))
                return retorno.data as T;
            return { status: retorno.status, mensagem: retorno.statusText } as IMensagemAPI;
        } catch (error) {
            DEB('AxiosApi', 'ERRO', 'POST error:', error);
            throw error;
        }
    }

    async put(url: string, id: string, data: T): Promise<T | IMensagemAPI> {
        try {
            DEB('AxiosApi', 'INFO', 'PUT request:', `${url}/${id}`, data);
            const retorno = await this.ains.put<T>(`${url}/${id}`, data);
            DEB('AxiosApi', 'INFO', 'PUT response:', retorno);
            
            if ([200, 201].includes(retorno.status))
                return retorno.data as T;
            return { status: retorno.status, mensagem: retorno.statusText } as IMensagemAPI;
        } catch (error) {
            DEB('AxiosApi', 'ERRO', 'PUT error:', error);
            throw error;
        }
    }

    async delete(url: string, id: string): Promise<boolean | IMensagemAPI> {
        try {
            DEB('AxiosApi', 'INFO', 'DELETE request:', `${url}/${id}`);
            const retorno = await this.ains.delete(`${url}/${id}`);
            DEB('AxiosApi', 'INFO', 'DELETE response:', retorno);
            
            if ([200, 201].includes(retorno.status))
                return true;
            return { status: retorno.status, mensagem: retorno.statusText } as IMensagemAPI;
        } catch (error) {
            DEB('AxiosApi', 'ERRO', 'DELETE error:', error);
            throw error;
        }
    }
}
