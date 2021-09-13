import AWS from 'aws-sdk';
import { config } from '../config';
import { Consumer } from 'sqs-consumer';

AWS.config.update({
	region: config.AWS.REGION,
	accessKeyId: config.AWS.ACCESS_KEY_ID,
	secretAccessKey: config.AWS.SECRET_ACCESS_KEY,
});

const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

const params = {
	MaxNumberOfMessages: 1,
	QueueUrl: config.AWS.SQS_QUEUE_URL,
	VisibilityTimeout: 20,
	WaitTimeSeconds: 10,
};

export const reciveMessage = (sqsUrl: string): Promise<AWS.SQS.Message> => {
	return new Promise((resolve, reject) => {
		try {
			sqs.receiveMessage(
				{ ...params, QueueUrl: config.AWS.SQS_QUEUE_URL + sqsUrl },
				function (err, data) {
					if (err) reject('Error: ' + err);
					if (data.Messages && data.Messages.length) {
						const { MessageId, ReceiptHandle, Body } = data.Messages[0];
						resolve({ MessageId, ReceiptHandle, Body });
					}
					reject({ MessageId: 0, ReceiptHandle: 0, Body: 'no msg' });
				}
			);
		} catch (e: any) {
			return reject(e);
		}
	});
};

export const consume = (queueName: string, func: (message: AWS.SQS.Message) => void) => {
	try {
		const app = Consumer.create({
			queueUrl: config.AWS.SQS_QUEUE_URL + queueName,
			batchSize: 10,
			handleMessage: async (message: AWS.SQS.Message) => {
				func(message);
			},
			sqs: new AWS.SQS(),
		});

		app.on('error', (err: any) => {
			console.log(err.message);
		});

		app.start();
	} catch (e: any) {
		console.log(e);
	}
};

export const deleteSQSMessage = (receiptHandle: string, QueueUrl: string): Promise<string> => {
	console.log('deleteSQSMessage');
	return new Promise((resolve, reject) => {
		try {
			const deleteParams = {
				QueueUrl: config.AWS.SQS_QUEUE_URL + QueueUrl,
				ReceiptHandle: receiptHandle,
			};

			sqs.deleteMessage(deleteParams, (err: AWS.AWSError, data: {}): void => {
				if (err) reject('Delete Error ' + err);
				resolve('Message Deleted ' + data);
			});
		} catch (e: any) {
			return reject(e);
		}
	});
};

export const sendMessage = (
	msg: { [key: string]: any },
	sqsUrl: string
): Promise<string | undefined> => {
	return new Promise((resolve, reject) => {
		const params = {
			MessageBody: JSON.stringify({
				date: new Date().toISOString(),
				body: msg,
			}),
			QueueUrl: config.AWS.SQS_QUEUE_URL + sqsUrl,
		};

		sqs.sendMessage(params, (err: AWS.AWSError, data: AWS.SQS.SendMessageResult): void => {
			if (err) reject(err);
			resolve(data.MessageId);
		});
	});
};
