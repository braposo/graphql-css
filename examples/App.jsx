import React from "react";
import styles from "./styleguide";
import gqlCSS, { GqlCSS, GqlCSSProvider, withGqlCSS, WithGqlCSS } from "../lib";
import gql from "graphql-tag";
import glamorous from "glamorous";

const h2Styles = gql`
    {
        base {
            typography {
                fontSize: scale {
                    l
                }
                fontWeight: weight {
                    bold
                }
            }
            marginLeft: spacing {
                xl
            }
            color: colors {
                green
            }
        }
    }
`;

const h1Styles = gql`
    fragment H1 on styles {
        base {
            typography {
                fontSize: scale {
                    xl
                }
                fontWeight: weight {
                    bold
                }
            }
            marginLeft: spacing {
                l
            }
            color: colors {
                red
            }
        }
    }
`;

const customH1Styles = gql`
    ${h1Styles}
    {
        ...H1
        base {
            marginLeft: spacing(unit: "em") {
                s
            }
            color: colors {
                blue
            }
        }
    }
`;

const todoStyles = gql`
    {
        todo(variant: $variant) {
            text
        }
    }
`;

class StateComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            variant: "normal",
        };
        this.toggleVariant = this.toggleVariant.bind(this);
    }

    toggleVariant() {
        this.setState(state => ({
            variant: state.variant === "normal" ? "done" : "normal",
        }));
    }

    render() {
        return (
            <GqlCSS
                styles={styles}
                query={todoStyles}
                variables={{ variant: this.state.variant }}
                onClick={this.toggleVariant}
            >
                Using stateful component
            </GqlCSS>
        );
    }
}

// Generates H2 glamorous component
const H2 = gqlCSS(styles)(h2Styles, "h2");

// Simulates existing H2 component
const H2Comp = props => <h2 {...props} />;

// Extracts styles object
const inlineStyles = gqlCSS(styles)(h2Styles, false);

// Simulates existing component that is enhanced by the HOC
const ExistingComponent = ({ gqlStyles, ...rest }) => <glamorous.Div css={gqlStyles} {...rest} />;

const HOCStyledComponent = withGqlCSS(styles, customH1Styles)(ExistingComponent);

const App = () => (
    <div>
        <H2>This is a styled text</H2>
        <GqlCSS styles={styles} query={h2Styles} component={H2Comp}>
            Using component
        </GqlCSS>
        <StateComponent />
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
        <HOCStyledComponent>HOC Styled Component</HOCStyledComponent>
        <WithGqlCSS styles={styles} query={h2Styles}>
            {({ gqlStyles }) => <div style={gqlStyles}>Render props component</div>}
        </WithGqlCSS>
    </div>
);

export default App;
