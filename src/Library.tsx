declare var H5P: any;

H5P = H5P || null;

export default class Library extends (H5P.EventDispatcher as { new(): any}) {
 constructor(config: any, contentId: string, contendData: any = {}) {
     super();
     this.config = config;
     this.contentId = contentId;
 }

}