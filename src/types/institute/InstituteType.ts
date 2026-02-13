import { User } from "../user/UserType";

export interface Institute {
  id: string;
  name: string;
  acronym: string;
  contactPhone: string;
  manager: User;
  rooms?: any[]; 
  equipments?: any[];
}