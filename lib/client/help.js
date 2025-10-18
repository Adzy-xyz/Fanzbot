import { extractMessageContent } from "baileys";

export const getContentType = (content) => {
   if (content) {
      const keys = Object.keys(content);
      const key = keys.find(k => (k === 'conversation' || k.endsWith('Message') || k.includes('V2') || k.includes('V3')) && k !== 'senderKeyDistributionMessage');
      return key
   }
}
export function parseMessage(content) {
    content = extractMessageContent(content);

    if (content?.viewOnceMessageV2Extension) {
        content = content.viewOnceMessageV2Extension.message;
    }
    if (content?.protocolMessage?.type === 14) {
        content =
            content.protocolMessage[getContentType(content.protocolMessage)];
    }
    if (content?.message) {
        content = content.message[getContentType(content.message)];
    }

    return content;
}