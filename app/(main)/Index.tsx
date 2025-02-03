import { Stack } from 'expo-router';

import { Container } from '~/components/common/Container';

export default function MainView() {
  return (
    <Container>
      <Stack.Screen options={{ title: 'Saved Places' }} />
    </Container>
  );
}
