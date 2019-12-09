interface IDeviceMessage {
    dev_id: string,
    metadata: {
        time: Date
    },
    payload_raw: string
};

export default IDeviceMessage;