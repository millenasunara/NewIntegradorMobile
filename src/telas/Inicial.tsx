import { StyleSheet, View, Image } from 'react-native'
import { useEffect, useState,useRef } from 'react'
import MapView, { Marker } from 'react-native-maps'
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  LocationObject,
  watchPositionAsync,
  LocationAccuracy
} from 'expo-location'


export const Inicial = () => {
  const [location, setLocation] = useState<LocationObject | null>(null);
  // let [regiao, setRegiao] = useState({latitude:-22.914322, longitude:-47.068717, latitudeDelta: 0.005, longitudeDelta: 0.005})
  
  
  const mapRef = useRef<MapView>(null)
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
  }, []);
  useEffect(() => {
    watchPositionAsync({
      accuracy: LocationAccuracy.Highest,
      timeInterval: 1000,
      distanceInterval: 1
    }, (response) => {
      
      setLocation(response);
      mapRef.current?.animateCamera({
        pitch:70,
        center:response.coords
      }) 
    });
  }, []);

  return (
    <View style={estilos.conteiner}>
      {
        location &&
        <MapView 
          ref = {mapRef}
          style={estilos.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005
          }}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
          />
          <Marker coordinate={{latitude: -22.9075,longitude:  -47.0689,}}>
            <View style={estilos.marcadorContainer}>
              <Image source={{uri:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiM2Hprc9DFff5xOaIQeUYjughU73vJjytYw&s'}} 
              style = {estilos.mapMarkerImage}
              />
              
            </View>

          </Marker>


        </MapView>

      }

    </View>
  );
}

const estilos = StyleSheet.create({
  conteiner: {
    flex: 1,

  },
  fundo: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    flex: 1,
    width: '100%',
  },
  marcadorContainer:{
    width:90,
    height:70,
    backgroundColor:'#34CB79',
    flexDirection:'column',
    borderRadius:8,
    alignItems:'center',
  },
  mapMarkerImage:{
    width:90,
    height:45,
    resizeMode:'cover',
  }
});

