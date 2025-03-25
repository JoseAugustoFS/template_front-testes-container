import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/infra/database';
import { NotaAluno } from '@/domain/entities/nota-aluno';
import { DEB } from '@/infra/sis_debug';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    DEB('API', 'INFO', `Método: ${req.method}, URL: ${req.url}`);
    
    switch (req.method) {
        case 'GET':
            return await getNotas(req, res);
        case 'POST':
            return await createNota(req, res);
        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

// GET /api/lancamentoNota
async function getNotas(req: NextApiRequest, res: NextApiResponse) {
    try {
        DEB('API', 'INFO', 'Iniciando busca de notas...');
        
        // Testa a conexão antes da query
        const client = await pool.connect();
        DEB('API', 'INFO', 'Conexão estabelecida com sucesso');
        
        try {
            const result = await client.query(
                'SELECT id, matricula, nota FROM notas ORDER BY matricula'
            );
            DEB('API', 'INFO', `Query executada com sucesso. Resultados: ${result.rowCount}`);
            
            // Retorna um objeto com mais informações sobre o resultado
            const response = {
                status: 200,
                total: result.rowCount,
                data: result.rows
            };
            
            DEB('API', 'INFO', 'Retornando dados:', response);
            res.status(200).json(response);
        } catch (queryError) {
            DEB('API', 'ERRO', 'Erro na execução da query:', queryError);
            throw queryError;
        } finally {
            client.release();
            DEB('API', 'INFO', 'Conexão liberada');
        }
    } catch (error) {
        DEB('API', 'ERRO', 'Erro ao buscar notas:', error);
        res.status(500).json({ 
            status: 500, 
            mensagem: 'Erro interno do servidor',
            erro: error instanceof Error ? error.message : 'Erro desconhecido'
        });
    }
}

// POST /api/lancamentoNota
async function createNota(req: NextApiRequest, res: NextApiResponse) {
    try {
        DEB('API', 'INFO', 'Iniciando criação de nota');
        DEB('API', 'INFO', 'Dados recebidos:', req.body);
        
        const { matricula, nota } = req.body as NotaAluno;

        // Validações
        if (!matricula || !nota) {
            DEB('API', 'AVISO', 'Dados inválidos:', { matricula, nota });
            return res.status(400).json({ status: 400, mensagem: 'Dados inválidos' });
        }

        if (nota < 0 || nota > 10) {
            DEB('API', 'AVISO', 'Nota inválida:', nota);
            return res.status(400).json({ status: 400, mensagem: 'Nota deve estar entre 0 e 10' });
        }

        if (!/^\d{7}$/.test(matricula)) {
            DEB('API', 'AVISO', 'Matrícula inválida:', matricula);
            return res.status(400).json({ status: 400, mensagem: 'Matrícula deve ter 7 dígitos' });
        }

        const client = await pool.connect();
        DEB('API', 'INFO', 'Conexão estabelecida com sucesso');
        
        try {
            const result = await client.query(
                'INSERT INTO notas (matricula, nota) VALUES ($1, $2) RETURNING *',
                [matricula, nota]
            );
            
            const response = {
                status: 201,
                mensagem: 'Nota criada com sucesso',
                data: result.rows[0]
            };
            
            DEB('API', 'INFO', 'Nota criada:', response);
            res.status(201).json(response);
        } catch (queryError) {
            DEB('API', 'ERRO', 'Erro na execução da query:', queryError);
            throw queryError;
        } finally {
            client.release();
            DEB('API', 'INFO', 'Conexão liberada');
        }
    } catch (error) {
        DEB('API', 'ERRO', 'Erro ao criar nota:', error);
        res.status(500).json({ 
            status: 500, 
            mensagem: 'Erro interno do servidor',
            erro: error instanceof Error ? error.message : 'Erro desconhecido'
        });
    }
}
