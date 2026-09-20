import { GoogleLogin } from '@react-oauth/google';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function GoogleAuthButton() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSuccess = async (credentialResponse: any) => {
        try {
            const res = await api.post('/auth/google', {
                idToken: credentialResponse.credential,
            });

            if (res.data.user) {
                login(res.data.user);
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

