//Incluir librerías
#include<SPI.h>
#include<MFRC522.h>

//Declarar pines
#define RST_PIN  9
#define SS_PIN 10

//Crear la instancia
MFRC522 mfrc522(SS_PIN,RST_PIN);

void setup() {
  Serial.begin(9600);
  SPI.begin();
  mfrc522.PCD_Init();
}

void loop() {
  MFRC522::MIFARE_Key key;
  for(byte i=0; i<6; i++) key.keyByte[i] = 0xFF;

  if(!mfrc522.PICC_IsNewCardPresent()){return;}
  if(!mfrc522.PICC_ReadCardSerial()){return;}

  byte buffer[34];
  byte block;
  MFRC522::StatusCode status;
  byte len;

  //Establece el valor máximo en milisegundo para esperar que ingresen datos por el puerto serial 
  //Por defecto es 1000 milisegundos
  //Serial.setTimeout(time)  time en milisegundos
  Serial.setTimeout(20000);

  
  //Ingresar codigo;

  //Serial.readBytesUntil Lee los caracteres del bufer en una serie matriz, finaliza la lectura cuand se ingresa un caracter #
  //                      cuando se ha leído una logintud determinada, o se agota el tiempo de espera
  //Serial.readBytesUntile Devuelve la cantidad de caracteres ingresados(leídos), en 0 es cuando no se ingresaron datos válidos
  //Serial.readBytesUntil(character, buffer, length) 
  //                      character = el caracter a buscar para finalizar la lectura
  //                      buffer = el buffer para almacenar en  (char[] or byte[]) 
  //                      length = el número de bytes a leer


  //Leer Código
  len = Serial.readBytesUntil('#',(char *)buffer,30);
  for(byte i = len; i<30; i++) buffer[i] = ' ';

  //Bloque 1 para el código
  block = 1;
  status = mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, block, &key, &(mfrc522.uid));
  if(status!=MFRC522::STATUS_OK){return;}

  //Escribir en el bloque
  status = mfrc522.MIFARE_Write(block,buffer,16);
  if(status!=MFRC522::STATUS_OK){return;}

  //Leer nombre
  len = Serial.readBytesUntil('#',(char *)buffer,30);
  for(byte i = len; i<30; i++) buffer[i] = ' ';

  //Bloque 2 para el nombre
  block = 2;
  status = mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, block, &key, &(mfrc522.uid));
  if(status!=MFRC522::STATUS_OK){return;}

  //Escribir en el bloque
  status = mfrc522.MIFARE_Write(block,buffer,16);
  if(status!=MFRC522::STATUS_OK){return;}

  //Leer apellido paterno
  len = Serial.readBytesUntil('#',(char *)buffer,30);
  for(byte i = len; i<30; i++) buffer[i] = ' ';

  //Bloque 4 para el apellido paterno
  block = 4;
  status = mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, block, &key, &(mfrc522.uid));
  if(status!=MFRC522::STATUS_OK){return;}

  //Escribir en el bloque
  status = mfrc522.MIFARE_Write(block,buffer,16);
  if(status!=MFRC522::STATUS_OK){return;}


  //Leer apellido materno
  len = Serial.readBytesUntil('#',(char *)buffer,30);
  for(byte i = len; i<30; i++) buffer[i] = ' ';

  //Bloque 5 para el apellido materno
  block = 5; 
  status = mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, block, &key, &(mfrc522.uid));
  if(status!=MFRC522::STATUS_OK){return;}

  //Escribir en el bloque
  status = mfrc522.MIFARE_Write(block,buffer,16);
  if(status!=MFRC522::STATUS_OK){return;}


  Serial.println("success");  
  mfrc522.PICC_HaltA();  //Detiene PICC
  mfrc522.PCD_StopCrypto1(); //
}
