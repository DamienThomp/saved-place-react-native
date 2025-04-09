import { useTheme } from '@react-navigation/native';
import { NativeStackHeaderRightProps } from '@react-navigation/native-stack';
import { useNavigation } from 'expo-router';
import { useCallback, useLayoutEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View, Text } from 'react-native';

import { useInsertPlace } from '~/api/places';
import { Container } from '~/components/common/Container';
import FadeIn from '~/components/common/FadeIn';
import Loading from '~/components/common/Loading';
import FormInputContainer from '~/components/form/FormInputContainer';
import ImagePicker from '~/components/form/ImagePicker';
import LocationPicker from '~/components/form/LocationPicker';
import TextInputField from '~/components/form/TextInputField';
import usePlaceFormValidation from '~/hooks/usePlaceFormValidation';
import uploadImage from '~/utils/imageUpload';

export type PlaceForm = {
  title: string;
  latitude?: number;
  longitude?: number;
  address: string;
  imageUri: string;
};

const initialState: PlaceForm = {
  title: '',
  address: '',
  imageUri: '',
};

export default function AddPlace() {
  const [formData, setFormData] = useState<PlaceForm>(initialState);

  const [isSaving, setIsSaving] = useState(false);

  const navigation = useNavigation();
  const theme = useTheme();
  const { mutate: insertPlace } = useInsertPlace();

  const { isValid } = usePlaceFormValidation(formData);

  const updateForm = useCallback((updates: Partial<PlaceForm>) => {
    setFormData((current) => ({ ...current, ...updates }));
  }, []);

  const onUpdateTitle = useCallback((text: string) => {
    updateForm({ title: text });
  }, []);

  const onSelectImage = useCallback((image: string | null) => {
    if (!image) return;

    updateForm({ imageUri: image });
  }, []);

  const onSelectLocation = useCallback((coordinates: number[] | null, address: string) => {
    if (!coordinates) return;
    const [longitude, latitude] = coordinates;

    updateForm({ longitude, latitude, address });
  }, []);

  const onSubmit = useCallback(async () => {
    try {
      setIsSaving(true);

      const imagePath = await uploadImage(formData?.imageUri ?? '');
      const { title, longitude, latitude, address } = formData;

      if (!latitude || !longitude) return;

      insertPlace(
        { title, longitude, latitude, address, image: imagePath },
        {
          onSettled: () => setIsSaving(false),
          onSuccess: () => navigation.goBack(),
          onError: (error) => showAlert('There was a problem saving your place:', error.message),
        }
      );
    } catch (error) {
      const { message } = error as Error;
      showAlert('There was a problem saving your place:', message);
      setIsSaving(false);
    }
  }, [formData, insertPlace, navigation]);

  const showAlert = (message: string, error: string) => {
    Alert.alert('Error', `${message} ${error}`);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: ({ tintColor }: NativeStackHeaderRightProps) => {
        return (
          isValid && (
            <Pressable onPress={onSubmit} disabled={isSaving}>
              <Text style={{ color: tintColor, fontSize: 18 }}>Save Place</Text>
            </Pressable>
          )
        );
      },
    });
  }, [isValid]);

  return (
    <Container>
      <ScrollView>
        <View style={styles.content}>
          <FormInputContainer title="Title">
            <TextInputField
              value={formData.title}
              onChangeText={onUpdateTitle}
              placeholder="Place Name"
            />
          </FormInputContainer>
          <FormInputContainer title="Image">
            <ImagePicker onSelectImage={onSelectImage} />
          </FormInputContainer>
          <FormInputContainer title="Location">
            <LocationPicker onSelectLocation={onSelectLocation} />
          </FormInputContainer>
        </View>
      </ScrollView>
      {isSaving && (
        <View style={[styles.loadingOverLay, { backgroundColor: theme.colors.background }]}>
          <FadeIn>
            <Loading title="Saving Place" />
          </FadeIn>
        </View>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 18,
    gap: 18,
    justifyContent: 'center',
  },
  loadingOverLay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
});
