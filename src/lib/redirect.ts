import { User } from "../features/auth/types/auth.types";


export const getRedirectPath = (user: User) => {
  switch (user.role) {
    case "ADMIN":
      return "/admin/dashboard";

    case "COMPANY":
      return "/dashboard";

    default:
      return "/dashboard";
  }
};