// 유효성 검증 로직 파일.
// 유틸리티 또는 헬퍼 파일은 프로젝트의 루트 디렉터리 내부에 위치한 src 폴더 아래에 생성하는 것이 일반적
// 문자열이 비어있는지 확인합니다.
export const isEmpty = (value: string): boolean => !value.trim();

// 이메일 주소가 유효한 형식인지 확인합니다.
export const isValidEmail = (email: string): boolean =>
    /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);

// 두 비밀번호가 일치하는지 확인합니다.
export const isPasswordMatch = (password: string, confirmPassword: string): boolean =>
    password === confirmPassword;

// 비밀번호의 유효성을 검사합니다.
export const validatePassword = (password: string, confirmPassword: string) => {
    const length = password.length >= 8;
    const hasNumberAndLetter = /[0-9]/.test(password) && /[a-zA-Z]/.test(password);
    const passwordsMatch = password === confirmPassword;

    return { length, hasNumberAndLetter, passwordsMatch };
};