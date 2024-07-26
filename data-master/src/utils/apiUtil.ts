import axios, { AxiosRequestConfig, AxiosResponse, CancelTokenSource } from 'axios';

let pendingRequests: CancelTokenSource[] = [];

const addRequest = (source: CancelTokenSource) => {
  pendingRequests.push(source);
};

const removeRequest = (source: CancelTokenSource) => {
  pendingRequests = pendingRequests.filter(item => item !== source);
};

const cancelAllRequests = () => {
  pendingRequests.forEach(source => source.cancel('Operation canceled due to new request.'));
  pendingRequests = [];
};

const havePendingRequests = () => {
    return pendingRequests.length !== 0;
}

async function authenticatedFetch(
    url: string,
    options: AxiosRequestConfig = {},
): Promise<AxiosResponse | undefined> {

        const source = axios.CancelToken.source();
        addRequest(source);

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
                cancelToken: source.token,
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
    };


    export { authenticatedFetch, havePendingRequests, cancelAllRequests };
