import {
    SignInButton,
    UseSignInData,
} from '@farcaster/auth-kit';

const MaybeDisplaySignInButton = ({ jwt, isAuthenticated, onFarcasterSignIn }: { jwt: string, isAuthenticated: boolean, onFarcasterSignIn: (data: UseSignInData) => void }) => {
    if (jwt || isAuthenticated) {
        return null;
    }

    return (
        <div>
            <SignInButton onSuccess={onFarcasterSignIn} />
        </div>
    );
};

export default MaybeDisplaySignInButton;
