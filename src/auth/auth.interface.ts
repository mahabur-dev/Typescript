import { Document, Types } from 'mongoose';

export interface IUser  {
  email: string;
  password: string;
  name: string;
  createdAt: Date;
}

export interface IUserDocument extends IUser, Document {
  _id: Types.ObjectId;
}

export interface IAuthResponse {
  user: IUserDocument;
  token: string;
}

export interface IRegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}