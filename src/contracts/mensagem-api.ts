
// contrato de mensagem de erro ou sucesso

export type IMensagemAPI = {
    status: number;
    mensagem: string;
}

// verifica se o objeto é uma mensagem de erro ou sucesso
export function isIMensagemAPI(obj: any): obj is IMensagemAPI {
    return ( obj && 
        typeof obj.status === 'number' && 
        typeof obj.mensagem === 'string'
    );
}