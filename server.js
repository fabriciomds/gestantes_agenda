const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(express.json());

// Criação do banco de dados e tabela se não existir
const db = new sqlite3.Database("./agendamentos.db", (err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados", err.message);
  } else {
    db.run(
      "CREATE TABLE IF NOT EXISTS agendamentos (nome TEXT, cpf TEXT, data TEXT, horario TEXT)",
      (err) => {
        if (err) {
          console.error("Erro ao criar tabela", err.message);
        }
      }
    );
  }
});

// Endpoint para verificar se o horário está ocupado
app.get("/verificar", (req, res) => {
  const { data, horario } = req.query;

  db.get(
    "SELECT * FROM agendamentos WHERE data = ? AND horario = ?",
    [data, horario],
    (err, row) => {
      if (err) {
        return res.status(500).send("Erro no servidor");
      }
      res.json({ ocupado: row != undefined });
    }
  );
});

// Endpoint para agendamento
app.post("/agendar", (req, res) => {
  const { nome, cpf, data, horario } = req.body;

  db.run(
    "INSERT INTO agendamentos (nome, cpf, data, horario) VALUES (?, ?, ?, ?)",
    [nome, cpf, data, horario],
    (err) => {
      if (err) {
        return res.status(500).send("Erro no agendamento");
      }
      res.status(200).send("Agendamento confirmado");
    }
  );
});

// Endpoint para listar todos os agendamentos
app.get("/agendamentos", (req, res) => {
  db.all("SELECT * FROM agendamentos", [], (err, rows) => {
    if (err) {
      return res.status(500).send("Erro no servidor");
    }
    res.json(rows); // Envia os agendamentos como resposta
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
