/**
 * Página de Lançamento de Notas
 * Responsabilidade: Renderizar o componente LancaNotaPresenter
 */
import { LancaNotaPresenter } from '@/presentation/LancaNota/lanca-nota-presenter';

export default function LancaNotaPage() {
    return (
        <div style={{ padding: '20px' }}>
            <h1>Lançamento de Notas</h1>
            <LancaNotaPresenter />
        </div>
    );
}
