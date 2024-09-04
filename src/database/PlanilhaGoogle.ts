import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

function getIdPlanilhaSheet() {
  const planilhaGoogleURL = process.env.GOOGLE_SHEET_URL;

    if (!planilhaGoogleURL) {
        throw new Error('A variável de ambiente GOOGLE_SHEET_URL não está definida.');
    }
    
    const parts = planilhaGoogleURL.split('/'); // Vai transformar a URL da planilha em um array e separa-lo pelo "/".
    return parts[5]; // Retorna o ID da planilha apenas.
}

const spreadsheetId = getIdPlanilhaSheet(); // Armagena o ID em uma variavel


async function obterDadosPlanilha() {
  const range = process.env.GOOGLE_NAME_SHEET;
  
  const apiKey = process.env.GOOGLE_API_KEY;

  if(!range && !apiKey) {
    throw new Error('As variável de ambiente não está definida.');
  }

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;

  try {
    const response = await axios.get(url);

    return response.data.values;
  } catch (error) {
    console.error('Erro ao acessar a planilha:', error);
  }
}

export default obterDadosPlanilha;