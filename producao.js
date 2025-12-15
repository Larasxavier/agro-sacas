const lotes = [];
const produtos = ["feijao", "milho"];

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

for (let i = 1; i <= 100; i++) {
  const produto = produtos[i % 2];
  lotes.push({
    id: i,
    produto,
    fazenda: `Fazenda ${String.fromCharCode(65 + (i % 5))}`,
    sacas_disponiveis: rand(200, 1200),
    preco_saca: produto === "feijao" ? rand(220, 350) : rand(80, 140)
  });
}

function resumoSafra() {
  return lotes.reduce(
    (acc, l) => {
      acc[l.produto].sacas += l.sacas_disponiveis;
      acc[l.produto].valor += l.sacas_disponiveis * l.preco_saca;
      return acc;
    },
    {
      feijao: { sacas: 0, valor: 0 },
      milho: { sacas: 0, valor: 0 }
    }
  );
}

function venderSacas(produto, sacas) {
  if (!produtos.includes(produto)) {
    throw new Error("Produto inválido");
  }
  let restante = sacas;
  let total = 0;

  for (const lote of lotes) {
    if (lote.produto === produto && restante > 0) {
      const vendido = Math.min(lote.sacas_disponiveis, restante);
      lote.sacas_disponiveis -= vendido;
      restante -= vendido;
      total += vendido * lote.preco_saca;
    }
  }

  if (restante > 0) {
    throw new Error("Estoque insuficiente");
  }

  return {
    produto,
    sacas_vendidas: sacas,
    valor_total: total.toFixed(2)
  };
}

module.exports = { lotes, resumoSafra, venderSacas };
