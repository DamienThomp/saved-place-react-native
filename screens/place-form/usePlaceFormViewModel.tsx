import { useNavigation } from 'expo-router';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { Alert, ColorValue, Pressable, Text } from 'react-native';

import { useInsertPlace, useUpdatePlace } from '~/api/places';
import IconButton from '~/components/ui/IconButton';
import { tokens } from '~/constants/theme';
import { useEditImagePreview } from '~/hooks/useEditImagePreview';
import useEditLocation from '~/hooks/useEditLocation';
import { useLocationDetails } from '~/hooks/useLocationDetails';
import usePlaceFormHasEdits from '~/hooks/usePlaceFormHasEdits';
import usePlaceFormValidation from '~/hooks/usePlaceFormValidation';
import useMapSelectionStore from '~/stores/mapSelectionStore';
import { PlaceForm } from '~/types/placeForm';
import { createPlacePayload } from '~/utils/createPlacePayload';
import prepareImagePath from '~/utils/prepareImagePath';

const initialState: PlaceForm = {
  title: '',
  address: '',
  imageUri: '',
};

export function usePlaceFormViewModel() {
  const [formData, setFormData] = useState<PlaceForm>(initialState);
  const [originalData, setOriginalData] = useState<PlaceForm | undefined>();
  const [isSaving, setIsSaving] = useState(false);

  const { clear: clearMapLocation } = useMapSelectionStore();
  const navigation = useNavigation();

  const { mutate: insertPlace } = useInsertPlace();
  const { mutate: updatePlace } = useUpdatePlace();

  const { data: existingPlace, isLoading: isLoadingPlace, isEditing } = useLocationDetails();

  const { isValid } = usePlaceFormValidation(formData);
  const { hasEdits } = usePlaceFormHasEdits(formData, originalData, isEditing, isValid);
  const { editCoordinates } = useEditLocation(existingPlace);
  const editImagePreview = useEditImagePreview(formData.imageUri);

  const showAlert = useCallback((message: string, errorMessage: string) => {
    Alert.alert('Error', `${message} ${errorMessage}`);
  }, []);

  const updateForm = useCallback((updates: Partial<PlaceForm>) => {
    setFormData((current) => ({ ...current, ...updates }));
  }, []);

  const onUpdateTitle = useCallback(
    (text: string) => {
      updateForm({ title: text });
    },
    [updateForm]
  );

  const onSelectImage = useCallback(
    (image: string | null) => {
      if (!image) return;

      updateForm({ imageUri: image });
    },
    [updateForm]
  );

  const onSelectLocation = useCallback(
    (coordinates: number[] | null, address: string) => {
      if (!coordinates) return;
      const [longitude, latitude] = coordinates;

      updateForm({ longitude, latitude, address });
    },
    [updateForm]
  );

  const onSubmit = useCallback(async () => {
    const mutationFn = isEditing ? updatePlace : insertPlace;

    try {
      setIsSaving(true);

      const { imageUri } = formData;
      const imagePath = await prepareImagePath(imageUri);

      const payload = createPlacePayload(formData, imagePath, existingPlace);

      const mutationOptions = {
        onSettled: () => setIsSaving(false),
        onSuccess: () => {
          clearMapLocation();
          navigation.goBack();
        },
        onError: (error: Error) =>
          showAlert('There was a problem saving your place:', error.message),
      };

      mutationFn(payload, mutationOptions);
    } catch (error) {
      const { message } = error as Error;
      setIsSaving(false);
      showAlert('There was a problem saving your place:', message);
    }
  }, [
    formData,
    insertPlace,
    navigation,
    existingPlace,
    isEditing,
    updatePlace,
    clearMapLocation,
    showAlert,
  ]);

  const onBack = useCallback(() => {
    clearMapLocation();
    navigation.goBack();
  }, [clearMapLocation, navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Update A Place' : 'Add A Place',
      headerLeft: ({ tintColor }: { tintColor?: ColorValue }) => {
        return (
          <IconButton
            color={tintColor}
            size={28}
            icon="chevron-back"
            accessibilityLabel="Cancel"
            onPress={onBack}
            style={{ padding: 0 }}
          />
        );
      },
      headerRight: ({ tintColor }: { tintColor?: ColorValue }) => {
        return isValid && hasEdits ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Save Place"
            onPress={onSubmit}
            disabled={isSaving}>
            <Text
              style={{
                color: tintColor,
                ...tokens.typography.label,
                paddingHorizontal: tokens.spacing.sm,
              }}>
              Save Place
            </Text>
          </Pressable>
        ) : null;
      },
    });
  }, [isValid, hasEdits, isEditing, onSubmit, navigation, isSaving, onBack]);

  useEffect(() => {
    if (isEditing && existingPlace) {
      const { title, address, image, longitude, latitude } = existingPlace;

      if (!image) return;

      const data = { title, address, imageUri: image, longitude, latitude };

      setFormData(data);
      setOriginalData(data);
    }
  }, [existingPlace, isEditing]);

  return {
    status: { isLoading: isEditing && isLoadingPlace, isSaving },
    state: {
      formData,
      isEditing,
      editCoordinates,
      editImagePreview,
    },
    actions: {
      onUpdateTitle,
      onSelectImage,
      onSelectLocation,
    },
  };
}
