import { useTheme } from '@react-navigation/native';
import { ImagePickerOptions, launchImageLibraryAsync } from 'expo-image-picker';
import { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

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
      onSelectImage(image);
    }
  };

  let imagePreview = (
    <ContentUnavailable color={'grey'} icon="image-outline">
      Select a photo.
    </ContentUnavailable>
  );

  if (image) {
    imagePreview = <Image source={{ uri: image }} style={styles.image} />;
  }

  return (
    <View>
      <Text>Image Picker</Text>
      <View
        style={[
          styles.preview,
          { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
        ]}>
        {imagePreview}
      </View>
      {/* <CustomButton
				icon="camera"
				size={20}
				iconColor={"grey"}
				style={{ backgroundColor: "white" }}
				onPress={onImageUpdate}
			>
				Take Image
			</CustomButton> */}
    </View>
  );
}

const styles = StyleSheet.create({
  preview: {
    width: '100%',
    height: 200,
    marginVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 4,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
