#include <DHT.h>

//Constants
#define DHTPIN 7     // what pin we're connected to
#define DHTTYPE DHT22   // DHT - digital output, relative humidity and temperature sensor
// Initialize DHT sensor
DHT dht(DHTPIN, DHTTYPE);

//Variables
int chk;
float hum;  //Stores humidity value
float temp; //Stores temperature value

void setup()
{
    Serial.begin(9600);
  dht.begin();
    
}

String hum1;
String temp1;

void loop()
{
    //Read data and store it to variables hum and temp
    hum = dht.readHumidity();
    temp= dht.readTemperature();
    //hum1 = String(hum);
    //temp1 = String(temp);
    //Print temp and humidity values to serial monitor
   // Serial.print("Humidity: ");
    Serial.print(hum);
    Serial.print(",");
    Serial.println(temp);
   // Serial.println(" Celsius");
    
    delay(2000); //Delay 2 sec.
}