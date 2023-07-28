# import compileall

# # Specify the path to your .py file
# py_file_path = r'C:\Users\kalpi\OneDrive\Desktop\ANIL\device'

# # Compile the .py file into a .pyc file
# compileall.compile_dir(py_file_path)




from PyQt5 import QtCore, QtGui, QtWidgets
import compileall
import os
import shutil,errno
import time
import py_compile
from distutils.dir_util import copy_tree

class Ui_Dialog(object):
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
        
        # self.project_path.setText("")

    def singlePyCompiler(self):
        file_path = self.single_pycompile.text()        
        py_compile.compile(file_path)
        print("Py file compilation successfully")
        self.single_py_compile_done.setText("1. Py file compilation successfully")
    
    def setupUi(self, Dialog):
        Dialog.setObjectName("Compiler")
        Dialog.resize(519, 457)
        Dialog.setStyleSheet("background-color: rgb(170, 170, 255);")
        self.Compile = QtWidgets.QPushButton(Dialog)
        self.Compile.setGeometry(QtCore.QRect(350, 270, 93, 31))
        self.Compile.setStyleSheet("background-color: rgb(85, 0, 255);\n"
"color: rgb(255, 255, 255);")
        self.Compile.setObjectName("Compile")
        self.Compile.clicked.connect(self.compileProject)
        self.project_path = QtWidgets.QLineEdit(Dialog)
        self.project_path.setGeometry(QtCore.QRect(40, 270, 301, 31))
        self.project_path.setStyleSheet("background-color: rgb(255, 255, 255);")
        self.project_path.setObjectName("project_path")
        self.label = QtWidgets.QLabel(Dialog)
        self.label.setGeometry(QtCore.QRect(120, 10, 381, 51))
        font = QtGui.QFont()
        font.setFamily("Times New Roman")
        font.setPointSize(24)
        font.setBold(True)
        font.setWeight(75)
        self.label.setFont(font)
        self.label.setObjectName("label")
        self.statrt_compile = QtWidgets.QLabel(Dialog)
        self.statrt_compile.setGeometry(QtCore.QRect(40, 350, 411, 16))
        self.statrt_compile.setText("")
        self.statrt_compile.setObjectName("statrt_compile")
        self.compile_done = QtWidgets.QLabel(Dialog)
        self.compile_done.setGeometry(QtCore.QRect(40, 370, 411, 16))
        self.compile_done.setText("")
        self.compile_done.setObjectName("compile_done")
        self.start_replace = QtWidgets.QLabel(Dialog)
        self.start_replace.setGeometry(QtCore.QRect(40, 390, 411, 16))
        self.start_replace.setText("")
        self.start_replace.setObjectName("start_replace")
        self.replace_done = QtWidgets.QLabel(Dialog)
        self.replace_done.setGeometry(QtCore.QRect(40, 410, 821, 16))
        self.replace_done.setText("")
        self.replace_done.setObjectName("replace_done")
        self.label_2 = QtWidgets.QLabel(Dialog)
        self.label_2.setGeometry(QtCore.QRect(40, 250, 301, 20))
        self.label_2.setObjectName("label_2")
        self.label_3 = QtWidgets.QLabel(Dialog)
        self.label_3.setGeometry(QtCore.QRect(40, 90, 301, 16))
        self.label_3.setObjectName("label_3")
        self.single_pycompile = QtWidgets.QLineEdit(Dialog)
        self.single_pycompile.setGeometry(QtCore.QRect(40, 110, 301, 31))
        self.single_pycompile.setStyleSheet("background-color: rgb(255, 255, 255);")
        self.single_pycompile.setObjectName("single_pycompile")
        self.Compile_2 = QtWidgets.QPushButton(Dialog)
        self.Compile_2.setGeometry(QtCore.QRect(350, 110, 93, 31))
        self.Compile_2.setStyleSheet("background-color: rgb(85, 0, 255);\n"
"color: rgb(255, 255, 255);")
        self.Compile_2.setObjectName("Compile_2")
        self.Compile_2.clicked.connect(self.singlePyCompiler)
        self.lineEdit = QtWidgets.QLineEdit(Dialog)
        self.lineEdit.setGeometry(QtCore.QRect(40, 211, 301, 31))
        self.lineEdit.setStyleSheet("background-color: rgb(255, 255, 255);")
        self.lineEdit.setObjectName("lineEdit")
        self.label_4 = QtWidgets.QLabel(Dialog)
        self.label_4.setGeometry(QtCore.QRect(40, 190, 301, 20))
        self.label_4.setObjectName("label_4")
        self.single_py_compile_done = QtWidgets.QLabel(Dialog)
        self.single_py_compile_done.setGeometry(QtCore.QRect(40, 160, 301, 16))
        self.single_py_compile_done.setText("")
        self.single_py_compile_done.setObjectName("single_py_compile_done")
        self.start_copy = QtWidgets.QLabel(Dialog)
        self.start_copy.setGeometry(QtCore.QRect(40, 310, 311, 16))
        self.start_copy.setText("")
        self.start_copy.setObjectName("start_copy")
        self.stop_copy = QtWidgets.QLabel(Dialog)
        self.stop_copy.setGeometry(QtCore.QRect(40, 330, 301, 16))
        self.stop_copy.setText("")
        self.stop_copy.setObjectName("stop_copy")

        self.retranslateUi(Dialog)
        QtCore.QMetaObject.connectSlotsByName(Dialog)

    def retranslateUi(self, Dialog):
        _translate = QtCore.QCoreApplication.translate
        Dialog.setWindowTitle(_translate("Compiler", "Compiler"))
        self.Compile.setText(_translate("Compiler", "Compile"))
        self.project_path.setPlaceholderText(_translate("Dialog", "Enter your source path..."))
        self.label.setText(_translate("Compiler", "Python Compiler"))
        self.label_2.setText(_translate("Compiler", "Source Path"))
        self.label_3.setText(_translate("Compiler", "Compile Single Py File."))
        self.single_pycompile.setPlaceholderText(_translate("Dialog", "Enter File it\'s With Path..."))
        self.Compile_2.setText(_translate("Compiler", "Compile"))
        self.lineEdit.setPlaceholderText(_translate("Dialog", "Enter your destination path..."))
        self.label_4.setText(_translate("Compiler", "Destination path"))


if __name__ == "__main__":
    import sys
    app = QtWidgets.QApplication(sys.argv)
    Dialog = QtWidgets.QDialog()
    ui = Ui_Dialog()
    ui.setupUi(Dialog)
    Dialog.show()
    sys.exit(app.exec_())
