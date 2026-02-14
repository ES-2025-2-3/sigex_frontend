import { Institute } from "../src/types/institute/InstituteType";
import { mockStaff } from "./user";

/**
 * Representação da Unidade Única do Sistema.
 * O 'manager' agora aponta para o perfil FUNCIONARIO (Nicole/José Farias),
 * que é quem opera o dia a dia do Centro.
 */
export const mockInstitute: Institute = {
  id: "unidade-principal",
  name: "Centro de Extensão José Farias",
  acronym: "PROPEX",
  contactPhone: "(83) 2101-1123",
  manager: {
    id: Number(mockStaff.id) || 0, 
    name: mockStaff.name || "",
    email: mockStaff.email || "",
    type: mockStaff.type as any, 
    registrationNumber: mockStaff.registrationNumber
  },
  rooms: [],
  equipments: []
};