export class Helpers {
    public generateId = async (model: any) => {
        const length = await model.count({});
        return length + 1;
    }
}
