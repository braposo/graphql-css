import React from "react";
import styles from "./styleguide";
import gqlCSS, { GqlCSS, GqlCSSProvider } from "../lib";
import gql from "graphql-tag";

const h2Styles = gql`
    {
        typography {
            h2
        }
        marginLeft: spacing {
            xl
        }
        color: colors {
            green
        }
    }
`;

const h1Styles = gql`
    {
        typography {
            h1
        }
        marginLeft: spacing {
            l
        }
        color: colors {
            red
        }
    }
`;

const H2 = gqlCSS(styles)(h2Styles, "h2");
const inlineStyles = gqlCSS(styles)(h2Styles, false);

const App = () => (
    <div>
        <H2>This is a styled text</H2>
        <GqlCSS styles={styles} query={h2Styles} tag="h2">
            Using component
        </GqlCSS>
        <GqlCSSProvider styles={styles}>
            <div>
                <div>
                    <span>
                        <GqlCSS query={h2Styles}>Using provider</GqlCSS>
                    </span>
                </div>
            </div>
            <GqlCSS query={h1Styles} css={{ marginTop: 30 }}>
                Also using provider
            </GqlCSS>
        </GqlCSSProvider>
        <h2 style={inlineStyles}>Inline styles</h2>
    </div>
);

export default App;
