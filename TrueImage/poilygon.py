import cv2
import numpy as np 
import os 
import compileall
from distutils.dir_util import copy_tree
import shutil
def compileProject(self):
        self.start_copy.setText("")
        self.stop_copy.setText("")
        self.statrt_compile.setText("")
        self.compile_done.setText("")
        self.start_replace.setText("")
        self.replace_done.setText("")

        source_path = self.lineEdit.text()
        project_path = self.project_path.text()

        newdir = os.path.basename(os.path.normpath(project_path))
        path = os.path.join(source_path, newdir)
        os.mkdir(path)

        print("Status: Start copy project in destination path")
        self.start_copy.setText("1. Start copy project in destination path")
        copy_tree(project_path, path)
        print("Status: Copy project in destination path successfully.")
        self.stop_copy.setText("2. Copy project in destination path successfully.")

        
        self.statrt_compile.setText("3. Start project compilation.")
        print("Status: Start project compilation.")
        compileall.compile_dir(path, force=True)
        self.compile_done.setText("4. Project compilation successfully.")
        print("Status: Project compilation successfully.")       
        
        def move_pyc(path):
            for i in os.listdir(path):
                if os.path.isdir(os.path.join(path, i)):
                    move_pyc(os.path.join(path, i))
            if os.path.exists(os.path.join(path, '__pycache__')):
                for name in os.listdir(os.path.join(path, '__pycache__')):
                    if(name[-6:-4] == "36"):
                        os.remove(os.path.join(path, '__pycache__', name))
                    if(name[-6:-4] == "37"):
                        os.remove(os.path.join(path, '__pycache__', name))
                    if(name[-6:-4] == "38"):
                        os.remove(os.path.join(path, '__pycache__', name))                    
                    if(name[-6:-4] == "39"):
                        file_name = name.split('.')[0]+'.py'
                        if os.path.exists(os.path.join(path, file_name)):
                            # Delete py files, be careful
                            os.remove(os.path.join(path, file_name))
                        shutil.move(os.path.join(path, '__pycache__', name), os.path.join(
                            path, name.replace('.cpython-39', '')))

                    if(name[-6:-4] != "39" and name[-6:-4] != "38" and name[-6:-4] != "37" and name[-6:-4] != "36"):
                        os.remove(os.path.join(path, '__pycache__', name))

                del_path = os.path.join(path, '__pycache__')
                os.rmdir(del_path)

        self.start_replace.setText("5. Start replacing .py file to .pyc file.")
        print("Status: Start replacing .py file to .pyc file.")
        move_pyc(path)
        self.replace_done.setText("6. File replacing successfully.")
        print("Status: File replacing successfully.")
image_path = ''
polygon_coords = []
output_filename = 'cropped_image.png'
def crop_image_with_polygon(image_path, polygon_coords, output_filename):
    image = cv2.imread(image_path)
    mask = np.zeros(image.shape[:2], dtype=np.uint8)
    pts = np.array([(point['x'], point['y']) for point in polygon_coords], np.int32)
    cv2.fillPoly(mask, [pts], 255)
    
    cropped_image = cv2.bitwise_and(image, image, mask=mask)
    
    # Apply image dilation to remove black edges
    kernel = np.ones((3, 3), np.uint8)
    dilated_image = cv2.dilate(cropped_image, kernel, iterations=0)
    
    cv2.imwrite(output_filename, dilated_image)
    cv2.imshow("cropped", dilated_image)
    cv2.waitKey(0)
    cv2.destroyAllWindows()



crop_image_with_polygon(image_path, polygon_coords, output_filename)