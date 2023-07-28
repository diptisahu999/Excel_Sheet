import compileall
import os

project_folder = '/Users/kalpi/OneDrive/Desktop/ANIL/New folder (6)/New folder/BMS2@16may/'

# Recursively compile all .py files within the project folder
compileall.compile_dir(project_folder, optimize=2, legacy=True)

# Remove the .py files
for root, dirs, files in os.walk(project_folder):
    for file in files:
        if file.endswith('.py'):
            os.remove(os.path.join(root, file))