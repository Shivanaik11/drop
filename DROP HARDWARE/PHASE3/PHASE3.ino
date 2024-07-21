#include <ESP32Firebase.h>
#include <WiFi.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

// OLED Display setup
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

// Wi-Fi credentials
#define _SSID "drop"
#define _PASSWORD "administrator"

// Firebase credentials
#define REFERENCE_URL "https://drop-dashboard-76b93-default-rtdb.firebaseio.com/"

// TDS and temperature setup
const int oneWireBus = 25; // GPIO where the DS18B20 is connected to
#define TdsSensorPin 35
#define VREF 3.3
#define SCOUNT  30
int analogBuffer[SCOUNT];
int analogBufferTemp[SCOUNT];
int analogBufferIndex = 0;
float averageVoltage = 0;
float tdsValue = 0;
float temperature = 0;

// Turbidity sensor setup
#define TURBIDITY_PIN 34
const int pureWaterValue = 2500;
const int maxTurbidValue = 500;

Firebase firebase(REFERENCE_URL);

OneWire oneWire(oneWireBus);
DallasTemperature sensors(&oneWire);

unsigned long sendDataPrevMillis = 0;
const unsigned long sendInterval = 5000; // Send data every 5 seconds

void setup() {
  Serial.begin(115200);
  pinMode(TdsSensorPin, INPUT);
  pinMode(TURBIDITY_PIN, INPUT);
  sensors.begin();

  // Initialize the OLED display
  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println(F("SSD1306 allocation failed"));
    for (;;);
  }
  display.display();
  delay(2000);
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(0, 0);

  // Connect to Wi-Fi
  WiFi.begin(_SSID, _PASSWORD);
  Serial.print("Connecting to: ");
  Serial.println(_SSID);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print("-");
  }
  Serial.println("");
  Serial.println("WiFi Connected");
  Serial.print("IP Address: ");
  Serial.print("http://");
  Serial.print(WiFi.localIP());
  Serial.println("/");
}

void loop() {
  // Request temperature measurement
  sensors.requestTemperatures();
  temperature = sensors.getTempCByIndex(0);

  // Read TDS sensor value
  analogBuffer[analogBufferIndex] = analogRead(TdsSensorPin);
  analogBufferIndex++;
  if (analogBufferIndex == SCOUNT) {
    analogBufferIndex = 0;
  }
  for (int i = 0; i < SCOUNT; i++) {
    analogBufferTemp[i] = analogBuffer[i];
  }
  averageVoltage = getMedianNum(analogBufferTemp, SCOUNT) * (float)VREF / 1024.0;
  float compensationCoefficient = 1.0 + 0.02 * (temperature - 25.0);
  float compensationVolatge = averageVoltage / compensationCoefficient;
  tdsValue = (133.42 * compensationVolatge * compensationVolatge * compensationVolatge - 255.86 * compensationVolatge * compensationVolatge + 857.39 * compensationVolatge) * 0.5;

  // Read turbidity sensor value
  int sensorValue = analogRead(TURBIDITY_PIN);
  int turbidity = map(sensorValue, pureWaterValue, maxTurbidValue, 0, 100);
  turbidity = constrain(turbidity, 0, 100);

  // Display on OLED
  display.clearDisplay();
  display.setCursor(0, 0);

  // Display TDS value and category
  display.print("TDS: ");
  display.print(tdsValue, 0);
  display.print(" ppm - ");
  if (tdsValue <= 500) {
    display.println("Desirable");
  } else if (tdsValue <= 1000) {
    display.println("Acceptable");
  } else {
    display.println("Not suitable");
  }

  // Display temperature
  display.print("Temp: ");
  display.print(temperature);
  display.println(" C");

  // Display turbidity value and category
  display.print("Turbidity: ");
  display.print(turbidity);
  display.print(" - ");
  if (turbidity <= 1) {
    display.println("Excellent");
  } else if (turbidity <= 5) {
    display.println("Good");
  } else {
    display.println("Not suitable");
  }

  display.display();

  // Update Firebase with TDS, temperature, and turbidity every 5 seconds
  if (millis() - sendDataPrevMillis >= sendInterval) {
    sendDataPrevMillis = millis();

    String path = "/phase3";  // Ensure this matches the structure in your Firebase database
    firebase.setFloat(path + "/tds", tdsValue);
    firebase.setFloat(path + "/temperature", temperature);
    firebase.setFloat(path + "/turbidity", turbidity);

    Serial.println("Data sent to Firebase");
  }
}

int getMedianNum(int bArray[], int iFilterLen) {
  int bTab[iFilterLen];
  for (byte i = 0; i < iFilterLen; i++) {
    bTab[i] = bArray[i];
  }
  int i, j, bTemp;
  for (j = 0; j < iFilterLen - 1; j++) {
    for (i = 0; i < iFilterLen - j - 1; i++) {
      if (bTab[i] > bTab[i + 1]) {
        bTemp = bTab[i];
        bTab[i] = bTab[i + 1];
        bTab[i + 1] = bTemp;
      }
    }
  }
  if ((iFilterLen & 1) > 0) {
    bTemp = bTab[(iFilterLen - 1) / 2];
  } else {
    bTemp = (bTab[iFilterLen / 2] + bTab[iFilterLen / 2 - 1]) / 2;
  }
  return bTemp;
}
