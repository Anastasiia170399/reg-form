import React, {useState} from "react";
import PropTypes from "prop-types";
import {FormVars} from "../__helpers/formVars";
import styles from "./RegFormInput.module.scss";
import classNames from "classnames";
import MaskedInput from 'react-text-mask';

import {PasswordHints} from "../PasswordHints/PasswordHints";
import {validation} from "../__helpers/regValidation";



export default function RegFormInput({
                                         type,
                                         handleChange,
                                         handleBlur,
                                         handleFocus,
                                         isFocus,
                                         inputTouched,
                                         errors,
                                         inputValue,
                                         hints,
                                         country
                                     }) {


    validation.setCountryAndType(country, type);
    const inputAttributes = FormVars.getFormVars(country, type);
    const [passwordShowerOpen, setPasswordShowerOpen] = useState("");

    const passwordShowerHandleClick = () => {
        if (passwordShowerOpen) {
            setPasswordShowerOpen("");
        } else {
            setPasswordShowerOpen("password-shower--open");
        }
    };

    return (
        <div>
            <label
                className={classNames(
                    styles.label,
                    [styles[`label--${country}`]]
                )}
                htmlFor={inputAttributes.id}>
                {type === "tel" && (
                    <>
                        <div className={classNames(styles["flag"],styles[`flag--${country}`], {
                            [styles["flag--error"]] : inputTouched && errors
                        })}>
                            <img src={inputAttributes.flag} alt={'flag'}/>
                        </div>
                    </>
                )}
                <div className={styles["field"]}>
                    <MaskedInput
                        className={classNames(styles["input"], styles[`input--${country}`], {
                            [styles["input--error"]] : inputTouched && errors
                        })}
                        type={passwordShowerOpen ? "text" : type}
                        name={inputAttributes.name}
                        id={inputAttributes.id}
                        mask={type === 'tel' && inputAttributes.mask}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        onFocus={handleFocus}
                        value={inputValue}
                        placeholder={inputAttributes.placeholder}
                    />
                    <label
                        className={classNames(styles["label__title"], {
                            [styles["label__title--phone"]] : type === "tel"
                        })}
                    >
                        {inputAttributes.title}
                    </label>
                    {type === "password" && (
                        <button
                            className={classNames(
                                styles["password-shower"],
                                styles[passwordShowerOpen]
                            )}
                            type="button"
                            id="formPasswordShower"
                            onClick={passwordShowerHandleClick}
                        ></button>
                    )}

                </div>
            </label>
            {type === "tel" && <div
                className={classNames(styles["error"], {
                    [styles["error--show"]]: errors && inputTouched,
                })}
            >
                <span>{inputAttributes.errorText}</span>
            </div>}
            {type === "password" && (errors || inputValue.length < 6) && (<div
                className={classNames(styles["error"], {
                    [styles["error--show"]]: inputTouched,
                })}
            >
                <span>{inputAttributes.errorText}</span>
            </div>)}
            {type === "password" && !errors && inputValue.length > 0 && (<div
                className={classNames(styles["error"], styles["error--show"], styles["error--green"])}
            >
                <span>{inputAttributes.validText}</span>
            </div>)}
            {/*<PasswordHints errors={validation.validatePassword(country, inputValue)} country={country}/>*/}
            {type === "password" && hints && errors ?
                <PasswordHints errors={validation.validatePassword(country, inputValue)} country={country}/> : null}
        </div>
    )
}
RegFormInput.propTypes = {
    type: PropTypes.string,
    handleChange: PropTypes.func,
    handleBlur: PropTypes.func,
    handleFocus: PropTypes.func,
    isFocus: PropTypes.bool,
    inputTouched: PropTypes.bool,
    errors: PropTypes.bool,
    inputValue: PropTypes.string,
    hints: PropTypes.bool
}


