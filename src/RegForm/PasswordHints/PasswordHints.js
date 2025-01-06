import React from "react";
import PropTypes from "prop-types";
// eslint-disable-next-line import/no-extraneous-dependencies
import { v4 as uuidv4 } from "uuid";
import classnames from "classnames";
import styles from "./PasswordHints.module.scss";
import {validation} from "../__helpers/regValidation";

export const PasswordHints = ({ errors, country }) => {
    const jsonData = require('./hintsByCountry.json');

    const passwordHints = jsonData.find(countryData => countryData.country === country).passwordHints

    return (
        <div
            className={classnames(styles["password__hints"], styles[`password__hints--${country}`], {
                [styles.password__hints_hide]:
                    validation.isNoPasswordErrors(errors),
            })}
        >
            <ul className={styles["password__hints-list"]}>
                {passwordHints.map((item) => {
                    return (
                        <li
                            className={classnames(styles["password__hints-item"], {
                                // [styles["password__hints-item--success"]]: !errors[item.type],

                            })}
                            key={uuidv4()}
                        >
                            {item.hint}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

PasswordHints.propTypes = {
    errors: PropTypes.objectOf(PropTypes.bool).isRequired,
};
