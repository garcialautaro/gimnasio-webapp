'use client';

import { useEffect } from 'react';
import { getStoredToken, setAuthToken } from '../lib/api';

export function ClientInit() {
  useEffect(() => {
    const token = getStoredToken();
    setAuthToken(token);
  }, []);

  return null;
}
