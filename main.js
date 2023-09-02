const ele1  = document.getElementById("1")
const ele2  = document.getElementById("2")
const ele3  = document.getElementById("3")

const SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
const CHARACTERISTIC_UUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8"

ele3.addEventListener('click', async (event) => {
  if(!('bluetooth' in navigator)){
    alert("このブラウザはWeb Bluetooth APIに対応していません")
    return;
  }

  const device = await navigator.bluetooth.requestDevice({
    filters: [{ services: [SERVICE_UUID] }],
    optionalServices: [SERVICE_UUID]   
  })

  if(device.name !== "ESP32_BLE"){
    alert("このBluetooth端末はセンサーとして機能しません");
    return;
  }

  const server = await device.gatt.connect();
  const service = await server.getPrimaryService(SERVICE_UUID)
  const characteristic = await service.getCharacteristic(CHARACTERISTIC_UUID);

  characteristic.startNotifications()

  characteristic.addEventListener('characteristicvaluechanged', event => {
    const value = event.target.value.getInt16(0, true);
    if(value < 600){
      ele1.hidden = false;
      ele2.hidden = true;
      ele3.hidden = true;
    }else{
      ele1.hidden = true;
      ele2.hidden = false;
      ele3.hidden = true;
    }
    console.log(value);
  });
});
