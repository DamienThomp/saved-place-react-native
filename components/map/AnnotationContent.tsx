import { View, StyleSheet, Text } from 'react-native';

import IconButton from '../ui/IconButton';

import { tokens } from '~/constants/theme';

type AnnotationContentProps = {
  title?: string;
  onPressed?: () => void;
};

export default function AnnotationContent({ title, onPressed }: AnnotationContentProps) {
  return (
    <View>
      <View style={styles.touchableContainer}>
        <IconButton
          icon="location-sharp"
          size={40}
          color={tokens.colors.destructive}
          accessibilityLabel="Location"
          onPress={() => {
            onPressed?.();
          }}
        />
      </View>
      {title && <Text style={{ alignSelf: 'center' }}>{title}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  touchableContainer: {
    borderRadius: tokens.borderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
