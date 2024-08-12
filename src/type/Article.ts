interface Category {
    id: number;
    name: string;
}

interface Article {
    id: number;
    title: string;
    content: string;
    postDate: string;
    category: Category;
    source: string;
    tags: string[];
    imgUrls: string[];
}

export default Article;