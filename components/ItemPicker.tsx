import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Animated,
} from 'react-native';

export interface PickerItem {
  label: string;
  value: string | number;
}

interface ItemPickerProps {
  items: PickerItem[];
  selectedValue: string | number | null;
  onValueChange: (value: string | number) => void;
  placeholder?: string;
  label?: string;
}

const ItemPicker: React.FC<ItemPickerProps> = ({
  items,
  selectedValue,
  onValueChange,
  placeholder = 'Select an item',
  label,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const scaleAnim = React.useRef(new Animated.Value(0.95)).current;

  const selectedItem = items.find(item => item.value === selectedValue);

  const openModal = () => {
    setModalVisible(true);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 12,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.95,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity
        style={styles.button}
        onPress={openModal}
        activeOpacity={0.7}
      >
        <View style={styles.buttonContent}>
          <Text
            style={[
              styles.buttonText,
              !selectedValue && styles.placeholderText,
            ]}
          >
            {selectedItem?.label || placeholder}
          </Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{selectedItem ? '✓' : '◦'}</Text>
          </View>
        </View>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={closeModal}
          activeOpacity={1}
        >
          <Animated.View
            style={[
              styles.modalContainer,
              { transform: [{ scale: scaleAnim }] },
            ]}
          >
            <SafeAreaView style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={closeModal} hitSlop={8}>
                  <Text style={styles.cancelButton}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Select Option</Text>
                <View style={{ width: 60 }} />
              </View>

              <ScrollView
                style={styles.itemsContainer}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
              >
                {items.map((item, index) => {
                  const isSelected = selectedValue === item.value;
                  const isFirst = index === 0;
                  const isLast = index === items.length - 1;

                  return (
                    <TouchableOpacity
                      key={item.value}
                      style={[
                        styles.modalItem,
                        isFirst && styles.itemFirst,
                        isLast && styles.itemLast,
                        isSelected && styles.modalItemSelected,
                      ]}
                      onPress={() => {
                        onValueChange(item.value);
                        closeModal();
                      }}
                      activeOpacity={0.6}
                    >
                      <View style={styles.itemContent}>
                        <Text
                          style={[
                            styles.modalItemText,
                            isSelected && styles.modalItemTextSelected,
                          ]}
                        >
                          {item.label}
                        </Text>
                        {isSelected && (
                          <View style={styles.selectedIndicator}>
                            <Text style={styles.checkmark}>✓</Text>
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })}
                <View style={styles.bottomPadding} />
              </ScrollView>
            </SafeAreaView>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    flex: 1,
  },
  placeholderText: {
    color: '#999',
    fontWeight: '400',
  },
  badge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '88%',
    maxHeight: '70%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  cancelButton: {
    fontSize: 16,
    fontWeight: '500',
    color: '#007AFF',
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  itemsContainer: {
    maxHeight: 400,
  },
  modalItem: {
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  itemFirst: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  itemLast: {
    borderBottomWidth: 0,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalItemSelected: {
    backgroundColor: '#F0F7FF',
  },
  modalItemText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  modalItemTextSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  bottomPadding: {
    height: 8,
  },
});

export default ItemPicker;
