import { NotaAluno } from "@/domain/entities/nota-aluno";
import { AxiosApi } from "@/infra/axios-api";
import { LancaNotaService } from "@/data/services/lanca-nota-service";
import { ServicoAlerta } from "@/infra/servico-alerta";
import { LancaNotaContainer } from "./lanca-nota-container";
import { LancaNotaView } from "./lanca-nota-view";
import { LancaNotaList } from "./lanca-nota-list";
import ainst from "@/infra/axios-instance";

export function LancaNotaPresenter() {

    const api = new AxiosApi<NotaAluno>(ainst);
    const lancaNotaService = new LancaNotaService(api);
    const servicoAlerta = new ServicoAlerta();
    
    return (
        <LancaNotaContainer servicoLancaNota={lancaNotaService} 
                            alerta={servicoAlerta}
                            LancaNotaView={LancaNotaView}
                            LancaNotaList={LancaNotaList}
        />
    );
}
