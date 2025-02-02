import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';

import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import FormInputContainer from '~/components/FormInputContainer';
import Loading from '~/components/Loading';
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
      <View style={styles.content}>
        <Stack.Screen options={{ title: 'Sign In' }} />
        <FormInputContainer title="Email">
          <TextInput
            value={email}
            style={styles.textInput}
            onChangeText={onEmailUpdate}
            placeholder="email@something.com"
            keyboardType="email-address"
          />
        </FormInputContainer>
        <FormInputContainer title="Password">
          <TextInput
            value={password}
            style={styles.textInput}
            onChangeText={onPasswordUpdate}
            secureTextEntry
          />
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
  textInput: {
    backgroundColor: '#fff',
    borderColor: '#d3d3d3',
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    fontSize: 20,
  },
  secondaryAction: {
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    color: Colors.light.tint,
    padding: 8,
  },
});
