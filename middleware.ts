import { NextResponse, type NextRequest } from "next/server";

export const config = {
  matcher: ["/admin/:path*"],
};

function unauthorized(message = "Authentication required.") {
  return new NextResponse(message, {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Dejabooom Admin", charset="UTF-8"',
      "Cache-Control": "no-store",
    },
  });
}

async function digest(value: string) {
  const data = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", data);

  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function safeEqual(provided: string, expected: string) {
  return (await digest(provided)) === (await digest(expected));
}

export async function middleware(request: NextRequest) {
  const expectedUsername = process.env.ADMIN_USERNAME;
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedUsername || !expectedPassword) {
    return new NextResponse("Admin authentication is not configured.", {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    });
  }

  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Basic ")) {
    return unauthorized();
  }

  let decoded = "";

  try {
    decoded = atob(authorization.slice("Basic ".length));
  } catch {
    return unauthorized();
  }

  const separatorIndex = decoded.indexOf(":");

  if (separatorIndex === -1) {
    return unauthorized();
  }

  const username = decoded.slice(0, separatorIndex);
  const password = decoded.slice(separatorIndex + 1);
  const usernameMatches = await safeEqual(username, expectedUsername);
  const passwordMatches = await safeEqual(password, expectedPassword);

  if (!usernameMatches || !passwordMatches) {
    return unauthorized("Invalid credentials.");
  }

  return NextResponse.next();
}
