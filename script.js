document.addEventListener("DOMContentLoaded", () => {
  const horarios = ["08:00", "09:00", "10:00", "13:00", "14:00", "15:00"];
  const horariosDisponiveis = document.getElementById("horariosDisponiveis");
  const mensagem = document.getElementById("mensagem");

  // Função para verificar se o horário está ocupado
  const verificarDisponibilidade = (data, horario) => {
    // Requisição para backend (deve ser implementada)
    return fetch(`/verificar?data=${data}&horario=${horario}`)
      .then((res) => res.json())
      .then((data) => data.ocupado);
  };

  const exibirHorarios = (dataSelecionada) => {
    horariosDisponiveis.innerHTML = "";

    if (dataSelecionada) {
      const diaDaSemana = new Date(dataSelecionada).getDay();

      if (diaDaSemana === 0 || diaDaSemana === 6) {
        mensagem.textContent = "O Dentista só atende de segunda à quinta";
        return;
      }
      mensagem.textContent = "";
    }

    horarios.forEach((horario) => {
      const div = document.createElement("div");
      div.textContent = horario;
      div.addEventListener("click", () => selecionarHorario(horario));

      // Verificar disponibilidade
      verificarDisponibilidade(dataSelecionada, horario).then((ocupado) => {
        if (ocupado) {
          div.classList.add("ocupado");
          div.style.pointerEvents = "none";
        }
      });

      horariosDisponiveis.appendChild(div);
    });
  };

  // Função de selecionar horário
  const selecionarHorario = (horario) => {
    mensagem.textContent = `Agendamento confirmado para o horário: ${horario}`;
  };
  const carregarAgendamentos = () => {
    fetch("/agendamentos")
      .then((res) => res.json())
      .then((agendamentos) => {
        const tabela = document
          .getElementById("tabelaAgendamentos")
          .getElementsByTagName("tbody")[0];
        tabela.innerHTML = ""; // Limpa a tabela antes de repopular

        agendamentos.forEach((agendamento) => {
          const linha = document.createElement("tr");
          linha.innerHTML = `
          <td>${agendamento.nome}</td>
          <td>${agendamento.cpf}</td>
          <td>${agendamento.data}</td>
          <td>${agendamento.horario}</td>
        `;
          tabela.appendChild(linha);
        });
      });
  };

  // Event listener para data
  document.getElementById("data").addEventListener("change", (e) => {
    exibirHorarios(e.target.value);
  });
});
document.addEventListener("DOMContentLoaded", () => {
  // Carregar agendamentos ao iniciar
  carregarAgendamentos();

  const horarios = ["08:00", "09:00", "10:00", "13:00", "14:00", "15:00"];
  const horariosDisponiveis = document.getElementById("horariosDisponiveis");
  const mensagem = document.getElementById("mensagem");

  const verificarDisponibilidade = (data, horario) => {
    return fetch(`/verificar?data=${data}&horario=${horario}`)
      .then((res) => res.json())
      .then((data) => data.ocupado);
  };

  const exibirHorarios = (dataSelecionada) => {
    horariosDisponiveis.innerHTML = "";
    if (dataSelecionada) {
      const diaDaSemana = new Date(dataSelecionada).getDay();
      if (diaDaSemana === 0 || diaDaSemana === 6) {
        mensagem.textContent = "O Dentista só atende de segunda à quinta";
        return;
      }
      mensagem.textContent = "";
    }

    horarios.forEach((horario) => {
      const div = document.createElement("div");
      div.textContent = horario;
      div.addEventListener("click", () => selecionarHorario(horario));

      verificarDisponibilidade(dataSelecionada, horario).then((ocupado) => {
        if (ocupado) {
          div.classList.add("ocupado");
          div.style.pointerEvents = "none";
        }
      });

      horariosDisponiveis.appendChild(div);
    });
  };

  const selecionarHorario = (horario) => {
    mensagem.textContent = `Agendamento confirmado para o horário: ${horario}`;
    // Enviar agendamento para o servidor
    const form = document.getElementById("form");
    const nome = form.nome.value;
    const cpf = form.cpf.value;
    const data = form.data.value;

    fetch("/agendar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, cpf, data, horario }),
    }).then((response) => {
      if (response.ok) {
        carregarAgendamentos(); // Atualizar a lista de agendamentos após o agendamento
      }
    });
  };

  document.getElementById("data").addEventListener("change", (e) => {
    exibirHorarios(e.target.value);
  });
});
