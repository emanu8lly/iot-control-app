// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, updateProfile } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB921W8mUMo-lpP38XRvXvuVsxSg59Zk0k",
  authDomain: "telalogin-app.firebaseapp.com",
  projectId: "telalogin-app",
  storageBucket: "telalogin-app.firebasestorage.app",
  messagingSenderId: "596868503377",
  appId: "1:596868503377:web:c6e61e3978f9326f1b2570",
  measurementId: "G-HRDLVH6S78"
};

// Inicializar Firebase e Auth
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Alternar entre telas
document.getElementById("irParaCadastro").addEventListener("click", () => {
  document.getElementById("telaLogin").classList.add("escondido");
  document.getElementById("telaCadastro").classList.remove("escondido");

  document.getElementById("senhaLogin").value = "";
  document.getElementById("mensagemLogin").textContent = "";
  document.getElementById("nome").value = "";
  document.getElementById("senhaCadastro").value = "";
  document.getElementById("mensagemCadastro").textContent = "";
});

document.getElementById("voltarParaLogin").addEventListener("click", () => {
  document.getElementById("telaCadastro").classList.add("escondido");
  document.getElementById("telaLogin").classList.remove("escondido");

  document.getElementById("nome").value = "";
  document.getElementById("senhaCadastro").value = "";
  document.getElementById("mensagemCadastro").textContent = "";
});

// Login
document.getElementById("botaoEntrar").addEventListener("click", async () => {
  const email = document.getElementById("emailLogin").value.trim().toLowerCase();
  const senha = document.getElementById("senhaLogin").value;

  if (!email || !senha) {
    document.getElementById("mensagemLogin").textContent = "⚠️ Informe e-mail e senha.";
    document.getElementById("mensagemLogin").style.color = "orange";
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    const nomeUsuario = userCredential.user.displayName || "Usuário";

    document.getElementById("mensagemLogin").textContent = `✅ Login realizado com sucesso!`;
    document.getElementById("mensagemLogin").style.color = "green";
    document.getElementById("telaLogin").classList.add("escondido");
    document.getElementById("telaPrincipal").classList.remove("escondido");
    document.getElementById("nomeUsuario").textContent = nomeUsuario;
  } catch (error) {
    let mensagem = "⚠️ Erro ao fazer login. Verifique os dados e tente novamente.";

    if (error.code === "auth/invalid-email") {
      mensagem = "⚠️ E-mail inválido. Verifique e tente novamente.";
    } else if (error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
      mensagem = "⚠️ E-mail e/ou senha incorreto(s). Tente novamente.";
    } else if (error.code === "auth/too-many-requests") {
      mensagem = "⚠️ Muitas tentativas. Aguarde um pouco e tente de novo.";
    } else if (error.code === "auth/user-disabled") {
      mensagem = "⚠️ Sua conta foi desativada. Entre em contato com o suporte.";
    }

    document.getElementById("mensagemLogin").textContent = mensagem;
    document.getElementById("mensagemLogin").style.color = "red";
  }
});

// Recuperar senha
document.getElementById("botaoRecuperar").addEventListener("click", async () => {
  const email = document.getElementById("emailLogin").value.trim().toLowerCase();

  if (!email) {
    document.getElementById("mensagemLogin").textContent = "⚠️ Informe o e-mail para recuperar a senha.";
    document.getElementById("mensagemLogin").style.color = "orange";
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    document.getElementById("mensagemLogin").textContent = "📩 Email de recuperação enviado!";
    document.getElementById("mensagemLogin").style.color = "green";
  } catch (error) {
    let mensagem = "⚠️ Erro ao enviar o email de recuperação.";

    if (error.code === "auth/invalid-email") {
      mensagem = "⚠️ E-mail inválido. Verifique e tente novamente.";
    } else if (error.code === "auth/user-not-found") {
      mensagem = "⚠️ Usuário não encontrado. Verifique o e-mail digitado.";
    }

    document.getElementById("mensagemLogin").textContent = mensagem;
    document.getElementById("mensagemLogin").style.color = "red";
  }
});

// Cadastro
document.getElementById("botaoCadastrar").addEventListener("click", async () => {
  const botaoCadastrar = document.getElementById("botaoCadastrar");
  const nome = document.getElementById("nome").value.trim();
  const senha = document.getElementById("senhaCadastro").value.trim();
  const email = document.getElementById("emailLogin").value.trim().toLowerCase();

  if (!nome || !senha || !email) {
    document.getElementById("mensagemCadastro").textContent = "Preencha nome e senha (o e-mail é o mesmo do login).";
    document.getElementById("mensagemCadastro").style.color = "red";
    return;
  }

  botaoCadastrar.textContent = "Cadastrando...";
  setTimeout(() => {
    botaoCadastrar.textContent = "CADASTRAR";
  }, 2000);

  try {
    await createUserWithEmailAndPassword(auth, email, senha);
    await updateProfile(auth.currentUser, { displayName: nome });

    document.getElementById("mensagemCadastro").textContent = "✅ Cadastro realizado com sucesso!";
    document.getElementById("mensagemCadastro").style.color = "green";

    setTimeout(() => {
      document.getElementById("telaCadastro").classList.add("escondido");
      document.getElementById("telaPrincipal").classList.remove("escondido");
      document.getElementById("nomeUsuario").textContent = nome;
    }, 1500);
  } catch (error) {
    let mensagem = "⚠️ Erro: " + error.message;

    if (error.code === "auth/email-already-in-use") {
      mensagem = "⚠️ Este e-mail já está cadastrado. Tente fazer login ou recuperar a senha.";
    } else if (error.code === "auth/invalid-email") {
      mensagem = "⚠️ O e-mail informado não é válido.";
    } else if (error.code === "auth/weak-password") {
      mensagem = "⚠️ A senha precisa ter pelo menos 6 caracteres.";
    }

    document.getElementById("mensagemCadastro").textContent = mensagem;
    document.getElementById("mensagemCadastro").style.color = "red";
  }
});