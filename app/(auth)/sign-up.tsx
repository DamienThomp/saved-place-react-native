import Button from '@/src/components/Button';
import Colors from '@/src/constants/Colors';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import {
	Alert,
	StyleSheet,
	Text,
	TextInput,
	View,
	ActivityIndicator,
} from 'react-native';
import { dbClient } from '@/src/lib/db';

const SignUpScreen = () => {
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

	const onSignUp = async () => {
		setIsLoading(true);

		const { error } = await dbClient.auth.signUp({
			email,
			password,
		});

		if (error) {
			Alert.alert('Error in Sign Up', `${error.message}`);
		}

		setIsLoading(false);
	};

	const redirectToSignIn = () => {
		router.back();
	};

	if (loading) {
		return (
			<View style={{ flex: 1, justifyContent: 'center' }}>
				<ActivityIndicator />
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<Stack.Screen options={{ title: 'Sign Up' }} />
			<View style={styles.inputContainer}>
				<Text style={styles.label}>Email</Text>
				<TextInput
					value={email}
					style={styles.textInput}
					onChangeText={onEmailUpdate}
					keyboardType="email-address"
					placeholder="email@something.com"
					autoCapitalize="none"
				/>
			</View>
			<View style={styles.inputContainer}>
				<Text style={styles.label}>Password</Text>
				<TextInput
					value={password}
					style={styles.textInput}
					onChangeText={onPasswordUpdate}
					secureTextEntry={true}
				/>
			</View>
			<View>
				<Button text="Sign Up" onPress={onSignUp} disabled={loading} />
				<Text onPress={redirectToSignIn} style={styles.secondaryAction}>
					Sign In
				</Text>
			</View>
		</View>
	);
};

export default SignUpScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		padding: 18,
		gap: 18,
	},
	inputContainer: {
		gap: 8,
	},
	label: {
		color: '#4a4a4a',
		fontWeight: '500',
		fontSize: 18,
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
