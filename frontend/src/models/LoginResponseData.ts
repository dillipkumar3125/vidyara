export default interface LoginResponseData {
  accessToken: string;
  expiresIn?: number; // seconds until token expiry (optional from backend)
}
