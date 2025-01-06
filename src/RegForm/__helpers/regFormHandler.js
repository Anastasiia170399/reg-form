import {useState} from "react";
import {validation} from "./regValidation";
import sendFormData from "./sendFormData";
import {
    setAuthorizationCookies,
    getRootDomain,
    redirectToPlatform,
    prepareFormData,
} from "../api/utils";
import {vars} from "../../../utils/utils";
import {csConfig} from "../../../config/clickstream.config";

export const useFormHandler = () => {
    const [values, setValues] = useState({
        telno: "",
        passwd: "",
        isAgreement: true,
    });

    const [errorServer, setErrorServer] = useState({});


    const handleSubmit = async (e) => {
        e.preventDefault();
        const isValid = validation.validateForm(values);

        try {
            if (isValid) {
                const preparedData = prepareFormData(values);
                try {
                    window.Analytics.pushEvent({
                        pushEventName: "landing_registration_submit_button_click",
                    });
                } catch (e) {
                    console.log(e);
                }

                const response = await sendFormData(preparedData);

                if (response) {
                    const data = await response.json();
                    console.log(data)

                    const domain = getRootDomain(window.location.host).replace(
                        "https://",
                        ""
                    );

                    setAuthorizationCookies(data, domain);

                    if (!response.ok) {
                        setErrorServer({
                            isError: true,
                            general: "Incorrect password. Please, try again or you can reset your password.",
                        });

                        if (window.Analytics) {
                            window.Analytics.pushEvent({
                                pushEventName: "landing_registration_error",
                                regErrorCode: `${data.modelError.code}`,
                                regErrorText: `${data.modelError.localizeKey}`
                            });
                        }
                        console.log(data, "data");
                    } else {
                        try {
                            window.MTFEF.registerCallback(data.account);

                            if (!data.isLoginOnReg) {
                                if (window.Analytics) {
                                    window.Analytics.pushEvent({
                                        pushEventName: 'landing_registration_success',
                                        bonusType: csConfig.bonusType,
                                        userIdHash: window.Analytics.getCrossdomainId()
                                    });
                                }
                            } else {
                                if (window.Analytics) {
                                    window.Analytics.pushEvent({
                                        pushEventName: 'landing_login_success',
                                        bonusType: csConfig.bonusType,
                                        userIdHash: window.Analytics.getCrossdomainId()
                                    });
                                }
                            }

                              redirectToPlatform(vars.otpUrl);

                        } catch (error) {
                            console.log(error);
                        }
                    }
                }
            }
        } catch (error) {
            if (window.Analytics) {
                window.Analytics.pushEvent({
                    pushEventName: "landing_registration_error",
                    regErrorCode: `${error.errorCode}`,
                    regErrorText: `${error.general}`,
                });
            }

            setErrorServer({
                isError: true,
                general: "Server error. Try again!",
            });
        }
    };

    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;
        const newValue = type === "checkbox" ? checked : value;

        setValues((prevValues) => ({
            ...prevValues,
            [name]: newValue,
        }));

        validation.validateForm({...values, [name]: newValue});
    };

    const handlerBlur = (event, inputTouched, inputFocused, showHints) => {
        switch (event.target.type) {
            case "tel":
                if (validation.errors.phone) {
                    inputTouched(true);
                }
                inputFocused(false);
                break;

            case "password":
                if (validation.errors.password) {
                    inputTouched(true);
                }
                inputFocused(false);
                showHints(false);
                break;
            default:
                break;
        }
    };

    const handleFocusPass = (inputFocused, inputTouched, showHints) => {
        inputFocused(true);
        inputTouched(false);
        showHints(true);
    };

    const handleFocusTel = (inputFocused) => {
        if (window.Analytics) {
            window.Analytics.pushEvent({
                pushEventName: "landing_registration_start",
            });
        }
        inputFocused(true);
    };

    return {
        values,
        handleSubmit,
        handleChange,
        handlerBlur,
        handleFocusPass,
        handleFocusTel,
        errorServer,
    };
};
