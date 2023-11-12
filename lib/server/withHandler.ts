import { NextApiRequest, NextApiResponse } from "next";

type method = "GET" | "POST" | "DELETE";

interface ConfigType {
  methods: method[];
  handler: (req: NextApiRequest, res: NextApiResponse) => void;
  isPrivate?: boolean;
}

export default function withHandler({
  methods,
  isPrivate = true,
  handler,
}: ConfigType) {
  return async function (
    req: NextApiRequest,
    res: NextApiResponse
  ): Promise<any> {
    if (req.method && !methods.includes(req.method as any)) {
      return res.status(405).json({
        isSuccess: false,
        statusCode: 405,
        data: null,
        message: "잘못된 요청입니다.",
      });
    }
    if (isPrivate && !req.session.user) {
      return res.status(401).json({
        isSuccess: false,
        statusCode: 401,
        data: null,
        message: "잘못된 접근입니다.",
      });
    }
    try {
      await handler(req, res);
    } catch (error) {
      return res.status(500).json({
        isSuccess: false,
        statusCode: 500,
        data: null,
        message: { error },
      });
    }
  };
}
