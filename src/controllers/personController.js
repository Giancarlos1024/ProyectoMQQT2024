const sql = require('mssql');
const dbConnection = require('../config/dbconfig');

exports.getPeople = async (req, res) => {
    try {
        const pool = await dbConnection.connect();
        const result = await pool.request().query('SELECT * FROM Personas');
        res.json(result.recordset);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).send('Error al obtener datos de personas');
    }
};

exports.getPersonById = async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await dbConnection.connect();
        const result = await pool.request().input('id', sql.Int, id).query('SELECT * FROM Personas WHERE PersonaID = @id');
        res.json(result.recordset[0] || {});
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).send('Error al obtener persona');
    }
};

exports.addPerson = async (req, res) => {
    const { Nombre, Apellido, Dni, Cargo, Empresa } = req.body;
    try {
        const pool = await dbConnection.connect();
        await pool.request()
            .input('Nombre', sql.NVarChar, Nombre)
            .input('Apellido', sql.NVarChar, Apellido)
            .input('Dni', sql.NVarChar, Dni)
            .input('Cargo', sql.NVarChar, Cargo)
            .input('Empresa', sql.NVarChar, Empresa)
            .query('INSERT INTO Personas (Nombre, Apellido, Dni, Cargo, Empresa) VALUES (@Nombre, @Apellido, @Dni, @Cargo, @Empresa)');
        res.status(201).send({ message: 'Persona creada correctamente' });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).send('Error al crear persona');
    }
};

exports.updatePerson = async (req, res) => {
    const { id } = req.params;
    const { Nombre, Apellido, Dni, Cargo, Empresa } = req.body;
    try {
        const pool = await dbConnection.connect();
        await pool.request()
            .input('id', sql.Int, id)
            .input('Nombre', sql.NVarChar, Nombre)
            .input('Apellido', sql.NVarChar, Apellido)
            .input('Dni', sql.NVarChar, Dni)
            .input('Cargo', sql.NVarChar, Cargo)
            .input('Empresa', sql.NVarChar, Empresa)
            .query('UPDATE Personas SET Nombre = @Nombre, Apellido = @Apellido, Dni = @Dni, Cargo = @Cargo, Empresa = @Empresa WHERE PersonaID = @id');
        res.status(200).send({ message: 'Persona actualizada correctamente' });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).send('Error al actualizar persona');
    }
};

exports.deletePerson = async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await dbConnection.connect();
        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM Personas WHERE PersonaID = @id');
        res.status(204).send(); // No Content
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).send('Error al eliminar persona');
    }
};
