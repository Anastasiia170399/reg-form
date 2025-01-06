import React from "react";
import styles from "./RegFormButton.module.scss";
import classnames from "classnames";

export const RegFormButton = ({text, isDisabled}) => {
    return (
        <div className={classnames(styles["button-wrapper"], {
            [styles["button-wrapper--disabled"]]: isDisabled,
        })}>
            <button
                className={styles.button}
                id="submit-button"
                type="submit"
            >
                <span>{text}</span>
            </button>
            <span/>
        </div>
    );
};
