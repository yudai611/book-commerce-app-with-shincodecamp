"use client";

import Image from "next/image";
import { BookType, User } from "../types/types";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type BookProps = {
    book: BookType;
    isPurchased: boolean;
}

// eslint-disable-next-line react/display-name
const Book = ({ book, isPurchased }: BookProps) => {
    //モーダルの表示・非表示
    const [showModal, setShowModal] = useState(false);
    //セッションのユーザーを取得する
    const {data: session} = useSession();
    const user = session?.user as User;

    const router = useRouter();

    //Stripeで決済する。
    const startCheckout = async () => {
        try {
            //決済用APIに電子記事のタイトルや値段の情報をリクエストし、そのレスポンスを返す。
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/checkout`,//APIのURLを環境変数から取得
                {
                    method: "POST",//HTTPメソッドをPOSTに設定
                    headers: { "Content-Type": "application/json" },//送信するデータや返されるデータの形式を指定する。ここではjson形式を指定している。
                    body: JSON.stringify({//JSON.stringify()はJavaScriptのオブジェクトをJSON文字列に変換するメソッド
                        title: book.title,//電子記事のタイトル
                        price: book.price,//電子記事の値段
                        userId: user?.id,
                        bookId: book.id,
                    }),
                }
            );
            console.log(response);
            
            //レスポンスが返ってきた後、JSON形式でレスポンスデータを取得
            const responseData = await response.json();

            //レスポンスデータが存在する場合、checkout_urlにリダイレクト
            if(responseData) {
                router.push(responseData.checkout_url);//check_urlに遷移
            }
        } catch (err) {
            console.error("Error in startCheckout:", err);//エラー発生時にエラーメッセージを表示
        }
    }

    console.log(isPurchased)

    //モーダルを非表示にするクリックインベント
    const handleCancel = () => {
        setShowModal(false);
    }

    //モーダルを表示するクリックイベント
    const handlePurchaseClick = () => {
        if(isPurchased) {
            alert("すでに購入済みです。");
        } else {
            setShowModal(true);
        }
    }

    //購入ボタンクリック時、ログインしているどうかで処理を変える
    const handlePurchaseConfirm = () => {
        if(!user) {
            setShowModal(false);
            //ログインページへリダイレクト
            router.push("/login");
        } else {
            //Stripeで決済する
            startCheckout();
        }
    }

    console.log(book.id);

    return (
        <>
            {/* アニメーションスタイル */}
            <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .modal {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>

            <div className="flex flex-col items-center m-4">
                <a
                    onClick={handlePurchaseClick}
                    className="cursor-pointer shadow-2xl duration-300 hover:translate-y-1 hover:shadow-none">
                    <Image
                        priority
                        src={book.thumbnail.url}
                        alt={book.title}
                        width={450}
                        height={350}
                        className="rounded-t-md"
                    />
                    <div className="px-4 py-4 bg-slate-100 rounded-b-md">
                        <h2 className="text-lg font-semibold">{book.title}</h2>
                        <p className="mt-2 text-lg text-slate-600">この本は○○...</p>
                        <p className="mt-2 text-md text-slate-700">値段：{book.price}</p>
                    </div>
                </a>
                {showModal && (
                    <div className="absolute top-0 left-0 right-0 bottom-0 bg-slate-900 bg-opacity-50 flex justify-center items-center modal">
                        <div className="bg-white p-8 rounded-lg">
                            <h3 className="text-xl mb-4">本を購入しますか？</h3>
                            <button
                                onClick={handlePurchaseConfirm}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4">
                                購入する
                            </button>
                            <button 
                                onClick={handleCancel}
                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                                キャンセル
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Book;
