import React, { useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Modal, Text } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CustomCameraModal({ visible, onClose, onPictureTaken }: any) {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);
  const insets = useSafeAreaInsets();

  if (!visible) return null;

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <Modal visible={visible} animationType="slide">
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>We need your permission to show the camera</Text>
          <TouchableOpacity style={styles.btn} onPress={requestPermission}>
            <Text style={styles.btnText}>Grant Permission</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.cancelBtn]} onPress={onClose}>
            <Text style={styles.btnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      onPictureTaken(photo.uri);
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={styles.container}>
        <CameraView style={styles.camera} ref={cameraRef} facing="back">
          <View style={[styles.controls, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 40 }]}>
            <View style={styles.topBar}>
              <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                <X size={28} color="#FFF" />
              </TouchableOpacity>
            </View>
            <View style={styles.bottomBar}>
              <TouchableOpacity style={styles.captureBtn} onPress={takePicture}>
                <View style={styles.captureInner} />
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  controls: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomBar: {
    alignItems: 'center',
  },
  captureBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFF',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 24,
  },
  permissionText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 24,
    color: '#1E293B',
    fontWeight: '600',
  },
  btn: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 12,
    width: '100%',
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: '#94A3B8',
  },
  btnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
