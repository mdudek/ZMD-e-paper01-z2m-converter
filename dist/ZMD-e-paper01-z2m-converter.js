"use strict";
const zigbee_herdsman_1 = require("zigbee-herdsman");
const exposes_1 = require("zigbee-herdsman-converters/lib/exposes");
const modernExtend_1 = require("zigbee-herdsman-converters/lib/modernExtend");
function ePaperText() {
    const exposes = [
        exposes_1.presets
            .text('text', exposes_1.access.STATE_SET)
            .withLabel('Text')
            .withDescription('Text displayed on e-paper')
            .withCategory('config'),
    ];
    const fromZigbee = [
        {
            cluster: 'manuSpecificZMDEPaper01',
            type: ['attributeReport', 'readResponse'],
            convert: (model, msg, publish, options, meta) => {
                const payload = {};
                if (msg.data.text !== undefined) {
                    payload.text = msg.data.text;
                }
                return payload;
            },
        },
    ];
    const toZigbee = [
        {
            key: ['text'],
            convertGet: async (entity, key, meta) => {
                await entity.read('manuSpecificZMDEPaper01', ['text']);
            },
            convertSet: async (entity, key, value, meta) => {
                var _a;
                const text = (_a = value) !== null && _a !== void 0 ? _a : '';
                //const endpoint = meta.device?.getEndpoint(1);
                //await endpoint?.write('manuSpecificZMDEPaper01', {text});
                await entity.write('manuSpecificZMDEPaper01', { text });
                return { state: { text } };
            },
        },
    ];
    const defaultReporting = { min: '1_HOUR', max: 'MAX', change: 10 };
    const configure = [
        (0, modernExtend_1.setupConfigureForReporting)('manuSpecificZMDEPaper01', 'text', defaultReporting, exposes_1.access.STATE_GET),
    ];
    return { exposes, fromZigbee, toZigbee, configure, isModernExtend: true };
}
const definition = {
    zigbeeModel: ['ZMD_E_Paper01'],
    model: 'ZMD_E_Paper01',
    vendor: 'ZigMD_Systems',
    description: 'E-paper remote display',
    extend: [
        (0, modernExtend_1.battery)(),
        (0, modernExtend_1.deviceAddCustomCluster)('manuSpecificZMDEPaper01', {
            ID: 0xff00,
            attributes: {
                text: { ID: 0x0001, type: zigbee_herdsman_1.Zcl.DataType.CHAR_STR },
            },
            commands: {},
            commandsResponse: {},
        }),
        ePaperText(),
    ],
    meta: {},
};
module.exports = definition;
