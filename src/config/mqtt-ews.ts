import mqtt from "mqtt";

const topics = [];

const mqttEwsClient = mqtt.connect('mqtt://test.mosquitto.org', {
    port: 1883
});

mqttEwsClient.on('connect', () => {
    console.log('Successfully connected ');
});

// mqttEwsClient.subscribe(topics, (err, granted) => {
//     if (err) return console.log('Not subscribed to ', err);

//     console.log('subscribed to: ', granted);
// });

mqttEwsClient.on('message', (topic, payload) => {
    console.log('Message received for topic: ', topic);
    console.log('Payload: ', payload);
});

export default mqttEwsClient;