import { UserType } from "../../domain/enums/UserType";

export interface User {
  id: number;
  name: string;
  email: string;
  affiliation?: string;   
  type: UserType;     
}