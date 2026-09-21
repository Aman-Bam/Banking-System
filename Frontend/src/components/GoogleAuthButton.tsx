import { GoogleLogin } from '@react-oauth/google';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';

export default function GoogleAuthButton() {
    const setAuth = useAuthStore((state) => state.login);
    const navigate = useNavigate();

    const handleSuccess = async (credentialResponse: any) => {
        try {
            const res = await api.post('/auth/google', {
                idToken: credentialResponse.credential,
            });

            if (res.data.user && res.data.token) {
                const { user, token } = res.data;
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                setAuth({
                    id: user._id || user.id,
                    name: user.name || user.fullName,
                    email: user.email,
                    role: 'user'
                }, token);
                navigate('/dashboard');
            }
        } catch (err: any) {
            console.error('Google Sign-In failed:', err);
            alert(err.response?.data?.message || 'Google Login Failed. Please try again.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center my-4">
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={() => console.log('Google Login Failed')}
                useOneTap
                theme="outline"
                size="large"
                shape="rectangular"
            />
        </div>
    );
}

