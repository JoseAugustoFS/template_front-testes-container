import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { LancaNotaContainer } from "@/presentation/LancaNota/lanca-nota-container";
import { act } from 'react';

// Mock do componente de visualização
const MockLancaNotaView = ({ data, onChange, onClick }: any) => (
    <div>
        <input data-testid="input-matricula" name="matricula" value={data.matricula} onChange={onChange} />
        <input data-testid="input-nota" name="nota" value={data.nota} onChange={onChange} />
        <button data-testid="submit-button" onClick={onClick}>Salvar</button>
    </div>
);

// Mock da lista de lançamento de notas
const MockLancaNotaList = ({ data }: any) => (
    <ul>
        {data.length > 0 ? data.map((nota: any, index: number) => (
            <li key={index}>{nota.matricula} - {nota.nota}</li>
        )) : <li data-testid="lista-vazia">Nenhuma nota disponível</li>}
    </ul>
);

// Mock do serviço LancaNota
const mockServicoLancaNota = {
    obterTodas: jest.fn(),
    salvaNotaAluno: jest.fn()
};

// Mock do serviço de alerta
const mockAlerta = {
    alertaUsuario: jest.fn()
};

// Função auxiliar para "drain" promessas pendentes
function flushPromises() {
    return new Promise(resolve => setImmediate(resolve));
}

describe("LancaNotaContainer", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

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
        mockServicoLancaNota.obterTodas.mockResolvedValue([]);
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

        await waitFor(() => expect(mockServicoLancaNota.obterTodas).toHaveBeenCalledTimes(1));
    });

    test("deve exibir lista vazia quando não houver notas", async () => {
        mockServicoLancaNota.obterTodas.mockResolvedValue([]);
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

    test("deve exibir uma lista com notas", async () => {
        const mockNotas = [
            { matricula: "1", nota: "6" },
            { matricula: "2", nota: "10" }
        ];
        mockServicoLancaNota.obterTodas.mockResolvedValue(mockNotas);

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

        await waitFor(() => {
            expect(screen.getByText("1 - 6")).toBeInTheDocument();
            expect(screen.getByText("2 - 10")).toBeInTheDocument();
        });
    });

    test("deve chamar salvaNotaAluno ao submeter uma nota", async () => {
        mockServicoLancaNota.salvaNotaAluno.mockResolvedValue(true);
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

        fireEvent.change(screen.getByTestId("input-matricula"), { target: { value: "2024001" } });
        fireEvent.change(screen.getByTestId("input-nota"), { target: { value: "9" } });
        fireEvent.click(screen.getByTestId("submit-button"));

        await waitFor(() => expect(mockServicoLancaNota.salvaNotaAluno).toHaveBeenCalledTimes(1));
    });

    test("deve chamar alertaUsuario ao ocorrer erro em obterTodas", async () => {
        mockServicoLancaNota.obterTodas.mockRejectedValue(new Error("Erro simulado"));

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

        await waitFor(() =>
            expect(mockAlerta.alertaUsuario).toHaveBeenCalledWith("Problema ao buscar dados: Erro simulado")
        );
    });
});
