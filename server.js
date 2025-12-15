const express = require("express");
const crypto = require("crypto");

const { lotes, resumoSafra, venderSacas } = require("./producao");
const { recordRequest, getMetrics } = require("./metrics");
const { log } = require("./logger");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  recordRequest(0, false);
  res.send("AgroSacas API — Feijão & Milho");
});

app.get("/lotes", (req, res) => {
  const start = Date.now();
  log("GET /lotes");
  recordRequest(Date.now() - start, false);
  res.json(lotes);
});

app.get("/resumo", (req, res) => {
  const start = Date.now();
  const resumo = resumoSafra();
  recordRequest(Date.now() - start, false);
  res.json(resumo);
});

app.post("/venda", (req, res) => {
  const start = Date.now();
  const { produto, sacas } = req.body || {};

  try {
    const venda = venderSacas(produto, sacas);
    log(`VENDA ${produto} ${sacas} sacas`);
    recordRequest(Date.now() - start, false);
    res.json(venda);
  } catch (e) {
    recordRequest(Date.now() - start, true);
    res.status(400).json({ error: e.message });
  }
});

app.get("/metrics", (req, res) => {
  res.type("text/plain").send(getMetrics());
});

app.get("/traces", (req, res) => {
  const traceId = crypto.randomUUID();
  const base = Date.now();

  const spans = [
    { span: "RECEBE_PEDIDO", dur: 4 },
    { span: "VALIDA_ESTOQUE", dur: 18 },
    { span: "CALCULA_PRECO", dur: 22 },
    { span: "CONFIRMA_VENDA", dur: 9 }
  ].map((s, i) => ({
    trace_id: traceId,
    etapa: s.span,
    duration_ms: s.dur,
    timestamp: new Date(base + i * 15).toISOString(),
    status: "OK"
  }));

  log(`TRACE ${traceId} gerado`);
  res.json(spans);
});

app.listen(PORT, () => {
  log(`API rodando na porta ${PORT}`);
  console.log(`🌾 AgroSacas rodando na porta ${PORT}`);
});
