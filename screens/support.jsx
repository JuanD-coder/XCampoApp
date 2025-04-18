import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from "react-native";
import theme from "../src/theme/theme";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome5 } from "@expo/vector-icons";

const Support = () => {
  const navigation = useNavigation();

  const openWhatsApp = () => {
    const phoneNumber = "573154295146"; // tu número con código de país sin "+" (ej: Colombia = 57)
    const message = "¡Hola! Necesito ayuda con la aplicación.";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>¿Necesitas ayuda? 💬</Text>
        <Text style={styles.subtitle}>
          Puedes comunicarte con nuestro equipo vía WhatsApp para:
        </Text>

        <View style={styles.card}>
          <Text style={styles.option}>🛠️ Soporte técnico</Text>
          <Text style={styles.option}>💡 Sugerencias</Text>
          <Text style={styles.option}>⚠️ Reportar un problema</Text>
        </View>

        <Text style={styles.instructions}>
          Solo presiona el botón flotante para iniciar una conversación por
          WhatsApp con nosotros.
        </Text>
      </ScrollView>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>⬅️ Volver</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.whatsappButton} onPress={openWhatsApp}>
        <FontAwesome5 name="whatsapp" size={24} color="white" />
        <Text style={styles.whatsappButtonText}>Chatear por WhatsApp</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  backButton: {
    backgroundColor: theme.colors.blueDark,
    borderRadius: 30,
    bottom: 100,
    elevation: 6,
    minWidth: 100,
    paddingHorizontal: 25,
    paddingVertical: 15,
    position: "absolute",
    right: 20,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  backButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    elevation: 4,
    marginBottom: 20,
    padding: 20,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  container: {
    backgroundColor: theme.colors.grey,
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 100, // espacio para el botón flotante
  },
  instructions: {
    color: theme.colors.greyBlack,
    fontSize: 14,
    textAlign: "center",
  },
  option: {
    color: theme.colors.blueDark,
    fontSize: 18,
    marginBottom: 10,
  },
  subtitle: {
    color: theme.colors.blueDark,
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  title: {
    color: theme.colors.blueDark,
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  whatsappButton: {
    alignItems: "center",
    backgroundColor: theme.colors.greenWhatsapp,
    borderRadius: 30,
    bottom: 30,
    elevation: 6,
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    minWidth: 150,
    paddingHorizontal: 25,
    paddingVertical: 15,
    position: "absolute",
    right: 20,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  whatsappButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Support;
