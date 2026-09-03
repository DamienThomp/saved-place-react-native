import { useTheme } from 'expo-router/react-navigation';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Container } from '~/components/common/Container';
import FadeIn from '~/components/common/FadeIn';
import Loading from '~/components/common/Loading';
import FormInputContainer from '~/components/form/FormInputContainer';
import ImagePicker from '~/components/form/ImagePicker';
import LocationPicker from '~/components/form/LocationPicker';
import TextInputField from '~/components/form/TextInputField';
import { tokens } from '~/constants/theme';

import { usePlaceFormViewModel } from './usePlaceFormViewModel';

export default function PlaceFormScreen() {
  const theme = useTheme();
  const { status, state, actions } = usePlaceFormViewModel();

  if (status.isLoading) {
    return <Loading title="Loading Place..." />;
  }

  return (
    <Container>
      <ScrollView>
        <View style={styles.content}>
          <FormInputContainer title="Title">
            <TextInputField
              value={state.formData.title}
              onChangeText={actions.onUpdateTitle}
              placeholder="Place Name"
            />
          </FormInputContainer>
          <FormInputContainer title="Image">
            <ImagePicker
              onSelectImage={actions.onSelectImage}
              editPreviewImage={state.editImagePreview}
            />
          </FormInputContainer>
          <FormInputContainer title="Location">
            <LocationPicker
              onSelectLocation={actions.onSelectLocation}
              editCoordinates={state.editCoordinates}
            />
          </FormInputContainer>
        </View>
      </ScrollView>
      {status.isSaving && (
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
    padding: tokens.spacing.xl,
    gap: tokens.spacing.xl,
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
