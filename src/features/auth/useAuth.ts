import { useDispatch, useSelector } from 'react-redux';
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  fetchProfileStart,
  fetchProfileSuccess,
  fetchProfileFailure,
} from './authSlice';
import { login, LoginCredentials, fetchUserProfile } from '../../api/authApi';
import { RootState } from '../../store/store';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, token, user, loading, error } = useSelector(
    (state: RootState) => state.auth,
  );

  console.log('useAuth - Current state:', {
    isAuthenticated,
    hasToken: !!token,
    hasUser: !!user,
    userName: user?.firstName,
  });

  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      dispatch(loginStart());
      const response = await login(credentials);
      console.log('Login response:', response);
      dispatch(loginSuccess(response));
      return response;
    } catch (error) {
      dispatch(
        loginFailure(error instanceof Error ? error.message : 'Login failed'),
      );
      throw error;
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const fetchProfile = async () => {
    if (!token) {
      console.log('No token available for profile fetch');
      return;
    }

    try {
      dispatch(fetchProfileStart());
      const profileData = await fetchUserProfile(token);
      dispatch(fetchProfileSuccess(profileData));
    } catch (error) {
      dispatch(
        fetchProfileFailure(
          error instanceof Error ? error.message : 'Failed to fetch profile',
        ),
      );
    }
  };

  return {
    isAuthenticated,
    token,
    user,
    authLoading: loading,
    error,
    login: handleLogin,
    logout: handleLogout,
    fetchProfile,
  };
};
