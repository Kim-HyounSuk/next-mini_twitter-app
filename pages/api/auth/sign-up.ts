import { NextApiRequest, NextApiResponse } from "next";
import { db, withHandler } from "@lib/server";
import bcrypt from "bcrypt";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    return res.status(403).json({
      isSuccess: false,
      statusCode: 403,
      data: null,
      message: "입력 정보가 정확하지 않습니다.",
    });
  }

  const user = await db.user.findUnique({
    where: {
      email: email,
    },
  });
  if (user) {
    return res.status(403).json({
      isSuccess: false,
      statusCode: 403,
      data: null,
      message: "이미 존재 하는 이메일 입니다.",
    });
  }

  const createdUser = await db.user.create({
    data: {
      email,
      name,
      password: await bcrypt.hash(password, 10),
    },
  });

  return res.status(200).json({
    isSuccess: true,
    statusCode: 200,
    data: createdUser,
    message: "정상적으로 회원가입 되었습니다.",
  });
};

export default withHandler({ methods: ["POST"], handler, isPrivate: false });
