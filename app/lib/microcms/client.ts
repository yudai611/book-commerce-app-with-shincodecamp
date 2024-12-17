import { createClient } from 'microcms-js-sdk';
import { BookType } from '@/app/types/types';

//microcmsのデータを取得
export const client = createClient({
  serviceDomain: process.env.NEXT_PUBLIC_SERVICE_DOMAIN!,  // service-domain は https://XXXX.microcms.io の XXXX 部分
  apiKey: process.env.NEXT_PUBLIC_API_KEY!,
});

//micromcsで作成した電子記事のリストデータを取得する
export const getAllBooks = async () => {
    const allBooks = await client.getList<BookType>({
        endpoint: "bookcommerce",
    });

    return allBooks;
};

//購入した記事のデータを取得する
export const getDetailBook = async (contentId: string) => {
  const detailBook = await client.getListDetail<BookType>({
    endpoint: "bookcommerce",
    contentId
  });

  return detailBook;
}



