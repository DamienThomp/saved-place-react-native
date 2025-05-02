import { useTheme } from '@react-navigation/native';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import {
  ImagePickerOptions,
  ImagePickerResult,
  launchCameraAsync,
  launchImageLibraryAsync,
  requestCameraPermissionsAsync,
  requestMediaLibraryPermissionsAsync,
} from 'expo-image-picker';
import { memo, useEffect, useState } from 'react';
import { ActionSheetIOS, Alert, Image, Platform, Pressable, StyleSheet } from 'react-native';

import RemoteImage from '../common/RemoteImage';

import ContentUnavailable from '~/components/common/ContentUnavailable';
interface ImagePickerProps {
  onSelectImage: (image: string | null) => void;
  editPreviewImage?: string;
}

enum PickerType {
  CAMERA = 'camera',
  LIBRARY = 'library',
}

enum PickerOptions {
  CANCEL = 'Cancel',
  CAMERA = 'Use Camera',
  LIBRARY = 'Use Library',
}

const options: ImagePickerOptions = {
  mediaTypes: ['images', 'livePhotos'],
  allowsEditing: true,
  aspect: [3, 2],
  quality: 0.9,
};

const ImagePicker = memo(function ImagePicker({
  onSelectImage,
  editPreviewImage,
}: ImagePickerProps) {
  const [image, setImage] = useState<string | null>(null);
  const theme = useTheme();

  const selectType = async () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [PickerOptions.CAMERA, PickerOptions.LIBRARY, PickerOptions.CANCEL],
          destructiveButtonIndex: 2,
          cancelButtonIndex: 2,
        },
        (buttonIndex) => {
          if (buttonIndex === 0) {
            onImageUpdate(PickerType.CAMERA);
          }
          if (buttonIndex === 1) {
            onImageUpdate(PickerType.LIBRARY);
          }
        }
      );
    }

    if (Platform.OS === 'android') {
      Alert.alert('Pick a Place', '', [
        {
          text: PickerOptions.CANCEL,
          style: 'cancel',
        },
        {
          text: PickerOptions.LIBRARY,
          onPress: () => {
            onImageUpdate(PickerType.CAMERA);
          },
        },
        {
          text: PickerOptions.CAMERA,
          onPress: () => {
            onImageUpdate(PickerType.CAMERA);
          },
        },
      ]);
    }
  };

  const onImageUpdate = async (pickerType: PickerType) => {
    try {
      const imageResult = await getImage(pickerType, options);

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

  const getImage = async (
    type: PickerType,
    options: ImagePickerOptions
  ): Promise<ImagePickerResult> => {
    switch (type) {
      case 'camera': {
        const cameraPermission = await requestCameraPermissionsAsync();
        if (cameraPermission.granted === false) {
          throw new Error('You need to give this app permission to use your camera');
        }
        return await launchCameraAsync(options);
      }
      case 'library':
      default: {
        const libraryPermission = await requestMediaLibraryPermissionsAsync();
        if (libraryPermission.granted === false) {
          throw new Error('You need to give this app permission to use your library');
        }
        return await launchImageLibraryAsync(options);
      }
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

  if (editPreviewImage) {
    imagePreview = (
      <RemoteImage path={editPreviewImage} style={styles.editImage} contentFit="cover" />
    );
  }

  return (
    <Pressable
      onPress={selectType}
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
  editImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
});

export default ImagePicker;
