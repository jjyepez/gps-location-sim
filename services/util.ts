import fs from 'fs';

export const loadJSONfile = (jsonFile:string) => {
    const rawContent = fs.readFileSync(jsonFile, {encoding:'utf8'});
    const jsonContent = JSON.parse(rawContent);
    return jsonContent;
}

export const getNewPlate = () => {

}