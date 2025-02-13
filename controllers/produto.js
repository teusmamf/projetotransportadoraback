const xlsx = require('xlsx');
const path = require('path');


const removeDuplicates = (array) => {
    const seen = new Set();
    return array.filter(item => {
        const key = item.codigo;  
        if (seen.has(key)) {
            return false;
        } else {
            seen.add(key);
            return true;
        }
    });
};

const readProduto = (req, res) => {
    try {
        const filePath = path.join(__dirname, '../database/consultarotas.xlsx');
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames.includes('Resultado') ? 'Resultado' : workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);

        // Mapeamento e remoção de duplicados
        let produtos = data.map(row => ({
            codigo: row['Código_Produto'],
            descricao: row['Desrição_Produto']
        }));
        produtos = removeDuplicates(produtos);

        res.status(200).json({ produtos });
    } catch (error) {
        console.error('Erro ao ler a planilha:', error);
        res.status(500).json({ error: 'Erro ao processar a planilha' });
    }
};

module.exports = { readProduto };
