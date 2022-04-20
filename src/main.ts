import { $speech, Speech } from "./speech";
import * as fs from 'fs';
import Aigle from 'aigle';

async function main() {
    const config: $speech.version.IRecognitionConfig = {
        encoding: "MP3",
        languageCode: 'pt-br',
        sampleRateHertz: 44100
    };

    const files = {
        mp3: './samples/input.mp3',
        ogg: './samples/input.ogg',
        flac: './samples/input.flac',
    } as const;


    await Aigle
        .resolve(files)
        .map(testFile)
    ;

    async function testFile(path: string) {
        Speech.log('Testing...', path)
        const content = fs.readFileSync(path);
        const output = await Speech.soundToTextFromContent(
            content,
            config,
        );

        Speech.log(`Output ${path} -->`, output)
    }
}

main()