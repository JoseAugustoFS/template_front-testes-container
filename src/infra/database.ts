import { Pool } from 'pg';

// Configuração do pool de conexões com o PostgreSQL
const pool = new Pool({
    user: process.env.POSTGRES_USER || 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    database: process.env.POSTGRES_DB || 'notas_db',
    password: process.env.POSTGRES_PASSWORD || 'psql',
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    max: 20, // número máximo de conexões no pool
    idleTimeoutMillis: 30000, // tempo máximo que uma conexão pode ficar ociosa
    connectionTimeoutMillis: 2000, // tempo máximo para estabelecer uma conexão
});

// Teste de conexão inicial
pool.connect()
    .then(() => console.log('Conectado ao PostgreSQL'))
    .catch(err => console.error('Erro ao conectar ao PostgreSQL:', err));

export default pool;
