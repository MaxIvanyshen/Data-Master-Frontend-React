async function authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = localStorage.getItem('accessToken');
  if (token) {
    if (!options.headers) {
      options.headers = {
          'Authorization': `Bearer ${token}`,
      };
    }
  }
  console.log(options)

  try {
    const response = await fetch(url, options);

    if (response.status === 401) {
      const refreshTokenResponse = await fetch(`${process.env.REACT_APP_BACKEND_REFRESH_TOKEN_URL}`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!refreshTokenResponse.ok) {
        throw new Error('Refresh token failed');
      }

      const { accessToken } = await refreshTokenResponse.json();
      localStorage.setItem('accessToken', accessToken);

      const retryResponse = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      return retryResponse;
    }

    return response;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

export default authenticatedFetch;
