import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import * as Location from "expo-location";

import { Fontisto } from "@expo/vector-icons";

const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Rain: "rains",
  Drizzle: "rain",
  Thunderstorm: "lightning",
};

const SCREEN_WIDTH = Dimensions.get("window").width;
const API_KEY = "";

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [ok, setOk] = useState(true);
  const [days, setDays] = useState([]);

  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) setOk(false); //날씨 정보 얻기에 거부했을 경우 false 설정

    const {
      //위도와 경도 얻기
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });

    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );

    setCity(location[0].region + " " + location[0].street);

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`
    );

    const json = await response.json();
    console.log(json);
    setDays(json);
  };

  useEffect(() => {
    getWeather();
  });

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.city}>
        <Text style={styles.cityName}>{days.name}</Text>
      </View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}
      >
        {days.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator
              color="white"
              style={{ marginTop: 10 }}
              size="large"
            />
          </View>
        ) : (
          <View style={styles.day}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.temp}>{days.main.temp}°C</Text>
              <Fontisto
                name={icons[days.weather[0].main]}
                size={48}
                color="#274c5e"
              />
            </View>
            <Text style={styles.description}>{days.weather[0].main}</Text>
            <Text style={styles.tinytext}>{days.weather[0].description}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#dae9f4",
  },
  city: {
    flex: 1,
    backgroundColor: "#dae9f4",
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    color: "#274c5e",
    fontSize: 78,
    fontWeight: "500",
  },
  weather: {},
  day: {
    width: SCREEN_WIDTH,
    alignItems: "flex-start",
    paddingHorizontal: 20,
  },
  temp: {
    color: "#274c5e",
    marginTop: 50,
    fontSize: 100,
    fontWeight: "bold",
  },
  description: {
    color: "#274c5e",
    marginTop: -10,
    fontSize: 50,
  },
  tinytext: {
    color: "#274c5e",
    fontSize: 40,
  },
});
