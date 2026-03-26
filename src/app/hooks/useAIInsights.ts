'use client';

import { useState } from 'react';

export type AiInsight = {
    summary: string,
    mood: {
      emotion: string,
      label: string,
    },
    themes: string[]
}

export function useAiInsight() {
  const [result, setResult] = useState<AiInsight | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function analyze(content: string) {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch('/api/ai/insight', {
        method: 'POST',
        body: JSON.stringify({ content }),
      });

      if (!res.ok) throw new Error('Failed to analyze');

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setResult(null);
    setError(null);
  }

  return {
    result,
    loading,
    error,
    analyze,
    reset,
  };
}
