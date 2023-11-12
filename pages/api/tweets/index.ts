import { db, withHandler } from "@lib/server";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const tweets = await db.tweet.findMany({
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
      data: tweets,
      mesage: "성공적으로 모든 트윗이 조회되었습니다.",
    });
  }
};

export default withHandler({
  methods: ["POST", "GET"],
  handler,
  isPrivate: false,
});
