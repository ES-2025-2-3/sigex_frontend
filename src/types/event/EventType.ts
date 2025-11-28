export interface Evento {
  id: number;
  titulo: string;
  data: string;
  imagemUrl: string;
  local: string;
  tags?: string[];
}