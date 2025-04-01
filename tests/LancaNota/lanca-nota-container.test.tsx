import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { LancaNotaContainer } from "@/presentation/LancaNota/lanca-nota-container";
import { act } from "react";

const MockLancaNotaView = ({ data, onChange, onClick }: any) => (
    <div>
        <input data-testid="input-matricula" name="matricula" value={data.matricula} onChange={onChange} />
        <input data-testid="input-nota" name="nota" value={data.nota} onChange={onChange} />
        <button data-testid="submit-button" onClick={onClick}>Salvar</button>
    </div>
);

const MockLancaNotaList = ({ data }: any) => (
    <ul>
        {data.length > 0 ? data.map((nota: any, index: number) => (
            <li key={index}>{nota.matricula} - {nota.nota}</li>
        )) : <li data-testid="lista-vazia">Nenhuma nota disponível</li>}
    </ul>
);

const mockServicoLancaNota = {
    obterTodas: async () => [],
    salvaNotaAluno: async () => true
};

const mockAlerta = {
    alertaUsuario: (mensagem: string) => {}
};

describe("LancaNotaContainer", () => {
    test("deve renderizar corretamente", async () => {
        await act(async () => {
            render(
                <LancaNotaContainer
                    servicoLancaNota={mockServicoLancaNota}
                    alerta={mockAlerta}
                    LancaNotaView={MockLancaNotaView}
                    LancaNotaList={MockLancaNotaList}
                />
            );
        });
        expect(screen.getByTestId("input-matricula")).toBeInTheDocument();
        expect(screen.getByTestId("input-nota")).toBeInTheDocument();
        expect(screen.getByTestId("submit-button")).toBeInTheDocument();
    });

    test("deve chamar obterTodas ao montar", async () => {
        mockServicoLancaNota.obterTodas = async () => [];
        await act(async () => {
            render(
                <LancaNotaContainer
                    servicoLancaNota={mockServicoLancaNota}
                    alerta={mockAlerta}
                    LancaNotaView={MockLancaNotaView}
                    LancaNotaList={MockLancaNotaList}
                />
            );
        });
        await waitFor(() => expect(mockServicoLancaNota.obterTodas).toBeDefined());
    });

    test("deve exibir lista vazia quando não houver notas", async () => {
        mockServicoLancaNota.obterTodas = async () => [];
        await act(async () => {
            render(
                <LancaNotaContainer
                    servicoLancaNota={mockServicoLancaNota}
                    alerta={mockAlerta}
                    LancaNotaView={MockLancaNotaView}
                    LancaNotaList={MockLancaNotaList}
                />
            );
        });
        await waitFor(() => expect(screen.getByTestId("lista-vazia")).toBeInTheDocument());
    });

    test("deve salvar a nota com sucesso", async () => {
        mockServicoLancaNota.salvaNotaAluno = async () => true;
        render(
            <LancaNotaContainer
                servicoLancaNota={mockServicoLancaNota}
                alerta={mockAlerta}
                LancaNotaView={MockLancaNotaView}
                LancaNotaList={MockLancaNotaList}
            />
        );
        fireEvent.change(screen.getByTestId("input-matricula"), { target: { value: "2024002" } });
        fireEvent.change(screen.getByTestId("input-nota"), { target: { value: "8" } });
        fireEvent.click(screen.getByTestId("submit-button"));
        await waitFor(() => expect(mockServicoLancaNota.salvaNotaAluno).toBeDefined());
    });

    test("deve exibir mensagem de erro ao submeter uma nota com campo vazio", async () => {
        mockServicoLancaNota.salvaNotaAluno = async () => false;
        render(
            <LancaNotaContainer
                servicoLancaNota={mockServicoLancaNota}
                alerta={mockAlerta}
                LancaNotaView={MockLancaNotaView}
                LancaNotaList={MockLancaNotaList}
            />
        );
        fireEvent.change(screen.getByTestId("input-matricula"), { target: { value: "" } });
        fireEvent.change(screen.getByTestId("input-nota"), { target: { value: "8" } });
        fireEvent.click(screen.getByTestId("submit-button"));
        await waitFor(() => {
            expect(screen.getByText("Erro: Erro ao salvar nota")).toBeInTheDocument();
        });
    });
});
