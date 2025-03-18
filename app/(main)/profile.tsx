import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { Container } from '~/components/common/Container';
import { Button } from '~/components/ui/Button';
import { dbClient } from '~/lib/db';
import { useAuthentication } from '~/providers/AuthProvider';

export default function ProfileScreen() {
  const [loading, setIsLoading] = useState(false);
  const { session } = useAuthentication();
  const theme = useTheme();

  const handleSignout = async () => {
    setIsLoading(true);

    const { error } = await dbClient.auth.signOut();

    if (error) {
      Alert.alert('Sign Out Error', `Unable to sign you out: ${error}`);
    }

    setIsLoading(false);
  };

  if (loading) {
    return;
  }
  return (
    <Container>
      <View style={styles.innerContainer}>
        <Ionicons name="person-circle" size={80} color={theme.colors.primary} />
        {session?.user.email && <Text style={styles.email}>{session.user.email}</Text>}
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
