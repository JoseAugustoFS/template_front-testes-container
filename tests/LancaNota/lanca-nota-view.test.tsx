import { render, screen, fireEvent } from "@testing-library/react";
import { LancaNotaView, LancaNotaViewProps } from "@/presentation/LancaNota/lanca-nota-view";

describe("LancaNotaView", () => {
    it("deve renderizar os campos corretamente", () => {
        const mockProps: LancaNotaViewProps = {
            data: { matricula: "12345", nota: 8 },
            onChange: () => {},
            onClick: () => {} 
        };

        render(<LancaNotaView {...mockProps} />);

        expect(screen.getByLabelText("Matricula")).toBeInTheDocument();
        expect(screen.getByLabelText("Nota")).toBeInTheDocument();
        expect(screen.getByText("Enviar")).toBeInTheDocument();
    });

    it("deve chamar onClick ao clicar no botão", () => {
        let clickCount = 0;
        const mockOnClick = () => {
            clickCount++;
        };

        const mockProps: LancaNotaViewProps = {
            data: { matricula: "12345", nota: 8 },
            onChange: () => {},
            onClick: mockOnClick
        };

        render(<LancaNotaView {...mockProps} />);

        const button = screen.getByText("Enviar");
        fireEvent.click(button);

        expect(clickCount).toBe(1);
    });
});
