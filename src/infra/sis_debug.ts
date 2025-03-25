/**
 * Módulo de debug do sistema
 * Responsabilidade: Centralizar e padronizar os logs do sistema
 */

// Tipos de mensagens de debug
export type TipoDebug = 'INFO' | 'ERRO' | 'AVISO';

/**
 * Função que centraliza o debug do sistema
 * @param modulo Nome do módulo que está gerando o log
 * @param tipo Tipo da mensagem (INFO, ERRO, AVISO)
 * @param mensagem Mensagem principal
 * @param params Parâmetros adicionais para debug
 */
export function DEB(
    modulo: string,
    tipo: TipoDebug,
    mensagem: string,
    ...params: any[]
): void {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}][${modulo}][${tipo}]`;
    
    if (params && params.length > 0) {
        console.log(prefix, mensagem, ...params);
    } else {
        console.log(prefix, mensagem);
    }
}
