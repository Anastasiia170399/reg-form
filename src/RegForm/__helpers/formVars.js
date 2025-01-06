import INFlag from "../images/IN-flag.png";

export class FormVars {
    static getFormVars(country, type) {

        switch (country) {
            case "IN":
            case "TMS":
            case "DS":
            case "GLS":
                if (type === "tel") {
                    return {
                        type: "tel",
                        id: "phone",
                        name: "telno",
                        title: "Phone number",
                        placeholder: "XX XXX XX XX",
                        flag: INFlag,
                        mask: ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
                        phoneCountryCode: "+91",
                        minLength: 14,
                        maxLength: 14,
                        pattern: "[^A-Za-z]{16}",
                        errorText: "Please enter correct phone number",
                    }
                }
                if (type === "password") {
                    return {
                        type: "password",
                        id: "passwd",
                        name: "passwd",
                        placeholder: "Password",
                        maskDigitFirst: 4,
                        maskDigitSecond: 3,
                        maskDigitThird: 3,
                        minLength: 4,
                        errorText: "Please enter your password",
                        validText: "Valid password",
                    }
                } else {
                    return {
                        type: "checkbox",
                        agreementText: "By signing up, I hereby confirm that I am over 18,",
                        agreementLink: "I read and accepted the offer agreements for the chosen currency with the applicable terms and conditions",
                    }
                }
            default:
                return {
                    type: "text",
                    id: "text",
                    name: "text",
                    placeholder: "text",
                    helper: "",
                };
        }
    }
}
