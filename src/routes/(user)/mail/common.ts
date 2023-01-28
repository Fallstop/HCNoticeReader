export enum RegisterStatus {
    Success,
    ServerError,
    AlreadyCompleted,
    Loading,
    InvalidEmail,
    Ready
}

export interface FormResponse {
    state: RegisterStatus;
    email?: string;
}