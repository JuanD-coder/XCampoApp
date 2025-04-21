import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { KeyboardAvoidingView, Platform, Keyboard } from "react-native";

import MainStack from "./navigation/MainStack";
import BottomTabClient from "./navigation/BottomNabClient";
import { navigationRef } from "./src/utils/RootNavigation";
import { RoutesProvider } from "./screens/delivery/context/RoutesContext";

export default function App() {
  return (
    <RoutesProvider>
      <NavigationContainer ref={navigationRef}>
        <StatusBar style="light" hidden={true} translucent={true} />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <MainStack>
            <BottomTabClient></BottomTabClient>
          </MainStack>
        </KeyboardAvoidingView>
      </NavigationContainer>
    </RoutesProvider>
  );
}
