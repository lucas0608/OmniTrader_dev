import { AxiosError } from 'axios';

export const handleApiError = (error: unknown) => {
  if (error instanceof AxiosError) {
    const errorMessage = error.response?.data?.msg || error.message;
    console.error('API Error:', {
      status: error.response?.status,
      message: errorMessage,
      data: error.response?.data
    });

    // Handle specific error cases
    if (error.response?.status === 401) {
      throw new Error('Authentication failed. Please check your API keys.');
    }
    if (error.response?.status === 403) {
      throw new Error('Access forbidden. Please check your API permissions.');
    }
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    
    throw new Error(errorMessage || 'An error occurred while fetching data');
  }
  
  console.error('Unexpected error:', error);
  throw new Error('An unexpected error occurred');
};