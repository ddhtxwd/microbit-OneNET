
/**
 * 使用此文件来定义自定义函数和图形块。
 * 想了解更详细的信息，请前往 https://makecode.microbit.org/blocks/custom
 */

/**
 * 自定义图形块
 */
//% weight=100 color=#0fbc11 icon="\uf1eb"
namespace OneNET {

    let serial_read: string;
    let receive_id: string;
    let receive_value: string;
    let is_mqtt_conneted = false;

    let wifi_conneted: () => void = null;
    let mqtt_conneted: () => void = null;
    let mqtt_received: () => void = null;
    /**
     * 初始化WIFI模块的串口
     * @param tx ; eg: SerialPin.P1
     * @param rx ; eg: SerialPin.P2
    */
    //% block="初始化WIFI模块的串口 TX：$tx RX：$rx"
    export function WIFI_init(tx: SerialPin, rx: SerialPin): void {
        serial.redirect(
            tx,
            rx,
            BaudRate.BaudRate115200
        )
        basic.pause(1000)
    }
    /**
     * 连接WIFI
     * @param ssid ; eg: "WIFI"
     * @param pass ; eg: "12345678"
    */
    //% block="连接WIFI 名称：$ssid 密码：$pass"
    export function WIFI_connect(ssid: string, pass: string): void {
        basic.pause(500)
        let cmd: string = "AT+XMU_WIFI=" + ssid + ',' + pass + '\n'
        serial.writeString(cmd)
        basic.pause(500)
    }

    /**
     * 连接OneNET
     * @param product_id ; eg: "123456"
     * @param machine_id ; eg: "123456789"
     * @param pass ; eg: "1234"
    */
    //% block="连接OneNET 产品ID：$product_id 设备ID：$machine_id 鉴权信息：$pass"
    export function OneNET_connect(product_id: string, machine_id: string, pass: string): void {
        let cmd: string = "AT+ONENET=" + product_id + ',' + machine_id + ',' + pass + '\n'
        is_mqtt_conneted = false
        serial.writeString(cmd)
        basic.pause(500)
    }
    /**
     * 向OneNET发送信息
     * @param data_id ; eg: "temp"
     * @param data_value ; eg: "28.5"
    */
    //% block="向OneNET发送信息 数据流名称：$data_id 内容：$data_value"
    export function OneNET_send(data_id: string, data_value: string): void {
        let cmd: string = "AT+ON_SEND=" + data_id + ',' + data_value + '\n'
        serial.writeString(cmd)
        basic.pause(500)
    }

    serial.onDataReceived('\n', function () {
        serial_read = serial.readString()
        if (serial_read.includes("AT")) {
            if (serial_read.includes("XMU_WIFI") && serial_read.includes("OK")) {
                if (wifi_conneted) wifi_conneted()
            }
            else if (serial_read.includes("ONENET") && serial_read.includes("OK")) {
                is_mqtt_conneted = true
                if (mqtt_conneted) mqtt_conneted()
            }
            else if (serial_read.includes("RECEIVE")) {
                let start_index = 11
                receive_value = serial_read.substr(start_index, serial_read.length - start_index)
                if (mqtt_received) mqtt_received()
            }
        }
    })

    /**
     * WIFI连接成功
     * @param handler WIFI connected callback
    */
    //% block="WIFI连接成功"
    export function on_wifi_connected(handler: () => void): void {
        wifi_conneted = handler;
    }

    /**
     * OneNET连接成功
     * @param handler MQTT connected callback
    */
    //% block="OneNET连接成功"
    export function on_mqtt_connected(handler: () => void): void {
        mqtt_conneted = handler;
    }

    /**
     * On 收到OneNET的命令
     * @param handler MQTT receiveed callback
    */
    //% block="收到OneNET的命令"
    export function on_mqtt_receiveed(handler: () => void): void {
        mqtt_received = handler;
    }

    //% block="收到的命令"
    export function get_value(): string {
        return receive_value;
    }

    //% block="连接到服务器成功"
    export function is_connected(): boolean {
        return is_mqtt_conneted;
    }
}
