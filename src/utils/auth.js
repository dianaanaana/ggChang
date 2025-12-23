// src/utils/auth.js
const API_ENDPOINT = 'https://ttxklr1893.execute-api.ap-southeast-1.amazonaws.com/prod';

export const exchangeCodeForTokens = async (code) => {
  try {
    console.log('正在交換 token，code:', code);

    // 根據當前網址決定 redirect_uri
    const redirectUri = window.location.origin.includes('localhost')
      ? 'http://localhost:5173/'
      : 'https://d14a9z9u68wcij.cloudfront.net/';

    const response = await fetch(`${API_ENDPOINT}/exchangeCode`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        redirect_uri: redirectUri
      })
    });

    console.log('Token 回應狀態:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Token exchange 失敗:', errorText);
      throw new Error(`Token exchange failed: ${errorText}`);
    }

    const tokens = await response.json();
    console.log('成功取得 token');

    // 儲存 tokens
    localStorage.setItem('accessToken', tokens.access_token);
    localStorage.setItem('idToken', tokens.id_token);
    if (tokens.refresh_token) {
      localStorage.setItem('refreshToken', tokens.refresh_token);
    }
    localStorage.setItem('isLoggedIn', 'true');

    return tokens;
  } catch (error) {
    console.error('Token exchange error:', error);
    throw error;
  }
};

export const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};

export const getIdToken = () => {
  return localStorage.getItem('idToken');
};

export const isAuthenticated = () => {
  return localStorage.getItem('isLoggedIn') === 'true' && !!getIdToken();
};

export const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('idToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('isLoggedIn');
};

export const getAuthHeaders = () => {
  const idToken = getIdToken();
  return idToken ? {
    'Authorization': `Bearer ${idToken}`
  } : {};
};