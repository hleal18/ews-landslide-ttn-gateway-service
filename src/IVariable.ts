import DefaultVariables from "./DefaultVariables";

export default interface IVariable<T> {
    name: string;
    deviceId: string;
    value: T;
    timestamp: Date;
    type: DefaultVariables;
    idSensor: Number;
    counter: Number;
}

export interface IAxis {
    x: Number;
    y: Number;
    z: Number;
}

export interface IAccelerationVariable extends IVariable<number> {

}

export interface IRainfallVariable extends IVariable<number> { }
