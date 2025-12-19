import jwt from "jsonwebtoken";
import prisma from 'prisma';

export const authMiddleWare = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res
      .status(401)
      .json({ status: "Failure", message: "User not authenticated1" });
  }
  const access_token = authHeader.split(" ")[1];
  const secret_key = process.env.SUPER_SECRET_KEY;
  jwt.verify(access_token, secret_key, async (err, decode) => {
    if (err) {
      return res
        .status(401)
        .json({ status: "Failure", message: "User not authenticated" });
    }
    const userId = decode.id;
    if (!userId) {
      return res
        .status(401)
        .json({
          status: "Failure",
          message: "could not parse Id from token",
          data: userId,
        });
    }
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      omit: {
        passwordHash: true,
      },
    });
    if (!user) {
      return res
        .status(404)
        .json({ status: "Failure", message: "User not found" });
    }
    req.user = user;
    next();
  });
};
