import IDeviceMessage from "./IDeviceMessage";
import DefaultVariables, { defaultTypes } from "./DefaultVariables";
import IVariable, { IAxis } from "./IVariable";

const typesArray = [
  defaultTypes.acceleration,
  defaultTypes.rotationRate,
  defaultTypes.soilMoisture,
  defaultTypes.waterLevel,
  defaultTypes.inclination,
  defaultTypes.voltage,
  defaultTypes.temperature,
];

export default class VariablesDecoder {
  static decodeVariable(message: Buffer): IVariable<Object> {
    const messageObject = JSON.parse(String(message)) as IDeviceMessage;

    // console.log("MessageObject: ", messageObject);
    const deviceId = messageObject.dev_id;
    const timestamp = messageObject.metadata.time;
    const name = "t-beam-sf10-soilMoisture";
    const counter = messageObject.counter;

    let byteBufferPayload = this.base64ToArray(
      messageObject.payload_raw as string
    );
    const idSensor = Number(byteBufferPayload[0]);
    const type = typesArray[byteBufferPayload[1]] as DefaultVariables;

    byteBufferPayload = byteBufferPayload.slice(2);

    let values: Object = 0;

    if (type === "acceleration") {
      values = this.decodeAcceleration(byteBufferPayload);
    } else if (type === "rotationRate") {
      values = this.decodeRotationRate(byteBufferPayload);
    } else if (type === "soilMoisture") {
      values = this.decodeSoilMoisture(byteBufferPayload[0]);
    } else if (type === "inclination") {
      values = this.decodeInclination(byteBufferPayload);
    } else if (type === "waterLevel") {
      values = this.decodeWaterLevel(byteBufferPayload[0]);
    } else if (type === "voltage") {
      values = this.decodeVoltage(byteBufferPayload);
    } else if (type === "temperature") {
      values = this.decodeTemperature(byteBufferPayload);
    }

    const variable: IVariable<Object> = {
      deviceId,
      timestamp,
      type,
      name,
      counter,
      value: values,
      idSensor,
    };

    console.log("Variable: ", variable);

    return variable;
  }
  static decodeAcceleration(byteBuffer: Buffer): Object {
    const values = this.bufferToAxisVariable(byteBuffer);
    return values;
  }

  static decodeRotationRate(byteBuffer: Buffer): Object {
    const values = this.bufferToAxisVariable(byteBuffer);
    return values;
  }

  static decodeSoilMoisture(byte: number): number {
    const value = this.byteToSignedInteger(byte);
    return value;
  }

  static decodeInclination(byteBuffer: Buffer): Object {
    return {
      x: this.byteToSignedInteger(byteBuffer[0]),
      y: this.byteToSignedInteger(byteBuffer[1]),
    };
  }

  static decodeWaterLevel(byte: number): number {
    const value = this.byteToUnsignedInteger(byte);
    return value;
  }

  static decodeVoltage(buffer: Buffer): number {
    const value = this.bufferToFloat(buffer);
    return value;
  }

  static decodeTemperature(buffer: Buffer): number {
    const value = this.bufferToFloat(buffer);
    return value;
  }

  static base64ToArray(message: string): Buffer {
    const byteBuffer = Buffer.from(message, "base64");
    return byteBuffer;
  }

  static byteToUnsignedInteger(byte: number): number {
    const value = Number(byte);
    return value;
  }

  static byteToSignedInteger(byte: number): number {
    let num = byte;
    if (num >> 7 == 1) num = -((num ^ 0xff) + 1);
    return num;
  }

  static bufferToFloat(buffer: Buffer): number {
    console.log("Initiating buffer to float conversion");
    // Test by multiplying by 100
    return ((buffer[0] << 8) + buffer[1]) / 100;
    // DataView works with Javascript ArrayBuffer and not
    // Nodejs buffers, so conversion is needed as follows
    //        const convertedBuffer = buffer.buffer.slice(buffer.byteOffset + buffer.byteLength);
    //const view = new DataView(convertedBuffer);
    //const newBuffer = new ArrayBuffer(4);

    //convertedBuffer.forEach((byte, ind) => view.setUint8(byte, ind));

    //const num = view.getFloat32(0);

    //console.log(num);

    //return num;
  }

  static bufferToAxisVariable(buffer: Buffer): Array<IAxis> | IAxis {
    let values: Array<IAxis> | IAxis;

    // Single value
    if (buffer.length == 3) {
      console.log("Single value");
      values = {
        x: this.byteToSignedInteger(buffer[0]),
        y: this.byteToSignedInteger(buffer[1]),
        z: this.byteToSignedInteger(buffer[2]),
      };
    }
    // Multiple values
    else {
      values = [];
      for (let i = 0; i < buffer.length; i += 3) {
        let x = this.byteToSignedInteger(buffer[i]);
        let y = this.byteToSignedInteger(buffer[i + 1]);
        let z = this.byteToSignedInteger(buffer[i + 2]);

        values.push({ x, y, z });
      }
    }

    return values;
  }
}
