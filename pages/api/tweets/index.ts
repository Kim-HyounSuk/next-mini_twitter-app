import { db, withApiSession, withHandler } from "@lib/server";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const user = req.session.user;

  if (req.method === "GET") {
    const tweets = await db.tweet.findMany({
      include: {
        likes: {
          where: {
            userId: user?.id,
          },
          select: {
            userId: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    if (!tweets) {
      return res.status(404).json({
        isSuccess: false,
        statusCode: 404,
        data: null,
        message: "조회되는 트윗이 없습니다.",
      });
    }

    return res.status(200).json({
      isSuccess: true,
      statusCode: 200,
      data: {
        user: user?.id,
        tweets,
      },
      mesage: "성공적으로 모든 트윗이 조회되었습니다.",
    });
  }

  if (req.method === "POST") {
    const { text } = req.body;
    const user = req.session.user;

    const createdTweet = await db.tweet.create({
      data: {
        text,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
      include: {
        user: true,
      },
    });

    console.log(user);

    if (!createdTweet) {
      return res.status(404).json({
        isSuccess: false,
        statusCode: 404,
        data: null,
        message: "트윗 업로드 중 오류가 발생했습니다.",
      });
    }

    return res.status(200).json({
      isSuccess: true,
      statusCode: 200,
      data: createdTweet,
      message: "정상적으로 트윗이 업로드되었습니다.",
    });
  }
};

export default withApiSession(
  withHandler({
    methods: ["POST", "GET"],
    handler,
    isPrivate: false,
  })
);
