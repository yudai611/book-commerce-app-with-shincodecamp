import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

//購入履歴の保存
export async function POST(request: Request, response: Response) {

    const {sessionId} = await request.json();//リクエスト時にわたってきたsessionIdを格納する

    try {
        //チェックアウト時にセッションに登録したメタデータなど取得し、格納する
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        //console.log(session.metadata?.bookId);
        //同じuserIdとbookIdが存在するかどうか
        const existingPurchase = await prisma.purchase.findFirst({
            where: {
                userId: session.client_reference_id!,
                bookId: session.metadata?.bookId!,
            }
        });

        //購入履歴のデータを作成する
        //取得してきたuserIdとbookIdが存在しない場合
        if(!existingPurchase) {
            const purchase = await prisma.purchase.create({
                data: {
                    userId: session.client_reference_id!,//購入したユーザーのid
                    bookId: session.metadata?.bookId!,//購入された本のid
                }
            });

            return NextResponse.json({ purchase });
        }else {
            return NextResponse.json({ message: "すでに購入済みです。"});
        }
    } catch (err: any) {
        return NextResponse.json({ message: err.message});
    }
}