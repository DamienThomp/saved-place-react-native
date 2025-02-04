import { useState } from 'react';
import { KeyboardAvoidingView, StyleSheet } from 'react-native';

import { Container } from '~/components/common/Container';
import FormInputContainer from '~/components/form/FormInputContainer';
import TextInputField from '~/components/form/TextInputField';
import { Button } from '~/components/ui/Button';

type PlaceForm = {
  title?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
};

export default function AddPlace() {
  const [placeForm, setForm] = useState<PlaceForm>({});

  const onUpdateTitle = (text: string) => {
    setForm((currentState: PlaceForm) => {
      return { ...currentState, title: text };
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
