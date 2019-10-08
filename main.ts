
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

    let wifi_conneted: () => void = null;
    let mqtt_conneted: () => void = null;
    let mqtt_received: () => void = null;
    /**
     * Wifi connection io init
     * @param tx Tx pin; eg: SerialPin.P1
     * @param rx Rx pin; eg: SerialPin.P2
    */
    //% blockId=WIFI_init block="Wifi init|Tx pin %tx|Rx pin %rx"
    //% weight=100
    export function WIFI_init(tx: SerialPin, rx: SerialPin): void {
        serial.redirect(
            tx,
            rx,
            BaudRate.BaudRate115200
        )
        basic.pause(500)
    }

    //% blockId=WIFI_connect block="Wifi Join Aceess Point|%ap Password|%pass"
    //% weight=98
    export function WIFI_connect(ssid: string, pass: string): void {
        let cmd: string = "AT+XMU_WIFI=" + ssid + ',' + pass + '\n'
        serial.writeString(cmd)
        basic.pause(500) // it may took longer to finshed the ap join process
    }

    //% blockId=OneNET_connect block="Wifi Join Aceess Point|%ap Password|%pass"
    //% weight=98
    export function OneNET_connect(product_id: string, machine_id: string, pass: string): void {
        let cmd: string = "AT+ONENET=" + product_id + ',' + machine_id + ',' + pass + '\n'
        serial.writeString(cmd)
        basic.pause(500) // it may took longer to finshed the ap join process
    }

    //% blockId=OneNET_send block="Wifi Join Aceess Point|%ap Password|%pass"
    //% weight=98
    export function OneNET_send(data_id: string, data_value: string): void {
        let cmd: string = "AT+ON_SEND=" + data_id + ',' + data_value + '\n'
        serial.writeString(cmd)
        basic.pause(500) // it may took longer to finshed the ap join process
    }

    serial.onDataReceived('\n', function () {
        serial_read = serial.readString()
        if (serial_read.includes("AT")) {
            if (serial_read.concat("XMU_WIFI") && serial_read.concat("OK")) {
                if (wifi_conneted) wifi_conneted()
            }
            else if (serial_read.concat("ONENET") && serial_read.concat("OK")) {
                if (mqtt_conneted) mqtt_conneted()
            }
            else if (serial_read.concat("RECEIVE")) {

            }
        }
    })

    /**
     * On wifi connected
     * @param handler Wifi connected callback
    */
    //% blockId=on_wifi_connected block="on Wifi Connected"
    //% weight=94
    export function on_wifi_connected(handler: () => void): void {
        wifi_conneted = handler;
    }

    /**
     * On mqtt connected
     * @param handler MQTT connected callback
    */
    //% blockId=on_mqtt_connected block="on MQTT Connected"
    //% weight=94
    export function on_mqtt_connected(handler: () => void): void {
        mqtt_conneted = handler;
    }

    /**
     * On mqtt receiveed
     * @param handler MQTT receiveed callback
    */
    //% blockId=on_mqtt_receiveed block="on MQTT receiveed"
    //% weight=94
    export function on_mqtt_receiveed(handler: () => void): void {
        mqtt_conneted = handler;
    }
}
