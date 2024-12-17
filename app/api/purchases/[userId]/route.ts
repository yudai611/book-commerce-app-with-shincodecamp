import prisma from "@/app/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
// {params}: {params: { userId: string}}
//購入履歴検索API
export async function GET(request: NextRequest) {
    const userId = request.nextUrl.searchParams.get('userId');

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
