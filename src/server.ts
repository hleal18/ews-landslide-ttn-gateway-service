import express from "express";
import mqttTtnClient from "./config/mqtt-ttn";
import mqttEwsClient from "./config/mqtt-ews";
import DefaultVariables, { defaultTypes } from "./DefaultVariables";
import IVariable from "./IVariable";
import IDeviceMessage from "./IDeviceMessage";
import VariablesDecoder from "./VariablesDecoder"

mqttTtnClient.on('message', (topic, payload) => {
    console.log('Sending payload to server: ');
    const variable: IVariable<Object> = VariablesDecoder.decodeVariable(payload);
    mqttEwsClient.publish('ews-landslide-test', JSON.stringify(variable), { qos: 2 });
});
