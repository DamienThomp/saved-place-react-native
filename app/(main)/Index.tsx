import { Stack } from 'expo-router';

import Map from '~/components/Map';
import { Container } from '~/components/common/Container';

export default function MainView() {
  return (
    <Container>
      <Stack.Screen options={{ title: 'Saved Places' }} />
    </Container>
  );
}
