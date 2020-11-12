import config from "./config";
import mqtt from "mqtt";


const allDevicesMessagesTopic = '+/devices/+/up';

const options = {
    port: 1883,
    username: config.mqtt.ttn.application_name,
    password: config.mqtt.ttn.application_key
}

const mqttTtnClient = mqtt.connect('mqtt://us-west.thethings.network', options);

mqttTtnClient.on('error', (err) => {
    console.log('There was an error: ', err);
})

mqttTtnClient.on('connect', () => {
    console.log('Successfully connected ');
});

mqttTtnClient.subscribe(allDevicesMessagesTopic, (err, granted) => {
    if (err) return console.log('Not subscribed to ', err);

    console.log('subscribed to: ', granted);
});

mqttTtnClient.on('message', (topic, payload) => {
    console.log('Message received for topic: ', topic);
    console.log('Payload: ', payload);
    const payloadString = String(payload);
    console.log('Transformed: ', JSON.parse(payloadString).payload_raw);
});

export default mqttTtnClient;