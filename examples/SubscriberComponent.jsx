import React from "react";
import { GqlCSS } from "../lib";
import { h1Styles, h2Styles } from "./styleQueries";

// Simulates subscriber component
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

export default SubscriberComponent;
