import { NotaAluno } from "@/domain/entities/nota-aluno";

export interface LancaNotaViewProps {
    data: NotaAluno;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onClick: () => void;
}

export function LancaNotaView({ data, onChange, onClick }: LancaNotaViewProps) {
    return (
        <div>
            <h3>Lanca Nota</h3><br />
            <label>Matricula
            <input type="text" name="matricula" value={data.matricula}
                       onChange={onChange} />
            </label>
            <br />
            <label>Nota
            <input type="number" name="nota" value={data.nota}
                       onChange={onChange} />
            </label>
            <br />
            <button onClick={onClick}>Enviar</button>
        </div>
    )
}
