import { useTheme } from '@react-navigation/native';
import { ImagePickerOptions, launchImageLibraryAsync } from 'expo-image-picker';
import { useState } from 'react';
import { Image, Pressable, StyleSheet } from 'react-native';

import ContentUnavailable from '~/components/common/ContentUnavailable';

interface ImagePickerProps {
  onSelectImage: (image: string | null) => void;
}

const options: ImagePickerOptions = {
  mediaTypes: ['images'],
  allowsEditing: true,
  aspect: [16, 9],
  quality: 1,
};

export default function ImagePicker({ onSelectImage }: ImagePickerProps) {
  const [image, setImage] = useState<string | null>(null);
  const theme = useTheme();

  const onImageUpdate = async () => {
    const imageResult = await launchImageLibraryAsync(options);

    if (!imageResult.canceled) {
      setImage(imageResult.assets[0].uri);
      onSelectImage(imageResult.assets[0].uri);
    }
  };

  let imagePreview = (
    <ContentUnavailable color={theme.colors.primary} icon="image-outline">
      Select a photo.
    </ContentUnavailable>
  );

  if (image) {
    imagePreview = <Image source={{ uri: image }} style={styles.image} />;
  }

  return (
    <Pressable
      onPress={onImageUpdate}
      style={({ pressed }) => [
        styles.preview,
        {
          backgroundColor: pressed ? theme.colors.background : theme.colors.card,
          borderColor: theme.colors.border,
        },
      ]}>
      {imagePreview}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  preview: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    resizeMode: 'cover',
  },
});
