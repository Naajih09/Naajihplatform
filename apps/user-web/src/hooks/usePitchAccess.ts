import { useEffect, useState } from 'react';
import { getApiBaseUrl } from '@/lib/api-base';

type PitchAccessState = {
  loading: boolean;
  activePitches: number;
  pitchLimit: number | null;
  remainingPitchSlots: number | null;
  hasPremium: boolean;
  canCreatePitch: boolean;
};

const initialState: PitchAccessState = {
  loading: true,
  activePitches: 0,
  pitchLimit: 1,
  remainingPitchSlots: 1,
  hasPremium: false,
  canCreatePitch: true,
};

export const usePitchAccess = () => {
  const [state, setState] = useState<PitchAccessState>(initialState);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const authToken =
      localStorage.getItem('accessToken') ||
      localStorage.getItem('access_token') ||
      '';
    const apiBase = getApiBaseUrl();

    if (!user?.id || !authToken) {
      setState((prev) => ({ ...prev, loading: false }));
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch(`${apiBase}/users/stats/${user.id}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        if (!res.ok) {
          throw new Error('Failed to load pitch access.');
        }
        const data = await res.json();
        if (cancelled) return;

        setState({
          loading: false,
          activePitches: Number(data?.activePitches) || 0,
          pitchLimit:
            data?.pitchLimit === null || data?.pitchLimit === undefined
              ? null
              : Number(data.pitchLimit),
          remainingPitchSlots:
            data?.remainingPitchSlots === null || data?.remainingPitchSlots === undefined
              ? null
              : Number(data.remainingPitchSlots),
          hasPremium: Boolean(data?.hasPremium),
          canCreatePitch: Boolean(data?.canCreatePitch),
        });
      } catch {
        if (cancelled) return;
        setState((prev) => ({ ...prev, loading: false }));
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
};
