'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

//購入ありがとうございますページ
const PurchaseSuccess = () => {
  //bookIdを保存するための変数を用意する
  const [bookUrl, setBookUrl] = useState(null);

  //sessionId(購入完了ページURLの最後の部分)を取得する
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");


  useEffect(() => {
    const fetchData = async () => {
      if(sessionId) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/checkout/success`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              //セッションIDを使用して、そのセッションに登録されているユーザーIDや購入された本のIDを購入履歴に保存するために設定。
              body: JSON.stringify({ sessionId }),
            }
          );
          
          const data = await res.json();//返ってきた購入履歴のデータをjson形式に変換し格納
          console.log(data);
          setBookUrl(data.purchase.bookId);//BookUrlをbookIdに更新する
        } catch(err) {
          console.error("Error fetching data: ", err);
        }
      }
    };

    fetchData();
  },[]);

  return (
    <div className="flex items-center justify-center mt-20">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
          購入ありがとうございます！
        </h1>
        <p className="text-center text-gray-600">
          ご購入いただいた内容の詳細は、登録されたメールアドレスに送信されます。
        </p>
        <div className="mt-6 text-center">
          <Link
            href={`/book/${bookUrl}`}
            className="text-indigo-600 hover:text-indigo-800 transition duration-300"
          >
            購入した記事を読む
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PurchaseSuccess;
