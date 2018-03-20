import React from "react";
import graphql from "graphql-anywhere";
import glamorous from "glamorous";
import { Broadcast, Subscriber } from "react-broadcast";

const smoosh = object => {
    return Object.assign(
        {},
        ...(function _flatten(objectBit, path = "") {
            return [].concat(
                ...Object.keys(objectBit).map(
                    key =>
                        typeof objectBit[key] === "object"
                            ? _flatten(objectBit[key])
                            : { [key]: objectBit[key] }
                )
            );
        })(object)
    );
};

const resolver = (fieldName, root = {}, args = {}, context, { resultKey }) => {
    // if it's an aliased query add alias as prop
    if (fieldName !== resultKey) {
        return {
            ...root[fieldName],
            ...args,
            prop: resultKey,
        };
    }

    let res = root[fieldName];
    const rootUnit = root && root.unit;
    const argsUnit = args && args.unit;
    const argsVariant = args && args.variant;

    if (argsUnit || rootUnit) {
        const unit = argsUnit || rootUnit;
        res = root[fieldName] + unit;
    }

    if (argsVariant) {
        res = root[fieldName][argsVariant];
    }

    // if has prop then use it as the key
    if (root.prop) {
        return {
            [root.prop]: res,
        };
    }

    return res;
};

// Main function to generate glamorous component with styles
const gqlCSS = styles => (query, component = "div", variables) => {
    const generatedStyles = graphql(resolver, query, styles, null, variables);
    const smooshedStyles = smoosh(generatedStyles);

    // Returns just smooshed styles if component is false
    if (component === false) {
        return smooshedStyles;
    }

    // Create glamorous component
    return glamorous(component || "div")(smooshedStyles);
};

// Also export component for more declarative API
export const GqlCSS = ({ styles, query, component = "div", variables, ...rest }) => {
    return (
        <Subscriber quiet={true} channel="graphqlcss">
            {contextStyles => {
                const Component = gqlCSS(styles || contextStyles || "")(query, component, variables);
                return <Component {...rest} />;
            }}
        </Subscriber>
    );
};

// Export provider to broadcast styles to child GqlCSS components
export const GqlCSSProvider = ({ styles, children }) => (
    <Broadcast channel="graphqlcss" value={styles}>
        <span>{children}</span>
    </Broadcast>
);

// Export HOC - uses render props underneath, because it's awesome
export const withGqlCSS = (styles, query, variables) => Component => props => {
    return (
        <WithGqlCSS styles={styles} query={query} variables={variables}>
            {({ gqlStyles }) => <Component {...props} gqlStyles={gqlStyles} />}
        </WithGqlCSS>
    );
};

// Export render props component
export const WithGqlCSS = ({ styles, query, variables, children, ...rest }) => {
    const processedStyles = gqlCSS(styles)(query, false, variables);
    return children({ gqlStyles: processedStyles, ...rest });
};

export default gqlCSS;
