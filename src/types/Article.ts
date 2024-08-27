export interface Category {
    id: number;
    name: string;
}

export interface Tag {
    id: number;
    name: string;
}

export interface Article {
    id: number;
    title: string;
    content: string;
    postDate: string;
    category: Category;
    source: string;
    tags: Tag[];
    imgUrls: string[];
}

export interface CommentType {
    id: number;
    content: string;
    articleId: number;
    memberId: number;
    memberNickname: string;
    profileImageURL: string;
    likeCount: number;
    timestamp: string;
    relativeTime: string;
    liked: boolean; // liked 속성 추가
    replies?: ReplyType[];
    replyCount: number;
    isDeleted: boolean;
}

export interface ReplyType {
    id: number;
    content: string;
    memberId: number;
    memberNickname: string;
    profileImageURL: string;
    likeCount: number;
    parentCommentId: number;
    relativeTime: string;
    liked: boolean;
    timestamp: string;
}