import { google } from "@google-cloud/speech/build/protos/protos";
import * as speech from '@google-cloud/speech';
import * as util from 'util';
import * as json from '../credentials/client.json';

function assert<E>() { return <T extends E>(source: T) => source }
assert<Credentials>()(json)

interface Credentials {
    type: string;
    project_id: string;
    private_key_id: string;
    private_key: string;
    client_email: string;
    client_id: string;
    auth_uri: string;
    token_uri: string;
    auth_provider_x509_cert_url: string;
    client_x509_cert_url: string;
}

export declare namespace $speech {
    export import version = google.cloud.speech.v1p1beta1;
}

type $TranscriptResponse = $speech.version.ILongRunningRecognizeResponse;


export class Speech {

    public static async soundToTextFromContent(content: Uint8Array, config: $speech.version.IRecognitionConfig): Promise<string> {
        const audio: $speech.version.IRecognitionAudio = {
            content,
        };
        const request: $speech.version.IRecognizeRequest = { audio, config };
        const transcription = await Speech.longTranscriptRequest(request)
        return transcription;
    }

    private static async getGoogleSpeechClient(): Promise<speech.v1p1beta1.SpeechClient> {
        const client = new speech.v1p1beta1.SpeechClient({
            credentials: json
        });
        return client;
    }

    private static async longTranscriptRequest(request: $speech.version.ILongRunningRecognizeRequest): Promise<string> {
        return Speech.parseTranscription(
            async client => {
                const [operation] = await client.longRunningRecognize(request);
                const [response] = await operation.promise();
                return response;
            }
        )
    }

    private static async parseTranscription(executeRequest: (client: speech.v1p1beta1.SpeechClient) => Promise<$TranscriptResponse>): Promise<string> {
        const client: speech.v1p1beta1.SpeechClient = await Speech.getGoogleSpeechClient();
        try {
            const response = await executeRequest(client);
            return response.results?.map(item => item?.alternatives?.[0].transcript).filter(item => item).join('') ?? '';
        } catch (err) {
            Speech.log(err);
        }
    }

    public static log(...messages: string[]): void {
        console.log(util.formatWithOptions({ colors: true, depth: null }, ...messages))
    }

}