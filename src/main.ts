import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { Input, Share } from "./types";

/**
 * Function entry point
 * https://docs.aws.amazon.com/en_pv/lambda/latest/dg/nodejs-prog-model-handler.html
 * 
 * @param event AWS API Gateway event
 */
const handler = async (event: APIGatewayEvent): Promise<any> => {
    if (event.httpMethod === "OPTIONS") {
        return result();
    }

    const input = JSON.parse(event.body) as Input;
    if (input.assist) {
        const output = input.state === "proposing"
            ? await propose(input)
            : await reject(input);

        return result(output);
    }

    /**
     * This is a good place if you would like to log each match change in database
     * for machine learning purposes so you can analyze your previous matches,
     * opponent behaviour in different situations to make better decisions.
     * Open your function log on Netlify to see received change events.
     */

    console.log(JSON.stringify(input));

    return result();
};

/**
 * Proposes how the coins should be split in shares
 * In this example, 10% share is proposed for each opponent
 * 
 * @param input Match data
 * @return List of shares
 */
const propose = async (input: Input): Promise<Share[]> => {
    const pirate = input.pirates.find(p => p.current);
    const shares = input.pirates.map(p => ({
        pirate: { id: p.id },
        value: p.id === pirate.id
            ? 1.0 - (input.pirates.length - 1) * 0.1
            : 0.1,
    } as Share));

    return shares;
};

/**
 * Rejects proposition if expectations are not met
 * In this example, the proposition is rejected if the share is smaller than 20%
 * 
 * @param input Match data
 * @return True if the proposition is unacceptable 
 */
const reject = async (input: Input): Promise<boolean> => {
    const pirate = input.pirates.find(p => p.current);
    const share = input.proposition.shares.find(s => s.pirate.id === pirate.id);

    return share.value < 0.2;
};

/**
 * Helper function to create a result with required HTTP headers and optional output
 * https://docs.aws.amazon.com/en_pv/lambda/latest/dg/nodejs-prog-model-handler.html
 * 
 * @param output Optional output
 */
const result = (output?: boolean | Share[]): APIGatewayProxyResult => {
    return {
        body: JSON.stringify(output),
        headers: {
            "access-control-allow-headers": "content-type",
            "access-control-allow-methods": "POST",
            "access-control-allow-origin": "*",
            "access-control-max-age": "7200",
            "content-type": "application/json",
        },
        statusCode: 200,
    };
};

export { handler };
