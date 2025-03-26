export interface LoginInfo {
  accessToken: string;
  role: string;
  counterId: string;
  windowTitle: string;
}

export function getLoginInfo(): LoginInfo {
  const accessToken = localStorage.getItem("access_token") || "NA";
  const role = localStorage.getItem("role") || "NA";
  const counterId = localStorage.getItem("counter_id") || "NA";
  const windowTitle = localStorage.getItem("name") || "NA";

  return { accessToken, role, counterId, windowTitle };
}

export function setLoginInfo({
  accessToken,
  role,
  counterId,
  windowTitle,
}: LoginInfo) {
  localStorage.setItem("access_token", accessToken);
  localStorage.setItem("role", role);
  localStorage.setItem("counter_id", counterId);
  localStorage.setItem("name", windowTitle);
}

export function clearLoginInfo() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("role");
  localStorage.removeItem("counter_id");
  localStorage.removeItem("name");
}