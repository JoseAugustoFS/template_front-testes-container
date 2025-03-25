import { NotaAluno } from "@/domain/entities/nota-aluno";

export interface ILancaNotaService {
    salvaNotaAluno(data: any): Promise<boolean>;
    obterTodas(): Promise<boolean | NotaAluno[]>;
}
