export async function fetchBalance() {
  const res = await fetch("/api/balance", {
    headers: {
      Accept: "application/json",
    },
    credentials: "include",
  });

  // Handle Unauthorized
  if (res.status === 401) {
    sessionStorage.clear();
    localStorage.clear();

    window.location.href = "/login";
    return;
  }

  if (!res.ok) {
    throw new Error("Failed to fetch balance");
  }

  return res.json();
}