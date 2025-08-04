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

  // Event listener para data
  document.getElementById("data").addEventListener("change", (e) => {
    exibirHorarios(e.target.value);
  });
});
