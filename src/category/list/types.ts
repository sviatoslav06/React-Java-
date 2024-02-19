export interface ICategoryItem{
    id: number;
    name: string;
    image: File|undefined;
    description: string;
}

export interface IUploadFile{
    originFileObj: File;
}