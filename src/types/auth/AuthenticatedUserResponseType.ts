export interface AuthenticatedUserResponse {
  id: string;
  email: string;
  name: string;
  type: 'ADMIN' | 'SERVIDOR_TECNICO_ADMINISTRATIVO' | 'USUARIO';
  token: string;
}