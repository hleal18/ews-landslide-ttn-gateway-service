interface IDeviceMessage {
    end_device_ids: {
        device_id: string,
    }
    received_at: Date,
    uplink_message: {
        frm_payload: string,
    }
    counter: number,
};

export default IDeviceMessage;
