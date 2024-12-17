import Image from "next/image";
import Link from "next/link";
import React from "react";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "../lib/next-auth/options";
import { User } from "../types/types";

const Header = async() => {

  //セッションのユーザー情報を取得する
  // const { data: session } = useSession();
  // const user = session?.user;
  const session = await getServerSession(nextAuthOptions);
  const user = session?.user as User;

  return (
    <header className="bg-slate-600 text-gray-100 shadow-lg">
      <nav className="flex items-center justify-between p-4">
        <Link href={"/"} className="text-xl font-bold">
          Book Commerce
        </Link>
        <div className="flex items-center gap-1">
          <Link
            href="/"
            className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
          >
            ホーム
          </Link>
          <Link
            href={user ? "/profile" : "/api/auth/signin"}//nextauthがデフォルトで用意してくれているサインイン用のAPIを使用する。
            className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
          >
            {user ? "プロフィール" : "ログイン"}
          </Link>
          {/*ログイン状態の場合はログアウトボタンを表示させる*/}
          {user ?
            <Link
              href={"/api/auth/signout?callbackUrl=/"}//nextauthがデフォルトで用意してくれているサインアウト用のAPIを使用する。

              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
              ログアウト
            </Link> : ""}
          <Link href={`/profile`}>
            <Image
              width={50}
              height={50}
              alt="profile_icon"
              src={user?.image || "/default_icon.png"}
            />
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
