const MQTT_URL = "wss://broker.hivemq.com:8884/mqtt";

const options = {
  clean: true,
  connectTimeout: 30000,
  reconnectPeriod: 2000,
};

let client = null;
let isConnected = false;

function connectMQTT() {
  try {
    client = mqtt.connect(MQTT_URL, options);

    client.on("connect", () => {
      console.log("🔗 Conectado ao HiveMQ!");
      isConnected = true;
      updateMQTTStatus("🟢 Conectado");
      
      // Inscrever nos tópicos
      client.subscribe("manu/app/temp");
      client.subscribe("manu/app/status");
    });

    client.on("message", (topic, msg) => {
      console.log(`📩 ${topic}: ${msg.toString()}`);
      
      if (topic === "manu/app/temp") {
        document.getElementById("temperaturaValor").textContent = msg.toString();
      }
    });

    client.on("error", (err) => {
      console.error("❌ Erro MQTT:", err);
      isConnected = false;
      updateMQTTStatus("🔴 Erro de conexão");
    });

    client.on("close", () => {
      console.log("🔒 Conexão MQTT fechada");
      isConnected = false;
      updateMQTTStatus("🔴 Desconectado");
    });

  } catch (error) {
    console.error("❌ Erro ao conectar MQTT:", error);
    updateMQTTStatus("🔴 Erro de conexão");
  }
}

function updateMQTTStatus(status) {
  const statusElement = document.getElementById('statusMQTT');
  if (statusElement) {
    statusElement.textContent = status;
  }
}

function publishMessage(texto) {
  if (client && isConnected) {
    client.publish("manu/app/login", texto);
    console.log(`📤 Mensagem enviada: ${texto}`);
  } else {
    console.warn("⚠️ Cliente MQTT não conectado.");
  }
}

// Adicionar event listeners quando a tela principal for carregada
document.addEventListener('DOMContentLoaded', function() {
  const ligarLED = document.getElementById('ligarLED');
  const desligarLED = document.getElementById('desligarLED');
  const atualizarTemp = document.getElementById('atualizarTemp');

  if (ligarLED) {
    ligarLED.addEventListener('click', function() {
      publishMessage("login-ok");
    });
  }

  if (desligarLED) {
    desligarLED.addEventListener('click', function() {
      publishMessage("logout");
    });
  }

  if (atualizarTemp) {
    atualizarTemp.addEventListener('click', function() {
      publishMessage("atualizar-temp");
    });
  }
});