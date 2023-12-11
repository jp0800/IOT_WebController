
#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

#include <FirebaseESP8266.h>

#include <ArduinoJson.h>
#include <addons/TokenHelper.h>
#include <addons/RTDBHelper.h>

#include "NoDelay.h"

#define WIFI_SSID "Redmi 7A"
#define WIFI_PASSWORD "something"

#define API_KEY "AIzaSyBdoIbJ4Pv8pBhdNjXonNEbB4BFmRLjroI"
#define DATABASE_URL "https://homeautomation-4af1c-default-rtdb.asia-southeast1.firebasedatabase.app/"  //<databaseName>.firebaseio.com or <databaseName>.<region>.firebasedatabase.app
#define USER_EMAIL "esp8266.homeautomation@project.esp1.com"
#define USER_PASSWORD "esp@esp1"

#define ESP_NAME "ESP_1"

#define RPIN_4 5   // GPIO 5
#define RPIN_3 4   // GPIO 4
#define RPIN_2 14  // GPIO 14
#define RPIN_1 12  // GPIO 12

#define BPIN 13  // GPIO 13

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

unsigned long sendDataPrevMillis = 0;
unsigned long count = 0;

#if defined(ARDUINO_RASPBERRY_PI_PICO_W)
WiFiMulti multi;
#endif

const char *worldTimeAPIEndpoint = "http://worldtimeapi.org/api/timezone/Asia/Manila";

void timeTicker();
void getCurrentTime();
void getReferenceTime();
void checkTimeComponents();

noDelay nTimeTicker(1000, timeTicker);
noDelay nGetCurrentTime(300000, getCurrentTime);
noDelay nGetReferenceTime(1000, getReferenceTime);
noDelay nCheckTimeComponents(1000, checkTimeComponents);

struct TimeStruct {
  int hours;
  int minutes;
  int seconds;
};

// Function to extract time and return it in a struct
TimeStruct extractTime(const String &timeString) {
  TimeStruct timeValues;

  // Extract hours, minutes, and seconds
  timeValues.hours = timeString.substring(0, 2).toInt();
  timeValues.minutes = timeString.substring(3, 5).toInt();
  timeValues.seconds = timeString.substring(6, 8).toInt();

  return timeValues;
}

void setup() {

  Serial.begin(115200);

#if defined(ARDUINO_RASPBERRY_PI_PICO_W)
  multi.addAP(WIFI_SSID, WIFI_PASSWORD);
  multi.run();
#else
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
#endif

  Serial.print("Connecting to Wi-Fi");
  unsigned long ms = millis();
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(300);
#if defined(ARDUINO_RASPBERRY_PI_PICO_W)
    if (millis() - ms > 10000)
      break;
#endif
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();

  Serial.printf("Firebase Client v%s\n\n", FIREBASE_CLIENT_VERSION);

  config.api_key = API_KEY;
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;

  config.database_url = DATABASE_URL;
  config.token_status_callback = tokenStatusCallback;  // see addons/TokenHelper.h

  Firebase.reconnectNetwork(true);
  fbdo.setBSSLBufferSize(4096 /* Rx buffer size in bytes from 512 - 16384 */, 1024 /* Tx buffer size in bytes from 512 - 16384 */);

#if defined(ARDUINO_RASPBERRY_PI_PICO_W)
  config.wifi.clearAP();
  config.wifi.addAP(WIFI_SSID, WIFI_PASSWORD);
#endif

  Firebase.begin(&config, &auth);
  Firebase.setDoubleDigits(5);

  pinMode(RPIN_1, OUTPUT);
  pinMode(RPIN_2, OUTPUT);
  pinMode(RPIN_3, OUTPUT);
  pinMode(RPIN_4, OUTPUT);

  pinMode(BPIN, OUTPUT);

  digitalWrite(RPIN_1, HIGH);
  digitalWrite(RPIN_2, HIGH);
  digitalWrite(RPIN_3, HIGH);
  digitalWrite(RPIN_4, HIGH);

  getCurrentTime();

  String timeString = "12:10:51";
  TimeStruct timeValues = extractTime(timeString);
}


void loop() {
  nTimeTicker.fupdate();
  nGetCurrentTime.fupdate();
  nGetReferenceTime.fupdate();
  nCheckTimeComponents.fupdate();
}

String url = "/Controllers/" + String(ESP_NAME) + "/componentButtonList";

int currentHours = 0;
int currentMinutes = 0;
int currentSeconds = 0;

void timeTicker() {
  if (currentHours == 24) {
    currentHours = 0;
  }
  if (currentMinutes == 59) {
    currentHours++;
    currentMinutes = 0;
  }
  if (currentSeconds == 59) {
    currentSeconds = 0;
    currentMinutes++;
  }
  currentSeconds++;

  String time = "[" + String(currentHours) + ":" + String(currentMinutes) + ":" + String(currentSeconds) + "]";
  Serial.println(time);
}

bool booleanArray[4];
void controlBuzzer(int relay, bool state) {
  // Replace this with your actual code to control the buzzer
  if (relay == RPIN_1) {
    booleanArray[3] = state;
  }

  if (relay == RPIN_2) {
    booleanArray[2] = state;
  }

  if (relay == RPIN_3) {
    booleanArray[1] = state;
  }

  if (relay == RPIN_4) {
    booleanArray[0] = state;
  }

  for (int i = 0; i < 4; i++) {
    if (booleanArray[i]) {
      digitalWrite(BPIN, HIGH);
      break;
    } else {
      digitalWrite(BPIN, LOW);
    }
  }
}

void getCurrentTime() {
  WiFiClient client;
  HTTPClient http;
  http.begin(client, worldTimeAPIEndpoint);

  int httpResponseCode = http.GET();

  if (httpResponseCode == HTTP_CODE_OK) {
    String payload = http.getString();
    Serial.println("Response: " + payload);

    // Parse the JSON response to get the current time
    DynamicJsonDocument doc(1024);
    DeserializationError error = deserializeJson(doc, payload);

    if (error) {
      Serial.print("JSON parsing failed: ");
      Serial.println(error.c_str());
    } else {
      const char *dateTimeString = doc["datetime"];
      // Serial.print("Current date and time: ");
      // Serial.println(dateTimeString);

      // Convert const char* to String
      String timeString = String(dateTimeString);

      // Extract hours, minutes, and seconds
      String hoursStr = timeString.substring(11, 13);    // Extracts "hh"
      String minutesStr = timeString.substring(14, 16);  // Extracts "mm"
      String secondsStr = timeString.substring(17, 19);  // Extracts "ss"

      currentHours = hoursStr.toInt();
      currentMinutes = minutesStr.toInt();
      currentSeconds = secondsStr.toInt();

      Serial.print("Hours: ");
      Serial.print(currentHours);
      Serial.print(" Minutes: ");
      Serial.print(currentMinutes);
      Serial.print(" Seconds: ");
      Serial.println(currentSeconds);
    }
  } else {
    Serial.print("HTTP request failed with error code: ");
    Serial.println(httpResponseCode);
  }

  http.end();
}

TimeStruct chargerTime;
TimeStruct lightTime;
TimeStruct fanTime;
TimeStruct outletTime;

String chargerDate;
String lightDate;
String fanDate;
String outletDate;

void getReferenceTime() {
  if (!Firebase.ready()) return;
  String jsonData = "";
  Firebase.getString(fbdo, url, &jsonData) ? fbdo.to<const char *>() : fbdo.errorReason().c_str();

  // Parse the JSON data
  DynamicJsonDocument doc(1024);
  DeserializationError error = deserializeJson(doc, jsonData);

  // Check for parsing errors
  if (error) {
    Serial.print("JSON parsing failed: ");
    Serial.println(error.c_str());
    return;
  }

  // Access the values of chargerStatus
  bool chargerIndefiniteOn = doc["chargerStatus"]["indefiniteOn"];
  String chargerReferenceDate = doc["chargerStatus"]["reference"]["date"];
  String chargerReferenceTime = doc["chargerStatus"]["reference"]["time"];
  
  // Access the values of fanStatus
  bool fanIndefiniteOn = doc["fanStatus"]["indefiniteOn"];
  String fanReferenceDate = doc["fanStatus"]["reference"]["date"];
  String fanReferenceTime = doc["fanStatus"]["reference"]["time"];

  // Access the values of lightStatus
  bool lightIndefiniteOn = doc["lightStatus"]["indefiniteOn"];
  String lightReferenceDate = doc["lightStatus"]["reference"]["date"];
  String lightReferenceTime = doc["lightStatus"]["reference"]["time"];
  // Access the values of outletStatus
  bool outletIndefiniteOn = doc["outletStatus"]["indefiniteOn"];
  String outletReferenceDate = doc["outletStatus"]["reference"]["date"];
  String outletReferenceTime = doc["outletStatus"]["reference"]["time"];

  chargerTime = extractTime(chargerReferenceTime);
  lightTime = extractTime(lightReferenceTime);
  outletTime = extractTime(outletReferenceTime);
  fanTime = extractTime(fanReferenceTime);

  chargerDate = chargerReferenceDate;
  lightDate = lightReferenceDate;
  fanDate = fanReferenceDate;
  outletDate = outletReferenceDate;
}

unsigned long convertToSeconds(int hours, int minutes, int seconds) {
  return hours * 60 * 60 + minutes * 60 + seconds;
}

// Function to get the remaining time
void getDifferenceTime(int relay, int currentHour, int currentMinute, int currentSecond, int futureHour, int futureMinute, int futureSecond) {
  unsigned long currentTime = convertToSeconds(currentHours, currentMinutes, currentSeconds);
  unsigned long futureTime = convertToSeconds(futureHour, futureMinute, futureSecond);

  if (futureTime <= currentTime) {
    Serial.println("Future time is in the past.");
    digitalWrite(relay, HIGH);
    controlBuzzer(relay, false);
    return;
  }

  unsigned long remainingTime = futureTime - currentTime;

  if (remainingTime < 10) {
    controlBuzzer(relay, true);
  } else {
    controlBuzzer(relay, false);
  }

  digitalWrite(relay, LOW);

  // Convert remaining time to hours, minutes, and seconds
  int remainingHours = remainingTime / 3600;
  int remainingMinutes = (remainingTime % 3600) / 60;
  int remainingSeconds = remainingTime % 60;

  Serial.print("Remaining Time: ");
  Serial.print(remainingHours);
  Serial.print(" hours, ");
  Serial.print(remainingMinutes);
  Serial.print(" minutes, ");
  Serial.print(remainingSeconds);
  Serial.println(" seconds");
}


void checkTimeComponents() {
  getDifferenceTime(RPIN_1, currentHours, currentMinutes, currentSeconds, fanTime.hours, fanTime.minutes, fanTime.seconds);
  getDifferenceTime(RPIN_2, currentHours, currentMinutes, currentSeconds, lightTime.hours, lightTime.minutes, lightTime.seconds);
  getDifferenceTime(RPIN_3, currentHours, currentMinutes, currentSeconds, chargerTime.hours, chargerTime.minutes, chargerTime.seconds);
  getDifferenceTime(RPIN_4, currentHours, currentMinutes, currentSeconds, outletTime.hours, outletTime.minutes, outletTime.seconds);
}
