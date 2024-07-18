import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

async function authenticatedFetch(url: string, options: AxiosRequestConfig = {}): Promise<AxiosResponse> {
  const token = localStorage.getItem('accessToken');
  if (token) {
    options.headers = {
      ...options.headers,
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
    options = {
        ...options,
        withCredentials: false,
    }
  }

  try {
    const response = await axios({ url, ...options });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      try {
        const refreshTokenResponse = await axios.post(`${process.env.REACT_APP_BACKEND_REFRESH_TOKEN_URL}`, {}, {
            withCredentials: true
        });

        const { accessToken } = refreshTokenResponse.data;
        localStorage.setItem('accessToken', accessToken);

        const retryResponse = await axios({
          url,
          ...options,
          headers: {
            ...options.headers,
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        return retryResponse;
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError);
        throw refreshError;
      }
    } else {
      console.error('Fetch error:', error);
      throw error;
    }
  }
}

export default authenticatedFetch;
