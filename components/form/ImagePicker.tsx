import { useTheme } from '@react-navigation/native';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { ImagePickerOptions, launchImageLibraryAsync } from 'expo-image-picker';
import { memo, useEffect, useState } from 'react';
import { Alert, Image, Pressable, StyleSheet } from 'react-native';

import ContentUnavailable from '~/components/common/ContentUnavailable';

interface ImagePickerProps {
  onSelectImage: (image: string | null) => void;
}

const options: ImagePickerOptions = {
  mediaTypes: ['images'],
  aspect: [3, 2],
  quality: 0.7,
};

const ImagePicker = memo(function ImagePicker({ onSelectImage }: ImagePickerProps) {
  const [image, setImage] = useState<string | null>(null);
  const theme = useTheme();

  const onImageUpdate = async () => {
    try {
      const imageResult = await launchImageLibraryAsync(options);

      if (!imageResult.canceled) {
        const context = ImageManipulator.manipulate(imageResult.assets[0].uri);
        context.resize({ width: 600, height: 400 });
        const image = await context.renderAsync();
        const result = await image.saveAsync({
          format: SaveFormat.PNG,
        });

        setImage(result.uri);
      }
    } catch (error) {
      Alert.alert('Something Went Wrong', `${error}`);
    }
  };

  useEffect(() => {
    if (image) {
      onSelectImage(image);
    }
  }, [image]);

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
});

const styles = StyleSheet.create({
  preview: {
    width: '100%',
    aspectRatio: 3 / 2,
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

export default ImagePicker;
