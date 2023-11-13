import { db, withApiSession, withHandler } from "@lib/server";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const tweet = req.body;
  const user = req.session.user;

  const isLiked = await db.like.findFirst({
    where: {
      userId: user?.id,
      tweetId: tweet?.id,
    },
  });
  if (!isLiked) {
    const createdLike = await db.like.create({
      data: {
        user: {
          connect: {
            id: user?.id,
          },
        },
        tweet: {
          connect: {
            id: tweet?.id,
          },
        },
      },
    });

    return res.status(200).json({
      isSuccess: true,
      statusCode: 200,
      data: Boolean(createdLike),
      message: "성공적으로 좋아요를 갱신했습니다.",
    });
  } else {
    await db.like.delete({
      where: {
        id: isLiked.id,
      },
    });

    return res.status(200).json({
      isSuccess: true,
      statusCode: 200,
      data: false,
      message: "성공적으로 좋아요를 취소했습니다.",
    });
  }
};

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
    isPrivate: false,
  })
);
