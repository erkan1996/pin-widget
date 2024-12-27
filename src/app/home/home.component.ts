import { Component, ElementRef, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import dayjs from 'dayjs';
import Swal from 'sweetalert2';
import { debounceTime, Subject } from 'rxjs';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  mapOption: any;
  searchText: string = '';
  searchSubject = new Subject<string>();
  constructor(private elementRef: ElementRef) {
    this.searchSubject.pipe(debounceTime(300)).subscribe((searchValue) => {
      this.filterList(searchValue);
    });
  }
  ngOnInit(): void {
    this.setOptionMap();
  }

  // Haritada pin'leri saklar
  pinsList: any[] = [];
  cardList: any[] = [];
  markerList: any[] = [];
  selectedPinIndex: number | null = null; // Seçili pin'in indeksini saklar

  setOptionMap() {
    try {
      // Harita tanımlama
      this.mapOption = L.map('map').setView([51.505, -0.09], 9);

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.mapOption);

      // Marker listesi oluştur
      this.markerList = [];
      this.pinsList = [];
      this.cardList = [];

      for (let i = 0; i < 8; i++) {
        const name = `${i + 1} Nolu Oda`;
        const randomLat = 51.4 + Math.random() * 0.2;
        const randomLng = -0.2 + Math.random() * 0.2;
        const randomTemp = (15 + Math.random() * 20).toFixed(1);
        const randomHumidity = (30 + Math.random() * 60).toFixed(1);
        const randomDate = dayjs()
          .subtract(Math.random(), 'day')
          .format('DD/MM/YYYY HH:mm');

        const customPopupContent = `
<div style="background: white;  font-family: Arial, sans-serif;">
  <img src="images/icon-mark.png" alt="Konum İkonu" style="position: absolute; top: -2rem; right: -2rem; ">
  <h2 style="margin: 0; font-size: 13px; font-weight: bold; color: #333;">Nem ve Sıcaklık Sensörü</h2>
  <p style="margin: 5px 0 10px; font-size: 12px; color: #666;">${name}</p>
  <div class="w-100" id="settings-${i}">
    <div class="" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
      <div style="display: flex; align-items: center; gap: 5px;">
        <img src="images/icon-degree.png" alt="Sıcaklık İkonu" style="width: 24px; height: 24px;">
        <span style="font-size: 16px; font-weight: bold; color: #333;">${randomTemp} °C</span>
      </div>
      <button class="setTemperatureButton"
        style="flex-shrink: 0; padding: 5px 10px; font-size: 12px; color: white; border: none; border-radius: 5px; cursor: pointer; background-color: #007bff;">Sıcaklık
        Ayarla</button>
    </div>
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <div style="display: flex; align-items: center; gap: 5px;">
        <img src="images/icon-moisture.png" alt="Nem İkonu" style="width: 24px; height: 24px;">
        <span style="font-size: 16px; font-weight: bold; color: #333;">% 34</span>
      </div>
      <button class="setHumidityButton"
       style="flex-shrink: 0; padding: 5px 10px; font-size: 12px; color: white; border: none; border-radius: 5px; cursor: pointer; background-color: #007bff;">Nem
        Ayarla</button>
    </div>
  </div>
  <div class="w-100" id="temperature-update-${i}" style="display: none;">
    <div class="" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
      <div style="display: flex; align-items: center; gap: 5px;">
        <img src="images/icon-degree.png" alt="Sıcaklık İkonu" style="width: 24px; height: 24px;">
        <span style="font-size: 16px; font-weight: bold; color: #333;">${randomTemp} °C</span>
      </div>
      <input style="width: 50%;" type="number" id="new-temperature-${i}" value="${randomTemp}" />
    </div>
    <div class="col-12">
      <div class="row">
        <button class="mr-2"
          style="flex-shrink: 0; padding: 5px 10px; font-size: 12px; color: white; border: none; border-radius: 5px; cursor: pointer; background-color: #007bff;width: 45%;">
          İptal Et</button>
        <button class="updateTempatureButton"
          style="flex-shrink: 0; padding: 5px 10px; font-size: 12px; color: white; border: none; border-radius: 5px; cursor: pointer; background-color: #007bff;width: 45%;margin-left:auto">
          Güncelle</button>
      </div>


    </div>

  </div>
  <div class="w-100" id="temperature-update-${i}" style="display: none;">
    <div class="" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
      <div style="display: flex; align-items: center; gap: 5px;">
        <img src="images/icon-degree.png" alt="Sıcaklık İkonu" style="width: 24px; height: 24px;">
        <span style="font-size: 16px; font-weight: bold; color: #333;">${randomTemp} °C</span>
      </div>
      <input style="width: 50%;" type="number" id="new-temperature-${i}" value="${randomTemp}" />
    </div>
    <div class="col-12">
      <div class="row">
        <button class="backButton"
          style="flex-shrink: 0; padding: 5px 10px; font-size: 12px; color: white; border: none; border-radius: 5px; cursor: pointer; background-color: #007bff;width: 45%;">
          İptal Ett</button>
        <button class="updateTempatureButton"
          style="flex-shrink: 0; padding: 5px 10px; font-size: 12px; color: white; border: none; border-radius: 5px; cursor: pointer; background-color: #007bff;width: 45%;margin-left:auto">
          Güncelle</button>
      </div>


    </div>

  </div>

    <div class="w-100"  id="humidity-update-${i}" style="display: none;">
    <div class="" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
      <div style="display: flex; align-items: center; gap: 5px;">
        <img src="images/icon-degree.png" alt="Sıcaklık İkonu" style="width: 24px; height: 24px;">
        <span style="font-size: 16px; font-weight: bold; color: #333;">${randomHumidity} °C</span>
      </div>
      <input style="width: 50%;" type="number" id="new-humidity-${i}"  value="${randomHumidity}" />
    </div>
    <div class="col-12">
      <div class="row">
        <button class=" "
          style="flex-shrink: 0; padding: 5px 10px; font-size: 12px; color: white; border: none; border-radius: 5px; cursor: pointer; background-color: #007bff;width: 45%;">
          İptal Et</button>
        <button class="updateHumidityButton"
          style="flex-shrink: 0; padding: 5px 10px; font-size: 12px; color: white; border: none; border-radius: 5px; cursor: pointer; background-color: #007bff;width: 45%;margin-left:auto">
          Güncelle</button>
      </div>


    </div>

  </div>
</div>


        `;

        // Marker oluştur
        const marker = L.marker([randomLat, randomLng])
          .addTo(this.mapOption)
          .bindPopup(customPopupContent, { className: 'customPopup' })
          .on('popupopen', () => {
            const _this = this;
            _this.selectedPinIndex = i;

            // Event dinleyiciler

            _this.elementRef.nativeElement
              .querySelector('.backButton')
              .addEventListener('click', () => {
                _this.cancel(i, randomTemp);
              });
            _this.elementRef.nativeElement
              .querySelector('.setTemperatureButton')
              .addEventListener('click', () => {
                _this.setTemperature(i, randomTemp);
              });

            _this.elementRef.nativeElement
              .querySelector('.setHumidityButton')
              .addEventListener('click', () => {
                _this.setHumidity(i, randomHumidity);
              });

            _this.elementRef.nativeElement
              .querySelector('.updateHumidityButton')
              .addEventListener('click', () => {
                _this.updateHumidity(i);
              });
            _this.elementRef.nativeElement
              .querySelector('.updateTempatureButton')
              .addEventListener('click', () => {
                _this.updateTemperature(i);
              });
          });

        // Marker ve pin listesini güncelle
        this.markerList.push(marker);

        this.pinsList.push({
          title: `Başlık ${i + 1}`,
          lat: randomLat.toFixed(4),
          lng: randomLng.toFixed(4),
          temperature: randomTemp,
          humidity: randomHumidity,
          date: randomDate,
          name: `${i + 1} Nolu Oda`,
        });
        this.cardList = this.pinsList;
      }
    } catch (error) {
      console.error(error);
    }
  }

  cancel(pinIndex: number, currentTemp: string) {
    debugger;
    const temperatureUpdateElement = document.getElementById(
      `temperature-update-${pinIndex}`
    );
    const humidityUpdateElement = document.getElementById(
      `humidity-update-${pinIndex}`
    );
    const tsettingsElement = document.getElementById(`settings-${pinIndex}`);
    if (tsettingsElement) {
      tsettingsElement.style.display = 'block';
    }
    if (temperatureUpdateElement) {
      temperatureUpdateElement.style.display = 'none';
    }
    if (humidityUpdateElement) {
      humidityUpdateElement.style.display = 'none';
    }
  }

  setTemperature(pinIndex: number, currentTemp: string) {
    const temperatureUpdateElement = document.getElementById(
      `temperature-update-${pinIndex}`
    );
    const tsettingsElement = document.getElementById(`settings-${pinIndex}`);
    if (tsettingsElement) {
      tsettingsElement.style.display = 'none';
    }
    if (temperatureUpdateElement) {
      temperatureUpdateElement.style.display = 'block';
    }
  }

  setHumidity(pinIndex: number, currentHumidity: string) {
    const humidityUpdateElement = document.getElementById(
      `humidity-update-${pinIndex}`
    );
    const tsettingsElement = document.getElementById(`settings-${pinIndex}`);
    if (tsettingsElement) {
      tsettingsElement.style.display = 'none';
    }
    if (humidityUpdateElement) {
      humidityUpdateElement.style.display = 'block';
    }
  }

  updateTemperature(pinIndex: number) {
    // Yeni sıcaklık değeri alınıyor
    const newTemperature = (
      document.getElementById(`new-temperature-${pinIndex}`) as HTMLInputElement
    ).value;

    // HTML içindeki sıcaklık değeri elementini güncelle
    const temperatureValueElement = document.getElementById(
      `temperature-value-${pinIndex}`
    );
    if (temperatureValueElement) {
      temperatureValueElement.textContent = `Sıcaklık: ${newTemperature}°C`;
    }

    // 'pinsList' içindeki sıcaklık değerini güncelle
    if (this.pinsList[pinIndex]) {
      this.pinsList[pinIndex].temperature = newTemperature;
    }

    // Harita üzerindeki marker'ı güncelle
    const markers = Object.values(this.mapOption._layers); // Marker'ları alıyoruz
    const marker: any = markers.find(
      (layer: any) =>
        layer.getLatLng &&
        layer.getLatLng().lat.toFixed(4) === this.pinsList[pinIndex].lat &&
        layer.getLatLng().lng.toFixed(4) === this.pinsList[pinIndex].lng
    );
    if (marker) {
      const newContent = this.createPopupContent(pinIndex, newTemperature);
      marker.unbindPopup(); // Eski pop-up içeriğini kaldır
      marker.bindPopup(newContent, { className: 'customPopup' }); // Yeni içeriği bind et
      Swal.fire('Başarılı!', 'İşlem başarıyla tamamlandı!', 'success');
    }

    // Güncelleme alanını gizle
    const temperatureUpdateDiv = document.getElementById(
      `temperature-update-${pinIndex}`
    );
  }

  updateHumidity(pinIndex: number) {
    // Yeni nem değeri alınıyor
    debugger;
    const newHumidity = (
      document.getElementById(`new-humidity-${pinIndex}`) as HTMLInputElement
    ).value;

    // HTML içindeki nem değeri elementini güncelle
    const humidityValueElement = document.getElementById(
      `humidity-value-${pinIndex}`
    );
    if (humidityValueElement) {
      humidityValueElement.textContent = `Nem: %${newHumidity}`;
    }

    // 'pinsList' içindeki nem değerini güncelle
    if (this.pinsList[pinIndex]) {
      this.pinsList[pinIndex].humidity = newHumidity;
    }

    // Harita üzerindeki marker'ı güncelle
    const markers = Object.values(this.mapOption._layers); // Marker'ları alıyoruz
    const marker: any = markers.find(
      (layer: any) =>
        layer.getLatLng &&
        layer.getLatLng().lat.toFixed(4) === this.pinsList[pinIndex].lat &&
        layer.getLatLng().lng.toFixed(4) === this.pinsList[pinIndex].lng
    );
    if (marker) {
      const newContent = this.createPopupContent(pinIndex, newHumidity);
      marker.unbindPopup(); // Eski pop-up içeriğini kaldır
      marker.bindPopup(newContent, { className: 'customPopup' }); // Yeni içeriği bind et
      Swal.fire('Başarılı!', 'İşlem başarıyla tamamlandı!', 'success');
    }

    this.cardList = [];
    this.cardList = this.pinsList;
  }

  // Popup içeriğini oluşturmak için yardımcı fonksiyon
  createPopupContent(pinIndex: number, newHumidity: string) {
    const pin = this.cardList[pinIndex];
    return `
<div style="background: white;  font-family: Arial, sans-serif;">
      <img src="images/icon-mark.png" alt="Konum İkonu" style="position: absolute; top: -2rem; right: -2rem;">
      <h2 style="margin: 0; font-size: 13px; font-weight: bold; color: #333;">Nem ve Sıcaklık Sensörü</h2>
      <p style="margin: 5px 0 10px; font-size: 12px; color: #666;">Salon</p>
      <div class="w-100" id="settings-${pinIndex}">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <div style="display: flex; align-items: center; gap: 5px;">
            <img src="images/icon-degree.png" alt="Sıcaklık İkonu" style="width: 24px; height: 24px;">
            <span style="font-size: 16px; font-weight: bold; color: #333;">${pin.temperature} °C</span>
          </div>
          <button class="setTemperatureButton"
            style="flex-shrink: 0; padding: 5px 10px; font-size: 12px; color: white; border: none; border-radius: 5px; cursor: pointer; background-color: #007bff;">
            Sıcaklık Ayarla
          </button>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 5px;">
            <img src="images/icon-moisture.png" alt="Nem İkonu" style="width: 24px; height: 24px;">
            <span style="font-size: 16px; font-weight: bold; color: #333;">% ${newHumidity}</span>
          </div>
          <button class="setHumidityButton"
            style="flex-shrink: 0; padding: 5px 10px; font-size: 12px; color: #007bff; border: none; border-radius: 5px; cursor: pointer; background-color: #a3cfff;">
            Nem Ayarla
          </button>
        </div>
      </div>
      <div class="w-100" id="temperature-update-${pinIndex}" style="display: none;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <div style="display: flex; align-items: center; gap: 5px;">
            <img src="images/icon-degree.png" alt="Sıcaklık İkonu" style="width: 24px; height: 24px;">
            <span style="font-size: 16px; font-weight: bold; color: #333;">${pin.temperature} °C</span>
          </div>
          <input style="width: 50%;" type="number" id="new-temperature-${pinIndex}" value="${pin.temperature}" />
        </div>
        <div class="col-12">
          <div class="row">
       <button class="mr-2 backButton"
          style="flex-shrink: 0; padding: 5px 10px; font-size: 12px; color: white; border: none; border-radius: 5px; cursor: pointer; background-color: #007bff;width: 45%;">
          İptal Et</button>
            <button class="updateTemperatureButton"
              style="flex-shrink: 0; padding: 5px 10px; font-size: 12px; color: white; border: none; border-radius: 5px; cursor: pointer; background-color: #007bff; width: 45%; margin-left: auto;">
              Güncelle
            </button>
          </div>
        </div>
      </div>
    </div>
    `;
  }

  cancelTemperatureUpdate(pinIndex: number) {
    const temperatureUpdateElement = document.getElementById(
      `temperature-update-${pinIndex}`
    );
    if (temperatureUpdateElement) {
      temperatureUpdateElement.style.display = 'none';
    }
  }

  cancelHumidityUpdate(pinIndex: number) {
    const humidityUpdateElement = document.getElementById(
      `humidity-update-${pinIndex}`
    );
    if (humidityUpdateElement) {
      humidityUpdateElement.style.display = 'none';
    }
  }

  focusOnPin(index: number): void {
    // Seçili pin'in indeksini güncelle
    this.selectedPinIndex = index;
    debugger;
    // İlgili marker'ı al
    const pin = this.cardList[index];
    const marker =
      this.mapOption._layers[Object.keys(this.mapOption._layers)[index]];

    if (marker && pin) {
      // Haritada marker'ın bulunduğu konuma zum yap
      this.mapOption.setView([parseFloat(pin.lat), parseFloat(pin.lng)], 20);
    }
  }

  onSearchChange(searchValue: string): void {
    this.searchSubject.next(searchValue);
  }

  filterList(searchValue: string): void {
    this.cardList = this.pinsList.filter((item) =>
      item.name.toLowerCase().includes(searchValue.toLowerCase())
    );
  }
}
