const xlsx = require('xlsx');
const path = require('path');


const removeDuplicates = (array) => {
    const seen = new Set();
    return array.filter(item => {
        const key = `${item.cidade}-${item.uf}`;
        if (seen.has(key)) {
            return false;
        } else {
            seen.add(key);
            return true;
        }
    });
};


const readOrigincity = (req, res) => {
    try {
        const filePath = path.join(__dirname, '../database/consultarotas.xlsx');
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0]; 
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);

       
        let cidadesOrigem = data.map(row => ({
            cidade: row['Cidade Origem'],
            uf: row['UF Origem']
        }));
        cidadesOrigem = removeDuplicates(cidadesOrigem);

        res.status(200).json({ cidadesOrigem });
    } catch (error) {
        console.error('Erro ao ler a planilha:', error);
        res.status(500).json({ error: 'Erro ao processar a planilha' });
    }
};

// Função para ler a coluna "Cidade Destino" com "UF Destino"
const readDestinyCity = (req, res) => {
    try {
        const filePath = path.join(__dirname, '../database/consultarotas.xlsx');
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);

        // Mapeamento e remoção de duplicados
        let cidadesDestino = data.map(row => ({
            cidade: row['Cidade Destino'],
            uf: row['UF Destino']
        }));
        cidadesDestino = removeDuplicates(cidadesDestino);

        res.status(200).json({ cidadesDestino });
    } catch (error) {
        console.error('Erro ao ler a planilha:', error);
        res.status(500).json({ error: 'Erro ao processar a planilha' });
    }
};

module.exports = { readDestinyCity, readOrigincity };
