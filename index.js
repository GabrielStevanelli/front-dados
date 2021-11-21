const api = axios.create({
  baseURL: "https://lista-recados-cache.herokuapp.com/",
});

document.getElementById("adiciona").onclick = adiciona;
let mensagens = [];

async function getMessage() {
  const { data } = await api.get("/messages");

  mensagens = data;
  geraLista();
}

async function adiciona() {
  let titulo = document.getElementById("titulo").value;
  let mensagem = document.getElementById("mensagem").value;

  if (titulo == "" || mensagem == "") {
    return;
  }

  const {
    data: { uid, title, message },
  } = await api.post("/messages", {
    title: titulo,
    message: mensagem,
  });
  mensagens.push({ uid, title, message });
  getMessage();
}

/*let mensagens = JSON.parse(localStorage.getItem("mensagens")) || [];*/

function geraLista() {
  let tBody = document.getElementById("tbody");
  tBody.innerHTML = "";
  for (let message of mensagens) {
    let tr = document.createElement("tr");
    let th = document.createElement("th");
    let tdTitulo = document.createElement("td");
    let tdMensagem = document.createElement("td");
    let tdGerenciar = document.createElement("td");

    let deleteBtn = document.createElement("button");
    deleteBtn.setAttribute("class", "btn btn-danger mx-2");
    deleteBtn.setAttribute("id", message.uid);
    deleteBtn.onclick = async function () {
      await api.delete(`/messages/${message.uid}`);
      getMessage();
    };
    deleteBtn.innerHTML = "Excluir";

    let editBtn = document.createElement("button");
    editBtn.setAttribute("class", "btn btn-warning mx-2");
    editBtn.setAttribute("id", "myBtn");
    editBtn.onclick = function () {
      modal.style.display = "block";
      let editaModalBtn = document.getElementById("editaModal");

      document.getElementById("tituloModal").value = message.title;
      document.getElementById("mensagemModal").value = message.message;

      editaModalBtn.onclick = async function () {
        let titulo = document.getElementById("tituloModal").value;
        let mensagem = document.getElementById("mensagemModal").value;
        await api.put(`/messages/${message.uid}`, {
          title: titulo,
          message: mensagem,
        });
        getMessage();
      };
    };
    editBtn.innerHTML = "Editar";

    tdGerenciar.appendChild(editBtn);
    tdGerenciar.appendChild(deleteBtn);

    th.innerHTML = message.uid;
    tdTitulo.innerHTML = message.title;
    tdMensagem.innerHTML = message.message;

    tr.appendChild(th);
    tr.appendChild(tdTitulo);
    tr.appendChild(tdMensagem);
    tr.appendChild(tdGerenciar);

    tBody.appendChild(tr);
  }
}

getMessage();

function salvaLocalStorage() {
  localStorage.setItem("mensagens", JSON.stringify(mensagens));
}

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
