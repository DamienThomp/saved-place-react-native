import { Ionicons } from '@expo/vector-icons';
import { Redirect } from 'expo-router';
import { useTheme } from 'expo-router/react-navigation';
import { StyleSheet, Text, View } from 'react-native';

import { Container } from '~/components/common/Container';
import Loading from '~/components/common/Loading';
import { Button } from '~/components/ui/Button';
import { tokens } from '~/constants/theme';

import { useProfileViewModel } from './useProfileViewModel';

export default function ProfileScreen() {
  const theme = useTheme();
  const { status, state, actions } = useProfileViewModel();

  if (status.isPending) {
    return <Loading />;
  }

  if (status.shouldRedirect) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <Container>
      <View style={styles.innerContainer}>
        <Ionicons name="person-circle" size={80} color={theme.colors.primary} />
        {state.session?.user.email && (
          <Text style={[styles.email, { color: theme.colors.text }]}>
            {state.session.user.email}
          </Text>
        )}
        <Button
          style={[{ backgroundColor: theme.colors.primary }]}
          title="Sign Out"
          onPress={actions.handleSignOut}
        />
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  email: {
    ...tokens.typography.title,
  },
  innerContainer: {
    alignItems: 'center',
    gap: tokens.spacing.xl,
  },
});
