/* eslint-env jest */

import React from 'react'
import gql from "graphql-tag";
import {render, Simulate} from 'react-testing-library';
import serializer from 'jest-glamor-react';
import {Div} from 'glamorous';

import gqlCSS, { GqlCSS, GqlCSSProvider, WithGqlCSS, withGqlCSS } from "./index";
import styles from '../examples/styleguide';
import { h1Styles, h2Styles, customH1Styles, stateStyles } from "../examples/styleQueries";

expect.addSnapshotSerializer(serializer)

describe('gqlCSS', () => {
    it('it allows the extraction of styles by passing false', () => {
        const extractedStyles = gqlCSS(styles)(h2Styles, false);
        expect(extractedStyles).toEqual({
            'color': 'green',
            'fontSize': '36px',
            'fontWeight': 700,
            'marginLeft': 32,
          })
    });
  
    it('it returns a styled component by passing a div', () => {
        const StyledComponent = gqlCSS(styles)(h2Styles, 'div');
        const {container} = render(<StyledComponent />)
        expect(container).toMatchSnapshot()
    });

    it('it supports variables and stateful components', () => {
        class StatefulComponent extends React.Component {
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
                const { variant } = this.state;
                const OtherComponent = gqlCSS(styles)(stateStyles, null, { variant });
        
                return (
                    <React.Fragment>
                        <GqlCSS
                            styles={styles}
                            query={stateStyles}
                            variables={{ variant }}
                            onClick={this.toggleVariant}
                            data-testid="stateful-component"
                        >
                            Using stateful component
                        </GqlCSS>
                        <OtherComponent>Other sharing state</OtherComponent>
                    </React.Fragment>
                );
            }
        }

        const {container, queryByTestId} = render(<StatefulComponent />)

        expect(container).toMatchSnapshot()

        Simulate.click(queryByTestId('stateful-component'))

        expect(container).toMatchSnapshot()
    });
});

describe('GqlCSSProvider', () => {
    it('it supports the Provider/Subscriber pattern', () => {
        const SubscriberComponent = () => (
            <div>
                <div>
                    <span>
                        <GqlCSS query={h2Styles}>Using provider</GqlCSS>
                    </span>
                </div>
                <GqlCSS query={h1Styles} css={{ marginTop: 30 }}>
                    Also using provider
                </GqlCSS>
            </div>
        );
        const {container} = render(<GqlCSSProvider styles={styles}><SubscriberComponent/></GqlCSSProvider>)

        expect(container).toMatchSnapshot()
    });
});

describe('WithGqlCSS', () => {
    it('it supports the render props pattern', () => {
        const {container} = render(
            <WithGqlCSS styles={styles} query={h2Styles}>
                {({ gqlStyles }) => <div style={gqlStyles}>Render props component</div>}
            </WithGqlCSS>
        );

        expect(container).toMatchSnapshot()
    });
});

describe('withGqlCSS', () => {
    it('it supports the HOC pattern', () => {
        const ExistingComponent = ({ gqlStyles, ...rest }) => (
            <Div css={gqlStyles} {...rest}>test</Div>
        );

        const HOC = withGqlCSS(styles, customH1Styles)(ExistingComponent)
        const {container} = render(<HOC />)

        expect(container).toMatchSnapshot()
    });
});