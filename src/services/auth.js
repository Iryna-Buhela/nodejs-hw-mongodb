import bcrypt from 'bcrypt';
import crypto from 'node:crypto';
import createHttpError from 'http-errors';
import { FIFTEEN_MINUTES, THIRTY_DAYS } from '../constants/index.js';
import { UserCollection } from '../db/models/user.js';
import { SessionsCollection } from '../db/models/session.js';

export async function registerUser(payload) {
  const user = await UserCollection.findOne({ email: payload.email });
  if (user) throw createHttpError(409, 'Email in use');

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  return await UserCollection.create({
    ...payload,
    password: encryptedPassword,
  });
}

export async function loginUser(payload) {
  const user = await UserCollection.findOne({ email: payload.email });
  if (!user) {
    throw createHttpError(401, 'Email or password is incorrect');
  }
  const isEqual = await bcrypt.compare(payload.password, user.password);

  if (!isEqual) {
    throw createHttpError(401, 'Email or password is incorrect');
  }
  await SessionsCollection.deleteOne({ userId: user._id });

  return SessionsCollection.create({
    userId: user._id,
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  });
}

const createSession = () => {
  return {
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  };
};

export async function refreshUsersSession({ sessionId, refreshToken }) {
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isExpiredToken = new Date() > new Date(session.refreshTokenValidUntil);

  if (isExpiredToken) {
    throw createHttpError(401, 'Refresh token expired');
  }

  const newSession = createSession();

  await SessionsCollection.deleteOne({ _id: sessionId, refreshToken });

  return await SessionsCollection.create({
    userId: session.userId,
    ...newSession,
  });
}

export async function logoutUser(sessionId) {
  await SessionsCollection.deleteOne({ _id: sessionId });
}
