import fs from 'fs';

export class SaveFile {
    constructor(
        private readonly filePath: string,
        private readonly fileName: string,
        private readonly file: string,
    ) {}

    execute() {
        this.checkStorage();
        this.save();
    }

    private save() {
        fs.writeFileSync(this.filePath + this.fileName, this.file, 'base64');
    }

    private checkStorage() {
        if (!fs.existsSync(this.filePath)) {
            fs.mkdirSync(this.filePath, { recursive: true });
        }
    }
}
