import axios from 'axios';
import { BACKEND_URL } from '../utils/config';
import qs from 'qs';

export const register = async ({ name, email, password }) => {
  try {
    const data = qs.stringify({
      name,
      email,
      password,
      confirmPassword: password,
    });

    const response = await axios.post(
      `${BACKEND_URL}/auth/register`,
      data, 
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded', 
        },
      }
    );

    return response;
  } catch (error) {
    const errorMessage = error.response
      ? error.response.data.message
      : error.message;
    throw new Error(errorMessage);
  }
};

export const login = async ({ email, password }) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/auth/login`,
      {
        email,
        password,
      },
      {
        headers: {
          'Content-Type': 'application/json', // Correct content type for JSON
        },
      }
    );
    return response;
  } catch (error) {
    const errorMessage = error.response
      ? error.response.data.message
      : error.message;
    throw new Error(errorMessage);
  }
};
