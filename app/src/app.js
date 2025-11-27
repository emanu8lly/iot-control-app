// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB921W8mUMo-lpP38XRvXvuVsxSg59Zk0k",
  authDomain: "telalogin-app.firebaseapp.com",
  projectId: "telalogin-app",
  storageBucket: "telalogin-app.firebasestorage.app",
  messagingSenderId: "596868503377",
  appId: "1:596868503377:web:c6e61e3978f9326f1b2570",
  measurementId: "G-HRDLVH6S78",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
signOut(auth).then(() => {
  mostrarTela("telaLogin");
});

// Alternar telas
function mostrarTela(telaId) {
  const telas = ["telaLogin", "telaCadastro", "telaPrincipal"];
  telas.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.classList.add("escondido");
  });
  const ativa = document.getElementById(telaId);
  if (ativa) ativa.classList.remove("escondido");
}

window.mostrarTela = mostrarTela;

function setMensagem(elId, texto, cor = "") {
  const el = document.getElementById(elId);
  if (el) {
    el.textContent = texto;
    if (cor) el.style.color = cor;
  }
}

function limparCamposLogin() {
  const email = document.getElementById("emailLogin");
  const senha = document.getElementById("senhaLogin");
  if (email) email.value = "";
  if (senha) senha.value = "";
}

// Navegação
irParaCadastro.addEventListener("click", () => {
  mostrarTela("telaCadastro");

  const senhaLogin = document.getElementById("senhaLogin");
  if (senhaLogin) senhaLogin.value = "";

  const nome = document.getElementById("nome");
  const senhaCadastro = document.getElementById("senhaCadastro");
  const msgCadastro = document.getElementById("mensagemCadastro");
  const emailLogin = document.getElementById("emailLogin")?.value.trim().toLowerCase();
  const emailCadastro = document.getElementById("emailCadastro");

  if (emailLogin && emailCadastro) {
    emailCadastro.value = emailLogin;
  }

  if (nome) nome.value = "";
  if (senhaCadastro) senhaCadastro.value = "";
  if (msgCadastro) msgCadastro.textContent = "";
});

const voltarParaLogin = document.getElementById("voltarParaLogin");
if (voltarParaLogin) {
  voltarParaLogin.addEventListener("click", () => {
    mostrarTela("telaLogin");
    const nome = document.getElementById("nome");
    const senhaCadastro = document.getElementById("senhaCadastro");
    const msgCadastro = document.getElementById("mensagemCadastro");
    if (nome) nome.value = "";
    if (senhaCadastro) senhaCadastro.value = "";
    if (msgCadastro) msgCadastro.textContent = "";
  });
}

// Login
const botaoEntrar = document.getElementById("botaoEntrar");
if (botaoEntrar) {
  botaoEntrar.addEventListener("click", async () => {
    const email = document.getElementById("emailLogin")?.value.trim().toLowerCase();
    const senha = document.getElementById("senhaLogin")?.value;

    if (!email || !senha) {
      setMensagem("mensagemLogin", "⚠️ Informe e-mail e senha.", "orange");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, senha);
      const nomeUsuario = userCredential.user.displayName || "Usuário";

      mostrarTela("telaPrincipal");
      const nomeEl = document.getElementById("nomeUsuario");
      if (nomeEl) nomeEl.textContent = nomeUsuario;

      if (window.updateMQTTStatus) window.updateMQTTStatus("🔴 Desconectado");

      setTimeout(() => {
        if (window.connectMQTT) window.connectMQTT();
      }, 1500);
    } catch (error) {
      let mensagem = "⚠️ Erro ao fazer login. Verifique os dados.";
      if (error.code === "auth/invalid-email") mensagem = "⚠️ E-mail inválido.";
      else if (error.code === "auth/wrong-password" || error.code === "auth/invalid-credential")
        mensagem = "⚠️ E-mail e/ou senha incorreto(s).";
      else if (error.code === "auth/too-many-requests") mensagem = "⚠️ Muitas tentativas. Aguarde e tente novamente.";
      else if (error.code === "auth/user-disabled") mensagem = "⚠️ Sua conta foi desativada.";

      setMensagem("mensagemLogin", mensagem, "red");
    }
  });
}

// Recuperar Senha
const botaoRecuperar = document.getElementById("botaoRecuperar");
if (botaoRecuperar) {
  botaoRecuperar.addEventListener("click", async () => {
    const email = document.getElementById("emailLogin")?.value.trim().toLowerCase();

    if (!email) {
      setMensagem("mensagemLogin", "⚠️ Informe o e-mail para recuperar a senha.", "orange");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMensagem("mensagemLogin", "📩 Email de recuperação enviado!", "green");
    } catch (error) {
      let mensagem = "⚠️ Erro ao enviar o email de recuperação.";
      if (error.code === "auth/invalid-email") mensagem = "⚠️ E-mail inválido.";
      else if (error.code === "auth/user-not-found") mensagem = "⚠️ Usuário não encontrado.";
      setMensagem("mensagemLogin", mensagem, "red");
    }
  });
}

// Cadastro
const botaoCadastrar = document.getElementById("botaoCadastrar");
if (botaoCadastrar) {
  botaoCadastrar.addEventListener("click", async () => {
    const nome = document.getElementById("nome")?.value.trim();
    const senha = document.getElementById("senhaCadastro")?.value.trim();
    const emailCadastro = document.getElementById("emailCadastro");
    const email = emailCadastro?.value.trim().toLowerCase();

    if (!nome || !senha || !email) {
      setMensagem("mensagemCadastro", "Preencha nome, email e senha.", "red");
      return;
    }

    botaoCadastrar.textContent = "Cadastrando...";
    setTimeout(() => {
      botaoCadastrar.textContent = "CADASTRAR";
    }, 2000);

    try {
      await createUserWithEmailAndPassword(auth, email, senha);
      await updateProfile(auth.currentUser, { displayName: nome });

      setTimeout(() => {
        mostrarTela("telaPrincipal");
        const nomeEl = document.getElementById("nomeUsuario");
        if (nomeEl) nomeEl.textContent = nome;

        if (window.updateMQTTStatus) window.updateMQTTStatus("🔴 Desconectado");
        if (window.connectMQTT) window.connectMQTT();
      }, 1500);
    } catch (error) {
      let mensagem = "⚠️ Erro: " + error.message;
      if (error.code === "auth/email-already-in-use") mensagem = "⚠️ Este e-mail já está cadastrado.";
      else if (error.code === "auth/invalid-email") mensagem = "⚠️ O e-mail informado não é válido.";
      else if (error.code === "auth/weak-password") mensagem = "⚠️ A senha precisa ter pelo menos 6 caracteres.";
      setMensagem("mensagemCadastro", mensagem, "red");
    }
  });
}

// MQTT
document.addEventListener("DOMContentLoaded", () => {
  const ligarLED = document.getElementById("ligarLED");
  const desligarLED = document.getElementById("desligarLED");
  const atualizarTemp = document.getElementById("atualizarTemp");

  if (ligarLED) ligarLED.addEventListener("click", () => window.publishMessage?.("login-ok"));
  if (desligarLED) desligarLED.addEventListener("click", () => window.publishMessage?.("logout"));
  if (atualizarTemp) atualizarTemp.addEventListener("click", () => window.publishMessage?.("atualizar-temp"));
});

let isLoggingOut = false;

const botaoSair = document.getElementById("botaoSair");
if (botaoSair) {
  botaoSair.addEventListener("click", async () => {
    isLoggingOut = true; 
    if (window.updateMQTTStatus) window.updateMQTTStatus("🔴 Desconectando...");
    if (window.disconnectMQTT) window.disconnectMQTT();

    setTimeout(async () => {
      await signOut(auth);
      limparCamposLogin();
      isLoggingOut = false; 
      mostrarTela("telaLogin");

      const statusEl = document.getElementById("statusMQTT");
      if (statusEl) statusEl.textContent = "";
    }, 3000); 
  });
}

onAuthStateChanged(auth, (user) => {
  if (isLoggingOut) return; 

  if (user) {
    const nomeUsuario = user.displayName || "Usuário";
    mostrarTela("telaPrincipal");
    const nomeEl = document.getElementById("nomeUsuario");
    if (nomeEl) nomeEl.textContent = nomeUsuario;
    if (window.updateMQTTStatus) window.updateMQTTStatus("🔴 Desconectado");

    setTimeout(() => {
      if (window.connectMQTT) window.connectMQTT();
    }, 1500);
  } else {
    mostrarTela("telaLogin");
  }
});
