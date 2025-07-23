/** @typedef {import("pg").PoolClient} PoolClient */
import { Pool } from "pg";


/** @type {Pool} */
let pool

/**
 * Função utilizada para obter uma conexão ao banco
 * @returns {Promise<PoolClient>} 
 */
export async function get_db() {
    if (!pool) {
        pool = new Pool({
            connectionString: process.env.CONNECTION_STRING
        });
    }

    const client = await pool.connect();
    console.log("Criou o pool de conexão");

    const res = await client.query("select now()");
    console.log(res.rows[0]);

    return client
}

export async function selectUsuarios(){
    const client = await connect();
    const res = await client.query("SELECT * from alunos");
    return res.rows;
}
