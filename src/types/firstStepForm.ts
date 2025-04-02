export interface firstStepForm {
    firstName: string;
    middleName: string | null;
    lastName: string;
    contact: string;
    purpose: string;
    priority: boolean;
    age: number;
    birthday: string | null;
    sex: 'male' | 'female';
    passport_number: string | null;
    email: string | null;
    address: string | null;
}
