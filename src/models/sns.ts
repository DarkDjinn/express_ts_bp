import AWS from 'aws-sdk';
import { config } from '../config';

AWS.config.update({ region: config.AWS.REGION });

export const publishMessage = (
	message: string
): Promise<AWS.SNS.PublishResponse | AWS.AWSError> | undefined => {
	try {
		const params = {
			Message: message,
			TopicArn: config.AWS.ARN,
		};

		return new AWS.SNS({ apiVersion: '2010-03-31' }).publish(params).promise();
	} catch (err: any) {
		console.log('sns err');
		console.log(err.message);
	}
};
