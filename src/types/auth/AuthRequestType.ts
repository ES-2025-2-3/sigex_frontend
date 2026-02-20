export interface AuthRequest {
  name?: string;
  email: string;
  password?: string;
  type?: 'ADMIN' | 'SERVIDOR_TECNICO_ADMINISTRATIVO' | 'USUARIO';
}