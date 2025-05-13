import { useTheme } from '@react-navigation/native';
import { NativeStackHeaderRightProps } from '@react-navigation/native-stack';
import { useNavigation } from 'expo-router';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useInsertPlace, useUpdatePlace } from '~/api/places';
import { Container } from '~/components/common/Container';
import FadeIn from '~/components/common/FadeIn';
import Loading from '~/components/common/Loading';
import FormInputContainer from '~/components/form/FormInputContainer';
import ImagePicker from '~/components/form/ImagePicker';
import LocationPicker from '~/components/form/LocationPicker';
import TextInputField from '~/components/form/TextInputField';
import IconButton from '~/components/ui/IconButton';
import { useEditImagePreview } from '~/hooks/useEditImagePreview';
import useEditLocation from '~/hooks/useEditLocation';
import { useLocationDetails } from '~/hooks/useLocationDetails';
import usePlaceFormHasEdits from '~/hooks/usePlaceFormHasEdits';
import usePlaceFormValidation from '~/hooks/usePlaceFormValidation';
import { createPlacePayload } from '~/utils/createPlacePayload';
import prepareImagePath from '~/utils/prepareImagePath';

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

export default function PlaceFormScreen() {
  const [formData, setFormData] = useState<PlaceForm>(initialState);
  const [originalData, setOriginalData] = useState<PlaceForm | undefined>();
  const [isSaving, setIsSaving] = useState(false);

  const navigation = useNavigation();
  const theme = useTheme();

  const { mutate: insertPlace } = useInsertPlace();
  const { mutate: updatePlace } = useUpdatePlace();

  const { data: existingPlace, isLoading: isLoadingPlace, isEditing } = useLocationDetails();

  const { isValid } = usePlaceFormValidation(formData);
  const { hasEdits } = usePlaceFormHasEdits(formData, originalData, isEditing, isValid);
  const { editCoordinates } = useEditLocation(existingPlace);
  const editImagePreview = useEditImagePreview(formData.imageUri);

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

      const { imageUri } = formData;

      const imagePath = await prepareImagePath(imageUri);

      const payload = createPlacePayload(formData, imagePath, existingPlace);

      const mutationFn = isEditing ? updatePlace : insertPlace;

      const mutationOptions = {
        onSettled: () => setIsSaving(false),
        onSuccess: () => navigation.goBack(),
        onError: (error: Error) =>
          showAlert('There was a problem saving your place:', error.message),
      };

      mutationFn(payload, mutationOptions);
    } catch (error) {
      const { message } = error as Error;
      setIsSaving(false);
      showAlert('There was a problem saving your place:', message);
    }
  }, [formData, insertPlace, navigation, existingPlace]);

  const showAlert = (message: string, error: string) => {
    Alert.alert('Error', `${message} ${error}`);
  };

  const onBack = () => navigation.goBack();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Update A Place' : 'Add A Place',
      headerLeft: ({ tintColor }: NativeStackHeaderRightProps) => {
        return (
          <IconButton
            color={tintColor}
            size={28}
            icon="chevron-back"
            onPress={onBack}
            style={{ padding: 0 }}
          />
        );
      },
      headerRight: ({ tintColor }: NativeStackHeaderRightProps) => {
        return (
          isValid &&
          hasEdits && (
            <Pressable onPress={onSubmit} disabled={isSaving}>
              <Text style={{ color: tintColor, fontSize: 18 }}>Save Place</Text>
            </Pressable>
          )
        );
      },
    });
  }, [isValid, isEditing, onSubmit, navigation, isSaving]);

  useEffect(() => {
    if (isEditing && existingPlace) {
      const { title, address, image, longitude, latitude } = existingPlace;

      if (!image) return;

      const data = { title, address, imageUri: image, longitude, latitude };

      setFormData(data);
      setOriginalData(data);
    }
  }, [existingPlace, isEditing]);

  if (isEditing && isLoadingPlace) {
    return <Loading title="Loading Place..." />;
  }

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
            <ImagePicker onSelectImage={onSelectImage} editPreviewImage={editImagePreview} />
          </FormInputContainer>
          <FormInputContainer title="Location">
            <LocationPicker onSelectLocation={onSelectLocation} editCoordinates={editCoordinates} />
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
