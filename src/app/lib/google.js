import { getSecret, getEncryptedSetting, setEncryptedSetting } from "./secrets";

// Google OAuth connections, all through the same Cloud project / Client ID:
//   main     — Search Console + Analytics (GA4)
//   business — Google Business Profile, connected separately because the
//              profile is often owned by a different Google account.
// Each stores its refresh token encrypted in ai_settings and exchanges it for
// short-lived access tokens on demand. Both use the same redirect URI.
export const GOOGLE_CONNECTIONS = {
  main: {
    tokenSetting: "GOOGLE_OAUTH_TOKENS",
    label: "Google",
    scopes: [
      "openid",
      "email",
      "https://www.googleapis.com/auth/webmasters.readonly",
      "https://www.googleapis.com/auth/analytics.readonly",
    ],
  },
  business: {
    tokenSetting: "GOOGLE_BUSINESS_OAUTH_TOKENS",
    label: "Google Business Profile",
    scopes: ["openid", "email", "https://www.googleapis.com/auth/business.manage"],
  },
};

export function isConnectionKind(kind) {
  return Object.hasOwn(GOOGLE_CONNECTIONS, kind);
}

function connectionFor(kind) {
  if (!isConnectionKind(kind)) throw new Error(`Unknown Google connection: ${kind}`);
  return GOOGLE_CONNECTIONS[kind];
}

export async function buildGoogleAuthUrl(state, kind = "main") {
  const { scopes } = connectionFor(kind);
  const [clientId, redirectUri] = await Promise.all([
    getSecret("GOOGLE_CLIENT_ID"),
    getSecret("GOOGLE_REDIRECT_URI"),
  ]);
  if (!clientId || !redirectUri) {
    throw new Error("Set Google Client ID and Redirect URI first.");
  }
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: scopes.join(" "),
    access_type: "offline",
    // Forces Google to return a refresh_token even on re-connect, and lets the
    // admin pick which Google account to use.
    prompt: "consent select_account",
    state,
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

async function tokenRequest(body) {
  const [clientId, clientSecret] = await Promise.all([
    getSecret("GOOGLE_CLIENT_ID"),
    getSecret("GOOGLE_CLIENT_SECRET"),
  ]);
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, ...body }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error_description || data.error || `Token request failed (${res.status})`);
  }
  return data;
}

// Exchanges the callback ?code= for tokens and stores the refresh token.
export async function connectGoogleWithCode(code, kind = "main") {
  const { tokenSetting, scopes } = connectionFor(kind);
  const redirectUri = await getSecret("GOOGLE_REDIRECT_URI");
  const tokens = await tokenRequest({
    code,
    grant_type: "authorization_code",
    redirect_uri: redirectUri,
  });

  // Google's consent screen lets users untick individual permissions. Refuse
  // to save a connection that can't actually call the APIs it exists for.
  const granted = new Set(String(tokens.scope || "").split(" "));
  const missing = scopes.filter((s) => s.startsWith("https://") && !granted.has(s));
  if (missing.length > 0) {
    throw new Error(
      `Permission not granted: ${missing.map((s) => s.split("/").pop()).join(", ")}. Click Connect again and tick every checkbox on Google's permission screen.`
    );
  }

  const existing = await getEncryptedSetting(tokenSetting);
  const refreshToken = tokens.refresh_token || existing?.refresh_token;
  if (!refreshToken) {
    throw new Error("Google did not return a refresh token. Remove app access and reconnect.");
  }

  let email = null;
  try {
    const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    if (res.ok) email = (await res.json()).email || null;
  } catch {
    // email is display-only
  }

  await setEncryptedSetting(tokenSetting, {
    refresh_token: refreshToken,
    scope: tokens.scope,
    email,
    connected_at: new Date().toISOString(),
  });
  return { email, scope: tokens.scope };
}

export async function disconnectGoogle(kind = "main") {
  await setEncryptedSetting(connectionFor(kind).tokenSetting, null);
}

// Safe to send to the browser: never includes tokens.
export async function getGoogleConnection(kind = "main") {
  const stored = await getEncryptedSetting(connectionFor(kind).tokenSetting);
  if (!stored?.refresh_token) return { connected: false };
  return {
    connected: true,
    email: stored.email,
    scope: stored.scope,
    connectedAt: stored.connected_at,
  };
}

export async function getGoogleAccessToken(kind = "main") {
  const { tokenSetting, label } = connectionFor(kind);
  const stored = await getEncryptedSetting(tokenSetting);
  if (!stored?.refresh_token) {
    throw new Error(`${label} is not connected. Click "Connect" in its Settings section first.`);
  }
  const tokens = await tokenRequest({
    refresh_token: stored.refresh_token,
    grant_type: "refresh_token",
  });
  return tokens.access_token;
}
