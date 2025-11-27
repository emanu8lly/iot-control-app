const MQTT_URL = "wss://broker.hivemq.com:8884/mqtt";

const options = {
  clean: true,
  connectTimeout: 30000,
  reconnectPeriod: 2000,
};

let client = null;
let isConnected = false;
let shouldReconnect = true;

// Atualiza o status do MQTT na tela
function updateMQTTStatus(status) {
  const statusElement = document.getElementById("statusMQTT");
  if (statusElement) statusElement.textContent = status;
}

// Conectar ao MQTT
function connectMQTT() {
  if (!shouldReconnect || isConnected) return;

  updateMQTTStatus("🔵 Conectando...");

  client = mqtt.connect(MQTT_URL, options);

  client.on("connect", () => {
    console.log("🔗 Conectado ao HiveMQ!");
    isConnected = true;
    updateMQTTStatus("🟢 Conectado");
    client.subscribe("manu/app/temp");
  });

  client.on("reconnect", () => {
    console.log("🔄 Reconectando MQTT...");
    updateMQTTStatus("🟠 Reconectando...");
  });

  client.on("close", () => {
    console.log("🔒 Conexão MQTT fechada");
    isConnected = false;
    updateMQTTStatus("🔴 Desconectado");
  });

  client.on("error", (err) => {
    console.error("❌ Erro MQTT:", err);
    isConnected = false;
    updateMQTTStatus("🔴 Desconectado");
  });

  client.on("message", (topic, msg) => {
    if (topic === "manu/app/temp") {
      const tempEl = document.getElementById("temperaturaValor");
      if (tempEl) tempEl.textContent = msg.toString();
    }
  });
}

// Publicar mensagem
function publishMessage(texto) {
  if (client && isConnected) {
    client.publish("manu/app/login", texto);
    console.log(`📤 Mensagem enviada: ${texto}`);
  } else {
    console.warn("⚠️ Cliente MQTT não conectado.");
  }
}

// Desconectar do MQTT
function disconnectMQTT() {
  shouldReconnect = false;

  if (client) {
    if (isConnected) {
      updateMQTTStatus("🔴 Desconectando...");
      setTimeout(() => {
          mostrarTela("telaLogin");
        }, 2000);
      client.end(false, () => {
        console.log("🔒 MQTT desconectado");
        isConnected = false;
        client = null;
        updateMQTTStatus("🔴 Desconectado");
        setTimeout(() => {
          mostrarTela("telaLogin");
        }, 3000);
      });
    } else {
      client = null;
      updateMQTTStatus("🔴 Desconectado");
      mostrarTela("telaLogin");
    }
  } else {
    updateMQTTStatus("🔴 Desconectado");
    mostrarTela("telaLogin");
  }
}

window.connectMQTT = connectMQTT;
window.disconnectMQTT = disconnectMQTT;
window.updateMQTTStatus = updateMQTTStatus;
window.publishMessage = publishMessage;
