import {
    SignInButton,
    UseSignInData,
} from '@farcaster/auth-kit';
import { useLogin as usePrivyLogin, User } from '@privy-io/react-auth';

export interface PrivyOnCompleteParams {
    user: User;
    isNewUser: boolean;
    wasAlreadyAuthenticated: boolean;
}

const MaybeDisplaySignInButton = ({ jwt, isAuthenticated, onFarcasterSignIn, onPrivySignIn, onPrivyError }: { jwt: string, isAuthenticated: boolean, onFarcasterSignIn: (data: UseSignInData) => void, onPrivySignIn: (data: PrivyOnCompleteParams) => void, onPrivyError: (error: any) => void }) => {
    if (jwt || isAuthenticated) {
        return null;
    }

    // onComplete can fire when page is loaded.
    const { login: privyLogin } = usePrivyLogin({
        onComplete: onPrivySignIn,
        onError: onPrivyError,
    });

    return (
        <div>
            <SignInButton onSuccess={onFarcasterSignIn} />

            <button onClick={privyLogin}>
                Login with Wallet
            </button>
        </div>
    );
};

export default MaybeDisplaySignInButton;
