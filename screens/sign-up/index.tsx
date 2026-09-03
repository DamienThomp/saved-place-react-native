import AuthForm from '~/components/auth/AuthForm';
import { Container } from '~/components/common/Container';
import Loading from '~/components/common/Loading';

import { useSignUpViewModel } from './useSignUpViewModel';

export default function SignUpScreen() {
  const { status, actions } = useSignUpViewModel();

  if (status.isPending) {
    return <Loading />;
  }

  return (
    <Container>
      <AuthForm
        actionLabel="Sign Up"
        secondaryLabel="Sign In"
        primaryAction={actions.signUpUser}
        secondaryAction={actions.goToSignIn}
      />
    </Container>
  );
}
