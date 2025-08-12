// 代码生成时间: 2025-08-13 02:48:42
import { Typegoose, prop } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

// Define a data model class for a User
class UserModel extends TimeStamps {
  @prop({ required: true })
  public username!: string;

  @prop({ required: true })
  public email!: string;

  // Add more fields as necessary for your application
  @prop({ select: false })
  public password!: string;
}

// Create a Typegoose model from the class
const UserSchema = new Typegoose().model<UserModel>('User', UserModel);

export default UserSchema;

// Use this model in your service to interact with the database
// Note: This is a basic model and should be extended with validation, methods, etc.
// as needed for your specific application requirements.