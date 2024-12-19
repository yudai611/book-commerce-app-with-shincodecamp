import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";
// {params}: {params: { userId: string}}
//購入履歴検索API
export async function GET(request: Request, { params }: { params: Promise<{ userId: string }>}) {//パラメーターのuserIdを取得する

    const userId = (await params).userId
    try {
        const purchases = await prisma.purchase.findMany({
            where: {
                userId: userId// userId を条件に購入データを検索
            },
        });

        console.log(purchases);
        // 取得した購入データを JSON 形式で返す
        return NextResponse.json(purchases);
    } catch {
        // エラーが発生した場合、そのエラーメッセージを JSON 形式で返す
        return NextResponse.json({message: 'データの取得に失敗しました'});
    }
}
