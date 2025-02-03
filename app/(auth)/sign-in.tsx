import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { Button } from '~/components/ui/Button';
import { Container } from '~/components/common/Container';
import Loading from '~/components/common/Loading';
import FormInputContainer from '~/components/form/FormInputContainer';
import TextInputField from '~/components/form/TextInputField';
import Colors from '~/constants/Colors';
import { dbClient } from '~/lib/db';

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setIsLoading] = useState(false);

  const onEmailUpdate = (text: string) => {
    setEmail(text);
  };

  const onPasswordUpdate = (text: string) => {
    setPassword(text);
  };

  const onSignIn = async () => {
    setIsLoading(true);

    const { error } = await dbClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert('Error in Sign Up', `${error.message}`);
    }

    setIsLoading(false);
  };

  const redirectToSignUp = () => {
    router.push('./sign-up');
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Container>
      <Stack.Screen options={{ title: 'Sign In' }} />
      <View style={styles.content}>
        <FormInputContainer title="Email">
          <TextInputField
            value={email}
            onChangeText={onEmailUpdate}
            placeholder="email@something.com"
            keyboardType="email-address"
          />
        </FormInputContainer>
        <FormInputContainer title="Password">
          <TextInputField value={password} onChangeText={onPasswordUpdate} secureTextEntry />
        </FormInputContainer>
        <View>
          <Button title="Sign In" onPress={onSignIn} disabled={loading} />
          <Text onPress={redirectToSignUp} style={styles.secondaryAction}>
            Create Account
          </Text>
        </View>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 18,
    gap: 18,
  },
  secondaryAction: {
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    color: Colors.light.tint,
    padding: 8,
  },
});
