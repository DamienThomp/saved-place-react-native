import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, StyleSheet } from 'react-native';
import { useInsertPlace } from '~/api/places';

import { Container } from '~/components/common/Container';
import Loading from '~/components/common/Loading';
import FormInputContainer from '~/components/form/FormInputContainer';
import ImagePicker from '~/components/form/ImagePicker';
import LocationPicker from '~/components/form/LocationPicker';
import TextInputField from '~/components/form/TextInputField';
import { Button } from '~/components/ui/Button';
import uploadImage from '~/utils/imageUpload';

type PlaceForm = {
  title: string;
  latitude: number;
  longitude: number;
  address: string;
  imageUri?: string;
};

const initialState: PlaceForm = {
  title: '',
  latitude: 0,
  longitude: 0,
  address: '',
};

export default function AddPlace() {
  const [placeForm, setForm] = useState<PlaceForm>(initialState);
  const [errors, setErrors] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { mutate: insertPlace } = useInsertPlace();

  const onUpdateTitle = (text: string) => {
    setForm((currentState: PlaceForm) => {
      return { ...currentState, title: text };
    });
  };

  const onSelectImage = useCallback((image: string | null) => {
    if (!image) return;
    setForm((currentState: PlaceForm) => {
      return { ...currentState, imageUri: image };
    });
  }, []);

  const onSelectLocation = useCallback((coordinates: number[] | null, address: string) => {
    if (!coordinates) return;
    setForm((currentState: PlaceForm) => {
      const [longitude, latitude] = coordinates;
      return { ...currentState, longitude, latitude, address };
    });
  }, []);

  const validateForm = (): boolean => {
    setErrors('');

    if (placeForm.title.length === 0) {
      setErrors('Title is Required');
      return false;
    }

    if (placeForm.latitude === 0) {
      setErrors('You need to select a place.');
      return false;
    }

    return true;
  };

  const onSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    const imagePath = await uploadImage(placeForm?.imageUri ?? '');

    const { title, longitude, latitude, address } = placeForm;

    insertPlace(
      { title, longitude, latitude, address, image: imagePath },
      {
        onSuccess: () => {
          router.back();
          setIsLoading(false);
        },
        onError: () => {
          Alert.alert('Error', 'There was a problem saving your place');
          setIsLoading(false);
        },
      }
    );
  };

  useEffect(() => {
    if (errors) {
      Alert.alert('Error', errors);
    }
  }, [errors]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Container>
      <KeyboardAvoidingView style={styles.content} behavior="padding" enabled>
        <FormInputContainer title="Title">
          <TextInputField
            value={placeForm?.title}
            onChangeText={onUpdateTitle}
            keyboardType="default"
          />
        </FormInputContainer>
        <FormInputContainer title="Image">
          <ImagePicker onSelectImage={onSelectImage} />
        </FormInputContainer>
        <FormInputContainer title="Location">
          <LocationPicker onSelectLocation={onSelectLocation} />
        </FormInputContainer>
        <Button title="Add Place" onPress={onSubmit} />
      </KeyboardAvoidingView>
    </Container>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 18,
    gap: 18,
  },
});
