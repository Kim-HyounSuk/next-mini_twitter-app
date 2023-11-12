import { IronSessionOptions } from "iron-session";
import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      id: string;
    };
  }
}

const cookieConfig: IronSessionOptions = {
  cookieName: "mini-twitter",
  password: "VERYYLONGPASSWORDS1ab1323898esda345q6781!!",
};

export function withApiSession(fn: any) {
  return withIronSessionApiRoute(fn, cookieConfig);
}

export function withSsrSession(handler: any) {
  return withIronSessionSsr(handler, cookieConfig);
}
