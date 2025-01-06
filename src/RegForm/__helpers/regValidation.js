import {FormVars} from "./formVars";
import {keys} from "../api/keys";

export class RegValidation {
    constructor() {
        this.errors = {};

        this.phoneLength = null;
        this.passwordLength = null;
        // this.atLeastOneLatinLetterRegExp = /[a-zA-Z]+/;
        // this.atLeastOneDigit = /\d+/;
        // this.specialCharRegExp = /[*+\-[\]()!@#$%^&=_'"{}<>/?<>~`±;.:©®¯]+/;
        // this.atLeastOneLowerCaseLetterRegExp = /[a-z]+/;
        // this.atLeastOneUpperCaseLetter = /[A-Z]+/;
    }


    //отримання довжини номеру телефону та пароля згідно встановленої країни
    setCountryAndType(country, type) {
        const inputAttributes = FormVars.getFormVars(country, type);
        if (type === 'tel') {
            this.phoneLength = inputAttributes.minLength
        } else {
            this.passwordLength = inputAttributes.minLength;
        }
    }

    //валідація пароля
    validatePassword(country = keys.BRAND, password) {
        let passwordErrors;
        switch (country) {
            case 'IN':
                passwordErrors = {
                    minLength: true,
                    // lowerCase: true,
                    // upperCase: true,
                    // digit: true,
                };
                break;
            case 'TMS':
                passwordErrors = {
                    minLength: true,
                    lowerCase: true,
                    upperCase: true,
                    digit: true,
                };
                break;
            case 'DS':
                passwordErrors = {
                    minLength: true,
                    specialChars: true,
                    lowerCase: true,
                    upperCase: true,
                    digit: true,
                };
                break;
            case "BR":
                passwordErrors = {
                    minLength: true,
                    latin: true,
                    digit: true,
                };
                break;
            case "BD":
                passwordErrors = {
                    minLength: true,
                };
                break;
            case "TZ":
                passwordErrors = {
                    minLength: true,
                    // specialChars: true,
                    // upperCase: true,
                    // digit: true,
                };
                break;
            case "GH":
                passwordErrors = {
                    minLength: true,
                    specialChars: true,
                    digit: true,
                };
                break;
            default:
                passwordErrors = {
                    minLength: true,
                    latin: true,
                    digit: true,
                };
        }

        const preparedPassword = this.deleteWhitespaces(password);

        if (this.isCorrectPasswordLength(preparedPassword, this.passwordLength)) {
            passwordErrors.minLength = false;
        }

        // if (this.isOneLatinLetter(preparedPassword) && passwordErrors.latin) {
        //     passwordErrors.latin = false;
        // }

        // if (this.isOneDigit(preparedPassword) && passwordErrors.digit) {
        //     passwordErrors.digit = false;
        // }

        // if (this.isOneLowerCaseLetter(preparedPassword) && passwordErrors.lowerCase) {
        //     passwordErrors.lowerCase = false;
        // }

        // if (this.isOneUpperCaseLetter(preparedPassword) && passwordErrors.upperCase) {
        //     passwordErrors.upperCase = false;
        // }

        // if (this.isSpecialChar(preparedPassword) && passwordErrors.specialChars) {
        //     passwordErrors.specialChars = false;
        // }

        return passwordErrors;
    }

    //видалити пробіли
    deleteWhitespaces(value) {
        return value.toString().replace(/\s+/g, "");
    }

    //перевірка на відповідність мінімальній довжині
    isCorrectPasswordLength(password, minLength) {
        return password.length >= minLength;
    }

    //перевірка на наявність латинських літер
    // isOneLatinLetter(password) {
    //     return this.atLeastOneLatinLetterRegExp.test(password);
    // }

    // //перевірка на наявність цифр
    // isOneDigit(password) {
    //     return this.atLeastOneDigit.test(password);
    // }

    // //превірка на наявність малої літери
    // isOneLowerCaseLetter(password) {
    //     return this.atLeastOneLowerCaseLetterRegExp.test(password);
    // }

    // //превірка на наявність великої літери
    // isOneUpperCaseLetter(password) {
    //     return this.atLeastOneUpperCaseLetter.test(password);
    // }

    // //превірка на наявність спеціального символу
    // isSpecialChar(password) {
    //     return this.specialCharRegExp.test(password);
    // }

    //превірка чи немає в паролі помилок
    isNoPasswordErrors(errors) {
        if (errors) {
            if (!errors.minLength) {
                let errorNumberArr = Object.values(errors).filter((error) => error === false);

                if (errorNumberArr.length >= 1) {
                    return true;
                }
            }
            return Object.values(errors).every((error) => error === false);
        }

        return true;
    }

    //валідація форми
    validateForm(values) {
        const errors = {
            phone: false,
            password: false,
            general: false
        };
        // Валідація пароля
        if (!values.passwd) {
            errors.password = false;
        } else {
            errors.password = this.validatePassword(values.country, values.passwd);

            let noPasswordErrors = this.isNoPasswordErrors(errors.password);

            errors.password = !noPasswordErrors;
        }

        //валідація номеру телефону
        if (!values.telno) {
            errors.phone = false;
        } else if (values.telno.includes('_')) {
            errors.phone = true;
        }

        this.errors = errors;

        return Object.values(errors).every(value => value === false);
    }
}

export const validation = new RegValidation();
