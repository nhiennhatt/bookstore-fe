"use client";

import { useEffect } from 'react';

export default function SetConnectionClient() {
  useEffect(() => {
    // fire-and-forget request to set connection cookie server-side
    fetch('/api/connection', { method: 'GET', cache: 'no-store', credentials: 'include' }).catch(() => {});
  }, []);

  return null;
}
