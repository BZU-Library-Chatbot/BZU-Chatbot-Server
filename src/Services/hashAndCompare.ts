import bcrypt from "bcrypt";

export const hash = (plainText: string, saltRound: string | number = process.env.SALTROUND || 10): string => {
  const hashResult: string = bcrypt.hashSync(plainText, typeof saltRound === 'string' ? parseInt(saltRound) : saltRound);
  return hashResult;
};

export const compare = (password: string, hashValue: string): boolean => {
  const hashResult: boolean = bcrypt.compareSync(password, hashValue);
  return hashResult;
};
