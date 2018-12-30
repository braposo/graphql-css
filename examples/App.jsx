import React, { useContext, useState } from "react";
import styleguide from "./styleguide";
import useGqlCSS, { GqlCSS, gql } from "../src";
import { h1Styles, h2Styles, stateStyles } from "./styleQueries";
import cxs from "cxs/component";
import PropTypes from "prop-types";

const Context = React.createContext();

function StatefulComponent() {
    const [variant, setVariant] = useState("normal");
    const { styled, GqlCSS } = useGqlCSS(styleguide);
    const toggleVariant = () => setVariant(state => (state === "normal" ? "done" : "normal"));
    const OtherComponent = styled.button`{
        theme(variant: ${props => props.variant}) {
            button
        }
        base {
            marginLeft: spacing {
                m
            }
        }
    }`;
    OtherComponent.propTypes = {
        variant: PropTypes.string.isRequired,
    };

    return (
        <React.Fragment>
            <GqlCSS query={stateStyles} variables={{ variant }} onClick={toggleVariant}>
                Using stateful component
            </GqlCSS>
            <OtherComponent variant={variant}>Other component sharing state</OtherComponent>
        </React.Fragment>
    );
}

function SubscriberComponent() {
    const styleguide = useContext(Context);
    const { getStyles } = useGqlCSS(styleguide);
    const styles = getStyles(gql`
        {
            base {
                typography {
                    fontSize: scale {
                        m
                    }
                }
                marginLeft: spacing {
                    xl
                }
                color: colors {
                    blue
                }
            }
        }
    `);
    const StyledComponent = cxs("h3")(styles);
    return <StyledComponent>Getting styles through context</StyledComponent>;
}

function App() {
    const { styled } = useGqlCSS(styleguide);
    const H2 = styled.h2(h2Styles);
    const H3 = styled.h3`{
        base {
            marginLeft: spacing {
                m
            }
        }

        ${props =>
            props.blue &&
            `
              base {
                  color: colors {
                      blue
                  }
              }
        `}
    }`;
    H3.propTypes = {
        blue: PropTypes.bool,
    };

    return (
        <div>
            <H2>This is a styled text</H2>
            <H3 blue={true}>Component with template literal</H3>
            <GqlCSS styles={styleguide} query={h1Styles}>
                A styled component
            </GqlCSS>
            <Context.Provider value={styleguide}>
                <SubscriberComponent />
            </Context.Provider>
            <StatefulComponent />
        </div>
    );
}

export default App;
