import Stripe from "stripe";
import { NextResponse } from "next/server";

//インストールしたstripeを初期化する
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

//requestオブジェクトは、クライアントからサーバーに送信されたHTTPリクエストの情報を保持する
//responseオブジェクトは、サーバーがクライアントに返すレスポンスの情報を保持する。
export async function POST(request: Request, response: Response) {
    
    // リクエストからtitle、price、bookId、userIdを取得
    const { title, price, bookId, userId } = await request.json();

    try {
        /*Checkout セッションは、ラインアイテム、注文金額と通貨、および受け付け可能な
        支払い方法など、Stripe がオンラインで提供する決済ページで顧客に表示される
        内容を制御する*/
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],// 支払い方法としてカードを指定
            //購入履歴保存時に必要なbookId、userIdなどのメタデータを定義する。
            metadata: {
                bookId: bookId
            },
            client_reference_id: userId,
            //販売する商品を定義する(価格や在庫状況など)
            line_items: [
                {
                    price_data: {
                        currency: "jpy",//通貨は日本円
                        product_data: {
                            name: title,//商品名
                        },
                        unit_amount: price,//価格
                    },
                    quantity: 1,//商品の数量
                },
            ],
            //モードを選択する。一回限りの支払いの場合はpayment、サブスクリプションで継続支払いを開始する場合はsubscripsion
            mode: "payment",
            //成功時のURLとキャンセル時のURLを指定する
            success_url: "http://localhost:3000/book/checkout-success?session_id={CHECKOUT_SESSION_ID}",
            cancel_url: "http://localhost:3000",
        });

        {/*
            sessionオブジェクトにはStripeの決済セッションの情報が含まれている。その中のurlプロパティが
            決済ページへのURL。NextResponse.json()を使って、クライアントにJSON形式でcheckout_urlを返している。
            クライアント側はこのURLを受け取って、ユーザーを決済ページにリダイレクトする。
        */}
        return NextResponse.json({ checkout_url: session.url });

    } catch(err: any) {
        return NextResponse.json({ message: err.message });//エラーメッセージを返す
    }
}