export interface Evento {
  id: number;
  titulo: string;
  data: string;
  descricao: string;
  imagemUrl: string;
  local: string;
  tags?: string[];
}