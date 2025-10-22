export interface IFile {
  originalname?: string; // опционально (используется ||)
  url?: string;
  name?: string; // опционально (используется ||)
  buffer: Buffer; // обязательно (передается в writeFile)
}
export interface IMediaResponse {
  url: string; // обязательно (путь к файлу)
  name: string; // обязательно (уникальное имя файла)
}
