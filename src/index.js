import React from "react";
import graphql from "graphql-anywhere";
import glamorous from "glamorous";
import { Broadcast, Subscriber } from "react-broadcast";

const smoosh = object => {
    return Object.assign(
        {},
        ...(function _flatten(objectBit, path = "") {
            //spread the result into our return object
            return [].concat(
                //concat everything into one level
                ...Object.keys(objectBit).map(
                    //iterate over object
                    key =>
                        typeof objectBit[key] === "object" //check if there is a nested object
                            ? _flatten(objectBit[key]) //call itself if there is
                            : { [key]: objectBit[key] } //append object with it’s path as key
                )
            );
        })(object)
    );
};

const resolver = (fieldName, root, args = {}, context, { resultKey }) => {
    // if it's an aliased query add alias as prop
    if (fieldName !== resultKey) {
        return {
            ...root[fieldName],
            prop: resultKey,
        };
    }

    // if has prop then use it as the key
    if (root.prop) {
        return {
            [root.prop]: root[fieldName],
        };
    }

    return root[fieldName];
};

// Main function to generate glamorous component with styles
const gqlCSS = styles => (query, tag) => {
    const generatedStyles = graphql(resolver, query, styles, null, null);
    const smooshedStyles = smoosh(generatedStyles);
    const component = tag || "div";

    // Returns just smooshed styles if tag is false
    if (tag === false) {
        return smooshedStyles;
    }

    // Create glamorous component
    return glamorous(component)(smooshedStyles);
};

// Also export component for more declarative API
export const GqlCSS = ({ styles, query, tag = "div", ...rest }) => {
    return (
        <Subscriber quiet={true} channel="graphqlcss">
            {contextStyles => {
                const Component = gqlCSS(styles || contextStyles || "")(query).withComponent(tag);
                return <Component {...rest} />;
            }}
        </Subscriber>
    );
};

// Export provider to broadcast styles through different components
export const GqlCSSProvider = ({ styles, children }) => (
    <Broadcast channel="graphqlcss" value={styles}>
        <span>{children}</span>
    </Broadcast>
);

export default gqlCSS;
