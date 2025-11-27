#include <WiFi.h>
#include <PubSubClient.h>

const char* ssid = "Wokwi-GUEST";
const char* password = "";

const char* mqtt_server = "broker.hivemq.com";
const int mqtt_port = 1883;

WiFiClient espClient;
PubSubClient client(espClient);

#define LED 19

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Conectando a ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi conectado");
  Serial.println("Endereço IP: ");
  Serial.println(WiFi.localIP());
}

void callback(char* topic, byte* message, unsigned int length) {
  String messageTemp;
  
  for (int i = 0; i < length; i++) {
    messageTemp += (char)message[i];
  }
  
  Serial.print("Mensagem recebida no tópico: ");
  Serial.print(topic);
  Serial.print(". Mensagem: ");
  Serial.println(messageTemp);

  // Verifica se a mensagem é para controlar o LED
  if (String(topic) == "manu/app/login") {
    Serial.print("Comando recebido: ");
    Serial.println(messageTemp);
    
    if (messageTemp == "login-ok") {
      digitalWrite(LED, HIGH);
      Serial.println("LED ligado");
      client.publish("manu/app/status", "LED_LIGADO");
    } else if (messageTemp == "logout") {
      digitalWrite(LED, LOW);
      Serial.println("LED desligado");
      client.publish("manu/app/status", "LED_DESLIGADO");
    } else if (messageTemp == "atualizar-temp") {
      // Força o envio imediato da temperatura
      float temperatura = random(200, 301) / 10.0;
      String tempStr = String(temperatura, 1);
      client.publish("manu/app/temp", tempStr.c_str());
      Serial.println("Temperatura publicada: " + tempStr);
    }
  }
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Tentando conexão MQTT...");
    
    if (client.connect("ESP32Client-Manu")) {
      Serial.println("conectado");
      client.subscribe("manu/app/login");
    } else {
      Serial.print("falhou, rc=");
      Serial.print(client.state());
      Serial.println(" tentando novamente em 5 segundos");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(LED, OUTPUT);
  digitalWrite(LED, LOW);
  
  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  // Simula leitura de temperatura (valores entre 20-30°C)
  static unsigned long lastTempPublish = 0;
  if (millis() - lastTempPublish > 5000) {
    float temperatura = random(200, 301) / 10.0;
    String tempStr = String(temperatura, 1);
    
    client.publish("manu/app/temp", tempStr.c_str());
    Serial.println("Temperatura publicada: " + tempStr);
    
    lastTempPublish = millis();
  }

  delay(100);
}