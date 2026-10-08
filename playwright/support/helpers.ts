export function generateOrderCode() {
    const prefixo = "VLO";
    const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let aleatorio = "";
    
    // Gera 7 caracteres aleatórios
    for (let i = 0; i < 7; i++) {
        const indice = Math.floor(Math.random() * caracteres.length);
        aleatorio += caracteres[indice];
    }
    
    return `${prefixo}-${aleatorio}`;}