import { ILancaNotaService } from "@/contracts/ilanca-nota-service";
import { LancaNotaViewProps } from "./lanca-nota-view";
import { LancaNotaListProps } from "./lanca-nota-list";
import { NotaAluno } from "@/domain/entities/nota-aluno";
import { useEffect, useState } from "react";
import { IServicoAlerta } from "@/contracts/iservico-alerta";

export interface LancaNotaContainerProps {
    servicoLancaNota: ILancaNotaService;
    alerta: IServicoAlerta;
    LancaNotaView: React.ComponentType<LancaNotaViewProps>;
    LancaNotaList: React.ComponentType<LancaNotaListProps>;
}

export function LancaNotaContainer({ servicoLancaNota, alerta, LancaNotaView, LancaNotaList }: LancaNotaContainerProps) {
    const [data, setData] = useState<NotaAluno>({ matricula: '', nota: 0 });
    const [lista, setList] = useState<NotaAluno[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const retorno = await servicoLancaNota.obterTodas();
            
            if (Array.isArray(retorno)) {
                setList(retorno);
            } else {
                throw new Error('Dados inválidos retornados pelo servidor');
            }
        } catch (error) {
            const mensagem = error instanceof Error ? error.message : 'Erro ao buscar dados';
            setError(mensagem);
            alerta.alertaUsuario(`Problema ao buscar dados: ${mensagem}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { 
        fetchData();
    }, []);
    
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setData({ ...data, [name]: value });
    }

    const handleSubmit = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const ok = await servicoLancaNota.salvaNotaAluno(data);
            
            if (ok) {
                await fetchData();
            } else {
                throw new Error('Erro ao salvar nota');
            }
        } catch (error) {
            const mensagem = error instanceof Error ? error.message : 'Erro ao enviar dados';
            setError(mensagem);
            alerta.alertaUsuario(`Problema ao enviar dados: ${mensagem}`);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            {error && (
                <div style={{ color: 'red', marginBottom: '10px' }}>
                    Erro: {error}
                </div>
            )}
            
            <LancaNotaView 
                data={data}
                onChange={handleChange} 
                onClick={handleSubmit}  
            />
            
            {loading ? (
                <div>Carregando...</div>
            ) : (
                <LancaNotaList data={lista} />
            )}
        </div>
    );
}
