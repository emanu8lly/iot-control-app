# IoT Control App

![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)
![Capacitor](https://img.shields.io/badge/Capacitor-Mobile%20App-blue)
![MQTT](https://img.shields.io/badge/MQTT-HiveMQ-orange)
![ESP32](https://img.shields.io/badge/ESP32-IoT-green)
![Wokwi](https://img.shields.io/badge/Wokwi-Simulator-purple)
![License](https://img.shields.io/badge/license-MIT-blue)
![Status](https://img.shields.io/badge/status-Ativo-success)

Aplicativo desenvolvido para controlar um **ESP32 via MQTT**, usando **HiveMQ** e simulação no **Wokwi**.  
O app permite:

- Login simples  
- Controle de LED (ligar/desligar)  
- Atualização de temperatura enviada pelo ESP32  
- Status visual do MQTT (conectando, conectado, reconectando, desconectado)

---

## 🚀 Tecnologias utilizadas

### **Front-end / App**
- HTML  
- CSS  
- JavaScript  
- Capacitor  
- Android WebView  

### **MQTT**
- HiveMQ (broker público)  
- Protocolo via WebSocket (porta 8884)

### **IoT**
- ESP32  
- Arduino IDE  
- Biblioteca PubSubClient  
- Wokwi Simulator  

---

## 📱 Funcionalidades do App

- Sistema simples de **login**
- Botão **Ligar LED**
- Botão **Desligar LED**
- Botão **Atualizar Temperatura**
- Exibição **em tempo real** da temperatura
- Status MQTT:
  - 🔵 Conectando…  
  - 🟢 Conectado  
  - 🟠 Reconectando…  
  - 🔴 Desconectado / Desconectando  

---

## 🔌 Fluxo de Comunicação

### **App → MQTT**
| Ação | Mensagem enviada | Função no ESP32 |
|------|------------------|------------------|
| Ligar LED | `led-ligado` | Liga o LED |
| Desligar LED | `led-desligado` | Desliga o LED |
| Atualizar temperatura | `atualizar-temp` | Força envio imediato |

### **ESP32 → MQTT**
- `manu/app/temp` → temperatura simulada (20–30°C)  
- `manu/app/status` → confirmações opcionais  

---

## 📂 Estrutura do Projet
```sql
iot-control-app/
│
├── app/                      # Código do aplicativo
│   ├── src/
│   ├── android/
│   ├── node_modules/        (ignorado no Git)
│   ├── capacitor.config.json
│   ├── package.json
│   └── package-lock.json
│
├── android/                  # Gerado pelo Capacitor/Android Studio
│
└── arduino/                  # Código do ESP32
    ├── esp32_mqtt.ino
    ├── diagram.json
    ├── libraries/
    └── wokwi-project
```

---

## 🛠️ Como rodar o app

1. Abra a pasta **app/**
2. Instale dependências:
   ```sh
   npm install
3. Sincronize o Capacitor:
   ```sh
   npx cap sync
4. Abra no Android Studio:
   ```sh
   npx cap open android
5. Execute no emulador ou celular real.

---

## 🤖 Como rodar o ESP32

1. Abra o arquivo:
   `arduino/esp32_mqtt.ino`
3. Use o Wokwi ou Arduino IDE
4. Conecte-se ao Wi-Fi Wokwi-GUEST
5. O ESP32 conecta automaticamente ao HiveMQ

---

## 📝 Licença

Projeto livre para estudo.
