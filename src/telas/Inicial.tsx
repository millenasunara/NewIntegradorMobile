import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useAuth } from '../componentes/AuthContext';
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  watchPositionAsync,
  LocationAccuracy
} from 'expo-location';

// Modelo de dados do sensor
interface Sensor {
  id: number;
  tipo: string;
  mac_address: string | null;
  latitude: number;
  longitude: number;
  localizacao: string;
  responsavel: string;
  unidade_medida: string;
  status_operacional: boolean;
  observacao: string;
}

export const Inicial = () => {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const mapRef = useRef<MapView>(null);
  const { token } = useAuth();

  async function requestLocationPermissions() {
    const { granted } = await requestForegroundPermissionsAsync();
    if (granted) {
      const currentPosition = await getCurrentPositionAsync();
      setLocation(currentPosition);
      console.log("LOCALIZAÇÃO ATUAL =>", currentPosition);
    }
  }

  useEffect(() => {
    requestLocationPermissions();

    // Função para buscar os sensores
    async function fetchSensors() {
      try {
        const response = await fetch('http://10.0.2.2:8000/api/sensores/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data: Sensor[] = await response.json();
        setSensors(data);
      } catch (error) {
        console.error("Erro ao buscar os sensores:", error);
      }
    }

    fetchSensors();
  }, []);

  useEffect(() => {
    watchPositionAsync(
      {
        accuracy: LocationAccuracy.Highest,
        timeInterval: 1000,
        distanceInterval: 1
      },
      (response) => {
        setLocation(response);
        mapRef.current?.animateCamera({
          pitch: 70,
          center: response.coords
        });
        console.log("LOCALIZAÇÃO ATUAL =>", response.coords); // Adicionando log das coordenadas
      }
    );
  }, []);

  return (
    <View style={estilos.conteiner}>
      {location && (
        <MapView
          provider={PROVIDER_GOOGLE}
          ref={mapRef}
          style={estilos.map}
          initialRegion={{
            latitude: -22.903920, // Latitude do Senai Roberto Mange
            longitude: -47.062740, // Longitude do Senai Roberto Mange
            latitudeDelta: 0.02, // Aumentando os intervalos delta
            longitudeDelta: 0.02
          }}
        >
          <Marker
            coordinate={{
              latitude: -22.903920, // Latitude do Senai Roberto Mange
              longitude: -47.062740 // Longitude do Senai Roberto Mange
            }}
            title="Senai Roberto Mange"
            pinColor="red"
          />

          {sensors && sensors.map(sensor => (
            <Marker
              key={sensor.id}
              coordinate={{
                latitude: sensor.latitude,
                longitude: sensor.longitude
              }}
              title={sensor.localizacao}
              description={sensor.observacao}
            >
              <View style={estilos.marcadorContainer}>
                <Image
                  source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiM2Hprc9DFff5xOaIQeUYjughU73vJjytYw&s' }}
                  style={estilos.mapMarkerImage}
                />
              </View>
            </Marker>
          ))}
        </MapView>
      )}
    </View>
  );

}

const estilos = StyleSheet.create({
  conteiner: {
    flex: 1
  },
  map: {
    height: '100%',
    width: '100%'
  },
  marcadorContainer: {
    width: 90,
    height: 70,
    backgroundColor: '#34CB79',
    flexDirection: 'column',
    borderRadius: 8,
    alignItems: 'center'
  },
  mapMarkerImage: {
    width: 90,
    height: 45,
    resizeMode: 'cover'
  }
});
