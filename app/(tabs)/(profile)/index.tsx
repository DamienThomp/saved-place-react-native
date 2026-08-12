import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'expo-router/react-navigation';
import { Redirect } from 'expo-router';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { useSignOut } from '~/api/auth';
import { Container } from '~/components/common/Container';
import Loading from '~/components/common/Loading';
import { Button } from '~/components/ui/Button';
import { useAuthentication } from '~/providers/AuthProvider';

export default function ProfileScreen() {
  const { session } = useAuthentication();
  const theme = useTheme();
  const { mutate: signOut, isPending } = useSignOut();

  const handleSignout = () => {
    signOut(undefined, {
      onError: (error) => {
        Alert.alert('Sign Out Error', `Unable to sign you out: ${error.message}`);
      },
    });
  };

  if (isPending) {
    return <Loading />;
  }

  if (!session) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <Container>
      <View style={styles.innerContainer}>
        <Ionicons name="person-circle" size={80} color={theme.colors.primary} />
        {session?.user.email && (
          <Text style={[styles.email, { color: theme.colors.text }]}>{session.user.email}</Text>
        )}
        <Button
          style={[{ backgroundColor: theme.colors.primary }]}
          title="Sign Out"
          onPress={handleSignout}
        />
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  email: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  innerContainer: {
    alignItems: 'center',
    gap: 18,
  },
});
