export enum RegisterStatus {
    Success,
    ServerError,
    AlreadyCompleted,
    Loading,
    InvalidEmail,
    OverSignupLimit,
    Ready
}

export interface FormResponse {
    state: RegisterStatus;
    email?: string;
}