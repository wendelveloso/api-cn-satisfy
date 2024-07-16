const formatarEmReais = (valor) => {
valor = String(valor).padStart(3, '0');
let centavos = valor.slice(-2);
let valorPrincipal = valor.slice(0, -2);
if (valorPrincipal.length > 3) {
    valorPrincipal = valorPrincipal.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
return "R$" + valorPrincipal + "," + centavos  
}

module.exports = formatarEmReais