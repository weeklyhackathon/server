import {
    SignInButton,
    UseSignInData,
} from '@farcaster/auth-kit';

const MaybeDisplaySignInButton = ({ jwt, isAuthenticated, callback }: { jwt: string, isAuthenticated: boolean, callback: (data: UseSignInData) => void }) => {
    if (jwt || isAuthenticated) {
        return null;
    }
    return <SignInButton onSuccess={callback} />;
};

export default MaybeDisplaySignInButton;
