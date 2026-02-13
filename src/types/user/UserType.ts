import { UserType } from "../../domain/enums/UserType";

export interface User {
  id: number;
  name: string;
  email: string;
  registrationNumber?: string; 
  affiliation?: string;   
  type: UserType;     
}