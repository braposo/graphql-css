import React from "react";
import styles from "./styleguide";
import gqlCSS, { GqlCSS, GqlCSSProvider, WithGqlCSS } from "../src";
import HOCStyledComponent from "./HOC";
import SubscriberComponent from "./SubscriberComponent";
import StatefulComponent from "./StatefulComponent";
import { h2Styles } from "./styleQueries";

// Generates H2 glamorous component
const H2 = gqlCSS(styles)(h2Styles, "h2");

// Simulates existing H2 component
const H2Comp = props => <h2 {...props} />;

// Extracts styles object
const inlineStyles = gqlCSS(styles)(h2Styles, false);

const App = () => (
    <div>
        <H2>This is a styled text</H2>
        <GqlCSS styles={styles} query={h2Styles} component={H2Comp}>
            Using component
        </GqlCSS>
        <GqlCSSProvider styles={styles}>
            <SubscriberComponent />
        </GqlCSSProvider>
        <h2 style={inlineStyles}>Inline styles</h2>
        <HOCStyledComponent>HOC Styled Component</HOCStyledComponent>
        <WithGqlCSS styles={styles} query={h2Styles}>
            {({ gqlStyles }) => <div style={gqlStyles}>Render props component</div>}
        </WithGqlCSS>
        <StatefulComponent />
    </div>
);

export default App;
