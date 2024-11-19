import { Zcl } from 'zigbee-herdsman';
import { Expose, Tz } from 'zigbee-herdsman-converters';
import { access, presets } from 'zigbee-herdsman-converters/lib/exposes';
import { battery, deviceAddCustomCluster, ReportingConfigWithoutAttribute, setupConfigureForReporting } from 'zigbee-herdsman-converters/lib/modernExtend';
import { Configure, Fz, KeyValue, ModernExtend } from 'zigbee-herdsman-converters/lib/types';

function ePaperText(): ModernExtend {
  const exposes: Expose[] = [
    presets
      .text('text', access.STATE_SET)
      .withLabel('Text')
      .withDescription('Text displayed on e-paper')
      .withCategory('config'),
  ];

  const fromZigbee: Fz.Converter[] = [
    {
      cluster: 'manuSpecificZMDEPaper01',
      type: ['attributeReport', 'readResponse'],
      convert: (model, msg, publish, options, meta) => {
        const payload: KeyValue = {};
        if (msg.data.text !== undefined) {
          payload.text = msg.data.text;
        }
        return payload;
      },
    },
  ];

  const toZigbee: Tz.Converter[] = [
    {
      key: ['text'],
      convertGet: async (entity, key, meta) => {
        await entity.read('manuSpecificZMDEPaper01', ['text']);
      },
      convertSet: async (entity, key, value, meta) => {
        const text = value as string | undefined ?? '';
        //const endpoint = meta.device?.getEndpoint(1);
        //await endpoint?.write('manuSpecificZMDEPaper01', {text});
        await entity.write('manuSpecificZMDEPaper01', {text});
        return { state: { text } };
      },
    },
  ];

  const defaultReporting: ReportingConfigWithoutAttribute = {min: '1_HOUR', max: 'MAX', change: 10};

  const configure: Configure[] = [
    setupConfigureForReporting('manuSpecificZMDEPaper01', 'text', defaultReporting, access.STATE_GET),
  ];

  return {exposes, fromZigbee, toZigbee, configure, isModernExtend: true};
}

const definition = {
  zigbeeModel: ['ZMD_E_Paper01'],
  model: 'ZMD_E_Paper01',
  vendor: 'ZigMD_Systems',
  description: 'E-paper remote display',
  extend: [
    battery(),
    deviceAddCustomCluster('manuSpecificZMDEPaper01', {
      ID: 0xff00,
      attributes: {
        text: {ID: 0x0001, type: Zcl.DataType.CHAR_STR},
      },
      commands: {},
      commandsResponse: {},
    }),
    ePaperText(),
  ],
  meta: {},
};

export = definition;
