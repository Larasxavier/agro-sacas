const express = require("express");
const crypto = require("crypto");

const { sacas, getSacaById, resumoPorCultura } = require("./sacas");
const { recordRequest, getMetrics } = require("./metrics");
const { log } = require("./logger");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

/* Health */
app.get("/", (req, res) => {
  recordRequest(1, false);
 
