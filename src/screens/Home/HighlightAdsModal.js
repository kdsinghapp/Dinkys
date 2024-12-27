import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";

const HighlightAdsModal = ({
  isVisible,
  onClose,
  cityLevelOptions,
  nationalLevelOptions,
  onOptionSelect,
}) => {
  const [selectedOption, setSelectedOption] = useState(null); // Track selected option

  const handleOptionSelect = (level, item) => {
    const newSelection = {
      level,
      duration: item.duration,
      price: item.price,
    };

    setSelectedOption(newSelection);
    onOptionSelect(newSelection.level, newSelection.duration, newSelection.price);
  };

  const renderOption = (item, level) => {
    const isSelected =
      selectedOption?.level === level &&
      selectedOption?.duration === item.duration &&
      selectedOption?.price === item.price;

    return (
      <TouchableOpacity
        style={[
          styles.optionButton,
          isSelected && { backgroundColor: "#d1e7dd", borderColor: "#04CFA4" },
        ]}
        onPress={() => handleOptionSelect(level, item)}
      >
        <Text style={styles.optionText}>
          {item.duration} - {item.price}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Highlight Your Ads</Text>

          {/* City Level Options */}
          <Text style={styles.sectionTitle}>City Level:</Text>
          <FlatList
            data={cityLevelOptions}
            renderItem={({ item }) => renderOption(item, "City Level")}
            keyExtractor={(item, index) => `city-${index}`}
          />

          {/* National Level Options */}
          <Text style={styles.sectionTitle}>National Level (All Spain):</Text>
          <FlatList
            data={nationalLevelOptions}
            renderItem={({ item }) => renderOption(item, "National Level")}
            keyExtractor={(item, index) => `national-${index}`}
          />

          {/* Close Button */}
    {selectedOption &&      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Pay to highlight ads( {selectedOption?.price} )</Text>
          </TouchableOpacity>}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#000",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 10,
    color: "#000",
  },
  optionButton: {
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
  optionText: {
    fontSize: 14,
    color: "#000",
  },
  closeButton: {
    backgroundColor: "#04CFA4",
    padding: 10,
    borderRadius: 5,
    marginTop: 15,
  },
  closeText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default HighlightAdsModal;
