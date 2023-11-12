import { NextApiRequest, NextApiResponse } from "next";
import { db, withApiSession, withHandler } from "@lib/server";
import bcrypt from "bcrypt";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, password } = req.body;
  console.log(email, password);

  if (!email || !password) {
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
  if (!user) {
    return res.status(403).json({
      isSuccess: false,
      statusCode: 403,
      data: null,
      message: "올바른 이메일과 비밀번호를 입력해주세요.",
    });
  }

  const pass = await bcrypt.compare(password, user.password);
  console.log(pass);
  if (!pass) {
    return res.status(403).json({
      isSuccess: false,
      statusCode: 403,
      data: null,
      message: "올바른 이메일과 비밀번호를 입력해주세요.",
    });
  }

  req.session.user = {
    id: user.id,
  };
  await req.session.save();

  return res.status(200).json({
    isSuccess: true,
    statusCode: 200,
    data: user.id,
    message: "성공적으로 로그인 되었습니다.",
  });
};

export default withApiSession(
  withHandler({ methods: ["POST"], handler, isPrivate: false })
);
