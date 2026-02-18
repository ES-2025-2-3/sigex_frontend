import { Institute } from "../src/types/institute/InstituteType";
import { mockStaff } from "./user";

/**
 * Representação da Unidade Única do Sistema.
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
  },
  rooms: [],
  equipments: []
};