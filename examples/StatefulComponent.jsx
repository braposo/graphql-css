import React from "react";
import gqlCSS, { GqlCSS } from "../src";
import styles from "./styleguide";
import { stateStyles } from "./styleQueries";

class StatefulComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            variant: "normal",
        };
        this.handleToggleVariant = this.handleToggleVariant.bind(this);
    }

    handleToggleVariant() {
        this.setState(state => ({
            variant: state.variant === "normal" ? "done" : "normal",
        }));
    }

    render() {
        const { variant } = this.state;
        const OtherComponent = gqlCSS(styles)(stateStyles, null, { variant });

        return (
            <React.Fragment>
                <GqlCSS
                    styles={styles}
                    query={stateStyles}
                    variables={{ variant }}
                    onClick={this.handleToggleVariant}
                >
                    Using stateful component
                </GqlCSS>
                <OtherComponent>Other sharing state</OtherComponent>
            </React.Fragment>
        );
    }
}

export default StatefulComponent;
