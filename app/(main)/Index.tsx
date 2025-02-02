import { Stack } from 'expo-router';

import { Container } from '~/components/Container';

export default function MainView() {
  return (
    <Container>
      <Stack.Screen options={{ title: 'Saved Places' }} />
    </Container>
  );
}
