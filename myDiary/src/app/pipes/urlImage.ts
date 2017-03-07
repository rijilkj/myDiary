import {Pipe, PipeTransform} from '@angular/core'
import {ImageResolver} from 'image-resolver';

@Pipe({
  name: 'urlImage'
})
export class UrlImage implements PipeTransform {
 

  transform(value: string, args: any, imageResolver: ImageResolver) : any {
	var resolver = new imageResolver();
	resolver.register(new imageResolver.FileExtension());
	resolver.register(new imageResolver.MimeType());
	resolver.register(new imageResolver.Opengraph());
	resolver.register(new imageResolver.Webpage());

	resolver.resolve( "http://stackoverflow.com/questions/1232793/javascript-set-img-src", function( result ){ 
	               
	                if ( result ) {
	                    return result.image;            // image.src = "IMAGE URL/PATH"
	                     
	                } else {
	                   return null;
	                }
	               
	    });
     
  
  }
   proxify (request) : string {
        request.url = "http://www.inertie.org/ba-simple-proxy.php?mode=native&url=" + encodeURIComponent( request.url );
        return request;
    }
}