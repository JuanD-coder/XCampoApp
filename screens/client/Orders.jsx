import React from "react";
import Constants from "expo-constants";
import { Xmark } from "iconoir-react-native";
import { View, StyleSheet, FlatList } from "react-native";

import StyledText from "../../src/styles/StyledText";
import StyledItemOrder from "../../src/styles/StyledItemOrder";

const Orders = () => {
  const items = Array.from({ length: 11 }, (_, index) => `Item ${index + 1}`);

  const renderItemP = ({ item }) => <StyledItemOrder></StyledItemOrder>;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Xmark width={40} height={40} color={"black"} />
        <StyledText title bold>
          Ordenes
        </StyledText>
      </View>

      <View style={styles.containerOrdenes}>
        <StyledText bold red marginBottom={"15"}>
          {" "}
          Ordenes Pendientes
        </StyledText>

        <FlatList
          data={items}
          renderItem={renderItemP}
          keyExtractor={(item, index) => index.toString()}
          numColumns={1} // Especifica el número de columnas
          width="94%"
          marginStart="3%"
          horizontal
        />
      </View>

      <View style={styles.containerOrdenesReady}>
        <StyledText bold green marginBottom={"20"}>
          {" "}
          Ordenes Terminadas
        </StyledText>

        <FlatList
          data={items}
          renderItem={renderItemP}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2} // Especifica el número de columnas
          width="94%"
          marginStart="3%"
          columnWrapperStyle={styles.columnWrapper}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: Constants.STATUSBAR_HEIGHTHeight,
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  containerOrdenes: {
    width: "95%",
    height: "30%",
    marginEnd: 10,
    borderBottomWidth: 1,
    borderColor: "gray",
  },
  containerOrdenesReady: {
    width: "95%",
    height: "70%",
    marginEnd: 10,
    borderBottomWidth: 1,
    borderColor: "gray",
  },
  columnWrapper: {
    justifyContent: "space-around",
    marginBottom: 10,
  },
});

export default Orders;
