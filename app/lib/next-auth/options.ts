import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../prisma";

export const nextAuthOptions: NextAuthOptions = {
    debug: false,
    //google,Xなどでのログインを追加する場合は以下に設定する。
    providers: [
        //githubアカウントでのログイン設定
        GitHubProvider({
            clientId: process.env.GITHUB_ID!,//IDを設定する
            clientSecret: process.env.GITHUB_SECRET!,//シークレットキーを設定する
        }),
    ],

    //データベースとの連携。PrismaAdapterをインストールし、引数にインスタンス化したprismaを渡す。
    adapter: PrismaAdapter(prisma),

    //ログインしているかどうかの判断をするためセッションを返す設定をする。
    callbacks: {
        session: ({session, user}) => {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: user.id,
                },
            };
        },
    },
    secret: process.env.NEXTAUTH_SECRET,

}