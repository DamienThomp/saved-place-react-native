import { View, StyleSheet, Text } from 'react-native';

import IconButton from '../ui/IconButton';

type AnnotationContentProps = {
  title?: string;
  onPressed?: () => void;
};

export default function AnnotationContent({ title, onPressed }: AnnotationContentProps) {
  return (
    <View>
      <View style={styles.touchableContainer}>
        <IconButton
          icon="pin"
          size={36}
          color="white"
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
    backgroundColor: 'red',
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
