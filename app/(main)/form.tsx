import { NativeStackHeaderRightProps } from '@react-navigation/native-stack';
import { useNavigation, useRouter } from 'expo-router';
import { useCallback, useEffect, useLayoutEffect, useReducer } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View, Text } from 'react-native';

import { useInsertPlace } from '~/api/places';
import { Container } from '~/components/common/Container';
import FadeIn from '~/components/common/FadeIn';
import Loading from '~/components/common/Loading';
import FormInputContainer from '~/components/form/FormInputContainer';
import ImagePicker from '~/components/form/ImagePicker';
import LocationPicker from '~/components/form/LocationPicker';
import TextInputField from '~/components/form/TextInputField';
import debounce from '~/utils/debounce';
import uploadImage from '~/utils/imageUpload';
import isEmptyString from '~/utils/isEmptyString';

type PlaceForm = {
  title: string;
  latitude?: number;
  longitude?: number;
  address: string;
  imageUri: string;
};

type FormState = {
  placeForm: PlaceForm;
  isValid: boolean;
  isLoading: boolean;
};

type Action =
  | { type: 'UPDATE_FORM'; payload: Partial<PlaceForm> }
  | { type: 'TOGGLE_IS_VALID'; payload: boolean }
  | { type: 'TOGGLE_LOADING'; payload: boolean };

const initialState: FormState = {
  placeForm: {
    title: '',
    address: '',
    imageUri: '',
  },
  isLoading: false,
  isValid: false,
};

const formReducer = (state: FormState, action: Action): FormState => {
  switch (action.type) {
    case 'UPDATE_FORM': {
      return { ...state, placeForm: { ...state.placeForm, ...action.payload } };
    }
    case 'TOGGLE_IS_VALID': {
      return { ...state, isValid: action.payload };
    }
    case 'TOGGLE_LOADING': {
      return { ...state, isLoading: action.payload };
    }
    default: {
      return state;
    }
  }
};

export default function AddPlace() {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const router = useRouter();
  const navigation = useNavigation();
  const { mutate: insertPlace } = useInsertPlace();

  const onUpdateTitle = useCallback((text: string) => {
    dispatch({
      type: 'UPDATE_FORM',
      payload: { title: text },
    });
  }, []);

  const onSelectImage = useCallback((image: string | null) => {
    if (!image) return;
    dispatch({
      type: 'UPDATE_FORM',
      payload: { imageUri: image },
    });
  }, []);

  const onSelectLocation = useCallback((coordinates: number[] | null, address: string) => {
    if (!coordinates) return;
    const [longitude, latitude] = coordinates;
    dispatch({
      type: 'UPDATE_FORM',
      payload: { longitude, latitude, address },
    });
  }, []);

  const validateForm = useCallback(
    debounce(() => {
      const { title, latitude, imageUri } = state.placeForm;
      const isValid = !isEmptyString(title) && !isEmptyString(imageUri) && !!latitude;

      dispatch({ type: 'TOGGLE_IS_VALID', payload: isValid });
    }, 500),
    [state.placeForm]
  );

  const onSubmit = useCallback(async () => {
    try {
      const { placeForm } = state;
      dispatch({ type: 'TOGGLE_LOADING', payload: true });

      const imagePath = await uploadImage(placeForm?.imageUri ?? '');
      const { title, longitude, latitude, address } = placeForm;

      if (!latitude || !longitude) return;

      insertPlace(
        { title, longitude, latitude, address, image: imagePath },
        {
          onSuccess: () => {
            router.back();
            dispatch({ type: 'TOGGLE_LOADING', payload: false });
          },
          onError: (error) => {
            showAlert('There was a problem saving your place:', error.message);
            dispatch({ type: 'TOGGLE_LOADING', payload: false });
          },
        }
      );
    } catch (error) {
      const { message } = error as Error;
      showAlert('There was a problem saving your place:', message);
      dispatch({ type: 'TOGGLE_LOADING', payload: false });
    }
  }, [state.placeForm, insertPlace, router]);

  const showAlert = (message: string, error: string) => {
    Alert.alert('Error', `${message} ${error}`);
  };

  useEffect(() => {
    validateForm();
  }, [state.placeForm]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: ({ tintColor }: NativeStackHeaderRightProps) => {
        return (
          state.isValid && (
            <Pressable onPress={onSubmit}>
              <Text style={{ color: tintColor, fontSize: 18 }}>Save Place</Text>
            </Pressable>
          )
        );
      },
    });
  }, [state.isValid]);

  if (state.isLoading) {
    return (
      <FadeIn>
        <Loading title="Saving Place" />
      </FadeIn>
    );
  }

  return (
    <Container>
      <ScrollView>
        <View style={styles.content}>
          <FormInputContainer title="Title">
            <TextInputField
              value={state.placeForm.title}
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
});
