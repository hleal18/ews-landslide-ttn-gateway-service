import dotenv from "dotenv";

dotenv.config();

const config = {
    mqtt: {
        ttn: {
            application_name: process.env.MQTT_TTN_APPLICATION_NAME,
            application_key: process.env.MQTT_TTN_APPLICATION_KEY
        }
    }
}

export default config;