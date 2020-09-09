export class User {
  id?: string;
  email: string;
  password?: string;
  name: string;
  phone: string;

  public static getUserFromResponse(res: any) {
    return {
      id: res.id,
      email: res.email,
      name: res.name,
      phone: res.phone,
    };
  }
}
