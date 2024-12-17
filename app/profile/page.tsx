import { nextAuthOptions } from "@/app/lib/next-auth/options";
import { BookType, Purchase, User } from "@/app/types/types";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { getDetailBook } from "../lib/microcms/client";
import PurchaseDetailBook from "../components/PurchaseDetailBook";

export default async function ProfilePage() {

    const session = await getServerSession(nextAuthOptions);//ユーザーの認証情報を取得する
    const user = session?.user as User;//ユーザー情報を取得する

    let purchasesDetailBooks: BookType[] = [];//記事の詳細を格納する変数

  if(user) {
    //購入履歴を検索するAPIにリクエストを送る
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/purchases/${user.id}`);

    //返ってきたデータをjson形式に変換
    const purchasesData = await response.json();
    
    //取得した購入履歴を使用し、記事の詳細を取得する
    purchasesDetailBooks = await Promise.all(//複数回、非同期処理でgetDetailBook関数呼ぶためPromise.allを使用する
      purchasesData.map(async (purchase: Purchase) => {
        return await getDetailBook(purchase.bookId);//購入履歴に保存されているbookIdを引数に設定し、getDetailBook(指定した記事の詳細を取得する)関数を呼ぶ
      })
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">プロフィール</h1>

      <div className="bg-white shadow-md rounded p-4">
        <div className="flex items-center">
          <Image
            priority
            src={user.image || "/default_icon.png"}
            alt="user profile_icon"
            width={60}
            height={60}
            className="rounded-t-md"
          />
          <h2 className="text-lg ml-4 font-semibold">お名前：{user.name}</h2>
        </div>
      </div>

      <span className="font-medium text-lg mb-4 mt-4 block">購入した記事</span>
      <div className="flex items-center gap-6">
        {purchasesDetailBooks.map((purchaseDetailBook: BookType) => (
          <PurchaseDetailBook key={purchaseDetailBook.id} purchaseDetailBook={purchaseDetailBook} />
        ))}
      </div>
    </div>
  );
}