export class Utils {
    /**
     * Decodifica um JWT e retorna a data de expiração (exp) como objeto Date.
     * @param {string} tokenJwt - O token JWT a ser decodificado.
     * @returns {Date|null} - A data de expiração ou null se não houver exp.
     */
    static obterDataExpiracaoJwt(tokenJwt) {
        if (!tokenJwt) return null;

        // Um JWT tem três partes separadas por ponto
        const partes = tokenJwt.split('.');
        if (partes.length !== 3) return null;

        try {
            // Decodifica o payload (segunda parte)
            const payloadBase64 = partes[1];
            const payloadJson = Buffer.from(payloadBase64, 'base64').toString('utf8');
            const dados = JSON.parse(payloadJson);

            // Verifica se existe o campo exp
            if (!dados.exp) return null;

            // exp está em segundos desde 01/01/1970
            const dataExpiracao = new Date(dados.exp * 1000);
            return dataExpiracao;
        } catch (erro) {
            // Retorna null se houver erro na decodificação
            return null;
        }
    }
}
