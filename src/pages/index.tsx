import { useRouter } from 'next/router';
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Componente da página inicial
 * Responsabilidade única: Apresentar a tela inicial e redirecionar para o sistema de notas
 */
export default function Home() {
    // Hook do Next.js para navegação
    const router = useRouter();

    return (
        <div style={{ padding: '20px' }}>
            {/* Título principal */}
            <h1>Sistema de Notas</h1>
            
            {/* Descrição do sistema */}
            <p>Sistema para gerenciamento de notas dos alunos</p>
            
            {/* Botão de acesso ao sistema */}
            <button 
                onClick={() => router.push('/LancaNota')}
                style={{
                    padding: '10px 20px',
                    marginTop: '20px',
                    cursor: 'pointer'
                }}
            >
                Acessar Sistema de Notas
            </button>
        </div>
    );
}
