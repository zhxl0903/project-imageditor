# Image Editor
**Team Member:** Xiao Lei Zhang, Guoqiang Ou, YongTian Chen

### Description of this application:

An image editor application which allows gallery owners of the Web Gallery to edit their uploaded images by applying 2D and 3D effects. The 2D editor is similar to Microsoft Paint. The 3D editor is similar to Microsoft Paint 3D. The application also allows image processing using deep learning models from IBM Watson such as Neural Style Transfer API.

### The key features that will be completed by the Beta version:

Basic gallery functionalities (same as homework):

**Non-authenticated** users can:
- register or login to the application

**Authenticated** users can:
- has permissions same as Web Gallery
- view uploaded images in 2D or 3D editor mode
- gallery owners can edit/save their own images using the editor

For 3D Editor features, **authenticated** user can:
- insert planes, 3D cubes, texts, other shapes, and images into editor
- relocate 3D objects by dragging
- scale, rotate 3D objects
- change color of inserted objects
- add reflection; change opacity
- insert lighting effects
- save 2D images from 3D editor
- add fog effects

### Additional features that will be complete by the Final version:

For 3D Editor features:, **authenticated** user can:
- save 3D images
- load 3D images

For 2D Editor features, **authenticated** users can:
- scale / translate elements on the panel using mouse
- resize an uploaded image
- rotate or flip an uploaded image
- apply filters such as blur, grayscale, etc. to an uploaded image
- insert another image on the pannel
- insert text, lines, circles, shapes, etc. on an uploaded image

For image processing features implemented with IMB Watson Vision Model Apis, 
**authenticated** user can:
-  image colorizer, image super resolution, image neural style transfer

### The technologies will be used:
1. Frontend Framework: **AngularJS**
2. Backend Runtime Environment: **Node.js**
3. Backend Framework: **Express.js**
4. 2D image editing libarary: **snap.svg**
5. 3D image editing libarary: **three.js**
6. Machine Learning APIs: **IBM Watson**

### The top 5 technical challenges:
1. Work with 3D: implement 3D image editor
2. Eliminating security issues
3. Learning numerous libraries/frameworks in a short period time
4. Implementing editor functions involving mouse and keyboard (e.g. resizing, dragging, moving through space)
5. Rewrite Web Gallery Frontend using AngularJS and integrating web applications (2D/3D Image Editors)

### Website
Visit at imageditor.me
