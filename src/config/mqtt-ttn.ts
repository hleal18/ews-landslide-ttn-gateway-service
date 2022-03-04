import config from "./config";
import mqtt from "mqtt";


const allDevicesMessagesTopic = 'v3/+/devices/+/up';

const options: mqtt.IClientOptions = {
    port: 1883,
    username: config.mqtt.ttn.application_name,
    password: config.mqtt.ttn.application_key,
}

const mqttTtnClient = mqtt.connect('mqtt://nam1.cloud.thethings.network', options);

mqttTtnClient.on('error', (err) => {
    console.log('There was an error on mqttTTnClient: ', err);
})

mqttTtnClient.on('connect', () => {
    console.log('Successfully connected to ttn');
});

mqttTtnClient.subscribe(allDevicesMessagesTopic, { qos: 0 }, (err, granted) => {
    if (err) return console.log('Not subscribed to ttn ', err);

    console.log('subscribed to: ', granted);
});

mqttTtnClient.on('message', (topic, payload) => {
    console.log('Message received for topic: ', topic);
    console.log('Payload: ', payload);
    const payloadString = String(payload);
    console.log('Transformed: ', JSON.parse(payloadString).payload_raw);
});

export default mqttTtnClient;