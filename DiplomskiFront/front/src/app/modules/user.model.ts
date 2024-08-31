export interface User {
    id: number;
    email:string;
    password: string;
    role: UserRole;
    name: string;
    surname: string;
  }
  export enum UserRole {
    ADMINISTRATOR = 0,
    USER = 1,
    SUBSCRIBED_USER = 2
  }
  

  