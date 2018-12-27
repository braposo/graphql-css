import React from "react";
import { withGqlCSS } from "../src";
import glamorous from "glamorous";
import styles from "./styleguide";
import { customH1Styles } from "./styleQueries";

// Simulates existing component that is enhanced by the HOC
const ExistingComponent = ({ gqlStyles, ...rest }) => <glamorous.Div css={gqlStyles} {...rest} />;

export default withGqlCSS(styles, customH1Styles)(ExistingComponent);
