import { NotaAluno } from "@/domain/entities/nota-aluno";

export interface LancaNotaListProps {
    data: NotaAluno[];
}

export function LancaNotaList({ data }: LancaNotaListProps) {
    return (
        <div>
            <h4>Lista de Notas</h4>
            <table>
                <thead><tr><th>Matricula</th><th>Nota</th></tr></thead>
                <tbody>
                    {(data.length === 0) ? ( 
                         <tr><td>Nenhuma nota lançada</td></tr>
                    ) : (
                    (data.map((item, index) => (<tr key={index}>
                        <td>{item.matricula}</td><td>{item.nota}</td>
                    </tr>))))}
                </tbody>
            </table>
        </div>
    );
}
