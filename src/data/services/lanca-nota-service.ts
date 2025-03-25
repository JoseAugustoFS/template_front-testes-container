import { IApi } from "@/contracts/api";
import { NotaAluno } from "@/domain/entities/nota-aluno";
import { IMensagemAPI, isIMensagemAPI } from "@/contracts/mensagem-api";
import { DEB } from "@/infra/sis_debug";
import { ILancaNotaService } from "@/contracts/ilanca-nota-service";

export class LancaNotaService implements ILancaNotaService {
    private api: IApi<NotaAluno>;
    constructor(API: IApi<NotaAluno>) { this.api = API; }
    
    async salvaNotaAluno(data: any): Promise<boolean> {
        try {
            DEB('LancaNotaService', 'INFO', 'Enviando nota para API:', data);
            let result: NotaAluno | IMensagemAPI;
            result = await this.api.post('/lancamentoNota', data);
            DEB('LancaNotaService', 'INFO', 'Resposta da API (POST):', result);
            
            if (isIMensagemAPI(result)) {
                DEB('LancaNotaService', 'ERRO', 'Erro da API:', result);
                return false;
            }
            return true;
        } catch (error) {
            DEB('LancaNotaService', 'ERRO', 'Erro ao salvar nota:', error);
            return false;
        }
    }
    
    async obterTodas(): Promise<NotaAluno[] | boolean> {
        try {
            DEB('LancaNotaService', 'INFO', 'Buscando todas as notas...');
            let result: IMensagemAPI | NotaAluno[];
            result = await this.api.getAll('/lancamentoNota');
            DEB('LancaNotaService', 'INFO', 'Resposta da API (GET):', result);
            
            if (isIMensagemAPI(result)) {
                DEB('LancaNotaService', 'ERRO', 'Erro da API:', result);
                return false;
            }
            return result;
        } catch (error) {
            DEB('LancaNotaService', 'ERRO', 'Erro ao buscar notas:', error);
            return false;
        }
    }
}
