import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/infra/database';
import { NotaAluno } from '@/domain/entities/nota-aluno';
import { DEB } from '@/infra/sis_debug';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    DEB('API', 'INFO', `[${req.method}] Requisição para nota ${id}`);

    switch (req.method) {
        case 'GET':
            return await getNota(req, res, id as string);
        case 'PUT':
            return await updateNota(req, res, id as string);
        case 'DELETE':
            return await deleteNota(req, res, id as string);
        default:
            res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

// GET /api/lancamentoNota/[id]
async function getNota(req: NextApiRequest, res: NextApiResponse, id: string) {
    try {
        DEB('API', 'INFO', `Buscando nota ${id}...`);
        const client = await pool.connect();
        DEB('API', 'INFO', 'Conexão estabelecida com sucesso');

        try {
            const result = await client.query(
                'SELECT id, matricula, nota FROM notas WHERE id = $1',
                [id]
            );
            
            if (result.rows.length === 0) {
                DEB('API', 'AVISO', `Nota ${id} não encontrada`);
                return res.status(404).json({ status: 404, mensagem: 'Nota não encontrada' });
            }

            DEB('API', 'INFO', 'Nota encontrada:', result.rows[0]);
            res.status(200).json(result.rows[0]);
        } catch (queryError) {
            DEB('API', 'ERRO', 'Erro na execução da query:', queryError);
            throw queryError;
        } finally {
            client.release();
            DEB('API', 'INFO', 'Conexão liberada');
        }
    } catch (error) {
        DEB('API', 'ERRO', `Erro ao buscar nota ${id}:`, error);
        res.status(500).json({ 
            status: 500, 
            mensagem: 'Erro interno do servidor',
            erro: error instanceof Error ? error.message : 'Erro desconhecido'
        });
    }
}

// PUT /api/lancamentoNota/[id]
async function updateNota(req: NextApiRequest, res: NextApiResponse, id: string) {
    try {
        DEB('API', 'INFO', `Atualizando nota ${id}...`);
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
                'UPDATE notas SET matricula = $1, nota = $2 WHERE id = $3 RETURNING *',
                [matricula, nota, id]
            );

            if (result.rows.length === 0) {
                DEB('API', 'AVISO', `Nota ${id} não encontrada para atualização`);
                return res.status(404).json({ status: 404, mensagem: 'Nota não encontrada' });
            }

            DEB('API', 'INFO', 'Nota atualizada com sucesso:', result.rows[0]);
            res.status(200).json(result.rows[0]);
        } catch (queryError) {
            DEB('API', 'ERRO', 'Erro na execução da query:', queryError);
            throw queryError;
        } finally {
            client.release();
            DEB('API', 'INFO', 'Conexão liberada');
        }
    } catch (error) {
        DEB('API', 'ERRO', `Erro ao atualizar nota ${id}:`, error);
        res.status(500).json({ 
            status: 500, 
            mensagem: 'Erro interno do servidor',
            erro: error instanceof Error ? error.message : 'Erro desconhecido'
        });
    }
}

// DELETE /api/lancamentoNota/[id]
async function deleteNota(req: NextApiRequest, res: NextApiResponse, id: string) {
    try {
        DEB('API', 'INFO', `Deletando nota ${id}...`);
        const client = await pool.connect();
        DEB('API', 'INFO', 'Conexão estabelecida com sucesso');

        try {
            const result = await client.query(
                'DELETE FROM notas WHERE id = $1 RETURNING *',
                [id]
            );

            if (result.rows.length === 0) {
                DEB('API', 'AVISO', `Nota ${id} não encontrada para deleção`);
                return res.status(404).json({ status: 404, mensagem: 'Nota não encontrada' });
            }

            DEB('API', 'INFO', 'Nota deletada com sucesso:', result.rows[0]);
            res.status(200).json(result.rows[0]);
        } catch (queryError) {
            DEB('API', 'ERRO', 'Erro na execução da query:', queryError);
            throw queryError;
        } finally {
            client.release();
            DEB('API', 'INFO', 'Conexão liberada');
        }
    } catch (error) {
        DEB('API', 'ERRO', `Erro ao deletar nota ${id}:`, error);
        res.status(500).json({ 
            status: 500, 
            mensagem: 'Erro interno do servidor',
            erro: error instanceof Error ? error.message : 'Erro desconhecido'
        });
    }
}
