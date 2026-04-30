import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { CameraOverlay } from '../../components/CameraOverlay';
import { X, Camera as CameraIcon } from 'lucide-react-native';
import { useInspectionStore } from '../../store/useInspectionStore';
import { imageValidationService } from '../../services/imageValidationService';
import { useStability } from '../../hooks/useStability';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';

export default function InspectionCamera() {
  const route = useRoute<any>();
  const { id, stepId, label } = route.params || {};
  const [permission, requestPermission] = useCameraPermissions();
  const [isValidating, setIsValidating] = useState(false);
  const { isStable } = useStability();
  const cameraRef = useRef<any>(null);
  const navigation = useNavigation<any>();
  const addPhoto = useInspectionStore((state) => state.addPhoto);

  // Keep screen awake while camera is active
  React.useEffect(() => {
    let isActive = true;
    const enableKeepAwake = async () => {
      try {
        await activateKeepAwakeAsync();
      } catch (error) {
        console.warn('Failed to activate keep awake:', error);
      }
    };

    enableKeepAwake();

    return () => {
      isActive = false;
      try {
        deactivateKeepAwake();
      } catch (error) {
        // Ignore deactivation errors
      }
    };
  }, []);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (!isStable) {
      Alert.alert('Steady!', 'Please hold the device still while capturing.');
      return;
    }

    if (cameraRef.current && !isValidating) {
      try {
        setIsValidating(true);
        const photoData = await cameraRef.current.takePictureAsync();
        
        // --- Day 5: Image Validation ---
        const validation = await imageValidationService.validateImage(photoData.uri);
        
        if (!validation.isValid) {
          Alert.alert(
            'Quality Issue Detected',
            validation.errors.join('\n'),
            [{ text: 'Try Again', onPress: () => setIsValidating(false) }]
          );
          return;
        }

        // Save to SQLite if valid
        await addPhoto(id as string, photoData.uri, (stepId as string) || 'EXTERIOR_FRONT');
        
        Alert.alert('Perfect!', 'Photo meets quality standards.', [
          { text: 'Continue', onPress: () => navigation.goBack() }
        ]);
      } catch (error) {
        console.error('Failed to take picture', error);
      } finally {
        setIsValidating(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef}>
        <CameraOverlay guideText={(label as string) || "FRONT LEFT"} isStable={isStable} />
        
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={() => navigation.goBack()}
        >
          <X size={28} color="#fff" />
        </TouchableOpacity>

        <View style={styles.controls}>
          <TouchableOpacity 
            style={[styles.captureButton, !isStable && styles.captureButtonDisabled]} 
            onPress={takePicture}
            disabled={isValidating || !isStable}
          >
            <View style={styles.captureButtonInner}>
              {isValidating ? (
                <ActivityIndicator color="#0787e2" />
              ) : (
                <CameraIcon size={32} color={isStable ? "#0787e2" : "#ccc"} />
              )}
            </View>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
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
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 25,
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonDisabled: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionButton: {
    marginTop: 20,
    backgroundColor: '#0787e2',
    padding: 15,
    borderRadius: 10,
    alignSelf: 'center',
  },
  permissionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  }
});
