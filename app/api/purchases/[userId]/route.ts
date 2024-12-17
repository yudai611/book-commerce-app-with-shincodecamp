import prisma from "@/app/lib/prisma";
import { Purchase } from "@/app/types/types";
import { NextResponse } from "next/server";
import { NextApiRequest } from 'next';
// {params}: {params: { userId: string}}
//購入履歴検索API
export async function GET(request: NextApiRequest, response: Response ) {
    const { userId } = request.query;

    try {
        const purchases = await prisma.purchase.findMany({
            where: {
                userId: userId as string// userId を条件に購入データを検索
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
