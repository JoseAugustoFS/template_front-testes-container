import { IServicoAlerta } from "@/contracts/iservico-alerta";


// implementação simples do serviço de alerta para o usuário
export class ServicoAlerta implements IServicoAlerta {
    alertaUsuario(mensagem: string) {
        window.alert(mensagem);
    }
}
