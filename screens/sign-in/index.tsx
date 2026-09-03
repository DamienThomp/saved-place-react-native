import AuthForm from '~/components/auth/AuthForm';
import { Container } from '~/components/common/Container';
import Loading from '~/components/common/Loading';

import { useSignInViewModel } from './useSignInViewModel';

export default function SignInScreen() {
  const { status, actions } = useSignInViewModel();

  if (status.isPending) {
    return <Loading />;
  }

  return (
    <Container>
      <AuthForm
        actionLabel="Sign In"
        secondaryLabel="Create Account"
        primaryAction={actions.signInUser}
        secondaryAction={actions.goToSignUp}
      />
    </Container>
  );
}
