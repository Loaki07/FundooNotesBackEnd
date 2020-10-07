import { UserModel } from '../models/userSchema.js';
const { register, logIn, getAllUsers, getProtectedUser } = new UserModel();

class UserService {
  registerNewUser = async (data) => {
    try {
      return await register(data);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  logInByUserName = async (data) => {
    try {
      const foundUser = await logIn(data);
      return foundUser;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  findAllUsers = async () => {
    return await getAllUsers();
  };

  findProtectedUser = async(id) => {
    return await getProtectedUser(id);
  }
}

export default UserService;
