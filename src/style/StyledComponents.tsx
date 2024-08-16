// src/components/StyledComponents.tsx
import { styled } from '@mui/system';
import {
    Grid,
    Box,
    TextField,
    Typography,
    ListItem,
    Avatar,
    Button,
    Card,
    Divider,
    Chip,
    CircularProgress,
    Link as MuiLink,
    CardMedia, IconButton, CardMediaProps, Paper
} from '@mui/material';

// 공통 Box 스타일
export const CommonBox = styled(Box)({
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    marginTop: 16,
    borderRadius: 8
});

// 공통 TextField 스타일
export const CommonTextField = styled(TextField)(({ theme }) => ({
    "& .MuiOutlinedInput-root": {
        height: '55px',
        width: '500px',
        '& fieldset': {
            borderColor: 'white !important',
        },
        '&:hover fieldset': {
            borderColor: 'white !important',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'white !important',
        },
        '&.Mui-disabled fieldset': {
            borderColor: 'white !important',
        },
        '& input': {
            color: 'white !important',
            backgroundColor: 'transparent',
        },
        '&.Mui-disabled input': {
            color: 'white !important',
            backgroundColor: 'transparent',
        },
        '& input:-webkit-autofill': {
            WebkitTextFillColor: 'white !important',
            WebkitBoxShadow: '0 0 0px 1000px #152238 inset'
        }
    },
    "& .MuiInputLabel-root": {
        lineHeight: 1.5,
        color: 'white',
    }
}));

// Comments 컴포넌트에 사용되는 Box 스타일
export const CommentsContainer = styled(Box)({
    marginTop: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#1f2a3c',
    color: 'white',
    border: '1px solid white',
});

export const CommentHeader = styled(Typography)({
    color: 'white',
});

export const CommentListItem = styled(ListItem)({
    marginBottom: 16,
    alignItems: 'flex-start',
});

export const CommentAvatar = styled(Avatar)({
    width: 56,
    height: 56,
    marginRight: 16,
});

export const CommentContentBox = styled(Box)({
    flex: 1,
});

export const CommentMetaBox = styled(Box)({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
});

export const CommentNickname = styled(Typography)({
    fontWeight: 'bold',
    color: 'white',
});

export const CommentTimestamp = styled(Typography)({
    marginLeft: 16,
    color: 'gray',
});

export const CommentDivider = styled(Divider)({
    borderColor: 'white',
});

export const CommentTextField = styled(CommonTextField)({
    marginTop: 16,
});

export const SubmitButton = styled(Button)({
    marginTop: 8,
});

// 공통 Card 스타일
export const CommonCard = styled(Card)({
    marginBottom: '1.2rem',
    backgroundColor: '#152238',
    color: 'white',
});

// 공통 로딩 박스 스타일
export const LoadingBox = styled(Box)({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
});

// 공통 Grid 스타일
export const CommonGridContainer = styled(Grid)({
    flexGrow: 1,
    padding: '3rem',
    backgroundImage: 'url(/Background.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
});

// 공통 Divider 스타일
export const CommonDivider = styled(Divider)({
    borderColor: 'white',
});

// 공통 Chip 스타일
export const CommonChip = styled(Chip)({
    backgroundColor: '#3f51b5',
    color: 'white',
    fontSize: '0.875rem',
});

// 공통 CircularProgress 스타일
export const CommonCircularProgress = styled(CircularProgress)({
    color: 'inherit',
});

// StyledBox는 CommonBox와 같은 스타일을 사용할 수 있습니다.
export const StyledBox = styled(CommonBox)({
    justifyContent: 'center',
});

// 공통 Box 스타일 (Padding과 Background Color)
export const BackgroundBox = styled(Box)({
    padding: '2rem',
    backgroundColor: '#1f2a3c',
});

// 공통 Typography 스타일 (Section Title)
export const SectionTitle = styled(Typography)({
    color: 'white',
    textAlign: 'center',
    marginBottom: '1rem',
});

// 공통 CardMedia 스타일 (이미지 처리)
export const CommonCardMedia = styled(CardMedia)({
    marginBottom: '2rem',
    paddingBottom: 0,
    objectFit: 'cover',
    height: '140px',
});

// CommonTypography 에 스타일 적용 및 Typography 확장
export const CommonLinkTypography = styled(Typography)({
    color: 'white',
    marginLeft: 'auto',
    textDecoration: 'none',
    '&:hover': {
        textDecoration: 'underline',
    }
});

// 공통 버튼 스타일
export const CommonButton = styled(Button)({
    marginTop: '16px',
    width: '500px',
    height: '50px',
});

// 공통 컨테이너 스타일
export const AuthContainer = styled(Grid)({
    height: '100vh',
});

// 공통 IconButton 스타일
export const CommonIconButton = styled(IconButton)({
    color: 'white',
});

// 공통 좌측 섹션 스타일
export const AuthLeftSection = styled(Grid)({
    backgroundColor: '#152238',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    padding: '24px',
});

// 공통 버튼 스타일
export const AuthButton = styled(Button)({
    marginTop: '16px',
    width: '500px',
    height: '50px',
});

// 공통 링크 스타일
export const AuthLink = styled(MuiLink)({
    marginTop: '8px',
    textDecoration: 'underline',
    '&:hover': {
        textDecoration: 'none',
    },
});

// 공통 Typography 스타일
export const CommonTypography = styled(Typography)({
    color: 'white',
});

// 공통 우측 섹션 스타일
export const AuthRightSection = styled(Grid)({
    background: 'url(login-background.png) no-repeat center center',
    backgroundSize: 'cover',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '24px',
});

// 공통 제목 스타일
export const AuthTitle = styled(Typography)({
    marginBottom: '16px',
    color: 'white',
    '& span': {
        color: '#0026ED',
    },
});

// ArticleDetail 관련 스타일
export const DetailPaper = styled(Paper)({
    padding: '20px',
    color: 'white',
    backgroundColor: '#1f2a3c',
});

export const DetailImage = styled('img')({
    width: '100%',
    height: 'auto',
    maxHeight: '200rem',
    marginBottom: '1rem',
});

// ArticlesView 관련 스타일
export const CategoryTagBox = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: "0.5rem",
});

export const TagsContainer = styled(Box)({
    display: 'flex',
    flexWrap: 'wrap',
    maxHeight: '4.5rem',
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: '0.5rem',
});

export const ArticleCard = styled(Card)({
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#152238',
    color: 'white',
});