import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

interface CameraOverlayProps {
  guideText: string;
  isStable: boolean;
}

export const CameraOverlay: React.FC<CameraOverlayProps> = ({ guideText, isStable }) => {
  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <View style={styles.statusRow}>
          <View style={[styles.indicator, { backgroundColor: isStable ? '#34c759' : '#ff3b30' }]} />
          <Text style={styles.statusText}>{isStable ? 'STEADY' : 'HOLD STILL'}</Text>
        </View>
        <View style={styles.guideTextContainer}>
          <Text style={styles.guideText}>{guideText}</Text>
        </View>
      </View>

      <View style={styles.middleSection}>
        <View style={styles.sideOverlay} />
        <View style={styles.focusArea}>
          {/* Corner Guides */}
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
          
          {/* Mock Car Outline (Could be an SVG) */}
          <View style={styles.carOutline}>
            <View style={styles.carBody} />
            <View style={styles.carWheels}>
              <View style={styles.wheel} />
              <View style={styles.wheel} />
            </View>
          </View>
        </View>
        <View style={styles.sideOverlay} />
      </View>

      <View style={styles.bottomSection}>
        <Text style={styles.instruction}>Align the vehicle within the frame</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topSection: {
    height: 120,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  guideTextContainer: {
    backgroundColor: '#f4511e',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  guideText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  middleSection: {
    flex: 1,
    flexDirection: 'row',
  },
  sideOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  focusArea: {
    width: '85%',
    aspectRatio: 1.5,
    borderWidth: 0,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#fff',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  bottomSection: {
    height: 150,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    paddingTop: 20,
  },
  instruction: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.8,
  },
  carOutline: {
    width: '70%',
    height: '50%',
    opacity: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carBody: {
    width: '100%',
    height: '60%',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 10,
  },
  carWheels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginTop: -5,
  },
  wheel: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    borderWidth: 2,
    borderColor: '#fff',
  }
});
