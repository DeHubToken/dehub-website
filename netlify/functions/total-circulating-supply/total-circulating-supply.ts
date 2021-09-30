import { Handler } from '@netlify/functions';
import fetch from 'node-fetch';

const API_ENDPOINT =
	'https://vamoxwojj7ht.moralisweb3.com:2053/server/functions/totalCirculatingSupply?_AplicationId=QfgYJskOXrYJnSAiB3KZPMMesmlJB6JBqY3GOzHV';

export const handler: Handler = async (event, context) => {
	try {
		const response = await fetch(API_ENDPOINT);

		const { result: totalCirculatingSupply } = (await response.json()) as any;
		return { statusCode: 200, body: JSON.stringify(totalCirculatingSupply) };
	} catch (error) {
		console.log(error);
		return {
			statusCode: 500,
			body: JSON.stringify({ error: 'Failed fetching data' }),
		};
	}
};
