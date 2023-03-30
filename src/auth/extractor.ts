import { jwtSecret } from 'src/utils/constants';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

interface DecodedUser {
  id: string;
  email: string;
}

function decodeUser(req: Request): DecodedUser {
  // You may need to adjust this depending on how your user object is stored and encoded
  const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;
  if (!token) throw new Error('No token found');
  const decodedUser = jwt.verify(token, jwtSecret) as DecodedUser;
  return decodedUser;
}

export default decodeUser;
