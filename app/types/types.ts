type BookType = {
    id: string;
    title: string;
    content: string;
    price: number;
    thumbnail: { url: string };
    create_at: string;
    updated_at: string;
}

type User = {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
}

type Purchase = {
    id: string;
    userid: string;
    bookId: string;
    createdAt: string;
    user: User;
}

export type { BookType, User, Purchase };