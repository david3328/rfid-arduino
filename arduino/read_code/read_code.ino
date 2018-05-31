//Incluir librerías
#include<SPI.h>
#include<MFRC522.h>

//Declarar pines
constexpr uint8_t RST_PIN = 9;
constexpr uint8_t SS_PIN = 10;

//Instanciamos MFRC522
MFRC522 mfrc522(SS_PIN,RST_PIN);

void setup() {
  Serial.begin(9600);
  SPI.begin();
  mfrc522.PCD_Init();
}

void loop() {

  //Preparamos la clave(key)
  MFRC522::MIFARE_Key key;
  for (byte i=0; i<6; i++) key.keyByte[i] = 0xFF;

  //Creamos las variables
  byte block;
  byte len;
  MFRC522::StatusCode status;

  if(!mfrc522.PICC_IsNewCardPresent()){return;}
  if(!mfrc522.PICC_ReadCardSerial()){return;}

  byte buffer1[18];
  block = 1;
  len = 18;

  //Autenticarse
  status = mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A,block,&key,&(mfrc522.uid));
  if(status!=MFRC522::STATUS_OK){return;}

  //Leer los datos 
  status = mfrc522.MIFARE_Read(block,buffer1, &len);
  if(status!=MFRC522::STATUS_OK){return;}

  //Imprimir Código
  for(uint8_t i=0; i<16; i++){
    if(buffer1[i]!=32){Serial.write(buffer1[i]);}
  }
  Serial.print("-");


  block = 2;
  len = 18;

  //Autenticarse
  status = mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A,block,&key,&(mfrc522.uid));
  if(status!=MFRC522::STATUS_OK){return;}

  //Leer los datos 
  status = mfrc522.MIFARE_Read(block,buffer1, &len);
  if(status!=MFRC522::STATUS_OK){return;}

  //Imprimir Código
  for(uint8_t i=0; i<16; i++){
    if(buffer1[i]!=32){Serial.write(buffer1[i]);}
  }
  Serial.print("-");

    block = 4;
  len = 18;

  //Autenticarse
  status = mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A,block,&key,&(mfrc522.uid));
  if(status!=MFRC522::STATUS_OK){return;}

  //Leer los datos 
  status = mfrc522.MIFARE_Read(block,buffer1, &len);
  if(status!=MFRC522::STATUS_OK){return;}

  //Imprimir Código
  for(uint8_t i=0; i<16; i++){
    if(buffer1[i]!=32){Serial.write(buffer1[i]);}
  }
  Serial.print("-");


  block = 5;
  len = 18;

  //Autenticarse
  status = mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A,block,&key,&(mfrc522.uid));
  if(status!=MFRC522::STATUS_OK){return;}

  //Leer los datos 
  status = mfrc522.MIFARE_Read(block,buffer1, &len);
  if(status!=MFRC522::STATUS_OK){return;}

  //Imprimir Código
  for(uint8_t i=0; i<16; i++){
    if(buffer1[i]!=32){Serial.write(buffer1[i]);}
  }
  Serial.println("");


  
  delay(500);
  mfrc522.PICC_HaltA();
  mfrc522.PCD_StopCrypto1();
}
