import { useState } from 'react';
import { KeyboardAvoidingView, StyleSheet } from 'react-native';

import { Container } from '~/components/common/Container';
import FormInputContainer from '~/components/form/FormInputContainer';
import ImagePicker from '~/components/form/ImagePicker';
import TextInputField from '~/components/form/TextInputField';
import { Button } from '~/components/ui/Button';

type PlaceForm = {
  title?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  imageUri?: string;
};

export default function AddPlace() {
  const [placeForm, setForm] = useState<PlaceForm>({});

  const onUpdateTitle = (text: string) => {
    setForm((currentState: PlaceForm) => {
      return { ...currentState, title: text };
    });
  };

  const onSelectImage = (image: string | null) => {
    if (!image) return;
    setForm((currentState: PlaceForm) => {
      return { ...currentState, imageUri: image };
    });
  };

  const onSubmit = () => {};

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
