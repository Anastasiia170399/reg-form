import React, {useState} from "react";
import RegFormInput from "./RegFormInput/RegFormInput";

import {useFormHandler} from "./__helpers/regFormHandler";
import styles from "./Form.module.scss";

import classNames from "classnames";
import {validation} from "./__helpers/regValidation";
import {RegFormButton} from "./RegFormButton/RegFormButton";
import {FormVars} from "./__helpers/formVars";
import {keys} from "./api/keys";

export default function RegForm({handleTerms}) {
    const {
        values,
        handleSubmit,
        handleChange,
        handlerBlur,
        handleFocusPass,
        handleFocusTel,
        errorServer,
    } = useFormHandler();

    const [isPhoneNumberTouched, setPhoneNumberTouched] = useState(false);
    const [isPasswordTouched, setPasswordTouched] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [isPhoneInputFocused, setIsPhoneInputFocused] = useState(false);
    const [hints, showHints] = useState(false);

    const [country] = useState(keys.BRAND); //setting GEO to adapt the reg form to the desired country
    const inputAttributes = FormVars.getFormVars(country, "checkbox", keys.LANGUAGE);

    // useEffect(() => {
    //     addListeners();
    // }, []);

    return (
        <form
            className={styles[`form`]}
            onSubmit={handleSubmit}
            autoComplete={'off'}
        >
            <div
                className={classNames(styles.form__error, {
                    [styles.form__error_show]: errorServer.isError,
                })}>
                {errorServer.isError ? <span className={styles["form__error-icon"]}/> : null}
                <span className={styles["form__error-text"]}>
                  {errorServer.general}
                </span>
            </div>

            <div className={styles[`form__input-group`]}>

                <RegFormInput
                    type={"tel"}
                    handleChange={handleChange}
                    handleBlur={(e) => handlerBlur(e, setPhoneNumberTouched, setIsPhoneInputFocused)}
                    handleFocus={() => handleFocusTel(setIsPhoneInputFocused)}
                    isFocus={isPhoneInputFocused}
                    inputTouched={isPhoneNumberTouched}
                    errors={validation.errors.phone}
                    inputValue={values.telno}
                    country={country}
                    autocomplete="off"
                />

                <RegFormInput
                    type={"password"}
                    handleChange={handleChange}
                    handleBlur={(e) => handlerBlur(e, setPasswordTouched, setIsPasswordFocused, showHints)}
                    handleFocus={() => handleFocusPass(setIsPasswordFocused, setPasswordTouched, showHints, isPasswordTouched)}
                    isFocus={isPasswordFocused}
                    inputTouched={isPasswordTouched}
                    errors={validation.errors.password}
                    inputValue={values.passwd}
                    country={country}
                    hints={hints}
                />
            </div>

            <div className={classNames(styles["checkbox"], {
                [styles["checkbox--outline"]]: !values.isAgreement,
            })}>
                <div
                    className={classNames(
                        styles[`form__agreement-label`],
                    )}
                >
                    <p className={styles[`form__agreement-text`]}>
                        {inputAttributes.agreementText} {" "}
                        <span
                            className={styles[`form__agreement-link`]}
                            onClick={handleTerms}
                            data-cs="cs-reg-bonus-rules"
                        >
                            {inputAttributes.agreementLink}
                        </span>
                    </p>
                    <label
                        htmlFor="agreement-checkbox"
                    >
                        <input
                            className={styles[`form__agreement-input`]}
                            type="checkbox"
                            id="agreement-checkbox"
                            name="isAgreement"
                            onChange={handleChange}
                            checked={values.isAgreement}
                            data-cs="cs-reg-isplayeragree"
                            required
                        />
                    </label>
                </div>
            </div>

            <RegFormButton
                text={'WIN  NOW'}
                isDisabled={
                    !values.isAgreement ||
                    values.passwd.length < 1 ||
                    !values.telno ||
                    validation.errors.password ||
                    validation.errors.phone
                }
            />
        </form>
    )
}
