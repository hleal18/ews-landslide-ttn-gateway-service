interface IDeviceMessage {
    dev_id: string,
    metadata: {
        time: Date
    },
    payload_raw: string,
    counter: number,
};

export default IDeviceMessage;
