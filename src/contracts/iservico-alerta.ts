// contrato de serviço para alertar o usuário
export interface IServicoAlerta {
    alertaUsuario(mensagem: string): void;
}