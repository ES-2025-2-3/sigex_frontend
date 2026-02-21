import { UserType } from "../../domain/enums/UserType";

export interface User {
  id: string;
  name: string;
  email: string;
  affiliation?: string;   
  type: UserType;     
}