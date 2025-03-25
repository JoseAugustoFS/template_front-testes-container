-- Criação da tabela de notas
CREATE TABLE IF NOT EXISTS notas (
    id SERIAL PRIMARY KEY,
    matricula VARCHAR(7) NOT NULL,
    nota NUMERIC(4,2) NOT NULL CHECK (nota >= 0 AND nota <= 10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índice para busca por matrícula
CREATE INDEX IF NOT EXISTS idx_notas_matricula ON notas(matricula);

-- Trigger para atualizar o updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_notas_updated_at
    BEFORE UPDATE ON notas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
