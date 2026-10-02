import type { FollowerStory } from '../types';

const BACKEND_URL = 'http://127.0.0.1:8000';

export async function checkBackendHealth(): Promise<{ isOnline: boolean; mongodb: string }> {
  try {
    const res = await fetch(`${BACKEND_URL}/health`, { method: 'GET' });
    if (res.ok) {
      const data = await res.json();
      return { isOnline: true, mongodb: data.mongodb };
    }
  } catch (_e) {
    // Backend is offline
  }
  return { isOnline: false, mongodb: 'offline' };
}

export async function fetchServicesStatus() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/settings/status`);
    if (res.ok) return await res.json();
  } catch (_e) {}
  return null;
}

export async function updateApiKeysOnServer(keys: {
  geminiApiKey?: string;
  openaiApiKey?: string;
  mongodbUri?: string;
  youtubeApiKey?: string;
}) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/settings/update-keys`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(keys),
    });
    if (res.ok) return await res.json();
  } catch (_e) {}
  return { success: false, message: 'Could not connect to FastAPI server' };
}

export async function runLiveBackendPipeline(story: FollowerStory): Promise<FollowerStory | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/pipeline/full-run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(story),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (_e) {
    console.warn('Backend offline, using client-side AI engine');
  }
  return null;
}
