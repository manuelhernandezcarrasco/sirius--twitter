export class UserDTO {
  
  constructor(user: UserDTO) {
    this.id = user.id;
    this.name = user.name;
    this.createdAt = user.createdAt;
    this.private = user.private;
    this.profilePicture = user.profilePicture;
  }

  id: string;
  name: string | null;
  private: boolean;
  createdAt: Date;
  profilePicture?: string | null;
}

export class ExtendedUserDTO extends UserDTO {

  constructor(user: ExtendedUserDTO) {
    super(user)
    this.email = user.email;
    this.name = user.name;
    this.password = user.password;
  }

  email!: string;
  username!: string;
  password!: string;
}
