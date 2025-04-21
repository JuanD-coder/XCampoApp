import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

/* Styles */
import StyledButtonIcon from "../../src/styles/StyledButtonIcon.jsx";
import StyledButton from "../../src/styles/StyledButton.jsx";

/* Components */
import TEXTS from "../../src/string/string.js";
import theme from "../../src/theme/theme.js";
import SearchBar from "../../src/components/SearchBar.jsx";
import NoDataView from "../../src/components/NotDataView.jsx";
import OrderAlert from "../../src/components/Alerts/OrderAlert.jsx";
import SalesAlert from "../../src/components/Alerts/SalesAlert.jsx";

/* Utils */
import { formatPrice, HOME_STYLES } from "../../src/utils/constants.js";
import { getFirstURLFromString } from "../../fetch/UseFetch.js";

/* Services */
import {
  listAllProductBySeller,
  deleteProductId,
} from "../../services/productService.js";
import { getSellerID } from "../../services/SellerService.js";
import { getSalesProducts } from "../../services/OrdersService.js";

const ProductsScreen = ({ route, navigation }) => {
  const { idUser } = route.params || {};
  const [idSeller, setIdSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    type: "",
    message: "",
  });

  const fetchSellerID = useCallback(async () => {
    const sellerID = await getSellerID(idUser);
    setIdSeller(sellerID);
  }, [idUser]);

  const fetchProducts = useCallback(async () => {
    if (!idSeller) return;
    try {
      const listProduct = await listAllProductBySeller(idSeller);
      setProducts(listProduct);
      setFilteredProducts(listProduct);
      setLoading(false);
    } catch (error) {
      setError("Error al obtener los productos: " + error.message);
      setLoading(false);
    }
  }, [idSeller]);

  useEffect(() => {
    fetchSellerID();
  }, [fetchSellerID]);

  useEffect(() => {
    if (idSeller) fetchProducts();
  }, [idSeller, fetchProducts]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", fetchProducts);
    return unsubscribe;
  }, [navigation, fetchProducts]);

  const handleSearch = (text) => {
    setSearchTerm(text);
    const term = text.toLowerCase();
    setFilteredProducts(
      text
        ? products.filter((p) => p.name.toLowerCase().includes(term))
        : products,
    );
  };

  const handleEdit = (product) => {
    navigation.navigate("RegisterProducts", {
      title: `Editar Producto ${product.name}`,
      idSeller,
      product,
    });
  };

  const handleDelete = async (productId) => {
    try {
      await deleteProductId(productId, idSeller);
      setAlertConfig({
        visible: true,
        type: "error",
        message: "Se eliminó un producto correctamente",
      });
      setProducts((prev) => prev.filter((p) => p.idProduct !== productId));
      setFilteredProducts((prev) =>
        prev.filter((p) => p.idProduct !== productId),
      );
    } catch (error) {
      setError("Error al eliminar el producto: " + error.message);
    }
  };

  const handleShowSales = async (product) => {
    const totalSales = await getSalesProducts(product.idProduct);
    setSelectedProduct({
      name: product.name,
      id: product.idProduct,
      totalSales,
    });
  };

  const renderProduct = ({ item }) => (
    <ProductCard
      product={item}
      onEdit={handleEdit}
      onSales={() => handleShowSales(item)}
      onDelete={handleDelete}
    />
  );

  const shouldShowNoData = filteredProducts.length === 0;

  return (
    <View style={HOME_STYLES.container}>
      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.greenMedium} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <>
          <Text style={styles.title}>Productos</Text>
          <SearchBar
            placeholder="Buscar productos..."
            value={searchTerm}
            onChangeText={handleSearch}
          />
          {products.length === 0 || shouldShowNoData ? (
            <NoDataView dataText="productos" />
          ) : (
            <FlatList
              data={filteredProducts}
              keyExtractor={(item) =>
                item?.idProduct?.toString() ?? Math.random().toString()
              }
              contentContainerStyle={styles.flatListContainer}
              renderItem={renderProduct}
            />
          )}
        </>
      )}

      <StyledButtonIcon
        fab
        btnFab
        title="Agregar Producto"
        size={25}
        nameIcon="add-circle-outline"
        iconLibrary={MaterialIcons}
        onPress={() =>
          navigation.navigate("RegisterProducts", {
            title: TEXTS.homeSeller.ADD_PRODUCT,
            idSeller,
          })
        }
      />

      <SalesAlert
        visible={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        productName={selectedProduct?.name || "Producto"}
        productId={`PDT-${selectedProduct?.id || "012"}`}
        totalSales={selectedProduct?.totalSales || 0}
      />

      <OrderAlert
        visible={alertConfig.visible}
        type={alertConfig.type}
        message={alertConfig.message}
        onClose={() => setAlertConfig((prev) => ({ ...prev, visible: false }))}
      />
    </View>
  );
};

const ProductCard = ({ product, onEdit, onSales, onDelete }) => (
  <View style={styles.card}>
    <Image
      source={{ uri: getFirstURLFromString(product.urlImage) || " " }}
      style={styles.productImage}
    />
    <View style={styles.cardContent}>
      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.productDescription}>{product.description}</Text>

      <Text style={styles.productData}>
        Unidad: <Text style={styles.pdtValue}>{product.measurementUnit}</Text>
      </Text>

      <Text style={styles.productData}>
        Precio:{" "}
        <Text style={styles.pdtValue}>${formatPrice(product.price)}</Text>
      </Text>

      <Text style={styles.productData}>
        Categoría: <Text style={styles.pdtValue}>{product.nameCategory}</Text>
      </Text>

      <Text style={styles.productData}>
        Inventario disponible:{" "}
        <Text style={styles.pdtValue}>{product.stock} Und</Text>
      </Text>

      <View style={styles.cardButtons}>
        <StyledButtonIcon
          logoutButton
          nameIcon="delete"
          iconLibrary={MaterialIcons}
          onPress={() => onDelete(product.idProduct)}
        />
        <StyledButtonIcon
          nameIcon="edit"
          iconLibrary={MaterialIcons}
          onPress={() => onEdit(product)}
        />
      </View>
      <StyledButton green style={styles.btn} title="Ventas" onPress={onSales} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  btn: {
    marginHorizontal: 3,
    marginVertical: 0,
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: 8,
    elevation: 5,
    flexDirection: "row",
    marginBottom: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  cardButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  cardContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  flatListContainer: {
    paddingBottom: 85,
    paddingHorizontal: 10,
  },
  pdtValue: {
    color: theme.colors.red,
  },
  productData: {
    fontSize: 16,
    fontWeight: "bold",
  },
  productDescription: {
    color: theme.colors.greyBlack,
    fontSize: 14,
    marginVertical: 8,
  },
  productImage: {
    alignSelf: "center",
    borderRadius: 8,
    height: 120,
    marginRight: 16,
    width: 120,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 15,
    textAlign: "center",
  },
});

export default ProductsScreen;
